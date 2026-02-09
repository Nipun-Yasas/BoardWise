import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


// ✅ FIXED: Use the working model name
const GEMINI_MODEL =  "gemini-2.5-flash";
//                                                                   ↑ Semicolon OUTSIDE the string
const requestQueue: { timestamp: number; resolve: () => void }[] = [];
const RATE_LIMIT_DELAY = 3000; // 3 seconds between requests

async function rateLimitedAPICall<T>(
  fn: () => Promise<T>,
  retries = 3
): Promise<T> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Wait for rate limit
      await new Promise((resolve) => {
        requestQueue.push({ timestamp: Date.now(), resolve });
        processQueue();
      });

      return await fn();
    } catch (error: any) {
      if (
        (error.message?.includes("429") ||
          error.message?.includes("quota")) &&
        attempt < retries - 1
      ) {
        const backoffDelay = 5000 * Math.pow(2, attempt);
        console.log(`Rate limited. Waiting ${backoffDelay}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        continue;
      }
      throw error;
    }
  }
}
function processQueue() {
  if (requestQueue.length === 0) return;
  
  const now = Date.now();
  const item = requestQueue[0];
  
  if (now - item.timestamp >= RATE_LIMIT_DELAY) {
    requestQueue.shift();
    item.resolve();
    processQueue();
  } else {
    setTimeout(processQueue, RATE_LIMIT_DELAY - (now - item.timestamp));
  }
}

export async function POST(request: Request) {
  await connectDB();

  try {
    const { studentPrompt } = await request.json();

    if (!studentPrompt) {
      return NextResponse.json(
        { error: "Student prompt is required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is missing");
      return NextResponse.json(
        { error: "AI service configuration error" },
        { status: 500 },
      );
    }

    console.log("✅ Using Gemini Model:", GEMINI_MODEL);
    // console.log("📝 Student Prompt:", studentPrompt.substring(0, 100) + "...");

    // Step 1: Extract preferences from student prompt using Gemini
    const extractionModel = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const extractionPrompt = `
You are an expert at extracting student accommodation preferences from Sri Lanka.

Student's Description:
"${studentPrompt}"

Extract and return ONLY a valid JSON object with these fields:
{
  "budget": {
    "min": number or null,
    "max": number or null
  },
  "preferredUniversity": string or null,
  "maxDistance": {
    "value": number or null,
    "unit": "km" or "m" or null
  },
  "roomPreferences": {
    "furnished": boolean or null,
    "ac": boolean or null,
    "attachedBathroom": boolean or null,
    "wifi": boolean or null,
    "parking": boolean or null
  },
  "foodPreferences": {
    "required": boolean or null,
    "vegetarian": boolean or null,
    "mealsIncluded": boolean or null
  },
  "genderPreference": "male" or "female" or "any" or null,
  "securityRequired": boolean or null,
  "keywords": string[]
}

Rules:
- Extract budget ranges if mentioned (e.g., "under 20000" = max: 20000, "between 15000-25000" = min: 15000, max: 25000)
- Identify university names from Sri Lanka (University of Moratuwa, University of Colombo, SLIIT, NSBM, University of Peradeniya, University of Ruhuna, etc.)
- Extract distance preferences and convert to numbers
- Identify amenities: AC, WiFi, furnished, parking, attached bathroom, hot water, etc.
- Detect food requirements (vegetarian, non-veg, meals included)
- Detect gender restrictions (male, female, girls only, boys only)
- Extract all important keywords
- Use null for unmentioned preferences
- Return ONLY valid JSON, no other text or markdown
`;

    let extractionResult;
    try {
      console.log("🔄 Extracting preferences...");
      extractionResult = await rateLimitedAPICall(() =>
        extractionModel.generateContent(extractionPrompt)
      );
      console.log("✅ Preferences extracted successfully");
    } catch (apiError: any) {
      console.error("❌ Gemini API Error:", apiError.message);
      return NextResponse.json(
        { 
          error: "AI service temporarily unavailable",
          details: apiError.message 
        },
        { status: 503 },
      );
    }

    const extractedText = extractionResult.response.text();

    // Clean the response to get valid JSON
    let preferences;
    try {
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        preferences = JSON.parse(jsonMatch[0]);
      } else {
        preferences = JSON.parse(extractedText);
      }
      console.log("✅ Preferences parsed:", JSON.stringify(preferences, null, 2));
    } catch (error) {
      console.error("❌ JSON parsing error:", error);
      console.error("Raw response:", extractedText);
      return NextResponse.json(
        { error: "Failed to parse student preferences" },
        { status: 500 },
      );
    }

    // Step 2: Fetch all available boardings with complete data
    console.log("🔄 Fetching boardings from database...");
    const boardings = await Boarding.find({ isAvailable: true }).lean();
    console.log(`✅ Found ${boardings.length} available boardings`);

    const enrichedBoardings = await Promise.all(
      boardings.map(async (boarding) => {
        const rooms = await Room.find({
          boardingId: boarding._id,
          isAvailable: true,
        })
          .populate("tenants", "name")
          .lean();

        const roomsWithDetails = await Promise.all(
          rooms.map(async (room) => {
            const bills = await BillType.find({ roomId: room._id }).lean();
            const totalBills = bills.reduce(
              (sum, bill) => sum + (bill.amount || 0),
              0,
            );

            return {
              id: room._id.toString(),
              name: room.name,
              capacity: room.capacity,
              price: room.price,
              description: room.description,
              images: room.images || [],
              isAvailable: room.isAvailable,
              currentOccupancy: room.tenants?.length || 0,
              availableSpots: room.capacity - (room.tenants?.length || 0),
              billTypes: bills.map((b) => ({
                name: b.name,
                amount: b.amount || 0,
              })),
              totalMonthlyCost: room.price + totalBills,
            };
          }),
        );

        return {
          id: boarding._id.toString(),
          name: boarding.name,
          description: boarding.description,
          mainImage: boarding.mainImage,
          totalRooms: boarding.totalRooms,
          nearestUniversity: boarding.nearestUniversity || "Not specified",
          distanceFromUniversity: boarding.distanceFromUniversity || 0,
          distanceUnit: boarding.distanceUnit || "km",
          address: boarding.address || "",
          city: boarding.city || "",
          rooms: roomsWithDetails,
        };
      }),
    );

    console.log(`✅ Enriched ${enrichedBoardings.length} boardings with room details`);

    // Step 3: Use Gemini to intelligently match and rank boardings
    const recommendationModel = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const recommendationPrompt = `
You are an expert boarding recommendation system for students in Sri Lanka.

STUDENT PREFERENCES EXTRACTED:
${JSON.stringify(preferences, null, 2)}

AVAILABLE BOARDINGS:
${JSON.stringify(enrichedBoardings, null, 2)}

TASK:
Analyze each boarding and rank the TOP 5 best matches based on:

SCORING CRITERIA (Total 100 points):
1. Budget Match (25 points):
   - Perfect fit within budget: 25
   - Slightly over budget (10-15%): 15-20
   - Way over budget: 0-10

2. Distance Match (20 points):
   - Very close to university: 20
   - Within acceptable range: 10-15
   - Far from university: 0-5

3. Amenities Match (25 points):
   - All required amenities present: 25
   - Most amenities present: 15-20
   - Few amenities: 5-10

4. Availability (15 points):
   - Multiple rooms available: 15
   - Limited availability: 8-12
   - Almost full: 0-5

5. Value for Money (15 points):
   - Excellent facilities for price: 15
   - Good value: 8-12
   - Overpriced: 0-5

MATCHING RULES:
- If budget specified, prioritize boardings within budget
- Match university preferences strictly (use nearestUniversity field)
- Convert all distances to same unit for comparison (prefer km)
- Gender restrictions are mandatory (if boarding specifies in description)
- Food preferences are important but not mandatory
- Extract amenities from descriptions intelligently
- Consider room descriptions for hidden features
- Calculate total monthly cost (rent + bills)
- Prefer boardings with available spots
- Look for keywords in descriptions that match student preferences

Return ONLY valid JSON (no markdown, no extra text, no code blocks):
{
  "extractedPreferences": {
    "summary": "Brief summary of what student is looking for",
    "criticalRequirements": ["requirement1", "requirement2"]
  },
  "recommendations": [
    {
      "boardingId": "string",
      "boardingName": "string",
      "matchScore": number (0-100),
      "rank": number (1-5),
      "bestRoom": {
        "roomId": "string",
        "roomName": "string",
        "price": number,
        "totalMonthlyCost": number,
        "availableSpots": number
      },
      "matchReasoning": {
        "budgetMatch": "Explanation",
        "distanceMatch": "Explanation with actual distance",
        "amenitiesMatch": "Explanation of what amenities match",
        "valueProposition": "Explanation of value"
      },
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "keyHighlights": ["highlight1", "highlight2"],
      "recommendation": "Short persuasive summary why this is recommended"
    }
  ],
  "alternativeSuggestions": "If no perfect matches, suggest what to compromise on or look for"
}
`;

    let recommendationResult;
    try {
      console.log("🔄 Generating recommendations...");
      recommendationResult = await recommendationModel.generateContent(recommendationPrompt);
      console.log("✅ Recommendations generated successfully");
    } catch (apiError: any) {
      console.error("❌ Recommendation API Error:", apiError.message);
      return NextResponse.json(
        { 
          error: "Failed to generate recommendations",
          details: apiError.message 
        },
        { status: 503 },
      );
    }

    const recommendationText = recommendationResult.response.text();

    // Parse the recommendation response
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const cleanedText = recommendationText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();

      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        recommendations = JSON.parse(cleanedText);
      }
      console.log("✅ Recommendations parsed successfully");
    } catch (error) {
      console.error("❌ Recommendation parsing error:", error);
      console.error("Raw response:", recommendationText.substring(0, 500));
      return NextResponse.json(
        { error: "Failed to parse recommendations" },
        { status: 500 },
      );
    }

    // Return the complete recommendation package
    console.log("✅ Returning recommendations to client");
    return NextResponse.json(
      {
        success: true,
        studentPreferences: preferences,
        totalBoardingsAnalyzed: enrichedBoardings.length,
        recommendations: recommendations.recommendations || [],
        extractedPreferences: recommendations.extractedPreferences,
        alternativeSuggestions: recommendations.alternativeSuggestions,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Recommendation system error:", error);
    return NextResponse.json(
      {
        error: "Failed to process recommendation request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
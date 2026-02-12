import connectDB from "@/lib/db";
import BillType from "@/models/BillType";
import Boarding from "@/models/Boarding";
import Room from "@/models/Room";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const GEMINI_MODEL = "gemini-2.5-flash";
const requestQueue: { timestamp: number; resolve: () => void }[] = [];
const RATE_LIMIT_DELAY = 3000; // 3 seconds between requests

async function rateLimitedAPICall<T>(
  fn: () => Promise<T>,
  retries = 3,
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
        (error.message?.includes("429") || error.message?.includes("quota")) &&
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
        extractionModel.generateContent(extractionPrompt),
      );
      console.log("✅ Preferences extracted successfully");
    } catch (apiError: any) {
      console.error("❌ Gemini API Error:", apiError.message);
      return NextResponse.json(
        {
          error: "AI service temporarily unavailable",
          details: apiError.message,
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
      console.log(
        "✅ Preferences parsed:",
        JSON.stringify(preferences, null, 2),
      );
    } catch (error) {
      console.error("❌ JSON parsing error:", error);
      console.error("Raw response:", extractedText);
      return NextResponse.json(
        { error: "Failed to parse student preferences" },
        { status: 500 },
      );
    }

    // Step 2: Fetch and Filter Boardings
    console.log("🔄 Fetching boardings from database...");

    let query: any = { isAvailable: true };

    // Optimize 1: Filter by university if detected
    if (preferences.preferredUniversity) {
      try {
        // Simple regex to match university name
        query.nearestUniversity = {
          $regex: new RegExp(
            preferences.preferredUniversity.split(" ").join(".*"),
            "i",
          ),
        };
        console.log(
          `🔎 Filtering by university match: ${preferences.preferredUniversity}`,
        );
      } catch (e) {
        console.warn("Regex failed, falling back to all boardings");
      }
    }

    // Optimize 2: Limit number of candidates to process
    // Fetch slightly more than needed to allow for some post-filtering if necessary
    const boardings = await Boarding.find(query).limit(15).lean();
    console.log(`✅ Found ${boardings.length} candidates`);

    // If no boardings found with filter, fallback to all (limited)
    let finalBoardings = boardings;
    if (boardings.length === 0 && preferences.preferredUniversity) {
      console.log(
        "⚠️ No matches for university, falling back to all boardings",
      );
      finalBoardings = await Boarding.find({ isAvailable: true })
        .limit(10)
        .lean();
    }

    const enrichedBoardings = await Promise.all(
      finalBoardings.map(async (boarding) => {
        const rooms = await Room.find({
          boardingId: boarding._id,
          isAvailable: true,
        }).lean();

        // Calculate simplified room details
        const roomsSummary = await Promise.all(
          rooms.map(async (room) => {
            const bills = await BillType.find({ roomId: room._id }).lean();
            const totalBills = bills.reduce(
              (sum, bill) => sum + (bill.amount || 0),
              0,
            );

            return {
              id: room._id.toString(),
              type: room.name, // Renamed from name to type for clarity/brevity
              capacity: room.capacity,
              price: room.price,
              spots: room.capacity - (room.tenants?.length || 0), // Renamed availableSpots
              total: room.price + totalBills, // Renamed totalMonthlyCost
              // Exclude description, images, tenants, detailed bills
            };
          }),
        );

        // Filter out full rooms
        const availableRooms = roomsSummary.filter((r) => r.spots > 0);

        if (availableRooms.length === 0) return null;

        // Optimization 3: Minify Data for Gemini
        // We only send what's strictly necessary for decision making
        return {
          id: boarding._id.toString(),
          name: boarding.name,
          uni: boarding.nearestUniversity, // Renamed
          dist: `${boarding.distanceFromUniversity} ${boarding.distanceUnit}`, // Combined
          city: boarding.city,
          // addr: boarding.address, // Exclude address, usually not needed for decision
          rooms: availableRooms,
          // We include a truncated description to capture amenities
          desc: boarding.description?.substring(0, 200) || "",
        };
      }),
    );

    // Remove nulls (boardings with no available rooms)
    const validBoardings = enrichedBoardings.filter(Boolean);
    console.log(
      `✅ Prepared ${validBoardings.length} minified candidates for AI`,
    );

    // Step 3: Use Gemini to intelligently match and rank boardings
    const recommendationModel = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    });

    const recommendationPrompt = `
You are an expert boarding recommendation system.

STUDENT NEEDS:
${JSON.stringify(
  {
    budget: preferences.budget,
    uni: preferences.preferredUniversity,
    dist: preferences.maxDistance,
    room: preferences.roomPreferences,
    food: preferences.foodPreferences,
    gender: preferences.genderPreference,
    keywords: preferences.keywords,
  },
  null,
  0,
)}

CANDIDATES:
${JSON.stringify(validBoardings, null, 0)}

TASK:
Rank TOP 5 matches. Return JSON:
{
  "extractedPreferences": {
    "summary": "One sentence summary",
    "criticalRequirements": ["req1", "req2"]
  },
  "recommendations": [
    {
      "boardingId": "id",
      "boardingName": "name",
      "matchScore": number (0-100),
      "bestRoom": {
        "roomId": "id",
        "roomName": "name",
        "price": number,
        "totalMonthlyCost": number
      },
      "matchReasoning": {
        "budgetMatch": "Brief explanation",
        "distanceMatch": "Brief explanation",
        "amenitiesMatch": "Brief explanation",
        "valueProposition": "Brief explanation"
      }
    }
  ],
  "alternativeSuggestions": "Brief suggestion if no good matches"
}
`;

    let recommendationResult;
    try {
      console.log("🔄 Generating recommendations...");
      recommendationResult =
        await recommendationModel.generateContent(recommendationPrompt);
      console.log("✅ Recommendations generated successfully");
    } catch (apiError: any) {
      console.error("❌ Recommendation API Error:", apiError.message);
      return NextResponse.json(
        {
          error: "Failed to generate recommendations",
          details: apiError.message,
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
        totalBoardingsAnalyzed: validBoardings.length,
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

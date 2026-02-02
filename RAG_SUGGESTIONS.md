# 🤖 RAG System Implementation Suggestions for BoardWise

## 📋 Table of Contents
1. [What is RAG?](#what-is-rag)
2. [Why RAG for BoardWise?](#why-rag-for-boardwise)
3. [Suggested RAG Functionalities](#suggested-rag-functionalities)
4. [Architecture & Implementation](#architecture--implementation)
5. [Technology Stack Recommendations](#technology-stack-recommendations)
6. [Integration Points](#integration-points)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Benefits & Considerations](#benefits--considerations)

---

## 🎯 What is RAG?

**RAG (Retrieval-Augmented Generation)** is an AI architecture that combines:
- **Retrieval**: Fetching relevant information from a knowledge base/database
- **Augmentation**: Enriching prompts with retrieved context
- **Generation**: Using LLMs to generate contextual, accurate responses

Instead of relying solely on an LLM's training data, RAG retrieves real-time, domain-specific information from your database to provide accurate, up-to-date responses.

---

## 💡 Why RAG for BoardWise?

BoardWise is a perfect candidate for RAG implementation because:

1. **Rich Domain-Specific Data**: Property listings, reviews, pricing, amenities, locations
2. **Complex User Queries**: Students need personalized recommendations based on multiple criteria
3. **Dynamic Content**: Listings, prices, and availability change frequently
4. **Natural Language Search**: Users often search conversationally ("Find me a cheap place near UOM with WiFi")
5. **Contextual Recommendations**: RAG can understand user preferences and history

---

## 🚀 Suggested RAG Functionalities

### 1. **Intelligent Conversational Search** 🔍

**Current State**: Basic filter-based search (university, price, distance, persons)

**With RAG**:
- **Natural Language Queries**: 
  - "Find me a boarding place near University of Moratuwa under 20,000 LKR with WiFi and parking"
  - "I need a quiet place for studying with good internet, close to UOC"
  - "Show me places similar to the one I stayed at last semester"

- **Contextual Understanding**:
  - Understand synonyms: "cheap" → low price, "close" → short distance
  - Handle ambiguity: "near campus" → retrieves university from user profile
  - Multi-criteria reasoning: Balance price, distance, amenities, reviews

**Implementation**:
```typescript
// API Endpoint: /api/rag/search
POST /api/rag/search
{
  "query": "affordable boarding near UOM with WiFi",
  "userId": "student123",
  "conversationHistory": []
}

Response:
{
  "results": [...boarding places...],
  "explanation": "Found 5 places within 2km of UOM, price range 15,000-18,000 LKR, all with WiFi",
  "followUpQuestions": ["Would you like to filter by room capacity?", "Any preference for food included?"]
}
```

---

### 2. **AI-Powered Chatbot Assistant** 💬

**Use Cases**:

**For Students**:
- "What's included in the rent at Green View Boarding?"
- "How far is Sunrise Inn from SLIIT?"
- "What do other students say about the food quality at Colombo Boarding?"
- "Help me compare these 3 places"
- "What's the check-in process?"
- "Can I bring pets?"

**For Owners**:
- "How can I improve my listing's visibility?"
- "What amenities do students look for most?"
- "How should I price my property compared to competitors?"
- "How do I handle billing disputes?"

**Implementation**:
```typescript
// Chat widget component
<RAGChatbot 
  context="student-search" 
  userId={currentUser.id}
  preferredLanguage="en"
/>
```

**Features**:
- Persistent conversation history
- Context-aware responses using user profile & browsing history
- Multi-turn conversations with memory
- Fallback to human support when needed

---

### 3. **Smart Recommendation Engine** 🎯

**Current State**: Manual browsing through listings

**With RAG**:

**Personalized Recommendations**:
- Analyze user profile (university, budget, preferences)
- Learn from browsing history & saved listings
- Consider review patterns from similar students
- Seasonal/time-based suggestions (exam season → quiet places)

**Example Scenarios**:
```
Input: Student profile
- University: UOM
- Budget: 15,000-20,000 LKR
- Previously viewed: Places with WiFi, near bus routes
- Reviews liked: "Quiet environment", "Helpful owner"

Output: Top 5 personalized recommendations with explanations
1. "Ocean View Boarding - Matches your budget (18,000 LKR), 1.5km from UOM, 
    excellent WiFi according to reviews, owner praised for responsiveness"
```

**API Design**:
```typescript
GET /api/rag/recommendations?userId=student123&limit=5

Response:
{
  "recommendations": [
    {
      "boarding": {...},
      "matchScore": 0.92,
      "reasoning": "Strong match based on location preference and budget",
      "highlights": ["WiFi", "Near campus", "Positive reviews"]
    }
  ]
}
```

---

### 4. **Intelligent Q&A System** ❓

**Knowledge Base Sources**:
- Property descriptions & amenities
- Owner-provided FAQs
- Student reviews & ratings
- Historical Q&A data
- University proximity information
- Local area information (shops, transportation)

**Example Queries**:
- "Is parking available at Sunshine Boarding?"
- "Do any places near USJ allow cooking?"
- "Which boarding places have the best security ratings?"
- "What's the average electricity bill at Green Meadows?"

**Advanced Features**:
- **Source Attribution**: "According to 15 reviews, WiFi speed is excellent"
- **Confidence Scores**: Show certainty level for answers
- **Multi-Document Reasoning**: Compare across multiple listings

---

### 5. **Review Summarization & Sentiment Analysis** ⭐

**Current State**: Students read through all reviews manually

**With RAG**:

**Automated Summaries**:
```
Overall Sentiment: ⭐⭐⭐⭐ (4.2/5) - Highly Positive

Key Highlights:
✅ Excellent WiFi speed (mentioned in 23/30 reviews)
✅ Clean and well-maintained (18/30 reviews)
✅ Responsive and helpful owner (25/30 reviews)

Common Concerns:
⚠️ Noisy on weekends (5/30 reviews)
⚠️ Limited parking (3/30 reviews)

Student Verdict: "Great for serious students who need good internet 
and a clean environment. Consider if noise sensitivity is a concern."
```

**Aspect-Based Sentiment**:
- Cleanliness: 4.5/5
- WiFi Quality: 4.8/5
- Owner Responsiveness: 4.7/5
- Food Quality: 3.9/5
- Location: 4.3/5

---

### 6. **Dynamic Pricing Insights** 💰

**For Owners**:
- "What should I charge for a 2-person room near UOC?"
- RAG analyzes: Location, amenities, competition, demand, reviews
- Suggests: "Based on 12 similar properties, optimal range is 18,000-22,000 LKR"

**For Students**:
- "Is 25,000 LKR a good price for this place?"
- RAG compares: Similar properties, location, amenities
- Response: "This is 15% above average for similar places in this area"

---

### 7. **Contextual Help & Documentation** 📚

**Smart Help System**:
- Context-aware help based on current page
- "How do I book a place?" → Shows booking flow with video
- "What payment methods are accepted?" → Lists options with screenshots
- "How do I report an issue?" → Guides through dispute resolution

**Owner Onboarding**:
- "How do I create an effective listing?"
- "What photos should I upload?"
- "How do I set up billing?"
- RAG provides step-by-step guidance with examples from successful listings

---

### 8. **Complaint & Support Ticket Analysis** 🎫

**For Admins/Support Team**:
- Automatically categorize support tickets
- Suggest solutions based on historical resolutions
- Identify patterns in complaints
- "3 recent complaints about noise at Property X → Alert owner"

**Auto-Response System**:
- Common queries get instant RAG-generated responses
- Complex issues escalated to human support with context summary

---

### 9. **Property Comparison Assistant** ⚖️

**Interactive Comparison**:
```
User: "Compare Property A and Property B"

RAG Response:
┌─────────────────────┬──────────────┬──────────────┐
│ Feature             │ Property A   │ Property B   │
├─────────────────────┼──────────────┼──────────────┤
│ Price               │ 18,000 LKR   │ 20,000 LKR   │
│ Distance from UOM   │ 1.2 km       │ 0.8 km       │
│ WiFi Speed          │ 50 Mbps      │ 100 Mbps     │
│ Student Rating      │ 4.2/5        │ 4.5/5        │
│ Cleanliness Rating  │ 4.0/5        │ 4.8/5        │
└─────────────────────┴──────────────┴──────────────┘

Recommendation: Property B is better value despite higher price due to 
proximity, faster WiFi, and significantly higher cleanliness ratings.
```

---

### 10. **Predictive Analytics & Insights** 📊

**For Owners**:
- "When is the best time to list my property?"
- "Which amenities should I add to attract more students?"
- "How can I improve my occupancy rate?"

**For Platform Admins**:
- Predict demand trends by university & season
- Identify underserved areas
- Forecast revenue and growth
- Detect fraudulent listings

---

## 🏗️ Architecture & Implementation

### Recommended RAG Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│  (Chat Widget, Search Bar, Recommendation Cards)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS API ROUTES                         │
│          /api/rag/chat  /api/rag/search                     │
│          /api/rag/recommend  /api/rag/analyze               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    RAG ORCHESTRATION LAYER                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Query Processing → Retrieval → Augmentation →      │   │
│  │  LLM Generation → Post-Processing                   │   │
│  └─────────────────────────────────────────────────────┘   │
└────┬──────────────────────┬────────────────────┬────────────┘
     │                      │                    │
     ▼                      ▼                    ▼
┌──────────┐      ┌──────────────────┐    ┌─────────────┐
│ VECTOR   │      │   MONGODB        │    │  LLM API    │
│ DATABASE │      │  (Structured     │    │  (OpenAI/   │
│ (Pinecone│      │   Data)          │    │   Anthropic/│
│  /Weaviate)      │  - Users         │    │   Local)    │
│          │      │  - Listings      │    │             │
│ Embeddings│      │  - Reviews       │    └─────────────┘
│ - Listings│      │  - Bookings      │
│ - Reviews │      └──────────────────┘
│ - FAQs    │
│ - Docs    │
└───────────┘
```

### Data Flow

1. **Indexing Phase** (Offline):
   ```
   Boarding Data → Text Chunking → Embedding Generation → Vector DB Storage
   Reviews → Preprocessing → Embedding → Vector DB
   FAQs/Docs → Parsing → Embedding → Vector DB
   ```

2. **Query Phase** (Real-time):
   ```
   User Query → Query Embedding → Vector Search → 
   Top-K Retrieved Documents → Context Assembly → 
   LLM Prompt Construction → LLM Response → Post-processing → User
   ```

---

## 🛠️ Technology Stack Recommendations

### 1. **Vector Database** (Choose One)

**Option A: Pinecone** ⭐ Recommended
- ✅ Fully managed, serverless
- ✅ Excellent performance & scalability
- ✅ Simple API, great documentation
- ✅ Generous free tier (100K vectors)
- ⚠️ Paid plans required for production scale

```typescript
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index('boardwise-listings');
```

**Option B: Weaviate**
- ✅ Open-source, self-hosted option
- ✅ Built-in vectorization
- ✅ GraphQL API
- ⚠️ Requires infrastructure management

**Option C: MongoDB Atlas Vector Search**
- ✅ Already using MongoDB - no new database
- ✅ Unified data & vector storage
- ✅ Cost-effective
- ⚠️ Less mature than specialized vector DBs

---

### 2. **Embedding Models**

**Option A: OpenAI Embeddings** ⭐ Recommended
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small", // Cost-effective
  input: propertyDescription,
});
```
- Model: `text-embedding-3-small` (1536 dimensions, $0.02/1M tokens)
- Quality: Excellent semantic understanding
- Cost: Very affordable

**Option B: Local Models (Sentence Transformers)**
```typescript
import { pipeline } from '@xenova/transformers';

const embedder = await pipeline('feature-extraction', 
  'Xenova/all-MiniLM-L6-v2'
);
```
- ✅ Free, no API costs
- ✅ Privacy - data stays on your server
- ⚠️ Requires compute resources

---

### 3. **Large Language Models (LLMs)**

**Option A: OpenAI GPT-4o** ⭐ Recommended for Production
```typescript
const completion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery }
  ],
  temperature: 0.7,
  max_tokens: 500,
});
```
- **Best for**: High-quality, nuanced responses
- **Cost**: $2.50/1M input tokens, $10/1M output tokens
- **Response Time**: 1-3 seconds

**Option B: OpenAI GPT-4o-mini** ⭐ Recommended for Development
- **Best for**: Cost-effective solution, fast responses
- **Cost**: $0.15/1M input tokens, $0.60/1M output tokens (15x cheaper)
- **Quality**: Very good for most use cases

**Option C: Anthropic Claude 3.5 Sonnet**
```typescript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const message = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: userQuery }],
});
```
- **Best for**: Complex reasoning, longer context windows
- **Cost**: $3/1M input tokens, $15/1M output tokens
- **Advantage**: 200K token context window

**Option D: Local LLMs (Ollama)**
```typescript
import { Ollama } from 'ollama';

const ollama = new Ollama({ host: 'http://localhost:11434' });
const response = await ollama.chat({
  model: 'llama3.1',
  messages: [{ role: 'user', content: userQuery }],
});
```
- ✅ Free, no API costs
- ✅ Complete data privacy
- ⚠️ Requires GPU (RTX 3090/4090 recommended)
- ⚠️ Self-hosting complexity

---

### 4. **RAG Frameworks**

**Option A: LangChain** ⭐ Recommended
```bash
npm install langchain @langchain/openai @langchain/pinecone
```

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { RetrievalQAChain } from "langchain/chains";

const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  { pineconeIndex: index, namespace: "boardwise" }
);

const chain = RetrievalQAChain.fromLLM(
  new ChatOpenAI({ model: "gpt-4o-mini" }),
  vectorStore.asRetriever(5)
);

const response = await chain.call({ query: userQuery });
```

**Pros**:
- ✅ Comprehensive ecosystem
- ✅ Pre-built chains for common patterns
- ✅ Excellent documentation
- ✅ Active community

**Option B: LlamaIndex**
```typescript
import { VectorStoreIndex, OpenAI } from "llamaindex";

const index = await VectorStoreIndex.fromDocuments(documents);
const queryEngine = index.asQueryEngine();
const response = await queryEngine.query(userQuery);
```

**Pros**:
- ✅ Simpler API than LangChain
- ✅ Great for data indexing
- ✅ Built-in data connectors

---

### 5. **Additional Libraries**

```json
{
  "dependencies": {
    "langchain": "^0.3.0",
    "@langchain/openai": "^0.3.0",
    "@langchain/pinecone": "^0.1.0",
    "@pinecone-database/pinecone": "^4.0.0",
    "openai": "^4.71.1",
    "pdf-parse": "^1.1.1",
    "mammoth": "^1.8.0",
    "zod": "^3.24.1"
  }
}
```

---

## 🔌 Integration Points

### 1. **Search Page Enhancement**
```typescript
// app/(students)/student-dashboard/page.tsx

import RAGSearch from "@/components/rag/RAGSearch";

export default function StudentDashboard() {
  return (
    <div>
      <RAGSearch 
        placeholder="Ask anything: 'Find affordable boarding near UOM with WiFi'"
        onResultsChange={handleResults}
      />
      {/* Existing filter components */}
    </div>
  );
}
```

### 2. **Chat Widget (Global)**
```typescript
// app/layout.tsx

import RAGChatWidget from "@/components/rag/RAGChatWidget";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <RAGChatWidget position="bottom-right" />
      </body>
    </html>
  );
}
```

### 3. **Property Detail Page**
```typescript
// app/(students)/boarding/[id]/page.tsx

import RAGQnA from "@/components/rag/RAGQnA";
import ReviewSummary from "@/components/rag/ReviewSummary";

export default function BoardingDetail({ params }) {
  return (
    <div>
      {/* Property details */}
      <ReviewSummary boardingId={params.id} />
      <RAGQnA context={`boarding_${params.id}`} />
    </div>
  );
}
```

### 4. **Owner Dashboard**
```typescript
// app/(owner)/owner-dashboard/page.tsx

import PricingInsights from "@/components/rag/PricingInsights";
import ListingOptimizer from "@/components/rag/ListingOptimizer";

export default function OwnerDashboard() {
  return (
    <div>
      <PricingInsights propertyId={currentProperty.id} />
      <ListingOptimizer listing={currentListing} />
    </div>
  );
}
```

---

## 📅 Implementation Roadmap

### Phase 1: Foundation (2-3 weeks) 🟢

**Week 1: Setup & Data Preparation**
- [ ] Set up vector database (Pinecone/MongoDB Atlas)
- [ ] Install RAG dependencies (LangChain, OpenAI)
- [ ] Create data ingestion pipeline
- [ ] Generate embeddings for existing listings
- [ ] Set up environment variables & API keys

**Week 2: Basic RAG Pipeline**
- [ ] Implement basic retrieval system
- [ ] Create prompt templates
- [ ] Build simple Q&A endpoint (`/api/rag/ask`)
- [ ] Test with sample queries
- [ ] Implement error handling & fallbacks

**Week 3: First Feature - Smart Search**
- [ ] Enhance search with natural language
- [ ] Add RAG-powered search UI component
- [ ] Integrate with existing search page
- [ ] User testing & refinement

**Deliverables**: Working natural language search

---

### Phase 2: Core Features (3-4 weeks) 🟡

**Week 4-5: Chatbot Assistant**
- [ ] Build conversational interface
- [ ] Implement conversation memory
- [ ] Add chat history storage (MongoDB)
- [ ] Create floating chat widget
- [ ] Multi-turn conversation support

**Week 6: Recommendations**
- [ ] Build recommendation engine
- [ ] User profile analysis
- [ ] Collaborative filtering integration
- [ ] Personalized suggestions API
- [ ] Recommendation cards UI

**Week 7: Review Analysis**
- [ ] Sentiment analysis pipeline
- [ ] Review summarization
- [ ] Aspect-based sentiment extraction
- [ ] Summary display components

**Deliverables**: Chatbot, recommendations, review summaries

---

### Phase 3: Advanced Features (3-4 weeks) 🟠

**Week 8: Comparison & Insights**
- [ ] Property comparison tool
- [ ] Pricing insights for owners
- [ ] Competitive analysis
- [ ] Visual comparison UI

**Week 9: Help & Documentation**
- [ ] Context-aware help system
- [ ] Interactive onboarding
- [ ] FAQ automation
- [ ] Video/tutorial suggestions

**Week 10-11: Testing & Optimization**
- [ ] Performance optimization
- [ ] Cost monitoring & optimization
- [ ] A/B testing different prompts
- [ ] User feedback collection
- [ ] Bug fixes & refinements

**Deliverables**: Full RAG feature suite

---

### Phase 4: Production & Scale (2 weeks) 🔴

**Week 12: Production Readiness**
- [ ] Caching layer (Redis)
- [ ] Rate limiting
- [ ] Monitoring & logging (DataDog/Sentry)
- [ ] Cost tracking dashboard
- [ ] Security audit

**Week 13: Launch & Monitor**
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Real-user monitoring
- [ ] Performance metrics
- [ ] User satisfaction surveys
- [ ] Iterative improvements

**Deliverables**: Production-ready RAG system

---

## 📈 Benefits & Considerations

### Benefits ✅

1. **Enhanced User Experience**
   - Natural, conversational interactions
   - Faster property discovery
   - Personalized recommendations
   - 24/7 instant support

2. **Competitive Advantage**
   - Differentiation from competitors
   - Modern, AI-powered platform
   - Better student retention
   - Higher conversion rates

3. **Operational Efficiency**
   - Reduced support workload (auto-responses)
   - Better data insights
   - Automated content analysis
   - Scalable assistance

4. **Data-Driven Insights**
   - Understand user behavior
   - Identify trends & patterns
   - Optimize listings
   - Improve platform continuously

5. **Monetization Opportunities**
   - Premium AI features for owners
   - Featured listings via AI recommendations
   - Market insights subscription
   - White-label RAG solutions

---

### Considerations & Challenges ⚠️

#### 1. **Cost Management**
- **API Costs**: OpenAI/Anthropic charges per token
  - Estimate: $100-500/month for 10K users
  - Mitigation: Use caching, cheaper models (GPT-4o-mini), rate limiting
- **Vector DB**: Pinecone paid plans for scale
  - Mitigation: MongoDB Atlas Vector Search (free tier generous)

#### 2. **Latency**
- RAG adds 1-3 seconds to responses
  - Mitigation: Streaming responses, skeleton loading, async processing

#### 3. **Data Quality**
- RAG quality depends on input data quality
  - Mitigation: Data validation, cleaning pipelines, regular audits

#### 4. **Hallucinations**
- LLMs may generate incorrect information
  - Mitigation: 
    - Strict prompt engineering
    - Source attribution
    - Confidence scores
    - Human review for critical responses

#### 5. **Privacy & Security**
- User data sent to third-party APIs
  - Mitigation: 
    - Data anonymization
    - Local LLMs for sensitive data
    - Clear privacy policy
    - GDPR compliance

#### 6. **Maintenance**
- Prompt engineering requires iteration
  - Mitigation: Version control prompts, A/B testing, user feedback loops

---

## 🎯 Quick Start: Minimal Viable RAG (MVR)

### Goal: Ship First RAG Feature in 1 Week

**Scope**: Natural Language Search

```bash
# 1. Install dependencies
npm install langchain @langchain/openai @pinecone-database/pinecone

# 2. Set environment variables
# .env.local
OPENAI_API_KEY=sk-...
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=boardwise-search
```

**3. Create RAG Service**
```typescript
// lib/rag/search.ts
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";

export async function ragSearch(query: string, userId?: string) {
  const pinecone = new Pinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
  
  const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
  });
  
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });
  
  const relevantDocs = await vectorStore.similaritySearch(query, 5);
  
  const llm = new ChatOpenAI({ 
    model: "gpt-4o-mini",
    temperature: 0.7 
  });
  
  const prompt = `Based on these boarding listings:
${relevantDocs.map(doc => doc.pageContent).join('\n\n')}

Answer this query: ${query}

Provide a helpful response with specific recommendations.`;
  
  const response = await llm.invoke(prompt);
  
  return {
    answer: response.content,
    sources: relevantDocs,
  };
}
```

**4. Create API Endpoint**
```typescript
// app/api/rag/search/route.ts
import { ragSearch } from "@/lib/rag/search";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query, userId } = await req.json();
    const result = await ragSearch(query, userId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
```

**5. Add UI Component**
```typescript
// app/_components/rag/RAGSearchBar.tsx
"use client";
import { useState } from "react";

export default function RAGSearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch("/api/rag/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask anything about boarding places..."
        className="w-full p-4 border rounded-lg"
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      {result && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p>{result.answer}</p>
        </div>
      )}
    </div>
  );
}
```

**6. Data Ingestion Script**
```typescript
// scripts/ingest-data.ts
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import connectDB from "@/lib/db";
import Boarding from "@/models/Boarding"; // Assume this model exists

async function ingestData() {
  await connectDB();
  
  const boardings = await Boarding.find({});
  
  const documents = boardings.map(b => ({
    pageContent: `${b.name} - ${b.description}. Located ${b.distance}km from ${b.university}. 
    Price: ${b.price} LKR. Amenities: ${b.amenities.join(", ")}. 
    Rating: ${b.rating}/5 from ${b.reviews.length} reviews.`,
    metadata: {
      id: b._id.toString(),
      name: b.name,
      price: b.price,
      university: b.university,
    }
  }));
  
  const pinecone = new Pinecone();
  const index = pinecone.Index(process.env.PINECONE_INDEX_NAME!);
  
  const embeddings = new OpenAIEmbeddings();
  
  await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeIndex: index,
  });
  
  console.log(`✅ Ingested ${documents.length} boarding listings`);
}

ingestData();
```

---

## 📚 Resources & Further Reading

### Documentation
- [LangChain Docs](https://js.langchain.com/docs/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Pinecone Quickstart](https://docs.pinecone.io/docs/quickstart)
- [RAG Best Practices](https://www.pinecone.io/learn/retrieval-augmented-generation/)

### Tutorials
- [Building Production-Ready RAG Applications](https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/)
- [LangChain RAG Tutorial](https://js.langchain.com/docs/use_cases/question_answering/)

### Cost Calculators
- [OpenAI Pricing Calculator](https://openai.com/pricing)
- [Pinecone Pricing](https://www.pinecone.io/pricing/)

---

## 🤝 Next Steps

1. **Review & Discuss**: Share this document with your team
2. **Prioritize**: Choose which functionalities to implement first
3. **POC**: Build a Minimal Viable RAG (MVR) for one feature
4. **Test**: Validate with real users
5. **Iterate**: Refine based on feedback
6. **Scale**: Gradually roll out additional features

---

## 📞 Questions?

Feel free to reach out or open an issue to discuss:
- Specific implementation details
- Technology choices
- Cost estimates
- Timeline adjustments
- Custom requirements

---

<div align="center">

**Ready to make BoardWise smarter with AI? 🚀**

Let's build an intelligent platform that revolutionizes student accommodation search!

</div>

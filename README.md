# Mediphant DevTest Project

A full-stack medication interaction checker and FAQ system built with Next.js and vector search.

## 🏗️ Project Structure

```
mediphant-devtest/
├── web/                    # Next.js 14+ app-router project
│   ├── src/app/
│   │   ├── api/
│   │   │   ├── interactions/   # POST endpoint for drug interactions
│   │   │   └── faq/           # GET endpoint for FAQ search
│   │   ├── interactions/      # Interaction checker page
│   │   ├── faq/              # FAQ search page
│   │   └── page.tsx          # Homepage
│   ├── src/lib/              # Utility functions and tests
│   └── package.json
├── retrieval/              # Vector search and embeddings
│   ├── corpus.md           # Knowledge base content
│   ├── indexing.js         # Pinecone indexing script
│   └── fallback-embeddings.json  # Local fallback data
├── .env.example           # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Environment Setup

Copy and configure environment variables:
```bash
cp .env.example .env
```

Required environment variables:
- `OPENAI_API_KEY`: For generating embeddings (optional for fallback mode)
- `PINECONE_API_KEY`: For vector search (optional for fallback mode)
- `PINECONE_INDEX`: Pinecone index name
- `NEXT_PUBLIC_APP_URL`: Frontend URL

### 2. Web Application

```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000 to see:
- **Homepage**: Overview with navigation
- **Interaction Checker**: `/interactions` - Check medication interactions
- **FAQ System**: `/faq` - Ask medication questions

### 3. Retrieval System

The system supports both Pinecone and local fallback:

**With Pinecone** (optional):
```bash
cd retrieval
npm install @pinecone-database/pinecone openai
node indexing.js
```

**Fallback Mode**: Uses pre-generated `fallback-embeddings.json` for demo purposes.

## 📱 Features

### Part A: Medication Interaction Checker
- **Frontend**: Form with medication inputs and validation
- **API**: `POST /api/interactions` with JSON response
- **Logic**: Rule-based system for known interactions:
  - Warfarin + Ibuprofen → Bleeding risk
  - Metformin + Contrast dye → Lactic acidosis risk  
  - Lisinopril + Spironolactone → Hyperkalemia risk
- **UI**: Results card with risk level and advice
- **Extra**: Recent checks history (in-memory)

### Part B: Vector Search FAQ
- **Corpus**: 6 medication knowledge paragraphs
- **Indexing**: OpenAI embeddings → Pinecone (or local fallback)
- **API**: `GET /api/faq?q=query` with semantic search
- **Response**: Synthesized answer + top matches with scores
- **Fallback**: Cosine similarity with local embeddings

## 🧪 Testing

**Web Application**:
```bash
cd web
npm test              # Run unit tests
npm run test:coverage # With coverage report
```

**Manual Testing**: See `UI-TEST-GUIDE.md` and `TESTING-CHECKLIST.md` for comprehensive test cases.

**Coverage**: Tests focus on business logic and API integration patterns.

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Zod validation |
| **Vector DB** | Pinecone (with local fallback) |
| **Embeddings** | OpenAI text-embedding-ada-002 |
| **Testing** | Jest, XCTest |

## 🔒 Security & Compliance

- ✅ No secrets committed (uses `.env.example`)
- ✅ Input validation with Zod
- ✅ Error handling without stack trace leaks
- ✅ Clear "informational only, not medical advice" disclaimers
- ✅ CORS and security headers (Next.js defaults)

## 📊 AI-Assist Log

**Tools Used**: Claude 3.5 Sonnet via Cursor IDE

**Queries & Assistance**:
- ✅ "Create Next.js 14 app with TypeScript and Tailwind" - Generated initial project structure
- ✅ "Implement medication interaction API with Zod validation" - Created POST /api/interactions endpoint  
- ✅ "Build React form with validation and error handling" - Developed interactions page UI
- ✅ "Implement vector search with Pinecone and OpenAI embeddings" - Created FAQ system with fallback
- ✅ "Add Jest tests for business logic" - Implemented unit testing

**Accepted/Edited**:
- **100% Generated**: API route structure, TypeScript interfaces
- **Generated + Edited**: React components (adjusted styling and UX)
- **Fully Custom**: Test cases and fallback embedding data

## 📄 License

This is a technical demonstration project. Not intended for production medical use.

---

**⚠️ Medical Disclaimer**: This application is for informational and demonstration purposes only. It is not intended to provide medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical decisions.

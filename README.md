# 🚀 AI Interview Copilot

> **An AI-powered full-stack interview preparation suite** — analyze your resume, match job descriptions, practice mock interviews, and get real-time AI feedback. Built with Spring Boot, React, and LLM APIs.

---

## 💡 Overview

AI Interview Copilot is a production-grade application that simulates a complete interview preparation workflow. It ingests your resume via PDF upload, runs it through a RAG pipeline for context-aware AI responses, and provides targeted feedback on everything from keyword gaps to answer quality.

Unlike generic chatbots, this system is **session-aware** — each user's resume is embedded into a private vector collection and retrieved in real time to ground every AI response in the user's actual experience.

Whether you're a developer prepping for a FAANG loop or a professional pivoting careers, Copilot gives you the tools to walk in prepared.

---

## 🧠 Key Features

### 🔐 Authentication
- JWT-based stateless authentication (register / login)
- Spring Security filter chain with token validation on every protected route
- Passwords stored securely; tokens expire and are refreshed client-side

### 📄 Resume Analyzer
- Upload resume as PDF (up to 5MB)
- Extracted via **Apache PDFBox + Apache Tika**
- AI evaluates: **Strengths**, **Weaknesses**, **Missing Skills**
- Resume text is chunked and embedded into a per-session **ChromaDB** vector collection

### 📊 Job Description Matcher
- Paste any JD; the system compares it against your embedded resume
- Outputs: **Match Percentage**, **Missing Keywords**, **Improvement Suggestions**
- RAG-backed: retrieval pulls relevant resume chunks before prompting the LLM

### 🎤 Mock Interview Generator
- Generates tailored interview questions from your resume + target role
- Covers both **Technical** and **Behavioral** question types
- Session-scoped so questions are specific to *your* background

### 🧪 Answer Feedback System
- Submit your answer to any question
- AI scores it on: **Technical Accuracy**, **Communication**, **Confidence**
- Returns a numeric score + an improved model answer

### 📈 Analysis Dashboard
- Visual breakdown of your interview readiness
- Charts powered by **Recharts**
- Historical interview sessions stored in **MongoDB**

### 💬 AI Chat (RAG-backed)
- General-purpose chat grounded in your resume context
- Asks the RAG service for relevant chunks before every response
- Session-aware — context persists across the conversation

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────-───┐
│                    React Frontend (Vite)                 │
│   Dashboard │ Resume │ Matcher │ Interview │ Feedback    │
│              JWT stored in localStorage                  │
└─────────────────────┬────────────────────────────────-───┘
                      │ HTTPS / REST (Axios)
┌─────────────────────▼─────────────────────────────-──────┐
│              Spring Boot Backend  (:9090)                │
│                                                          │
│  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │AuthController│  │ResumeController│  │InterviewCtrl  │ │
│  └──────┬───────┘  └──────┬─────────┘  └──────┬────────┘ │
│         │                 │                  │           │
│  ┌──────▼─────────────────▼──────────────────▼────────┐  │
│  │              Service Layer (Business Logic)        │  │
│  │   AuthService │ ResumeService │ InterviewService   │  │
│  │   AiService   │ MatchService                       │  │
│  └──────┬───────────────────────────┬─────────────────┘  │
│         │                           │                    │
│  ┌──────▼──────┐          ┌─────────▼──────────────────┐ │
│  │  MongoDB    │          │     OpenRouter API (LLM)   │ │
│  │  (Users,    │          │  GPT-4 / Claude via REST   │ │
│  │  History)   │          └────────────────────────────┘ │
│  └─────────────┘                   │                     │
└──────────────────────────────────┬─┘                     │
                                   │ REST                  │
┌──────────────────────────────────▼──────────────────────┐│
│              FastAPI RAG Service  (:8000)                │
│                                                          │
│   POST /embed  →  chunk + embed resume into ChromaDB     │
│   POST /query  →  semantic search → top-3 chunks         │
│                                                          │
│   sentence-transformers (all-MiniLM-L6-v2)               │
│   ChromaDB (persistent vector store)                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Recharts, Axios |
| **Backend** | Java 17, Spring Boot 3.3, Spring Security, Maven |
| **Database** | MongoDB (users, interview history) |
| **Auth** | JWT (jjwt 0.11.5), stateless filter chain |
| **AI / LLM** | OpenRouter API (GPT / Claude models), prompt engineering |
| **RAG Service** | FastAPI, ChromaDB, sentence-transformers (`all-MiniLM-L6-v2`) |
| **PDF Parsing** | Apache PDFBox 2.0.29, Apache Tika 2.9.1 |
| **Caching** | Caffeine in-memory cache |
| **Deployment** | Backend: Railway/Render · Frontend: Vercel |

---

## 📦 API Endpoints

### 🔐 Authentication
```
POST /auth/register     →  Create a new account
POST /auth/login        →  Login, returns JWT token
```

### 📄 Resume
```
POST /resume/analyze    →  Upload PDF, extract text, run AI analysis
POST /resume/match      →  Compare resume against a job description
```

### 🎤 Interview
```
POST /interview/start      →  Generate mock interview questions
POST /interview/feedback   →  Submit an answer, receive AI feedback + score
```

### 🤖 AI
```
POST /ai/ask            →  General AI query (RAG-grounded)
```

### 💬 Chat
```
POST /chat              →  Session-aware AI chat with resume context
```

### 👤 User
```
GET /user/me            →  Get authenticated user profile
```

### RAG Service (FastAPI, internal)
```
POST /embed             →  Chunk and embed resume into ChromaDB
POST /query             →  Semantic search, returns top-3 matching chunks
GET  /                  →  Health check
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Python 3.10+
- MongoDB (local or Atlas)
- OpenRouter API key → [openrouter.ai](https://openrouter.ai)

---

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-interview-copilot.git
cd ai-interview-copilot
```

---

### 2. Start the RAG Service (FastAPI)
```bash
cd rag-service
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env              # Edit if needed

uvicorn app:app --host 0.0.0.0 --port 8000
```
RAG service will be live at `http://localhost:8000`

---

### 3. Configure & Start the Backend (Spring Boot)
```bash
cd backend

# Create .env from example and fill in your values
cp .env.example .env
```

```bash
./mvnw spring-boot:run
```
Backend will be live at `http://localhost:9090`

---

### 4. Start the Frontend (React + Vite)
```bash
cd frontend
cp .env.example .env              # VITE_API_URL=http://localhost:9090
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`

---

## 🔐 Authentication Flow

```
1. POST /auth/register  →  { name, email, password }
                           Returns: 201 Created

2. POST /auth/login     →  { email, password }
                           Returns: { token: "eyJhbGci..." }

3. All subsequent requests include:
   Header: Authorization: Bearer <token>

4. JwtFilter intercepts each request →
   - Validates token signature using HMAC-SHA key
   - Extracts username → loads UserDetails from MongoDB
   - Sets SecurityContext for downstream use

5. Token expiry → 401 Unauthorized → client redirects to /login
```

---

## 🤖 AI / LLM Integration

### LLM Provider
All AI features route through **OpenRouter**, which provides a unified API to access models like `gpt-4o`, `claude-3-5-sonnet`, and others. This means the LLM backend can be swapped with a single config change.

### RAG Pipeline
When a user uploads a resume:
1. Spring Boot extracts PDF text via PDFBox/Tika
2. Text is `POST /embed`-ed to the FastAPI RAG service
3. RAG service splits text into 200-word chunks, encodes each with `all-MiniLM-L6-v2`, and stores them in a **session-scoped ChromaDB collection** (`resume_{session_id}`)

When a user asks a question:
1. Spring Boot `POST /query`-s the RAG service with the user's question
2. RAG service performs cosine similarity search → returns top 3 resume chunks
3. Chunks are injected into the LLM prompt as context
4. OpenRouter generates a grounded, resume-aware response

### Prompt Engineering
Each feature has a dedicated system prompt:
- **Resume Analyzer**: Outputs structured strengths / weaknesses / missing skills
- **JD Matcher**: Returns match %, missing keywords, actionable suggestions
- **Interview Generator**: Produces a mix of behavioral and technical questions calibrated to the target role
- **Answer Feedback**: Scores on 3 axes and provides an improved model answer

---

## 📸 UI Pages

| Page | Description |
|---|---|
| `/login` & `/register` | Clean auth forms with validation |
| `/dashboard` | Overview cards showing user stats and quick actions |
| `/resume` | PDF upload zone + streamed AI analysis results |
| `/matcher` | Side-by-side resume vs JD comparison with match score |
| `/interview` | Question generation interface with role selector |
| `/feedback` | Answer submission panel with score breakdown |
| `/chat` | Full-screen chat UI with RAG-grounded responses |
| `/history` | Paginated list of past interview sessions |
| `/analysis` | Recharts-powered readiness dashboard |

> 📌 Screenshots and live demo URL to be added post-deployment.

---

## 🚀 Deployment

### Backend → Railway / Render

# Build command:
./mvnw clean package -DskipTests

# Start command:
java -jar target/ai-interview-copilot-0.0.1-SNAPSHOT.jar
```

### RAG Service → Railway / Render
```bash
# Build: pip install -r requirements.txt
# Start: uvicorn app:app --host 0.0.0.0 --port $PORT

# Environment variable:
CHROMA_PERSIST_PATH=/data/chroma_db   # Use a persistent volume
```

### Frontend → Vercel
```bash
# Connect your GitHub repo to Vercel
# Set build command: npm run build
# Set output directory: dist
# Add environment variable:
VITE_API_URL=https://your-backend-url.railway.app
```

> ⚠️ Ensure `CORS_ALLOWED_ORIGINS` on the backend matches your Vercel domain exactly.

---

## 🧪 Example Use Cases

**Career Switcher**
> Upload your current resume, paste a target JD, get a match score of 58%, discover you're missing "Kubernetes" and "system design" mentions, and get a rewrite suggestion — all in under 30 seconds.

**FAANG Prep**
> Generate 10 behavioral + technical questions for a "Senior Software Engineer at Google" role, practice answering in the Feedback page, and receive a score with a polished model answer to compare against.

**Resume Audit**
> Upload your resume and run the Analyzer — instantly surface weak action verbs, missing quantifiable impact, and skills that don't match industry expectations.

---

## 📈 Future Improvements

- [ ] Streaming LLM responses for real-time typing effect
- [ ] Company-specific interview mode (e.g., "Prepare for Amazon LP interviews")
- [ ] Resume rewrite assistant — AI rewrites bullet points in-place
- [ ] Better RAG: hybrid BM25 + dense retrieval for higher precision
- [ ] User analytics dashboard: score trends, weak topics, improvement over time
- [ ] Shareable interview reports (PDF export)
- [ ] Support for multi-resume management

---

## 🧑‍💻 Author

**Adarsh Adetwar**
Full Stack Java Developer · AI Application Enthusiast

---

## ⭐ Why This Project Stands Out

This isn't a wrapper around a ChatGPT prompt. It's an end-to-end system with:
- A **stateless JWT auth layer** implemented from scratch in Spring Security
- A **custom RAG pipeline** using sentence embeddings + ChromaDB — not a hosted vector DB
- **Session-scoped vector collections** so each user's resume never pollutes another's context
- A **polyglot architecture** (Java + Python + TypeScript) wired together via REST contracts
- Real engineering decisions: Caffeine caching, CORS config from env vars, profile-based logging, PDF parsing with fallback via Tika

> 💬 *"Not just a portfolio project — a demonstration of how modern AI engineering is done."*

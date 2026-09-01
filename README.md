# Smart Knowledge Assistant 🧠📄

A full-stack, production-grade **AI-powered Knowledge Assistant** built with **FastAPI**, **React**, **PostgreSQL (AWS RDS)**, **AWS S3**, **Pinecone Vector Database**, and **Google Gemini Generative AI**.

Upload any PDF document, ask questions in natural language, and receive precise, source-grounded answers with exact page citations, persistent conversation memory, and a custom retro-console UI.

---

## 🌟 Key Features

- 📑 **Intelligent PDF Ingestion & Chunking**: Automatic page extraction using PyMuPDF and semantic chunking with LangChain.
- ⚡ **Cloud Vector Indexing (Pinecone)**: High-speed similarity search powered by `gemini-embedding-001` (3072 dimensions) with multi-tenant namespace isolation per document.
- 💬 **Persistent Conversational Memory**: Chat history stored in PostgreSQL and automatically injected into LLM context for seamless multi-turn reasoning.
- 🎯 **Source-Grounded Answers with Citations**: Page-level citations with interactive, collapsible preview cards to inspect source snippets.
- ☁️ **Cloud Storage Integration**: Original PDF files safely stored in AWS S3 with secure user access isolation.
- 🔐 **Authentication & Security**: JWT-based authentication with bcrypt password hashing and token expiry.
- 🎨 **Retro-Console UI**: Custom terminal/CRT-inspired aesthetic with scanlines, phosphor mode toggles (Green/Amber), and responsive layout.
- 🐳 **Production Ready**: Fully containerized using Docker & Docker Compose, deployed to AWS EC2 and Vercel.

---

## 🛠️ Architecture & Tech Stack

```
   [ React Frontend (Vite + TailwindCSS) ]
                     │  (HTTPS / REST)
                     ▼
       [ Nginx Reverse Proxy / Vercel ]
                     │
                     ▼
         [ FastAPI Backend (Python) ]
         ├── PyMuPDF & LangChain (Parsing & Chunking)
         ├── Google Gemini 3.1 Flash (Chat & RAG Reasoning)
         ├── Google Gemini Embeddings (Vector Generation)
         ├── Pinecone (Managed Vector Search)
         ├── PostgreSQL on AWS RDS (Users, Sources, Chat History)
         └── AWS S3 (Document File Storage)
```

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, React Router 7, Axios, Lucide Icons, React Markdown |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, Python-Jose (JWT), Passlib (Bcrypt) |
| **AI / RAG** | LangChain, LangChain Google GenAI, LangChain Pinecone, Gemini 3.1 Flash |
| **Vector DB** | Pinecone Cloud (Dense, 3072 dimensions, Cosine metric) |
| **Relational DB** | PostgreSQL (AWS RDS) |
| **File Storage** | AWS S3 |
| **Deployment** | Docker, Docker Compose, Nginx, AWS EC2, Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Docker & Docker Compose (optional for containerized run)
- Accounts for **Google AI Studio (Gemini)**, **Pinecone**, and **AWS (RDS & S3)**

---

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Fill in your credentials in .env

# Run development server
uvicorn app.main:app --reload --port 8000
```

Backend API will be accessible at:
- **API Base**: `http://localhost:8000`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run Vite development server
npm run dev
```

Frontend will be accessible at: `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# Database (PostgreSQL / AWS RDS)
DATABASE_URL=postgresql://<username>:<password>@<host>:5432/<database_name>

# JWT Authentication
JWT_SECRET_KEY=your_super_secret_jwt_key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# Google Gemini AI
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_CHAT_MODEL=gemini-3.1-flash-lite

# AWS S3 Storage
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region (e.g. eu-north-1)
AWS_S3_BUCKET=your_s3_bucket_name

# Pinecone Cloud Vector DB
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=smart-knowledge
```

---

## 🐳 Docker Deployment

To launch the complete application stack (Frontend + Backend) with a single command:

```bash
# Build and run containers in detached mode
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Stop containers
docker compose down
```

---

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Create a new user account
- `POST /auth/login` - Authenticate and retrieve JWT token
- `POST /auth/token` - OAuth2 password bearer token endpoint

### Documents / Sources
- `POST /source/pdf` - Upload and process PDF (Extracts, chunks, embeds to Pinecone, uploads to S3)
- `GET /source/` - List all uploaded documents for the current user

### Chat & Conversational RAG
- `POST /chat` - Submit a question about a document (queries Pinecone, returns answer + citations, saves turn)
- `GET /chat/{source_id}` - Retrieve complete historical messages for a document

### Health
- `GET /health` - Health check status endpoint

---

## 📄 License
This project is licensed under the MIT License.


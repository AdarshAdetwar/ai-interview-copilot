# AI Interview — RAG Service (FastAPI + ChromaDB)

Session-scoped resume retrieval service used by the Spring Boot backend.

## Run locally

```bash
cd ai-interview-rag-service
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app:app --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /embed`  — body: `{ \"text\": \"...\", \"session_id\": \"...\" }`
- `POST /query`  — body: `{ \"query\": \"...\", \"session_id\": \"...\" }`
- `GET  /`      — health check
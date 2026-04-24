import os
from fastapi import FastAPI
from pydantic import BaseModel
import chromadb
import uuid
from sentence_transformers import SentenceTransformer

app = FastAPI(title="AI Interview RAG Service")

# ================== CONFIGURATION ==================
CHROMA_PERSIST_PATH = os.getenv("CHROMA_PERSIST_PATH", "./chroma_db")
print(f"ChromaDB using path: {CHROMA_PERSIST_PATH}")

model = SentenceTransformer('all-MiniLM-L6-v2')

chroma_client = chromadb.PersistentClient(path=CHROMA_PERSIST_PATH)

# Session-scoped collections
session_collections = {}

def get_collection(session_id: str):
    """Get or create a collection for the specific session"""
    if not session_id or str(session_id).strip() == "":
        session_id = "default"
    
    if session_id not in session_collections:
        session_collections[session_id] = chroma_client.get_or_create_collection(
            name=f"resume_{session_id}"
        )
    return session_collections[session_id]


class ResumeRequest(BaseModel):
    text: str
    session_id: str


class QueryRequest(BaseModel):
    query: str
    session_id: str


def chunk_text(text, chunk_size=200):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks


@app.post("/embed")
def embed_resume(req: ResumeRequest):
    try:
        if not req.text or len(req.text.strip()) == 0:
            return {"error": "Empty resume text"}

        chunks = chunk_text(req.text)
        embeddings = model.encode(chunks).tolist()

        collection = get_collection(req.session_id)
        collection.add(
            documents=chunks,
            embeddings=embeddings,
            ids=[str(uuid.uuid4()) for _ in chunks]
        )
        return {"message": "Resume embedded successfully", "chunks": len(chunks)}
    
    except Exception as e:
        return {"error": str(e)}


@app.post("/query")
def query_resume(req: QueryRequest):
    try:
        if not req.query:
            return {"error": "Empty query"}

        collection = get_collection(req.session_id)
        query_embedding = model.encode([req.query]).tolist()
        
        results = collection.query(
            query_embeddings=query_embedding,
            n_results=3
        )
        
        return {
            "documents": results.get("documents", [[]])[0]
        }
    
    except Exception as e:
        return {"error": str(e)}


@app.get("/")
def home():
    return {
        "message": "RAG Service is running 🚀",
        "chroma_path": CHROMA_PERSIST_PATH
    }


# Optional but very useful for production
@app.delete("/cleanup/{session_id}")
def cleanup_session(session_id: str):
    try:
        collection_name = f"resume_{session_id}"
        chroma_client.delete_collection(collection_name)
        session_collections.pop(session_id, None)
        return {"message": f"Session {session_id} cleaned up successfully"}
    except Exception as e:
        return {"error": str(e)}
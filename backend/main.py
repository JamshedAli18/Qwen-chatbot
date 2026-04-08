# main.py
# ─────────────────────────────────────────────
# FastAPI backend that exposes the chatbot
# as a REST API with two endpoints:
#   POST /chat   → send a message
#   DELETE /chat/{session_id} → clear history
# ─────────────────────────────────────────────

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import chat, chat_histories

# ── Initialize FastAPI app ──
app = FastAPI(
    title="Qwen Chatbot API",
    description="LangChain + Groq + Qwen chatbot backend",
    version="1.0.0",
)

# ── Allow all origins (update in production) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────
# Request / Response Schemas (Pydantic)
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str           # user's question
    session_id: str = "default"   # optional session ID for memory


class ChatResponse(BaseModel):
    reply: str
    session_id: str


# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────

@app.get("/")
def root():
    """Health check endpoint."""
    return {"status": "Qwen Chatbot is running 🚀"}


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Send a message to the chatbot.
    Returns the AI's reply.
    Memory is maintained per session_id.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        reply = chat(
            user_input=request.message,
            session_id=request.session_id,
        )
        return ChatResponse(reply=reply, session_id=request.session_id)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/chat/{session_id}")
def clear_history(session_id: str):
    """
    Clear the conversation history for a session.
    Useful for starting a fresh conversation.
    """
    if session_id in chat_histories:
        del chat_histories[session_id]
        return {"message": f"History cleared for session '{session_id}'"}
    return {"message": f"No history found for session '{session_id}'"}
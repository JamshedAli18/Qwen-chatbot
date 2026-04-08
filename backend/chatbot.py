# chatbot.py
# ─────────────────────────────────────────────
# LangChain chatbot using Groq + Qwen model
# Includes: prompts, output parsers, messages,
#           chains, and in-memory chat history
# ─────────────────────────────────────────────

import os
from dotenv import load_dotenv
import re  # add this at the top


# ── LangChain Core Imports ──
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage

# ── Groq LLM ──
from langchain_groq import ChatGroq

# ── Load environment variables from .env ──
load_dotenv()

# ─────────────────────────────────────────────
# Helper: Strip <think>...</think> blocks
# Qwen3 outputs reasoning inside these tags
# ─────────────────────────────────────────────
def strip_thinking(text: str) -> str:
    """Remove <think>...</think> reasoning blocks from Qwen3 output."""
    return re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL).strip()



# ─────────────────────────────────────────────
# 1. Initialize the LLM (Groq + Qwen model)
# ─────────────────────────────────────────────
def get_llm():
    """Create and return the Groq LLM instance."""
    return ChatGroq(
        model="qwen/qwen3-32b",
        api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.7,
    )


# ─────────────────────────────────────────────
# 2. Build the Prompt Template
#    - SystemMessage sets the assistant's role
#    - MessagesPlaceholder injects chat history
#    - HumanMessage captures the new user input
# ─────────────────────────────────────────────
def get_prompt():
    """Return the ChatPromptTemplate with memory placeholder."""
    return ChatPromptTemplate.from_messages([
        (
            "system",
            "You are a helpful AI assistant powered by Qwen. "
            "Answer questions clearly and concisely. "
            "You remember the conversation history."
        ),
        MessagesPlaceholder(variable_name="history"),  # injects past messages
        ("human", "{input}"),                           # current user message
    ])


# ─────────────────────────────────────────────
# 3. In-Memory Chat History Store
#    - Stores one history object per session_id
#    - Acts as our "memory" across turns
# ─────────────────────────────────────────────
chat_histories: dict[str, InMemoryChatMessageHistory] = {}

def get_history(session_id: str) -> InMemoryChatMessageHistory:
    """Return (or create) the chat history for a given session."""
    if session_id not in chat_histories:
        chat_histories[session_id] = InMemoryChatMessageHistory()
    return chat_histories[session_id]


# ─────────────────────────────────────────────
# 4. Build the Chain
#    Chain = Prompt | LLM | OutputParser
#    - Prompt formats the messages
#    - LLM generates a response
#    - StrOutputParser extracts plain text
# ─────────────────────────────────────────────
def get_chain():
    """Assemble and return the LangChain chain."""
    prompt = get_prompt()
    llm = get_llm()
    output_parser = StrOutputParser()   # converts AIMessage → plain string
    return prompt | llm | output_parser


# ─────────────────────────────────────────────
# 5. Main Chat Function
#    - Loads history for session
#    - Runs the chain with history + new input
#    - Saves both messages back to history
# ─────────────────────────────────────────────
def chat(user_input: str, session_id: str = "default") -> str:
    history = get_history(session_id)
    chain = get_chain()

    response = chain.invoke({
        "history": history.messages,
        "input": user_input,
    })

    # ✅ Strip <think> blocks before saving or returning
    clean_response = strip_thinking(response)

    history.add_message(HumanMessage(content=user_input))
    history.add_message(AIMessage(content=clean_response))

    return clean_response
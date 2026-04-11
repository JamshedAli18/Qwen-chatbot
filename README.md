# 🤖 Qwen Chatbot (LangChain + Groq + FastAPI + React)

A full-stack AI chatbot built using:

- 🧠 LangChain (prompts, chains, memory)
- ⚡ Groq (Qwen model)
- 🚀 FastAPI (backend API)
- 🎨 React (frontend UI)

---


---

## ⚙️ Backend Setup (FastAPI)

### 1. Clone project
```bash
git clone <your-repo-url>
cd project

python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows

pip install -r requirements.txt

GROQ_API_KEY=your_api_key_here

uvicorn main:app --reload

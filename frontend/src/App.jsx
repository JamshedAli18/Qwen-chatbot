import { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

const SESSION_ID = `session_${Date.now()}`;
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (userText) => {
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, session_id: SESSION_ID }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Server error");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

    } catch (e) {
      setError(e.message);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `⚠ Error: ${e.message}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    setMessages([]);
    setError(null);
    try {
      await fetch(`${API_URL}/chat/${SESSION_ID}`, { method: "DELETE" });
    } catch (e) {
      console.error("Clear failed:", e);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-base overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 border-b border-border bg-surface px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm border border-border bg-raised flex items-center justify-center">
              <span className="font-serif italic text-accent text-base">Q</span>
            </div>
            <div>
              <h1 className="font-serif italic text-primary text-base leading-none">Qwen Assistant</h1>
              <p className="font-mono text-muted text-xs mt-0.5">qwen3-32b · groq</p>
            </div>
          </div>

          <button
            onClick={clearChat}
            className="font-mono text-muted hover:text-primary text-xs
                       border border-border hover:border-subtle
                       px-3 py-1.5 rounded-sm transition-colors duration-150"
          >
            clear →
          </button>
        </div>
      </header>

      {/* ── Messages ── */}
      <ChatWindow messages={messages} isLoading={isLoading} />

      {/* ── Input ── */}
      <ChatInput onSend={sendMessage} isLoading={isLoading} />

    </div>
  );
};

export default App;
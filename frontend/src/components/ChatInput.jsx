import { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSend, isLoading }) => {
    const [text, setText] = useState("");
    const textareaRef = useRef(null);

    // Auto-resize textarea
    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }, [text]);

    const handleSend = () => {
        if (!text.trim() || isLoading) return;
        onSend(text.trim());
        setText("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="shrink-0 border-t border-border bg-surface px-4 py-4">
            <div className="max-w-2xl mx-auto flex items-end gap-3">

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="ask something..."
                    disabled={isLoading}
                    className="flex-1 resize-none bg-base border border-border text-primary placeholder-muted
                     rounded-sm px-4 py-3 text-sm font-mono leading-relaxed
                     focus:outline-none focus:border-accent
                     disabled:opacity-40 transition-colors duration-150"
                    style={{ minHeight: "46px", maxHeight: "120px" }}
                />

                <button
                    onClick={handleSend}
                    disabled={isLoading || !text.trim()}
                    className="shrink-0 h-[46px] px-5 bg-accent text-base font-mono text-sm
                     rounded-sm hover:bg-amber-500 disabled:opacity-30
                     transition-colors duration-150"
                >
                    {isLoading ? "..." : "send →"}
                </button>

            </div>
            <p className="text-center text-muted text-xs mt-2 font-mono">
                enter to send · shift+enter for new line
            </p>
        </div>
    );
};

export default ChatInput;
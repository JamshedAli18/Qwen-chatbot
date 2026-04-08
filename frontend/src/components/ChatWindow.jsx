import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import TypingIndicator from "./TypingIndicator";

const ChatWindow = ({ messages, isLoading }) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto py-6">
            <div className="max-w-2xl mx-auto flex flex-col gap-5">

                {/* Empty state */}
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center mt-24 gap-3 text-center px-4">
                        <div className="w-12 h-12 rounded-sm border border-border bg-raised flex items-center justify-center">
                            <span className="font-serif italic text-accent text-xl">Q</span>
                        </div>
                        <p className="font-serif italic text-subtle text-lg">What would you like to know?</p>
                        <p className="font-mono text-muted text-xs">powered by qwen3-32b via groq</p>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <ChatBubble key={i} message={msg.content} role={msg.role} />
                ))}

                {isLoading && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>
        </div>
    );
};

export default ChatWindow;
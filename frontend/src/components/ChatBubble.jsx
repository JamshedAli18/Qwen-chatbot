import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatBubble = ({ message, role }) => {
    const isUser = role === "user";

    return (
        <div className={`flex items-end gap-3 msg-enter px-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>

            {/* Avatar */}
            <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 text-xs
        ${isUser
                    ? "bg-accent-dim border border-accent text-accent font-mono"
                    : "bg-raised border border-border text-accent font-serif italic"
                }`}>
                {isUser ? "U" : "Q"}
            </div>

            {/* Bubble */}
            <div className={`max-w-[72%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-mono
        ${isUser
                    ? "bg-accent-dim border border-accent-dim text-primary rounded-sm rounded-tr-none"
                    : "bg-raised border border-border text-primary rounded-sm rounded-tl-none prose prose-invert prose-sm max-w-none break-words dark:prose-pre:bg-black/50"
                }`}>
                {isUser ? (
                    message
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message}
                    </ReactMarkdown>
                )}
            </div>

        </div>
    );
};

export default ChatBubble;
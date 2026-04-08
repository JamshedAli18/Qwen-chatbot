const TypingIndicator = () => (
    <div className="flex items-end gap-3 msg-enter px-4">
        <div className="w-7 h-7 rounded-sm bg-raised border border-border flex items-center justify-center shrink-0">
            <span className="text-accent font-serif text-xs italic">Q</span>
        </div>
        <div className="bg-raised border border-border rounded-sm rounded-tl-none px-4 py-3 flex gap-1.5 items-center">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-muted"
                    style={{ animation: `blink 1.2s ${delay}ms infinite` }}
                />
            ))}
        </div>
    </div>
);

export default TypingIndicator;
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 p-3 w-fit bg-muted/50 rounded-2xl rounded-tl-sm mt-2 mb-4">
      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

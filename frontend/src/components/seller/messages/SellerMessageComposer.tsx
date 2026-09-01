import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Paperclip } from 'lucide-react';
import { useSendMessage } from '@/hooks/useEnquiries';

interface SellerMessageComposerProps {
  conversationId: string;
  disabled?: boolean;
}

export function SellerMessageComposer({ conversationId, disabled = false }: SellerMessageComposerProps) {
  const { mutate: sendMessage } = useSendMessage(conversationId);
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = message.trim().length > 0 && !disabled;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage({ messageText: message.trim() });
    setMessage('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`composer-${conversationId}`} className="sr-only">
        Write a message
      </Label>
      <Textarea
        id={`composer-${conversationId}`}
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled
            ? 'This conversation is closed or archived. Restore it to reply.'
            : 'Type your message…'
        }
        className="min-h-[90px] resize-none"
        disabled={disabled}
        aria-label="Message input"
        aria-describedby={`composer-hint-${conversationId}`}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            disabled={disabled}
            aria-label="Attach file (mock)"
            onClick={() => {}} // mock — no upload
          >
            <Paperclip className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline text-xs">Attach</span>
          </Button>
          <p
            id={`composer-hint-${conversationId}`}
            className="text-xs text-muted-foreground hidden sm:block"
          >
            <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">Ctrl</kbd>+
            <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send
          </p>
        </div>
        <Button
          onClick={handleSend}
          disabled={!canSend}
          className="gap-2"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>Send</span>
        </Button>
      </div>
    </div>
  );
}

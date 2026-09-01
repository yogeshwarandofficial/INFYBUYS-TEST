import { useRef, useState } from 'react';
import { useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

interface SellerEnquiryResponseComposerProps {
  enquiryId: string;
}

export function SellerEnquiryResponseComposer({ enquiryId }: SellerEnquiryResponseComposerProps) {
  const { addEnquiryResponse } = useSellerStore();
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const canSend = message.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    addEnquiryResponse(enquiryId, message.trim());
    setMessage('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to send
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor={`response-composer-${enquiryId}`} className="text-sm font-medium">
        Write a Response
      </Label>
      <Textarea
        id={`response-composer-${enquiryId}`}
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your response to the buyer…"
        className="min-h-[120px] resize-y"
        aria-label="Response message"
        aria-describedby={`composer-hint-${enquiryId}`}
      />
      <div className="flex items-center justify-between gap-3">
        <p
          id={`composer-hint-${enquiryId}`}
          className="text-xs text-muted-foreground"
        >
          Press <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">Ctrl</kbd>+
          <kbd className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">Enter</kbd> to send
        </p>
        <Button
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send response"
          className="gap-2"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Send Response
        </Button>
      </div>
    </div>
  );
}

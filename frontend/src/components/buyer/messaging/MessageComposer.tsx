import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AttachmentPreview } from './AttachmentPreview';
import type { FilePreview } from './AttachmentPreview';

interface MessageComposerProps {
  onSend: (content: string, attachments?: FilePreview[]) => void;
  disabled?: boolean;
}

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if ((!content.trim() && attachments.length === 0) || disabled) return;
    onSend(content.trim(), attachments);
    setContent('');
    setAttachments([]);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file)
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => {
      const newAttachments = [...prev];
      URL.revokeObjectURL(newAttachments[index].previewUrl); // Cleanup
      newAttachments.splice(index, 1);
      return newAttachments;
    });
  };

  return (
    <div className="border-t bg-card p-4">
      <div className="flex flex-col gap-3 rounded-lg border bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">

        <Textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 resize-none py-3 px-4 shadow-none"
          aria-label="Message content"
        />

        <AttachmentPreview attachments={attachments} onRemove={removeAttachment} />

        <div className="flex items-center justify-between p-2 pt-0">
          <div className="flex items-center gap-1">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx"
            />
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              disabled={disabled}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            disabled={(!content.trim() && attachments.length === 0) || disabled}
            size="sm"
            className="px-4"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
      <div className="text-[10px] text-muted-foreground mt-2 text-right">
        Press Enter to send, Shift + Enter for a new line
      </div>
    </div>
  );
}

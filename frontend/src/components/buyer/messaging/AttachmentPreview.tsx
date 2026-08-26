import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FilePreview {
  file: File;
  previewUrl: string;
}

interface AttachmentPreviewProps {
  attachments: FilePreview[];
  onRemove: (index: number) => void;
}

export function AttachmentPreview({ attachments, onRemove }: AttachmentPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 border-t bg-muted/20">
      {attachments.map((att, index) => {
        const isImage = att.file.type.startsWith('image/');

        return (
          <div
            key={index}
            className="relative group flex items-center gap-2 bg-background border rounded-md p-2 pr-8 max-w-[200px]"
          >
            {isImage ? (
              <div className="h-8 w-8 rounded overflow-hidden flex-shrink-0 bg-muted">
                <img src={att.previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-4 w-4 text-primary" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-medium truncate">{att.file.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {(att.file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onRemove(index)}
              aria-label={`Remove ${att.file.name}`}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}

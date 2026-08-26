import { Check, CheckCheck, Clock } from 'lucide-react';
import type { MessageStatus as Status } from '@/store/useBuyerStore';

interface MessageStatusProps {
  status: Status;
}

export function MessageStatus({ status }: MessageStatusProps) {
  switch (status) {
    case 'sending':
      return <Clock className="h-3 w-3 text-muted-foreground" />;
    case 'sent':
      return <Check className="h-3 w-3 text-muted-foreground" />;
    case 'delivered':
      return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
    case 'read':
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    default:
      return null;
  }
}

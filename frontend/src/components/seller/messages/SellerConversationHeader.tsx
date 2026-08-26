import { Link, useNavigate } from 'react-router';
import { type SellerConversation } from '@/store/useSellerStore';
import { useSellerStore } from '@/store/useSellerStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, Building2, ExternalLink, MoreHorizontal, Archive, RotateCcw, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SellerConversationHeaderProps {
  conversation: SellerConversation;
  onDeleteRequest: () => void;
}

const STATUS_BADGE: Record<SellerConversation['status'], { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  archived: { label: 'Archived', className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
  closed: { label: 'Closed', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' },
};

export function SellerConversationHeader({ conversation, onDeleteRequest }: SellerConversationHeaderProps) {
  const navigate = useNavigate();
  const { archiveConversation, restoreConversation, markConversationAsRead } = useSellerStore();
  const statusCfg = STATUS_BADGE[conversation.status];

  return (
    <div className="flex items-start gap-3 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/seller/messages')}
        className="-ml-2 gap-2 shrink-0"
        aria-label="Back to messages"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span className="hidden sm:inline">Messages</span>
      </Button>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight truncate">
            {conversation.buyerName}
          </h1>
          <Badge
            variant="secondary"
            className={cn(statusCfg.className, 'font-medium border-0')}
            aria-label={`Status: ${statusCfg.label}`}
          >
            {statusCfg.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-muted-foreground">
          {conversation.buyerCompany && (
            <span>{conversation.buyerCompany}</span>
          )}
          <Link
            to={`/seller/listings/${conversation.listingId}`}
            className="flex items-center gap-1 text-primary hover:underline"
            aria-label={`View listing: ${conversation.listingTitle}`}
          >
            <Building2 className="w-3 h-3" aria-hidden="true" />
            {conversation.listingTitle}
            <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
          </Link>
          {conversation.enquiryId && (
            <Link
              to={`/seller/enquiries/${conversation.enquiryId}`}
              className="flex items-center gap-1 hover:underline"
              aria-label="View related enquiry"
            >
              View Enquiry
              <ExternalLink className="w-2.5 h-2.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Actions dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Conversation actions">
            <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {conversation.unreadCount > 0 && (
            <DropdownMenuItem onClick={() => markConversationAsRead(conversation.id)}>
              <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
              Mark as Read
            </DropdownMenuItem>
          )}
          {conversation.status === 'active' && (
            <DropdownMenuItem onClick={() => archiveConversation(conversation.id)}>
              <Archive className="w-4 h-4 mr-2" aria-hidden="true" />
              Archive Conversation
            </DropdownMenuItem>
          )}
          {(conversation.status === 'archived' || conversation.status === 'closed') && (
            <DropdownMenuItem onClick={() => restoreConversation(conversation.id)}>
              <RotateCcw className="w-4 h-4 mr-2" aria-hidden="true" />
              Restore Conversation
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={onDeleteRequest}
          >
            Delete Conversation
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

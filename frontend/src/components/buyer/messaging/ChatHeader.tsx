import { ArrowLeft, MoreVertical, ExternalLink, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Conversation } from '@/store/useBuyerStore';
import { useBuyerStore } from '@/store/useBuyerStore';

interface ChatHeaderProps {
  conversation: Conversation;
  onBack?: () => void;
  onArchive?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
}

export function ChatHeader({ conversation, onBack, onArchive, onClose, onDelete }: ChatHeaderProps) {
  const { ndas } = useBuyerStore();
  const existingNda = ndas.find(n => n.listingId === conversation.listingId);

  return (
    <div className="flex flex-col border-b bg-card z-10">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b h-16">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <Avatar className="h-10 w-10 border">
            <AvatarImage src={conversation.sellerAvatar} alt={conversation.sellerName} />
            <AvatarFallback>{conversation.sellerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <h3 className="font-semibold text-sm">{conversation.sellerName}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {conversation.businessName}
              {conversation.status !== 'active' && (
                <span className="capitalize px-1.5 py-0.5 rounded-full bg-muted text-[10px]">
                  {conversation.status}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {conversation.status === 'active' && (
                <>
                  <DropdownMenuItem onClick={onArchive}>Archive Conversation</DropdownMenuItem>
                  <DropdownMenuItem onClick={onClose}>Close Conversation</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={onDelete}>
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Listing Context Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
        <div className="flex items-center gap-3 overflow-hidden">
          {conversation.businessImage ? (
            <img
              src={conversation.businessImage}
              alt={conversation.listingTitle}
              className="h-10 w-14 object-cover rounded shadow-sm border flex-shrink-0"
            />
          ) : (
            <div className="h-10 w-14 rounded bg-muted flex-shrink-0 flex items-center justify-center">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-medium truncate">{conversation.listingTitle}</p>
            <p className="text-[10px] text-muted-foreground">Listing ID: {conversation.listingId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {existingNda && (
            <Button variant="outline" size="sm" className="h-8 text-xs hidden sm:flex" asChild>
              <Link to={`/buyer/nda/${existingNda.id}`}>
                <FileText className="h-3 w-3 mr-1.5" />
                NDA Status
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
            <Link to={`/buyer/listing/${conversation.listingId}`}>
              View Listing
              <ExternalLink className="h-3 w-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

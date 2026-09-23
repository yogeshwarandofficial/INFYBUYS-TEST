import { useState, useEffect } from 'react';
import { Share2, Mail, Copy, Check, Smartphone, MessageCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
}

export function ShareButton({ url, title, text }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isNativeShareAvailable, setIsNativeShareAvailable] = useState(false);

  useEffect(() => {
    setIsNativeShareAvailable(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Use provided url or fallback to window.location.href, but handle SSR gracefully
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out this listing';
  const shareText = text || 'I thought you might be interested in this listing.';

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (isNativeShareAvailable) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Error sharing via native API', error);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Share this listing">
          <Share2 className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isNativeShareAvailable && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Smartphone className="mr-2 h-4 w-4" />
            <span>Share via device...</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => window.open(`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, '_blank')}>
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareTitle} - ${shareUrl}`)}`, '_blank')}>
          <MessageCircle className="mr-2 h-4 w-4 text-green-500" />
          <span>WhatsApp</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4 text-blue-600" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`, '_blank')}>
          <ExternalLink className="mr-2 h-4 w-4 text-sky-500" />
          <span>X (Twitter)</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopy}>
          {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

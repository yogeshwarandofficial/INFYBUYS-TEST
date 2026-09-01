import type { Enquiry } from '@/types/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Clock, ArrowRight, CircleAlert } from 'lucide-react';
import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface EnquiryCardProps {
  enquiry: Enquiry;
}

export function EnquiryCard({ enquiry }: EnquiryCardProps) {
  const isResponded = enquiry.unreadCount && enquiry.unreadCount > 0;

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 overflow-hidden">
              {enquiry.listing?.coverMediaId ? (
                <img src={enquiry.listing.coverMediaId} alt={enquiry.listing.title} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg line-clamp-1">{enquiry.listing?.title}</CardTitle>
              <p className="text-sm text-muted-foreground">Seller: {enquiry.seller?.name}</p>
            </div>
          </div>
          {isResponded && (
            <Badge className={cn("shrink-0", "bg-green-500 hover:bg-green-600")}>
              New Message
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-4 flex-1">
        {enquiry.lastMessage && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {enquiry.lastMessage.messageText}
          </p>
        )}

        {isResponded && enquiry.lastMessage && (
          <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-md mt-4 flex items-start gap-3">
            <CircleAlert className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-green-700 uppercase tracking-wider mb-1">New Message from Seller</p>
              <p className="text-sm text-foreground line-clamp-1">"{enquiry.lastMessage.messageText}"</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/20">
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="w-3 h-3 mr-1" />
          Updated {new Date(enquiry.updatedAt).toLocaleDateString()}
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/buyer/enquiries/${enquiry.id}`}>
            View Details <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, List, Mail, MessageSquare } from 'lucide-react';
import { Link } from 'react-router';

export function SellerQuickActions() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>Manage your business listings and communications</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/seller/listings">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center hover:border-primary/50 hover:bg-primary/5">
              <PlusCircle className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Add Listing</span>
            </Button>
          </Link>

          <Link to="/seller/listings">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center hover:border-primary/50 hover:bg-primary/5">
              <List className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">Manage Listings</span>
            </Button>
          </Link>

          <Link to="/seller/enquiries">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center hover:border-primary/50 hover:bg-primary/5">
              <Mail className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">View Enquiries</span>
            </Button>
          </Link>

          <Link to="/seller/messages">
            <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2 items-center justify-center hover:border-primary/50 hover:bg-primary/5">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="text-sm font-medium">View Messages</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

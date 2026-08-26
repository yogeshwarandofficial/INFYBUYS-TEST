import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Search, Heart, Bookmark, Mail } from 'lucide-react';

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
          <Link to="/buyer/browse">
            <Search className="h-6 w-6" />
            <span>Browse</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
          <Link to="/buyer/favorites">
            <Heart className="h-6 w-6" />
            <span>Saved</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
          <Link to="/buyer/saved-searches">
            <Bookmark className="h-6 w-6" />
            <span>Searches</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex flex-col gap-2" asChild>
          <Link to="/buyer/messages">
            <Mail className="h-6 w-6" />
            <span>Messages</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

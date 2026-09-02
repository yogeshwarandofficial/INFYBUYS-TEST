import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router';
import { Search, Heart, Bookmark, Mail } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="bg-white/80 backdrop-blur-md border border-gray-100 shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold text-[#111827]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-[120px] flex flex-col gap-3 border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-blue-50/50 transition-all duration-200 rounded-xl" asChild>
          <Link to="/buyer/browse">
            <div className="h-12 w-12 rounded-full bg-[#EFF6FF] flex items-center justify-center">
              <Search className="h-5 w-5 text-[#2563EB]" />
            </div>
            <span className="font-semibold text-[#111827]">Browse</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-[120px] flex flex-col gap-3 border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-pink-50/50 transition-all duration-200 rounded-xl" asChild>
          <Link to="/buyer/favorites">
            <div className="h-12 w-12 rounded-full bg-pink-50 flex items-center justify-center">
              <Heart className="h-5 w-5 text-pink-500" />
            </div>
            <span className="font-semibold text-[#111827]">Saved</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-[120px] flex flex-col gap-3 border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-green-50/50 transition-all duration-200 rounded-xl" asChild>
          <Link to="/buyer/saved-searches">
            <div className="h-12 w-12 rounded-full bg-[#DCFCE7] flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-[#166534]" />
            </div>
            <span className="font-semibold text-[#111827]">Searches</span>
          </Link>
        </Button>
        <Button variant="outline" className="h-[120px] flex flex-col gap-3 border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-purple-50/50 transition-all duration-200 rounded-xl" asChild>
          <Link to="/buyer/messages">
            <div className="h-12 w-12 rounded-full bg-[#F5F3FF] flex items-center justify-center">
              <Mail className="h-5 w-5 text-[#7C3AED]" />
            </div>
            <span className="font-semibold text-[#111827]">Messages</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

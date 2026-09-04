import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, List, Mail, BarChart3 } from 'lucide-react';
import { Link } from 'react-router';

export function SellerQuickActions() {
  return (
    <Card className="h-full flex flex-col bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl">
      <CardHeader className="shrink-0 p-5 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold text-[#111827]">Quick Actions</CardTitle>
          <CardDescription className="text-[13px] text-[#64748B]">Manage your business listings and communications</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-5 pt-3">
        <div className="grid grid-cols-2 gap-4">
          <Link to="/seller/listings">
            <Button variant="outline" className="w-full h-auto py-5 flex flex-col gap-3 items-center justify-center bg-white/60 border-[#E5E9F2] hover:bg-white hover:border-[#DCE5F2] hover:shadow-md hover:-translate-y-0.5 rounded-xl transition-all group">
              <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">Add Listing</span>
            </Button>
          </Link>

          <Link to="/seller/listings">
            <Button variant="outline" className="w-full h-auto py-5 flex flex-col gap-3 items-center justify-center bg-white/60 border-[#E5E9F2] hover:bg-white hover:border-[#DCE5F2] hover:shadow-md hover:-translate-y-0.5 rounded-xl transition-all group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <List className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">Manage Listings</span>
            </Button>
          </Link>

          <Link to="/seller/enquiries">
            <Button variant="outline" className="w-full h-auto py-5 flex flex-col gap-3 items-center justify-center bg-white/60 border-[#E5E9F2] hover:bg-white hover:border-[#DCE5F2] hover:shadow-md hover:-translate-y-0.5 rounded-xl transition-all group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">View Enquiries</span>
            </Button>
          </Link>

          <Link to="/seller/analytics">
            <Button variant="outline" className="w-full h-auto py-5 flex flex-col gap-3 items-center justify-center bg-white/60 border-[#E5E9F2] hover:bg-white hover:border-[#DCE5F2] hover:shadow-md hover:-translate-y-0.5 rounded-xl transition-all group">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">View Analytics</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

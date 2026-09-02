import { useState, useMemo } from 'react';
import { useBuyerEnquiries } from '@/hooks/useEnquiries';
import { EnquiryCard } from '@/components/buyer/EnquiryCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Search, Filter } from 'lucide-react';
import { Link } from 'react-router';
import type { Enquiry } from '@/types/api';

export default function BuyerEnquiries() {
  const { data: enquiries = [], isLoading } = useBuyerEnquiries();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('updated-desc');

  const filteredEnquiries = useMemo(() => {
    let result = [...enquiries];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.listing?.title.toLowerCase().includes(q) ||
        e.seller?.name.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      const isResponded = (e: Enquiry) => (e.unreadCount && e.unreadCount > 0) || false;
      if (statusFilter === 'responded') {
        result = result.filter(e => isResponded(e));
      } else if (statusFilter === 'sent') {
        result = result.filter(e => !isResponded(e));
      }
    }

    switch (sortBy) {
      case 'updated-desc':
        result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'created-desc':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'created-asc':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    return result;
  }, [enquiries, searchQuery, statusFilter, sortBy]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading enquiries...</div>;
  }

  return (
    <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827]">My Enquiries</h1>
          <p className="text-[#64748B] mt-2 font-medium">
            Track and manage your communications with business sellers.
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-md border border-[#E5E9F2] text-[#2563EB] px-4 py-2.5 rounded-full font-semibold shadow-sm text-sm">
          {enquiries.length} Total Enquiries
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm">
          <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-[#EFF6FF]/50">
            <MessageSquare className="w-8 h-8 text-[#2563EB]" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-[#111827]">No enquiries yet</h3>
          <p className="text-[#64748B] mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
            When you find a business you're interested in, contact the seller. Your communications will appear here.
          </p>
          <Button size="lg" asChild className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md rounded-xl h-12 px-8 font-medium transition-all hover:shadow-lg">
            <Link to="/buyer/browse">Browse Businesses</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white/80 backdrop-blur-md p-5 rounded-xl border border-[#E5E9F2] shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
              <Input
                placeholder="Search by business, seller, or subject..."
                className="pl-10 h-10 bg-white/50 border-[#E5E9F2] text-[#334155] rounded-lg focus-visible:ring-[#2563EB] placeholder:text-[#64748B]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-10 bg-white/50 border-[#E5E9F2] text-[#334155] rounded-lg focus:ring-[#2563EB]">
                  <Filter className="w-4 h-4 mr-2 text-[#64748B]" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="sent">Awaiting Reply</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-10 bg-white/50 border-[#E5E9F2] text-[#334155] rounded-lg focus:ring-[#2563EB]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated-desc">Recently Updated</SelectItem>
                  <SelectItem value="created-desc">Newest First</SelectItem>
                  <SelectItem value="created-asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No enquiries match your search criteria.</p>
              <Button variant="link" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEnquiries.map(enquiry => (
                <EnquiryCard key={enquiry.id} enquiry={enquiry} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

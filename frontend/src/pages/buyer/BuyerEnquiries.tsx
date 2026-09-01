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
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Enquiries</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your communications with business sellers.
          </p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">
          {enquiries.length} Total Enquiries
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-xl border shadow-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No enquiries yet</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            When you find a business you're interested in, contact the seller. Your communications will appear here.
          </p>
          <Button size="lg" asChild>
            <Link to="/buyer/browse">Browse Businesses</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-4 rounded-xl border">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by business, seller, or subject..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
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
                <SelectTrigger className="w-[160px]">
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

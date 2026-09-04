import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { BuyerPageHeader } from '@/components/buyer/BuyerPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMyNdas } from '@/hooks/useNda';
import { NDAStatusBadge } from '@/components/buyer/nda/NDAStatusBadge';
import { NDAEmptyState } from '@/components/buyer/nda/NDAEmptyState';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';

export default function BuyerNDA() {
  const { data: ndas = [], isLoading } = useMyNdas();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Derived stats
  const totalRequests = ndas.length;
  const pendingCount = ndas.filter(n => n.status === 'REQUESTED').length;
  const approvedCount = ndas.filter(n => n.status === 'SIGNED').length;

  const expiringSoonCount = 0; // Not supported by backend yet

  // Filter and sort
  const filteredNDAs = ndas
    .filter(nda => {
      const businessName = nda.listing?.seller?.sellerProfile?.businessName || 'Business';
      const listingTitle = nda.listing?.title || 'Unknown Listing';
      const sellerName = (nda.listing?.seller as any)?.name || 'Unknown';
      
      const matchesSearch =
        businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sellerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || nda.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      return 0;
    });

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading NDAs...</div>;
  }

  return (
    <>
      <Seo title="NDA & Documents" description="Manage your Non-Disclosure Agreements and confidential documents." />

      <div className="w-full space-y-8 max-w-7xl mx-auto px-4 xl:px-0 mt-6">
        <BuyerPageHeader
          title="NDA & Documents"
          description="Manage your Non-Disclosure Agreements and view unlocked confidential business documents."
          // breadcrumbs={[{ label: 'NDA & Documents' }]}
        />

        {/* Summary Cards */}
        {totalRequests > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-[#2563EB]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0F172A]">{totalRequests}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0F172A]">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Approved NDAs</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0F172A]">{approvedCount}</div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Expiring Soon</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0F172A]">{expiringSoonCount}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <Input
              placeholder="Search by business, listing, or seller..."
              className="pl-10 h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus-visible:ring-[#2563EB] placeholder:text-[#64748B]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full sm:w-auto gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px] h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus:ring-[#2563EB]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="REQUESTED">Requested</SelectItem>
                <SelectItem value="SIGNED">Signed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px] h-10 bg-white/50 border-[#E2E8F0] text-[#0F172A] rounded-lg focus:ring-[#2563EB]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* NDA List */}
        {totalRequests === 0 ? (
          <NDAEmptyState />
        ) : filteredNDAs.length === 0 ? (
          <div className="text-center py-12 text-[#64748B] font-medium border border-[#E2E8F0] rounded-xl bg-white/60 backdrop-blur-md">
            No NDAs found matching your search criteria.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNDAs.map((nda) => (
              <Card
                key={nda.id}
                className="hover:border-[#2563EB]/50 transition-colors cursor-pointer group bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-sm rounded-xl overflow-hidden"
                onClick={() => navigate(`/buyer/nda/${nda.id}`)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <NDAStatusBadge status={nda.status} />
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider border-[#E2E8F0] text-[#64748B] bg-white/50">
                          Standard
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                        {nda.listing?.seller?.sellerProfile?.businessName || 'Business'}
                      </h3>
                      <p className="text-sm text-[#64748B] line-clamp-1">
                        Listing: {nda.listing?.title || 'Unknown Listing'}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 text-[13px] text-[#64748B] shrink-0 border-t border-[#E2E8F0]/50 md:border-t-0 pt-4 md:pt-0">
                      <div>
                        Seller: <span className="font-medium text-[#0F172A]">{(nda.listing?.seller as any)?.name || 'Unknown'}</span>
                      </div>
                      <div>
                        Updated {new Date(nda.signedAt || nda.requestedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

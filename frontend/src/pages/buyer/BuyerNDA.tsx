import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/PageHeader';
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
import { useBuyerStore } from '@/store/useBuyerStore';
import { NDAStatusBadge } from '@/components/buyer/nda/NDAStatusBadge';
import { NDAEmptyState } from '@/components/buyer/nda/NDAEmptyState';
import { useNavigate } from 'react-router';
import { Badge } from '@/components/ui/badge';

export default function BuyerNDA() {
  const { ndas } = useBuyerStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  // Derived stats
  const totalRequests = ndas.length;
  const pendingCount = ndas.filter(n => n.status === 'pending' || n.status === 'under-review').length;
  const approvedCount = ndas.filter(n => n.status === 'approved').length;

  const now = new Date();
  const expiringSoonCount = ndas.filter(n => {
    if (n.status !== 'approved' || !n.expiresAt) return false;
    const expiresDate = new Date(n.expiresAt);
    const diffTime = Math.abs(expiresDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Within 30 days
  }).length;

  // Filter and sort
  const filteredNDAs = ndas
    .filter(nda => {
      const matchesSearch =
        nda.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nda.listingTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nda.sellerName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || nda.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
      if (sortBy === 'oldest') return new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
      if (sortBy === 'updated') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      return 0;
    });

  return (
    <>
      <Seo title="NDA & Documents" description="Manage your Non-Disclosure Agreements and confidential documents." />

      <div className="max-w-6xl mx-auto space-y-6">
        <PageHeader
          title="NDA & Documents"
          description="Manage your Non-Disclosure Agreements and view unlocked confidential business documents."
          breadcrumbs={[{ label: 'NDA & Documents' }]}
        />

        {/* Summary Cards */}
        {totalRequests > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRequests}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved NDAs</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <AlertCircle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{expiringSoonCount}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by business, listing, or seller..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* NDA List */}
        {totalRequests === 0 ? (
          <NDAEmptyState />
        ) : filteredNDAs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card/50">
            No NDAs found matching your search criteria.
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredNDAs.map((nda) => (
              <Card
                key={nda.id}
                className="hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/buyer/nda/${nda.id}`)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <NDAStatusBadge status={nda.status} />
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                          {nda.type}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {nda.businessName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        Listing: {nda.listingTitle}
                      </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 text-sm text-muted-foreground shrink-0 border-t md:border-t-0 pt-4 md:pt-0">
                      <div>
                        Seller: <span className="font-medium text-foreground">{nda.sellerName}</span>
                      </div>
                      <div>
                        Updated {new Date(nda.updatedAt).toLocaleDateString()}
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

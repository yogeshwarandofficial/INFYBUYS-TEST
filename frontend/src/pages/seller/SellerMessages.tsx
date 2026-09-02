import { useState } from 'react';
import { Seo } from '@/components/shared/Seo';
import { Pagination } from '@/components/shared/Pagination';
import { useSellerStore } from '@/store/useSellerStore';
import { useSellerConversationSearch } from '@/hooks/useSellerConversationSearch';
import { SellerConversationCard } from '@/components/seller/messages/SellerConversationCard';
import { SellerConversationFilters } from '@/components/seller/messages/SellerConversationFilters';
import { SellerConversationSearch } from '@/components/seller/messages/SellerConversationSearch';
import { SellerEmptyMessages } from '@/components/seller/messages/SellerEmptyMessages';
import { SellerStatCard } from '@/components/seller/dashboard/SellerStatCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MessageSquare, Inbox, CheckCheck, Archive, SlidersHorizontal } from 'lucide-react';

export default function SellerMessages() {
  const { conversations, markAllConversationsAsRead } = useSellerStore();
  const search = useSellerConversationSearch();
  const {
    filters,
    updateFilter,
    paginated,
    currentPage,
    setCurrentPage,
    totalPages,
    totalCount,
    hasActiveFilters,
    resetFilters,
  } = search;

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Live KPI computations
  const totalConversations = conversations.length;
  const unreadCount = conversations.filter((c) => c.unreadCount > 0).length;
  const activeCount = conversations.filter((c) => c.status === 'active').length;
  const archivedCount = conversations.filter((c) => c.status === 'archived').length;

  // Determine empty variant
  const emptyVariant =
    conversations.length === 0
      ? 'no-conversations'
      : filters.status === 'archived'
      ? 'no-archived'
      : 'no-results';

  return (
    <>
      <Seo
        title="Messages"
        description="Manage conversations with buyers interested in your business listings."
      />

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto pb-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pt-2">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Messages</h1>
            <p className="text-[15px] text-[#64748B]">
              {totalCount} conversation{totalCount !== 1 ? 's' : ''} found
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllConversationsAsRead}
              className="gap-2 bg-white/60 border-[#E5E9F2] hover:bg-slate-50 text-[#111827] rounded-xl shadow-sm h-10 px-4"
              aria-label="Mark all conversations as read"
            >
              <CheckCheck className="w-4 h-4" aria-hidden="true" />
              Mark All Read
            </Button>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SellerStatCard
            title="Total"
            value={totalConversations}
            icon={MessageSquare}
            description="All conversations"
          />
          <SellerStatCard
            title="Unread"
            value={unreadCount}
            icon={Inbox}
            description="Need attention"
          />
          <SellerStatCard
            title="Active"
            value={activeCount}
            icon={CheckCheck}
            description="Ongoing"
          />
          <SellerStatCard
            title="Archived"
            value={archivedCount}
            icon={Archive}
            description="Archived"
          />
        </div>

        {/* Search + mobile filters trigger */}
        <div className="flex flex-wrap gap-4">
          <SellerConversationSearch
            value={filters.search}
            onChange={(v) => updateFilter('search', v)}
          />

          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative lg:hidden bg-white/60 border-[#E5E9F2] rounded-xl shadow-sm h-10 text-[#111827]" aria-label="Open filters">
                <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Conversations</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <SellerConversationFilters
                  filters={filters}
                  updateFilter={updateFilter}
                  resetFilters={resetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8 mt-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0" aria-label="Conversation filters">
            <div className="bg-white/85 backdrop-blur-md rounded-2xl border border-[#E5E9F2] shadow-sm shadow-blue-900/5 p-6 sticky top-24">
              <h2 className="font-bold text-base text-[#111827] mb-6">Filters</h2>
              <SellerConversationFilters
                filters={filters}
                updateFilter={updateFilter}
                resetFilters={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          {/* Conversation List */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <SellerEmptyMessages
                variant={emptyVariant}
                onClearFilters={hasActiveFilters ? resetFilters : undefined}
              />
            ) : (
              <>
                <div className="space-y-3">
                  {paginated.map((conversation) => (
                    <SellerConversationCard key={conversation.id} conversation={conversation} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

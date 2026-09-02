import { useAdminStore } from '../../store/useAdminStore';
import { useAdminConversationSearch } from '../../hooks/useAdminConversationSearch';
import { AdminConversationsTable } from '../../components/admin/messages/AdminConversationsTable';
import { AdminConversationCard } from '../../components/admin/messages/AdminConversationCard';
import { AdminConversationSearch } from '../../components/admin/messages/AdminConversationSearch';
import { AdminConversationFilters } from '../../components/admin/messages/AdminConversationFilters';
import { EmptyState } from '../../components/shared/EmptyState';
import { MessageSquare, MessagesSquare, Archive, Ban } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Filter } from 'lucide-react';

export default function AdminConversations() {
  const conversations = useAdminStore((state) => state.conversations);

  const {
    paginatedConversations,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    filters,
    setFilters,
    sorting,
    setSorting,
    resetFilters,
  } = useAdminConversationSearch();

  // KPI Calculations
  const totalConversations = conversations.length;
  const activeConversations = conversations.filter(c => c.status === 'active').length;
  const archivedConversations = conversations.filter(c => c.status === 'archived').length;
  const closedConversations = conversations.filter(c => c.status === 'closed').length;

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Messages & Conversations</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage {totalConversations} total buyer-seller conversations across the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="space-y-6 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between"><div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center"><MessagesSquare className="h-5 w-5" /></div></div><span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Total Conversations</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{totalConversations}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-50/80 text-purple-600 border border-purple-100/50 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Active Threads</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{activeConversations}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center">
                <Archive className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Archived</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{archivedConversations}</span>
          </div>
          <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-slate-50/80 text-slate-600 border border-slate-200/50 flex items-center justify-center">
                <Ban className="h-5 w-5" />
              </div>
            </div>
            <span className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider mt-4">Closed</span>
            <span className="text-3xl font-bold text-[#111827] mt-1">{closedConversations}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <AdminConversationFilters
                filters={filters}
                onFilterChange={setFilters}
                sorting={sorting}
                onSortChange={setSorting}
                onReset={resetFilters}
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Search and Mobile Filters */}
            <div className="flex items-center gap-2 bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-2">
              <AdminConversationSearch
                value={search}
                onChange={setSearch}
                className="flex-1"
              />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <AdminConversationFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    sorting={sorting}
                    onSortChange={setSorting}
                    onReset={resetFilters}
                  />
                </SheetContent>
              </Sheet>
            </div>

            {paginatedConversations.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-8 flex items-center justify-center">
                <div className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                <EmptyState
                title="No conversations found"
                description="No conversations match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
              </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <AdminConversationsTable conversations={paginatedConversations} />
                </div>

                {/* Mobile Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedConversations.map(conversation => (
                    <AdminConversationCard key={conversation.id} conversation={conversation} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

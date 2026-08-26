import { useAdminStore } from '../../store/useAdminStore';
import { useAdminConversationSearch } from '../../hooks/useAdminConversationSearch';
import { AdminConversationsTable } from '../../components/admin/messages/AdminConversationsTable';
import { AdminConversationCard } from '../../components/admin/messages/AdminConversationCard';
import { AdminConversationSearch } from '../../components/admin/messages/AdminConversationSearch';
import { AdminConversationFilters } from '../../components/admin/messages/AdminConversationFilters';
import { PageHeader } from '../../components/shared/PageHeader';
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
    <div className="flex flex-col min-h-screen pb-12">
      <PageHeader
        title="Messages & Conversations"
        description={`Manage ${totalConversations} total buyer-seller conversations across the platform`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Messages' }]}
      />

      {/* KPI Cards */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border rounded-xl p-4 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessagesSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Total Conversations</span>
            </div>
            <span className="text-2xl font-bold">{totalConversations}</span>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm font-medium">Active Threads</span>
            </div>
            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{activeConversations}</span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <Archive className="h-4 w-4" />
              <span className="text-sm font-medium">Archived</span>
            </div>
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{archivedConversations}</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Ban className="h-4 w-4" />
              <span className="text-sm font-medium">Closed</span>
            </div>
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-300">{closedConversations}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
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
            <div className="flex items-center gap-2">
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
              <EmptyState
                title="No conversations found"
                description="No conversations match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
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

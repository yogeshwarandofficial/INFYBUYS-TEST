import { useAdminUserSearch } from '../../hooks/useAdminUserSearch';
import { useAdminStore } from '../../store/useAdminStore';
import { AdminUsersTable } from '../../components/admin/users/AdminUsersTable';
import { AdminUserCard } from '../../components/admin/users/AdminUserCard';
import { AdminUserSearch } from '../../components/admin/users/AdminUserSearch';
import { AdminUserFilters } from '../../components/admin/users/AdminUserFilters';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, UserCheck, Store, ShieldAlert } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';

export default function AdminUsers() {
  const users = useAdminStore((state) => state.users);

  const {
    paginatedUsers,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch,
    filters,
    setFilters,
    sorting,
    setSorting,
    resetFilters
  } = useAdminUserSearch();

  // Calculate KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const sellers = users.filter((u) => u.role === 'seller').length;
  const suspendedUsers = users.filter((u) => u.status === 'suspended' || u.status === 'blocked').length;

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#111827]">Users Management</h1>
        <p className="text-[15px] text-[#64748B] mt-1">Manage {totalUsers} total users across the platform</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Total Users</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 border border-blue-100/50 flex items-center justify-center shrink-0"><Users className="h-5 w-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827] mt-1">{totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Active Users</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-emerald-50/80 text-emerald-600 border border-emerald-100/50 flex items-center justify-center shrink-0"><UserCheck className="h-5 w-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827] mt-1">{activeUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Sellers</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-purple-50/80 text-purple-600 border border-purple-100/50 flex items-center justify-center shrink-0"><Store className="h-5 w-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827] mt-1">{sellers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/85 backdrop-blur-md border border-[#E5E9F2] shadow-sm shadow-blue-900/5 rounded-2xl transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-[13px] font-semibold text-[#64748B] uppercase tracking-wider">Suspended / Blocked</CardTitle>
            <div className="w-10 h-10 rounded-xl bg-red-50/80 text-red-600 border border-red-100/50 flex items-center justify-center shrink-0"><ShieldAlert className="h-5 w-5" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#111827] mt-1">{suspendedUsers.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar Filters (Hidden on Mobile) */}
        <div className="hidden lg:block">
          <AdminUserFilters
            filters={filters}
            onFilterChange={setFilters}
            sorting={sorting}
            onSortingChange={setSorting}
            onReset={resetFilters}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6 min-w-0">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <AdminUserSearch value={search} onChange={setSearch} />
            <div className="lg:hidden">
              <AdminUserFilters
                filters={filters}
                onFilterChange={setFilters}
                sorting={sorting}
                onSortingChange={setSorting}
                onReset={resetFilters}
              />
            </div>
          </div>

          {/* Results List */}
          {paginatedUsers.length === 0 ? (
            <EmptyState
              title="No users found"
              description="No users match your current search and filter criteria."
              actionLabel="Clear Filters"
              onAction={resetFilters}
            />
          ) : (
            <div className="space-y-4">
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-4">
                {paginatedUsers.map((user) => (
                  <AdminUserCard key={user.id} user={user} />
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden lg:block overflow-hidden rounded-md border-[#E5E9F2] bg-white/85 backdrop-blur-md shadow-sm shadow-blue-900/5 rounded-2xl">
                <AdminUsersTable users={paginatedUsers} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-4 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

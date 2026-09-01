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
import { PageHeader } from '../../components/shared/PageHeader';

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
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <PageHeader
        title="Users Management"
        description={`Manage ${totalUsers} total users across the platform`}
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sellers</CardTitle>
            <Store className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sellers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended / Blocked</CardTitle>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspendedUsers.toLocaleString()}</div>
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
              <div className="hidden lg:block overflow-hidden rounded-md border bg-background">
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

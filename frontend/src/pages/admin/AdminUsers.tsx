import { useAdminUserSearch } from '../../hooks/useAdminUserSearch';
import { AdminUsersTable } from '../../components/admin/users/AdminUsersTable';
import { Users, UserCheck, Store, ShieldAlert, Plus, Search, SlidersHorizontal, ArrowDownWideNarrow } from 'lucide-react';
import { Pagination } from '../../components/shared/Pagination';
import { EmptyState } from '../../components/shared/EmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

import { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

export default function AdminUsers() {

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

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    sellers: 0,
    suspendedUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.get<any>('/admin/users/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      }
    };
    fetchStats();
  }, []);

  const totalUsers = stats.totalUsers;
  const activeUsers = stats.activeUsers;
  const sellers = stats.sellers;
  const suspendedUsers = stats.suspendedUsers;

  const activeFiltersCount = (filters.role && filters.role !== 'all' ? 1 : 0) +
    (filters.status && filters.status !== 'all' ? 1 : 0) +
    (filters.emailVerified && filters.emailVerified !== 'all' ? 1 : 0) +
    (filters.phoneVerified && filters.phoneVerified !== 'all' ? 1 : 0);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50">
      <div className="max-w-[1400px] mx-auto space-y-8 pb-12">
          
        {/* Page Header */}
        <div className="animate-fade-in flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h2>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <span>Manage <span className="font-semibold text-slate-700">{totalUsers}</span> total users across the platform</span>
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up delay-100">
          
          {/* Card 1: Total Users */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Users</h3>
              <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Users className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{totalUsers.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 2: Active Users */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users</h3>
              <div className="w-8 h-8 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <UserCheck className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{activeUsers.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 3: Sellers */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sellers</h3>
              <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Store className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{sellers.toLocaleString()}</span>
            </div>
          </div>

          {/* Card 4: Suspended / Blocked */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-subtle flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suspended / Blocked</h3>
              <div className="w-8 h-8 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <ShieldAlert className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 z-10">
              <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{suspendedUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Unified Table Container */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm animate-slide-up delay-200 overflow-hidden flex flex-col">
          
          {/* Top Gradient Accent Line */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-400"></div>

          {/* Unified Control Bar */}
          <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-slate-50/50">
            
            {/* Search */}
            <div className="relative group w-full xl:w-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search users by name, email..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full xl:w-72 focus:xl:w-80 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-sm"
              />
            </div>

            {/* Horizontal Filters */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Role Filter */}
              <Select value={filters.role || 'all'} onValueChange={(val) => setFilters({ role: val as any })}>
                <SelectTrigger className="flex items-center gap-2 px-3 py-1.5 h-auto bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 shadow-sm transition-all focus:ring-0 focus:ring-offset-0">
                  <span className="text-slate-400 font-normal">Role:</span> <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Status Filter */}
              <Select value={filters.status || 'all'} onValueChange={(val) => setFilters({ status: val as any })}>
                <SelectTrigger className="flex items-center gap-2 px-3 py-1.5 h-auto bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 shadow-sm transition-all focus:ring-0 focus:ring-offset-0">
                  <span className="text-slate-400 font-normal">Status:</span> <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>

              <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

              {/* Advanced Filters Toggle (Optional - simplified to Reset for now) */}
              {activeFiltersCount > 0 ? (
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-transparent hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-all"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Reset Filters
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-white text-[10px] font-bold shadow-sm border border-slate-200">{activeFiltersCount}</span>
                </button>
              ) : (
                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border border-transparent hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-all opacity-70">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
              )}

              {/* Sort */}
              <Select value={sorting} onValueChange={(val) => setSorting(val as any)}>
                <SelectTrigger className="flex items-center gap-2 px-3 py-1.5 h-auto bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 shadow-sm transition-all ml-auto xl:ml-0 focus:ring-0 focus:ring-offset-0">
                  <ArrowDownWideNarrow className="w-4 h-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                  <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                  <SelectItem value="lastLogin">Recent Login</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results List */}
          {paginatedUsers.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="No users found"
                description="No users match your current search and filter criteria."
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            </div>
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="overflow-x-auto">
                <AdminUsersTable users={paginatedUsers} />
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
                  <span>Showing page <span className="font-medium text-slate-900">{currentPage}</span> of <span className="font-medium text-slate-900">{totalPages}</span></span>
                  <div className="flex-1 w-full flex justify-end">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { apiClient, buildQueryString } from '../services/apiClient';
import type { AdminUserRole, AdminUserStatus, AdminUser } from '../store/useAdminStore';

export interface AdminUserFiltersState {
  role?: AdminUserRole | 'all';
  status?: AdminUserStatus | 'all';
  emailVerified?: boolean | 'all';
  phoneVerified?: boolean | 'all';
}

export type AdminUserSortOption = 'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'lastLogin';

export function useAdminUserSearch() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<AdminUserFiltersState>({
    role: 'all',
    status: 'all',
    emailVerified: 'all',
    phoneVerified: 'all',
  });
  const [sorting, setSorting] = useState<AdminUserSortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const query = buildQueryString({
          page: currentPage,
          limit: itemsPerPage,
          search: search || undefined,
          role: filters.role === 'all' ? undefined : filters.role,
          status: filters.status === 'all' ? undefined : filters.status,
          emailVerified: filters.emailVerified === 'all' ? undefined : filters.emailVerified,
          phoneVerified: filters.phoneVerified === 'all' ? undefined : filters.phoneVerified,
          sorting,
        });
        const res = await apiClient.get<{ data: AdminUser[]; total: number }>(`/admin/users${query}`);
        setUsers(res.data);
        setTotal(res.total);
      } catch (err) {
        console.error('Failed to fetch users', err);
      }
    };
    fetchUsers();
  }, [search, filters, sorting, currentPage]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: Partial<AdminUserFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleSortingChange = (newSorting: AdminUserSortOption) => {
    setSorting(newSorting);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearch('');
    setFilters({
      role: 'all',
      status: 'all',
      emailVerified: 'all',
      phoneVerified: 'all',
    });
    setSorting('newest');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    paginatedUsers: users,
    totalPages,
    currentPage,
    setCurrentPage,
    search,
    setSearch: handleSearchChange,
    filters,
    setFilters: handleFilterChange,
    sorting,
    setSorting: handleSortingChange,
    resetFilters,
  };
}

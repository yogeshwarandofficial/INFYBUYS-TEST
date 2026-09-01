import { useState, useMemo } from 'react';
import { useAdminStore } from '../store/useAdminStore';
import type { AdminUserRole, AdminUserStatus } from '../store/useAdminStore';

export interface AdminUserFiltersState {
  role?: AdminUserRole | 'all';
  status?: AdminUserStatus | 'all';
  emailVerified?: boolean | 'all';
  phoneVerified?: boolean | 'all';
}

export type AdminUserSortOption = 'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'lastLogin';

export function useAdminUserSearch() {
  const users = useAdminStore((state) => state.users);

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

  const filteredUsers = useMemo(() => {
    let result = [...users];

    // Search
    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(lowerSearch) ||
          u.email.toLowerCase().includes(lowerSearch) ||
          (u.company && u.company.toLowerCase().includes(lowerSearch)) ||
          (u.location && u.location.toLowerCase().includes(lowerSearch))
      );
    }

    // Filters
    if (filters.role && filters.role !== 'all') {
      result = result.filter((u) => u.role === filters.role);
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((u) => u.status === filters.status);
    }
    if (filters.emailVerified !== undefined && filters.emailVerified !== 'all') {
      result = result.filter((u) => u.emailVerified === filters.emailVerified);
    }
    if (filters.phoneVerified !== undefined && filters.phoneVerified !== 'all') {
      result = result.filter((u) => u.phoneVerified === filters.phoneVerified);
    }

    // Sort
    result.sort((a, b) => {
      switch (sorting) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'nameAsc':
          return a.name.localeCompare(b.name);
        case 'nameDesc':
          return b.name.localeCompare(a.name);
        case 'lastLogin':
          const aLogin = a.lastLoginAt ? new Date(a.lastLoginAt).getTime() : 0;
          const bLogin = b.lastLoginAt ? new Date(b.lastLoginAt).getTime() : 0;
          return bLogin - aLogin;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [users, search, filters, sorting]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return {
    filteredUsers,
    paginatedUsers,
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

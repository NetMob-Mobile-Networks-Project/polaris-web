import { useState, useEffect, useCallback } from 'react';
import { MetricsService, UserResponse, CreateUserRequest } from '@/lib/services/metrics';

export interface UseUsersDataReturn {
  users: UserResponse[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  createError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
  refetch: () => void;
  createUser: (userData: CreateUserRequest) => Promise<boolean>;
  deleteUser: (userId: number) => Promise<boolean>;
  setPage: (page: number) => void;
}

export function useUsersData(initialPageSize: number = 10): UseUsersDataReturn {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (page: number = currentPage) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MetricsService.getUsers(page, pageSize);
      setUsers(response.data.users);
      setTotalCount(response.data.total_count);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  const createUser = useCallback(async (userData: CreateUserRequest): Promise<boolean> => {
    setIsCreating(true);
    setCreateError(null);
    
    try {
      await MetricsService.createUser(userData);
      // Refresh the users list after successful creation
      await fetchUsers(currentPage);
      return true;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create user');
      console.error('Error creating user:', err);
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [fetchUsers, currentPage]);

  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await MetricsService.deleteUser(userId);
      // Refresh the users list after successful deletion
      await fetchUsers(currentPage);
      return true;
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete user');
      console.error('Error deleting user:', err);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [fetchUsers, currentPage]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchUsers(page);
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refetch = useCallback(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  return {
    users,
    totalCount,
    currentPage,
    pageSize,
    isLoading,
    error,
    isCreating,
    createError,
    isDeleting,
    deleteError,
    refetch,
    createUser,
    deleteUser,
    setPage
  };
} 
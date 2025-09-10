// Custom hooks for users management
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchUsers,
  fetchUserById,
  createUser,
  updateUser,
  deleteUser,
  clearError,
  setSelectedUser,
  clearSelectedUser,
} from '../store/usersSlice';
import type { User } from '../types';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, selectedUser, isLoading, error } = useAppSelector((state) => state.users);

  const loadUsers = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const loadUserById = useCallback((id: number) => {
    dispatch(fetchUserById(id));
  }, [dispatch]);

  const addUser = useCallback((userData: Omit<User, 'id'>) => {
    return dispatch(createUser(userData));
  }, [dispatch]);

  const editUser = useCallback((id: number, userData: Partial<User>) => {
    return dispatch(updateUser({ id, userData }));
  }, [dispatch]);

  const removeUser = useCallback((id: number) => {
    return dispatch(deleteUser(id));
  }, [dispatch]);

  const selectUser = useCallback((user: User) => {
    dispatch(setSelectedUser(user));
  }, [dispatch]);

  const deselectUser = useCallback(() => {
    dispatch(clearSelectedUser());
  }, [dispatch]);

  const clearUsersError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    users,
    selectedUser,
    isLoading,
    error,
    // Actions
    loadUsers,
    loadUserById,
    addUser,
    editUser,
    removeUser,
    selectUser,
    deselectUser,
    clearUsersError,
  };
};

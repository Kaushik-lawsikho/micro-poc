// Users page component
import React, { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import type { User } from '../types';
import UserCard from './UserCard';
import UserForm from './UserForm';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import './UsersPage.css';

const UsersPage: React.FC = () => {
  const {
    users,
    selectedUser,
    isLoading,
    error,
    loadUsers,
    addUser,
    editUser,
    removeUser,
    selectUser,
    deselectUser,
    clearUsersError,
  } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await removeUser(user.id);
        if (selectedUser?.id === user.id) {
          deselectUser();
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handleFormSubmit = async (userData: Omit<User, 'id'>) => {
    try {
      if (editingUser) {
        await editUser(editingUser.id, userData);
      } else {
        await addUser(userData);
        // Refresh the users list after creating a new user
        setTimeout(() => {
          loadUsers();
        }, 500);
      }
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  if (isLoading && users.length === 0) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Users Management</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreateUser}
          disabled={isLoading}
        >
          + Add User
        </button>
      </div>

      <ErrorAlert 
        error={error} 
        onClose={clearUsersError}
        title="Users Error"
      />

      <div className="users-content">
        <div className="users-list">
          <h2>Users ({Array.isArray(users) ? users.length : 0})</h2>
          {!Array.isArray(users) || users.length === 0 ? (
            <div className="empty-state">
              <p>No users found. Create your first user!</p>
            </div>
          ) : (
            <div className="users-grid">
              {Array.isArray(users) && users.map((user: User, index: number) => (
                <UserCard
                  key={user.id || `user-${index}`}
                  user={user}
                  onSelect={selectUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  isSelected={selectedUser?.id === user.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default UsersPage;

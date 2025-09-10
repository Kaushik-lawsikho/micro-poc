// User card component
import React from 'react';
import type { User } from '../types';
import './UserCard.css';

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  isSelected?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
}) => {
  const handleSelect = () => {
    onSelect?.(user);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(user);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(user);
  };

  return (
    <div 
      className={`user-card ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="user-info">
        <h3 className="user-name">{user.name}</h3>
        <p className="user-email">{user.email}</p>
        <span className="user-id">ID: {user.id}</span>
      </div>
      
      <div className="user-actions">
        {onEdit && (
          <button 
            className="btn btn-edit"
            onClick={handleEdit}
            title="Edit user"
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button 
            className="btn btn-delete"
            onClick={handleDelete}
            title="Delete user"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default UserCard;

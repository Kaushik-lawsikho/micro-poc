// Order card component
import React from 'react';
import type { Order } from '../types';
import './OrderCard.css';

interface OrderCardProps {
  order: Order;
  onSelect?: (order: Order) => void;
  onEdit?: (order: Order) => void;
  onDelete?: (order: Order) => void;
  isSelected?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false,
}) => {
  const handleSelect = () => {
    onSelect?.(order);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(order);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(order);
  };

  return (
    <div 
      className={`order-card ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
    >
      <div className="order-info">
        <h3 className="order-product">{order.product}</h3>
        <p className="order-amount">Amount: ${order.amount}</p>
        <span className="order-user-id">User ID: {order.userId}</span>
        <span className="order-id">Order ID: {order.id}</span>
      </div>
      
      <div className="order-actions">
        {onEdit && (
          <button 
            className="btn btn-edit"
            onClick={handleEdit}
            title="Edit order"
          >
            ✏️
          </button>
        )}
        {onDelete && (
          <button 
            className="btn btn-delete"
            onClick={handleDelete}
            title="Delete order"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;

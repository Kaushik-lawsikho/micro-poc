// Orders page component
import React, { useEffect, useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import type { Order } from '../types';
import OrderCard from './OrderCard';
import OrderForm from './OrderForm';
import LoadingSpinner from './LoadingSpinner';
import ErrorAlert from './ErrorAlert';
import './OrdersPage.css';

const OrdersPage: React.FC = () => {
  const {
    orders,
    selectedOrder,
    isLoading,
    error,
    loadOrders,
    addOrder,
    editOrder,
    removeOrder,
    selectOrder,
    deselectOrder,
    clearOrdersError,
  } = useOrders();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleCreateOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (window.confirm(`Are you sure you want to delete order for ${order.product}?`)) {
      try {
        await removeOrder(order.id);
        if (selectedOrder?.id === order.id) {
          deselectOrder();
        }
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleFormSubmit = async (orderData: Omit<Order, 'id'>) => {
    try {
      if (editingOrder) {
        await editOrder(editingOrder.id, orderData);
      } else {
        await addOrder(orderData);
        // Refresh the orders list after creating a new order
        setTimeout(() => {
          loadOrders();
        }, 500);
      }
      setShowForm(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  if (isLoading && orders.length === 0) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders Management</h1>
        <button 
          className="btn btn-primary"
          onClick={handleCreateOrder}
          disabled={isLoading}
        >
          + Add Order
        </button>
      </div>

      <ErrorAlert 
        error={error} 
        onClose={clearOrdersError}
        title="Orders Error"
      />

      <div className="orders-content">
        <div className="orders-list">
          <h2>Orders ({Array.isArray(orders) ? orders.length : 0})</h2>
          {!Array.isArray(orders) || orders.length === 0 ? (
            <div className="empty-state">
              <p>No orders found. Create your first order!</p>
            </div>
          ) : (
            <div className="orders-grid">
              {Array.isArray(orders) && orders.map((order, index: number) => (
                <OrderCard
                  key={order.id || `order-${index}`}
                  order={order}
                  onSelect={selectOrder}
                  onEdit={handleEditOrder}
                  onDelete={handleDeleteOrder}
                  isSelected={selectedOrder?.id === order.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <OrderForm
          order={editingOrder || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default OrdersPage;

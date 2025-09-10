// Order form component for creating and editing orders
import React, { useState, useEffect } from 'react';
import type { Order } from '../types';
import './OrderForm.css';

interface OrderFormProps {
  order?: Order;
  onSubmit: (orderData: Omit<Order, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  order,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    product: '',
    amount: '',
    userId: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (order) {
      setFormData({
        product: order.product || '',
        amount: order.amount?.toString() || '',
        userId: order.userId?.toString() || '',
      });
    } else {
      setFormData({
        product: '',
        amount: '',
        userId: '',
      });
    }
  }, [order]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.product.trim()) {
      newErrors.product = 'Product name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    } else if (isNaN(Number(formData.userId)) || Number(formData.userId) <= 0) {
      newErrors.userId = 'User ID must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        product: formData.product,
        amount: Number(formData.amount),
        userId: Number(formData.userId),
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="order-form-overlay">
      <div className="order-form">
        <h2>{order ? 'Edit Order' : 'Create Order'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="product">Product</label>
            <input
              type="text"
              id="product"
              name="product"
              value={formData.product}
              onChange={handleChange}
              className={errors.product ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter product name"
            />
            {errors.product && <span className="error-message">{errors.product}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="userId">User ID</label>
            <input
              type="number"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={errors.userId ? 'error' : ''}
              disabled={isLoading}
              placeholder="Enter user ID"
              min="1"
            />
            {errors.userId && <span className="error-message">{errors.userId}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (order ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;

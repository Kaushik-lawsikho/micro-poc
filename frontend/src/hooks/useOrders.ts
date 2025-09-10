// Custom hooks for orders management
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  fetchOrdersByUserId,
  clearError,
  setSelectedOrder,
  clearSelectedOrder,
} from '../store/ordersSlice';
import type { Order } from '../types';

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, selectedOrder, isLoading, error } = useAppSelector((state) => state.orders);

  const loadOrders = useCallback(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const loadOrderById = useCallback((id: number) => {
    dispatch(fetchOrderById(id));
  }, [dispatch]);

  const loadOrdersByUserId = useCallback((userId: number) => {
    dispatch(fetchOrdersByUserId(userId));
  }, [dispatch]);

  const addOrder = useCallback((orderData: Omit<Order, 'id'>) => {
    return dispatch(createOrder(orderData));
  }, [dispatch]);

  const editOrder = useCallback((id: number, orderData: Partial<Order>) => {
    return dispatch(updateOrder({ id, orderData }));
  }, [dispatch]);

  const removeOrder = useCallback((id: number) => {
    return dispatch(deleteOrder(id));
  }, [dispatch]);

  const selectOrder = useCallback((order: Order) => {
    dispatch(setSelectedOrder(order));
  }, [dispatch]);

  const deselectOrder = useCallback(() => {
    dispatch(clearSelectedOrder());
  }, [dispatch]);

  const clearOrdersError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    orders,
    selectedOrder,
    isLoading,
    error,
    // Actions
    loadOrders,
    loadOrderById,
    loadOrdersByUserId,
    addOrder,
    editOrder,
    removeOrder,
    selectOrder,
    deselectOrder,
    clearOrdersError,
  };
};

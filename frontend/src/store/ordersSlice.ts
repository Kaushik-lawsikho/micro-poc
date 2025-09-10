// Redux slice for orders management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { OrdersService } from '../services/ordersService';
import type { Order, OrdersState, ApiError } from '../types';

// Initial state
const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await OrdersService.getOrders();
      console.log('Orders API Response:', response);
      
      // Handle different response structures
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response && Array.isArray(response)) {
        return response;
      } else if (response && response.success && Array.isArray(response.data)) {
        return response.data;
      }
      
      console.warn('Unexpected response structure:', response);
      return [];
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await OrdersService.getOrderById(id);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData: Omit<Order, 'id'>, { rejectWithValue }) => {
    try {
      const response = await OrdersService.createOrder(orderData);
      console.log('Create Order Response:', response);
      
      // Handle different response structures
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else if (response && response.data) {
        return response.data;
      } else if (response && response.success && response.data) {
        return response.data;
      } else if (response) {
        return response;
      }
      
      console.warn('Unexpected create order response:', response);
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to create order');
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, orderData }: { id: number; orderData: Partial<Order> }, { rejectWithValue }) => {
    try {
      const response = await OrdersService.updateOrder(id, orderData);
      console.log('Update Order Response:', response);
      
      // Handle different response structures
      if (response && response.data && response.data.data) {
        return response.data.data;
      } else if (response && response.data) {
        return response.data;
      } else if (response && response.success && response.data) {
        return response.data;
      } else if (response) {
        return response;
      }
      
      console.warn('Unexpected update order response:', response);
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to update order');
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id: number, { rejectWithValue }) => {
    try {
      await OrdersService.deleteOrder(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to delete order');
    }
  }
);

export const fetchOrdersByUserId = createAsyncThunk(
  'orders/fetchOrdersByUserId',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await OrdersService.getOrdersByUserId(userId);
      return response.data || [];
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch orders for user');
    }
  }
);

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setSelectedOrder: (state, action: PayloadAction<Order>) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload || null;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.orders.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update order
    builder
      .addCase(updateOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.orders.findIndex(order => order.id === action.payload!.id);
          if (index !== -1) {
            state.orders[index] = action.payload!;
          }
          if (state.selectedOrder?.id === action.payload!.id) {
            state.selectedOrder = action.payload!;
          }
        }
        state.error = null;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = state.orders.filter(order => order.id !== action.payload);
        if (state.selectedOrder?.id === action.payload) {
          state.selectedOrder = null;
        }
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch orders by user ID
    builder
      .addCase(fetchOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedOrder, setSelectedOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

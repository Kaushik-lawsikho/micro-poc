// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import ordersReducer from './ordersSlice';
import type { RootState } from '../types';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

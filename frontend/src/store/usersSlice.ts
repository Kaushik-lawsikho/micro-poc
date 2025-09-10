// Redux slice for users management
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { UsersService } from '../services/usersService';
import type { User, UsersState, ApiError } from '../types';

// Initial state
const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersService.getUsers();
      console.log('Users API Response:', response);
      
      // Handle different response structures
      if (response && Array.isArray(response)) {
        return response;
      } else if (response && (response as any).data && Array.isArray((response as any).data)) {
        return (response as any).data;
      } else if (response && (response as any).data && (response as any).data.data && Array.isArray((response as any).data.data)) {
        return (response as any).data.data;
      } else if (response && (response as any).success && Array.isArray((response as any).data)) {
        return (response as any).data;
      }
      
      console.warn('Unexpected response structure:', response);
      return [];
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch users');
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await UsersService.getUserById(id);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to fetch user');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Omit<User, 'id'>, { rejectWithValue }) => {
    try {
      const response = await UsersService.createUser(userData);
      console.log('Create User Response:', response);
      
      // Handle different response structures
      if (response && (response as any).data && (response as any).data.data) {
        return (response as any).data.data;
      } else if (response && (response as any).data) {
        return (response as any).data;
      } else if (response && (response as any).success && (response as any).data) {
        return (response as any).data;
      } else if (response) {
        return response;
      }
      
      console.warn('Unexpected create user response:', response);
      return null;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to create user');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, userData }: { id: number; userData: Partial<User> }, { rejectWithValue }) => {
    try {
      const response = await UsersService.updateUser(id, userData);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to update user');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number, { rejectWithValue }) => {
    try {
      await UsersService.deleteUser(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message || 'Failed to delete user');
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSelectedUser: (state, action: PayloadAction<User>) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload || null;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.users.push(action.payload);
        }
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          const index = state.users.findIndex(user => user.id === action.payload!.id);
          if (index !== -1) {
            state.users[index] = action.payload!;
          }
          if (state.selectedUser?.id === action.payload!.id) {
            state.selectedUser = action.payload!;
          }
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSelectedUser, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminAPI } from '../services/api';

// Async thunks
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getUserById = createAsyncThunk(
  'admin/getUserById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getUserById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const getAllRoles = createAsyncThunk(
  'admin/getAllRoles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getAllRoles();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch roles');
    }
  }
);

export const getAdminDashboard = createAsyncThunk(
  'admin/getDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAPI.getDashboard();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin dashboard');
    }
  }
);

export const enableUser = createAsyncThunk(
  'admin/enableUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminAPI.enableUser(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to enable user');
    }
  }
);

export const disableUser = createAsyncThunk(
  'admin/disableUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await adminAPI.disableUser(id);
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to disable user');
    }
  }
);

const initialState = {
  users: [],
  selectedUser: null,
  roles: [],
  dashboard: null,
  loading: false,
  error: null,
  message: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User By ID
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get All Roles
      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Admin Dashboard
      .addCase(getAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      })
      .addCase(getAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Enable User
      .addCase(enableUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enableUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'User enabled successfully';
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex].enabled = true;
        }
      })
      .addCase(enableUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Disable User
      .addCase(disableUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disableUser.fulfilled, (state, action) => {
        state.loading = false;
        state.message = 'User disabled successfully';
        const userIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (userIndex !== -1) {
          state.users[userIndex].enabled = false;
        }
      })
      .addCase(disableUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
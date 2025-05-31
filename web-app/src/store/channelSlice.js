import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

// Async thunks
export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get('/channels');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

export const fetchChannelById = createAsyncThunk(
  'channels/fetchChannelById',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/channels/${channelId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel');
    }
  }
);

export const createChannel = createAsyncThunk(
  'channels/createChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/channels', channelData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel');
    }
  }
);

export const joinChannel = createAsyncThunk(
  'channels/joinChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/channels/${channelId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join channel');
    }
  }
);

export const leaveChannel = createAsyncThunk(
  'channels/leaveChannel',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/channels/${channelId}/leave`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave channel');
    }
  }
);

export const fetchChannelPosts = createAsyncThunk(
  'channels/fetchChannelPosts',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`/channels/${channelId}/posts`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'channels/createPost',
  async ({ channelId, postData }, { rejectWithValue }) => {
    try {
      const response = await apiService.post(`/channels/${channelId}/posts`, postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

const initialState = {
  channels: [],
  joinedChannels: [],
  currentChannel: null,
  currentChannelPosts: [],
  loading: false,
  error: null,
  postsLoading: false,
  postsError: null,
};

const channelSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.postsError = null;
    },
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    clearCurrentChannel: (state) => {
      state.currentChannel = null;
      state.currentChannelPosts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch channels
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload.allChannels || [];
        state.joinedChannels = action.payload.joinedChannels || [];
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch channel by ID
      .addCase(fetchChannelById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannelById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentChannel = action.payload;
      })
      .addCase(fetchChannelById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create channel
      .addCase(createChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.loading = false;
        state.channels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Join channel
      .addCase(joinChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.loading = false;
        // Add to joined channels if not already there
        const channelId = action.payload.channelId;
        const channel = state.channels.find(c => c.id === channelId);
        if (channel && !state.joinedChannels.some(c => c.id === channelId)) {
          state.joinedChannels.push(channel);
        }
      })
      .addCase(joinChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Leave channel
      .addCase(leaveChannel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from joined channels
        const channelId = action.payload.channelId;
        state.joinedChannels = state.joinedChannels.filter(c => c.id !== channelId);
      })
      .addCase(leaveChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch channel posts
      .addCase(fetchChannelPosts.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(fetchChannelPosts.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.currentChannelPosts = action.payload;
      })
      .addCase(fetchChannelPosts.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.postsLoading = true;
        state.postsError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.postsLoading = false;
        state.currentChannelPosts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.postsLoading = false;
        state.postsError = action.payload;
      });
  },
});

export const { clearError, setCurrentChannel, clearCurrentChannel } = channelSlice.actions;
export default channelSlice.reducer;
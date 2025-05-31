import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../services/api';

// Async thunks for channel operations
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
      return { channelId };
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
      return { channelId, posts: response.data };
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
      return { channelId, post: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

const channelSlice = createSlice({
  name: 'channels',
  initialState: {
    channels: [],
    joinedChannels: [],
    currentChannel: null,
    channelPosts: {},
    loading: false,
    error: null,
    createChannelLoading: false,
    joinChannelLoading: false,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannel = action.payload;
    },
    clearChannelError: (state) => {
      state.error = null;
    },
    clearChannelPosts: (state, action) => {
      if (action.payload) {
        delete state.channelPosts[action.payload];
      } else {
        state.channelPosts = {};
      }
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
      
      // Create channel
      .addCase(createChannel.pending, (state) => {
        state.createChannelLoading = true;
        state.error = null;
      })
      .addCase(createChannel.fulfilled, (state, action) => {
        state.createChannelLoading = false;
        state.channels.push(action.payload);
        state.joinedChannels.push(action.payload);
      })
      .addCase(createChannel.rejected, (state, action) => {
        state.createChannelLoading = false;
        state.error = action.payload;
      })
      
      // Join channel
      .addCase(joinChannel.pending, (state) => {
        state.joinChannelLoading = true;
        state.error = null;
      })
      .addCase(joinChannel.fulfilled, (state, action) => {
        state.joinChannelLoading = false;
        const channel = state.channels.find(c => c.id === action.payload.id);
        if (channel && !state.joinedChannels.find(c => c.id === channel.id)) {
          state.joinedChannels.push(channel);
        }
      })
      .addCase(joinChannel.rejected, (state, action) => {
        state.joinChannelLoading = false;
        state.error = action.payload;
      })
      
      // Leave channel
      .addCase(leaveChannel.fulfilled, (state, action) => {
        state.joinedChannels = state.joinedChannels.filter(
          c => c.id !== action.payload.channelId
        );
        if (state.currentChannel?.id === action.payload.channelId) {
          state.currentChannel = null;
        }
      })
      
      // Fetch channel posts
      .addCase(fetchChannelPosts.fulfilled, (state, action) => {
        state.channelPosts[action.payload.channelId] = action.payload.posts;
      })
      
      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        const { channelId, post } = action.payload;
        if (!state.channelPosts[channelId]) {
          state.channelPosts[channelId] = [];
        }
        state.channelPosts[channelId].unshift(post);
      });
  },
});

export const { setCurrentChannel, clearChannelError, clearChannelPosts } = channelSlice.actions;
export default channelSlice.reducer;
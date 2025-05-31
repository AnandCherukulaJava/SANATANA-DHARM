import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import adminReducer from './adminSlice';
import channelReducer from './channelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
    channels: channelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
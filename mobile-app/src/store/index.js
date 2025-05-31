import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import channelReducer from './channelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
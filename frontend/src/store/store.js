import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import animalsReducer from './slices/animalsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    animals: animalsReducer,
  },
});
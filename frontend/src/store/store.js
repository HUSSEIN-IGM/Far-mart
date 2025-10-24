import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import animalsReducer from './slices/animalsSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    animals: animalsReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
});
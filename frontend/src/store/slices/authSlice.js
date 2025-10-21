import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('🔑 Redux: Attempting login for:', email);
      const response = await authService.login(email, password);
      console.log('✅ Redux: Login successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Redux: Login failed', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('📝 Redux: Attempting registration for:', userData.email);
      const response = await authService.register(userData);
      console.log('✅ Redux: Registration successful, response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Redux: Registration failed', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'Registration failed';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: false, // Start as false, only set to true after successful API call
  },
  reducers: {
    logout: (state) => {
      console.log('🚪 Logging out user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        console.log('🔄 Login pending...');
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled with data:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        console.log('❌ Login rejected with error:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        console.log('🔄 Registration pending...');
        state.isLoading = true;
        state.error = null;
        state.isAuthenticated = false; // Ensure it's false during registration
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('✅ Registration fulfilled with data:', action.payload);
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.isAuthenticated = true; // Only set to true after successful API response
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        console.log('❌ Registration rejected with error:', action.payload);
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
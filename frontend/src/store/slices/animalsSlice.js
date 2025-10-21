import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { animalService } from '../../services/animalService';

export const fetchAnimals = createAsyncThunk(
  'animals/fetchAnimals',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await animalService.getAnimals(filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch animals'
      );
    }
  }
);

export const fetchAnimal = createAsyncThunk(
  'animals/fetchAnimal',
  async (animalId, { rejectWithValue }) => {
    try {
      const response = await animalService.getAnimal(animalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch animal'
      );
    }
  }
);

const animalsSlice = createSlice({
  name: 'animals',
  initialState: {
    animals: [],
    currentAnimal: null,
    isLoading: false,
    error: null,
    total: 0,
    pages: 0,
    currentPage: 1,
  },
  reducers: {
    clearCurrentAnimal: (state) => {
      state.currentAnimal = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch animals
      .addCase(fetchAnimals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnimals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.animals = action.payload.animals || action.payload;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.current_page;
      })
      .addCase(fetchAnimals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single animal
      .addCase(fetchAnimal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnimal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAnimal = action.payload.animal;
      })
      .addCase(fetchAnimal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentAnimal, clearError } = animalsSlice.actions;
export default animalsSlice.reducer;
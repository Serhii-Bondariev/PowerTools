// src/store/slices/productsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  filters: {
    category: null,
    priceRange: [0, 1000],
    sortBy: 'featured'
  }
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});

export const { setProducts, setLoading, setError, setFilters } = productsSlice.actions;
export default productsSlice.reducer;

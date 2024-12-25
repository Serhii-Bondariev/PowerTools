// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      let config = {};

      // Перевіряємо, чи дані приходять як FormData
      if (productData instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      } else {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      }

      console.log(
        'Sending product data:',
        productData instanceof FormData ? Object.fromEntries(productData) : productData
      );

      const { data } = await api.post('/products', productData, config);
      return data;
    } catch (error) {
      console.error('Error adding product:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Початковий стан
const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

// Слайс
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = productsSlice.actions;
export default productsSlice.reducer;

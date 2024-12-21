// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../services/productService';

// Асинхронні дії (thunks)
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchProducts();
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      return await createProduct(product);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      return await updateProduct(id, updatedData);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeProduct = createAsyncThunk(
  'products/removeProduct',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteProduct(id);
    } catch (error) {
      return rejectWithValue(error.response.data);
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
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((product) => product.id !== action.payload.id);
      });
  },
});

export const { setFilters } = productsSlice.actions;
export default productsSlice.reducer;

// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Отримання всіх продуктів
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/products');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Отримання продукту за ID
export const getProductById = createAsyncThunk(
  'products/getProductById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

// Створення нового продукту
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      let config = {};
      if (productData instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      }
      const { data } = await api.post('/api/products', productData, config); // Додано /api/
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

// Оновлення продукту
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      let config = {};
      if (productData instanceof FormData) {
        config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        };
      }
      const { data } = await api.put(`/api/products/${id}`, productData, config); // Додано /api/
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Видалення продукту
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`); // Додано /api/
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

// Початковий стан
const initialState = {
  items: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  searchQuery: '',
  filters: {
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Очищення помилок
    clearError: (state) => {
      state.error = null;
    },
    // Очищення поточного продукту
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    // Встановлення пошукового запиту
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Встановлення фільтрів
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Скидання фільтрів
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    // Встановлення поточної сторінки
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      })

      // Get Product By ID
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

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

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.currentProduct = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Селектори
export const selectAllProducts = (state) => state.products.items;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.error;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductSearchQuery = (state) => state.products.searchQuery;
export const selectProductPagination = (state) => ({
  currentPage: state.products.currentPage,
  totalPages: state.products.totalPages,
});

// Експорт actions
export const {
  clearError,
  clearCurrentProduct,
  setSearchQuery,
  setFilters,
  resetFilters,
  setCurrentPage,
} = productsSlice.actions;

// Експорт reducer
export default productsSlice.reducer;

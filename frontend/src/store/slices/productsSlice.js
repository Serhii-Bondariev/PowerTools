// src/store/slices/productsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Fetch featured products
export const getFeaturedProducts = createAsyncThunk('products/getFeaturedProducts', async () => {
  const response = await api.get('/api/products/featured');
  return response.data;
});

export const toggleFavorite = createAsyncThunk(
  'products/toggleFavorite',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/api/products/${productId}/favorite`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle favorite');
    }
  }
);

// Fetch all products
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

// Fetch product by ID
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

// Add a new product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const config =
        productData instanceof FormData
          ? { headers: { 'Content-Type': 'multipart/form-data' } }
          : {};
      const { data } = await api.post('/api/products', productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const config =
        productData instanceof FormData
          ? { headers: { 'Content-Type': 'multipart/form-data' } }
          : {};
      const { data } = await api.put(`/api/products/${id}`, productData, config);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/products/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);
// src/store/slices/productsSlice.js
// Initial state
const initialState = {
  items: [],
  featuredProducts: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  searchQuery: '',
  favorites: [],
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
    clearError(state) {
      state.error = null;
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialState.filters;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  // src/store/slices/productsSlice.js
  extraReducers: (builder) => {
    builder
      .addCase(getFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        const productId = action.payload._id;

        // Update featured products
        const featuredIndex = state.featuredProducts.findIndex((p) => p._id === productId);
        if (featuredIndex !== -1) {
          state.featuredProducts[featuredIndex] = action.payload;
        }

        // Update favorites list
        const favoriteIndex = state.favorites.indexOf(productId);
        if (favoriteIndex === -1) {
          state.favorites.push(productId);
        } else {
          state.favorites.splice(favoriteIndex, 1);
        }

        // Update items
        const itemIndex = state.items.findIndex((p) => p._id === productId);
        if (itemIndex !== -1) {
          state.items[itemIndex] = action.payload;
        }
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
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
      });
  },
});

export const {
  clearError,
  clearCurrentProduct,
  setSearchQuery,
  setFilters,
  resetFilters,
  setCurrentPage,
} = productsSlice.actions;

export default productsSlice.reducer;

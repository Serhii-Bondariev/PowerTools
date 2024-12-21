// src/store/slices/ordersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/orders'); // Змінено з /api/orders на /orders
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;

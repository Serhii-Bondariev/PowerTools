// frontend/src/store/slices/ordersSlice.js
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Допоміжні функції
const normalizeOrder = (order) => ({
  ...order,
  totalAmount: Number(order.totalAmount) || 0,
  createdAt: new Date(order.createdAt).toISOString(),
  updatedAt: new Date(order.updatedAt).toISOString(),
  status: order.status || 'pending',
});

const normalizeOrders = (orders) => orders.map(normalizeOrder);

// Базові селектори з мемоізацією
const selectOrdersState = (state) => state.orders;

export const selectAllOrders = createSelector([selectOrdersState], (state) => state.orders);

export const selectCurrentOrder = createSelector(
  [selectOrdersState],
  (state) => state.currentOrder
);

export const selectOrdersLoading = createSelector([selectOrdersState], (state) => state.loading);

export const selectOrdersError = createSelector([selectOrdersState], (state) => state.error);

export const selectOrdersSuccessMessage = createSelector(
  [selectOrdersState],
  (state) => state.successMessage
);

// Складні селектори
export const selectOrdersStats = createSelector([selectAllOrders], (orders) => {
  const validOrders = orders || [];
  return {
    total: validOrders.length,
    totalAmount: validOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0),
    byStatus: validOrders.reduce((acc, order) => {
      const status = order.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {}),
    averageOrderValue: validOrders.length
      ? validOrders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0) /
        validOrders.length
      : 0,
    recentOrders: validOrders.slice(0, 5),
  };
});

export const selectOrderById = createSelector(
  [selectAllOrders, (_, orderId) => orderId],
  (orders, orderId) => orders.find((order) => order._id === orderId)
);

export const selectOrdersByStatus = createSelector(
  [selectAllOrders, (_, status) => status],
  (orders, status) => orders.filter((order) => order.status === status)
);

export const selectOrdersByDateRange = createSelector(
  [selectAllOrders, (_, { startDate, endDate }) => ({ startDate, endDate })],
  (orders, { startDate, endDate }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  }
);

// Асинхронні дії
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Creating order:', orderData);
      const { data } = await api.post('/api/orders', orderData);
      return normalizeOrder(data);
    } catch (error) {
      console.error('Error creating order:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// Для адміна - отримання всіх замовлень
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/orders');
      console.log('Admin: Fetched all orders:', data);
      return normalizeOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Отримання деталей замовлення
// Отримання деталей замовлення
export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('Fetching order details for ID:', orderId);
      const { data } = await api.get(`/api/orders/${orderId}`);
      console.log('Order details response:', data);
      return normalizeOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);
// Для користувача - отримання своїх замовлень
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/orders/my-orders');
      console.log('User: Fetched my orders:', data);
      return normalizeOrders(data);
    } catch (error) {
      console.error('Error fetching my orders:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/status`, { status });
      return normalizeOrder(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/cancel`);
      return normalizeOrder(data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
    }
  }
);

export const downloadInvoice = createAsyncThunk(
  'orders/downloadInvoice',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download invoice');
    }
  }
);

// Новий функціонал для експорту даних
export const exportOrdersData = createAsyncThunk(
  'orders/exportData',
  async ({ format, dateRange }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      let orders = selectAllOrders(state);

      if (dateRange) {
        orders = selectOrdersByDateRange(state, dateRange);
      }

      const formattedData = orders.map((order) => ({
        ID: order._id,
        Date: new Date(order.createdAt).toLocaleDateString(),
        Customer: order.shippingAddress?.fullName || 'N/A',
        Status: order.status,
        Total: `$${order.totalAmount.toFixed(2)}`,
        Items: order.items?.length || 0,
      }));

      if (format === 'csv') {
        const csv = convertToCSV(formattedData);
        downloadFile(csv, 'orders.csv', 'text/csv');
      } else if (format === 'json') {
        const json = JSON.stringify(formattedData, null, 2);
        downloadFile(json, 'orders.json', 'application/json');
      }

      return { success: true };
    } catch (error) {
      return rejectWithValue('Failed to export orders data');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  successMessage: null,
  lastUpdate: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    updateLastSync: (state) => {
      state.lastUpdate = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentOrder = null;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.unshift(action.payload);
        state.currentOrder = action.payload;
        state.successMessage = 'Order created successfully';
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get User Orders
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
        state.successMessage = 'Order status updated successfully';
        state.lastUpdate = new Date().toISOString();
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
        state.successMessage = 'Order cancelled successfully';
        state.lastUpdate = new Date().toISOString();
      })

      // Download Invoice
      .addCase(downloadInvoice.fulfilled, (state) => {
        state.successMessage = 'Invoice downloaded successfully';
      });
  },
});

// Допоміжні функції
function convertToCSV(data) {
  const headers = Object.keys(data[0]);
  const rows = data.map((obj) => headers.map((header) => obj[header]));
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const { clearError, clearSuccessMessage, clearCurrentOrder, updateLastSync } =
  ordersSlice.actions;

export default ordersSlice.reducer;

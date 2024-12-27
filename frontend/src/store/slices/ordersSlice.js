import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/axios';

// Створення замовлення
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      console.log('Sending order data:', orderData);
      const { data } = await api.post('/api/orders', orderData);
      return data;
    } catch (error) {
      console.error('Error creating order:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || 'Failed to create order');
    }
  }
);

// Отримання всіх замовлень користувача
export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/api/orders/my-orders');
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

// Отримання деталей замовлення
export const getOrderDetails = createAsyncThunk(
  'orders/getOrderDetails',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/api/orders/${orderId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
    }
  }
);

// Оновлення статусу замовлення (для адміна)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/status`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
    }
  }
);

// Нові функції
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/api/orders/${orderId}/cancel`);
      return data;
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
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to download invoice');
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  successMessage: null,
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
  },
  extraReducers: (builder) => {
    builder
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
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Order Details
      .addCase(getOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
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
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Нові обробники
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
        state.successMessage = 'Order cancelled successfully';
      })
      .addCase(downloadInvoice.fulfilled, (state) => {
        state.successMessage = 'Invoice downloaded successfully';
      });
  },
});

// Додаткові селектори
export const selectOrderById = (state, orderId) =>
  state.orders.orders.find((order) => order._id === orderId);

export const selectOrdersByStatus = (state, status) =>
  state.orders.orders.filter((order) => order.status === status);

export const selectOrdersStats = (state) => {
  const orders = state.orders.orders;
  return {
    total: orders.length,
    totalAmount: orders.reduce((sum, order) => sum + order.totalAmount, 0),
    byStatus: orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}),
  };
};

// Базові селектори
export const selectAllOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectOrdersSuccessMessage = (state) => state.orders.successMessage;

export const { clearError, clearSuccessMessage, clearCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
// // src/store/slices/ordersSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../utils/axios';

// // export const selectCurrentOrder = (state) => state.orders.currentOrder;

// // Створення замовлення
// export const createOrder = createAsyncThunk(
//   'orders/createOrder',
//   async (orderData, { rejectWithValue }) => {
//     try {
//       console.log('Sending order data:', orderData); // Для відладки
//       const { data } = await api.post('/api/orders', orderData);
//       return data;
//     } catch (error) {
//       console.error('Error creating order:', error.response?.data); // Для відладки
//       return rejectWithValue(error.response?.data?.message || 'Failed to create order');
//     }
//   }
// );

// // Отримання всіх замовлень користувача
// export const getUserOrders = createAsyncThunk(
//   'orders/getUserOrders',
//   async (_, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get('/api/orders/my-orders');
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
//     }
//   }
// );

// // Отримання деталей замовлення
// export const getOrderDetails = createAsyncThunk(
//   'orders/getOrderDetails',
//   async (orderId, { rejectWithValue }) => {
//     try {
//       const { data } = await api.get(`/api/orders/${orderId}`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
//     }
//   }
// );

// // Оновлення статусу замовлення (для адміна)
// export const updateOrderStatus = createAsyncThunk(
//   'orders/updateOrderStatus',
//   async ({ orderId, status }, { rejectWithValue }) => {
//     try {
//       const { data } = await api.put(`/api/orders/${orderId}/status`, { status });
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
//     }
//   }
// );

// const initialState = {
//   orders: [],
//   currentOrder: null,
//   loading: false,
//   error: null,
//   successMessage: null,
// };

// const ordersSlice = createSlice({
//   name: 'orders',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccessMessage: (state) => {
//       state.successMessage = null;
//     },
//     clearCurrentOrder: (state) => {
//       state.currentOrder = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Create Order
//       .addCase(createOrder.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createOrder.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders.unshift(action.payload);
//         state.currentOrder = action.payload;
//         state.successMessage = 'Order created successfully';
//       })
//       .addCase(createOrder.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get User Orders
//       .addCase(getUserOrders.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserOrders.fulfilled, (state, action) => {
//         state.loading = false;
//         state.orders = action.payload;
//       })
//       .addCase(getUserOrders.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Get Order Details
//       .addCase(getOrderDetails.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getOrderDetails.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrder = action.payload;
//       })
//       .addCase(getOrderDetails.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       // Update Order Status
//       .addCase(updateOrderStatus.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateOrderStatus.fulfilled, (state, action) => {
//         state.loading = false;
//         state.currentOrder = action.payload;
//         state.orders = state.orders.map((order) =>
//           order._id === action.payload._id ? action.payload : order
//         );
//         state.successMessage = 'Order status updated successfully';
//       })
//       .addCase(updateOrderStatus.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Селектори
// export const selectAllOrders = (state) => state.orders.orders;
// export const selectCurrentOrder = (state) => state.orders.currentOrder;
// export const selectOrdersLoading = (state) => state.orders.loading;
// export const selectOrdersError = (state) => state.orders.error;
// export const selectOrdersSuccessMessage = (state) => state.orders.successMessage;

// // Actions
// export const { clearError, clearSuccessMessage, clearCurrentOrder } = ordersSlice.actions;

// export default ordersSlice.reducer;

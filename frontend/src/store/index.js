// // src/store/index.js
// import { configureStore } from '@reduxjs/toolkit';
// import productsReducer from './slices/productsSlice';
// import cartReducer from './slices/cartSlice';
// import authReducer from './slices/authSlice';
// import ordersReducer from './slices/ordersSlice';
// import userReducer from './slices/userSlice';

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     products: productsReducer,
//     cart: cartReducer,
//     auth: authReducer,
//     orders: ordersReducer,
//   },
// });

// export default store;
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productsSlice';
import orderReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

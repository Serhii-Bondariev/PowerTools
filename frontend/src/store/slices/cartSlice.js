// // src/store/slices/cartSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   items: [],
//   isLoading: false,
//   error: null
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addItem: (state, action) => {
//       const { product, quantity = 1 } = action.payload;
//       const existingItem = state.items.find(item => item.id === product.id);

//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         state.items.push({ ...product, quantity });
//       }
//     },
//     removeItem: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//     },
//     updateQuantity: (state, action) => {
//       const { productId, quantity } = action.payload;
//       const item = state.items.find(item => item.id === productId);
//       if (item && quantity > 0) {
//         item.quantity = quantity;
//       }
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setError: (state, action) => {
//       state.error = action.payload;
//     }
//   }
// });

// export const {
//   addItem,
//   removeItem,
//   updateQuantity,
//   clearCart,
//   setLoading,
//   setError
// } = cartSlice.actions;

// export default cartSlice.reducer;
// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { _id, name, price, image } = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          _id,
          name,
          price,
          image,
          quantity: 1,
        });
      }
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === productId);
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setLoading, setError } =
  cartSlice.actions;

// Селектори
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemsCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

export default cartSlice.reducer;

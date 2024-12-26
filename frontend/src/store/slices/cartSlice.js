// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Отримуємо початковий стан з localStorage або використовуємо пустий масив
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : { items: [], isLoading: false, error: null };
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return { items: [], isLoading: false, error: null };
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { _id, name, price, image, stock } = action.payload;
      const existingItem = state.items.find((item) => item._id === _id);

      if (existingItem) {
        // Перевіряємо наявність товару перед збільшенням кількості
        if (existingItem.quantity < stock) {
          existingItem.quantity += 1;
        }
      } else {
        state.items.push({
          _id,
          name,
          price,
          image,
          stock,
          quantity: 1,
        });
      }
      // Зберігаємо в localStorage
      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item._id === productId);
      if (item && quantity > 0 && quantity <= item.stock) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem('cart');
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

// Додаткові селектори
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCartTax = (state) => selectCartSubtotal(state) * 0.1;

export const selectCartShipping = (state) => (state.cart.items.length > 0 ? 9.99 : 0);

export const selectCartGrandTotal = (state) =>
  selectCartSubtotal(state) + selectCartTax(state) + selectCartShipping(state);

export const selectIsCartEmpty = (state) => state.cart.items.length === 0;

export default cartSlice.reducer;

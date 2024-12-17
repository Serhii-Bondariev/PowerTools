// src/hooks/useCart.js
import { useState, useCallback } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal
  };
}

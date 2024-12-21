// src/pages/cart/CartPage.jsx
import React from 'react';
import { Cart } from '../../components/features/cart/Cart';

export function CartPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <Cart />
      </div>
    </div>
  );
}

export default CartPage; // Додаємо default export

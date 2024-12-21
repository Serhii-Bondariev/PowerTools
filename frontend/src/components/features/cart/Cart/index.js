// src/components/features/cart/Cart/index.js
import React from 'react';
import { useSelector } from 'react-redux';
import { ShoppingBag } from 'lucide-react';

export function Cart() {
  const cartItems = useSelector(state => state.cart.items);

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">Cart is empty</h2>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Вміст корзини */}
    </div>
  );
}

export default Cart;
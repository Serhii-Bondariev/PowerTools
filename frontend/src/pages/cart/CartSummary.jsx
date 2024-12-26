// src/pages/cart/CartSummary.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export function CartSummary({ items }) {
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 9.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    // Тут можна додати логіку оформлення замовлення
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleCheckout}
        className="w-full mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

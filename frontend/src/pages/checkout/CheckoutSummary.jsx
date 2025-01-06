// src/pages/checkout/CheckoutSummary.jsx
import React from 'react';

export function CheckoutSummary({ items }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item._id} className="flex justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <img src={item.image} alt={item.name} className="w-12 h-12 bg-transparent mg-2" />
              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
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
        <div className="flex justify-between font-semibold text-lg border-t pt-2 mt-2">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

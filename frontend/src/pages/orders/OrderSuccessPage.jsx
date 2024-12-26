// src/pages/orders/OrderSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Order Placed Successfully!</h1>
          <p className="mt-2 text-lg text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="mt-8 space-x-4">
            <Link
              to="/orders"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              View Orders
            </Link>
            <Link
              to="/"
              className="inline-block bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;

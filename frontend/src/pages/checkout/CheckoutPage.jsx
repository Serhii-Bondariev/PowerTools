// src/pages/checkout/CheckoutPage.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/ordersSlice';
import { clearCart } from '../../store/slices/cartSlice';
import { CheckoutForm } from './CheckoutForm'; // Використовуємо named import
import { CheckoutSummary } from './CheckoutSummary'; // Використовуємо named import

export function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmitOrder = async (formData) => {
    try {
      setIsProcessing(true);
      setError(null);

      // Перевірка наявності товарів
      if (!cartItems || cartItems.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Розрахунок загальної суми
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = 9.99;
      const tax = subtotal * 0.1;
      const totalAmount = subtotal + shipping + tax;

      // Підготовка даних для замовлення
      const orderData = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country || 'Ukraine',
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: totalAmount,
      };

      console.log('Sending order data:', orderData); // Для відладки

      const result = await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate('/orders/success', { state: { orderId: result._id } });
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err.message || 'Failed to create order');
    } finally {
      setIsProcessing(false);
    }
  };

  // Якщо користувач не авторизований
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to continue</h2>
            <button
              onClick={() => navigate('/login', { state: { from: '/checkout' } })}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handleSubmitOrder}
              isProcessing={isProcessing}
              initialData={{
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phone || '',
                country: 'Ukraine',
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <CheckoutSummary items={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

// src/pages/checkout/CheckoutPage.jsx
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../store/slices/cartSlice';
import { createOrder } from '../../store/slices/ordersSlice';
import { CheckoutForm } from './CheckoutForm';
import { CheckoutSummary } from './CheckoutSummary';

export function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitOrder = async (formData) => {
    try {
      setIsProcessing(true);

      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateTotal(items),
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate('/orders/success');
    } catch (error) {
      console.error('Failed to create order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotal = (items) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 9.99;
    const tax = subtotal * 0.1;
    return subtotal + shipping + tax;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please login to continue</h2>
            <button
              onClick={() => navigate('/login')}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm
              onSubmit={handleSubmitOrder}
              isProcessing={isProcessing}
              initialData={{
                fullName: user.firstName + ' ' + user.lastName,
                email: user.email,
                phone: user.phone,
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <CheckoutSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

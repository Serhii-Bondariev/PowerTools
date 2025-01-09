// src/pages/orders/OrderDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Package, Clock, MapPin, CreditCard, AlertTriangle } from 'lucide-react';
import {
  getOrderDetails,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
} from '../../store/slices/ordersSlice';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';
import { formatPrice, formatDate } from '../../utils/helpers';

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const order = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (orderId) {
      console.log('Fetching order details for ID:', orderId);
      dispatch(getOrderDetails(orderId))
        .unwrap()
        .then((data) => {
          console.log('Order details received:', data);
        })
        .catch((error) => {
          console.error('Error fetching order:', error);
        });
    }
  }, [dispatch, orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-red-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-red-600">Error</h2>
          </div>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto bg-yellow-50 p-6 rounded-lg">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-yellow-600">Order Not Found</h2>
          </div>
          <p className="mt-2 text-yellow-600">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/orders" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${getStatusColor(order.status)}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Items */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center border-b pb-4">
                  <img
                    src={`http://localhost:5000${item.product?.image}`}
                    alt={item.product?.name}
                    className="w-20 h-20 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = '/images/placeholder-image.png';
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.product?.name}</h3>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Price: {formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || colors.pending;
}

export default OrderDetailsPage;

// src/pages/orders/OrderDetailsPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Download } from 'lucide-react';
import api from '../../utils/axios';
import {
  getOrderDetails,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
} from '../../store/slices/ordersSlice';
import { formatPrice, formatDate } from '../../utils/formatters';
import { PLACEHOLDER_IMAGE } from '../../utils/constants';

export function OrderDetailsPage() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId]);

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (isLoading) return <OrderDetailsSkeleton />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/orders" className="mr-4 text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.slice(-8)}</h1>
          </div>
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'processing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-200 pt-6">
              {order.items.map((item) => (
                <div key={item._id} className="flex items-center py-4 border-b border-gray-200">
                  <img
                    src={`http://localhost:5000${item.product.image}`}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                      e.target.onerror = null;
                    }}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-medium">{item.product.name}</h3>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>{formatPrice(order.totalAmount)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mt-4">
                <p>Total</p>
                <p className="text-lg font-bold">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;

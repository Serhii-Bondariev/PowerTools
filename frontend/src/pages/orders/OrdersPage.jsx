// src/pages/orders/OrdersPage.jsx
import React, { useEffect } from 'react';
import api from '../../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Package, Eye, Download } from 'lucide-react';
import {
  getUserOrders,
  selectAllOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '../../store/slices/ordersSlice';
import { formatPrice, formatDate } from '../../utils/formatters';
import { STATUS_COLORS, PLACEHOLDER_IMAGE } from '../../utils/constants';
import { getImageUrl } from '../../utils/helpers';

export function OrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleDownloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/api/orders/${orderId}/invoice`, {
        responseType: 'blob',
        headers: {
          Accept: 'application/pdf',
        },
      });

      if (!response.data) {
        throw new Error('No data received');
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;

      // Додаємо посилання до документу
      document.body.appendChild(link);

      // Симулюємо клік
      link.click();

      // Видаляємо посилання та звільняємо URL
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Invoice downloaded successfully');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">No orders found</h2>
            <p className="mt-1 text-sm text-gray-500">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h2>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      STATUS_COLORS[order.status.toLowerCase()]
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Order Items */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {order.items.map((item) => (
                        <li key={item._id} className="py-6 flex">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={`http://localhost:5000${item.product.image}`}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = '/images/placeholder-image.png';
                                e.target.onerror = null;
                              }}
                            />
                          </div>
                          {/* Product Details */}
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p className="ml-4">{formatPrice(item.price)}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Order Summary and Actions */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        className="flex items-center text-green-600 hover:text-green-800"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download Invoice
                      </button>
                    </div>
                    <div className="text-lg font-bold">Total: {formatPrice(order.totalAmount)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrdersSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrdersPage;

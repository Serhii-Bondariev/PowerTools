// src/pages/orders/UserOrdersPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Clock } from 'lucide-react';
import { getMyOrders, selectAllOrders, selectOrdersLoading } from '../../store/slices/ordersSlice';

export function UserOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    console.log('Fetching user orders...');
    dispatch(getMyOrders())
      .unwrap()
      .then((data) => {
        console.log('Orders received:', data);
      })
      .catch((error) => {
        console.error('Error fetching orders:', error);
      });
  }, [dispatch]);

  console.log('Current orders in state:', orders); // Додаємо для відладки

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">Start shopping to place your first order</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Products
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
              {/* Order Header */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">
                      Order #{order._id.slice(-8)}
                    </h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mt-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center py-4 border-t">
                      <img
                        src={`http://localhost:5000${item.product?.image}`}
                        alt={item.product?.name}
                        className="h-16 w-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-image.png';
                        }}
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium">{item.product?.name}</h3>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Total Amount: <span className="font-medium">${order.totalAmount}</span>
                  </div>
                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
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

export default UserOrdersPage;

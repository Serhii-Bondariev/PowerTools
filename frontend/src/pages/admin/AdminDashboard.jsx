// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { format } from 'date-fns'; // Додаємо імпорт

import { StatCard } from './dashboard/StatCard';
import { OrdersChart } from './dashboard/OrdersChart';
import { RecentOrders } from './dashboard/RecentOrders';
import { DashboardSkeleton } from '../../components/ui/loaders/DashboardSkeleton';
import { ErrorAlert } from '../../components/ui/ErrorAlert';
import { getUserOrders, selectOrdersStats } from '../../store/slices/ordersSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const stats = useSelector(selectOrdersStats);
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [orderChartData, setOrderChartData] = useState([]);

  // Функція форматування даних для графіка
  const formatChartData = (orders) => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      })
      .reverse();

    return last7Days.map((date) => ({
      date: format(new Date(date), 'MMM dd'),
      orders: orders.filter((order) => order.createdAt.split('T')[0] === date).length,
      revenue: orders
        .filter((order) => order.createdAt.split('T')[0] === date)
        .reduce((sum, order) => sum + order.totalAmount, 0),
    }));
  };

  useEffect(() => {
    console.log('Raw orders data:', orders);
  }, [orders]);

  // Отримуємо замовлення при монтуванні
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Оновлюємо дані графіка при зміні замовлень
  useEffect(() => {
    console.log('Raw orders data:', orders);
    if (orders.length > 0) {
      const formattedData = formatChartData(orders);
      console.log('Formatted chart data:', formattedData);
      setOrderChartData(formattedData);
    }
  }, [orders]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  // Статистика для відображення
  const dashboardStats = [
    {
      title: 'Total Orders',
      value: stats.total || 0,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Revenue',
      value: `$${(stats.totalAmount || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Orders',
      value: stats.byStatus?.pending || 0,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Delivered Orders',
      value: stats.byStatus?.delivered || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart data={orderChartData} />

        {/* Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats.byStatus || {}).map(([status, count]) => (
              <div key={status} className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
                  />
                </div>
                <span className="ml-4 text-sm text-gray-600 min-w-[100px]">
                  {status}: {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={orders.slice(0, 5)} />
    </div>
  );
};

export default AdminDashboard;

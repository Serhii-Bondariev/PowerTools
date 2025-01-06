// src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Package,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Download,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { format, parseISO, startOfDay, endOfDay, subDays } from 'date-fns';
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
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('week');
  const [exportFormat, setExportFormat] = useState('csv');

  // Мемоізовані статистичні дані
  const dashboardStats = useMemo(
    () => [
      {
        title: 'Total Orders',
        value: stats.total || 0,
        icon: Package,
        color: 'bg-blue-500',
        change: '+12%',
        period: 'vs last week',
      },
      {
        title: 'Total Revenue',
        value: `$${(stats.totalAmount || 0).toFixed(2)}`,
        icon: DollarSign,
        color: 'bg-green-500',
        change: '+23%',
        period: 'vs last week',
      },
      {
        title: 'Pending Orders',
        value: stats.byStatus?.pending || 0,
        icon: AlertTriangle,
        color: 'bg-yellow-500',
        change: '-5%',
        period: 'vs last week',
      },
      {
        title: 'Delivered Orders',
        value: stats.byStatus?.delivered || 0,
        icon: TrendingUp,
        color: 'bg-purple-500',
        change: '+18%',
        period: 'vs last week',
      },
    ],
    [stats]
  );

  // Функція оновлення даних
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await dispatch(getUserOrders()).unwrap();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Функція експорту даних
  const handleExport = (format) => {
    const exportData = orders.map((order) => ({
      ID: order._id,
      Date: format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm'),
      Customer: `${order.user?.firstName} ${order.user?.lastName}`,
      Amount: order.totalAmount,
      Status: order.status,
      Items: order.items.length,
    }));

    let content;
    let mimeType;
    let fileExtension;

    if (format === 'csv') {
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map((row) => headers.map((header) => row[header]).join(',')),
      ].join('\n');
      content = csvContent;
      mimeType = 'text/csv';
      fileExtension = 'csv';
    } else {
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders-export.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Отримання даних при монтуванні
  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  // Автоматичне оновлення кожні 5 хвилин
  useEffect(() => {
    const interval = setInterval(handleRefresh, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) return <DashboardSkeleton />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* Період */}
          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {/* Експорт */}
          <div className="flex items-center space-x-2">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={() => handleExport(exportFormat)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Оновлення */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2 ${
              refreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Графіки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart data={orders} />

        {/* Розподіл статусів */}
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

      {/* Останні замовлення */}
      <RecentOrders orders={orders.slice(0, 5)} onRefresh={handleRefresh} loading={refreshing} />
    </div>
  );
};

export default AdminDashboard;

// // src/pages/admin/AdminDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
// import { format } from 'date-fns'; // Додаємо імпорт

// import { StatCard } from './dashboard/StatCard';
// import { OrdersChart } from './dashboard/OrdersChart';
// import { RecentOrders } from './dashboard/RecentOrders';
// import { DashboardSkeleton } from '../../components/ui/loaders/DashboardSkeleton';
// import { ErrorAlert } from '../../components/ui/ErrorAlert';
// import { getUserOrders, selectOrdersStats } from '../../store/slices/ordersSlice';

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const stats = useSelector(selectOrdersStats);
//   const { orders, loading, error } = useSelector((state) => state.orders);
//   const [orderChartData, setOrderChartData] = useState([]);

//   // Функція форматування даних для графіка
//   const formatChartData = (orders) => {
//     const last7Days = [...Array(7)]
//       .map((_, i) => {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         return date.toISOString().split('T')[0];
//       })
//       .reverse();

//     return last7Days.map((date) => ({
//       date: format(new Date(date), 'MMM dd'),
//       orders: orders.filter((order) => order.createdAt.split('T')[0] === date).length,
//       revenue: orders
//         .filter((order) => order.createdAt.split('T')[0] === date)
//         .reduce((sum, order) => sum + order.totalAmount, 0),
//     }));
//   };

//   // useEffect(() => {
//   //   if (orders.length > 0) {
//   //     console.log(
//   //       'Orders in AdminDashboard:',
//   //       orders.map((order) => ({
//   //         id: order._id,
//   //         date: order.createdAt,
//   //         amount: order.totalAmount,
//   //       }))
//   //     );
//   //   }
//   // }, [orders]);

//   // Отримуємо замовлення при монтуванні
//   useEffect(() => {
//     dispatch(getUserOrders());
//   }, [dispatch]);

//   useEffect(() => {
//     console.log('Raw orders data:', orders);
//     if (orders.length > 0) {
//       const formattedData = formatChartData(orders);
//       console.log('Formatted chart data:', formattedData);
//       setOrderChartData(formattedData);
//     }
//   }, [orders]);

//   if (loading) {
//     return <DashboardSkeleton />;
//   }

//   if (error) {
//     return <ErrorAlert message={error} />;
//   }

//   // Статистика для відображення
//   const dashboardStats = [
//     {
//       title: 'Total Orders',
//       value: stats.total || 0,
//       icon: Package,
//       color: 'bg-blue-500',
//     },
//     {
//       title: 'Total Revenue',
//       value: `$${(stats.totalAmount || 0).toFixed(2)}`,
//       icon: DollarSign,
//       color: 'bg-green-500',
//     },
//     {
//       title: 'Pending Orders',
//       value: stats.byStatus?.pending || 0,
//       icon: AlertTriangle,
//       color: 'bg-yellow-500',
//     },
//     {
//       title: 'Delivered Orders',
//       value: stats.byStatus?.delivered || 0,
//       icon: TrendingUp,
//       color: 'bg-purple-500',
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
//         <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {dashboardStats.map((stat) => (
//           <StatCard key={stat.title} {...stat} />
//         ))}
//       </div>

//       {/* Charts */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <OrdersChart data={orderChartData} />

//         {/* Status Distribution */}
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
//           <div className="space-y-4">
//             {Object.entries(stats.byStatus || {}).map(([status, count]) => (
//               <div key={status} className="flex items-center">
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-blue-600 h-2.5 rounded-full"
//                     style={{ width: `${(count / (stats.total || 1)) * 100}%` }}
//                   />
//                 </div>
//                 <span className="ml-4 text-sm text-gray-600 min-w-[100px]">
//                   {status}: {count}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent Orders */}
//       <RecentOrders orders={orders.slice(0, 5)} />
//     </div>
//   );
// };

// export default AdminDashboard;

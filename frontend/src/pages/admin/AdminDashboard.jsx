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

  // Функція форматування дати
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

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
    try {
      const exportData = orders.map((order) => ({
        ID: order._id,
        Date: formatDate(order.createdAt),
        Customer: order.shippingAddress?.fullName || 'N/A',
        Amount: `$${Number(order.totalAmount).toFixed(2)}`,
        Status: order.status,
        Items: order.items?.length || 0,
        PaymentMethod: order.paymentMethod,
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
      link.download = `orders-export-${formatDate(new Date())}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Компонент контролів
  const ExportControls = () => (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
        <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      <div className="relative inline-block">
        <select
          value={exportFormat}
          onChange={(e) => setExportFormat(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="csv">CSV</option>
          <option value="json">JSON</option>
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <button
        onClick={() => handleExport(exportFormat)}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm font-medium transition-colors"
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </button>

      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={`inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
          refreshing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        {refreshing ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>
  );

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(handleRefresh, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !refreshing) return <DashboardSkeleton />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Last updated: {formatDate(new Date())}</p>
        </div>
        <ExportControls />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart data={orders} />
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

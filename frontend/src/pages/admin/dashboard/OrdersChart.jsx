// src/pages/admin/dashboard/OrdersChart.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

const DateRangeFilter = ({ period, setPeriod }) => {
  const periods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ];

  return (
    <div className="flex items-center space-x-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      {periods.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPeriod(value)}
          className={`px-3 py-1 rounded text-sm ${
            period === value ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export const OrdersChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('week');
  const [activeMetric, setActiveMetric] = useState('orders');
  const [filteredData, setFilteredData] = useState([]);

  const metrics = {
    orders: { name: 'Orders', color: '#3B82F6' },
    revenue: { name: 'Revenue', color: '#10B981' },
  };

  // Оновлена функція фільтрації даних з перевіркою на валідність дати
  useEffect(() => {
    if (!Array.isArray(data) || data.length === 0) {
      setFilteredData([]);
      return;
    }

    const now = new Date();
    const startDate = (() => {
      switch (period) {
        case 'day':
          return startOfDay(now);
        case 'week':
          return subDays(now, 7);
        case 'month':
          return subDays(now, 30);
        case 'year':
          return subDays(now, 365);
        default:
          return subDays(now, 7);
      }
    })();

    try {
      // Фільтруємо та групуємо дані з перевіркою на валідність дати
      const filtered = data.filter((order) => {
        if (!order?.createdAt) return false;
        try {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startDate && orderDate <= now;
        } catch (e) {
          console.error('Invalid date:', order.createdAt);
          return false;
        }
      });

      // Групуємо за датою
      const grouped = filtered.reduce((acc, order) => {
        const dateKey = format(new Date(order.createdAt), 'MMM dd');
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, orders: 0, revenue: 0 };
        }
        acc[dateKey].orders += 1;
        acc[dateKey].revenue += Number(order.totalAmount) || 0;
        return acc;
      }, {});

      // Конвертуємо в масив і сортуємо за датою
      const formattedData = Object.values(grouped).sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      console.log('Filtered and formatted data:', formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error('Error processing chart data:', error);
      setFilteredData([]);
    }
  }, [data, period]);

  const handleExport = (format) => {
    const exportData = filteredData.map((item) => ({
      Date: item.date,
      Orders: item.orders,
      Revenue: `$${item.revenue.toFixed(2)}`,
    }));

    if (format === 'excel') {
      // Додайте функцію експорту в Excel
      console.log('Exporting to Excel:', exportData);
    } else {
      // Додайте функцію експорту в CSV
      console.log('Exporting to CSV:', exportData);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border">
          <p className="text-gray-600">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.name === 'Revenue' ? '$' : ''}${
                typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!data.length) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Orders Overview</h3>
        <div className="flex space-x-4">
          <DateRangeFilter period={period} setPeriod={setPeriod} />
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('excel')}
              className="px-3 py-1 bg-green-100 text-green-600 rounded hover:bg-green-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Excel
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              CSV
            </button>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="orders" fill={metrics.orders.color} name="Orders" />
            <Bar dataKey="revenue" fill={metrics.revenue.color} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

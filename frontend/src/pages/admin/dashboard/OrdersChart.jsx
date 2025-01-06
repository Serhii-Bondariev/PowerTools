// src/pages/admin/dashboard/OrdersChart.jsx
import React, { useState, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Calendar } from 'lucide-react';

export const OrdersChart = ({ data = [] }) => {
  const [period, setPeriod] = useState('week');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return { categories: [], orders: [], revenue: [] };

    // Отримуємо останню дату замовлення
    const dates = data.map((order) => new Date(order.createdAt));
    const lastDate = new Date(Math.max(...dates));

    // Створюємо мапу для зберігання даних
    const dailyData = new Map();

    // Ініціалізуємо дані для останніх 7 днів
    for (let i = 6; i >= 0; i--) {
      const date = new Date(lastDate);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      dailyData.set(dateKey, { orders: 0, revenue: 0 });
    }

    // Обробляємо кожне замовлення
    data.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const dateKey = orderDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

      if (dailyData.has(dateKey)) {
        const currentData = dailyData.get(dateKey);
        dailyData.set(dateKey, {
          orders: currentData.orders + 1,
          revenue: currentData.revenue + (Number(order.totalAmount) || 0),
        });
      }
    });

    // Перетворюємо дані в формат для графіка
    const categories = Array.from(dailyData.keys());
    const orders = Array.from(dailyData.values()).map((d) => d.orders);
    const revenue = Array.from(dailyData.values()).map((d) => d.revenue);

    console.log('Chart data:', { categories, orders, revenue });
    return { categories, orders, revenue };
  }, [data]);

  const chartOptions = {
    chart: {
      type: 'line',
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    colors: ['#3B82F6', '#10B981'],
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
      },
    },
    title: {
      text: 'Orders Overview',
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#374151',
      },
    },
    grid: {
      borderColor: '#f3f4f6',
    },
    markers: {
      size: 4,
      colors: ['#3B82F6', '#10B981'],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    xaxis: {
      categories: chartData.categories,
      labels: {
        style: {
          colors: '#6B7280',
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Orders',
          style: {
            color: '#3B82F6',
          },
        },
        labels: {
          style: {
            colors: '#6B7280',
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Revenue ($)',
          style: {
            color: '#10B981',
          },
        },
        labels: {
          style: {
            colors: '#6B7280',
          },
          formatter: (value) => `$${value.toFixed(0)}`,
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        {
          formatter: (value) => `${value} orders`,
        },
        {
          formatter: (value) => `$${value.toFixed(2)}`,
        },
      ],
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      offsetY: -20,
    },
  };

  const series = [
    {
      name: 'Orders',
      type: 'column',
      data: chartData.orders,
    },
    {
      name: 'Revenue',
      type: 'line',
      data: chartData.revenue,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          {['hour', 'day', 'week', 'month'].map((type) => (
            <button
              key={type}
              onClick={() => setPeriod(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  period === type ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Chart options={chartOptions} series={series} type="line" height={350} />
    </div>
  );
};

// // src/pages/admin/dashboard/OrdersChart.jsx
// import React, { useState, useMemo } from 'react';
// import Chart from 'react-apexcharts';
// import { Calendar } from 'lucide-react';

// export const OrdersChart = ({ data = [] }) => {
//   const [period, setPeriod] = useState('day');

//   const getPeriodData = (periodType) => {
//     const now = new Date();
//     let dates = [];
//     let format = {};

//     switch (periodType) {
//       case 'hour':
//         // Останні 24 години
//         dates = Array.from({ length: 24 }, (_, i) => {
//           const date = new Date(now);
//           date.setHours(date.getHours() - (23 - i));
//           return date;
//         });
//         format = { hour: '2-digit', hour12: true };
//         break;

//       case 'day':
//         // Останні 24 години з інтервалом 2 години
//         dates = Array.from({ length: 12 }, (_, i) => {
//           const date = new Date(now);
//           date.setHours(date.getHours() - (22 - i * 2));
//           return date;
//         });
//         format = { hour: '2-digit', hour12: true };
//         break;

//       case 'week':
//         // Останні 7 днів
//         dates = Array.from({ length: 7 }, (_, i) => {
//           const date = new Date(now);
//           date.setDate(date.getDate() - (6 - i));
//           return date;
//         });
//         format = { month: 'short', day: '2-digit' };
//         break;

//       case 'month':
//         // Останні 30 днів
//         dates = Array.from({ length: 30 }, (_, i) => {
//           const date = new Date(now);
//           date.setDate(date.getDate() - (29 - i));
//           return date;
//         });
//         format = { month: 'short', day: '2-digit' };
//         break;

//       default:
//         dates = Array.from({ length: 7 }, (_, i) => {
//           const date = new Date(now);
//           date.setDate(date.getDate() - (6 - i));
//           return date;
//         });
//         format = { month: 'short', day: '2-digit' };
//     }

//     return { dates, format };
//   };

//   const chartData = useMemo(() => {
//     const { dates, format } = getPeriodData(period);
//     const categories = dates.map((date) => date.toLocaleDateString('en-US', format));
//     const orders = new Array(dates.length).fill(0);
//     const revenue = new Array(dates.length).fill(0);

//     data.forEach((order) => {
//       const orderDate = new Date(order.createdAt);
//       dates.forEach((date, index) => {
//         if (period === 'hour' || period === 'day') {
//           // Порівнюємо години
//           if (orderDate.getHours() === date.getHours() && orderDate.getDate() === date.getDate()) {
//             orders[index] += 1;
//             revenue[index] += Number(order.totalAmount) || 0;
//           }
//         } else {
//           // Порівнюємо дні
//           if (orderDate.getDate() === date.getDate() && orderDate.getMonth() === date.getMonth()) {
//             orders[index] += 1;
//             revenue[index] += Number(order.totalAmount) || 0;
//           }
//         }
//       });
//     });

//     return { categories, orders, revenue };
//   }, [data, period]);

//   const chartOptions = {
//     chart: {
//       height: 350,
//       type: 'line',
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false,
//       },
//     },
//     colors: ['#3B82F6', '#10B981'],
//     dataLabels: {
//       enabled: true,
//       formatter: function (val, { seriesIndex }) {
//         if (seriesIndex === 1) {
//           return `$${val.toFixed(0)}`;
//         }
//         return val;
//       },
//     },
//     stroke: {
//       width: [4, 4],
//       curve: 'smooth',
//     },
//     title: {
//       text: 'Orders Overview',
//       align: 'left',
//       style: {
//         fontSize: '18px',
//         fontWeight: '600',
//         color: '#374151',
//       },
//     },
//     grid: {
//       borderColor: '#f3f4f6',
//       row: {
//         colors: ['#fff', '#f9fafb'],
//       },
//     },
//     markers: {
//       size: 5,
//     },
//     xaxis: {
//       categories: chartData.categories,
//       title: {
//         text: period === 'hour' || period === 'day' ? 'Time' : 'Date',
//       },
//     },
//     yaxis: [
//       {
//         title: {
//           text: 'Orders',
//         },
//         min: 0,
//       },
//       {
//         opposite: true,
//         title: {
//           text: 'Revenue ($)',
//         },
//         min: 0,
//       },
//     ],
//     legend: {
//       position: 'top',
//       horizontalAlign: 'right',
//       floating: true,
//       offsetY: -25,
//       offsetX: -5,
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//     },
//   };

//   const series = [
//     {
//       name: 'Orders',
//       type: 'column',
//       data: chartData.orders,
//     },
//     {
//       name: 'Revenue',
//       type: 'line',
//       data: chartData.revenue,
//     },
//   ];

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-4">
//           {['hour', 'day', 'week', 'month'].map((type) => (
//             <button
//               key={type}
//               onClick={() => setPeriod(type)}
//               className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
//                 ${
//                   period === type ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//                 }`}
//             >
//               {type.charAt(0).toUpperCase() + type.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       <Chart options={chartOptions} series={series} type="line" height={350} />
//     </div>
//   );
// };
// // src/pages/admin/dashboard/OrdersChart.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { Calendar } from 'lucide-react';

// export const OrdersChart = ({ data = [] }) => {
//   const [period, setPeriod] = useState('week');

//   // Підготовка даних для графіка
//   const chartData = useMemo(() => {
//     // Створюємо масив дат за останні 7 днів
//     const dates = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - (6 - i));
//       return {
//         date: date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
//         orders: 0,
//         revenue: 0,
//       };
//     });

//     // Створюємо мапу для швидкого доступу
//     const dateMap = dates.reduce((acc, item) => {
//       acc[item.date] = item;
//       return acc;
//     }, {});

//     // Додаємо дані замовлень
//     data.forEach((order) => {
//       if (order.createdAt) {
//         const orderDate = new Date(order.createdAt);
//         const dateKey = orderDate.toLocaleDateString('en-US', {
//           month: 'short',
//           day: '2-digit',
//         });

//         if (dateMap[dateKey]) {
//           dateMap[dateKey].orders += 1;
//           dateMap[dateKey].revenue += Number(order.totalAmount) || 0;
//         }
//       }
//     });

//     // Повертаємо масив даних
//     return dates;
//   }, [data]);

//   // Компонент фільтра періоду
//   const DateRangeFilter = ({ period, setPeriod }) => {
//     const periods = [
//       { value: 'day', label: 'Today' },
//       { value: 'week', label: 'Week' },
//       { value: 'month', label: 'Month' },
//       { value: 'year', label: 'Year' },
//     ];

//     return (
//       <div className="flex items-center space-x-2">
//         <Calendar className="h-4 w-4 text-gray-400" />
//         {periods.map(({ value, label }) => (
//           <button
//             key={value}
//             onClick={() => setPeriod(value)}
//             className={`px-3 py-1 rounded text-sm ${
//               period === value ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//             }`}
//           >
//             {label}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Кастомний тултіп
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 shadow-lg rounded-lg border">
//           <p className="font-semibold">{label}</p>
//           <p className="text-blue-600">Orders: {payload[0]?.value || 0}</p>
//           <p className="text-green-600">Revenue: ${(payload[1]?.value || 0).toFixed(2)}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   // Якщо немає даних
//   if (!data.length) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
//         <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold">Orders Overview</h3>
//         <DateRangeFilter period={period} setPeriod={setPeriod} />
//       </div>

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="date" tick={{ fill: '#6B7280' }} />
//             <YAxis yAxisId="left" orientation="left" tick={{ fill: '#6B7280' }} />
//             <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6B7280' }} />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar
//               yAxisId="left"
//               dataKey="orders"
//               fill="#3B82F6"
//               name="Orders"
//               radius={[4, 4, 0, 0]}
//             />
//             <Bar
//               yAxisId="right"
//               dataKey="revenue"
//               fill="#10B981"
//               name="Revenue"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// // src/pages/admin/dashboard/OrdersChart.jsx
// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';
// import { Calendar } from 'lucide-react';

// const DateRangeFilter = ({ period, setPeriod }) => {
//   const periods = [
//     { value: 'day', label: 'Today' },
//     { value: 'week', label: 'Week' },
//     { value: 'month', label: 'Month' },
//     { value: 'year', label: 'Year' },
//   ];

//   return (
//     <div className="flex items-center space-x-2">
//       <Calendar className="h-4 w-4 text-gray-400" />
//       {periods.map(({ value, label }) => (
//         <button
//           key={value}
//           onClick={() => setPeriod(value)}
//           className={`px-3 py-1 rounded text-sm ${
//             period === value ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
//           }`}
//         >
//           {label}
//         </button>
//       ))}
//     </div>
//   );
// };

// export const OrdersChart = ({ data = [] }) => {
//   const [period, setPeriod] = useState('week');

//   // Підготовка даних для графіка
//   const chartData = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return [];

//     // Групуємо замовлення за датою
//     const groupedData = data.reduce((acc, order) => {
//       const date = new Date(order.createdAt).toLocaleDateString('en-US', {
//         month: 'short',
//         day: 'numeric',
//       });

//       if (!acc[date]) {
//         acc[date] = {
//           date,
//           orders: 0,
//           revenue: 0,
//         };
//       }

//       acc[date].orders += 1;
//       acc[date].revenue += Number(order.totalAmount) || 0;

//       return acc;
//     }, {});

//     // Конвертуємо в масив і сортуємо за датою
//     return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
//   }, [data]);

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 shadow-lg rounded-lg border">
//           <p className="font-semibold">{label}</p>
//           <p className="text-blue-600">Orders: {payload[0]?.value || 0}</p>
//           <p className="text-green-600">Revenue: ${payload[1]?.value?.toFixed(2) || '0.00'}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!data.length) {
//     return (
//       <div className="bg-white rounded-lg shadow p-6">
//         <h3 className="text-lg font-semibold mb-4">Orders Overview</h3>
//         <div className="h-64 flex items-center justify-center text-gray-500">No data available</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-lg font-semibold">Orders Overview</h3>
//         <DateRangeFilter period={period} setPeriod={setPeriod} />
//       </div>

//       <div className="h-64">
//         <ResponsiveContainer width="100%" height="100%">
//           <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//             <XAxis dataKey="date" tick={{ fill: '#6B7280' }} tickLine={{ stroke: '#6B7280' }} />
//             <YAxis
//               yAxisId="left"
//               orientation="left"
//               tick={{ fill: '#6B7280' }}
//               tickLine={{ stroke: '#6B7280' }}
//               axisLine={{ stroke: '#6B7280' }}
//             />
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               tick={{ fill: '#6B7280' }}
//               tickLine={{ stroke: '#6B7280' }}
//               axisLine={{ stroke: '#6B7280' }}
//             />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//             <Bar
//               yAxisId="left"
//               dataKey="orders"
//               fill="#3B82F6"
//               name="Orders"
//               radius={[4, 4, 0, 0]}
//             />
//             <Bar
//               yAxisId="right"
//               dataKey="revenue"
//               fill="#10B981"
//               name="Revenue"
//               radius={[4, 4, 0, 0]}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

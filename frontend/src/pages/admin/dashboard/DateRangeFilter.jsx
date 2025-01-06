// src/pages/admin/dashboard/DateRangeFilter.jsx
import React from 'react';
import { Calendar } from 'lucide-react';

export const DateRangeFilter = ({ period, setPeriod }) => {
  const periods = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="flex items-center space-x-2 bg-white rounded-lg shadow p-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      {periods.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPeriod(value)}
          className={`px-3 py-1 rounded-md text-sm ${
            period === value ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

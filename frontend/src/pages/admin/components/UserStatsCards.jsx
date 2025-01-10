// src/pages/admin/components/UserStatsCards.jsx
import React from 'react';
import { Users, UserCheck, UserX, Shield } from 'lucide-react';

export function UserStatsCards({ stats }) {
  const cards = [
    {
      title: 'Total Users',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Users',
      value: stats.active,
      icon: UserCheck,
      color: 'bg-green-500',
    },
    {
      title: 'Inactive Users',
      value: stats.inactive,
      icon: UserX,
      color: 'bg-red-500',
    },
    {
      title: 'Admins',
      value: stats.admins,
      icon: Shield,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.color} text-white`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
              <p className="text-2xl font-semibold">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

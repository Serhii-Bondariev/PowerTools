// frontend/src/components/layout/AdminLayout/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ShoppingCart, Settings } from 'lucide-react';

export function AdminLayout({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;

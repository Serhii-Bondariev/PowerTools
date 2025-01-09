// frontend/src/components/layout/AdminLayout/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  Home,
  Plus,
  List,
  LogOut,
  Menu,
  X,
  Bell,
  User,
} from 'lucide-react';
import { logout } from '../../../store/slices/authSlice';

// Компонент сповіщень
const NotificationsDropdown = ({ notifications, onRead, onReadAll, onClose }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 className="font-semibold">Notifications</h3>
      <button onClick={onReadAll} className="text-sm text-blue-600 hover:text-blue-800">
        Mark all as read
      </button>
    </div>
    <div className="max-h-96 overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">No new notifications</div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => onRead(notification)}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
              !notification.read ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start">
              <ShoppingCart
                className={`h-5 w-5 ${!notification.read ? 'text-blue-600' : 'text-gray-400'}`}
              />
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  {!notification.read && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Відслідковуємо нові замовлення
  useEffect(() => {
    if (orders?.length > 0) {
      const newNotifications = orders
        .filter((order) => order.status === 'pending' && !order.notificationSeen)
        .map((order) => ({
          id: order._id,
          orderId: order._id, // Переконуємося, що orderId присутній
          title: 'New Order',
          message: `Order #${order._id.slice(-6)} - ${order.items?.length || 0} items for $${order.totalAmount?.toFixed(2)}`,
          createdAt: order.createdAt,
          read: false,
        }));

      if (newNotifications.length > 0) {
        setNotifications((prev) => {
          // Уникаємо дублювання сповіщень
          const existingIds = new Set(prev.map((n) => n.id));
          const uniqueNewNotifications = newNotifications.filter((n) => !existingIds.has(n.id));
          return [...uniqueNewNotifications, ...prev];
        });
      }
    }
  }, [orders]);

  // Обробка кліку по сповіщенню
  const handleNotificationClick = (notification) => {
    try {
      // Позначаємо як прочитане
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );

      // Закриваємо дропдаун
      setIsNotificationsOpen(false);

      // Переходимо до деталей замовлення
      if (notification.orderId) {
        // Використовуємо правильний шлях
        navigate(`/admin/orders/${notification.orderId}`);

        // Додаємо невелику затримку для анімації закриття дропдауну
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // Позначити всі як прочитані
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setIsNotificationsOpen(false);
  };

  // Закрити дропдаун при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isNotificationsOpen && !event.target.closest('.notifications-container')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotificationsOpen]);

  // Кількість непрочитаних
  const unreadCount = notifications.filter((n) => !n.read).length;
  // Групи меню
  const menuGroups = [
    {
      title: 'Navigation',
      items: [
        {
          path: '/',
          icon: Home,
          label: 'Home',
        },
        {
          path: '/admin',
          icon: LayoutDashboard,
          label: 'Dashboard',
        },
      ],
    },
    {
      title: 'Products',
      items: [
        {
          path: '/admin/products',
          icon: List,
          label: 'Product List',
        },
        {
          path: '/admin/products/new',
          icon: Plus,
          label: 'Add Product',
        },
      ],
    },
    {
      title: 'Management',
      items: [
        {
          path: '/admin/users',
          icon: Users,
          label: 'Users',
        },
        {
          path: '/admin/orders',
          icon: ShoppingCart,
          label: 'Orders',
        },
        {
          path: '/admin/settings',
          icon: Settings,
          label: 'Settings',
        },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm fixed w-full z-10">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left side */}
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative notifications-container">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 rounded-full hover:bg-gray-100 relative focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center transform -translate-y-1 translate-x-1">
                    {unreadCount}
                  </span>
                )}
              </button>
              {isNotificationsOpen && (
                <NotificationsDropdown
                  notifications={notifications}
                  onRead={handleNotificationClick}
                  onReadAll={handleMarkAllRead}
                  onClose={() => setIsNotificationsOpen(false)}
                />
              )}
            </div>
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
              >
                <User className="h-6 w-6" />
                <span>{user?.firstName}</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/admin/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white shadow-lg min-h-screen fixed transition-all duration-300`}
        >
          <nav className="mt-4">
            {menuGroups.map((group, index) => (
              <div key={index} className="mb-6">
                {isSidebarOpen && (
                  <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {group.title}
                  </h3>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                        location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;

//========================================
// // frontend/src/components/layout/AdminLayout/AdminLayout.jsx
// import React, { useState } from 'react';
// import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   LayoutDashboard,
//   Package,
//   Users,
//   ShoppingCart,
//   Settings,
//   Home,
//   Plus,
//   List,
//   LogOut,
//   Menu,
//   X,
//   Bell,
//   User,
// } from 'lucide-react';
// import { logout } from '../../../store/slices/authSlice';

// export function AdminLayout() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

//   // Групи меню
//   const menuGroups = [
//     {
//       title: 'Navigation',
//       items: [
//         {
//           path: '/',
//           icon: Home,
//           label: 'Home',
//         },
//         {
//           path: '/admin',
//           icon: LayoutDashboard,
//           label: 'Dashboard',
//         },
//       ],
//     },
//     {
//       title: 'Products',
//       items: [
//         {
//           path: '/admin/products',
//           icon: List,
//           label: 'Product List',
//         },
//         {
//           path: '/admin/products/new',
//           icon: Plus,
//           label: 'Add Product',
//         },
//       ],
//     },
//     {
//       title: 'Management',
//       items: [
//         {
//           path: '/admin/users',
//           icon: Users,
//           label: 'Users',
//         },
//         {
//           path: '/admin/orders',
//           icon: ShoppingCart,
//           label: 'Orders',
//         },
//         {
//           path: '/admin/settings',
//           icon: Settings,
//           label: 'Settings',
//         },
//       ],
//     },
//   ];

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate('/login');
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Top Navigation Bar */}
//       <div className="bg-white shadow-sm fixed w-full z-10">
//         <div className="flex items-center justify-between h-16 px-4">
//           {/* Left side */}
//           <div className="flex items-center">
//             <button
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="p-2 rounded-md hover:bg-gray-100"
//             >
//               {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//             <h1 className="ml-4 text-xl font-semibold">Admin Dashboard</h1>
//           </div>

//           {/* Right side */}
//           <div className="flex items-center space-x-4">
//             {/* Notifications */}
//             <button className="p-2 rounded-full hover:bg-gray-100 relative">
//               <Bell className="h-6 w-6" />
//               <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
//                 3
//               </span>
//             </button>

//             {/* Profile Dropdown */}
//             <div className="relative">
//               <button
//                 onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
//                 className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100"
//               >
//                 <User className="h-6 w-6" />
//                 <span>{user?.firstName}</span>
//               </button>

//               {isProfileDropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
//                   <Link
//                     to="/admin/profile"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                   >
//                     Profile Settings
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex pt-16">
//         {/* Sidebar */}
//         <div
//           className={`${
//             isSidebarOpen ? 'w-64' : 'w-20'
//           } bg-white shadow-lg min-h-screen fixed transition-all duration-300`}
//         >
//           <nav className="mt-4">
//             {menuGroups.map((group, index) => (
//               <div key={index} className="mb-6">
//                 {isSidebarOpen && (
//                   <h3 className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                     {group.title}
//                   </h3>
//                 )}
//                 {group.items.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <Link
//                       key={item.path}
//                       to={item.path}
//                       className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
//                         location.pathname === item.path ? 'bg-blue-50 text-blue-600' : ''
//                       }`}
//                     >
//                       <Icon className="h-5 w-5" />
//                       {isSidebarOpen && <span className="ml-3">{item.label}</span>}
//                     </Link>
//                   );
//                 })}
//               </div>
//             ))}
//           </nav>
//         </div>

//         {/* Main Content */}
//         <div
//           className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-8 transition-all duration-300`}
//         >
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminLayout;

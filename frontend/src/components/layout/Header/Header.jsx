// src/components/layout/Header/Header.jsx
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  Package,
  Home,
  Phone,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../store/slices/authSlice';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const isAdmin = user?.isAdmin === true;

  // Показуємо привітальне повідомлення при логіні
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: ShoppingCart },
    { path: '/contacts', label: 'Contacts', icon: Phone },
  ];

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Welcome Message */}
      {showWelcome && user && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50 shadow-lg animate-fade-in">
          <p className="font-medium">Welcome back, {user.firstName}!</p>
          <p className="text-sm">Role: {isAdmin ? 'Administrator' : 'Customer'}</p>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-500">🛠</span>
                <span className="text-xl font-bold">HardwareHub</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 hover:text-gray-300 transition duration-150 ${
                      location.pathname === item.path ? 'text-blue-400' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* User Section */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Cart */}
              <Link to="/cart" className="relative hover:text-gray-300">
                <ShoppingCart className="h-6 w-6" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 hover:text-gray-300">
                    <User className="h-6 w-6" />
                    <span className="flex items-center">
                      {user.firstName}
                      {isAdmin && (
                        <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    {isAdmin && (
                      <>
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center font-medium"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                        <div className="border-t border-gray-100" />
                      </>
                    )}
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link to="/login" className="hover:text-gray-300 transition duration-150">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                </form>

                {/* Mobile Navigation */}
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-3 py-2 rounded-md hover:bg-gray-800 flex items-center space-x-2 ${
                        location.pathname === item.path ? 'text-blue-400' : ''
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md hover:bg-gray-800 flex items-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cartItems?.length || 0})</span>
                </Link>

                {/* Mobile User Section */}
                {user ? (
                  <>
                    <div className="px-3 py-2 text-gray-300 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      <span>
                        {user.firstName}
                        {isAdmin && (
                          <span className="ml-2 text-xs bg-red-500 px-2 py-0.5 rounded-full">
                            Admin
                          </span>
                        )}
                      </span>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md hover:bg-gray-800 text-red-400 flex items-center"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-gray-800 flex items-center"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 rounded-md hover:bg-gray-800"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700 text-center"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;

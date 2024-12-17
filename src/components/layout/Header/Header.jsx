// src/components/layout/Header/Header.jsx
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  HomeIcon,
  PackageOpen,
  LogIn,
  UserRoundPlus,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=128&h=128&fit=crop&auto=format"
                alt="Hardware Store Logo"
                className="h-8 w-auto"
              />
              <span className="ml-2 mr-2 text-xl font-bold">HardwareHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-300 transition duration-150">
              Home
            </Link>
            <Link to="/products" className="hover:text-gray-300 transition duration-150">
              Products
            </Link>
            <Link
              to="/cart"
              className="hover:text-gray-300 transition duration-150 flex items-center"
            >
              <ShoppingCart className="h-5 w-5 mr-1" />
              Cart
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-400"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <span className="text-gray-300">John Doe</span>
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="flex items-center text-gray-300 hover:text-white transition duration-150"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-800 transition duration-150"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md hover:bg-gray-800 transition duration-150 flex items-center"
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 rounded-md hover:bg-gray-800 transition duration-150 flex items-center"
              >
                <PackageOpen className="h-5 w-5 mr-2" />
                Products
              </Link>
              <Link
                to="/cart"
                className="block px-3 py-2 rounded-md hover:bg-gray-800 transition duration-150 flex items-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Link>

              <div className="pt-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300 placeholder-gray-400"
                  />
                  <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="pt-4 space-y-2">
                {isLoggedIn ? (
                  <>
                    <span className="block px-3 py-2 text-gray-300">John Doe</span>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-800 transition duration-150 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block w-full px-3 py-2 rounded-md hover:bg-gray-800 transition duration-150 flex items-center"
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-3 py-2 bg-blue-600 rounded-md hover:bg-blue-700 transition duration-150 flex items-center"
                    >
                      <UserRoundPlus className="h-5 w-5 mr-2" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

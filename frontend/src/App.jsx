// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { GoogleAuthProvider } from './providers/GoogleAuthProvider';
import { ProtectedRoute, AdminRoute } from './providers/AuthProvider';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Layouts
import MainLayout from './components/layout/MainLayout/MainLayout';
import AdminLayout from './components/layout/AdminLayout/AdminLayout';

// Pages

import HomePage from './pages/home/HomePage';
import Products from './pages/products/Products';
import CartPage from './pages/cart/CartPage';
import ContactPage from './pages/contacts/ContactPage';
import OrdersPage from './pages/orders/OrdersPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import OrderSuccessPage from './pages/orders/OrderSuccessPage';
import OrderDetailsPage from './pages/orders/OrderDetailsPage';
import ProductDetails from './pages/products/ProductDetails';

// Auth Pages
import { LoginForm } from './components/features/auth/LoginForm';
import { RegisterForm } from './components/features/auth/RegisterForm';
import { ForgotPasswordForm } from './components/features/auth/ForgotPasswordForm';
import { ResetPasswordForm } from './components/features/auth/ResetPasswordForm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ProductForm from './pages/admin/ProductForm';
import ProductList from './pages/admin/ProductList';
import OrderDetailsAdmin from './pages/admin/OrderDetailsAdmin';
import UserOrdersPage from './pages/orders/UserOrdersPage';
import FavoritesPage from './pages/favorites/FavoritesPage';

function App() {
  return (
    <Provider store={store}>
      <GoogleAuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsAdmin />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>

            {/* Main Layout with Auth and Public Routes */}
            <Route element={<MainLayout />}>
              {/* Auth Routes */}
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="forgot-password" element={<ForgotPasswordForm />} />
              <Route path="reset-password/:token" element={<ResetPasswordForm />} />

              {/* Public Routes */}
              <Route path="/ProductDetails/:id" element={<ProductDetails />} />
              <Route
                path="favorites"
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                }
              />
              <Route index element={<HomePage />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<Products />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="contacts" element={<ContactPage />} />

              {/* Protected User Routes */}
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Orders Routes - Виправлено структуру */}
              <Route path="orders">
                <Route
                  index
                  element={
                    <ProtectedRoute>
                      <UserOrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path=":orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="success"
                  element={
                    <ProtectedRoute>
                      <OrderSuccessPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>

            {/* Catch all route - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GoogleAuthProvider>
      <SpeedInsights />
    </Provider>
  );
}

export default App;

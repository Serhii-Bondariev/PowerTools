// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

// Layouts
import MainLayout from './components/layout/MainLayout/MainLayout';
import AdminLayout from './components/layout/AdminLayout/AdminLayout';

// Pages
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import CartPage from './pages/cart/CartPage';
import ContactPage from './pages/contacts/ContactPage';
import OrdersPage from './pages/orders/OrdersPage'; // Переконайтеся, що цей імпорт є

// Auth Pages
import { LoginForm } from './components/features/auth/LoginForm';
import { RegisterForm } from './components/features/auth/RegisterForm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Provider store={store}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Public and Protected Routes */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:id" element={<ProductsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="contacts" element={<ContactPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            {/* Захищений роут для замовлень */}
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

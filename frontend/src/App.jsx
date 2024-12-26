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
import Products from './pages/products/Products';
import CartPage from './pages/cart/CartPage';
import ContactPage from './pages/contacts/ContactPage';
import OrdersPage from './pages/orders/OrdersPage';
import CheckoutPage from './pages/checkout/CheckoutPage'; // Додаємо імпорт
import OrderSuccessPage from './pages/orders/OrderSuccessPage'; // Додаємо імпорт

// Auth Pages
import { LoginForm } from './components/features/auth/LoginForm';
import { RegisterForm } from './components/features/auth/RegisterForm';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import ProductForm from './pages/admin/ProductForm';
import ProductList from './pages/admin/ProductList';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <ProtectedRoute>{children}</ProtectedRoute>;
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
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Public and Protected Routes */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:id" element={<Products />} />
            <Route path="cart" element={<CartPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/success"
              element={
                <ProtectedRoute>
                  <OrderSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route path="contacts" element={<ContactPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
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

// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { store } from './store';

// // Layouts
// import MainLayout from './components/layout/MainLayout/MainLayout';
// import AdminLayout from './components/layout/AdminLayout/AdminLayout';

// // Pages
// import HomePage from './pages/home/HomePage';
// import Products from './pages/products/Products';
// import CartPage from './pages/cart/CartPage';
// import ContactPage from './pages/contacts/ContactPage';
// import OrdersPage from './pages/orders/OrdersPage';

// // Auth Pages
// import { LoginForm } from './components/features/auth/LoginForm';
// import { RegisterForm } from './components/features/auth/RegisterForm';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminProductsPage from './pages/admin/AdminProductsPage';
// import AdminUsersPage from './pages/admin/AdminUsersPage';
// import AdminOrdersPage from './pages/admin/AdminOrdersPage';
// import AdminSettingsPage from './pages/admin/AdminSettingsPage';
// import ProductForm from './pages/admin/ProductForm';
// import ProductList from './pages/admin/ProductList';

// // Protected Route Component
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('token');
//   const user = JSON.parse(localStorage.getItem('user') || '{}');

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// // Admin Route Component
// const AdminRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');

//   if (!user.isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return <ProtectedRoute>{children}</ProtectedRoute>;
// };

// function App() {
//   return (
//     <Provider store={store}>
//       <Router
//         future={{
//           v7_startTransition: true,
//           v7_relativeSplatPath: true,
//         }}
//       >
//         <Routes>
//           {/* Admin Routes */}
//           <Route
//             path="/admin"
//             element={
//               <AdminRoute>
//                 <AdminLayout />
//               </AdminRoute>
//             }
//           >
//             <Route index element={<AdminDashboard />} />
//             <Route path="products" element={<ProductList />} />
//             <Route path="products/new" element={<ProductForm />} />
//             <Route path="products/edit/:id" element={<ProductForm />} />
//             <Route path="users" element={<AdminUsersPage />} />
//             <Route path="orders" element={<AdminOrdersPage />} />
//             <Route path="settings" element={<AdminSettingsPage />} />
//           </Route>

//           {/* Public and Protected Routes */}
//           <Route element={<MainLayout />}>
//             <Route index element={<HomePage />} />
//             <Route path="products" element={<Products />} />
//             <Route path="products/:id" element={<Products />} />
//             <Route path="cart" element={<CartPage />} />
//             <Route path="contacts" element={<ContactPage />} />
//             <Route path="login" element={<LoginForm />} />
//             <Route path="register" element={<RegisterForm />} />
//             <Route
//               path="orders"
//               element={
//                 <ProtectedRoute>
//                   <OrdersPage />
//                 </ProtectedRoute>
//               }
//             />
//           </Route>
//         </Routes>
//       </Router>
//     </Provider>
//   );
// }

// export default App;

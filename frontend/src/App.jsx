// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { GoogleAuthProvider } from './providers/GoogleAuthProvider';
import { ProtectedRoute, AdminRoute } from './providers/AuthProvider';

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
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
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
              <Route index element={<HomePage />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<Products />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="contacts" element={<ContactPage />} />

              {/* Protected Routes */}
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              {/* Orders Routes */}
              <Route
                path="orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orders/success"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Catch all route - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </GoogleAuthProvider>
    </Provider>
  );
}

export default App;

// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { store } from './store';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// // Layouts
// import MainLayout from './components/layout/MainLayout/MainLayout';
// import AdminLayout from './components/layout/AdminLayout/AdminLayout';

// // Pages
// import HomePage from './pages/home/HomePage';
// import Products from './pages/products/Products';
// import CartPage from './pages/cart/CartPage';
// import ContactPage from './pages/contacts/ContactPage';
// import OrdersPage from './pages/orders/OrdersPage';
// import CheckoutPage from './pages/checkout/CheckoutPage';
// import OrderSuccessPage from './pages/orders/OrderSuccessPage';
// import OrderDetailsPage from './pages/orders/OrderDetailsPage';

// // Auth Pages
// import { LoginForm } from './components/features/auth/LoginForm';
// import { RegisterForm } from './components/features/auth/RegisterForm';
// import { ForgotPasswordForm } from './components/features/auth/ForgotPasswordForm';
// import { ResetPasswordForm } from './components/features/auth/ResetPasswordForm';

// // Admin Pages
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminProductsPage from './pages/admin/AdminProductsPage';
// import AdminUsersPage from './pages/admin/AdminUsersPage';
// import AdminOrdersPage from './pages/admin/AdminOrdersPage';
// import AdminSettingsPage from './pages/admin/AdminSettingsPage';
// import ProductForm from './pages/admin/ProductForm';
// import ProductList from './pages/admin/ProductList';

// // Protected Route Components
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem('token');

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// const AdminRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');

//   if (!user.isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return <ProtectedRoute>{children}</ProtectedRoute>;
// };

// function App() {
//   const googleClientId =
//     process.env.REACT_APP_GOOGLE_CLIENT_ID ||
//     '444678457305-mbij74rt55bl4ljup26d212buhfv5ha7.apps.googleusercontent.com';

//   console.log('Environment Check:', {
//     fromEnv: process.env.REACT_APP_GOOGLE_CLIENT_ID,
//     usingId: googleClientId,
//     nodeEnv: process.env.NODE_ENV,
//   });

//   if (!googleClientId) {
//     console.error('Google Client ID is missing!');
//     return null;
//   }

//   return (
//     <GoogleOAuthProvider clientId={googleClientId}>
//       <Provider store={store}>
//         <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//           <Routes>
//             {/* Auth Routes */}
//             <Route path="login" element={<LoginForm />} />
//             <Route path="register" element={<RegisterForm />} />
//             <Route path="forgot-password" element={<ForgotPasswordForm />} />
//             <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

//             {/* Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <AdminRoute>
//                   <AdminLayout />
//                 </AdminRoute>
//               }
//             >
//               <Route index element={<AdminDashboard />} />
//               <Route path="products" element={<ProductList />} />
//               <Route path="products/new" element={<ProductForm />} />
//               <Route path="products/edit/:id" element={<ProductForm />} />
//               <Route path="users" element={<AdminUsersPage />} />
//               <Route path="orders" element={<AdminOrdersPage />} />
//               <Route path="settings" element={<AdminSettingsPage />} />
//             </Route>

//             {/* Main Routes */}
//             <Route element={<MainLayout />}>
//               <Route index element={<HomePage />} />
//               <Route path="products" element={<Products />} />
//               <Route path="products/:id" element={<Products />} />
//               <Route path="cart" element={<CartPage />} />
//               <Route path="contacts" element={<ContactPage />} />

//               {/* Protected Routes */}
//               <Route
//                 path="checkout"
//                 element={
//                   <ProtectedRoute>
//                     <CheckoutPage />
//                   </ProtectedRoute>
//                 }
//               />

//               {/* Orders Routes */}
//               <Route
//                 path="orders"
//                 element={
//                   <ProtectedRoute>
//                     <OrdersPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="orders/:orderId"
//                 element={
//                   <ProtectedRoute>
//                     <OrderDetailsPage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route
//                 path="orders/success"
//                 element={
//                   <ProtectedRoute>
//                     <OrderSuccessPage />
//                   </ProtectedRoute>
//                 }
//               />
//             </Route>

//             {/* Catch all route - 404 */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </Router>
//       </Provider>
//     </GoogleOAuthProvider>
//   );
// }

// export default App;

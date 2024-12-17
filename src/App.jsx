// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout/MainLayout';
import HomePage from './pages/home/HomePage';
import ProductsPage from './pages/products/ProductsPage';
import CartPage from './pages/cart/CartPage';
import ContactPage from './pages/contacts/ContactPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<ContactPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '../src/components/layout/MainLayout/MainLayout';
import { HomePage } from './pages/home/HomePage';
import { ProductPage } from './pages/product/ProductPage';
import { CartPage } from './pages/cart/CartPage';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

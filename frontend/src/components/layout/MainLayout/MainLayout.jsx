// src/components/layout/MainLayout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom'; // Імпортуємо Outlet
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

export function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet /> {/* Тут будуть відображатися всі дочірні роути */}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;

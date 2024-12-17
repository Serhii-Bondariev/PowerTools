// src/components/layout/MainLayout/MainLayout.jsx
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Hero from '../Hero/Hero';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
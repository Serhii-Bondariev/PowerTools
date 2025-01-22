// src/pages/home/HomePage.jsx
import React from 'react';
import Hero from '../../components/layout/Hero/Hero';
import FeaturedProducts from '../../components/features/home/FeaturedProducts/FeaturedProducts';
import ErrorBoundary from '../../components/common/ErrorBoundary';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <ErrorBoundary>
        <FeaturedProducts />
      </ErrorBoundary>
    </div>
  );
}

export default HomePage;

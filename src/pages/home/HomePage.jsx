// src/pages/home/HomePage.jsx
import React from 'react';

import MainLayout from './../../components/layout/MainLayout/MainLayout';
import Hero from '../../components/layout/Hero/Hero';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1>Welcome to Power Tools</h1>
        <MainLayout>
          <HomePage />
          <Hero />
          <FeaturedProducts />
          </MainLayout>
      </div>
    </div>
  );
}

// // src/pages/home/Home.jsx
// import React from 'react';
// import MainLayout from '../../components/layout/MainLayout/MainLayout';
// // import Hero from '../../components/features/hero/Hero';
// // import FeaturedProducts from '../../components/features/products/FeaturedProducts';
// // import './Home.css';

// export function HomePage() {

//   return (
//     <MainLayout>
//       {/* <Hero /> */}
//       {/* <FeaturedProducts /> */}
//     </MainLayout>
//   );
// }
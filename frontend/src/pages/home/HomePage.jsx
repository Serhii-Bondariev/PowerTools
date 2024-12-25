// // src/pages/home/HomePage.jsx
// import React from 'react';

// import MainLayout from './../../components/layout/MainLayout/MainLayout';
// import Hero from '../../components/layout/Hero/Hero';

// export function HomePage() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <h1>Welcome to Power Tools</h1>
//         <MainLayout>
//           <HomePage />
//           <Hero />
//           <FeaturedProducts />
//           </MainLayout>
//       </div>
//     </div>
//   );
// }

// export default HomePage;

// src/pages/home/HomePage.jsx
import React from 'react';
import Hero from '../../components/layout/Hero/Hero';
import FeaturedProducts from '../../components/features/home/FeaturedProducts/FeaturedProducts';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;

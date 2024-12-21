import {
  Paintbrush,
  Ruler,
  Wrench,
  Zap, // для іконки Power Tools
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  const categories = [
    {
      id: 1,
      title: 'Power Tools',
      description: 'Professional-grade power tools for every project',
      icon: Zap,
      color: 'blue',
      link: '/categories/power-tools',
    },
    {
      id: 2,
      title: 'Paint & Supplies',
      description: 'Premium paints and supplies for any surface',
      icon: Paintbrush,
      color: 'green',
      link: '/categories/paint-supplies',
    },
    {
      id: 3,
      title: 'Measuring Tools',
      description: 'Precise measuring tools for accurate results',
      icon: Ruler,
      color: 'red',
      link: '/categories/measuring-tools',
    },
    {
      id: 4,
      title: 'Plumbing',
      description: 'Complete range of plumbing tools and supplies',
      icon: Wrench,
      color: 'purple',
      link: '/categories/plumbing',
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* Main Banner */}
      <div className="relative h-[600px] w-full">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Build Your Dreams With Us
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl">
            Discover premium tools and equipment for all your DIY projects and professional needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/products"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-lg font-semibold text-center"
            >
              Shop Now
            </Link>
            <Link
              to="/catalog"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition duration-300 text-lg font-semibold text-center"
            >
              View Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Popular Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link key={category.id} to={category.link} className="group">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
                  <div
                    className={`bg-${category.color}-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-${category.color}-200 transition duration-300`}
                  >
                    <IconComponent className={`h-6 w-6 text-${category.color}-600`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Hero;

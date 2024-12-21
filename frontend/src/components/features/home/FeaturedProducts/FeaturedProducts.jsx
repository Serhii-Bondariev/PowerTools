// src/components/features/home/FeaturedProducts/FeaturedProducts.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: 'Professional Drill Kit',
      price: 299.99,
      rating: 5.8,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format',
      category: 'Power Tools',
      badge: 'New',
    },
    {
      id: 2,
      name: 'Premium Paint Set',
      price: 89.99,
      rating: 4.5,
      reviews: 96,
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format',
      category: 'Paint & Supplies',
      badge: 'Popular',
    },
    {
      id: 3,
      name: 'Digital Laser Measure',
      price: 149.99,
      rating: 4.7,
      reviews: 84,
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format',
      category: 'Measuring Tools',
      badge: 'Best Seller',
    },
    {
      id: 4,
      name: 'Professional Plumbing Set',
      price: 199.99,
      rating: 4.6,
      reviews: 72,
      image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format',
      category: 'Plumbing',
      badge: 'Sale',
    },
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <span className="text-sm text-gray-500 mb-2 block">
                  {product.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.reviews} reviews)
                  </span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  <button className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
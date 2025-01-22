// src/components/features/home/FeaturedProducts/FeaturedProducts.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts } from '../../../../store/slices/productsSlice';
import { addItem } from '../../../../store/slices/cartSlice'; // Змінили addToCart на addItem
import { toggleFavorite } from '../../../../store/slices/productsSlice';

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  const { featuredProducts = [], loading } = useSelector((state) => state.products); // Дефолтне значення

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addItem(product)); // Використовуємо addItem замість addToCart
  };

  const handleToggleFavorite = (productId) => {
    dispatch(toggleFavorite(productId));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-semibold">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => {
              const imageUrl = product.image
                ? `http://localhost:5000${product.image}`
                : '/uploads/placeholders/placeholder.png';
              console.log('Featured Product Image URL:', imageUrl);

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden group"
                >
                  {/* Product Image */}
                  <Link to={`/ProductDetails/${product._id}`}>
                    <div className="relative">
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/uploads/placeholders/placeholder.png';
                        }}
                      />
                      {product.badge && (
                        <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <span className="text-sm text-gray-500 mb-2 block">{product.category}</span>
                    <Link to={`/ProductDetails/${product._id}`}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleFavorite(product._id)}
                          className={`p-3 rounded-lg transition duration-300 ${
                            product.isFavorite
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart
                            className="h-5 w-5"
                            fill={product.isFavorite ? 'currentColor' : 'none'}
                          />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-4 text-gray-500">No featured products available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

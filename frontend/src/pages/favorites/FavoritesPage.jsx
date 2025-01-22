import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FavoriteProductCard from '../../components/FavoriteProductCard/FavoriteProductCard';

export default function FavoritesPage() {
  const favorites = useSelector((state) => state.products.favorites) || [];
  const allProducts = useSelector((state) => state.products.items) || [];
  const products = allProducts.filter((p) => favorites.includes(p._id));

  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">No Favorite Items</h2>
        <p className="mt-4 text-gray-600">Start adding items to your favorites to see them here.</p>
        <Link
          to="/products"
          className="mt-8 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">My Favorites</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <FavoriteProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

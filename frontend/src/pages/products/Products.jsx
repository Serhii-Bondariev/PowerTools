// src/pages/products/Products.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SlidersHorizontal, Heart, ShoppingCart } from 'lucide-react';
import { getProducts, toggleFavorite } from '../../store/slices/productsSlice';
import { addItem as addToCart } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Імпорт стилів для тостів

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, isLoading } = useSelector((state) => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    inStock: false,
  });
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!products) return;

    let result = [...products];

    if (filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category);
    }

    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-');
      result = result.filter((product) => {
        if (max === 'plus') {
          return product.price >= Number(min);
        }
        return product.price >= Number(min) && product.price <= Number(max);
      });
    }

    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        break;
    }

    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  const handleToggleFavorite = (product) => {
    dispatch(toggleFavorite(product._id));
    toast.success(
      product.isFavorite
        ? `${product.name} removed from favorites!`
        : `${product.name} added to favorites!`
    );
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
      })
    );
    toast.success(`${product.name} added to cart!`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden flex items-center gap-2 text-gray-600"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filters
          </button>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                {[
                  'Featured',
                  'Price: Low to High',
                  'Price: High to Low',
                  'Rating',
                  'Most Reviewed',
                ].map((label, i) => (
                  <option key={i} value={label.toLowerCase().replace(/ /g, '-')}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const imageUrl = product.image
                    ? `http://localhost:5000${product.image}`
                    : '/uploads/placeholders/placeholder.png';
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-xl shadow-md overflow-hidden group"
                    >
                      <div className="relative">
                        <Link to={`/ProductDetails/${product._id}`}>
                          <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                          />
                        </Link>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleToggleFavorite(product)}
                              className={`p-3 rounded-lg transition duration-300 ${
                                product.isFavorite
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              <Heart
                                className="h-5 w-5"
                                style={{ fill: product.isFavorite ? 'currentColor' : 'none' }}
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
                <p>No products available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

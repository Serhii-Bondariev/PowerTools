// src/pages/products/Products.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Star, ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { getProducts } from '../../store/slices/productsSlice';
import { addItem as addToCart } from '../../store/slices/cartSlice';

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

  // Константи
  const categories = ['all', 'Power Tools', 'Paint & Supplies', 'Measuring Tools', 'Plumbing'];
  const priceRanges = [
    { label: 'All', value: 'all' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $200', value: '100-200' },
    { label: 'Over $200', value: '200-plus' },
  ];
  const sortOptions = [
    { label: 'Featured', value: 'featured' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Rating', value: 'rating' },
    { label: 'Most Reviewed', value: 'reviews' },
  ];

  // Завантаження продуктів при монтуванні
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Фільтрація та сортування
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Фільтр за категорією
    if (filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category);
    }

    // Фільтр за ціною
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-');
      result = result.filter((product) => {
        if (max === 'plus') {
          return product.price >= Number(min);
        }
        return product.price >= Number(min) && product.price <= Number(max);
      });
    }

    // Фільтр наявності
    if (filters.inStock) {
      result = result.filter((product) => product.stock > 0);
    }

    // Сортування
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

  // Обробник додавання в кошик
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
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
          {/* Filters Sidebar */}
          <div
            className={`
              lg:w-64 lg:block fixed lg:relative top-0 left-0 h-full lg:h-auto z-50
              bg-white lg:bg-transparent p-6 lg:p-0 transform transition-transform duration-300
              ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="lg:sticky lg:top-6">
              <div className="flex justify-between items-center lg:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === category}
                        onChange={() => setFilters({ ...filters, category })}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 capitalize">
                        {category === 'all' ? 'All Categories' : category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === range.value}
                        onChange={() => setFilters({ ...filters, priceRange: range.value })}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                    className="h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort */}
            <div className="flex justify-end mb-6">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-4 py-2"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden group"
                >
                  <div className="relative">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-gray-500 mb-2 block">{product.category}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
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
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center justify-center p-3 rounded-lg transition duration-300
                          ${
                            product.stock > 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 cursor-not-allowed'
                          }`}
                        disabled={product.stock === 0}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// // src/components/features/products/Products.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { Star, ShoppingCart, SlidersHorizontal, ChevronDown, X } from 'lucide-react';

// export default function Products() {
//   const [products, setProducts] = useState([
//     {
//       id: 1,
//       name: 'Professional Drill Kit',
//       price: 299.99,
//       rating: 4.8,
//       reviews: 128,
//       image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format',
//       category: 'Power Tools',
//       stock: 15,
//     },
//     {
//       id: 2,
//       name: 'Premium Paint Set',
//       price: 89.99,
//       rating: 4.5,
//       reviews: 96,
//       image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format',
//       category: 'Paint & Supplies',
//       badge: 'Popular',
//     },
//     {
//       id: 3,
//       name: 'Digital Laser Measure',
//       price: 149.99,
//       rating: 4.7,
//       reviews: 84,
//       image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500&auto=format',
//       category: 'Measuring Tools',
//       badge: 'Best Seller',
//     },
//     {
//       id: 4,
//       name: 'Professional Plumbing Set',
//       price: 199.99,
//       rating: 4.6,
//       reviews: 72,
//       image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format',
//       category: 'Plumbing',
//       badge: 'Sale',
//     },

//     // Додайте більше продуктів...
//   ]);

//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [filters, setFilters] = useState({
//     category: 'all',
//     priceRange: 'all',
//     inStock: false,
//   });
//   const [sortBy, setSortBy] = useState('featured');
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const categories = ['all', 'Power Tools', 'Paint & Supplies', 'Measuring Tools', 'Plumbing'];

//   const priceRanges = [
//     { label: 'All', value: 'all' },
//     { label: 'Under $50', value: '0-50' },
//     { label: '$50 - $100', value: '50-100' },
//     { label: '$100 - $200', value: '100-200' },
//     { label: 'Over $200', value: '200-plus' },
//   ];

//   const sortOptions = [
//     { label: 'Featured', value: 'featured' },
//     { label: 'Price: Low to High', value: 'price-asc' },
//     { label: 'Price: High to Low', value: 'price-desc' },
//     { label: 'Rating', value: 'rating' },
//     { label: 'Most Reviewed', value: 'reviews' },
//   ];

//   useEffect(() => {
//     let result = [...products];

//     // Фільтр за категорією
//     if (filters.category !== 'all') {
//       result = result.filter((product) => product.category === filters.category);
//     }

//     // Фільтр за ціною
//     if (filters.priceRange !== 'all') {
//       const [min, max] = filters.priceRange.split('-');
//       result = result.filter((product) => {
//         if (max === 'plus') {
//           return product.price >= Number(min);
//         }
//         return product.price >= Number(min) && product.price <= Number(max);
//       });
//     }

//     // Фільтр наявності
//     if (filters.inStock) {
//       result = result.filter((product) => product.stock > 0);
//     }

//     // Сортування
//     switch (sortBy) {
//       case 'price-asc':
//         result.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-desc':
//         result.sort((a, b) => b.price - a.price);
//         break;
//       case 'rating':
//         result.sort((a, b) => b.rating - a.rating);
//         break;
//       case 'reviews':
//         result.sort((a, b) => b.reviews - a.reviews);
//         break;
//       default:
//         // Featured залишає оригінальний порядок
//         break;
//     }

//     setFilteredProducts(result);
//   }, [filters, sortBy, products]);

//   return (
//     <div className="bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
//           <button
//             onClick={() => setIsFilterOpen(!isFilterOpen)}
//             className="lg:hidden flex items-center gap-2 text-gray-600"
//           >
//             <SlidersHorizontal className="h-5 w-5" />
//             Filters
//           </button>
//         </div>

//         <div className="flex gap-8">
//           {/* Filters Sidebar */}
//           <div
//             className={`
//             lg:w-64 lg:block fixed lg:relative top-0 left-0 h-full lg:h-auto z-50
//             bg-white lg:bg-transparent p-6 lg:p-0 transform transition-transform duration-300
//             ${isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
//           `}
//           >
//             <div className="lg:sticky lg:top-6">
//               <div className="flex justify-between items-center lg:hidden mb-6">
//                 <h2 className="text-xl font-bold">Filters</h2>
//                 <button onClick={() => setIsFilterOpen(false)}>
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>

//               {/* Categories */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold mb-4">Categories</h3>
//                 <div className="space-y-2">
//                   {categories.map((category) => (
//                     <label key={category} className="flex items-center">
//                       <input
//                         type="radio"
//                         name="category"
//                         checked={filters.category === category}
//                         onChange={() => setFilters({ ...filters, category })}
//                         className="h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2 capitalize">
//                         {category === 'all' ? 'All Categories' : category}
//                       </span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* Price Range */}
//               <div className="mb-8">
//                 <h3 className="text-lg font-semibold mb-4">Price Range</h3>
//                 <div className="space-y-2">
//                   {priceRanges.map((range) => (
//                     <label key={range.value} className="flex items-center">
//                       <input
//                         type="radio"
//                         name="priceRange"
//                         checked={filters.priceRange === range.value}
//                         onChange={() => setFilters({ ...filters, priceRange: range.value })}
//                         className="h-4 w-4 text-blue-600"
//                       />
//                       <span className="ml-2">{range.label}</span>
//                     </label>
//                   ))}
//                 </div>
//               </div>

//               {/* In Stock */}
//               <div>
//                 <label className="flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={filters.inStock}
//                     onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
//                     className="h-4 w-4 text-blue-600"
//                   />
//                   <span className="ml-2">In Stock Only</span>
//                 </label>
//               </div>
//             </div>
//           </div>

//           {/* Products Grid */}
//           <div className="flex-1">
//             {/* Sort */}
//             <div className="flex justify-end mb-6">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="border rounded-lg px-4 py-2"
//               >
//                 {sortOptions.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Products */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="bg-white rounded-xl shadow-md overflow-hidden group"
//                 >
//                   <div className="relative">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
//                     />
//                     {product.stock === 0 && (
//                       <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
//                         Out of Stock
//                       </div>
//                     )}
//                   </div>

//                   <div className="p-6">
//                     <span className="text-sm text-gray-500 mb-2 block">{product.category}</span>
//                     <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>

//                     <div className="flex items-center mb-4">
//                       <div className="flex items-center">
//                         {[...Array(5)].map((_, i) => (
//                           <Star
//                             key={i}
//                             className={`w-4 h-4 ${
//                               i < Math.floor(product.rating)
//                                 ? 'text-yellow-400 fill-current'
//                                 : 'text-gray-300'
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="ml-2 text-sm text-gray-600">
//                         ({product.reviews} reviews)
//                       </span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-2xl font-bold text-gray-900">${product.price}</span>
//                       <button
//                         className={`flex items-center justify-center p-3 rounded-lg transition duration-300
//                           ${
//                             product.stock > 0
//                               ? 'bg-blue-600 text-white hover:bg-blue-700'
//                               : 'bg-gray-300 cursor-not-allowed'
//                           }`}
//                         disabled={product.stock === 0}
//                       >
//                         <ShoppingCart className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

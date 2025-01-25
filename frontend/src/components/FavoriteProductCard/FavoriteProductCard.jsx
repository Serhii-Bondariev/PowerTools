// src/components/FavoriteProductCard/FavoriteProductCard.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { addProduct, toggleFavorite } from '../../store/slices/productsSlice';

export default function FavoriteProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addProduct(product));
    toast.success(`${product.name} додано до кошика!`);
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Будь ласка, увійдіть, щоб додати товар до улюблених');
      return;
    }
    dispatch(toggleFavorite(product._id));
    toast.info('Товар видалено зі списку обраного!');
  };

  const handleCardClick = () => {
    navigate(`/products/${product._id}`);
  };

  const isFavorite = product.favorites && product.favorites.includes(user?._id);

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="w-full h-48 bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
          {product.name}
        </h3>
        <p className="mt-2 text-2xl font-bold text-gray-900">
          ${product.price}
        </p>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <ShoppingCart className="h-5 w-5 inline-block mr-2" />
            До кошика
          </button>
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded-lg ${
              isFavorite
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-600'
            } hover:bg-gray-200 transition`}
          >
            <Heart
              className="h-5 w-5"
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
// // src/components/FavoriteProductCard/FavoriteProductCard.jsx
// import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ShoppingCart, Heart } from 'lucide-react';
// import { addProduct, toggleFavorite } from '../../store/slices/productsSlice';

// export default function FavoritesPage() {
//   const dispatch = useDispatch();
//   const favorites = useSelector((state) => state.products.favorites) || [];
//   const allProducts = useSelector((state) => state.products.items) || [];
//   const products = allProducts.filter((p) => favorites.includes(p._id));

//   const handleAddToCart = (product) => {
//     dispatch(addProduct(product));
//     toast.success(`${product.name} додано до кошика!`);
//   };

//   const handleToggleFavorite = (productId) => {
//     dispatch(toggleFavorite(productId));
//     toast.info('Товар видалено зі списку обраного!');
//   };

//   if (!allProducts.length) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h2 className="text-2xl font-bold text-gray-900 mb-8">My Favorites</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {Array.from({ length: 8 }).map((_, i) => (
//             <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
//               <div className="w-full h-48 bg-gray-200"></div>
//               <div className="p-4">
//                 <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                 <div className="h-4 bg-gray-300 rounded w-1/2"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <ToastContainer />
//       <h2 className="text-2xl font-bold text-gray-900 mb-8">My Favorites</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((product) => (
//           <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden">
//             <Link to={`/products/${product._id}`}>
//               <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
//             </Link>
//             <div className="p-4">
//               <Link to={`/products/${product._id}`}>
//                 <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
//                   {product.name}
//                 </h3>
//               </Link>
//               <p className="mt-2 text-2xl font-bold text-gray-900">${product.price}</p>
//               <div className="mt-4 flex space-x-2">
//                 <button
//                   onClick={() => handleAddToCart(product)}
//                   className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 hover:scale-105"
//                 >
//                   <ShoppingCart className="h-5 w-5 inline-block mr-2" />
//                   Add to Cart
//                 </button>
//                 <button
//                   onClick={() => handleToggleFavorite(product._id)}
//                   className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-transform transform hover:-translate-y-1 hover:scale-105"
//                 >
//                   <Heart className="h-5 w-5" fill="currentColor" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

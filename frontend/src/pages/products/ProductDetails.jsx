// src/pages/products/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductById,
  toggleFavorite,
} from '../../store/slices/productsSlice';
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Star,
  StarHalf,
} from 'lucide-react';
import { addItem } from '../../store/slices/cartSlice';
import { ClipLoader } from 'react-spinners';

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const {
    currentProduct: product,
    isLoading,
    error,
  } = useSelector((state) => state.products);
  const isFavorite = useSelector((state) =>
    state.products.favorites.includes(id),
  );

  useEffect(() => {
    if (!product || product._id !== id) {
      dispatch(getProductById(id));
    }
  }, [dispatch, id, product]);

  const handlePrevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1,
      );
    }
  };

  const handleNextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <ClipLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Error: {error}</h1>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-500">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={`http://localhost:5000${product.image}`}
                  alt={product.name || 'Product Image'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-4 flex gap-4">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square w-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index
                        ? 'border-blue-600'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000${image}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Product Details */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name || 'No Name'}
              </h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                  {product.rating % 1 !== 0 && (
                    <StarHalf className="h-5 w-5 text-yellow-400 fill-current" />
                  )}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>
              <p className="mt-4 text-gray-600">
                {product.description || 'No Description'}
              </p>
              <div className="mt-6">
                <span className="text-3xl text-gray-900">
                  ${product.price || '0.00'}
                </span>
              </div>
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => dispatch(addItem(product))}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                </button>
                <button
                  onClick={() => dispatch(toggleFavorite(product._id))}
                  className={`w-full px-6 py-3 rounded-lg border flex items-center justify-center ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Heart
                    className="h-5 w-5 mr-2"
                    fill={isFavorite ? 'currentColor' : 'none'}
                  />
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// //
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Додаємо імпорт useParams
// import { useDispatch, useSelector } from 'react-redux';
// import { getProductById, toggleFavorite } from '../../store/slices/productsSlice';
// import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
// import { addItem } from '../../store/slices/cartSlice';

// export default function ProductDetails() {
//   const { id } = useParams(); // Отримуємо ID з URL
//   const dispatch = useDispatch();
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   const { currentProduct: product, isLoading, error } = useSelector((state) => state.products);
//   const isFavorite = useSelector((state) => state.products.favorites.includes(id));

//   useEffect(() => {
//     if (!product || product._id !== id) {
//       dispatch(getProductById(id)); // Завантажуємо продукт, якщо його немає в стані
//     }
//   }, [dispatch, id, product]);

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!product) return <div>Product not found</div>;

//   const handlePrevImage = () => {
//     setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
//   };

//   const handleNextImage = () => {
//     setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         <div className="relative">
//           {product.images && product.images.length > 0 ? (
//             <>
//               <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
//                 <img
//                   src={`http://localhost:5000${product.images[currentImageIndex]}`} // Формуємо абсолютний шлях
//                   alt={product.name}
//                   className="w-full h-full object-center object-cover"
//                 />
//               </div>

//               <button
//                 onClick={handlePrevImage}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
//               >
//                 <ChevronLeft className="h-6 w-6" />
//               </button>
//               <button
//                 onClick={handleNextImage}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg"
//               >
//                 <ChevronRight className="h-6 w-6" />
//               </button>

//               <div className="mt-4 grid grid-cols-4 gap-4">
//                 {product.images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentImageIndex(index)}
//                     className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
//                       index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
//                     }`}
//                   >
//                     <img
//                       src={`http://localhost:5000${image}`} // Формуємо абсолютний шлях
//                       alt={`${product.name} ${index + 1}`}
//                       className="w-full h-full object-center object-cover"
//                     />
//                   </button>
//                 ))}
//               </div>
//             </>
//           ) : (
//             <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
//               No images available
//             </div>
//           )}
//         </div>

//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//           <div className="mt-4">
//             <span className="text-3xl text-gray-900">${product.price}</span>
//           </div>

//           <div className="mt-8 space-y-4">
//             <button
//               onClick={() => dispatch(addItem(product))}
//               className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center"
//             >
//               <ShoppingCart className="h-5 w-5 mr-2" />
//               Add to Cart
//             </button>

//             <button
//               onClick={() => dispatch(toggleFavorite(product._id))}
//               className={`w-full px-6 py-3 rounded-lg border flex items-center justify-center ${
//                 isFavorite
//                   ? 'bg-red-50 border-red-200 text-red-600'
//                   : 'border-gray-300 hover:bg-gray-50'
//               }`}
//             >
//               <Heart className="h-5 w-5 mr-2" fill={isFavorite ? 'currentColor' : 'none'} />
//               {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
//             </button>
//           </div>

//           <div className="mt-8">
//             <h2 className="text-xl font-semibold text-gray-900">Description</h2>
//             <p className="mt-4 text-gray-600">{product.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

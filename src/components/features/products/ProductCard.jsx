// src/components/features/products/ProductCard.jsx
import React from 'react';
import { Star, StarHalf, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const { name, price, rating, image } = product;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-4 w-4 text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half-star" className="h-4 w-4 text-yellow-400 fill-current" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg card-shadow overflow-hidden">
      <div className="relative">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <button
          className="absolute top-2 right-2 btn-secondary p-2 rounded-full shadow-md"
          aria-label="Quick view"
        >
          <Eye className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-gray-600 mb-2">${price.toFixed(2)}</p>
        <div className="flex items-center mb-2">
          {renderStars(rating)}
        </div>
        <button className="w-full btn-primary py-2 rounded-lg">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
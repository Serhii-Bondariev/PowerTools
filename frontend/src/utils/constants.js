// src/utils/constants.js
// API URLs
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
export const UPLOADS_URL = `${API_URL}/uploads`;

// Images
export const PLACEHOLDER_IMAGE = '/images/placeholder-image.png';
export const DEFAULT_PRODUCT_IMAGE = '/images/default-product.png';

//Navigation
export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Cart', path: '/cart' },
];
// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Status colors
export const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// Image paths helpers
export const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  return `${UPLOADS_URL}/${imagePath.split('/').pop()}`;
};

// src/utils/constants.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const NAVIGATION_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'Cart', path: '/cart' }
];

// src/utils/helpers.js
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
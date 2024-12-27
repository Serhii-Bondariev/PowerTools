// src/utils/helpers.js
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ua-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
};

export function formatPrice(price) {
  return new Intl.NumberFormat('ua-UA', {
    style: 'currency',
    currency: 'UAH',
  }).format(price);
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// src/utils/formatters.js
export const formatPrice = (price) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH'
  }).format(price);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('uk-UA').format(new Date(date));
};

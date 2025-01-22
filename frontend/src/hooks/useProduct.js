// // src/hooks/useProduct.js
// import { useState, useEffect } from 'react';

// export function useProduct(productId) {
//   const [product, setProduct] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setIsLoading(true);
//         // Тут має бути ваш API запит
//         // Поки що використовуємо моковані дані
//         const mockProduct = {
//           id: productId,
//           name: "Power Drill Pro",
//           specifications: {
//             "Power Source": "20V Lithium Ion Battery",
//             "Chuck Size": "1/2 inch",
//             "Speed": "0-2000 RPM",
//             "Weight": "3.5 lbs",
//           }
//         };
//         setProduct(mockProduct);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   return { product, isLoading, error };
// }

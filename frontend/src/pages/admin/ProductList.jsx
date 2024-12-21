// frontend/src/pages/admin/ProductList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, removeProduct } from '../../store/slices/productsSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const deleteHandler = (id) => {
    if (window.confirm('Ви впевнені?')) {
      dispatch(removeProduct(id));
    }
  };

  return (
    <div>
      <h1>Продукти</h1>
      {loading ? (
        <p>Завантаження...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Назва</th>
              <th>Ціна</th>
              <th>Категорія</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.price}₴</td>
                <td>{product.category}</td>
                <td>
                  <button onClick={() => deleteHandler(product._id)}>Видалити</button>
                  <button>Редагувати</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductList;

// backend/controllers/productController.js
import { Product } from '../models/productModel.js';

// Отримати всі продукти
export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

// Отримати продукт за ID
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Продукт не знайдено');
  }
};

// Додати новий продукт (тільки адмін)
export const addProduct = async (req, res) => {
  const { name, description, price, image, category, brand, countInStock } = req.body;

  const product = new Product({
    name,
    description,
    price,
    image,
    category,
    brand,
    countInStock,
    user: req.user._id, // додаємо ID адміна
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

// Оновити продукт (тільки адмін)
export const updateProduct = async (req, res) => {
  const { name, description, price, image, category, brand, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Продукт не знайдено');
  }
};

// Видалити продукт (тільки адмін)
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Продукт видалено' });
  } else {
    res.status(404);
    throw new Error('Продукт не знайдено');
  }
};

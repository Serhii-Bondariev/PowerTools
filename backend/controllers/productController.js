// backend/controllers/productController.js
import asyncHandler from 'express-async-handler';
import { Product } from '../models/productModel.js';

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
// backend/controllers/productController.js
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // Створюємо об'єкт продукту
    const productData = {
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock)
    };

    // Якщо є файл, додаємо шлях до зображення
    if (req.file) {
      productData.image = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.category = req.body.category || product.category;
      product.stock = req.body.stock || product.stock;

      // Якщо є новий файл, оновлюємо зображення
      if (req.file) {
        // Видаляємо старе зображення, якщо воно існує
        if (product.image) {
          const oldImagePath = path.join(__dirname, '..', product.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        product.image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};
// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
// const updateProduct = asyncHandler(async (req, res) => {
//   const product = await Product.findById(req.params.id);

//   if (product) {
//     product.name = req.body.name || product.name;
//     product.description = req.body.description || product.description;
//     product.price = req.body.price || product.price;
//     product.category = req.body.category || product.category;
//     product.stock = req.body.stock || product.stock;
//     if (req.file) {
//       product.image = req.file.path;
//     }

//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } else {
//     res.status(404);
//     throw new Error('Product not found');
//   }
// });

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// Експортуємо всі функції одним блоком
export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
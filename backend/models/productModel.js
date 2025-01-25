// backend/models/productModel.js
import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: [String],
      required: false,
      default: [],
    },
    badge: {
      type: String,
      enum: ['Акція', 'Хіт продажів', ''], // Лише ці значення дозволені
      default: '', // За замовчуванням бейдж відсутній
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model('Product', productSchema);

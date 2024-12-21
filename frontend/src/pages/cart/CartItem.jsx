// src/features/cart/CartItem.jsx
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

export function CartItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex items-center py-4 border-b">
      <img
        src={item.image}
        alt={item.name}
        className="h-20 w-20 object-cover rounded"
      />
      <div className="flex-1 ml-4">
        <h3 className="text-lg font-medium">{item.name}</h3>
        <p className="text-gray-600">${item.price}</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="mx-2 w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-full"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}

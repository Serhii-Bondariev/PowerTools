// src/components/features/cart/Cart/Cart.jsx
import React from 'react';
import { useCart } from '../../../../../src/hooks/useCart';
import { CartItem } from '../../../../pages/cart/CartItem';
import { CartSummary } from '../../../../pages/cart/CartSummary';
import { ShoppingBag } from 'lucide-react';
// src/components/features/cart/Cart.jsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { CartItem } from './CartItem';
// import { CartSummary } from './CartSummary';
// import { ShoppingBag } from 'lucide-react';

export function Cart() {
  // Отримуємо items з Redux store з перевіркою на undefined
  const items = useSelector(state => state.cart?.items) || [];
  const isLoading = useSelector(state => state.cart?.isLoading);

  if (isLoading) {
    return <CartSkeleton />;
  }

  // Перевіряємо чи масив пустий
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                />
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <CartSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-4">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-4 mb-6 last:mb-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
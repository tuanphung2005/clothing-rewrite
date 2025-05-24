// lib/cart-context.tsx
'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CartItem, CartContextType } from '@/types/auth';
import { useAuth } from './auth-context';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    await fetchCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const response = await fetch('/api/cart/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, quantity }),
    });

    if (!response.ok) {
      throw new Error('Failed to update item quantity');
    }

    await fetchCart();
  };

  const removeFromCart = async (itemId: number) => {
    const response = await fetch('/api/cart/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    await fetchCart();
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.warn('Cart clear API failed, but cart might already be empty');
      }

      setCartItems([]);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      setCartItems([]);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      setCartItems, // Add this line
      totalPrice,
      totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
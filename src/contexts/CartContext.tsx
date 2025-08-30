// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { allProducts } from '@/data/products'; // Assuming this is your main product list
import { useToast } from '@/components/ui/use-toast'; // For notifications

// Define the Product type based on your allProducts structure
// We'll use a simplified version for the cart, ensure all necessary fields are present
export interface Product {
  id: number;
  name: string;
  price: string; // e.g., "KSh 35,799"
  image: string;
  originalPrice?: string | null;
  rating?: number;
  reviews?: number;
  description?: string;
  badge?: string | null;
  category?: string;
  discount?: string; // To align with SupabaseProduct for displaying discounts in cart
  // Add any other fields from your product objects that you might need in the cart or product page
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isProductInCart: (productId: number) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to parse price string like "KSh 1,234" to number
const parsePrice = (priceString: string): number => {
  if (!priceString) return 0;
  return parseFloat(priceString.replace(/KSh\s*|,/g, ''));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('shoppingCart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        toast({
          title: "Item Updated in Cart",
          description: `${product.name} quantity increased to ${existingItem.quantity + quantity}.`,
        });
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      toast({
        title: "Item Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Item Removed",
          description: `${itemToRemove.name} has been removed from your cart.`,
          variant: "destructive",
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => {
      return total + parsePrice(item.price) * item.quantity;
    }, 0);
  };

  const getCartItemCount = (): number => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isProductInCart = (productId: number): boolean => {
    return cartItems.some(item => item.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isProductInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
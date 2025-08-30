// src/pages/CartPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartItemCount,
    clearCart 
  } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button onClick={() => navigate('/')}>Start Shopping</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleProceedToCheckout = () => {
    // For now, just log or navigate to a placeholder
    console.log("Proceeding to checkout with items:", cartItems);
    navigate('/checkout'); // We'll create this page later
  };
  
  // Helper to parse price string like "KSh 1,234" to number for display
  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/KSh\s*|,/g, ''));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Shopping Cart ({getCartItemCount()} items)</h1>
        
        <div className="lg:flex lg:space-x-8">
          {/* Cart Items List */}
          <div className="lg:w-2/3 bg-white p-6 rounded-lg shadow-md mb-6 lg:mb-0">
            {cartItems.map(item => (
              <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex items-center mb-4 sm:mb-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded mr-4" />
                  <div>
                    <h2 className="text-md font-semibold text-gray-800 hover:text-orange-600 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h2>
                    <p className="text-sm text-gray-500">Unit Price: KSh {parsePrice(item.price).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-r-none">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 text-sm font-medium w-10 text-center">{item.quantity}</span>
                    <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-l-none">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-md font-semibold text-gray-800 w-24 text-right">
                    KSh {(parsePrice(item.price) * item.quantity).toLocaleString()}
                  </p>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
             {cartItems.length > 0 && (
              <div className="mt-6 text-right">
                <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-600 hover:bg-red-50">
                  Clear Cart
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">KSh {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">KSh 0</span> {/* Placeholder */}
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-4 mt-2">
                <span>Total</span>
                <span>KSh {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            <Button 
              size="lg" 
              className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold py-3"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
            <Button 
              variant="link" 
              className="w-full mt-4 text-orange-600"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CartPage;

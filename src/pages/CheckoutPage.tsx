// src/pages/CheckoutPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (cartItems.length === 0) {
    navigate('/cart'); 
    return null;
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log for internal tracking, no actual payment processing here
    console.log("Proceeding to Order Confirmation:", {
      items: cartItems,
      total: getCartTotal(),
    });
    
    // No toast here, as the order isn't 'placed' until WhatsApp
    // The cart is also not cleared here, but on the confirmation page after sending to WhatsApp.
    
    navigate('/order-confirmation', { state: { orderDetails: { items: cartItems, total: getCartTotal() } } });
  };
  
  // Helper to parse price string for display
  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/KSh\s*|,/g, ''));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Confirm Your Order</h1>
        
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handlePlaceOrder} className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            {/* Order Summary (now primary content) */}
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-6">Your Order</h2>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded mr-3" />
                    <div>
                        <p className="text-gray-700">{item.name} (x{item.quantity})</p>
                        <p className="text-xs text-gray-500">KSh {parsePrice(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-gray-800 font-medium">KSh {(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-800 font-medium">KSh {getCartTotal().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800 font-medium">KSh 0</span> {/* Placeholder */}
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800 border-t pt-4 mt-2">
                <span>Total</span>
                <span>KSh {getCartTotal().toLocaleString()}</span>
              </div>
            </div>
            <Button 
              type="submit"
              size="lg" 
              className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold py-3 mt-8"
            >
              Proceed to Confirm Order
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;

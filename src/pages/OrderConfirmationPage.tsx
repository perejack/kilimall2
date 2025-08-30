// src/pages/OrderConfirmationPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useCart, CartItem } from '@/contexts/CartContext'; // Import useCart and CartItem
import { useToast } from '@/components/ui/use-toast'; // Import useToast

interface OrderDetails {
  items: CartItem[];
  total: number;
  // paymentMethod: string; // Removed
}

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart(); // Get clearCart from context
  const { toast } = useToast(); // For notifications
  const orderDetails = location.state?.orderDetails as OrderDetails | undefined;

  useEffect(() => {
    if (!orderDetails) {
      // If no order details are passed, redirect to home
      // This prevents direct access to this page without placing an order
      navigate('/');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null; // Or a loading spinner, though redirect should be quick
  }
  
  // Helper to parse price string for display
  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/KSh\s*|,/g, ''));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center text-center">
        <Card className="w-full max-w-2xl p-6 md:p-10 shadow-xl">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Thank You For Your Order!</h1>
            <p className="text-gray-600 mb-1">Your order has been placed successfully.</p>
            <p className="text-gray-600 mb-6 text-sm">You will receive an email confirmation shortly. (Simulation)</p>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-left">Order Summary</h2>
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto text-left">
              {orderDetails.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm py-2 border-b last:border-b-0">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded mr-3" />
                    <div>
                        <p className="text-gray-700 font-medium">{item.name} (x{item.quantity})</p>
                        <p className="text-xs text-gray-500">KSh {parsePrice(item.price).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="text-gray-800 font-semibold">KSh {(parsePrice(item.price) * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 text-left mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-800 font-medium">KSh {orderDetails.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="text-gray-800 font-medium">KSh 0</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 mt-1">
                    <span>Total to Pay:</span>
                    <span>KSh {orderDetails.total.toLocaleString()}</span>
                </div>
            </div>

            {/* Payment method display removed */}
          </div>
          
          <Button 
            onClick={() => {
              if (!orderDetails) return;

              const WHATSAPP_NUMBER = "+254750226297"; // Updated WhatsApp number
              let message = "I would like to order the following items:\n";
              orderDetails.items.forEach(item => {
                message += `- ${item.name} (Qty: ${item.quantity}) - KSh ${parsePrice(item.price).toLocaleString()}\n`;
              });
              message += `\nTotal: KSh ${orderDetails.total.toLocaleString()}`;

              const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
              
              toast({
                title: "Redirecting to WhatsApp...",
                description: "Your order details are being prepared.",
              });

              // Open WhatsApp in a new tab
              window.open(whatsappUrl, '_blank');

              // Clear cart and navigate home after a short delay to allow WhatsApp to open
              setTimeout(() => {
                clearCart();
                navigate('/', { replace: true }); // Replace current history entry
                toast({
                  title: "Order Sent to WhatsApp!",
                  description: "Your cart has been cleared. You are now on the homepage.",
                });
              }, 1500); // Delay to ensure WhatsApp has a chance to open
            }} 
            className="mt-10 w-full max-w-xs mx-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3"
            size="lg"
          >
            Complete Order via WhatsApp
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

// Simple Card component for styling, if not already globally available or part of a UI library
// If you have a Card component from shadcn/ui, you can import and use that instead.
const Card: React.FC<{children: React.ReactNode, className?: string}> = ({children, className}) => {
    return <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
}


export default OrderConfirmationPage;

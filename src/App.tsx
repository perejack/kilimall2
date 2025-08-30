
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import NotFound from "./pages/NotFound";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminAddProductPage from "./pages/admin/AdminAddProductPage";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppChat from './components/WhatsAppChat';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext'; // Added
import AdminLoginPage from './pages/admin/AdminLoginPage'; // Added
import ProtectedRoute from './components/ProtectedRoute'; // Added

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <CartProvider>
        <BrowserRouter>
        <ScrollToTop />
        <WhatsAppChat />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          {/* Admin Login Route (public) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin Routes (now public, no authentication) */}
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/products/edit/:productId" element={<AdminEditProductPage />} />
          <Route path="/admin/products/add" element={<AdminAddProductPage />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

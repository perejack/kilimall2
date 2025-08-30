
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Adjusted path assuming Header.tsx is in src/components
import { Search, ShoppingCart, User, Menu, MapPin, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { getCartItemCount } = useCart();
  const itemCount = getCartItemCount();

  return (
    <div className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top banner - hidden on mobile */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">11th Anniversary</span>
            <span>📦 Orders &gt; KSh 1,799; Large Products Excluded</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Seller Center</span>
            <span>📱 Download App</span>
            <span>Help Center</span>
            <div className="flex items-center space-x-1">
              <img src="https://flagcdn.com/w20/ke.png" alt="Kenya" className="w-4 h-3" />
              <span>Kenya</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-3 md:py-4 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-2 md:px-3 py-1 md:py-2 rounded-lg font-bold text-lg md:text-xl">
              K
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kilimall</h1>
              <p className="text-xs text-gray-500 hidden md:block">Affordable Online Shopping</p>
            </div>
          </div>

          {/* Search bar - mobile responsive */}
          <div className={`flex-1 max-w-2xl mx-4 md:mx-8 ${isSearchFocused ? 'fixed inset-x-4 top-4 z-50 md:relative md:inset-auto md:top-auto' : ''}`}>
            <div className="relative">
              <Input
                type="text"
                placeholder="I'm looking for..."
                className="w-full pl-4 pr-12 py-2 md:py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 text-sm md:text-base"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Button
                size="sm"
                className="absolute right-0 top-0 h-full px-3 md:px-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-l-none"
              >
                <Search className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>

          {/* User actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link to="/cart">
              <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2 hover:bg-orange-50 p-2 md:p-3 relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden lg:inline text-sm">Cart</span>
                {itemCount > 0 && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button variant="ghost" className="hidden md:flex items-center space-x-2 hover:bg-orange-50">
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">My Account</span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setIsMenuOpen(false)}>
          <div 
          className={`bg-white w-80 h-full shadow-lg p-4 fixed top-0 left-0 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-2">
                  <User className="w-6 h-6 text-gray-700" />
                  <span className="font-medium text-gray-800">My Account</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="space-y-1 text-gray-700">
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Fashion</a>
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Electronics</a>
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Home & Living</a>
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Phones & Accessories</a>
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Appliances</a>
                <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm font-medium">Sports & Outdoors</a>
                <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                  <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm">Seller Center</a>
                  <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm">Download App</a>
                  <a href="#" className="block px-3 py-2.5 rounded-md hover:bg-orange-50 text-sm">Help Center</a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - scrollable on mobile */}
      <div className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center space-x-4 md:space-x-8 py-3 overflow-x-auto scrollbar-hide">
            <span className="text-sm text-gray-600 whitespace-nowrap">Smart TV</span>
            <span className="text-sm text-gray-600 whitespace-nowrap">Anniv Deals First Look</span>
            <span className="text-sm text-gray-600 whitespace-nowrap hidden md:inline">Sneak Peek - Anniversary Sale</span>
            <span className="text-sm text-gray-600 whitespace-nowrap">Redmi</span>
            <span className="text-sm text-gray-600 whitespace-nowrap hidden md:inline">Size Anniv Voucher</span>
            <span className="text-sm text-gray-600 whitespace-nowrap">Speaker</span>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;

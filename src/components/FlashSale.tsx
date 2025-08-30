import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useProducts, SupabaseProduct } from '../contexts/ProductContext';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 41,
    seconds: 51
  });
  const navigate = useNavigate();
  const { products: allProductsFromContext, loading: contextLoading, error: contextError } = useProducts();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Select first 5 products for Flash Sale, or products with a specific tag in a real scenario
  const flashSaleProductsToDisplay = useMemo(() => {
    if (!allProductsFromContext || allProductsFromContext.length === 0) return [];
    // Example: filter by a tag like 'flash-sale' if your data supports it
    // const saleItems = allProductsFromContext.filter(p => p.tags?.includes('flash-sale'));
    // return saleItems.length > 0 ? saleItems.slice(0, 5) : allProductsFromContext.slice(0, 5);
    return allProductsFromContext.slice(0, 5);
  }, [allProductsFromContext]);

  return (
    <div className="py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Flash Sale Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between sm:space-y-0 space-y-3">
            <div className="flex items-center space-x-3 self-start sm:self-center">
              <div className="bg-white/20 p-2 rounded-full">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Flash Sale</h2>
              <span className="text-white/90 hidden sm:inline">Ends in</span>
            </div>

            {/* Timer and View More - flex container for mobile layout control */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-2 w-full sm:w-auto space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-white/90 sm:hidden text-sm">Ends in:</span>
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold min-w-[50px] text-center">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold min-w-[50px] text-center">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-red-600 text-white px-3 py-2 rounded-lg font-bold min-w-[50px] text-center">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
              </div>
              <button className="w-full sm:w-auto sm:ml-4 text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                View more
              </button>
            </div>
          </div>
        </div>

        {/* Flash Sale Products */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {
              contextLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-flash-${index}`} />
                ))
                : contextError
                ? <p className="text-red-500 col-span-full text-center">Error loading flash sale: {contextError}</p>
                : flashSaleProductsToDisplay.length === 0
                ? <p className="text-gray-500 col-span-full text-center">No flash sale products available right now.</p>
                : flashSaleProductsToDisplay.map((product: SupabaseProduct) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-all duration-200 cursor-pointer group border border-orange-200 hover:border-orange-400 active:scale-95"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy"
                        />
                        {product.tags && product.tags.length > 0 && product.tags[0] && (
                          <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                            {product.tags[0]}
                          </Badge>
                        )}
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          ⚡ FLASH
                        </div>
                      </div>

                      <div className="p-3 space-y-2">
                        <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-lg font-bold text-red-600">{product.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;

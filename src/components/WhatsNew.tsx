import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useProducts, SupabaseProduct } from '../contexts/ProductContext';

const WhatsNew = () => {
  const navigate = useNavigate();
  const { products: allProductsFromContext, loading: contextLoading, error: contextError } = useProducts();

  // Determine What's New products - e.g., last 6 added or a specific category/tag
  // For this example, let's take the last 6 products as "new"
  const whatsNewProductsToDisplay = React.useMemo(() => {
    if (!allProductsFromContext || allProductsFromContext.length === 0) return [];
    return allProductsFromContext.slice(-6).reverse(); // Show newest first by reversing the slice of last 6
  }, [allProductsFromContext]);

  return (
    <div className="py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">What's New</h2>
            <button className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-1">
              <span>View More</span>
              {/* Optional: Add ChevronRight icon here if desired */}
              {/* <ChevronRight className="w-4 h-4" /> */}
            </button>
          </div>
        </div>

        {/* Products */}
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {
              contextLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-new-${index}`} />
                  ))
                : contextError
                ? <p className="text-red-500 col-span-full text-center">Error loading products: {contextError}</p>
                : whatsNewProductsToDisplay.length === 0
                ? <p className="text-gray-500 col-span-full text-center">No new products to show at the moment.</p>
                : whatsNewProductsToDisplay.map((product: SupabaseProduct) => (
                  <Card 
                    key={product.id} 
                    className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-gray-50 hover:bg-white active:scale-95"
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
                          <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">
                            {product.tags[0]}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-3 space-y-2 text-center">
                        <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          {product.category?.replace('-', ' ')}
                        </div>
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

export default WhatsNew;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductCardSkeleton from './ProductCardSkeleton';
import { useProducts, SupabaseProduct } from '@/contexts/ProductContext';

const RecommendedProducts = () => {
  const navigate = useNavigate();
  const { products: allProductsFromContext, loading: contextLoading, error: contextError } = useProducts();

  // Determine products to display
  const recommendedProductsToDisplay = React.useMemo(() => {
    // Example: take first 12 products, or implement more specific logic (e.g. based on tags or category)
    return allProductsFromContext.slice(0, 12);
  }, [allProductsFromContext]);

  const row1Products = recommendedProductsToDisplay.slice(0, 6);
  const row2Products = recommendedProductsToDisplay.slice(6, 12);

  // Original static data removed


  const renderStars = (rating: number | null | undefined) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${rating && i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">You May Also Like</h2>
          </div>
        </div>

        {/* Products */}
        <div className="p-4">
          <div className="flex overflow-x-auto scrollbar-hide space-x-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:space-x-0">
            {
              contextLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <ProductCardSkeleton key={`skeleton-rec1-${index}`} />
                  ))
                : contextError
                ? <div className="col-span-full text-center py-6"><p className="text-red-500">Error: {contextError}</p></div>
                : row1Products.length === 0 && row2Products.length === 0 
                ? <div className="col-span-full text-center py-6"><p className="text-gray-500">No recommendations available.</p></div>
                : row1Products.map((product: SupabaseProduct) => (
              <Card 
                key={product.id} 
                className="min-w-[170px] sm:min-w-0 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-orange-100 hover:border-orange-300 active:scale-95"
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
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                        {product.tags[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
                    </div>
                    
                    <p className="text-lg font-bold text-red-600">{product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex overflow-x-auto scrollbar-hide space-x-4 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 sm:gap-4 sm:space-x-0 mt-4">
            {/* Second row of products */}
            {contextLoading
              ? Array.from({ length: 6 }).map((_, index) => (
                  <ProductCardSkeleton key={`skeleton-rec2-${index}`} />
                ))
              : row2Products.map((product: SupabaseProduct) => (

              <Card 
                key={product.id} 
                className="min-w-[170px] sm:min-w-0 hover:shadow-xl transition-all duration-300 cursor-pointer group border border-orange-100 hover:border-orange-300 active:scale-95"
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
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-xs">
                        {product.tags[0]}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
                    </div>
                    
                    <p className="text-lg font-bold text-red-600">{product.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedProducts;

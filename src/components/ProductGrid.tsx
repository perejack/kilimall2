
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProducts, SupabaseProduct } from '@/contexts/ProductContext';
import ProductCardSkeleton from './ProductCardSkeleton';

const ProductGrid = () => {
  const { products: allProductsFromContext, loading: contextLoading, error: contextError } = useProducts();
  const navigate = useNavigate();
  const INITIAL_PRODUCTS_TO_SHOW = 12;
  const PRODUCTS_TO_SHOW_INCREMENT = 12;

  const [visibleCount, setVisibleCount] = useState(INITIAL_PRODUCTS_TO_SHOW);

  const productsToDisplay = allProductsFromContext?.slice(0, visibleCount);

  const handleShowMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + PRODUCTS_TO_SHOW_INCREMENT, allProductsFromContext?.length || 0));
  };

  const renderStars = (rating: number | null | undefined) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${rating && i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="py-6 md:py-8">
      {/* Mobile: 2 columns, Tablet: 3 columns, Desktop: 4-6 columns */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {
        contextLoading
          ? Array.from({ length: INITIAL_PRODUCTS_TO_SHOW }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))
          : contextError
          ? <div className="col-span-full text-center py-10">
              <p className="text-red-500 text-lg">Error loading products: {contextError}</p>
            </div>
          : productsToDisplay.length === 0
          ? <div className="col-span-full text-center py-10">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          : productsToDisplay.map((product: SupabaseProduct) => (
          <Card 
            key={product.id} 
            className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white overflow-hidden active:scale-95"
            onClick={() => handleProductClick(product.id)}
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {product.tags && product.tags.length > 0 && product.tags[0] && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                    {product.tags[0]}
                  </Badge>
                )}
              </div>
              
              <div className="p-2 md:p-3 space-y-1 md:space-y-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-800 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm md:text-lg font-bold text-red-600">{product.price}</p>
                    {product.original_price && (
                      <p className="text-xs md:text-sm text-gray-500 line-through">{product.original_price}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
            {!contextLoading && !contextError && productsToDisplay.length > 0 && visibleCount < allProductsFromContext.length && (
        <div className="text-center mt-6 md:mt-8">
          <button 
            onClick={handleShowMore}
            className="px-6 md:px-8 py-2 md:py-3 border-2 border-gray-300 text-gray-600 font-medium rounded-lg hover:border-orange-500 hover:text-orange-600 transition-colors text-sm md:text-base active:scale-95"
          >
            SHOW MORE
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

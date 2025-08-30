import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ProductCardSkeleton = () => {
  return (
    <Card className="border-0 bg-white overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <div className="w-full h-32 sm:h-40 md:h-48 bg-gray-200 animate-pulse"></div>
        </div>
        <div className="p-2 md:p-3 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse mt-1"></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCardSkeleton;

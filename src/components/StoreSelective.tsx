
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const storeProducts = [
  {
    id: 101,
    name: "[Limited Offer] Sonar 2L 1500W Electric Kettle Energy Saving",
    price: "KSh 629",
    originalPrice: null,
    rating: 4,
    reviews: 234,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    badge: "Limited Offer"
  },
  {
    id: 102,
    name: "Vitron 1.5L Multifunctional 2 In 1 Blender VB-Y66 Powerful",
    price: "KSh 2,099",
    originalPrice: null,
    rating: 4,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop",
    badge: null
  },
  {
    id: 103,
    name: "Vitron 137L Chest Freezer Single Flip-Up Lid Defrost",
    price: "KSh 26,799",
    originalPrice: null,
    rating: 4,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop",
    badge: null
  },
  {
    id: 104,
    name: "Vitron 125L Double Doors Refrigerator VDR128DS",
    price: "KSh 27,799",
    originalPrice: null,
    rating: 4,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=300&h=300&fit=crop",
    badge: null
  },
  {
    id: 105,
    name: "Vitron 32 Inch Frameless Smart TV HD Netflix",
    price: "KSh 10,599",
    originalPrice: null,
    rating: 4,
    reviews: 1825,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop",
    badge: null
  },
  {
    id: 106,
    name: "Vitron 32 inch Frameless Television HTC 3218 LED",
    price: "KSh 9,899",
    originalPrice: null,
    rating: 4,
    reviews: 751,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop",
    badge: null
  }
];

const StoreSelective = () => {
  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="mt-12">
      {/* Store Header */}
      <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-600 text-white px-3 py-1 rounded font-bold text-sm">
              Vitron
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold">Vitron Official Store</span>
              <Badge className="bg-orange-500 text-white text-xs">
                Brand Official
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-center">
              <div className="text-gray-600 text-sm">Score</div>
              <div className="text-red-500 text-xl font-bold">4.5</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 text-sm">All Products</div>
              <div className="text-gray-900 text-xl font-bold">44</div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-300">
                <Store className="w-4 h-4 mr-2" />
                Visit Store
              </Button>
              <Button variant="outline" className="border-gray-300">
                💬 Chat Seller
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Selective Products */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-xl font-bold mb-6">Store Selective</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {storeProducts.map((product) => (
            <Card 
              key={product.id} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white overflow-hidden"
              onClick={() => handleProductClick(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <Badge className="absolute top-1 left-1 bg-red-500 text-white text-xs">
                      {product.badge}
                    </Badge>
                  )}
                </div>
                
                <div className="p-2 space-y-1">
                  <h4 className="text-xs font-medium text-gray-800 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h4>
                  
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-red-600">{product.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreSelective;

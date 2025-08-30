
import React, { useState, useEffect } from 'react';
import { useCart, Product as CartProductType } from '@/contexts/CartContext'; // Corrected path
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, SupabaseProduct } from '@/contexts/ProductContext';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoreSelective from "@/components/StoreSelective";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Heart, Share2, Minus, Plus } from 'lucide-react';

const ProductPage = () => {
  const { products: allProductsFromContext, loading, error: productError, fetchProducts } = useProducts();
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart, isProductInCart } = useCart();

  const product: SupabaseProduct | undefined = React.useMemo(() => 
    allProductsFromContext.find(p => p.id === Number(productId))
  , [allProductsFromContext, productId]);

  useEffect(() => {
    setSelectedImage(0);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (productError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading product</h3>
          <p className="text-gray-600 mb-6">{productError}</p>
          <Button onClick={() => fetchProducts()} className="bg-red-500 hover:bg-red-600 text-white mr-2">Try Again</Button>
          <Button onClick={() => navigate('/')} variant="outline">Go to Homepage</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Header />
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Button onClick={() => navigate('/')}>Go to Homepage</Button>
        </div>
        <Footer />
      </div>
    );
  }

  // The existing product structure is fine, we just need to ensure all fields are potentially available
  // from allProducts. For example, 'images' might be just 'image' in allProducts.
  // We'll adapt the rendering part if needed, but first let's get the data flowing.
  // For now, assuming 'product' found from allProducts has a similar enough structure.
  // The sample product data below this will be effectively replaced by the found 'product'.




  const renderStars = (rating: number | null | undefined) => {
    const numRating = Math.floor(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    if (product) {
      const cartProductData: CartProductType = {
        id: product.id,
        name: product.name,
        price: product.price, 
        image: product.image, 
        originalPrice: product.original_price || undefined,
      };
      addToCart(cartProductData, quantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Breadcrumb - simplified for mobile */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 overflow-x-auto">
              <span 
                className="hover:text-orange-600 cursor-pointer whitespace-nowrap"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <span>{'>'}</span>
              <span 
                className="hover:text-orange-600 cursor-pointer whitespace-nowrap"
                onClick={() => navigate(`/category/${product.category || 'general'}`)}
              >
                {(product.category || 'General')?.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </span>
              <span className="hidden md:inline">{'>'}</span>
              <span className="text-gray-900 truncate hidden md:inline">{(product.name || 'Product').substring(0,20)}...</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          {/* Mobile-first layout */}
          <div className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative rounded-lg">
                <Badge className="absolute top-4 left-4 bg-white text-orange-600 font-bold text-xs">
                  11th Anniversary
                </Badge>
                <Badge className="absolute top-4 right-4 bg-red-600 text-white text-xs">
                  14 MONTHS WARRANTY
                </Badge>
                <img 
                  src={(product.images && product.images.length > 0 ? product.images : [product.image])[selectedImage] || product.image} 
                  alt={product.name}
                  className="w-full h-auto object-contain max-h-[350px] sm:max-h-[400px] md:max-h-[500px] rounded-lg"
                />
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-sm font-bold">
                  WOW
                </div>
                <div className="absolute bottom-4 right-4 text-white text-sm md:text-lg font-bold">
                  Vitron 32 inch Smart TV
                </div>
              </div>
              
              {/* Image thumbnails */}
              <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                {(product.images && product.images.length > 0 ? product.images : [product.image].filter(Boolean) as string[]).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 ease-in-out flex-shrink-0 ${selectedImage === index ? 'ring-2 ring-red-500 ring-offset-2 shadow-lg' : 'border border-gray-200 hover:border-gray-400'}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 md:space-y-6">
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-700 mt-4 text-sm leading-relaxed">
                  {product.description}
                </p>
                {product.tags && product.tags.length > 0 && product.tags[0] && <Badge className="mt-2 bg-green-100 text-green-700 text-xs">{product.tags[0]}</Badge>}
                
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    {renderStars(product.rating)}
                    <span className="ml-1 text-sm text-gray-600">{product.rating || 0}</span>
                  </div>
                  <span className="text-blue-500 text-sm hover:underline cursor-pointer">
                    {product.reviews_count || 0} Customer reviews
                  </span>
                </div>
              </div>

              {/* Limited Offer Banner */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 md:p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <span className="text-orange-500 text-xs md:text-sm">⚡</span>
                    </div>
                    <span className="font-bold text-sm md:text-base">Limited Offer</span>
                  </div>
                  <span className="text-xs md:text-sm">May.26th~Jun.24th</span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl md:text-3xl font-bold text-black">{product.price}</span>
                  {product.original_price && (
                    <>
                      <span className="text-base md:text-lg text-gray-500 line-through">{product.original_price}</span>
                      <Badge className="bg-red-100 text-red-600 text-xs md:text-sm">
                        {product.discount}
                      </Badge>
                    </>
                  )}
                </div>
                <div className="text-red-500 text-xs md:text-sm">
                  Free Shipping for over 1799ksh to Kilishop &gt;
                </div>
              </div>

              {/* Quantity Selector and Action Buttons */}
              <div className="mt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <Button variant="ghost" size="icon" onClick={decreaseQuantity} className="h-8 w-8 rounded-r-none">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-1 text-sm font-medium w-12 text-center">{quantity}</span>
                    <Button variant="ghost" size="icon" onClick={increaseQuantity} className="h-8 w-8 rounded-l-none">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-orange-100 text-orange-600 hover:bg-orange-200 font-semibold py-3" 
                    onClick={handleAddToCart}
                    disabled={isProductInCart(product.id)} // Optional: disable if already in cart
                  >
                    {isProductInCart(product.id) ? 'Added to Cart' : 'Add to Cart'}
                  </Button>
                  <Button 
                    size="lg" 
                    className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold py-3"
                    onClick={() => {
                      if (product) {
                        const cartProductData: CartProductType = {
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          originalPrice: product.original_price || undefined,
                        };
                        addToCart(cartProductData, quantity);
                        navigate('/cart');
                      }
                    }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Services */}
              <div className="flex items-center space-x-2">
                <span className="text-gray-600 text-sm">Services:</span>
                <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                  ✓ Standard Service
                </Badge>
              </div>

              {/* Color and Size Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-gray-600 text-sm">Color:</span>
                  <div className="flex space-x-2">
                    {product.tags?.includes('color-variant') ? (product.tags.filter(t => t.startsWith("color:")).map((colorTag, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 text-xs"
                      >
                        {colorTag.split(':')[1]}
                      </Button>
                    ))) : (
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-500 text-xs cursor-not-allowed">
                        Default
                      </Button>
                    )}

                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-gray-600 text-sm">Size:</span>
                  <div className="flex space-x-2">
                    {product.tags?.includes('size-variant') ? (product.tags.filter(t => t.startsWith("size:")).map((sizeTag, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 text-xs"
                      >
                        {sizeTag.split(':')[1]}
                      </Button>
                    ))) : (
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-500 text-xs cursor-not-allowed">
                        Standard
                      </Button>
                    )}

                  </div>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <span className="text-gray-600 text-sm">Quantity</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center border rounded">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decreaseQuantity}
                      className="px-3 py-1 h-auto"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-1 border-x min-w-[3rem] text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={increaseQuantity}
                      className="px-3 py-1 h-auto"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile optimized */}
              <div className="grid grid-cols-2 gap-3 md:flex md:space-x-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-sm md:text-base active:scale-95"
                >
                  Add to Cart
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-sm md:text-base active:scale-95"
                >
                  Buy Now
                </Button>
                <Button variant="outline" size="lg" className="p-3 md:w-auto">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="p-3 md:w-auto">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-orange-500">⚡</span>
                  <span className="text-gray-600">Ships from</span>
                  <span className="font-medium">Standard delivery terms apply</span>
                </div>
                <span className="text-blue-500 hover:underline cursor-pointer text-xs md:text-sm">
                  select an address to view delivery times
                </span>
              </div>
            </div>
          </div>

          {/* Store Selective Section */}
          <div className="mt-8">
            <StoreSelective />
          </div>

          {/* Product Details Tabs - Mobile responsive */}
          <div className="mt-8 md:mt-12">
            <div className="border-b">
              <nav className="flex space-x-4 md:space-x-8 overflow-x-auto">
                <button className="bg-red-500 text-white px-4 md:px-6 py-2 md:py-3 font-medium text-sm whitespace-nowrap">
                  Description
                </button>
                <button className="text-gray-600 px-4 md:px-6 py-2 md:py-3 hover:text-red-500 text-sm whitespace-nowrap">
                  Reviews
                </button>
                <button className="text-gray-600 px-4 md:px-6 py-2 md:py-3 hover:text-red-500 text-sm whitespace-nowrap">
                  Recommend
                </button>
              </nav>
            </div>

            <div className="py-6 md:py-8">
              <h3 className="text-lg md:text-xl font-bold mb-4">Specification</h3>
              <div className="space-y-2 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-4 md:space-y-0">
                {/* Specifications section can be re-added if 'specifications' field (e.g., JSONb) is added to Supabase products table */}
                {false && Object.entries(product.description ? {'Overview': product.description} : {}).map(([key, value]: [string, string]) => (
                  <div key={key} className="flex border-b pb-2 text-sm md:text-base">
                    <span className="w-24 md:w-32 text-gray-600 bg-gray-100 px-2 md:px-3 py-2 font-medium">{key}</span>
                    <span className="flex-1 px-2 md:px-3 py-2">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;

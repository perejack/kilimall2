import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ChevronLeft, ChevronRight, Filter, ChevronDown, X } from 'lucide-react';
import { useProducts, SupabaseProduct } from '@/contexts/ProductContext';

const CategoryPage = () => {
  const { products: allProductsFromContext, loading, error, fetchProducts } = useProducts();
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Popular');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const categoryNames: { [key: string]: string } = {
    'tvs': 'TVs',
    'appliances': 'Appliances',
    'kitchen': 'Kitchen',
    'home': 'Home',
    'phones': 'Phones',
    'refurbished-phones': 'Refurbished Phones',
    'smartwatches': 'Smartwatches',
    'personal-care': 'Personal Care',
    'beauty': 'Beauty',
    'health-care': 'Health Care',
    'wigs-tools': 'Wigs and Tools',
    'men-shoes': 'Men Shoes',
    'women-shoes': 'Women Shoes',
    'kids-shoes': 'Kids Shoes',
    'women-accessories': 'Women Accessories',
    'men-accessories': 'Men Accessories',
    'women-clothes': 'Women Clothes',
    'men-clothes': 'Men Clothes',
    'women-bags': 'Women Bags',
    'men-bags': 'Men Bags',
    'groceries': 'Groceries' // Added Groceries mapping
  };

  const categoryName = categoryNames[categorySlug || ''] || 'Category';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-700">Loading products...</p>
          {/* You could add a more sophisticated skeleton loader here */}
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button 
            onClick={() => fetchProducts()} // Allow user to retry fetching
            className="bg-red-500 hover:bg-red-600 text-white mr-2"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
          >
            Go to Homepage
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/KSh|\s|,/g, ''));
  };

  const handleApplyPriceFilter = () => {
    // The filtering is now reactive to minPrice and maxPrice state changes,
    // so this button primarily serves as a user action confirmation point.
    // We could add further logic here if needed, e.g., closing the filter drawer.
    console.log('Price filter applied with:', { minPrice, maxPrice });
    if (isFilterDrawerOpen) {
      setIsFilterDrawerOpen(false); // Optionally close drawer on apply
    }
  };
  
  let tempFilteredProducts = (allProductsFromContext || []).filter((product: SupabaseProduct) => 
    product.category === categoryName // Use the mapped display name for comparison
  );

  if (minPrice || maxPrice) {
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    tempFilteredProducts = tempFilteredProducts.filter(product => {
      const productPrice = parsePrice(product.price);
      return productPrice >= min && productPrice <= max;
    });
  }

  let sortedProducts = [...tempFilteredProducts]; // Create a new array for sorting

  if (sortBy === 'Price Low to High') {
    sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
  } else if (sortBy === 'Price High to Low') {
    sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
  } else if (sortBy === 'Newest') {
    // Assuming products have an 'id' that can represent recency (higher id = newer)
    // Or, if there's a specific date field, use that.
    // For now, let's sort by ID descending as a proxy for 'Newest'.
    // If 'id' is not guaranteed to be numeric or sequential for newness, this might need adjustment.
    sortedProducts.sort((a: SupabaseProduct, b: SupabaseProduct) => b.id - a.id); 
  }
  // 'Popular' is the default, so no explicit sort needed if it's the initial state or if products are already in a desired default order.

  const productsPerPage = 12;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProductsToDisplay = sortedProducts.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };



  const hasProducts = currentProductsToDisplay.length > 0;

  const renderStars = (rating: number | null | undefined) => {
    const numRating = rating || 0;
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3.5 h-3.5 ${i < numRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const getFilterContent = () => {
        // Common Price Filter Section
    const PriceFilter = () => (
      <div>
        <h4 className="font-medium mb-3 text-gray-800">Price</h4>
        <div className="flex items-center space-x-2 mb-3">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
          <span className="text-gray-400">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        <Button 
          size="sm" 
          className="w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition-colors duration-150"
          onClick={handleApplyPriceFilter}
        >
          Apply
        </Button>
      </div>
    );

    if (categorySlug === 'appliances') {
      return (
        <div className="space-y-6">
          <PriceFilter />

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Suggestions</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Solar Power</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Gas Cooker</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Washing Machine</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Oven Appliances</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Category</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Digital TVS</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Smart TVS</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Analog-To-Digital (Dtv) Converters</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">AV Receivers & Amplifiers</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Shipped From</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Fulfilled By Kilimall</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Oversea Shipment</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Local Dispatch</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Brand</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Generic</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Nunix</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">VITRON</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">AILYONS</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">AC/DC Function</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">ac</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">both</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">dc</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Bag Or Bagless</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">bagless</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">bag</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Batteries Included</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">no</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">yes</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Batteries Required</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">yes</div>
            </div>
          </div>
        </div>
      );
    }

    if (categorySlug === 'kitchen') {
      return (
        <div className="space-y-6">
          <PriceFilter />

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Suggestions</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Gas Cooker</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Water Dispenser</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Blenders</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Kettle</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Category</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Bakers & Casseroles</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Bakeware Sets</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Baking & Cookie Sheets</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Baking & Pastry Utensils</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Shipped From</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Fulfilled By Kilimall</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Oversea Shipment</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Local Dispatch</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Brand</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Generic</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Kitchen37</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Signature</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">Redberry</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Assembly Required</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">no</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">yes</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Cleaning Method</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">hand-washing</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">dry-cleaning</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">machine-washing</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Color</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">black</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">white</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">silver</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">clear</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Dishwasher Safe</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">yes</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">no</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Features</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">easy to clean</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">corrosion resistance</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">wear resistance</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">dishwasher safe</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Functions</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">seasoning</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">measuring</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">cutting</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">mixing</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Handle Material</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">stainless steel</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">plastic</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">bakelite</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">silicone</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Material</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">stainless steel</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">ceramics</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">plastic</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">glass</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Microwave Safe</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">yes</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">no</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Pattern</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">solid</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">floral</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">checkered</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">striped</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Shape</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">rectangular</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">round</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">square</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">oblong</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Surface Coating</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">non-stick</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">stainless steel</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">ceramic</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">copper</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3 text-gray-800">Type</h4>
            <div className="space-y-2 text-sm">
              <div className="hover:text-red-500 cursor-pointer text-gray-600">cookware sets</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">vacuum flask</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">plates</div>
              <div className="hover:text-red-500 cursor-pointer text-gray-600">food storage</div>
            </div>
            <button className="text-red-500 text-sm mt-2 flex items-center">
              View More <ChevronDown className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      );
    }

    // Default filter content for other categories
    return (
      <div className="space-y-6">
        <PriceFilter />

        <div>
          <h4 className="font-medium mb-3 text-gray-800">Suggestions</h4>
          <div className="space-y-2 text-sm">
            <div className="hover:text-red-500 cursor-pointer text-gray-600">50 inch</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">55 inch</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">43 inch</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">32 inch</div>
          </div>
          <button className="text-red-500 text-sm mt-2 flex items-center">
            View More <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-gray-800">Category</h4>
          <div className="space-y-2 text-sm">
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Digital TVS</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Smart TVS</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Analog-To-Digital (Dtv) Converters</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">AV Receivers & Amplifiers</div>
          </div>
          <button className="text-red-500 text-sm mt-2 flex items-center">
            View More <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-gray-800">Shipped From</h4>
          <div className="space-y-2 text-sm">
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Fulfilled By Kilimall</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Oversea Shipment</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Local Dispatch</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3 text-gray-800">Brand</h4>
          <div className="space-y-2 text-sm">
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Generic</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">VITRON</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Hisense</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">TCL</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">Samsung</div>
            <div className="hover:text-red-500 cursor-pointer text-gray-600">LG</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Mobile Filter Button */}
      <Button 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-xl flex items-center justify-center"
        onClick={() => setIsFilterDrawerOpen(true)}
        aria-label="Open filters"
      >
        <Filter className="w-5 h-5" />
      </Button>

      {/* Filter Drawer for Mobile */}
      {isFilterDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
            onClick={() => setIsFilterDrawerOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Drawer Panel */}
          <div className="fixed top-0 left-0 h-full w-4/5 max-w-xs bg-white shadow-2xl p-5 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0">
            <div className="flex justify-between items-center mb-6 pb-3 border-b">
              <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-red-500" /> Filters
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterDrawerOpen(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-6">
              {getFilterContent()}
            </div>
          </div>
        </div>
      )}

      
      <main>
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <span 
                className="hover:text-orange-600 cursor-pointer"
                onClick={() => navigate('/')}
              >
                Home
              </span>
              <span>{'>'}</span>
              <span className="text-gray-900">{categoryName}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-8">
            <div className="hidden lg:block w-64 space-y-6 sticky top-6">
              <div className="bg-white rounded-lg p-5 shadow-md">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-semibold text-gray-800">Filter Products</h3>
                </div>
                
                {getFilterContent()}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between sm:justify-start gap-y-3 xs:gap-x-4 w-full sm:w-auto">
                  <span className="text-gray-600 order-1 xs:order-2 text-center xs:text-left">
                    {hasProducts 
                      ? `${sortedProducts.length} results for ${categoryName.toLowerCase()}`
                      : `No results found for ${categoryName.toLowerCase()}`
                    }
                  </span>
                  {hasProducts && (
                    <div className="flex items-center space-x-2 order-2 xs:order-1">
                      <Button variant="ghost" size="sm" onClick={handlePrevPage} disabled={currentPage === 1} className="disabled:opacity-50 disabled:cursor-not-allowed p-2">
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button variant="ghost" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0} className="disabled:opacity-50 disabled:cursor-not-allowed p-2">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {hasProducts && (
                  <div className="flex items-center space-x-2 self-center sm:self-auto">
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 shadow-sm"
                    >
                      <option>Popular</option>
                      <option>Price Low to High</option>
                      <option>Price High to Low</option>
                      <option>Newest</option>
                    </select>
                  </div>
                )}
              </div>

              {hasProducts ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {currentProductsToDisplay.map((product) => (
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
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.tags && product.tags.length > 0 && product.tags[0] && (
                            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                              {product.tags[0]}
                            </Badge>
                          )}
                          {product.discount && (
                            <Badge className="absolute top-2 right-2 bg-orange-500 text-white text-xs">
                              {product.discount}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="p-3 space-y-2">
                          <h3 className="text-sm font-medium text-gray-800 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center space-x-1">
                            {renderStars(product.rating)}
                            <span className="text-xs text-gray-500">({product.reviews_count || 0})</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-lg font-bold text-red-600">{product.price}</p>
                              {product.original_price && (
                                <p className="text-sm text-gray-500 line-through">{product.original_price}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-600 mb-6">
                      We couldn't find any products in the {categoryName} category at the moment.
                    </p>
                    <Button 
                      onClick={() => navigate('/')}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      Browse All Categories
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const categories = [
  // Adding imageUrl property for categories with specific images
  { name: 'TVs', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001632.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-blue-100 text-blue-600', slug: 'tvs' },
  { name: 'Appliances', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001633.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-green-100 text-green-600', slug: 'appliances' },
  { name: 'Kitchen', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001631.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-yellow-100 text-yellow-600', slug: 'kitchen' },
  { name: 'Home', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001628.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-purple-100 text-purple-600', slug: 'home' },
  { name: 'Phones', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001628.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-indigo-100 text-indigo-600', slug: 'phones' },
  { name: 'Refurbished Phones', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001637.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-orange-100 text-orange-600', slug: 'refurbished-phones' },
  { name: 'Phone Accessories', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100001636.png?x-image-process=image/format,webp/resize,w_240#', color: 'bg-blue-100 text-blue-600', slug: 'phone-accessories' },
  { name: 'Smartwatches', icon: '⌚', color: 'bg-red-100 text-red-600', slug: 'smartwatches' },
  { name: 'Personal Care', icon: '🧴', color: 'bg-pink-100 text-pink-600', slug: 'personal-care' },
  { name: 'Beauty', icon: '💄', color: 'bg-rose-100 text-rose-600', slug: 'beauty' },
  { name: 'Health Care', icon: '🏥', color: 'bg-teal-100 text-teal-600', slug: 'health-care' },
  { name: 'Wigs and Tools', icon: '💇', color: 'bg-amber-100 text-amber-600', slug: 'wigs-tools' },
  { name: 'Men Shoes', icon: '👞', color: 'bg-gray-100 text-gray-600', slug: 'men-shoes' },
  { name: 'Women Shoes', icon: '👠', color: 'bg-cyan-100 text-cyan-600', slug: 'women-shoes' },
  { name: 'Kids Shoes', icon: '👟', color: 'bg-lime-100 text-lime-600', slug: 'kids-shoes' },
  { name: 'Women Accessories', icon: '👜', color: 'bg-emerald-100 text-emerald-600', slug: 'women-accessories' },
  { name: 'Men Accessories', icon: '⌚', color: 'bg-slate-100 text-slate-600', slug: 'men-accessories' },
  { name: 'Women Clothes', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100000676.jpg?x-image-process=image/format,webp/resize,w_240#', color: 'bg-fuchsia-100 text-fuchsia-600', slug: 'women-clothes' },
  { name: 'Men Clothes', imageUrl: 'https://img.kilimall.com/c/common/category-icon/100000490.png?x-image-process=image/format,webp/resize,w_240#', color: 'bg-sky-100 text-sky-600', slug: 'men-clothes' },
  { name: 'Women Bags', icon: '👜', color: 'bg-violet-100 text-violet-600', slug: 'women-bags' },
  { name: 'Men Bags', icon: '🎒', color: 'bg-stone-100 text-stone-600', slug: 'men-bags' },
  { name: 'Groceries', icon: '🛒', color: 'bg-yellow-100 text-yellow-700', slug: 'groceries' },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
  };

  return (
    <div className="py-6 md:py-8">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Hot Category</h2>
      </div>
      
      {/* Mobile: 2 columns, Tablet: 4 columns, Desktop: 5+ columns */}
      <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc(50%-0.375rem)] overflow-x-auto 
                         gap-3 
                         sm:grid-flow-row sm:grid-rows-none sm:auto-cols-auto 
                         sm:grid-cols-3 
                         md:grid-cols-4 
                         lg:grid-cols-5 
                         xl:grid-cols-10 
                         md:gap-4">
        {categories.map((category, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer group hover:scale-105 border-0 bg-white active:scale-95"
            onClick={() => handleCategoryClick(category.slug)}
          >
            <CardContent className="p-3 md:p-4 text-center">
              <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 rounded-full flex items-center justify-center text-lg md:text-2xl ${(category as any).imageUrl ? '' : category.color} group-hover:scale-110 transition-transform duration-200 overflow-hidden`}>
                {(category as any).imageUrl ? (
                  <img src={(category as any).imageUrl} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  (category as any).icon
                )}
              </div>
              <p className="text-xs font-medium text-gray-700 leading-tight">{category.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;

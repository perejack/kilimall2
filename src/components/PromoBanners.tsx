import React from 'react';
import { Link } from 'react-router-dom';

const promoData = [
  {
    src: 'https://img.kilimall.com/c/public/banner-image/100009423.jpg?x-image-process=image/format,webp#',
    alt: 'Men Quartz Watch Promo',
    productId: 301, // Placeholder ID - Men Quartz Watch (KSh 679) - VERIFY/UPDATE
  },
  {
    src: 'https://img.kilimall.com/c/public/banner-image/100009424.jpg?x-image-process=image/format,webp#',
    alt: 'Pajama Set Promo',
    productId: 103, // Placeholder ID - 4PCS Lace Stitching Satin Pajama Set (KSh 899) - VERIFY/UPDATE
  },
  {
    src: 'https://img.kilimall.com/c/public/banner-image/100009425.jpg?x-image-process=image/format,webp#',
    alt: 'Samsung Galaxy A16 Promo',
    productId: 2019, // Samsung Galaxy A16 128GB+4GB (KSh 15,829)
  },
  {
    src: 'https://img.kilimall.com/c/public/banner-image/100009436.jpg?x-image-process=image/format,webp#',
    alt: 'Gas Cooker Promo',
    productId: 101, // Placeholder ID - EUROCHEF 3+1 Standing Gas Cooker (KSh 20,999) - VERIFY/UPDATE
  },
];

// The old promoImages array has been replaced by promoData.

const PromoBanners = () => {
  return (
    <div className="py-4 md:py-6 bg-gray-100">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {promoData.map((banner, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
              <Link to={`/product/${banner.productId}`} className="block">
                <img 
                  src={banner.src} 
                  alt={banner.alt} 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromoBanners;

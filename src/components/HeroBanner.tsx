import React from 'react';
import { Button } from '@/components/ui/button';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';

const HeroBanner = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
    Fade(),
  ]);

  const images = [
    "https://img.kilimall.com/c/public/banner-image/100009434.jpg?x-image-process=image/format,webp#",
    "https://img.kilimall.com/c/public/banner-image/100009452.jpg?x-image-process=image/format,webp#",
    "https://image.kilimall.com/c/h5/cms/imgs/5YiG5Lya5Zy65ZWG5ZOB54mIMTIwMC00MjQuZ2lmMTc0ODkyMDYxNzA0NA%3D%3D.gif",
    "https://image.kilimall.com/c/h5/cms/imgs/5YiG5Lya5Zy65ZWG5ZOB54mIMTIwMC00MjQoMSkuZ2lmMTc0ODkxODA1NjMxOA%3D%3D.gif",
    "https://image.kilimall.com/c/h5/cms/imgs/bWlhbi0xMjAwLTQyNC5qcGcxNzQ5MDA4MDc4NDc0.jpg"
  ];

  return (
    <div className="relative overflow-hidden bg-slate-900 min-h-[400px] sm:min-h-[450px] md:min-h-[550px] lg:min-h-[650px] flex items-center justify-center">
      {/* Background Carousel */}
      <div className="absolute inset-0 w-full h-full z-0" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative h-full" key={index}>
              <img
                src={src}
                alt={`Banner image ${index + 1}`}
                className="w-full h-full object-cover object-center" loading="lazy"
              />
              {/* Darker overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/50"></div> 
            </div>
          ))}
        </div>
      </div>

      {/* Foreground Text Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <div className="text-white space-y-5 md:space-y-7">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-white/25 backdrop-blur-md rounded-full px-4 py-1.5 text-sm sm:text-base font-semibold shadow-md">
              11th Anniversary
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-xl">
            Best Sellers Sale
          </h1>
          <div className="bg-yellow-400 text-gray-900 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg inline-block font-bold text-base sm:text-lg md:text-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            🎉 Free Shipping to All KiliShops
          </div>

          <div className="space-y-3 pt-2">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium drop-shadow-lg">
              ⭐ Order ≥ KSh 1,799
            </p>
            <p className="text-base sm:text-md md:text-lg lg:text-xl opacity-90 drop-shadow-md max-w-2xl mx-auto">
              Enjoy massive discounts on top products! Unbeatable deals await.
            </p>
          </div>
          
          <div className="pt-5">
            <Button 
              variant="secondary" 
              size="lg" 
              className="text-base sm:text-lg px-6 py-3 sm:px-8 sm:py-3.5 rounded-lg font-semibold shadow-xl hover:bg-white/90 focus:ring-4 focus:ring-white/50 transition-all duration-200 transform hover:scale-105"
            >
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

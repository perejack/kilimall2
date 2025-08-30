import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import ProductGrid from "@/components/ProductGrid";
import FlashSale from '@/components/FlashSale';
import PromoBanners from '@/components/PromoBanners';
import WhatsNew from "@/components/WhatsNew";
import RecommendedProducts from "@/components/RecommendedProducts";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroBanner />
        <PromoBanners />
        <FlashSale />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
          <CategoryGrid />
          <ProductGrid />
          {/* FlashSale was moved up */}
          <WhatsNew />
          <RecommendedProducts />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

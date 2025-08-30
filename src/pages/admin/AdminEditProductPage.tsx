import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts, SupabaseProduct } from '../../contexts/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const availableCategories = ["Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Books", "Toys & Games", "Health & Beauty", "Automotive", "Groceries"];

const AdminEditProductPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, loading: productsLoading, error: productsError, updateProduct } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<SupabaseProduct | null>(null);
  const [formData, setFormData] = useState<Partial<SupabaseProduct>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      toast({ title: 'Error', description: 'Product ID is missing.', variant: 'destructive' });
      navigate('/admin/products');
      return;
    }

    if (!productsLoading && products.length > 0) {
      const foundProduct = products.find(p => p.id.toString() === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setFormData({
          name: foundProduct.name,
          price: foundProduct.price,
          description: foundProduct.description || '',
          category: foundProduct.category,
          image: foundProduct.image,
          // Add other fields as necessary
        });
      } else {
        toast({ title: 'Error', description: 'Product not found.', variant: 'destructive' });
        navigate('/admin/products');
      }
      setIsLoading(false);
    }
  }, [productId, products, productsLoading, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !productId) return;

    // Ensure productId is a number if it comes from useParams as string
    const numericProductId = parseInt(productId, 10);
    if (isNaN(numericProductId)) {
      toast({ title: 'Error', description: 'Invalid Product ID.', variant: 'destructive' });
      return;
    }

    // Basic validation: Ensure required fields are not empty
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast({ title: 'Validation Error', description: 'Name, Price, Category, and Image URL are required.', variant: 'destructive' });
      return;
    }

    try {
      setIsLoading(true); // Indicate loading state during submission
      await updateProduct(numericProductId, formData);
      toast({
        title: 'Product Updated',
        description: `Product "${formData.name || product.name}" has been successfully updated.`,
      });
      navigate('/admin/products'); // Navigate back to the product list
    } catch (err: any) {
      toast({
        title: 'Error Updating Product',
        description: err.message || 'Could not update product. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to update product:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || productsLoading) {
    return <div className="p-4 text-center">Loading product details...</div>;
  }

  if (productsError) {
    return <div className="p-4 text-center text-red-500">Error loading products: {productsError}</div>;
  }

  if (!product) {
    // This case should ideally be handled by the useEffect redirect
    return <div className="p-4 text-center">Product not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product: {product.name}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (e.g., KSh 123)</label>
          <Input type="text" name="price" id="price" value={formData.price || ''} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Select
            name="category"
            value={formData.category || ''}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {availableCategories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <Input type="text" name="image" id="image" value={formData.image || ''} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <Textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} className="w-full" rows={4} />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading || productsLoading}>{isLoading || productsLoading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProductPage;

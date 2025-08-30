import React, { useState, useEffect } from 'react'; // Added useEffect
import { useNavigate } from 'react-router-dom';
import { useProducts, SupabaseProduct } from '../../contexts/ProductContext'; // We'll add addProduct to useProducts later
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // Added
import { Label } from '@/components/ui/label'; // Added
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../../lib/supabaseClient'; // Corrected import name // Added

// Define a type for the new product data, excluding fields like id, created_at, updated_at
// which are typically handled by the backend or database.
// Price is string to match SupabaseProduct, but could be number before sending if conversion is handled.
export type NewProductData = Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at' | 'rating' | 'reviews_count'> & {
  // Explicitly define types for form fields if they differ from SupabaseProduct or need to be initially empty
  name: string;
  price: string; // Keep as string to match SupabaseProduct, ensure validation/conversion if needed
  category: string;
  image: string;
  description?: string;
  original_price?: string;
  discount?: string;
  images?: string[];
  sub_category?: string;
  brand?: string;
  stock_status?: string;
  tags?: string[];
  sku?: string;
};

const availableCategories = ["Electronics", "Fashion", "Home & Garden", "Sports & Outdoors", "Books", "Toys & Games", "Health & Beauty", "Automotive", "Groceries"];

const AdminAddProductPage = () => {
  const { addProduct } = useProducts(); // This will be added to ProductContext
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<NewProductData>>({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
    original_price: '',
    discount: '',
    // Initialize other fields as necessary
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url'); // Added
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Added
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>(''); // Added

  // Clean up object URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'image' && imageInputMode === 'url') {
      setImagePreviewUrl(value);
      setSelectedFile(null); // Clear selected file if URL is being typed
    }
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageModeChange = (mode: 'url' | 'upload') => {
    setImageInputMode(mode);
    setImagePreviewUrl(''); // Reset preview on mode change
    if (mode === 'url') {
      setSelectedFile(null);
      // Optionally, restore preview from formData.image if it exists
      if (formData.image) setImagePreviewUrl(formData.image);
    } else {
      setFormData(prev => ({ ...prev, image: '' })); // Clear image URL if switching to upload
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreviewUrl(preview);
      setFormData(prev => ({ ...prev, image: '' })); // Clear image URL field
    } else {
      setSelectedFile(null);
      setImagePreviewUrl('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImageUrl = formData.image || '';

    // Validation
    if (!formData.name || !formData.price || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Name, Price, and Category are required.',
        variant: 'destructive',
      });
      return;
    }

    if (imageInputMode === 'url' && !finalImageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Image URL is required when in URL mode.',
        variant: 'destructive',
      });
      return;
    }

    if (imageInputMode === 'upload' && !selectedFile) {
      toast({
        title: 'Validation Error',
        description: 'An image file must be selected when in Upload mode.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (imageInputMode === 'upload' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; // Path within the bucket (filename only in this case)

        const { error: uploadError } = await supabase.storage
          .from('product-images') // Ensure this is your bucket name
          .upload(filePath, selectedFile);

        if (uploadError) {
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        if (!publicUrlData || !publicUrlData.publicUrl) {
            throw new Error('Could not get public URL for uploaded image.');
        }
        finalImageUrl = publicUrlData.publicUrl;
      }

      const productDataToSubmit: NewProductData = {
        ...formData,
        name: formData.name!,
        price: formData.price!,
        category: formData.category!,
        image: finalImageUrl, // Use the determined finalImageUrl
      } as NewProductData; // Type assertion after ensuring required fields

      await addProduct(productDataToSubmit);
      toast({
        title: 'Product Added',
        description: `Product "${formData.name}" has been successfully added.`,
      });
      navigate('/admin/products');
    } catch (err: any) {
      toast({
        title: 'Error Adding Product',
        description: err.message || 'Could not add product. Please try again.',
        variant: 'destructive',
      });
      console.error('Failed to add product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6"> {/* Increased space-y */}
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</Label>
          <Input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <Label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (e.g., KSh 123)</Label>
          <Input type="text" name="price" id="price" value={formData.price || ''} onChange={handleChange} className="w-full" required />
        </div>
        <div>
          <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</Label>
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
                {/* Image Input Section */}
        <div className="space-y-2">
            <Label className="block text-sm font-medium text-gray-700">Product Image</Label>
            <RadioGroup
                value={imageInputMode}
                onValueChange={(value: 'url' | 'upload') => handleImageModeChange(value)}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="urlMode" />
                    <Label htmlFor="urlMode">Image URL</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="uploadMode" />
                    <Label htmlFor="uploadMode">Upload File</Label>
                </div>
            </RadioGroup>

            {imageInputMode === 'url' && (
                <div>
                    <Label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Image URL</Label>
                    <Input 
                        type="text" 
                        name="image" 
                        id="image" 
                        placeholder="https://example.com/image.jpg"
                        value={formData.image || ''} 
                        onChange={handleChange} 
                        className="w-full" 
                    />
                </div>
            )}

            {imageInputMode === 'upload' && (
                <div>
                    <Label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Upload Image File</Label>
                    <Input 
                        type="file" 
                        name="imageFile" 
                        id="imageFile" 
                        accept=".png,.jpg,.jpeg"
                        onChange={handleFileChange} 
                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                </div>
            )}

            {imagePreviewUrl && (
                <div className="mt-2">
                    <img src={imagePreviewUrl} alt="Image Preview" className="max-h-48 rounded-md border border-gray-200" />
                </div>
            )}
        </div>
        <div>
          <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</Label>
          <Textarea name="description" id="description" value={formData.description || ''} onChange={handleChange} className="w-full" rows={4} />
        </div>
        <div>
          <Label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Original Price (Optional, e.g., KSh 150)</Label>
          <Input type="text" name="original_price" id="original_price" value={formData.original_price || ''} onChange={handleChange} className="w-full" />
        </div>
        <div>
          <Label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">Discount (Optional, e.g., 10% OFF)</Label>
          <Input type="text" name="discount" id="discount" value={formData.discount || ''} onChange={handleChange} className="w-full" />
        </div>
        {/* Add more fields as needed, e.g., brand, stock_status, tags, sku, images, sub_category */}
        
        <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/products')} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddProductPage;

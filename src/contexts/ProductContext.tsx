import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient'; // Your Supabase client

// Define the product type based on your Supabase table
export interface SupabaseProduct {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  original_price?: string | null;
  discount?: string | null;
  image: string;
  images?: string[] | null;
  category: string;
  sub_category?: string | null;
  brand?: string | null;
  rating?: number | null;
  reviews_count?: number | null;
  stock_status?: string | null;
  tags?: string[] | null;
  sku?: string | null;
  created_at: string;
  updated_at: string;
}

interface ProductContextType {
  products: SupabaseProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>; // Function to explicitly refetch products
  deleteProduct: (productId: number) => Promise<void>; // Function to delete a product
  updateProduct: (productId: number, productData: Partial<SupabaseProduct>) => Promise<void>; // Function to update a product
  addProduct: (productData: Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>) => Promise<void>; // Function to add a new product
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*') // Select all columns
        .order('id', { ascending: false }); // Show newest products (highest ID) first

      if (supabaseError) {
        throw supabaseError;
      }
      setProducts(data || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]); // Clear products on error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (productId: number): Promise<void> => {
    try {
      const { error: supabaseError } = await supabase
        .from('products')
        .delete()
        .match({ id: productId });

      if (supabaseError) {
        throw supabaseError;
      }

      // Refetch products to update the list after deletion
      await fetchProducts(); 
      // Optionally, you could also update the local state directly for a faster UI update:
      // setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      // However, refetching ensures consistency with the backend.

    } catch (err: any) {
      console.error('Error deleting product:', err);
      // Re-throw the error so the calling component can handle it (e.g., show a toast)
      throw new Error(err.message || 'Failed to delete product');
    }
  };

  const updateProduct = async (productId: number, productData: Partial<SupabaseProduct>): Promise<void> => {
    try {
      // Construct the update object, excluding the id and created_at if they are present
      const { id, created_at, ...updateData } = productData;
      
      const { error: supabaseError } = await supabase
        .from('products')
        .update(updateData) // Pass only the fields to be updated
        .match({ id: productId });

      if (supabaseError) {
        console.error('Supabase error during product update:', supabaseError);
        throw supabaseError;
      }

      // Refetch products to update the list after update
      await fetchProducts();

    } catch (err: any) {
      console.error('Error updating product:', err);
      throw new Error(err.message || 'Failed to update product');
    }
  };

  const addProduct = async (productData: Omit<SupabaseProduct, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .insert([productData]);

      if (supabaseError) {
        throw supabaseError;
      }

      // Refetch products to update the list after addition
      await fetchProducts();

    } catch (err: any) {
      console.error('Error adding product:', err);
      throw new Error(err.message || 'Failed to add product');
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, fetchProducts, deleteProduct, updateProduct, addProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

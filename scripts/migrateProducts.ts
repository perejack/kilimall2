// scripts/migrateProducts.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { allProducts } from '../src/data/allProducts'; // Adjust path if your allProducts.ts is elsewhere
import type { Product as LocalProductType } from '../src/types'; // Assuming ProductType is your local type

// --- SUPABASE CONFIGURATION ---
const supabaseUrl = 'https://ocnhtxruadvsmywxymqk.supabase.co';
// WARNING: Service Role Key - DO NOT EXPOSE PUBLICLY OR COMMIT
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jbmh0eHJ1YWR2c215d3h5bXFrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTA1NzYwMSwiZXhwIjoyMDY0NjMzNjAxfQ.d32yZWnaHSjxG5xyyd16RDBPlLW9THiaLpqOPjpEilo';

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key are required.');
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);

// Define the structure of the data to be inserted into Supabase
// This should match your Supabase 'products' table columns
interface SupabaseProduct {
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
  // created_at and updated_at will be handled by Supabase defaults/triggers
}

async function migrateData() {
  console.log('Starting product data migration to Supabase...');

  if (!allProducts || allProducts.length === 0) {
    console.log('No products found in allProducts.ts. Exiting.');
    return;
  }

  const productsToInsert: SupabaseProduct[] = allProducts.map((p: LocalProductType) => ({
    id: p.id,
    name: p.name,
    description: p.description || null,
    price: p.price, // Assuming price is already a string like "KSh 1,299"
    original_price: p.originalPrice || null,
    discount: p.discount || null,
    image: p.image, // Main image
    images: p.images && p.images.length > 0 ? p.images : [], // Ensure it's an array, or null if your table allows
    category: p.category,
    sub_category: p.subCategory || null,
    brand: p.brand || null,
    rating: p.rating !== undefined ? p.rating : 0,
    reviews_count: p.reviewsCount !== undefined ? p.reviewsCount : 0,
    stock_status: p.stockStatus || 'In Stock',
    tags: p.tags && p.tags.length > 0 ? p.tags : [],
    sku: p.sku || null,
  }));

  console.log(`Attempting to insert ${productsToInsert.length} products.`);

  // Supabase client can insert an array of objects directly.
  // It's good practice to insert in chunks if you have thousands of records,
  // but for a typical product catalog size from a local file, direct insert is usually fine.
  const { data, error } = await supabase
    .from('products')
    .insert(productsToInsert)
    .select(); // .select() can return the inserted data for confirmation

  if (error) {
    console.error('Error migrating data to Supabase:');
    console.error('Message:', error.message);
    if (error.details) console.error('Details:', error.details);
    if (error.hint) console.error('Hint:', error.hint);
    // @ts-ignore
    if (error.code) console.error('Code:', error.code);
    return;
  }

  console.log('Product data migrated successfully to Supabase!');
  if (data) {
    console.log(`Inserted ${data.length} products.`);
  }
}

migrateData()
  .then(() => console.log('Migration script finished.'))
  .catch(err => {
    console.error('Unhandled error in migration script:', err);
    process.exit(1);
  });

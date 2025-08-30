import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, SupabaseProduct } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext'; // Added
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AdminProductsPage = () => {
  const { user, signOut } = useAuth(); // Added
  const { products, loading, error, deleteProduct } = useProducts();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEditClick = (productId: number, productName: string) => {
    console.log(`Navigating to edit page for product ID: ${productId}, Name: ${productName}`);
    navigate(`/admin/products/edit/${productId}`);
  };

  const handleDeleteClick = async (productId: number, productName: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`);
    if (confirmed) {
      try {
        await deleteProduct(productId);
        toast({
          title: "Product Deleted",
          description: `"${productName}" has been successfully deleted.`,
        });
      } catch (err: any) {
        toast({
          title: "Error Deleting Product",
          description: err.message || "Could not delete product. Please try again.",
          variant: "destructive",
        });
        console.error("Failed to delete product:", err);
      }
    } else {
      console.log(`Deletion of product "${productName}" (ID: ${productId}) was cancelled.`);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading products: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          {user && <p className="text-sm text-gray-600">Logged in as: {user.email}</p>}
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={async () => {
              await signOut();
              navigate('/admin/login'); // Redirect to login after sign out
            }}
            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Logout
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => navigate('/admin/products/add')}>
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Product
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          <p className="text-xl">No products found.</p>
          <p>Click "Add New Product" to get started.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
                {/* <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</TableHead> */}
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200">
              {products.map((product: SupabaseProduct) => (
                <TableRow key={product.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.name}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.price}</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category}</TableCell>
                  {/* <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.stock_quantity || 'N/A'}</TableCell> */}
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700" onClick={() => handleEditClick(product.id, product.name)}>
                      <Edit className="mr-1 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteClick(product.id, product.name)}>
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
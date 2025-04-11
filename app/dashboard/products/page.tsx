"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  X, 
  Trash, 
  Search, 
  User, 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createClient } from "@supabase/supabase-js";
import { formatKesPrice } from "@/lib/utils";
import { saveProductToSupabase, ensureProductsTableStructure } from "@/lib/supabase-schema";
import { handleApiResponse, showApiError, validateProductData } from '@/lib/api-utils';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Product interface
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  is_popular: boolean;
  is_new: boolean;
  discount?: number;
  original_price?: number;
  created_at?: string;
}

// Empty product template
const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  category: '',
  stock: 0,
  is_popular: false,
  is_new: true,
  discount: 0,
  original_price: 0
};

export default function ProductsPage() {
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // State for product form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Omit<Product, 'id'> | Product>(emptyProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Categories
  const categories = [
    "Smartphones",
    "Laptops",
    "Tablets",
    "Headphones",
    "Speakers",
    "Cameras",
    "Wearables",
    "Accessories",
    "Gaming",
    "Other"
  ];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Filter products when search term or category filter changes
  useEffect(() => {
    filterProducts();
  }, [searchTerm, categoryFilter, products]);
  
  // Calculate pagination when filtered products change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredProducts]);
  
  // Mock product data for demo purposes
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Icono Gaming PC",
      description: "A high-end gaming PC with RGB lighting",
      price: 25000,
      image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_w1e3onfrSRkt",
      category: "Gaming",
      stock: 30,
      is_popular: true,
      is_new: true,
      discount: 10,
      original_price: 29000,
      created_at: "2023-01-15T12:00:00Z"
    },
    {
      id: 2,
      name: "Wireless Earbuds Pro",
      description: "Premium wireless earbuds with noise cancellation",
      price: 3500,
      image_url: "https://example.com/earbuds.jpg",
      category: "Audio",
      stock: 120,
      is_popular: true,
      is_new: false,
      discount: 5,
      original_price: 3800,
      created_at: "2023-02-10T09:30:00Z"
    },
    {
      id: 3,
      name: "Ultra HD Smart TV",
      description: "65-inch 4K Smart TV with HDR",
      price: 45000,
      image_url: "https://example.com/tv.jpg",
      category: "Television",
      stock: 15,
      is_popular: true,
      is_new: true,
      discount: 15,
      original_price: 52000,
      created_at: "2023-03-05T14:15:00Z"
    }
  ];

  // Fetch all products from the database or use mock data
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Use the correct API endpoint that exists in the project
      const response = await fetch('/api/products');
      
      // Add error handling for non-OK responses before processing
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await handleApiResponse(response);
      const validatedProducts = validateProductData(data);
      
      setProducts(validatedProducts as Product[]);
    } catch (error) {
      showApiError(error);
      // Fallback to mock data
      setProducts(mockProducts);
      console.log("Using mock data due to API error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Filter products based on search term and category
  const filterProducts = () => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => 
        product.category === categoryFilter
      );
    }
    
    setFilteredProducts(filtered);
  };
  
  // Get current page items
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Open product form for adding a new product
  const handleAddProduct = () => {
    setCurrentProduct(emptyProduct);
    setIsEditing(false);
    setFormErrors({});
    setIsFormOpen(true);
  };
  
  // Open product form for editing an existing product
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setFormErrors({});
    setIsFormOpen(true);
  };
  
  // Open delete confirmation dialog
  const handleDeleteClick = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle product form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Create a copy of the current product to work with
    const updatedProduct = { ...currentProduct };
    
    // Handle numeric inputs
    if (['price', 'stock', 'discount', 'original_price'].includes(name)) {
      updatedProduct[name] = value === '' ? 0 : parseFloat(value);
      
      // Auto-calculate discount when price or original_price changes
      if (name === 'price' || name === 'original_price') {
        const price = name === 'price' ? parseFloat(value) || 0 : updatedProduct.price || 0;
        const originalPrice = name === 'original_price' ? parseFloat(value) || 0 : updatedProduct.original_price || 0;
        
        // Only calculate if both values are valid and original price is higher
        if (originalPrice > 0 && price > 0 && originalPrice > price) {
          const calculatedDiscount = Math.round(((originalPrice - price) / originalPrice) * 100);
          updatedProduct.discount = calculatedDiscount;
          console.log(`Auto-calculated discount: ${calculatedDiscount}% based on original price ${originalPrice} and current price ${price}`);
          toast.info(`Discount automatically calculated: ${calculatedDiscount}%`);
        } else if (originalPrice > 0 && price > 0 && originalPrice <= price) {
          // If original price is less than or equal to current price, reset discount
          updatedProduct.discount = 0;
          console.log('Reset discount to 0 as original price is not higher than current price');
        }
      }
      
      // Auto-calculate price when discount changes
      if (name === 'discount') {
        const discount = parseFloat(value) || 0;
        const originalPrice = updatedProduct.original_price || 0;
        
        if (originalPrice > 0 && discount > 0 && discount <= 100) {
          const calculatedPrice = Math.round(originalPrice * (1 - discount / 100));
          updatedProduct.price = calculatedPrice;
          console.log(`Auto-calculated price: ${calculatedPrice} based on original price ${originalPrice} and discount ${discount}%`);
          toast.info(`Price automatically calculated: ${calculatedPrice}`);
        }
      }
    } else {
      updatedProduct[name] = value;
    }
    
    setCurrentProduct(updatedProduct);
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle select input changes
  const handleSelectChange = (name: string, value: string) => {
    setCurrentProduct({
      ...currentProduct,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  // Handle switch input changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setCurrentProduct({
      ...currentProduct,
      [name]: checked
    });
  };
  
  // Validate product form
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Validate required fields
    if (!currentProduct.name.trim()) {
      errors.name = "Product name is required";
    } else if (currentProduct.name.length < 3) {
      errors.name = "Product name must be at least 3 characters";
    }
    
    if (!currentProduct.description.trim()) {
      errors.description = "Product description is required";
    }
    
    // Validate price
    if (!currentProduct.price || isNaN(currentProduct.price)) {
      errors.price = "Price is required and must be a number";
    } else if (currentProduct.price <= 0) {
      errors.price = "Price must be greater than zero";
    }
    
    // Validate image URL
    if (!currentProduct.image_url.trim()) {
      errors.image_url = "Image URL is required";
    } else {
      try {
        // Basic URL validation
        new URL(currentProduct.image_url);
      } catch (e) {
        // Allow relative URLs or accept even if invalid for demo purposes
        console.warn("Image URL may not be valid, but accepting for demo");
      }
    }
    
    // Validate category
    if (!currentProduct.category) {
      errors.category = "Category is required";
    }
    
    // Validate stock
    if (isNaN(currentProduct.stock)) {
      errors.stock = "Stock must be a number";
    } else if (currentProduct.stock < 0) {
      errors.stock = "Stock cannot be negative";
    }
    
    // Validate discount
    const discount = currentProduct.discount ?? 0;
    if (isNaN(discount) || discount < 0 || discount > 100) {
      errors.discount = "Discount must be between 0 and 100";
    }
    
    // Validate original price if discount is applied
    if (discount > 0) {
      const originalPrice = currentProduct.original_price || 0;
      if (originalPrice <= 0) {
        errors.original_price = "Original price is required when applying a discount";
      } else if (originalPrice <= currentProduct.price) {
        errors.original_price = "Original price must be greater than current price when discount is applied";
      }
      
      // Verify that the discount calculation is correct
      if (originalPrice > 0 && currentProduct.price > 0) {
        const calculatedDiscount = Math.round(((originalPrice - currentProduct.price) / originalPrice) * 100);
        if (Math.abs(calculatedDiscount - discount) > 1) { // Allow 1% difference due to rounding
          errors.discount = `Discount value (${discount}%) doesn't match the price difference (${calculatedDiscount}%)`;
        }
      }
    }
    
    // If original price is set but no discount is applied, verify it makes sense
    const originalPrice = currentProduct.original_price || 0;
    if (originalPrice > 0 && discount === 0 && originalPrice <= currentProduct.price) {
      errors.original_price = "Original price should be greater than current price or discount should be applied";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Save product (create or update)
  const handleSaveProduct = async () => {
    if (!validateForm()) {
      // Show first error as toast
      const firstError = Object.values(formErrors)[0];
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Check if Supabase is properly initialized
      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase credentials are missing");
        toast.error("Database configuration error");
        return;
      }
      
      // Validate required fields before saving
      if (!currentProduct.name || !currentProduct.price || !currentProduct.category) {
        toast.error("Name, price, and category are required");
        return;
      }
      
      // Check if Supabase is available, otherwise use mock implementation
      const useMockImplementation = !supabaseUrl || !supabaseKey;
      
      // First, check the products table structure to see what columns are available
      if (!useMockImplementation) {
        try {
          console.log("Checking products table structure...");
          const { data: tableInfo, error: tableError } = await supabase
            .from('products')
            .select('*')
            .limit(1);
          
          if (tableError) {
            console.error("Error checking products table:", tableError);
            toast.error("Error checking database structure");
          } else if (tableInfo && tableInfo.length > 0) {
            console.log("Available columns in products table:", Object.keys(tableInfo[0]));
          } else {
            console.log("Products table exists but is empty");
          }
        } catch (tableCheckError) {
          console.error("Error checking table structure:", tableCheckError);
        }
      }
      
      if (isEditing && 'id' in currentProduct) {
        // Update existing product
        if (!useMockImplementation) {
          try {
            console.log('Updating product with ID:', currentProduct.id);
            
            // Use our utility function to safely save the product
            const result = await saveProductToSupabase(currentProduct, true);
            
            if (!result.success) {
              console.error("Failed to update product:", result.error);
              toast.error("Failed to update product: " + (result.error?.message || 'Unknown error'));
              throw result.error;
            }
            
            console.log('Product updated successfully:', result.data);
          } catch (err) {
            console.error("Error updating product:", err);
            toast.error("Failed to update product: " + (err.message || 'Unknown error'));
            throw err;
          }
        } else {
          // Mock implementation
          console.log("Mock update for product:", currentProduct);
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Update local state
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p.id === currentProduct.id ? { ...p, ...currentProduct } : p
          )
        );
        
        toast.success("Product updated successfully");
      } else {
        // Create new product
        if (!useMockImplementation) {
          try {
            console.log('Creating new product');
            
            // Use our utility function to safely save the product
            const result = await saveProductToSupabase(currentProduct, false);
            
            if (!result.success) {
              console.error("Failed to create product:", result.error);
              toast.error("Failed to create product: " + (result.error?.message || 'Unknown error'));
              throw result.error;
            }
            
            console.log('Product created successfully:', result.data);
            
            // Add new product to local state
            if (result.data && result.data.length > 0) {
              setProducts(prevProducts => [result.data[0], ...prevProducts]);
            }
          } catch (err) {
            console.error("Error creating product:", err);
            toast.error("Failed to create product: " + (err.message || 'Unknown error'));
            throw err;
          }
        } else {
          // Mock implementation - create a new product with a generated ID
          const newProduct = {
            ...currentProduct,
            id: Date.now(), // Use timestamp as a simple ID generator
            created_at: new Date().toISOString()
          };
          
          console.log("Mock create for product:", newProduct);
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Add to local state
          setProducts(prevProducts => [newProduct, ...prevProducts]);
        }
        
        toast.success("Product created successfully");
      }
      
      // Close form and reset current product
      setIsFormOpen(false);
      setCurrentProduct(emptyProduct);
      
      // Refresh products list (only if using real API)
      if (!useMockImplementation) {
        fetchProducts();
      }
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error?.message || "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Delete product
  const handleDeleteProduct = async () => {
    if (!('id' in currentProduct)) return;
    
    try {
      // Check if Supabase is available, otherwise use mock implementation
      const useMockImplementation = !supabaseUrl || !supabaseKey;
      
      if (!useMockImplementation) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', currentProduct.id);
        
        if (error) {
          console.error("Supabase delete error:", error);
          throw error;
        }
      } else {
        // Mock implementation
        console.log("Mock delete for product ID:", currentProduct.id);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Remove product from local state
      setProducts(prevProducts => 
        prevProducts.filter(p => p.id !== currentProduct.id)
      );
      
      toast.success("Product deleted successfully");
      
      // Close dialog and reset current product
      setIsDeleteDialogOpen(false);
      setCurrentProduct(emptyProduct);
    } catch (error: any) {
      console.error("Error deleting product:", error);
      toast.error(error?.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        <Button 
          onClick={handleAddProduct}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Products Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-center">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Spinner size="lg" className="mx-auto" />
                  <p className="mt-2 text-gray-500">Loading products...</p>
                </TableCell>
              </TableRow>
            ) : getCurrentPageItems().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="text-gray-500">No products found</p>
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageItems().map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={product.image_url || "/images/product-placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          console.log("Image failed to load:", product.image_url);
                          (e.target as HTMLImageElement).src = "/images/product-placeholder.svg";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[200px]">
                        {product.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {formatKesPrice(product.price)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      parseInt(String(product.stock), 10) > 10 
                        ? 'bg-green-100 text-green-800' 
                        : parseInt(String(product.stock), 10) > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {parseInt(String(product.stock), 10) || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditProduct(product)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {!loading && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {
              Math.min(currentPage * itemsPerPage, filteredProducts.length)
            } of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
                className={page === currentPage ? "bg-orange-500 hover:bg-orange-600" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update product details and inventory information." 
                : "Fill in the details to add a new product to your inventory."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
              
              <div className="grid gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleInputChange}
                    className={formErrors.name ? "border-red-500" : ""}
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    className={formErrors.description ? "border-red-500" : ""}
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-500">{formErrors.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={currentProduct.image_url}
                    onChange={handleInputChange}
                    className={formErrors.image_url ? "border-red-500" : ""}
                  />
                  {formErrors.image_url && (
                    <p className="text-sm text-red-500">{formErrors.image_url}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={currentProduct.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger 
                      id="category"
                      className={formErrors.category ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.category && (
                    <p className="text-sm text-red-500">{formErrors.category}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Pricing and Inventory */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Pricing & Inventory</h3>
              
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (KSh)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={currentProduct.price}
                      onChange={handleInputChange}
                      className={formErrors.price ? "border-red-500" : ""}
                    />
                    {formErrors.price && (
                      <p className="text-sm text-red-500">{formErrors.price}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price (KSh)</Label>
                    <Input
                      id="original_price"
                      name="original_price"
                      type="number"
                      value={currentProduct.original_price || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={currentProduct.stock}
                      onChange={handleInputChange}
                      className={formErrors.stock ? "border-red-500" : ""}
                    />
                    {formErrors.stock && (
                      <p className="text-sm text-red-500">{formErrors.stock}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      name="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={currentProduct.discount || 0}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Status */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Product Status</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_new" className="text-base">Mark as New</Label>
                    <p className="text-sm text-gray-500">
                      Highlight this product as newly added
                    </p>
                  </div>
                  <Switch
                    id="is_new"
                    checked={currentProduct.is_new}
                    onCheckedChange={(checked) => handleSwitchChange("is_new", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="is_popular" className="text-base">Mark as Popular</Label>
                    <p className="text-sm text-gray-500">
                      Feature this product in popular sections
                    </p>
                  </div>
                  <Switch
                    id="is_popular"
                    checked={currentProduct.is_popular}
                    onCheckedChange={(checked) => handleSwitchChange("is_popular", checked)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveProduct}
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSaving}
            >
              {isSaving && <Spinner size="sm" className="mr-2" />}
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              &quot;{('id' in currentProduct) ? currentProduct.name : ''}&quot; from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

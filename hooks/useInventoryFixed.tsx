"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from "@/lib/supabase";

// Define the product inventory type
export type ProductInventory = {
  id: number;
  stock: number;
};

// Define the inventory context type
interface InventoryContextType {
  inventory: ProductInventory[];
  updateStock: (productId: number, quantity: number) => Promise<boolean>;
  getStock: (productId: number) => number;
  setInitialInventory: (products: ProductInventory[]) => void;
  refreshInventory: () => Promise<void>;
}

// Create the inventory context with default values
const InventoryContext = createContext<InventoryContextType>({
  inventory: [],
  updateStock: async () => false,
  getStock: () => 0,
  setInitialInventory: () => {},
  refreshInventory: async () => {}
});

// Define the inventory provider props
interface InventoryProviderProps {
  children: ReactNode;
}

// Create the inventory provider component
export function InventoryProvider({ children }: InventoryProviderProps) {
  const [inventory, setInventory] = useState<ProductInventory[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load inventory from API and localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    refreshInventory();
  }, []);

  // Save inventory to localStorage whenever it changes
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory, isMounted]);

  // Refresh inventory from API
  const refreshInventory = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('id, stock');

      if (error) throw error;
      if (!products) throw new Error('No products found');
      
      // Convert products to inventory format
      const inventoryData: ProductInventory[] = products.map((product) => ({
        id: parseInt(product.id),
        stock: product.stock !== undefined ? product.stock : 10 // Default to 10 if stock is undefined
      }));
      
      setInventory(inventoryData);
      
      // Also update localStorage
      localStorage.setItem('inventory', JSON.stringify(inventoryData));
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      
      // Fall back to localStorage if API fails
      const savedInventory = localStorage.getItem('inventory');
      if (savedInventory) {
        try {
          setInventory(JSON.parse(savedInventory));
        } catch (error) {
          console.error('Failed to parse inventory from localStorage:', error);
        }
      }
    }
  };

  // Set initial inventory data
  const setInitialInventory = (products: ProductInventory[]) => {
    // Only set initial inventory if it's empty
    if (inventory.length === 0) {
      setInventory(products);
    }
  };

  // Get stock for a product
  const getStock = (productId: number): number => {
    const product = inventory.find(item => item.id === productId);
    // Default to 10 if product not found or stock is undefined
    return product ? (product.stock !== undefined ? product.stock : 10) : 10;
  };

  // Update stock for a product
  const updateStock = async (productId: number, quantity: number): Promise<boolean> => {
    // Find the product in inventory
    const productIndex = inventory.findIndex(item => item.id === productId);
    
    // If product not found in local inventory, fetch latest from API
    if (productIndex === -1) {
      await refreshInventory();
      const newProductIndex = inventory.findIndex(item => item.id === productId);
      
      // If still not found after refresh, add it with default stock
      if (newProductIndex === -1) {
        // Add product to inventory with default stock of 10
        const updatedInventory = [...inventory, { id: productId, stock: 10 }];
        setInventory(updatedInventory);
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
        return true; // Allow purchase since we've added default stock
      }
    }
    
    // Get the updated product index (in case it was just added)
    const currentProductIndex = inventory.findIndex(item => item.id === productId);
    const currentStock = inventory[currentProductIndex].stock;
    
    // Check if there's enough stock
    if (currentStock < quantity) {
      toast.error(`Not enough stock available. Only ${currentStock} items left.`, {
        id: `inventory-error-${productId}`,
      });
      return false;
    }
    
    // Calculate new stock value
    const newStock = currentStock - quantity;
    
    try {
      // Update stock in Supabase
      const { error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      // Update local inventory state
      const updatedInventory = [...inventory];
      updatedInventory[currentProductIndex] = {
        ...updatedInventory[currentProductIndex],
        stock: newStock
      };
      
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      // Show success toast for very low stock
      if (newStock <= 5 && newStock > 0) {
        toast.warning(`Low stock alert: Only ${newStock} items remaining.`, {
          id: `low-stock-${productId}`,
        });
      } else if (newStock === 0) {
        toast.error(`Product is now out of stock.`, {
          id: `out-of-stock-${productId}`,
        });
      }
      
      return true;
    } catch (error) {
      console.error("Failed to update stock in database:", error);
      
      // Even if the API call fails, we'll still update the local inventory
      const updatedInventory = [...inventory];
      updatedInventory[currentProductIndex] = {
        ...updatedInventory[currentProductIndex],
        stock: newStock
      };
      
      setInventory(updatedInventory);
      localStorage.setItem('inventory', JSON.stringify(updatedInventory));
      
      toast.warning("Inventory updated locally, but failed to sync with the database.");
      return true; // Still return true to allow the purchase
    }
  };

  // Create the context value
  const contextValue: InventoryContextType = {
    inventory,
    updateStock,
    getStock,
    setInitialInventory,
    refreshInventory
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

// Create a hook to use the inventory context
export function useInventory() {
  const context = useContext(InventoryContext);
  return context;
}

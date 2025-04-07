"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from 'sonner';

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
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const products = await response.json();
      
      // Convert products to inventory format
      const inventoryData: ProductInventory[] = products.map((product: any) => ({
        id: parseInt(product.id),
        stock: product.stock
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
    return product ? product.stock : 0;
  };

  // Update stock for a product
  const updateStock = async (productId: number, quantity: number): Promise<boolean> => {
    // Find the product in inventory
    const productIndex = inventory.findIndex(item => item.id === productId);
    
    if (productIndex === -1) {
      toast.error(`Product with ID ${productId} not found in inventory`);
      return false;
    }
    
    const currentStock = inventory[productIndex].stock;
    
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
      // Update stock in the database via API
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Update local inventory state
      const updatedInventory = [...inventory];
      updatedInventory[productIndex] = {
        ...updatedInventory[productIndex],
        stock: newStock
      };
      
      setInventory(updatedInventory);
      
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
      toast.error("Failed to update inventory in the database. Please try again.");
      return false;
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

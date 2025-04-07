import { ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

interface ProductsContentProps {
  onEditProduct?: (product: Product) => void;
}

declare function ProductsContent(props: ProductsContentProps): ReactNode;

export default ProductsContent;

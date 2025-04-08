export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  image_url?: string;
  category: string;
  featured?: boolean;
  isNew?: boolean;
  is_new?: boolean;
  isPopular?: boolean;
  is_popular?: boolean;
  discount?: number;
  stock?: number;
  description?: string;
  original_price?: number;
}

export interface APIError {
  message: string;
  status?: number;
  code?: string;
}

import { toast } from 'react-hot-toast';
import { Product, APIError } from '@/types';

export async function fetchWithRetry(
  input: RequestInfo,
  init?: RequestInit,
  retries = 3,
  delay = 1000
): Promise<Response> {
  try {
    const response = await fetch(input, init);
    
    // Retry on 5xx errors
    if (response.status >= 500 && retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(input, init, retries - 1, delay * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(input, init, retries - 1, delay * 2);
    }
    throw error;
  }
}

export async function handleApiResponse(response: Response) {
  // Check if response is HTML
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('text/html')) {
    const text = await response.text();
    if (text.startsWith('<!DOCTYPE')) {
      throw new Error('Received HTML instead of JSON response');
    }
  }

  // Parse JSON if available
  if (contentType?.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(
        data.message || 
        `API request failed with status ${response.status}`
      );
    }
    
    return data;
  }

  throw new Error('Unsupported response content type');
}

export function showApiError(error: unknown) {
  console.error('API error:', error);
  
  const message = error instanceof Error 
    ? error.message
    : 'An unknown API error occurred';
    
  toast.error(message);
}

export function validateProductData(data: unknown): Product[] {
  if (!Array.isArray(data)) {
    throw new Error('Expected array of products');
  }

  return data.map(item => ({
    id: item.id,
    name: item.name || 'Unnamed Product',
    price: typeof item.price === 'number' ? item.price : parseFloat(item.price || '0'),
    image: item.image_url || '/placeholder-product.png',
    category: item.category || 'Uncategorized',
    ...(item.featured && { featured: true }),
    ...(item.isNew && { isNew: true }),
    ...(item.discount && { discount: item.discount })
  }));
}

export function checkNetwork() {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    throw new Error('No internet connection');
  }
}

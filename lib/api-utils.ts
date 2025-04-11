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
  try {
    // Check if response is HTML
    const contentType = response.headers.get('content-type');
    
    // First try to parse as JSON regardless of content type
    try {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(
          data.message || 
          `API request failed with status ${response.status}`
        );
      }
      
      return data;
    } catch (jsonError) {
      // If JSON parsing fails, check if it's HTML
      if (contentType?.includes('text/html')) {
        // If it's HTML, try to extract any error message or just use a generic message
        const text = await response.text();
        
        // Check if it's a server error page
        if (text.includes('Internal Server Error') || text.includes('Error 500')) {
          throw new Error('Server error occurred. Please try again later.');
        }
        
        // Check if it's a not found page
        if (text.includes('404') || text.includes('Not Found')) {
          throw new Error('Resource not found. Please check the URL and try again.');
        }
        
        // Generic HTML response error
        throw new Error('Received HTML instead of JSON response. The API endpoint may be misconfigured.');
      }
      
      // If not HTML or couldn't parse as JSON, throw original error
      throw new Error(`Failed to parse response: ${jsonError.message}`);
    }
  } catch (error) {
    // Rethrow any errors
    throw error;
  }
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

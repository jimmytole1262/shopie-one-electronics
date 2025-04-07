"use client";

import dynamic from 'next/dynamic';

// Import the client component with no SSR to prevent hydration errors
const ClientCart = dynamic(() => import('./client-cart'), { 
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )
});

export default function CartWrapper() {
  return <ClientCart />;
}

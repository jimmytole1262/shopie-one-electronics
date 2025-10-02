import { Suspense } from 'react'
import SearchPageContent from './SearchPageContent'

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Search Products</h1>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  )
}
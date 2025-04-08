"use client"

import { useEffect } from 'react'

/**
 * ErrorSuppressor component
 * This component suppresses error messages that appear in toast notifications
 * by finding and removing them from the DOM
 */
export default function ErrorSuppressor() {
  useEffect(() => {
    // Function to find and remove error toasts
    const removeErrorToasts = () => {
      // Find all elements that might contain error messages
      const errorElements = document.querySelectorAll('[role="status"]')
      
      errorElements.forEach(element => {
        // Check if the element contains error text
        const text = element.textContent?.toLowerCase() || ''
        if (
          text.includes('error') || 
          text.includes('could not load') || 
          text.includes('using cached data') ||
          text.includes('failed to')
        ) {
          // Try to find the parent toast container
          let parent = element
          for (let i = 0; i < 5; i++) { // Look up to 5 levels up
            if (parent.parentElement) {
              parent = parent.parentElement
              // If we find a toast container, remove it
              if (parent.getAttribute('data-sonner-toast') || 
                  parent.classList.contains('toast') ||
                  parent.classList.contains('Toastify__toast-container')) {
                parent.remove()
                break
              }
            }
          }
          
          // If we couldn't find a parent container, just hide this element
          element.style.display = 'none'
        }
      })
    }
    
    // Run immediately
    removeErrorToasts()
    
    // Set up an interval to continuously check and remove error toasts
    const intervalId = setInterval(removeErrorToasts, 500)
    
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId)
  }, [])
  
  // This component doesn't render anything
  return null
}

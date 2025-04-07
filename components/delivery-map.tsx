"use client"

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Icon } from 'leaflet'
import dynamic from 'next/dynamic'

// Fix for Leaflet marker icons in Next.js
const fixLeafletIcon = () => {
  // Only run on client-side
  if (typeof window !== 'undefined') {
    // @ts-ignore
    delete Icon.Default.prototype._getIconUrl
    Icon.Default.mergeOptions({
      iconRetinaUrl: '/images/marker-icon-2x.png',
      iconUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-shadow.png',
    })
  }
}

interface DeliveryMapProps {
  orderStatus: 'received' | 'processing' | 'shipped' | 'delivered'
  estimatedDeliveryDate: Date
  shippingAddress?: string
}

const DeliveryMap = ({ orderStatus, estimatedDeliveryDate, shippingAddress }: DeliveryMapProps) => {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
    fixLeafletIcon()
  }, [])
  
  if (!isMounted) {
    return <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  }
  
  // Simulate locations based on order status
  const warehousePosition: [number, number] = [-1.2921, 36.8219] // Nairobi
  const destinationPosition: [number, number] = [-1.3031, 36.7073] // Approximate location in Nairobi
  
  // Generate intermediate points based on order status
  const getRoutePoints = () => {
    const points: [number, number][] = [warehousePosition]
    
    if (orderStatus === 'received') {
      return [warehousePosition]
    }
    
    if (orderStatus === 'processing') {
      return [warehousePosition]
    }
    
    if (orderStatus === 'shipped') {
      // Add intermediate points for shipping
      points.push([-1.2975, 36.7846]) // Point 1
      points.push([-1.3001, 36.7500]) // Point 2
    }
    
    if (orderStatus === 'delivered') {
      // Complete route
      points.push([-1.2975, 36.7846]) // Point 1
      points.push([-1.3001, 36.7500]) // Point 2
      points.push(destinationPosition)
    }
    
    return points
  }
  
  const routePoints = getRoutePoints()
  const currentPosition = routePoints[routePoints.length - 1]
  
  return (
    <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
      <MapContainer 
        center={[-1.2921, 36.8219]} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Warehouse marker */}
        <Marker position={warehousePosition}>
          <Popup>
            Warehouse Location
          </Popup>
        </Marker>
        
        {/* Current position marker */}
        <Marker position={currentPosition}>
          <Popup>
            {orderStatus === 'delivered' 
              ? 'Delivered to destination' 
              : orderStatus === 'shipped' 
                ? 'Package in transit' 
                : 'Package being processed'}
          </Popup>
        </Marker>
        
        {/* Destination marker (only show if delivered) */}
        {orderStatus === 'delivered' && (
          <Marker position={destinationPosition}>
            <Popup>
              Delivery Destination
            </Popup>
          </Marker>
        )}
        
        {/* Route line */}
        <Polyline 
          positions={routePoints}
          color={orderStatus === 'delivered' ? 'green' : 'blue'}
          weight={3}
          dashArray={orderStatus === 'shipped' ? '5, 5' : ''}
        />
      </MapContainer>
    </div>
  )
}

// Export a dynamic component with SSR disabled
export default dynamic(() => Promise.resolve(DeliveryMap), {
  ssr: false
})

"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow, MapMouseEvent } from '@vis.gl/react-google-maps';
import { TransformedBranch } from "@/types/supplier";
import Image from 'next/image';
import { Phone, MapPin, Globe } from 'lucide-react';

interface SuppliersMapProps {
  branches: TransformedBranch[];
  selectedBranch: TransformedBranch | null;
  onMarkerClick: (branch: TransformedBranch | null) => void;
}

// Custom hook to detect desktop screens
const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return isDesktop;
};

// Custom marker component
const CustomMarker = ({ branch, onClick, isSelected }: { 
  branch: TransformedBranch; 
  onClick: () => void;
  isSelected: boolean;
}) => {
  const logoUrl = branch.supplier.brand_logos?.[0]?.logo_url;
  
  return (
    <div 
      onClick={onClick}
      className={`
        relative w-6 h-6 md:w-8 md:h-8 cursor-pointer transform rotate-45 
        ${isSelected ? 'scale-110' : 'hover:scale-110'} 
        transition-transform duration-200
      `}
    >
      {/* Diamond background */}
      <div className={`
        absolute inset-0 
        ${isSelected ? 'bg-red-500 border-red-500' : 'bg-white border-black'} 
        border-2 md:border-[3px]
      `} />
      
      {/* Logo container */}
      <div className="absolute inset-1 md:inset-[2px] bg-white overflow-hidden">
        {logoUrl ? (
          <div className="relative w-full h-full transform -rotate-45">
            <Image 
              src={logoUrl} 
              alt={branch.supplier.supplier_name}
              fill
              sizes="(max-width: 768px) 24px, 32px"
              className="object-contain"
              unoptimized // Since these are external URLs, we'll skip optimization
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center transform -rotate-45">
            <span className="text-[10px] md:text-xs font-bold text-red-500">
              {branch.supplier.supplier_name.charAt(0)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export function SuppliersMap({
  branches,
  selectedBranch,
  onMarkerClick,
}: SuppliersMapProps) {
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const isDesktop = useIsDesktop();

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedBranch) {
        onMarkerClick(null);
        setInfoWindowOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);
    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [selectedBranch, onMarkerClick]);

  // Handle map click to clear selection
  const handleMapClick = (e: MapMouseEvent) => {
    // Only clear if clicking directly on the map (not on markers or info window)
    if (e?.domEvent?.target && (e.domEvent.target as HTMLElement).tagName === 'DIV') {
      onMarkerClick(null);
      setInfoWindowOpen(false);
    }
  };

  // Las Vegas metropolitan area bounds
  const lasVegasBounds = isDesktop ? {
    north: 36.235,  // North boundary
    south: 35.965,  // South boundary
    east: -114.95,  // East boundary
    west: -115.35   // West boundary
  } : {
    // Mobile bounds (significantly more zoomed in)
    north: 36.205,  // North boundary
    south: 35.995,  // South boundary
    east: -114.95,  // East boundary
    west: -115.35   // West boundary
  };

  // Default center (Las Vegas)
  const mapCenter = { lat: 36.1699, lng: -115.1398 };

  const handleMarkerClick = (branch: TransformedBranch) => {
    onMarkerClick(branch);
    setInfoWindowOpen(true);
  };

  return (
    <div className="w-full h-full -mt-2 md:mt-0" style={{ minHeight: "500px" }}>
      <APIProvider 
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={['marker']}
      >
        <Map
          style={{ width: '100%', height: '100%' }}
          defaultCenter={mapCenter}
          defaultBounds={lasVegasBounds}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          mapId="dark_map"
          onClick={handleMapClick}
        >
          {branches.map((branch) => (
            branch.latitude && branch.longitude && (
              <AdvancedMarker
                key={branch.id}
                position={{
                  lat: branch.latitude,
                  lng: branch.longitude
                }}
                onClick={() => handleMarkerClick(branch)}
                title={branch.supplier.supplier_name}
              >
                <CustomMarker 
                  branch={branch} 
                  onClick={() => handleMarkerClick(branch)}
                  isSelected={selectedBranch?.id === branch.id}
                />
              </AdvancedMarker>
            )
          ))}

          {selectedBranch && infoWindowOpen && (
            <InfoWindow
              position={{
                lat: selectedBranch.latitude!,
                lng: selectedBranch.longitude!
              }}
              onCloseClick={() => {
                setInfoWindowOpen(false);
                onMarkerClick(null);
              }}
            >
              <div className="p-2 md:p-3 max-w-[280px] md:max-w-[300px]">
                {/* Header with logo and name */}
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  {selectedBranch.supplier.brand_logos?.[0]?.logo_url ? (
                    <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      <Image
                        src={selectedBranch.supplier.brand_logos[0].logo_url}
                        alt={selectedBranch.supplier.supplier_name}
                        fill
                        sizes="(max-width: 768px) 40px, 48px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg md:text-lg">
                        {selectedBranch.supplier.supplier_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-2xl md:text-2xl break-words">{selectedBranch.supplier.supplier_name}</h3>
                </div>

                {/* Address and contact info */}
                <div className="space-y-1.5 md:space-y-2 mb-2 md:mb-3">
                  {selectedBranch.address && (
                    <p className="text-base md:text-base flex items-start gap-1.5 md:gap-2">
                      <span className="text-red-500 flex-shrink-0">📍</span>
                      <span className="break-words">{selectedBranch.address}</span>
                    </p>
                  )}
                  {selectedBranch.phone && (
                    <p className="text-base md:text-base flex items-center gap-1.5 md:gap-2">
                      <span className="text-red-500 flex-shrink-0">📞</span>
                      <span>{selectedBranch.phone}</span>
                    </p>
                  )}
                  {selectedBranch.cross_street && (
                    <p className="text-base md:text-base flex items-start gap-1.5 md:gap-2">
                      <span className="text-red-500 flex-shrink-0">🚦</span>
                      <span className="break-words">Cross Street: {selectedBranch.cross_street}</span>
                    </p>
                  )}
                </div>

                {/* Materials section */}
                {selectedBranch.supplier.materials && selectedBranch.supplier.materials.length > 0 && (
                  <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-gray-200">
                    <h4 className="text-base md:text-base font-semibold mb-1.5 md:mb-2 text-gray-700">Materials Provided:</h4>
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {selectedBranch.supplier.materials.map((material) => (
                        <span 
                          key={material.id}
                          className="px-3 py-1.5 md:px-2 md:py-1 bg-red-100 text-red-700 rounded-full text-base md:text-sm"
                        >
                          {material.material_name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 md:pt-3 border-t border-gray-200 flex justify-end gap-3 md:gap-4">
                  {selectedBranch.phone && (
                    <button
                      onClick={() => window.location.href = `tel:${selectedBranch.phone}`}
                      className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Call"
                    >
                      <Phone size={20} className="md:w-[18px] md:h-[18px]" />
                    </button>
                  )}
                  {selectedBranch.address && (
                    <button
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedBranch.address)}`)}
                      className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Open in Maps"
                    >
                      <MapPin size={20} className="md:w-[18px] md:h-[18px]" />
                    </button>
                  )}
                  {selectedBranch.supplier.website_url && (
                    <button
                      onClick={() => window.open(selectedBranch.supplier.website_url)}
                      className="text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                      title="Visit Website"
                    >
                      <Globe size={20} className="md:w-[18px] md:h-[18px]" />
                    </button>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
} 
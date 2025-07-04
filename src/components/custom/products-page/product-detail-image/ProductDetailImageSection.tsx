// ============================================================================
// ProductDetailImageSection Component
// Main container component for the product image gallery
// Manages layout, state, and coordinates between smaller components
// ============================================================================

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DiamondImage } from './DiamondImage';
import { MainDiamondImage } from './MainDiamondImage';
import { Lightbox } from './Lightbox';
import { ColorImages } from './ColorImages';
import { ProjectImages } from './ProjectImages';
import { getPlaceholderType, generatePlaceholders } from './utils';
import BrandsCardLogo from '../BrandsCardLogo';
import { getBrandColor } from '@/utils/brandColors';

// Component props interface
interface ProductDetailImageSectionProps {
  mainImage: string;
  projectImages: string[];
  colorImages: string[];
  productName: string;
  brand: string;
}

const ProductDetailImageSection: React.FC<ProductDetailImageSectionProps> = ({ 
  mainImage, 
  projectImages, 
  colorImages,
  productName,
  brand
}) => {
  // Process and limit images to exactly 10 for each category
  const allProjectImages = useMemo(() => {
    if (projectImages.length >= 10) {
      return projectImages.slice(0, 10);
    }
    const additionalCount = 10 - projectImages.length;
    const additionalImages = generatePlaceholders(additionalCount, 'PI');
    return [...projectImages, ...additionalImages];
  }, [projectImages]);
  
  const allColorImages = useMemo(() => {
    if (colorImages.length >= 10) {
      return colorImages.slice(0, 10);
    }
    const additionalCount = 10 - colorImages.length;
    const additionalImages = generatePlaceholders(additionalCount, 'PC');
    return [...colorImages, ...additionalImages];
  }, [colorImages]);

  // Combine all images for navigation
  const allImages = useMemo(() => 
    [...allColorImages, ...allProjectImages],
    [allColorImages, allProjectImages]
  );

  // Image management state and handlers
  const initialImage = useMemo(() => 
    allColorImages.length > 0 ? allColorImages[0] : mainImage, 
    [allColorImages, mainImage]
  );
  
  const [displayedImage, setDisplayedImage] = useState(initialImage);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const currentIndex = useMemo(() => 
    allImages.findIndex(img => img === displayedImage), 
    [allImages, displayedImage]
  );

  // Image navigation and selection handlers
  const navigateImages = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % allImages.length
      : (currentIndex - 1 + allImages.length) % allImages.length;
    setDisplayedImage(allImages[newIndex]);
  }, [currentIndex, allImages]);

  // Lightbox handlers
  const handleMainImageClick = () => {
    setLightboxIndex(currentIndex);
    setLightboxOpen(true);
  };

  const handleLightboxNav = useCallback((direction: 'next' | 'prev') => {
    setLightboxIndex((prev) => {
      if (direction === 'next') {
        return (prev + 1) % allImages.length;
      } else {
        return (prev - 1 + allImages.length) % allImages.length;
      }
    });
  }, [allImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleLightboxNav('next');
      if (e.key === 'ArrowLeft') handleLightboxNav('prev');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, handleLightboxNav]);

  // Get brand color
  const brandColor = getBrandColor(brand);

  return (
    <div className="relative w-full h-full">
      {/* Mobile Top Bar: Product Name, Brand Name, Brand Logo */}
      <div className="md:hidden w-full flex items-center justify-between px-3 pt-3 pb-2 bg-white border-b border-gray-200">
        <div className="flex flex-col min-w-0 text-left">
          <span className="font-bold text-base text-black truncate">{productName}</span>
          <span className="text-xs truncate" style={{ color: brandColor }}>{brand}</span>
        </div>
        <div className="flex-shrink-0 ml-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <BrandsCardLogo brand={brand} size="sm" />
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block w-full h-full">
        {/* Main Image Container */}
        <div className="absolute left-[100px] right-0 top-0 bottom-[100px] bg-transparent">
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-full h-full max-w-full max-h-full flex items-center justify-center relative">
              <MainDiamondImage 
                src={displayedImage} 
                onClick={handleMainImageClick} 
              />
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={() => navigateImages('prev')}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-20"
              aria-label="Previous image"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <button
              onClick={() => navigateImages('next')}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-20"
              aria-label="Next image"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Color Images */}
        <ColorImages
          images={allColorImages}
          displayedImage={displayedImage}
          onImageSelect={setDisplayedImage}
        />

        {/* Project Images */}
        <div className="absolute left-0 right-0 bottom-0 w-full h-[100px]">
          <ProjectImages
            images={allProjectImages}
            displayedImage={displayedImage}
            onImageSelect={setDisplayedImage}
          />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full flex flex-col">
        {/* Main Image */}
        <div className="w-full h-[220px] flex items-center justify-center bg-gray-50 relative">
          <div className="w-full h-full max-w-full max-h-full flex items-center justify-center relative">
            <MainDiamondImage 
              src={displayedImage} 
              onClick={handleMainImageClick} 
            />
          </div>
           
          {/* Navigation arrows for mobile */}
          <button
            onClick={() => navigateImages('prev')}
            className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-20"
            aria-label="Previous image"
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
            
          <button
            onClick={() => navigateImages('next')}
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-colors z-20"
            aria-label="Next image"
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        
        {/* Color Images Row */}
        <div className="w-full h-[60px] bg-white px-2 py-1 border-t border-gray-100">
          <div className="flex items-center h-full">
            <div className="flex flex-col items-start justify-center mr-2 select-none md:[style:min-width:90px]">
              <span className="text-[10px] font-bold text-red-600 tracking-tight break-words text-left" style={{letterSpacing: '0.5px', maxWidth: 70}}>
                COLORS AVAILABLE
              </span>
            </div>
            <div className="flex flex-row items-center overflow-x-auto h-full w-full scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-200 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-red-600 [&::-webkit-scrollbar-track]:bg-gray-200 gap-x-7 pl-3">
              {allColorImages.map((img, idx) => {
                const type = getPlaceholderType(img) || 'PC';
                return (
                  <div key={idx} className="flex items-center justify-center flex-shrink-0">
                    <button
                      className="w-[28px] h-[28px] flex items-center justify-center focus:outline-none bg-transparent p-0"
                      style={{ background: 'none' }}
                      onClick={() => setDisplayedImage(img)}
                      tabIndex={0}
                      aria-label={`Color image ${idx+1}`}
                    >
                      <DiamondImage 
                        src={img} 
                        alt={`Color ${idx+1}`} 
                        active={displayedImage === img} 
                        type={type as 'PI' | 'PC'} 
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Images Row */}
        <div className="w-full h-[60px] bg-white px-2 py-1 border-t border-gray-100">
          <div className="flex items-center h-full">
            <div className="flex flex-col items-start justify-center mr-2 select-none md:[style:min-width:90px]">
              <span className="text-[10px] font-bold text-red-600 tracking-tight break-words text-left" style={{letterSpacing: '0.5px', maxWidth: 70}}>
                PROJECT IMAGES
              </span>
            </div>
            <div className="flex flex-row items-center overflow-x-auto h-full w-full scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-200 [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-red-600 [&::-webkit-scrollbar-track]:bg-gray-200 gap-x-7 pl-3">
              {allProjectImages.map((img, idx) => {
                const type = getPlaceholderType(img) || 'PI';
                return (
                  <div key={idx} className="flex items-center justify-center flex-shrink-0">
                    <button
                      className="w-[28px] h-[28px] flex items-center justify-center focus:outline-none bg-transparent p-0"
                      style={{ background: 'none' }}
                      onClick={() => setDisplayedImage(img)}
                      tabIndex={0}
                      aria-label={`Project image ${idx+1}`}
                    >
                      <DiamondImage 
                        src={img} 
                        alt={`Project ${idx+1}`} 
                        active={displayedImage === img} 
                        type={type as 'PI' | 'PC'} 
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={allImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onNavigate={handleLightboxNav}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
};

export default ProductDetailImageSection; 
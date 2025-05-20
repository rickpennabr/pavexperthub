// ============================================================================
// Lightbox Component
// Provides a full-screen modal view for product images
// Features:
// - Full-screen image display
// - Navigation controls (previous/next)
// - Close button
// - Keyboard navigation support
// - Responsive design
// ============================================================================

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import ProductPlaceholder from '@/components/custom/products-page/product-grid-item/ProductPlaceholder';
import { isRealImagePath, getImagePath } from './utils';

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'next' | 'prev') => void;
  onIndexChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ 
  images, 
  currentIndex, 
  onClose, 
  onNavigate,
  onIndexChange 
}) => {
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNavigate('next');
    if (e.key === 'ArrowLeft') onNavigate('prev');
  }, [onClose, onNavigate]);

  // Add keyboard event listeners
  useEffect(() => {
    if (images.length > 0) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [images.length, handleKeyDown]);

  if (images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center">
      <button
        className="absolute top-4 right-4 text-white text-3xl z-50 p-2 hover:bg-black/40 rounded-full"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full z-50"
        onClick={() => onNavigate('prev')}
        aria-label="Previous image"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full z-50"
        onClick={() => onNavigate('next')}
        aria-label="Next image"
      >
        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <div className="relative w-full max-w-4xl h-[70vh] flex items-center justify-center">
          {isRealImagePath(images[currentIndex]) ? (
            <Image
              src={getImagePath(images[currentIndex])}
              alt="Full Image"
              fill
              className="object-contain rounded-lg shadow-lg"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ProductPlaceholder
                text={images[currentIndex]}
                width={600}
                height={400}
                backgroundColor="#222"
                textColor="#fff"
              />
            </div>
          )}
        </div>
      </div>
      {/* Thumbnails for navigation */}
      <div className="flex flex-row gap-x-4 mt-6 mb-2 overflow-x-auto max-w-3xl px-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            className={`w-16 h-16 flex items-center justify-center border-2 rounded-md overflow-hidden transition-all ${idx === currentIndex ? 'border-red-600' : 'border-transparent'}`}
            onClick={() => onIndexChange(idx)}
            aria-label={`Show image ${idx+1}`}
          >
            {isRealImagePath(img) ? (
              <Image
                src={getImagePath(img)}
                alt={`Thumb ${idx+1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">{img}</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}; 
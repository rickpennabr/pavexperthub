// ============================================================================
// DiamondImage Component
// A reusable component for rendering diamond-shaped image thumbnails
// Used in both ColorImages and ProjectImages components
// Features:
// - Rotated square design for diamond shape
// - Active state highlighting
// - Support for real images and placeholders
// - Responsive sizing
// ============================================================================

import React from 'react';
import Image from 'next/image';
import ProductPlaceholder from '@/components/custom/products-page/product-grid-item/ProductPlaceholder';
import { getPlaceholderType, isRealImagePath, getImagePath } from './utils';

interface DiamondImageProps {
  src: string;
  alt: string;
  active: boolean;
  type: 'PI' | 'PC' | null;
}

export const DiamondImage: React.FC<DiamondImageProps> = ({ src, alt, active, type: propType }) => {
  // Check if image is a real file or placeholder
  const placeholderType = getPlaceholderType(src);
  const isRealImage = isRealImagePath(src);
  const imageType = propType || placeholderType;

  return (
    <div 
      className={`w-[28px] h-[28px] md:w-[48px] md:h-[48px] flex items-center justify-center transform rotate-45 relative overflow-hidden cursor-pointer ${
        active ? 'border-2 border-red-600 shadow-[0_0_0_3px_rgba(211,47,47,0.2)]' : 'border border-gray-200'
      }`}
      style={{ background: isRealImage ? 'transparent' : (imageType ? 'black' : 'white') }}
    >
      {isRealImage ? (
        <div className="absolute inset-[-20%] -rotate-45">
          <Image
            src={getImagePath(src)}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 28px, 48px"
          />
        </div>
      ) : imageType ? (
        <span className="text-white text-[9px] md:text-[10px] font-semibold -rotate-45 select-none whitespace-pre-line text-center leading-tight">
          {`Coming\nSoooon...`}
        </span>
      ) : (
        <div className="w-[20px] h-[20px] md:w-[36px] md:h-[36px] -rotate-45 border border-gray-300 bg-white" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <ProductPlaceholder
            text={alt}
            width={36}
            height={36}
            backgroundColor="#f3f4f6"
            textColor="#6b7280"
          />
        </div>
      )}
    </div>
  );
}; 
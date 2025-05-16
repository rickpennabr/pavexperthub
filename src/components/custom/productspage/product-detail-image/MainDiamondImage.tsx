// ============================================================================
// MainDiamondImage Component
// Renders the primary product image in the center of the product detail page
// Features:
// - Large, centered image display
// - Click handler for lightbox activation
// - Support for real images and placeholders
// - Responsive sizing and object-fit containment
// ============================================================================
import React from 'react';
import Image from 'next/image';
import ProductPlaceholder from '@/components/custom/productspage/product-grid-item/ProductPlaceholder';
import { getPlaceholderType, isRealImagePath, getImagePath } from './utils';

interface MainDiamondImageProps {
  src: string;
  onClick?: () => void;
}

export const MainDiamondImage: React.FC<MainDiamondImageProps> = ({ src, onClick }) => {
  const type = getPlaceholderType(src);
  const isRealImage = isRealImagePath(src);
  
  return (
    <div 
      className="w-full h-full flex items-center justify-center cursor-pointer relative"
      onClick={onClick}
    >
      {isRealImage ? (
        <Image 
          src={getImagePath(src)}
          alt="Product Image"
          fill
          className="object-contain"
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          priority
        />
      ) : type ? (
        <span className="text-black text-2xl md:text-3xl font-bold select-none whitespace-pre-line text-center leading-tight">
          {`Coming\nSoooon...`}
        </span>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ProductPlaceholder 
            text={src.split('/').pop()?.split('?').shift() || 'Product Image'}
            width={280}
            height={210}
            backgroundColor="#f9fafb"
            textColor="#111827"
          />
        </div>
      )}
    </div>
  );
}; 
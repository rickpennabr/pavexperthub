// ============================================================================
// ProductPlaceholder Component (Refactored)
// Renders a placeholder for products without images
// Features: Customizable dimensions, colors, and text display
// ============================================================================

import React from 'react';
import Image from 'next/image';

interface ProductPlaceholderProps {
  text?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  textColor?: string;
  isListMode?: boolean;
}

const ProductPlaceholder: React.FC<ProductPlaceholderProps> = ({
  text = 'Image Coming Soon...',
  width = 150,
  height = 150,
  backgroundColor = '#f3f4f6',
  textColor = '#111827',
  isListMode = false
}) => {
  const words = text.split(' ');

  // Tailwind classes for font size and spacing
  const fontClass = isListMode
    ? 'text-[8px] md:text-[10px] lg:text-xs'
    : 'text-xs md:text-sm lg:text-base';
  const spacingClass = isListMode
    ? 'space-y-2 md:space-y-3'
    : 'space-y-1';

  return (
    <div 
      className={`flex flex-col items-center justify-center rounded-lg select-none ${spacingClass}`}
      style={{ width, height, background: backgroundColor }}
    >
      <div className="mb-1 flex-shrink-0">
        <Image 
          src="/images/logo/pavexpert-logo-simble-sq-grey.png" 
          alt="PavExpert Logo" 
          width={32}
          height={32}
          className="object-contain"
        />
      </div>
      <div className={`flex flex-col items-center text-center font-bold ${fontClass}`} style={{ color: textColor }}>
        {isListMode ? (
          words.map((word, i) => <span key={i}>{word}</span>)
        ) : (
          <span>{text}</span>
        )}
      </div>
    </div>
  );
};

export default ProductPlaceholder; 
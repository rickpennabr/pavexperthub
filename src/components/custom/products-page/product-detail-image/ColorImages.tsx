// ============================================================================
// ColorImages Component
// Displays a vertical list of color variation images
// Features:
// - Vertical scrolling list of color images
// - Active state highlighting
// - Uses DiamondImage component for consistent styling
// - Labeled section for color variations
// ============================================================================

import React from 'react';
import { DiamondImage } from './DiamondImage';
import { getPlaceholderType } from './utils';

interface ColorImagesProps {
  images: string[];
  displayedImage: string;
  onImageSelect: (image: string) => void;
}

export const ColorImages: React.FC<ColorImagesProps> = ({ images, displayedImage, onImageSelect }) => {
  return (
    <div className="h-full w-[100px] flex flex-col items-center pt-1 bg-white">
      {/* Label */}
      <div className="w-full flex flex-col items-center">
        <span className="text-[10px] font-bold text-red-600 tracking-tight break-words text-center" style={{letterSpacing: '0.5px', maxWidth: 70}}>
          COLORS AVAILABLE
        </span>
      </div>
      
      {/* Color Images */}
      <div className="flex flex-col items-center w-full overflow-y-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-transparent max-h-[calc(100%-100px)] [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full pl-2 pr-2 gap-y-7 pt-5">
        {images.map((img, idx) => {
          const type = getPlaceholderType(img) || 'PC';
          return (
            <div key={idx} className="flex items-center justify-center flex-shrink-0">
              <button
                className="w-[48px] h-[48px] flex items-center justify-center focus:outline-none bg-transparent p-0"
                style={{ background: 'none' }}
                onClick={() => onImageSelect(img)}
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
  );
}; 
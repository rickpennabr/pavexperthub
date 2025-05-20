// ============================================================================
// ProjectImages Component
// Displays a horizontal list of project-related images
// Features:
// - Horizontal scrolling list of project images
// - Active state highlighting
// - Uses DiamondImage component for consistent styling
// - Labeled section for project images
// ============================================================================

import React from 'react';
import { DiamondImage } from './DiamondImage';
import { getPlaceholderType } from './utils';

interface ProjectImagesProps {
  images: string[];
  displayedImage: string;
  onImageSelect: (image: string) => void;
}

export const ProjectImages: React.FC<ProjectImagesProps> = ({ images, displayedImage, onImageSelect }) => {
  return (
    <div className="w-full h-[100px] flex items-center bg-white">
      <div className="flex flex-col items-center justify-center select-none" style={{minWidth: 90}}>
        <span className="text-[10px] font-bold text-red-600 tracking-tight break-words text-center" style={{letterSpacing: '0.5px', maxWidth: 70}}>
          PROJECT IMAGES
        </span>
      </div>
      <div className="flex flex-row items-center overflow-x-auto h-full w-full scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-transparent [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full gap-x-7 pl-3">
        {images.map((img, idx) => {
          const type = getPlaceholderType(img) || 'PI';
          return (
            <div key={idx} className="flex items-center justify-center flex-shrink-0">
              <button
                className="w-[48px] h-[48px] flex items-center justify-center focus:outline-none bg-transparent p-0"
                style={{ background: 'none' }}
                onClick={() => onImageSelect(img)}
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
  );
}; 
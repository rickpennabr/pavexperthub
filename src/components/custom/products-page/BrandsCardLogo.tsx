import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  brand: string;
  size?: 'sm' | 'md' | 'lg';
}

const brandLogoMap: Record<string, string> = {
  belgard: '/images/brands/belgard/Belgard_logo_symbol.png',
  keystone: '/images/brands/keystone/keystone-logo_symbol.png',
  'las vegas paver': '/images/brands/lasvegaspaver/LasVegasPaver_logo_symbol.png',
  lvp: '/images/brands/lasvegaspaver/LasVegasPaver_logo_symbol.png',
};

// Brand color mapping
const brandColors: Record<string, { color: string; shadow: string }> = {
  belgard: {
    color: '#1A3057',
    shadow: '0 0 2px rgba(26, 48, 87, 0.4), 0 0 8px rgba(26, 48, 87, 0.2)'
  },
  keystone: {
    color: '#005596',
    shadow: '0 0 2px rgba(0, 85, 150, 0.4), 0 0 8px rgba(0, 85, 150, 0.2)'
  },
  'las vegas paver': {
    color: '#842B38',
    shadow: '0 0 2px rgba(132, 43, 56, 0.4), 0 0 8px rgba(132, 43, 56, 0.2)'
  },
  lvp: {
    color: '#842B38',
    shadow: '0 0 2px rgba(132, 43, 56, 0.4), 0 0 8px rgba(132, 43, 56, 0.2)'
  }
};

const BrandsCardLogo: React.FC<BrandLogoProps> = ({ brand, size = 'md' }) => {
  // Get the appropriate logo image based on brand name
  const normalized = brand.toLowerCase();
  let logoSrc = '';
  if (normalized.includes('belgard')) logoSrc = brandLogoMap.belgard;
  else if (normalized.includes('keystone')) logoSrc = brandLogoMap.keystone;
  else if (normalized.includes('las vegas')) logoSrc = brandLogoMap['las vegas paver'];
  else if (normalized.includes('lvp')) logoSrc = brandLogoMap.lvp;

  // Get circle size based on size prop
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'w-6 h-6';
      case 'lg': return 'w-11 h-11';
      default: return 'w-8 h-8';
    }
  };
  const sizeClass = getSizeClass();

  // Get brand color and shadow
  const getBrandStyle = () => {
    if (normalized.includes('belgard')) return brandColors.belgard;
    if (normalized.includes('keystone')) return brandColors.keystone;
    if (normalized.includes('las vegas') || normalized.includes('lvp')) return brandColors['las vegas paver'];
    return { color: '#000000', shadow: '0 0 10px rgba(0, 0, 0, 0.1)' };
  };

  const brandStyle = getBrandStyle();

  return (
    <div
      className={`${sizeClass} flex items-center justify-center bg-white border border-gray-200 flex-shrink-0 rotate-45`}
      style={{ overflow: 'hidden', boxShadow: brandStyle.shadow, marginTop: '-0.3em', marginBottom: '-0.3em' }}
      title={brand}
    >
      <div className="w-full h-full flex items-center justify-center -rotate-45">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={brand + ' logo'}
            width={40}
            height={40}
            className="object-contain w-[70%] h-[70%]"
          />
        ) : (
          <span className="font-bold text-base" style={{ color: brandStyle.color }}>{brand.charAt(0)}</span>
        )}
      </div>
    </div>
  );
};

export default BrandsCardLogo; 
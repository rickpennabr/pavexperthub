// ============================================================================
// ProductDetailDataSection Component
// Displays detailed product information in a collapsible section
// Features: Product name, brand logo, description, and specifications table
// ============================================================================

import React, { useState } from 'react';
import BrandLogo from './BrandsCardLogo';
import { getBrandColor } from '@/utils/brandColors';

// Component props interface
interface ProductDetailDataSectionProps {
  product_name: string;
  brand: string;
  product_type: string;
  color: string;
  size: string;
  thickness: string;
  thickness_in: string;
  sqft_pallet: number;
  sqft_layer: number;
  lnft_pallet: number;
  layer_pallet: number;
  pcs_pallet: number;
  product_note: string;
  colors_available: string[];
  thicknesses_available: string[];
}

// Animated icon for accordion
function AccordionIcon({ open }: { open: boolean }) {
  return (
    <span className="relative w-5 h-5 flex items-center justify-center">
      <span
        className={`absolute left-0 right-0 h-0.5 bg-white rounded transition-all duration-200 ${open ? 'rotate-45 top-2.5' : 'top-1.5'}`}
        style={{ transitionProperty: 'all' }}
      />
      <span
        className={`absolute left-0 right-0 h-0.5 bg-white rounded transition-all duration-200 ${open ? '-rotate-45 top-2.5' : 'top-3.5'}`}
        style={{ transitionProperty: 'all' }}
      />
    </span>
  );
}

// Accordion section component
function AccordionSection({
  title,
  open,
  onClick,
  children
}: {
  title: string;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <button
        className={`w-full flex items-center justify-between px-3 py-2 md:px-4 md:py-2 bg-black text-white font-medium md:text-base h-12 transition-all duration-200 ${open ? 'rounded-t-lg' : 'rounded-lg'} cursor-pointer`}
        onClick={onClick}
        style={{ borderRadius: open ? '0.75rem 0.75rem 0 0' : '0.75rem' }}
      >
        <span>{title}</span>
        <AccordionIcon open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 bg-white ${open ? 'rounded-b-lg border border-t-0 border-gray-200' : ''}`}
        style={{ maxHeight: open ? 1000 : 0, borderRadius: open ? '0 0 0.75rem 0.75rem' : '' }}
      >
        {open && <div className="p-2 md:p-3">{children}</div>}
      </div>
    </div>
  );
}

const ProductDetailDataSection: React.FC<ProductDetailDataSectionProps> = ({
  product_name,
  brand,
  product_type,
  color,
  size,
  thickness,
  thickness_in,
  sqft_pallet,
  sqft_layer,
  lnft_pallet,
  layer_pallet,
  pcs_pallet,
  product_note,
  colors_available,
  thicknesses_available,
}) => {
  // State for collapsible sections
  const [openSection, setOpenSection] = useState<'data' | 'desc' | 'resources' | null>('data');

  // Get brand color
  const brandColor = getBrandColor(brand);

  // Define pairs for 4-column rows in the specifications table
  const pairs = [
    // Basic Information (Brand removed)
    [
      { label: 'Color', value: color },
      { label: 'Product Type', value: product_type },
    ],
    [
      { label: 'Size', value: size },
      { label: 'Thickness', value: thickness },
    ],
    [
      { label: 'Thickness (in)', value: thickness_in },
      { label: 'Sqft/Pallet', value: sqft_pallet },
    ],
    [
      { label: 'Sqft/Layer', value: sqft_layer },
      { label: 'Lnft/Pallet', value: lnft_pallet },
    ],
    [
      { label: 'Layer/Pallet', value: layer_pallet },
      { label: 'Pcs/Pallet', value: pcs_pallet },
    ],
    [
      { label: 'Colors Available', value: colors_available.join(', ') },
      { label: 'Thicknesses Available', value: thicknesses_available.join(', ') },
    ],
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Product name and brand logo header */}
      <div className="hidden md:flex justify-between items-center p-3 md:p-5 pb-2 md:pb-3">
        <div className="flex flex-col justify-center flex-1 min-w-0 mr-3">
          <h2 className="text-xl md:text-2xl font-bold text-black leading-tight truncate">{product_name}</h2>
          <span className="hidden md:block text-base font-semibold mt-0.5 truncate" style={{ color: brandColor }}>{brand}</span>
        </div>
        <div className="flex-shrink-0">
          <BrandLogo brand={brand} size="lg" />
        </div>
      </div>

      {/* Product data collapsible section with scrolling */}
      <div className="flex-1 overflow-y-auto px-2 ">
        <div className="space-y-2">
          {/* Product Data Section */}
          <AccordionSection
            title="Product Data"
            open={openSection === 'data'}
            onClick={() => setOpenSection(openSection === 'data' ? null : 'data')}
          >
            <table className="w-full border-collapse">
              <tbody>
                {pairs.map((pair, index) => (
                  <tr key={index} className="border-b border-gray-200 last:border-b-0">
                    {pair.map((item, itemIndex) => (
                      <React.Fragment key={itemIndex}>
                        <td className="py-1.5 pr-4 font-medium text-red-600 text-xs md:text-sm">
                          {item.label}
                        </td>
                        <td className="py-1.5 text-gray-900 text-xs md:text-sm">
                          {item.value}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </AccordionSection>

          {/* Description Section */}
          <AccordionSection
            title="Description"
            open={openSection === 'desc'}
            onClick={() => setOpenSection(openSection === 'desc' ? null : 'desc')}
          >
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{product_note}</p>
          </AccordionSection>

          {/* Resources Section */}
          <AccordionSection
            title="Resources"
            open={openSection === 'resources'}
            onClick={() => setOpenSection(openSection === 'resources' ? null : 'resources')}
          >
            <p className="text-xs md:text-sm text-gray-700 leading-relaxed">Downloadable resources coming soon...</p>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailDataSection; 
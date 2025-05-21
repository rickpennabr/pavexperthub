// ============================================================================
// ProductDetailDataSection Component
// Displays detailed product information in a collapsible section
// Features: Product name, brand logo, description, and specifications table
// ============================================================================

import React, { useState } from 'react';
import BrandLogo from './BrandsCardLogo';
import { ChevronDown } from 'lucide-react';

// Component props interface
interface ProductDetailDataSectionProps {
  product_name: string;
  brand: string;
  product_type: string;
  color: string;
  size: string;
  thickness: string;
  thickness_in: number;
  sqft_pallet: number;
  sqft_layer: number;
  lnft_pallet: number;
  layer_pallet: number;
  pcs_pallet: number;
  product_note: string;
  colors_available: string[];
  thicknesses_available: string[];
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
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

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
          <span className="hidden md:block text-base font-semibold text-gray-700 mt-0.5 truncate">{brand}</span>
        </div>
        <div className="flex-shrink-0">
          <BrandLogo brand={brand} size="lg" />
        </div>
      </div>
      
      {/* Product data collapsible section with scrolling */}
      <div className="flex-1 overflow-y-auto px-2 ">
        <div className="space-y-2">
          {/* Product Data Section */}
          <div>
            <button 
              className="mx-auto w-full flex items-center justify-between px-3 py-1   bg-black text-white font-medium md:text-base"
              onClick={() => setIsSpecsOpen(!isSpecsOpen)}
            >
              <span>Product Data</span>
              <ChevronDown 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform ${isSpecsOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {/* Specifications table */}
            {isSpecsOpen && (
              <div className="p-3 md:p-4 border border-t-0 border-gray-200 mx-auto md:w-full">
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
              </div>
            )}
          </div>

          {/* Description Section */}
          <div>
            <button 
              className="w-full flex items-center justify-between px-3 py-1 md:px-4 md:py-2 bg-black text-white font-medium md:text-base"
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            >
              <span>Description</span>
              <ChevronDown 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform ${isDescriptionOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {/* Description content */}
            {isDescriptionOpen && (
              <div className="p-3 md:p-4 border border-t-0 border-gray-200 mx-auto md:w-full">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{product_note}</p>
              </div>
            )}
          </div>

          {/* Resources Section */}
          <div>
            <button 
              className="w-full flex items-center justify-between px-3 py-1  md:py-2 bg-black text-white font-medium md:text-base"
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
            >
              <span>Resources</span>
              <ChevronDown 
                className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {/* Resources content */}
            {isResourcesOpen && (
              <div className="p-3 md:p-4 border border-t-0 border-gray-200 mx-auto md:w-full">
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">Downloadable resources coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailDataSection; 
// ============================================================================
// ProductGridItem Component
// Renders a single product card in either grid or list view mode
// ============================================================================

// Dependencies
import React from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import ProductPlaceholder from '../custom/productspage/product-grid-item/ProductPlaceholder';
import BrandLogo from '../custom/productspage/product-grid-item/BrandLogo';
import Image from 'next/image';

// Component props interface
interface ProductGridItemProps {
  product: Product;
  viewMode: 'grid' | 'list';
}

const brandColors: Record<string, string> = {
  belgard: '#1A3057',
  keystone: '#005596',
  'las vegas paver': '#842B38',
  lvp: '#842B38',
  default: '#000000'
};

const ProductGridItem: React.FC<ProductGridItemProps> = ({ product, viewMode }) => {
  // Get brand color
  const getBrandColor = () => {
    const normalized = product.brand.toLowerCase();
    if (normalized.includes('belgard')) return brandColors.belgard;
    if (normalized.includes('keystone')) return brandColors.keystone;
    if (normalized.includes('las vegas') || normalized.includes('lvp')) return brandColors['las vegas paver'];
    return brandColors.default;
  };

  const brandColor = getBrandColor();

  return (
    // Card container with hover effects and responsive layout
    <Link
      href={`/products/${product.product_id}`}
      className={`bg-white rounded-lg overflow-hidden cursor-pointer group relative
        ${viewMode === 'list' 
          ? 'flex flex-row h-[110px] min-h-0 hover:scale-[1.01] shadow-[6px_6px_12px_rgba(0,0,0,0.2)]' 
          : 'flex flex-col h-full min-h-0 hover:scale-[1.01] shadow-[6px_6px_12px_rgba(0,0,0,0.2)]'
        }
        transition-all duration-300
      `}
    >
      {/* Product image section with placeholder */}
      <div className={`${
        viewMode === 'list' 
          ? 'w-[30%] flex-shrink-0 h-full flex items-center justify-center' 
          : 'w-full aspect-[2/1.5] max-h-[220px] flex items-center justify-center'
      } bg-gray-100 relative overflow-hidden`}>
        {product.product_image_thumbnail && product.product_image_thumbnail.startsWith('/') ? (
          <Image
            src={product.product_image_thumbnail}
            alt={product.product_name}
            fill
            className="object-cover object-center rounded-md"
            sizes={viewMode === 'list' ? '30vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        ) : (
          <div className={`${viewMode === 'list' ? 'flex items-center justify-center h-full' : ''}`}>
            <ProductPlaceholder 
              text="Image Coming Soon..."
              width={viewMode === 'list' ? 110 : 200}
              height={viewMode === 'list' ? 80 : 150}
              backgroundColor="#f3f4f6"
              textColor="#6b7280"
              isListMode={viewMode === 'list'}
            />
          </div>
        )}
      </div>

      {/* Product details container */}
      <div className={`flex-1 flex flex-col ${viewMode === 'list' ? 'pl-1' : ''}`}>
        {/* Product name and brand logo header */}
        <div className={`flex justify-between items-center w-full ${viewMode === 'list' ? 'gap-1 py-1 pr-2' : 'gap-1 px-2 pr-3 pt-2 pb-1'}`}>
          <div className="flex flex-col justify-center">
            <h3
              className={`truncate font-bold transition-colors duration-300 text-lg text-black leading-tight`}
              title={product.product_name}
            >
              {product.product_name}
            </h3>
            <span className="text-[11px] md:text-[13px] font-semibold" style={{ color: brandColor }}>{product.brand}</span>
          </div>
          <div className={`flex-shrink-0 flex items-center justify-center ${viewMode === 'list' ? '-ml-4' : 'ml-2'}`}>
            <BrandLogo brand={product.brand} size="sm" />
          </div>
        </div>

        {/* Product specifications table */}
        <div className={`flex-1 ${viewMode === 'list' ? 'pr-2' : 'px-2'}`}>
          <table className={`w-full ${viewMode === 'grid' ? 'text-[11px] border-collapse table-fixed' : 'text-[10px] border-collapse table-fixed'}`}>
            <tbody>
              {/* Brand and Color specifications */}
              <tr>
                <td className="font-bold text-red-600 px-0.5 py-0.5 w-[52px] whitespace-nowrap text-left border border-gray-100" title="Brand">Brand</td>
                <td className={`text-black px-0.5 py-0.5 w-[60px] truncate ${product.brand.length > 10 ? 'text-left' : 'text-center'} border border-gray-100`} title={product.brand}>{product.brand}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 w-[52px] whitespace-nowrap text-left border border-gray-100" title="Color">Color</td>
                <td className={`text-black px-0.5 py-0.5 w-[60px] truncate ${product.color.length > 10 ? 'text-left' : 'text-center'} border border-gray-100`} title={product.color}>{product.color}</td>
              </tr>
              {/* Size and Thickness specifications */}
              <tr>
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left border border-gray-100" title="Size">Size</td>
                <td className={`text-black px-0.5 py-0.5 truncate ${product.size.length > 10 ? 'text-left' : 'text-center'} border border-gray-100`} title={product.size}>{product.size}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left border border-gray-100" title="Thickness">Thick</td>
                <td className={`text-black px-0.5 py-0.5 truncate ${product.thickness.length > 10 ? 'text-left' : 'text-center'} border border-gray-100`} title={product.thickness}>{product.thickness}</td>
              </tr>
              {/* Coverage specifications */}
              <tr>
                <td className="font-bold text-red-600 px-0.5 py-0.5 w-[52px] whitespace-nowrap text-left text-[9px] border border-gray-100" title="Sqft/Pallet">Sqft/Pallet</td>
                <td className="text-black px-0.5 py-0.5 w-[60px] truncate text-center border border-gray-100" title={String(product.sqft_pallet)}>{product.sqft_pallet}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 w-[52px] whitespace-nowrap text-left text-[9px] border border-gray-100" title="Sqft/Layer">Sqft/Layer</td>
                <td className={`text-black px-0.5 py-0.5 w-[60px] truncate text-center border border-gray-100 ${viewMode === 'list' ? '' : ''}`} title={String(product.sqft_layer)}>{product.sqft_layer}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Link>
  );
};

export default ProductGridItem; 
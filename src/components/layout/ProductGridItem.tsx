// ============================================================================
// ProductGridItem Component
// Renders a single product card in either grid or list view mode
// ============================================================================

// Dependencies
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/data/products';
import { ProductWithDetails } from '@/services/productService';
import ProductPlaceholder from '../custom/products-page/product-grid-item/ProductPlaceholder';
import BrandLogo from '../custom/products-page/product-grid-item/BrandLogo';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { isRealImagePath, getImagePath } from '@/components/custom/products-page/product-detail-image/utils';

// Component props interface
interface ProductGridItemProps {
  product: Product | ProductWithDetails;
  supabaseProduct?: ProductWithDetails;
  viewMode: 'grid' | 'list';
}

// Add interface for the product data from Supabase
interface ProductData {
  id: string;
  brand?: {
    brand_name: string;
  };
  color?: {
    color_name: string;
  };
  size?: {
    size_name: string;
  };
  thickness?: {
    thickness_mm: string;
    thickness_in: string;
  };
  product_type?: {
    product_type_name: string;
  };
}

const brandColors: Record<string, string> = {
  belgard: '#1A3057',
  keystone: '#005596',
  'las vegas paver': '#842B38',
  lvp: '#842B38',
  default: '#000000'
};

const ProductGridItem: React.FC<ProductGridItemProps> = ({ product, supabaseProduct, viewMode }) => {
  // Get brand color
  const getBrandColor = () => {
    const brandName = supabaseProduct?.brand?.brand_name || (product as Product).brand || '';
    const normalized = brandName.toLowerCase();
    if (normalized.includes('belgard')) return brandColors.belgard;
    if (normalized.includes('keystone')) return brandColors.keystone;
    if (normalized.includes('las vegas') || normalized.includes('lvp')) return brandColors['las vegas paver'];
    return brandColors.default;
  };

  const brandColor = getBrandColor();
  const brandName = supabaseProduct?.brand?.brand_name || (product as Product).brand || '';
  const productName = supabaseProduct?.product_name || (product as Product).product_name || '';
  const productId = (product as ProductWithDetails).base_product_id || (product as Product).product_id || '';
  
  // Get the first variant for display
  const firstVariant = supabaseProduct?.variants?.[0];
  const color = firstVariant?.color?.color_name || (product as Product).color || '';
  const size = firstVariant?.size || (product as Product).size || '';
  const thickness_mm = firstVariant?.thickness?.thickness_mm || (product as Product).thickness || '';
  const thickness_in = firstVariant?.thickness?.thickness_in || '';
  const sqftPallet = firstVariant?.sqft_pallet || (product as Product).sqft_pallet || 0;
  const sqftLayer = firstVariant?.sqft_layer || (product as Product).sqft_layer || 0;

  // Get the first variant's image or use the product's thumbnail
  const imagePath = (firstVariant?.images?.[0]?.image_path || (product as Product).product_image_thumbnail || '');

  // Standard color state
  const [standardColor, setStandardColor] = useState<string>("");
  const [productData, setProductData] = useState<ProductData | null>(null);

  useEffect(() => {
    const fetchStandardColor = async () => {
      const baseProductId = (supabaseProduct?.base_product_id || (product as Product).product_id || '');
      if (!baseProductId) return;
      const { data } = await supabase
        .from('product_variants')
        .select('color:color_id(color_id, color_name)')
        .eq('base_product_id', baseProductId)
        .limit(1);
      if (data && data.length > 0) {
        const color = data[0].color;
        const colorName = Array.isArray(color) ? (color[0] as { color_name: string })?.color_name : (color as { color_name: string })?.color_name;
        if (colorName) setStandardColor(colorName);
      }
    };
    fetchStandardColor();
  }, [supabaseProduct, product]);

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(brand_name),
          color:colors(color_name),
          size:sizes(size_name),
          thickness:thicknesses(thickness_mm, thickness_in),
          product_type:product_types(product_type_name)
        `)
        .eq('id', productId)
        .single();
      
      if (data) {
        setProductData(data as ProductData);
      }
    };
    fetchProductData();
  }, [productId]);

  if (!productData && !supabaseProduct) {
    return null;
  }

  return (
    // Card container with hover effects and responsive layout
    <Link
      href={`/products/${productId}`}
      className={`bg-white border border-black rounded-xl overflow-hidden cursor-pointer group relative
        ${viewMode === 'list' 
          ? 'flex flex-row h-[120px] min-h-0 hover:scale-[1.01] shadow-md' 
          : 'flex flex-col h-full min-h-0 hover:scale-[1.01] shadow-md'
        }
        transition-all duration-300
      `}
    >
      {/* Product image section with placeholder */}
      <div className={`${
        viewMode === 'list' 
          ? 'w-[30%] flex-shrink-0 h-full flex items-center justify-center' 
          : 'w-full aspect-[2/1.5] max-h-[260px] flex items-center justify-center'
      } bg-gray-100 relative overflow-hidden`}>
        {isRealImagePath(imagePath) ? (
          <Image
            src={getImagePath(imagePath)}
            alt={productName}
            fill
            className="object-cover object-center rounded-t-xl"
            sizes={viewMode === 'list' ? '30vw' : '(max-width: 768px) 100vw, 33vw'}
            priority
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center`}> 
            <ProductPlaceholder 
              text="Image Coming Soon..."
              width={viewMode === 'list' ? 110 : 200}
              height={viewMode === 'list' ? 50 : 60}
              backgroundColor="#f3f4f6"
              textColor="#6b7280"
              isListMode={viewMode === 'list'}
            />
          </div>
        )}
      </div>

      {/* Product details container */}
      <div className={`flex-1 flex flex-col ${viewMode === 'list' ? 'pl-1' : ''} pb-1`}>
        {/* Product name and brand logo header */}
        <div className={`flex justify-between items-center w-full ${viewMode === 'list' ? 'gap-1 py-1 pr-3' : 'gap-1 px-2 pr-3 pt-2 pb-1'}`}>
          <div className="flex flex-col justify-center min-w-0">
            <h3
              className={`truncate font-bold transition-colors duration-300 ${viewMode === 'list' ? 'text-[15px]' : 'text-lg md:text-base'} text-black leading-tight`}
              title={productName}
            >
              {productName}
            </h3>
            <span className="text-[11px] md:text-[12px] font-semibold" style={{ color: brandColor }}>{brandName}</span>
          </div>
          <div className={`flex-shrink-0 flex items-center justify-center ${viewMode === 'list' ? 'ml-2' : 'ml-2'}`}>
            <BrandLogo brand={brandName} size="sm" />
          </div>
        </div>

        {/* Divider line between header and table */}
        <div className="w-full h-2 bg-gradient-to-b from-black/10 to-transparent " />

        {/* Product specifications table - compact, 3 rows */}
        <div className={`flex-1 ${viewMode === 'list' ? 'pr-2' : 'px-2'}${viewMode === 'list' ? ' pb-[2px]' : ''}`}>
          <table className={`w-full ${viewMode === 'list' ? 'text-[11px]' : 'text-[12px]'} border-collapse table-fixed pb-[2px] ${viewMode === 'list' ? 'max-w-full' : ''}`}>
            <tbody>
              <tr className="border-b border-gray-200 last:border-b-0">
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Color">Color</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={standardColor || color}>{standardColor || color}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Size">Size</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={size}>{size}</td>
              </tr>
              <tr className="border-b border-gray-200 last:border-b-0">
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Thick">Thick</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={thickness_mm}>{thickness_mm}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left text-[11px] border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Thick(in)">Thick(in)</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={thickness_in}>{thickness_in}</td>
              </tr>
              <tr className="border-b border-gray-200 last:border-b-0">
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left text-[11px] border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Sqft/Layer">Sqft/Layer</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={String(sqftLayer)}>{sqftLayer}</td>
                <td className="font-bold text-red-600 px-0.5 py-0.5 whitespace-nowrap text-left text-[11px] border-r border-gray-200 last:border-r-0 min-w-[70px]" title="Sqft/Pallet">Sqft/Pallet</td>
                <td className="text-black px-0.5 py-0.5 truncate text-center border-r border-gray-200 last:border-r-0" title={String(sqftPallet)}>{sqftPallet}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Link>
  );
};

export default ProductGridItem;
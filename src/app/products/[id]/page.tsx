'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getProductById } from '@/services/productService';
import type { ProductWithDetails } from '@/services/productService';
import ProductDetailImageSection from '@/components/custom/products-page/product-detail-image/ProductDetailImageSection';
import ProductDetailDataSection from '@/components/custom/products-page/ProductDetailDataSection';

interface PageParams {
  id: string;
}

class ProductErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading the product.</div>;
    }

    return this.props.children;
  }
}

function ProductDetailContent({ params }: { params: Promise<PageParams> }) {
  const [supabaseProduct, setSupabaseProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const resolvedParams = React.use(params);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(resolvedParams.id);
        if (response.error) {
          setError(response.error);
          return;
        }
        setSupabaseProduct(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !supabaseProduct) {
    return <div>Error: {error || 'Product not found'}</div>;
  }

  // Get the first variant for display
  const firstVariant = supabaseProduct.variants?.[0];
  const productName = supabaseProduct.product_name;
  const brandName = supabaseProduct.brand?.brand_name || '';
  const color = firstVariant?.color?.color_name || '';
  const size = firstVariant?.size || '';
  const thickness = firstVariant?.thickness?.thickness_mm || '';
  const thicknessIn = firstVariant?.thickness?.thickness_in || '';
  const sqftPallet = firstVariant?.sqft_pallet || 0;
  const sqftLayer = firstVariant?.sqft_layer || 0;
  const lnftPallet = firstVariant?.lnft_pallet || 0;
  const layerPallet = firstVariant?.layer_pallet || 0;
  const pcsPallet = firstVariant?.pcs_pallet || 0;

  // Get all color variant images
  const colorVariantImages = supabaseProduct.variants?.flatMap(variant => 
    variant.images?.map(img => img.image_path) || []
  ) || [];
  const mainImage = colorVariantImages[0] || '';

  return (
    <div className="mx-auto p-2">
      <Link 
        href="/products"
        className="inline-flex items-center text-white hover:text-gray-200 md:mb-4 mb-3"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full h-full">
        {/* Container with fixed height */}
        <div className="flex flex-col md:flex-row h-full md:h-[500px]">
          {/* Image section - fixed height */}
          <div className="w-full md:w-[45%] md:min-w-[45%] bg-gray-50 h-full">
            <ProductDetailImageSection
              mainImage={mainImage}
              projectImages={[]}
              colorImages={colorVariantImages}
              productName={productName}
              brand={brandName}
            />
          </div>

          {/* Data section - scrollable */}
          <div className="w-full md:w-[55%] h-full">
            <ProductDetailDataSection
              product_name={productName}
              brand={brandName}
              product_type={supabaseProduct.product_type}
              color={color}
              size={size}
              thickness={thickness}
              thickness_in={thicknessIn}
              sqft_pallet={sqftPallet}
              sqft_layer={sqftLayer}
              lnft_pallet={lnftPallet}
              layer_pallet={layerPallet}
              pcs_pallet={pcsPallet}
              product_note={supabaseProduct.product_note}
              colors_available={Array.from(new Set(
                supabaseProduct.variants
                  ?.map(v => v.color?.color_name)
                  .filter((name): name is string => !!name)
              ))}
              thicknesses_available={Array.from(new Set(
                supabaseProduct.variants
                  ?.map(v => v.thickness?.thickness_mm)
                  .filter((thickness): thickness is string => !!thickness)
              ))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<PageParams> }) {
  return (
    <ProductErrorBoundary>
      <ProductDetailContent params={params} />
    </ProductErrorBoundary>
  );
} 
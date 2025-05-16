'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductDetailImageSection from '@/components/custom/productspage/product-detail-image/ProductDetailImageSection';
import ProductDetailDataSection from '@/components/custom/productspage/ProductDetailDataSection';
import { products } from '@/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  // Find the product by ID from the products array
  const product = products.find(p => p.product_id === productId);

  // Fallback if product not found
  const fallbackProduct = {
    product_id: productId,
    product_name: "Product Not Found",
    brand: "Unknown",
    product_type: "Unknown",
    color: "Unknown",
    size: "Unknown",
    thickness: "Unknown",
    thickness_in: 0,
    sqft_pallet: 0,
    sqft_layer: 0,
    lnft_pallet: 0,
    layer_pallet: 0,
    pcs_pallet: 0,
    product_note: 'Product information not available.',
    colors_available: [],
    thicknesses_available: [],
    product_image_thumbnail: "Unknown Product",
    product_project_images: [],
    product_color_images: []
  };

  // Use product data if found, otherwise fallback
  const productData = product || fallbackProduct;

  return (
    <div className="mx-auto p-2">
      {/* Back Button */}
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-[1000px] mx-auto">
        {/* Container with fixed height */}
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Image section - fixed height */}
          <div className="w-full md:w-[45%] md:min-w-[45%] bg-gray-50 h-full">
            <ProductDetailImageSection
              mainImage={productData.product_image_thumbnail}
              projectImages={productData.product_project_images || []}
              colorImages={productData.product_color_images || []}
            />
          </div>
          
          {/* Product Data Section - scrollable */}
          <div className="w-full md:w-[55%] h-full overflow-y-auto">
            <ProductDetailDataSection
              product_name={productData.product_name}
              brand={productData.brand}
              product_type={productData.product_type}
              color={productData.color}
              size={productData.size}
              thickness={productData.thickness}
              thickness_in={productData.thickness_in}
              sqft_pallet={productData.sqft_pallet}
              sqft_layer={productData.sqft_layer}
              lnft_pallet={productData.lnft_pallet}
              layer_pallet={productData.layer_pallet}
              pcs_pallet={productData.pcs_pallet}
              product_note={productData.product_note}
              colors_available={productData.colors_available}
              thicknesses_available={productData.thicknesses_available}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
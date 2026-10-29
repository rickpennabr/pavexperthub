'use client';

import React, { useState, useEffect, useMemo } from 'react';
import ProductGridItem from '@/components/layout/ProductGridItem';
import { getProducts } from '@/services/productService';
import Pagination from '@/components/custom/products-page/Pagination';
import { ProductWithDetails } from '@/services/productService';
import { useFilters } from '@/context/filter-context';
import { variantMatchesFilters } from '@/lib/product-filters';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { viewMode, searchText, filters } = useFilters();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getProducts();
        if (result.error) {
          throw new Error(result.error);
        }
        if (result.data) {
          setProducts(result.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = useMemo(() => {
    const search = searchText.trim().toLowerCase();
    return products.filter((product) => {
      if (filters.brand && (product.brand?.brand_name || '').toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }
      if (filters.type && (product.product_type || '').toLowerCase() !== filters.type.toLowerCase()) {
        return false;
      }
      if (
        (filters.color || filters.thickness) &&
        !(product.variants || []).some((variant) => variantMatchesFilters(variant, filters))
      ) {
        return false;
      }
      if (!search) return true;
      const variantText = (product.variants || [])
        .map((variant) =>
          [variant.color?.color_name, variant.size, variant.thickness?.thickness_mm, variant.thickness?.thickness_in]
            .filter(Boolean)
            .join(' '),
        )
        .join(' ')
        .toLowerCase();
      return [product.product_name, product.brand?.brand_name, product.product_type, variantText]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });
  }, [products, searchText, filters]);

  const itemsPerPage = 18;
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const safePage = Math.min(currentPage, pageCount);
  const startIndex = (safePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-8 h-8 bg-red-500 animate-spin rotate-45 rounded-sm shadow-lg border-2 border-white"></div>
          <p className="mt-2 text-white">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-2">
      <div className="w-full">
        {/* Products Grid/List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {currentProducts.length === 0 ? (
            <div className="col-span-full py-12 text-center text-lg text-gray-400">
              No products match these filters.
            </div>
          ) : (
            currentProducts.map((product) => (
              <ProductGridItem
                key={product.base_product_id}
                product={product}
                supabaseProduct={product}
                viewMode={viewMode}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > itemsPerPage && (
          <div className="mt-8">
            <Pagination
              currentPage={safePage}
              totalPages={pageCount}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Total Products Count */}
        <div className="text-center text-gray-600 mt-4">
          {filteredProducts.length === 0
            ? 'Showing 0 products'
            : `Showing ${startIndex + 1}-${Math.min(endIndex, filteredProducts.length)} of ${filteredProducts.length} products`}
        </div>
      </div>
    </div>
  );
} 




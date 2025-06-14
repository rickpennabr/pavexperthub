'use client';

import React, { useState, useEffect } from 'react';
import ProductGridItem from '@/components/layout/ProductGridItem';
import { getProducts } from '@/services/productService';
import Pagination from '@/components/custom/products-page/Pagination';
import { ProductWithDetails } from '@/services/productService';
import { useFilters } from '@/context/filter-context';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { viewMode, searchText } = useFilters();

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
          setTotalPages(Math.ceil(result.data.length / 18));
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

  // Filter products by searchText before pagination
  const filteredProducts = products.filter((product) => {
    const name = product.product_name?.toLowerCase() || '';
    const brand = product.brand?.brand_name?.toLowerCase() || '';
    const variant = product.variants?.[0];
    const color = variant?.color?.color_name?.toLowerCase() || '';
    const size = variant?.size?.toLowerCase() || '';
    const search = searchText?.toLowerCase() || '';
    return (
      name.includes(search) ||
      brand.includes(search) ||
      color.includes(search) ||
      size.includes(search)
    );
  });

  const itemsPerPage = 18;
  const startIndex = (currentPage - 1) * itemsPerPage;
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
          {currentProducts.map((product) => (
            <ProductGridItem
              key={product.base_product_id}
              product={product}
              supabaseProduct={product}
              viewMode={viewMode}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Total Products Count */}
        <div className="text-center text-gray-600 mt-4">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>
    </div>
  );
} 




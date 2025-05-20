'use client';

import React from 'react';
import { Supplier } from '@/types/supplier';
import { ChevronRight } from 'lucide-react';

interface SupplierListProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSupplierSelect: (supplier: Supplier) => void;
  hasMore: boolean;
  onLoadMore: () => void;
}

const SupplierList = ({
  suppliers,
  selectedSupplier,
  onSupplierSelect,
  hasMore,
  onLoadMore,
}: SupplierListProps) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-2">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            onClick={() => onSupplierSelect(supplier)}
            className={`p-4 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.01] transition-all duration-300
              ${
                selectedSupplier?.id === supplier.id
                  ? 'bg-white border-2 border-black text-black md:bg-black md:text-white'
                  : 'bg-white text-black md:bg-black md:text-white hover:bg-gray-50 md:hover:bg-gray-800 hover:border-2 hover:border-black'
              }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {/* Container for Logo and Supplier Name */}
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    {/* Diamond Logo with Initial */}
                    <div className={`w-5 h-5 flex items-center justify-center transform rotate-45 border-2 ${
                      selectedSupplier?.id === supplier.id
                        ? 'border-black bg-white md:border-white md:bg-black'
                        : 'border-black bg-white md:border-white md:bg-black'
                    }`} style={{ aspectRatio: '1/1' }}>
                      <span className={`-rotate-45 text-xs font-bold ${
                        selectedSupplier?.id === supplier.id
                          ? 'text-black md:text-white'
                          : 'text-black md:text-white'
                      }`}>
                        {supplier.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-semibold">{supplier.name}</h3>
                  </div>
                  <p className="text-sm opacity-80">{supplier.address}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {supplier.types.map((type) => (
                      <span 
                        key={type}
                        className={`text-xs px-2 py-1 rounded-md transition-colors duration-300 ${
                          selectedSupplier?.id === supplier.id
                            ? 'bg-black text-white md:bg-white md:text-black'
                            : 'bg-black text-white md:bg-white md:text-black'
                        }`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 flex-shrink-0 ${
                selectedSupplier?.id === supplier.id
                  ? 'text-black md:text-white'
                  : 'text-black md:text-white'
              }`} />
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={onLoadMore}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplierList; 
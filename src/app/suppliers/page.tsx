"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, List, Phone, Globe } from 'lucide-react';
import { Supplier } from '@/types/supplier';
import SearchBarCleaner from '@/components/common/SearchBarCleaner';
import { getSuppliers } from '@/services/supabaseService';

export default function SuppliersPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch suppliers from Supabase
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await getSuppliers(searchText);
        setSuppliers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch suppliers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [searchText]);

  const handleClear = () => {
    if (searchText) {
      setSearchText("");
      inputRef.current?.focus();
    }
  };

  const toggleView = () => {
    setActiveTab(activeTab === 'list' ? 'map' : 'list');
    if (activeTab === 'list' && suppliers.length > 0) {
      setSelectedSupplier(suppliers[0]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-8rem)] bg-black md:bg-white">
      {/* Left: Supplier List */}
      <div className="md:w-[30%] w-full bg-black md:bg-white border-r border-gray-200 flex flex-col">       
        {/* Search Container */}
        <div className="p-2 bg-white border-b border-black">
          {/* Search Bar and Map Button Container */}
          <div className="flex gap-2">
            {/* Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-red-500 stroke-2" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search suppliers by name, ID, or address..."
                className="w-full h-10 pl-10 pr-10 text-base border-2 border-red-500 rounded-md focus:outline-none focus:border-red-600"
                style={{ height: '40px', maxHeight: '40px', minHeight: '40px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && <SearchBarCleaner onClear={handleClear} />}
            </div>

            {/* Mobile View Toggle Button - Only visible on mobile */}
            <button
              type="button"
              className="md:hidden flex items-center gap-0.5 px-3 h-10 border-2 border-red-500 rounded-md transition-all duration-300 bg-black text-white hover:bg-white hover:text-black"
              onClick={toggleView}
            >
              {activeTab === 'list' ? (
                <>
                  <MapPin className="h-5 w-5" />
                  <span className="text-sm font-medium">Map</span>
                </>
              ) : (
                <>
                  <List className="h-5 w-5" />
                  <span className="text-sm font-medium">List</span>
                </>
              )}
            </button>           
          </div>
        </div>
        
        {/* Suppliers List - Hidden on mobile when Map tab is selected */}
        <div className={`flex-1 overflow-y-auto p-2 lg:p-3 ${activeTab === 'map' ? 'hidden md:block' : 'block'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading suppliers...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
            </div>
          ) : suppliers.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              <p>No suppliers found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={`p-4 rounded-lg overflow-hidden cursor-pointer hover:scale-[1.01] transition-all duration-300
                    ${
                      selectedSupplier?.id === supplier.id
                        ? 'bg-white border-2 border-black text-black md:bg-black md:text-white'
                        : 'bg-white text-black md:bg-black md:text-white hover:bg-gray-50 md:hover:bg-gray-800 hover:border-2 hover:border-black'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <p className="text-sm text-gray-600 md:text-gray-400">{supplier.address}</p>
                      <div className="mt-2 space-y-1">
                        {supplier.phone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${supplier.phone}`} className="hover:underline">
                              {supplier.phone}
                            </a>
                          </div>
                        )}
                        {supplier.website && (
                          <div className="flex items-center gap-2 text-sm">
                            <Globe className="h-4 w-4" />
                            <a 
                              href={supplier.website.startsWith('http') ? supplier.website : `https://${supplier.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {supplier.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Right: Map Container - Hidden on mobile when Suppliers List tab is selected */}
      <div className={`md:w-[70%] w-full h-full bg-black md:bg-white flex items-center justify-center relative ${activeTab === 'list' ? 'hidden md:flex' : 'flex'}`}>
        <div className="text-center absolute inset-0 flex items-center justify-center">
          <div>
            <h2 className="text-4xl font-bold text-red-600 mb-3">Map View</h2>
            <p className="text-2xl text-red-500">Coming Soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
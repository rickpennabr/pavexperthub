"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, List } from 'lucide-react';
import SearchBarCleaner from '@/components/common/SearchBarCleaner';
import { useFilters } from "@/context/filter-context";
import { SupplierCard } from '@/components/custom/suppliers-page/SupplierCard';
import { TransformedBranch, BrandLogo } from '@/types/supplier';

export default function SuppliersPage() {
  const { searchText, setSearchText } = useFilters();
  const [selectedBranch, setSelectedBranch] = useState<TransformedBranch | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const [branches, setBranches] = useState<TransformedBranch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        console.log('Fetching branches from API...');
        const response = await fetch('/api/suppliers');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch branches');
        }

        console.log('API Response:', JSON.stringify(data, null, 2));

        // Transform the data to include full storage URLs for logos
        const branchesWithLogoUrls = data.map((branch: TransformedBranch) => {
          console.log('Processing branch:', branch.cross_street);
          console.log('Supplier:', branch.supplier);
          
          const transformedBranch = {
            ...branch,
            supplier: {
              ...branch.supplier,
              brand_logos: branch.supplier.brand_logos?.map((logo: BrandLogo) => {
                // Log the raw logo_url before transformation
                console.log('Raw logo_url for', branch.supplier.supplier_name, ':', logo.logo_url);
                
                // Only add the prefix if it's not already a full URL
                let logoUrl;
                if (logo.logo_url.startsWith('http')) {
                  logoUrl = logo.logo_url;
                } else {
                  // Remove any leading slashes from the logo_url
                  const cleanLogoUrl = logo.logo_url.replace(/^\/+/, '');
                  // Use the correct bucket name: brands-logo
                  logoUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/brands-logo/${cleanLogoUrl}`;
                  console.log('Constructed URL parts:', {
                    base: process.env.NEXT_PUBLIC_SUPABASE_URL,
                    bucket: 'brands-logo',
                    file: cleanLogoUrl,
                    full: logoUrl
                  });
                }
                
                console.log('Final logo URL for', branch.supplier.supplier_name, ':', logoUrl);
                return {
                  ...logo,
                  logo_url: logoUrl
                };
              })
            }
          };
          
          console.log('Transformed branch:', transformedBranch);
          return transformedBranch;
        });

        console.log('Final branches data:', JSON.stringify(branchesWithLogoUrls, null, 2));
        setBranches(branchesWithLogoUrls);
        setError(null);
      } catch (err) {
        console.error('Error fetching branches:', err);
        setError('Failed to load branches. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleClear = () => {
    setSearchText('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleView = () => {
    setActiveTab(activeTab === 'list' ? 'map' : 'list');
    if (activeTab === 'list' && branches.length > 0) {
      setSelectedBranch(branches[0]);
    }
  };

  const filteredBranches = branches
    .sort((a, b) => a.branch_name.localeCompare(b.branch_name))
    .filter(branch => {
      const search = searchText.toLowerCase();
      const supplierNameMatch = branch.supplier.supplier_name.toLowerCase().includes(search);
      const crossStreetMatch = branch.cross_street.toLowerCase().includes(search);
      const branchNameMatch = branch.branch_name.toLowerCase().includes(search);
      const materialMatch = branch.supplier.materials && branch.supplier.materials.some(
        (mat) => mat.material_name.toLowerCase().includes(search)
      );
      return supplierNameMatch || crossStreetMatch || branchNameMatch || materialMatch;
    });

  return (
    <div className="flex flex-col md:flex-row w-full bg-black md:bg-white h-screen">
      {/* Left: Branch List */}
      <div className="md:w-[30%] w-full bg-black md:bg-white border-r border-gray-200 flex flex-col h-full">       
        {/* Search Container */}
        <div className="bg-white border-b border-black rounded-[10px] py-2 md:rounded-none px-2 md:px-1">
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
                placeholder="Find all Suppliers and Materials."
                className="w-full h-10 pl-8 pr-2 text-base border-2 border-red-500 rounded-md focus:outline-none focus:border-red-600 placeholder:text-base md:placeholder:text-xs"
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
        
        {/* Branches List - Hidden on mobile when Map tab is selected */}
        <div className={`flex-1 overflow-y-auto h-full pt-2 md:px-3 ${activeTab === 'map' ? 'hidden md:block' : 'block'}`}>
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mx-auto w-8 h-8 bg-red-500 animate-spin rotate-45 rounded-sm shadow-lg border-2 border-white"></div>
                <p className="mt-2 text-gray-600">Loading branches...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">
              <p>{error}</p>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center text-gray-500 p-4">
              <p>No branches found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBranches.map((branch) => (
                <SupplierCard
                  key={branch.id}
                  supplier={branch.supplier}
                  isSelected={selectedBranch?.id === branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  crossStreet={branch.cross_street}
                  phone={branch.phone}
                  address={branch.address}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Right: Map Container - Hidden on mobile when Branches List tab is selected */}
      {activeTab === 'map' && (
        <div className="md:w-[70%] w-full h-full bg-black md:bg-white flex items-center justify-center relative min-h-[200px]">
          <div className="text-center w-full flex flex-col items-center justify-center md:absolute md:inset-0">
            <h2 className="text-4xl font-bold text-red-600 mb-3">Map View</h2>
            <p className="text-2xl text-red-500">Coming Soon...</p>
          </div>
        </div>
      )}
      {activeTab === 'list' && (
        <div className="md:w-[70%] w-full h-full bg-black md:bg-white flex items-center justify-center relative min-h-[200px]">
          {/* You can put your list main area content here if needed */}
        </div>
      )}
    </div>
  );
} 
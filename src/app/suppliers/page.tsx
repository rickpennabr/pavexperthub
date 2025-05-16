"use client";

import React, { useState, useMemo, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import SupplierList from '@/components/custom/SupplierList';
import { Supplier } from '@/app/types/supplier';
import SearchBarCleaner from '@/components/common/SearchBarCleaner';

const suppliers = [
  // Vegas Stone Brokers first
  {
    id: '0',
    name: 'Vegas Stone Brokers',
    address: '8801 S Las Vegas Blvd, Las Vegas, NV 89123',
    lat: 36.1699,
    lng: -115.1398,
    types: ['Travertine', 'Porcelain', 'Pavers'],
    category: 'Stone Supplier',
    description: 'Premium stone and paver supplier'
  },
  // SiteOne Locations (Real addresses)
  {
    id: '1',
    name: 'SiteOne Landscape Supply',
    address: '6480 Cameron St, Las Vegas, NV 89118',
    lat: 36.0712,
    lng: -115.2248,
    types: ['Pavers', 'Retaining Walls', 'Landscaping Materials'],
    category: 'Landscape Supply',
    description: 'Full-service landscape supply company'
  },
  {
    id: '2',
    name: 'SiteOne Landscape Supply',
    address: '4175 W Sunset Rd, Las Vegas, NV 89118',
    lat: 36.0726,
    lng: -115.1804,
    types: ['Pavers', 'Retaining Walls', 'Landscaping Materials', 'Irrigation'],
    category: 'Landscape Supply',
    description: 'Full-service landscape supply company'
  },
  {
    id: '3',
    name: 'SiteOne Landscape Supply',
    address: '8125 W Sahara Ave #110, Las Vegas, NV 89117',
    lat: 36.1433,
    lng: -115.2643,
    types: ['Pavers', 'Retaining Walls', 'Landscaping Materials', 'Lighting'],
    category: 'Landscape Supply',
    description: 'Full-service landscape supply company'
  },
  // Star Nursery Locations
  {
    id: '4',
    name: 'Star Nursery - North Las Vegas',
    address: '3758 E Craig Rd, North Las Vegas, NV 89030',
    lat: 36.2397,
    lng: -115.1035,
    types: ['Plants', 'Trees', 'Garden Supplies'],
    category: 'Nursery',
    description: 'Local nursery and garden center'
  },
  {
    id: '5',
    name: 'Star Nursery - Rainbow',
    address: '8725 S Rainbow Blvd, Las Vegas, NV 89139',
    lat: 36.0314,
    lng: -115.2425,
    types: ['Plants', 'Trees', 'Garden Supplies'],
    category: 'Nursery',
    description: 'Local nursery and garden center'
  },
  {
    id: '6',
    name: 'Star Nursery - Eastern',
    address: '9270 S Eastern Ave, Las Vegas, NV 89123',
    lat: 36.0167,
    lng: -115.1191,
    types: ['Plants', 'Trees', 'Garden Supplies'],
    category: 'Nursery',
    description: 'Local nursery and garden center'
  },
  {
    id: '7',
    name: 'Star Nursery - Henderson',
    address: '10000 S Eastern Ave, Henderson, NV 89052',
    lat: 35.9984,
    lng: -115.1191,
    types: ['Plants', 'Trees', 'Garden Supplies'],
    category: 'Nursery',
    description: 'Local nursery and garden center'
  },
  {
    id: '8',
    name: 'Star Nursery - Blue Diamond',
    address: '5151 Blue Diamond Rd, Las Vegas, NV 89118',
    lat: 36.0156,
    lng: -115.2013,
    types: ['Plants', 'Trees', 'Garden Supplies'],
    category: 'Nursery',
    description: 'Local nursery and garden center'
  },
];

export default function SuppliersPage() {
  const [searchText, setSearchText] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suppliers based on search text
  const filteredSuppliers = useMemo(() => {
    if (!searchText) return suppliers;
    
    const searchLower = searchText.toLowerCase();
    return suppliers.filter(supplier => 
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.address.toLowerCase().includes(searchLower) ||
      supplier.types.some(type => type.toLowerCase().includes(searchLower))
    );
  }, [searchText]);

  const handleClear = () => {
    if (searchText) {
      setSearchText("");
      // Keep focus on input after clearing
      inputRef.current?.focus();
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
                placeholder="Find Suppliers and Materials..."
                className="w-full h-10 pl-10 pr-10 text-base border-2 border-red-500 rounded-md focus:outline-none focus:border-red-600"
                style={{ height: '40px', maxHeight: '40px', minHeight: '40px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              {searchText && <SearchBarCleaner onClear={handleClear} />}
            </div>

            {/* Map Button */}
            <button
              className={`flex items-center gap-0.5 px-3 h-10 border-2 border-red-500 rounded-md transition-all duration-300 ${
                activeTab === 'map' ? 'bg-white text-black' : 'bg-black text-white hover:bg-white hover:text-black'
              }`}
              onClick={() => {
                setActiveTab('map');
                setSelectedSupplier(suppliers[0]);
              }}
            >
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Map</span>
            </button>
          </div>
        </div>
        
        {/* Suppliers List - Hidden on mobile when Map tab is selected */}
        <div className={`flex-1 overflow-y-auto p-2 lg:p-3 ${activeTab === 'map' ? 'hidden md:block' : 'block'}`}>
          <SupplierList
            suppliers={filteredSuppliers}
            selectedSupplier={selectedSupplier}
            onSupplierSelect={setSelectedSupplier}
            hasMore={false}
            onLoadMore={() => {}}
          />
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
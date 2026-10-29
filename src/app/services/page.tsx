"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import { LayoutGrid, List } from "lucide-react";
import { useFilters } from "@/context/filter-context";
import { Service, getServices } from "@/services/serviceService";
import ProductPlaceholder from "@/components/custom/products-page/product-grid-item/ProductPlaceholder";

const PRICE_NOTE = "The price is for labor and thinset or gluing material only.";

function cardDescription(description: string) {
  const stripped = description
    .replace(/\s*The price includes\b[^.]*(?:\.|$)/gi, " ")
    .replace(/\s*The price is for labor and thinset or gluing material only\.?/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped ? `${stripped} ${PRICE_NOTE}` : PRICE_NOTE;
}

export default function ServicesPage() {
  const { searchText, viewMode, setViewMode } = useFilters();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);
  
  const filteredServices = useMemo(() => {
    let filtered = services;
    
    // Apply text search
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          cardDescription(service.description).toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [searchText, services]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-8 h-8 bg-red-500 animate-spin rotate-45 rounded-sm shadow-lg border-2 border-white"></div>
          <p className="mt-2 text-white">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      {/* Services Grid */}
      <div className="flex-1 overflow-x-auto scrollbar-thumb-red-600 scrollbar-track-gray-200 bg-black pt-2" style={{ scrollbarWidth: 'auto', minHeight: 12 }}>
        <div className={`grid gap-2 bg-black pb-20 md:gap-x-2.5 md:gap-y-2.5 ${viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-3'}`}>
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">No services found.</div>
          ) : (
            filteredServices.map((service) => (
              <article
                key={service.id}
                className={`flex w-full overflow-hidden rounded-lg border border-gray-100 bg-white text-left shadow-md ${viewMode === 'grid' ? 'flex-row' : 'flex-col'}`}
              >
                <div className={`relative flex shrink-0 items-center justify-center bg-gray-100 ${viewMode === 'grid' ? 'w-28 self-stretch sm:w-36' : 'aspect-[3/2] w-full'}`}>
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <ProductPlaceholder
                      text="Image Coming Soon..."
                      width={200}
                      height={60}
                      backgroundColor="#f3f4f6"
                      textColor="#6b7280"
                    />
                  )}
                </div>
                <div className={`flex min-w-0 flex-1 flex-col ${viewMode === 'grid' ? 'px-2 py-2' : 'px-3 pb-3 pt-2'}`}>
                  <h3 className={`font-bold text-black ${viewMode === 'grid' ? 'truncate text-sm' : 'text-lg'}`}>{service.name}</h3>
                  <p className={`text-gray-700 ${viewMode === 'grid' ? 'line-clamp-1 text-xs' : 'line-clamp-2 text-sm'}`}>{cardDescription(service.description)}</p>
                  <div className={`flex gap-2 ${viewMode === 'grid' ? 'mt-2 items-center justify-between' : 'mt-3 flex-1 flex-col justify-between'}`}>
                    <span className="inline-block w-fit rounded-md border border-green-100 bg-green-50 px-1 text-xs font-semibold text-green-700 shadow-sm">
                      {service.price}
                    </span>
                    <Link
                      href="/estimate"
                      className={`inline-flex w-fit items-center rounded-md border-2 border-red-500 bg-black px-3 py-1.5 text-xs font-bold text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-sm ${viewMode === 'list' ? 'self-end' : ''}`}
                    >
                      Estimate
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      <div className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-md border-2 border-black bg-white p-1 shadow-lg">
        <button
          type="button"
          onClick={() => setViewMode('list')}
          aria-label="List view"
          className={`flex h-10 w-10 items-center justify-center rounded-md border-2 border-black ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          <List className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          aria-label="Tile view"
          className={`flex h-10 w-10 items-center justify-center rounded-md border-2 border-black ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-black'}`}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>
      </div>
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          height: 12px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: #d32f2f;
          border-radius: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: #222;
        }
      `}</style>
    </div>
  );
} 
"use client";

import { useMemo, useEffect, useState } from "react";
import { useFilters } from "@/context/filter-context";
import { useRouter } from "next/navigation";
import { Service, getServices } from "@/services/serviceService";

export default function ServicesPage() {
  const router = useRouter();
  const { searchText } = useFilters();
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
          service.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [searchText, services]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
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
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-2.5 md:gap-y-2.5 gap-2 md:px-2.5 px-1 pb-2.5 bg-black'}>
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">No services found.</div>
          ) : (
            filteredServices.map((service) => (
              <button
                key={service.id}
                onClick={() => router.push('/estimate')}
                className="block w-full text-left bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-2 border border-gray-100 hover:border-red-400 group hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-black group-hover:text-red-600 mb-2">{service.name}</h3>
                    <p className="text-gray-700 text-sm mb-3 min-h-[60px]">{service.description}</p>
                  </div>
                  <div className="mt-auto text-right">
                    <span className="inline-block bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-md text-xs shadow-sm border border-green-100">
                      {service.price}
                    </span>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
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
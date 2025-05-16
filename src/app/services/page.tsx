"use client";

import { useMemo } from "react";
import { useFilters } from "@/context/filter-context";
import Link from "next/link";

const services = [
  {
    name: "Pavers Installation",
    description:
      "Our expert team provides top-quality paver installation for driveways, pool decks, backyards, patios, walkways, and more. The price includes professional installation and base sand.",
    link: "/services/pavers-installation",
    price: "$3.50 - $5.00 per square foot",
  },
  {
    name: "Porcelain Installation",
    description:
      "Our skilled technicians offer premium porcelain tile installation for indoor and outdoor spaces. The price includes expert installation, adhesive, and grout materials.",
    link: "/services/porcelain-installation",
    price: "$5.50 - $9.50 per square foot",
  },
  {
    name: "Travertine Installation",
    description:
      "We specialize in elegant travertine installation for patios, pool decks, and outdoor living areas. The price includes professional installation, base materials, and sealing.",
    link: "/services/travertine-installation",
    price: "$5.00 - $9.00 per square foot",
  },
  {
    name: "Pavers Repair",
    description:
      "Our team offers expert repair services for damaged or settled pavers in driveways, patios, and walkways. The price includes assessment, necessary materials, and professional repair work.",
    link: "/services/pavers-repair",
    price: "Starts at $150",
  },
  {
    name: "Paver Sealing",
    description:
      "We provide high-quality sealing services to protect and enhance your paver surfaces. The price includes thorough cleaning, professional-grade sealant application, and finish inspection.",
    link: "/services/paver-sealing",
    price: "$1.00 - $3.50 per square foot",
  },
  {
    name: "Coping Installation",
    description:
      "Our experts offer precise coping installation for pools, raised patios, and other elevated surfaces. The price includes materials, custom cutting, and professional installation.",
    link: "/services/coping-installation",
    price: "$25.00 - $45.00 per square foot",
  },
  {
    name: "Decorative Wall Installation",
    description:
      "We create stunning decorative walls for landscapes and outdoor living spaces. The price includes design consultation, materials, and expert construction.",
    link: "/services/decorative-wall-installation",
    price: "$20.00 - $25.00 per square foot",
  },
  {
    name: "Turf Installation",
    description:
      "Our team provides professional installation of high-quality artificial turf for lawns, play areas, and sports surfaces. The price includes site preparation, premium turf materials, and expert installation.",
    link: "/services/turf-installation",
    price: "$3.00 - $4.50 per square foot",
  },
  {
    name: "Rock Spreading",
    description:
      "We offer efficient and aesthetic rock spreading services for landscaping and ground cover. The price includes material selection, site preparation, and professional spreading.",
    link: "/services/rock-spreading",
    price: "Starts at $1.00 per square foot",
  },
  {
    name: "Drainage Installation",
    description:
      "Our experts provide comprehensive drainage system installation to prevent water damage and improve landscape health. The price includes site assessment, materials, and professional installation.",
    link: "/services/drainage-installation",
    price: "Starts at $4.00 per square foot",
  },
];

export default function ServicesPage() {
  const { searchText } = useFilters();
  
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
  }, [searchText]);

  return (
    <div className="w-full min-h-screen bg-black flex flex-col">
      {/* Services Grid */}
      <div className="flex-1 overflow-x-auto scrollbar-thumb-red-600 scrollbar-track-gray-200 bg-black pt-2" style={{ scrollbarWidth: 'auto', minHeight: 12 }}>
        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-2.5 md:gap-y-2.5 gap-2 md:px-2.5 px-1 pb-2.5 bg-black'}>
          {filteredServices.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 text-lg py-12">No services found.</div>
          ) : (
            filteredServices.map((service) => (
              <Link
                key={service.name}
                href={service.link}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-2 border border-gray-100 hover:border-red-400 group hover:scale-[1.01]"
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
              </Link>
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
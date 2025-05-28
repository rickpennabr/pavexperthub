import React from 'react';
import Image from 'next/image';
import { Phone, MapPin, Globe } from 'lucide-react';
import { TransformedBranch } from '@/types/supplier';

interface SupplierCardProps {
  supplier: TransformedBranch['supplier'];
  isSelected: boolean;
  onClick: () => void;
  crossStreet: string;
  phone?: string;
  address?: string;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  isSelected,
  onClick,
  crossStreet,
  phone,
  address
}) => { 
  console.log('SupplierCard rendering for:', supplier.supplier_name);
  console.log('Brand logos:', supplier.brand_logos);
  console.log('Logo URL:', supplier.brand_logos?.[0]?.logo_url);

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      // Check if it's a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        // On mobile, open the phone dialer
        window.location.href = `tel:${phone}`;
      } else {
        // On desktop, copy to clipboard
        navigator.clipboard.writeText(phone).then(() => {
          alert(`It is not possible to make this call using your current system.\n\nPlease call this number: ${phone}\n\nThe phone number has been copied to your clipboard.`);
        }).catch(err => {
          console.error('Failed to copy phone number:', err);
        });
      }
    }
  };

  const handleMapClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (address) window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (supplier.website_url) window.open(supplier.website_url, '_blank');
  };

  return (
    <div
      onClick={onClick}
      className={`block w-full text-left rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-2 border border-gray-100 hover:border-red-400 group hover:scale-[1.01] cursor-pointer ${
        isSelected
          ? 'bg-white border-2 border-black text-black md:bg-black md:text-white'
          : 'bg-white text-black md:bg-black md:text-white'
      }`}
    >
      <div className="flex items-center gap-2 pb-2 pl-2">
        {/* Diamond Logo Container */}
        <div 
          className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 flex-shrink-0 rotate-45"
          style={{ overflow: 'hidden', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', marginTop: '-0.3em', marginBottom: '-0.3em' }}
          title={supplier.supplier_name}
        >
          <div className="w-full h-full flex items-center justify-center -rotate-45">
            {supplier.brand_logos?.[0]?.logo_url ? (
              <Image
                src={supplier.brand_logos[0].logo_url}
                alt={`${supplier.supplier_name} logo`}
                fill
                className="object-contain w-[90%] h-[90%]"
                onError={(e) => {
                  console.error('Error loading image for', supplier.supplier_name, ':', e);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <span className="font-bold text-base text-gray-400">
                {supplier.supplier_name.charAt(0)}
              </span>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold truncate">{supplier.supplier_name}</h3>
          <p className="text-xs font-bold text-red-500 mt-0.5 truncate">{crossStreet}</p>
        </div>
      </div>

      {/* Branch Materials Section */}
      {supplier.materials && supplier.materials.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <div className="flex overflow-x-auto gap-1.5 pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {supplier.materials.map((material) => (
              <span
                key={material.id}
                className="inline-block px-1.5 py-0.5 bg-black md:bg-gray-50 text-white md:text-gray-600 text-[10px] whitespace-nowrap rounded-md border border-gray-200 hover:border-red-400 transition-colors duration-200"
                title={material.material_name}
              >
                {material.material_name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 border-t border-gray-100 flex justify-end gap-3">
        {phone && (
          <button
            onClick={handlePhoneClick}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Call"
          >
            <Phone size={18} />
          </button>
        )}
        {address && (
          <button
            onClick={handleMapClick}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Open in Maps"
          >
            <MapPin size={18} />
          </button>
        )}
        {supplier.website_url && (
          <button
            onClick={handleWebsiteClick}
            className="text-red-500 hover:text-red-600 transition-colors"
            title="Visit Website"
          >
            <Globe size={18} />
          </button>
        )}
      </div>
    </div>
  );
}; 
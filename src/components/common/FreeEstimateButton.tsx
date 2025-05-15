'use client';

import { Calculator } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FreeEstimateButton() {
  const pathname = usePathname();
  const isActive = pathname === "/free-estimate";
  
  return (
    <Link href="/free-estimate">
      <button
        className={`relative bg-black text-white px-2 py-2.5 rounded-md text-sm group cursor-pointer
                   ${isActive ? "border-2 border-red-500" : "border-0 hover:border-2 hover:border-red-500"}`}
      >
        <div
          className={`absolute inset-0 rounded-md bg-white transition-all duration-300 ease-out
                     ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
        />
        
        <div className={`flex items-center gap-1.5 relative z-10 
                        ${isActive ? "text-black" : "group-hover:text-black"} 
                        transition-colors duration-300`}
        >
          <Calculator 
            className={`h-4 w-4 transition-transform duration-300
                      ${isActive ? "scale-125" : "group-hover:scale-125"}`} 
          />
          <span>Free Estimate</span>
        </div>
      </button>
    </Link>
  );
}
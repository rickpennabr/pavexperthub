'use client';

import { Package, Wrench, Truck, FileText, Video } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * MainMenu Component
 * A responsive navigation menu with icons and active state indicators
 * Features mobile and desktop optimized layouts
 * Fixed height of 60px with centered content
 */
export default function MainMenu() {
  const pathname = usePathname();

  // Determine active item based on current path
  const getActiveItem = (path: string) => {
    // Check for exact matches first
    if (path === "/products") return "products";
    if (path === "/services") return "services";
    if (path === "/suppliers") return "suppliers";
    if (path === "/expertblog") return "expertblog";
    if (path === "/videos") return "videos";
    
    // Then check for path starts
    if (path.startsWith("/products/")) return "products";
    if (path.startsWith("/services/")) return "services";
    if (path.startsWith("/suppliers/")) return "suppliers";
    if (path.startsWith("/expertblog/")) return "expertblog";
    if (path.startsWith("/videos/")) return "videos";
    
    // Default to products for root path
    if (path === "/") return "products";
    
    return null;
  };

  const activeItem = getActiveItem(pathname);

  const menuItems = [
    { name: "PRODUCTS", icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, id: "products", href: "/products" },
    { name: "SERVICES", icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />, id: "services", href: "/services" },
    { name: "SUPPLIERS", icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />, id: "suppliers", href: "/suppliers" },
    { name: "EXPERTBLOG", icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5" />, id: "expertblog", href: "/expertblog" },
    { name: "VIDEOS", icon: <Video className="w-4 h-4 sm:w-5 sm:h-5" />, id: "videos", href: "/videos" },
  ];

  return (
    <>
      <nav className="w-full h-[60px] py-2 px-1 bg-black text-white overflow-x-auto sm:overflow-x-visible">
        <ul className="flex justify-start sm:justify-around items-center h-full px-1 sm:px-4 min-w-[500px] sm:min-w-0 sm:w-full gap-4">
          {menuItems.map((item) => {
            const isActive = activeItem === item.id;

            return (
              <li key={item.id} className="flex-shrink-0 h-full flex items-center">
                <Link
                  href={item.href}
                  className={`flex items-center h-10 px-2 text-xs sm:text-sm md:text-base group whitespace-nowrap relative
                    ${isActive ? "sm:text-white" : "text-white"}
                    border-x border-white rounded-md sm:border-0`}
                >
                  {/* Mobile active background */}
                  {isActive && <span className="absolute inset-0 bg-white rounded-md sm:hidden"></span>}

                  {/* Icon */}
                  <span
                    className={`mr-1 sm:mr-2 flex items-center relative z-10
                    ${isActive 
                      ? "text-red-500 sm:text-white scale-125" 
                      : "text-white transition-transform duration-300 group-hover:scale-125"}`}
                  >
                    {item.icon}
                  </span>

                  {/* Text */}
                  <span className="relative z-10">
                    <span className={`${isActive ? "text-black sm:text-white" : "text-white"}`}>{item.name}</span>

                    {/* Desktop underline - only visible on desktop */}
                    {isActive ? (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-white hidden sm:block"></span>
                    ) : (
                      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white group-hover:w-full transition-all duration-300 hidden sm:block"></span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <style jsx global>{`
        nav::-webkit-scrollbar {
          height: 12px;
        }
        nav::-webkit-scrollbar-track {
          background: #000;
        }
        nav::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 6px;
        }
      `}</style>
    </>
  );
}
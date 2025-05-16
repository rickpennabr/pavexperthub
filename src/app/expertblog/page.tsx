"use client";

import { useFilters } from "@/context/filter-context";

export default function ExpertBlogPage() {
  const { searchText } = useFilters();

  return (
    <div className="flex items-center bg-white justify-center h-full">
      <h1 className="text-2xl font-bold text-black">Expert Blog Coming Soon</h1>
    </div>
  );
} 
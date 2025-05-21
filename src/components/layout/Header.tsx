"use client"

import React from "react";
import Logo from "@/components/common/Logo";
import FreeEstimateButton from "@/components/common/FreeEstimateButton";

export default function Header() {
  return (
    <header className="w-full">
      <div className="h-[60px] p-1 flex items-center justify-between bg-white rounded-lg">
        <Logo />
        <FreeEstimateButton />        
      </div>
    </header>
  );
} 
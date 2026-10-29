"use client"

import React from "react";
import Logo from "@/components/common/Logo";
import FreeEstimateButton from "@/components/common/FreeEstimateButton";
import { ProfileButton } from "@/components/auth/profile-button";

export default function Header() {
  return (
    <header className="relative z-30 w-full">
      <div className="h-[60px] p-1 flex items-center justify-between gap-2 bg-white rounded-lg">
        <Logo />
        <div className="flex shrink-0 items-center gap-1">
          <FreeEstimateButton />
          <ProfileButton />
        </div>
      </div>
    </header>
  );
} 
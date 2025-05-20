import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Logo Component
 * Renders the PavExperts logo as a clickable link to the home page
 * Uses Next.js Image component for optimized image loading
 */
export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="/images/logo/pav-expert-hub-logo.png"
        alt="PavExperts Logo"
        width={150}
        height={150}
        className="w-45 h-auto md:w-55"
        priority // Ensures the logo loads with high priority as it's above the fold
      />
    </Link>
  );
} 
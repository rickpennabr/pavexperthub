/**
 * VideosSearchFilterWrapper Component
 * 
 * A wrapper component that provides the search and filter functionality for the videos page.
 * This component handles the state management and data fetching for the search and filter features.
 */

"use client"

import React from "react";
import VideosSearchFilter from "./VideosSearchFilter";

export default function VideosSearchFilterWrapper() {
  return (
    <div className="w-full">
      <VideosSearchFilter />
    </div>
  );
} 
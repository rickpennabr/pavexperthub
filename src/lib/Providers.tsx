'use client';

import type { ReactNode } from "react"
import { FilterProvider } from "@/context/filter-context"

export function Providers({ children }: { children: ReactNode }) {
  return <FilterProvider>{children}</FilterProvider>
} 
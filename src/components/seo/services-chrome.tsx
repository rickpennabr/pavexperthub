"use client"

import { usePathname } from "next/navigation"
import ServicesSearchFilter from "@/components/custom/service-page/service-search-filter/ServicesSearchFilter"
import PageContainer from "@/components/layout/PageContainer"
import { FilterProvider } from "@/context/filter-context"

export function ServicesChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isIndex = pathname === "/services"

  return (
    <FilterProvider>
      {isIndex ? <ServicesSearchFilter /> : null}
      <PageContainer>{children}</PageContainer>
    </FilterProvider>
  )
}

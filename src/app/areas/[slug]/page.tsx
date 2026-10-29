import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/seo/json-ld"
import { SeoLanding } from "@/components/seo/seo-landing"
import { buildAreaJsonLd, buildBreadcrumbJsonLd, buildFaqJsonLd } from "@/lib/seo/json-ld"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { AREAS, areaServiceLinks, getArea } from "@/lib/seo/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return AREAS.map((area) => ({ slug: area.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const area = getArea(slug)
  if (!area) return {}
  return buildPageMetadata({
    title: area.title,
    description: area.description,
    path: `/areas/${area.slug}`,
  })
}

export default async function AreaSeoPage({ params }: PageProps) {
  const { slug } = await params
  const area = getArea(slug)
  if (!area) notFound()

  return (
    <>
      <JsonLd data={buildAreaJsonLd(area)} />
      <JsonLd data={buildFaqJsonLd(area.faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/services" },
          { name: area.name, path: `/areas/${area.slug}` },
        ])}
      />
      <SeoLanding
        includes={area.highlights}
        faqs={area.faqs}
        related={areaServiceLinks(area)}
      />
    </>
  )
}

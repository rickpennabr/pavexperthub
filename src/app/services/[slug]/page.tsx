import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/seo/json-ld"
import { SeoLanding } from "@/components/seo/seo-landing"
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildServiceJsonLd,
} from "@/lib/seo/json-ld"
import { buildPageMetadata } from "@/lib/seo/metadata"
import { getService, serviceRelatedLinks, SERVICES } from "@/lib/seo/site"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getService(slug)
  if (!service) return {}
  return buildPageMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${service.slug}`,
  })
}

export default async function ServiceSeoPage({ params }: PageProps) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  return (
    <>
      <JsonLd data={buildServiceJsonLd(service)} />
      <JsonLd data={buildFaqJsonLd(service.faqs)} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "/services" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />
      <SeoLanding
        price={service.price}
        includes={service.includes}
        faqs={service.faqs}
        related={serviceRelatedLinks(service.slug)}
      />
    </>
  )
}

import {
  SERVICES,
  SITE_NAME,
  SITE_URL,
  type SeoArea,
  type SeoFaq,
  type SeoService,
} from "@/lib/seo/site"

const AREA_SERVED = [
  { "@type": "City", name: "Las Vegas", addressRegion: "NV", addressCountry: "US" },
  { "@type": "City", name: "Henderson", addressRegion: "NV", addressCountry: "US" },
  { "@type": "Place", name: "Summerlin, Las Vegas, NV" },
]

export function buildBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Paver installer in Las Vegas, Henderson, and Summerlin for travertine, porcelain, paver repair, step repair, and landscape projects.",
    areaServed: AREA_SERVED,
    knowsAbout: [
      "Paver installation",
      "Paver repair",
      "Paver step repair",
      "Travertine pavers",
      "Porcelain pavers",
      "Paver sealing",
      "Landscape projects",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Paving and landscape services",
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: `${SITE_URL}/services/${service.slug}`,
        },
      })),
    },
  }
}

export function buildServiceJsonLd(service: SeoService): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: `${SITE_URL}/services/${service.slug}`,
    areaServed: AREA_SERVED,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}

export function buildFaqJsonLd(faqs: SeoFaq[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function buildAreaJsonLd(area: SeoArea): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Paving services in ${area.name}`,
    description: area.description,
    url: `${SITE_URL}/areas/${area.slug}`,
    areaServed:
      area.slug === "summerlin"
        ? { "@type": "Place", name: "Summerlin, Las Vegas, NV" }
        : { "@type": "City", name: area.name, addressRegion: "NV", addressCountry: "US" },
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
}


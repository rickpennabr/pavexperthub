import type { MetadataRoute } from "next"
import { AREAS, SERVICES, SITE_URL } from "@/lib/seo/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticPaths = ["/", "/products", "/services", "/suppliers", "/estimate"]
  const paths = [
    ...staticPaths,
    ...SERVICES.map((service) => `/services/${service.slug}`),
    ...AREAS.map((area) => `/areas/${area.slug}`),
  ]

  return paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" || path === "/services" ? "weekly" : "monthly",
    priority: path === "/" || path === "/services" ? 1 : 0.8,
  }))
}

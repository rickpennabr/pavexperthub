import type { Metadata } from "next"

export function buildPageMetadata(input: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title: { absolute: `${input.title} | PavExpert Hub` },
    description: input.description,
    alternates: { canonical: input.path },
    openGraph: {
      title: `${input.title} | PavExpert Hub`,
      description: input.description,
      url: input.path,
      siteName: "PavExpert Hub",
      type: "website",
      locale: "en_US",
    },
  }
}

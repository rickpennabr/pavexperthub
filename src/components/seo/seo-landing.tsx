import Link from "next/link"
import type { SeoFaq } from "@/lib/seo/site"
import type { FooterLink } from "@/lib/seo/site"

interface SeoLandingProps {
  price?: string
  includes: string[]
  faqs: SeoFaq[]
  related: FooterLink[]
}

export function SeoLanding({ price, includes, faqs, related }: SeoLandingProps) {
  return (
    <article className="m-1 rounded-lg bg-white p-4 text-black">
      {price ? (
        <p className="inline-block rounded-md border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {price}
        </p>
      ) : null}
      <h2 className="mt-4 text-lg font-bold">What&apos;s included</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
        {includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2 className="mt-6 text-lg font-bold">Common questions</h2>
      <div className="mt-3 space-y-4">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-sm font-semibold">{faq.question}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-800">{faq.answer}</p>
          </div>
        ))}
      </div>
      <Link
        href="/estimate"
        className="mt-6 inline-flex items-center rounded-md bg-black px-4 py-3 text-sm font-medium text-white hover:bg-red-600"
      >
        Free Estimate
      </Link>
      <nav aria-label="Related services" className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
        {related.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-800 underline-offset-2 hover:text-red-600 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </article>
  )
}

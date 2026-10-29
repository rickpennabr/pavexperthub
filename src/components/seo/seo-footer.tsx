"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { footerLinks, getFooterSeoCopy } from "@/lib/seo/site"

/**
 * Path-specific SEO copy lives here, the same way BrazaLink keeps hub
 * headlines in the footer so the screen above stays unchanged.
 */
export function SeoFooter() {
  const pathname = usePathname()
  const copy = getFooterSeoCopy(pathname)
  const links = footerLinks()

  return (
    <footer className="mt-2 rounded-lg bg-white px-3 py-4 text-sm text-black sm:px-4">
      <h1 className="text-base font-bold text-red-600 sm:text-lg">{copy.h1}</h1>
      <p className="mt-2 max-w-3xl leading-relaxed text-gray-800">{copy.body}</p>
      <nav aria-label="Services and areas" className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-gray-800 underline-offset-2 hover:text-red-600 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-4 border-t border-black/10 pt-4">
        <h2 className="text-sm font-semibold text-red-600">Free estimate</h2>
        <p className="mt-1 max-w-3xl leading-relaxed text-gray-800">
          PavExpert Hub installs and repairs pavers in Las Vegas, Henderson, and Summerlin.
        </p>
        <Link
          href="/estimate"
          className="mt-3 inline-flex items-center rounded-md bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-red-600"
        >
          Free Estimate
        </Link>
      </div>
    </footer>
  )
}

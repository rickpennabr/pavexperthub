import type { Metadata } from "next";
import { ServicesChrome } from "@/components/seo/services-chrome";
import { SERVICES_INDEX_COPY } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: SERVICES_INDEX_COPY.title,
  description: SERVICES_INDEX_COPY.description,
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ServicesChrome>{children}</ServicesChrome>;
}

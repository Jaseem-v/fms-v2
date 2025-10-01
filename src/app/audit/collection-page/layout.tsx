import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Collection Page CRO Audit - Fix My Store",
  description: "Get a comprehensive CRO audit for your Shopify collection pages. Optimize product listings, filters, and category navigation to boost conversions.",
  openGraph: {
    title: "Shopify Collection Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify collection pages. Optimize product listings, filters, and category navigation to boost conversions.",
    images: [
      {
        url: "https://fixmystore.com/og-image/collection.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify Collection Page CRO Audit - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/audit/collection-page",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Collection Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify collection pages. Optimize product listings, filters, and category navigation to boost conversions.",
    images: ["https://fixmystore.com/og-image/collection.jpeg"],
  },
};

export default function CollectionPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

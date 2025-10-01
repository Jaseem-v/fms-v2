import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Product Page CRO Audit - Fix My Store",
  description: "Get a comprehensive CRO audit for your Shopify product pages. Optimize product descriptions, images, reviews, and add-to-cart flow to boost conversions.",
  openGraph: {
    title: "Shopify Product Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify product pages. Optimize product descriptions, images, reviews, and add-to-cart flow to boost conversions.",
    images: [
      {
        url: "https://fixmystore.com/og-image/product.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify Product Page CRO Audit - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/audit/product-page",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Product Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify product pages. Optimize product descriptions, images, reviews, and add-to-cart flow to boost conversions.",
    images: ["https://fixmystore.com/og-image/product.jpeg"],
  },
};

export default function ProductPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

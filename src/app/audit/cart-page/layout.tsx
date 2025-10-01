import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Cart Page CRO Audit - Fix My Store",
  description: "Get a comprehensive CRO audit for your Shopify cart page. Optimize checkout flow, reduce cart abandonment, and boost conversions.",
  openGraph: {
    title: "Shopify Cart Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify cart page. Optimize checkout flow, reduce cart abandonment, and boost conversions.",
    images: [
      {
        url: "https://fixmystore.com/og-image/cartpage.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify Cart Page CRO Audit - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/audit/cart-page",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Cart Page CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify cart page. Optimize checkout flow, reduce cart abandonment, and boost conversions.",
    images: ["https://fixmystore.com/og-image/cartpage.jpeg"],
  },
};

export default function CartPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

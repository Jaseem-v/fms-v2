import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify Homepage CRO Audit - Fix My Store",
  description: "Get a comprehensive CRO audit for your Shopify homepage. Optimize hero sections, trust signals, and user experience to boost conversions.",
  openGraph: {
    title: "Shopify Homepage CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify homepage. Optimize hero sections, trust signals, and user experience to boost conversions.",
    images: [
      {
        url: "https://fixmystore.com/og-image/homepage.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify Homepage CRO Audit - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/audit/home-page",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Homepage CRO Audit - Fix My Store",
    description: "Get a comprehensive CRO audit for your Shopify homepage. Optimize hero sections, trust signals, and user experience to boost conversions.",
    images: ["https://fixmystore.com/og-image/homepage.jpeg"],
  },
};

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

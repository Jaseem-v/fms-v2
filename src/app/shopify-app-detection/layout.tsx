import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify App Detector - Find Apps Installed on Any Store | Fix My Store",
  description: "Discover which Shopify apps are installed on any store. Get insights into competitor strategies and optimize your own app stack.",
  openGraph: {
    title: "Shopify App Detector - Find Apps Installed on Any Store",
    description: "Discover which Shopify apps are installed on any store. Get insights into competitor strategies and optimize your own app stack.",
    images: [
      {
        url: "https://fixmystore.com/og-image/app-detect.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify App Detector - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/shopify-app-detection",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify App Detector - Find Apps Installed on Any Store",
    description: "Discover which Shopify apps are installed on any store. Get insights into competitor strategies and optimize your own app stack.",
    images: ["https://fixmystore.com/og-image/app-detect.jpeg"],
  },
};

export default function AppDetectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

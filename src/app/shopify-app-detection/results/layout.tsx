import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify App Detection Results | Fix My Store",
  description: "View detected Shopify apps and get insights into the store's app strategy.",
  openGraph: {
    title: "Shopify App Detection Results",
    description: "View detected Shopify apps and get insights into the store's app strategy.",
    images: [
      {
        url: "https://fixmystore.com/og-image/app-detect.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify App Detection Results - Fix My Store",
      },
    ],
    url: "https://fixmystore.com/shopify-app-detection/results",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify App Detection Results",
    description: "View detected Shopify apps and get insights into the store's app strategy.",
    images: ["https://fixmystore.com/og-image/app-detect.jpeg"],
  },
};

export default function AppDetectionResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

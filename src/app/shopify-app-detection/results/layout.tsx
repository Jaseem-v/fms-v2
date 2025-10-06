import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopify App Detection Results | Fix My Store",
  description: "View detected Shopify apps and get insights into the store's app strategy.",
  metadataBase: new URL('https://fixmystore.com'),
  openGraph: {
    title: "Shopify App Detection Results",
    description: "View detected Shopify apps and get insights into the store's app strategy.",
    images: [
      {
        url: "/og-image/app-detect.jpeg",
        width: 1200,
        height: 630,
        alt: "Shopify App Detection Results - Fix My Store",
      },
    ],
    url: "/shopify-app-detection/results",
    type: "website",
    siteName: "Fix My Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify App Detection Results",
    description: "View detected Shopify apps and get insights into the store's app strategy.",
    images: ["/og-image/app-detect.jpeg"],
    site: "@fixmystore",
  },
  alternates: {
    canonical: "/shopify-app-detection/results",
  },
};

export default function AppDetectionResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

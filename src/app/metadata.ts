import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Fix My Store | Shopify CRO Audits That [ACTUALLY] Drive Sales",
  description: "Most generic audits just list problems. We show exactly how to fix them, with real examples from working stores. Fix My Store gives Shopify brands actionable CRO reports that fix your conversion problems",
  keywords: "CRO, conversion rate optimization, ecommerce, online store, conversion analysis, Shopify CRO audit, fix my store",
  authors: [{ name: "CRO Analysis Team" }],
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "https://fixmystore.com/favicon.ico",
  },
  openGraph: {
    images: [
      {
        url: "https://fixmystore.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fix My Store - Shopify CRO Audits",
      },
    ],
  },
};

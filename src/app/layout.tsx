import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRO Analysis - Convert Browsers to Buyers",
  description: "Get instant CRO analysis for your online store. Identify conversion problems and get actionable solutions to boost your sales.",
  keywords: "CRO, conversion rate optimization, ecommerce, online store, conversion analysis",
  authors: [{ name: "CRO Analysis Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./font.css";
import "./style.scss"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRO Analysis - Convert Browsers to Buyers",
  description: "Get instant CRO analysis for your online store. Identify conversion problems and get actionable solutions to boost your sales.",
  keywords: "CRO, conversion rate optimization, ecommerce, online store, conversion analysis",
  authors: [{ name: "CRO Analysis Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

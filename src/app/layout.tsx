import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./font.css";
import "./style.scss"
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fix My Store | Shopify CRO Audits That [ACTUALLY] Drive Sales",
  description: "Most generic audits just list problems. We show exactly how to fix them, with real examples from working stores. Fix My Store gives Shopify brands actionable CRO reports that fix your conversion problems",
  keywords: "CRO, conversion rate optimization, ecommerce, online store, conversion analysis, Shopify CRO audit, fix my store",
  authors: [{ name: "CRO Analysis Team" }],
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
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5F65X6XM');
            `,
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5TRC3SF6KM"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5TRC3SF6KM');
            `,
          }}
        />
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "smvar4o6v7");
            `,
          }}
        />
        <Script
          id="google-ads-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17433848522');
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5F65X6XM"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <AuthProvider>
          <Navbar />
          <div className="announcment-bar">
            <p>
              Free 20-min strategy call included | Only &nbsp;
         
              <span>
                7 spots left
              </span>  this week
            </p>
          </div>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingButton from "@/components/ui/FloatingButton";
import "./font.css";
import "../style/style.scss"
import "../style/ui.scss"
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
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=Instrument+Serif:ital@0;1&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-5F65X6XM');
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
          id="twitter-conversion-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
              },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
              twq('config','qbsq3');
            `,
          }}
        />
        <Script
          id="crisp-chat"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.$crisp=[];window.CRISP_WEBSITE_ID="5068cab5-525c-4428-8ad6-8de243a09cb2";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
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
            title="Google Tag Manager"
          />
        </noscript>
        <AuthProvider>
          <ToastProvider>
            <Navbar />
           
            {children}
            <Footer />
            {/* <FloatingButton /> */}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

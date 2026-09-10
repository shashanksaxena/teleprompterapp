import type { Metadata, Viewport } from "next";

import { AdSenseLoader } from "@/components/adsense-loader";
import { Analytics, GoogleTagManagerNoScript } from "@/components/analytics";
import { AuthProvider } from "@/components/auth-provider";
import { InstallPrompt } from "@/components/install-prompt";
import { StructuredData } from "@/components/structured-data";
import { SiteNavigation } from "@/components/site-navigation";
import { ThemeSelector } from "@/components/theme-selector";
import { ADSENSE_CLIENT } from "@/lib/adsense";
import { getSiteUrl, siteConfig } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();
const GA_MEASUREMENT_ID = "G-DFV7VPKXXH";
const GTM_ID = "GTM-KZGFW2TJ";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteConfig.title,
    template: siteConfig.titleTemplate
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "productivity",
  keywords: [...siteConfig.keywords],
  icons: {
    icon: [
      { url: "/icon?size=32", sizes: "32x32", type: "image/png" },
      { url: "/icon?size=192", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon?size=32"]
  },
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage]
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.shortName,
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  },
  ...(ADSENSE_CLIENT
    ? {
      other: {
        "google-adsense-account": ADSENSE_CLIENT
      }
    }
    : {})
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f2" },
    { media: "(prefers-color-scheme: dark)", color: "#080808" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleTagManagerNoScript gtmId={GTM_ID} />
        <StructuredData />
        <AdSenseLoader client={ADSENSE_CLIENT} />
        <Analytics gaId={GA_MEASUREMENT_ID} gtmId={GTM_ID} />
        <AuthProvider>
          <SiteNavigation />
          <ThemeSelector />
          <InstallPrompt />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

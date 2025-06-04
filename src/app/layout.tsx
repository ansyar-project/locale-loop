import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { StructuredData } from "@/components/ui/StructuredData";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LocaleLoop - Curated City Guides by Locals",
    template: "%s | LocaleLoop",
  },
  description:
    "Discover authentic local experiences with curated city guides created by locals. Explore hidden gems, restaurants, attractions, and insider tips from people who know their cities best.",
  keywords: [
    "local guides",
    "city guides",
    "travel guides",
    "local experiences",
    "travel recommendations",
    "authentic travel",
    "local insights",
    "city exploration",
    "travel loops",
    "destination guides",
  ],
  authors: [{ name: "LocaleLoop Team" }],
  creator: "LocaleLoop",
  publisher: "LocaleLoop",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "LocaleLoop - Curated City Guides by Locals",
    description:
      "Discover authentic local experiences with curated city guides created by locals. Explore hidden gems and insider tips from people who know their cities best.",
    siteName: "LocaleLoop",
    images: [
      {
        url: "/api/og?title=LocaleLoop&description=Curated City Guides by Locals",
        width: 1200,
        height: 630,
        alt: "LocaleLoop - Discover Local Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LocaleLoop - Curated City Guides by Locals",
    description:
      "Discover authentic local experiences with curated city guides created by locals.",
    images: [
      "/api/og?title=LocaleLoop&description=Curated City Guides by Locals",
    ],
    creator: "@localeloop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "LocaleLoop",
    "application-name": "LocaleLoop",
    "msapplication-TileColor": "#667eea",
    "theme-color": "#667eea",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>

        {/* Structured Data */}
        <StructuredData type="website" data={{ url: baseUrl }} />
        <StructuredData type="organization" data={{ url: baseUrl }} />

        {/* Cloudinary Upload Widget Script */}
        <Script
          src="https://upload-widget.cloudinary.com/global/all.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import InitialLoader from "../components/InitialLoader";
import Navbar from "../components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "../components/ThemeProvider";
import { headers } from "next/headers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
});

const BASE_URL = 'https://scaleforgewebdev.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Scale Forge — Web Design & SEO Agency',
    template: '%s | Scale Forge',
  },
  description:
    'Scale Forge designs and develops fast, professional websites using Next.js — helping businesses establish a credible digital presence that wins clients.',
  keywords: [
    'web design agency',
    'web development',
    'Next.js agency',
    'SEO services',
    'content marketing',
    'high-converting websites',
    'Scale Forge',
    'Pakistan web agency',
    'Web Design Agency Pakistan',
    'Next.js Development Services Pakistan',
    'E-commerce Development Pakistan',
    'Professional Web Design Services',
    'Karachi Web Agency',
    'Web Development Agency Karachi',
    'Freelance Web Designer Karachi',
    'Next.js Development Agency',
    'Professional Website Design',
    'Best Web Design Agency Pakistan',
    'E-commerce Development Pakistan',
    'Freelance Web Developer Karachi',
    'Karachi Based Web Agency'
  ],
  authors: [{ name: 'Scale Forge', url: BASE_URL }],
  creator: 'Scale Forge',
  publisher: 'Scale Forge',
  category: 'Web Design & Development',
  applicationName: 'Scale Forge',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Scale Forge',
    title: 'Scale Forge — Web Design & SEO Agency',
    description:
      'Scale Forge designs and develops fast, professional websites using Next.js — helping businesses establish a credible digital presence that wins clients.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Scale Forge — High-Converting Websites for Growing Businesses',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@scaleforge',
    creator: '@scaleforge',
    title: 'Scale Forge — Web Design & SEO Agency',
    description:
      'Scale Forge designs and develops fast, professional websites using Next.js — helping businesses establish a credible digital presence that wins clients.',
    images: ['/twitter-card.png'],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'hoMub-4NUM5DotX810a_JWkn3_GPIJUNH49a0amm3dM',
  },
  other: {
    'geo.region': 'PK-SD',
    'geo.placename': 'Karachi',
    'geo.position': '24.8607;67.0011',
    'ICBM': '24.8607, 67.0011',
  },
};

import { SanityLive } from "@/sanity/lib/live";
import schemaData from "../public/schema.json";
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isPortal = pathname.startsWith('/portal');
  const isStudio = pathname.startsWith('/studio');
  const hideUI = isPortal || isStudio;

  // Ensure no trailing slash for canonical unless it's strictly root
  const canonicalPath = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  // Placeholder Analytics IDs - to be replaced by actual IDs in production
  const GA_TRACKING_ID = 'G-XXXXXXXXXX';
  const CLARITY_PROJECT_ID = 'xxxxxxxxx';

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
        
        {/* Microsoft Clarity Tracking */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
          `}
        </Script>

        {/* Google Analytics Tracking */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-black text-white selection:bg-white/30`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ServiceWorkerRegister />
          {!hideUI && <InitialLoader />}
          {!hideUI && <Navbar />}
          {children}
          <SanityLive />
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

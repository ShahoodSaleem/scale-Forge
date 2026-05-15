import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

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
  const FB_PIXEL_ID = 'YOUR_PIXEL_ID';

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preload" href="/Assets/assets/hero1.avif" as="image" type="image/avif" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-black text-white selection:bg-white/30`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ServiceWorkerRegister />

          {!hideUI && <Navbar />}
          {children}
          <React.Suspense fallback={null}>
            <SanityLive />
          </React.Suspense>
          <SpeedInsights />
          <Analytics />

          {/* Third-Party Analytics Scripts */}
          <Script id="ms-clarity" strategy="lazyOnload">
            {`
              try {
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              } catch(e) { console.error("Clarity error", e); }
            `}
          </Script>

          <Script id="fb-pixel" strategy="lazyOnload">
            {`
              try {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
                fbq('track', 'PageView');
              } catch(e) { console.error("FB Pixel error", e); }
            `}
          </Script>

          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="lazyOnload"
          />
          <Script id="google-analytics" strategy="lazyOnload">
            {`
              try {
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              } catch(e) { console.error("GA error", e); }
            `}
          </Script>
        </ThemeProvider>
      </body>
    </html>
  );
}

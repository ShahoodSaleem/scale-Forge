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

export const metadata: Metadata = {
  title: "Scale Forge | High-Fidelity Business Solutions",
  description: "Experience the power of premium design and cutting-edge technology.",
};

import { SanityLive } from "@/sanity/lib/live";

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

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-black text-white selection:bg-white/30`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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

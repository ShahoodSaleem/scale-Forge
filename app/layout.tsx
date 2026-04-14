import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import InitialLoader from "../components/InitialLoader";
import Navbar from "../components/Navbar";
import { SpeedInsights } from "@vercel/speed-insights/next"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased bg-black text-white selection:bg-white/30`}
      >
        <InitialLoader />
        <Navbar />
        {children}
      </body>
    </html>
  );
}

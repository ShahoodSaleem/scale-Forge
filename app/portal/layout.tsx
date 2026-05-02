import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ScaleForge Portal",
  description: "ScaleForge Employee & Admin Portal",
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

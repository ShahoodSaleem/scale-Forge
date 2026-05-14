"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr:false must live in a Client Component.
// This wrapper keeps the heavy CSS of InitialLoader out of the critical render path.
const InitialLoader = dynamic(() => import("./InitialLoader"), { ssr: false });

export default function ClientInitialLoader() {
  return <InitialLoader />;
}

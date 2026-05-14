"use client";

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-8 max-w-2xl relative">
        <div className="absolute inset-0 bg-orange-500/20 blur-[100px] rounded-full z-0 pointer-events-none" />
        
        <h1 className="text-8xl md:text-[150px] font-bold text-white relative z-10 tracking-tighter">
          4<span className="text-orange-500">0</span>4
        </h1>
        
        <div className="space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            Page not found
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 relative z-10">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 text-white font-semibold border border-white/10 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

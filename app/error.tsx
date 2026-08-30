'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error silently on client
    console.error('Unhandled Root Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-white flex items-center justify-center p-6 select-none">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#141722] border border-white/10 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-xs text-slate-400">
            An unexpected error occurred while loading this page. Our team has been notified.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

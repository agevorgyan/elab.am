'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0c10] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#141722] border border-white/10 text-center space-y-6">
          <h1 className="text-2xl font-black text-white">Critical Application Error</h1>
          <p className="text-xs text-slate-400">
            A critical system error occurred. Please refresh or try again later.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}

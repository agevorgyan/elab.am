'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react';

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-8 max-w-2xl mx-auto my-12 rounded-3xl bg-[#141722] border border-red-500/20 text-center space-y-6 shadow-2xl">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-extrabold text-white">Admin Dashboard Error</h2>
        <p className="text-xs text-slate-400">
          An error occurred while loading this admin module. Your session remains secure.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reload Module</span>
        </button>

        <Link
          href="/admin/dashboard"
          className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-extrabold text-xs flex items-center gap-2 hover:bg-white/10 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

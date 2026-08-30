import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export function LoadingState({ message = 'Loading data...', rows = 3 }: LoadingStateProps) {
  return (
    <div className="p-8 rounded-2xl bg-[#141722] border border-white/10 space-y-4 animate-pulse select-none">
      <div className="flex items-center justify-center gap-3 text-slate-400 py-4">
        <Loader2 className="w-5 h-5 animate-spin text-[#00dc93]" />
        <span className="text-xs font-mono font-medium">{message}</span>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-10 rounded-xl bg-white/5 w-full" />
        ))}
      </div>
    </div>
  );
}

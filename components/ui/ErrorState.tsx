import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while fetching information from the server.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="p-8 rounded-2xl bg-[#141722] border border-red-500/20 text-center space-y-4 shadow-xl">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/20">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">{message}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-[#00dc93] text-black font-extrabold text-xs inline-flex items-center gap-2 shadow-lg shadow-[#00dc93]/20 hover:scale-[1.02] transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Request</span>
        </button>
      )}
    </div>
  );
}

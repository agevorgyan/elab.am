import React from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'No records found',
  description = 'There are currently no items to display matching your criteria.',
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="p-12 rounded-2xl bg-[#141722] border border-white/10 text-center space-y-4">
      <div className="w-12 h-12 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center mx-auto border border-white/10">
        {icon || <Inbox className="w-6 h-6" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-white">{title}</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">{description}</p>
      </div>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-white/10 text-white font-extrabold text-xs inline-flex items-center gap-2 hover:bg-white/15 transition-all"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
}

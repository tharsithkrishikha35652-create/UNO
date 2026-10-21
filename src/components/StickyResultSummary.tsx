import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

interface StickyResultSummaryProps {
  subjectName: string;
  total: number;
  grade: string;
  gradePoint: number;
  actionLabel: string | null;
  onAction: () => void;
  onSummary?: () => void;
  placement: 'desktop' | 'mobile';
}

export const StickyResultSummary: React.FC<StickyResultSummaryProps> = ({
  subjectName,
  total,
  grade,
  gradePoint,
  actionLabel,
  onAction,
  onSummary,
  placement,
}) => (
  <section
    aria-label={`${subjectName} calculated result`}
    aria-live="polite"
    className={placement === 'desktop'
      ? 'hidden items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-2.5 md:flex'
      : 'fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-30 border-t border-slate-300 bg-white px-3 py-2.5 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] md:hidden'}
  >
    <div className={placement === 'desktop' ? 'flex min-w-0 items-center gap-4' : 'min-w-0'}>
      <p className="truncate text-sm font-black text-[#172554]" title={subjectName}>{subjectName}</p>
      <dl className={placement === 'desktop'
        ? 'flex shrink-0 items-center gap-4 text-xs'
        : 'mt-1 flex items-center gap-3 text-[11px]'}>
        <div className="flex items-baseline gap-1">
          <dt className="text-slate-600">Total</dt>
          <dd className="font-black tabular-nums text-[#172554]">{total.toFixed(2)} / 100</dd>
        </div>
        <div className="flex items-baseline gap-1">
          <dt className="text-slate-600">Grade</dt>
          <dd className="font-black text-[#172554]">{grade}</dd>
        </div>
        <div className="flex items-baseline gap-1">
          <dt className="text-slate-600">Grade point</dt>
          <dd className="font-black tabular-nums text-[#172554]">{gradePoint}</dd>
        </div>
      </dl>
    </div>
    <div className={placement === 'desktop' ? 'flex shrink-0 items-center gap-2' : 'mt-2'}>
      {placement === 'desktop' && onSummary && (
        <button
          type="button"
          onClick={onSummary}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 px-2 text-[11px] font-bold uppercase tracking-wide text-[#1e3a8a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
        >
          Summary at End
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={placement === 'desktop'
            ? 'inline-flex min-h-10 items-center justify-center gap-2 bg-[#172554] px-3.5 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]'
            : 'inline-flex min-h-10 w-full items-center justify-center gap-2 bg-[#172554] px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]'}>
          {actionLabel}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  </section>
);

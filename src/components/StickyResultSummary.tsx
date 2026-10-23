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
  placement?: 'desktop' | 'mobile';
}

export const StickyResultSummary: React.FC<StickyResultSummaryProps> = ({
  subjectName,
  total,
  grade,
  gradePoint,
  actionLabel,
  onAction,
  onSummary,
}) => (
  <section
    aria-label={`${subjectName} calculated result`}
    aria-live="polite"
    className="border-b border-slate-200 bg-white px-3 py-2 sm:px-6 sm:py-2.5 shadow-xs animate-[sticky-result-in_160ms_ease-out]"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
      {/* Left side: Course name + scores */}
      <div className="min-w-0 flex-1 md:flex md:items-center md:gap-4">
        <p className="truncate text-xs sm:text-sm md:text-base font-black text-[#172554]" title={subjectName}>
          {subjectName}
        </p>

        <dl className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:mt-0">
          <div className="flex items-baseline gap-1">
            <dt className="text-slate-500 font-semibold text-[10px] sm:text-xs">Total</dt>
            <dd className="font-black tabular-nums text-[#172554]">
              {total.toFixed(2)} <span className="text-[10px] font-semibold text-slate-500">/ 100</span>
            </dd>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex items-baseline">
              <dt className="sr-only">Grade</dt>
              <dd className="rounded bg-blue-100 border border-blue-200 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-black text-[#172554]">
                Grade {grade}
              </dd>
            </div>
            <div className="flex items-baseline">
              <dt className="sr-only">Grade point</dt>
              <dd className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-slate-800">
                GP {gradePoint}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Right side: Next Course button & optional summary jump */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {onSummary && (
          <button
            type="button"
            onClick={onSummary}
            className="hidden lg:inline-flex min-h-9 items-center justify-center gap-1 px-2.5 text-xs font-bold uppercase tracking-wider text-[#1e3a8a] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] cursor-pointer"
          >
            Summary at End
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-8 sm:min-h-9 items-center justify-center gap-1 sm:gap-1.5 rounded-lg bg-[#172554] px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-[#1e3a8a] active:scale-[0.98] transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] cursor-pointer"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  </section>
);

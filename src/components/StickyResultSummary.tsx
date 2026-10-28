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
    className="border-b border-l-4 border-l-[#D97757] border-slate-200 bg-white px-3 py-2 sm:px-6 sm:py-2.5 shadow-sm animate-[sticky-result-in_160ms_ease-out]"
  >
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 sm:gap-4">
      <div className="min-w-0">
        <p className="max-w-full truncate text-[10px] font-bold leading-tight text-slate-600 sm:text-xs" title={subjectName}>
          {subjectName}
        </p>
        <dl className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
          <div className="flex items-baseline gap-1">
            <dt className="text-[9px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[10px]">Total</dt>
            <dd className="text-base font-black leading-none tabular-nums text-[#2C2C30] sm:text-xl">
              {total.toFixed(2)}<span className="ml-0.5 text-[9px] font-semibold text-slate-500 sm:text-[10px]">/100</span>
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <div>
              <dt className="sr-only">Grade</dt>
              <dd className="rounded-md border border-[#E9C7B9] bg-[#F3E5DB] px-1.5 py-0.5 text-[9px] font-black leading-tight text-[#B95F43] sm:text-[10px]">
                Grade {grade}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Grade point</dt>
              <dd className="rounded-md border border-[#E4DDD2] bg-[#FCFAF6] px-1.5 py-0.5 text-[9px] font-bold leading-tight text-[#3B4D66] sm:text-[10px]">
                GP {gradePoint}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-2">
        {onSummary && (
          <button
            type="button"
            onClick={onSummary}
            className="hidden min-h-9 items-center justify-center gap-1 rounded-lg px-2.5 text-xs font-bold uppercase tracking-wide text-[#B95F43] hover:bg-[#FCFAF6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B4D66] lg:inline-flex"
          >
            Summary at End <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-9 max-w-32 items-center justify-center gap-1 rounded-lg border border-[#D97757] bg-[#D97757] px-2 py-1.5 text-[9px] font-extrabold uppercase leading-tight tracking-wide text-white shadow-sm transition-all hover:bg-[#B95F43] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B4D66] sm:max-w-none sm:gap-1.5 sm:px-3.5 sm:text-xs"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  </section>
);
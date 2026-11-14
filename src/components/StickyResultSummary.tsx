import React from 'react';
import { ArrowDown, ArrowRight, RotateCcw } from 'lucide-react';

interface StickyResultSummaryProps {
  subjectName: string;
  total: number;
  grade: string;
  gradePoint: number;
  actionLabel: string | null;
  onAction: () => void;
  onResetToBlank: () => void;
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
  onResetToBlank,
  onSummary,
}) => (
  <section
    aria-label={`${subjectName} calculated result`}
    aria-live="polite"
    className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161618] shadow-sm animate-[sticky-result-in_160ms_ease-out] transition-colors"
  >
    <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 px-3 py-2 sm:gap-4 sm:px-6 lg:px-8 sm:py-2.5">
      <div className="min-w-0 flex flex-col justify-center">
        <p className="min-w-0 truncate text-sm sm:text-base font-bold leading-tight text-slate-700 dark:text-slate-200" title={subjectName}>
          {subjectName}
        </p>
        <dl className="mt-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
          <div className="flex items-baseline gap-1">
            <dt className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 sm:text-[10px]">Total</dt>
            <dd className="text-base font-black leading-none tabular-nums font-numeric text-[#2C2C30] dark:text-white sm:text-xl">
              {total.toFixed(2)}<span className="ml-0.5 text-[9px] font-semibold text-slate-500 dark:text-slate-400 sm:text-[10px]">/100</span>
            </dd>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <div>
              <dt className="sr-only">Grade</dt>
              <dd className="rounded-md border border-[#E9C7B9] dark:border-[#7c3d28]/70 bg-[#F3E5DB] dark:bg-[#3d2017] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black leading-tight text-[#B95F43] dark:text-[#f39575]">
                Grade {grade}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Grade point</dt>
              <dd className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#1b2230] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold leading-tight text-[#3B4D66] dark:text-[#93b4e6]">
                GP <span className="tabular-nums font-numeric">{gradePoint}</span>
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        {onSummary && (
          <button
            type="button"
            onClick={onSummary}
            className="hidden min-h-8 sm:min-h-9 items-center justify-center gap-1 rounded-lg px-2 sm:px-2.5 text-xs font-bold text-[#B95F43] hover:bg-slate-50 dark:hover:bg-[#202024] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B4D66] lg:inline-flex"
          >
            Summary at end <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          onClick={onResetToBlank}
          className="inline-flex min-h-8 sm:min-h-9 shrink-0 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] px-2 sm:px-2.5 text-[10px] sm:text-xs font-bold text-[#172554] dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-[#2a2a30] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
          title="Clear all fields to enter fresh marks"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Clear form</span>
        </button>
        {actionLabel && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex min-h-8 sm:min-h-9 max-w-32 sm:max-w-none shrink-0 items-center justify-center gap-1 sm:gap-1.5 rounded-lg border border-[#D97757] bg-[#D97757] px-2.5 sm:px-3.5 py-1.5 text-[10px] sm:text-xs font-extrabold leading-tight text-white shadow-sm transition-all hover:bg-[#B95F43] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B4D66]"
          >
            <span>{actionLabel}</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  </section>
);

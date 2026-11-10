import React from 'react';
import type { CalculationBreakdown } from '../types';

export interface ContinuousAssessmentField {
  key: string;
  label: string;
}

interface ContinuousAssessmentMarksSectionProps<TMarks extends object> {
  title: string;
  description: string;
  fields: readonly ContinuousAssessmentField[];
  marks: TMarks;
  onMarksChange: (marks: TMarks) => void;
  breakdown: CalculationBreakdown;
}

export function ContinuousAssessmentMarksSection<TMarks extends object>({
  title,
  description,
  fields,
  marks,
  onMarksChange,
  breakdown,
}: ContinuousAssessmentMarksSectionProps<TMarks>) {
  const markValues = marks as Record<string, number | string>;
  const results = breakdown.continuousAssessmentComponents ?? [];

  return (
    <section className="space-y-4" aria-label={title}>
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#172554]">
      <h3 className="font-black">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed">{description}</p>
    </div>
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-300 bg-white">
      {fields.map((field) => {
        const result = results.find((component) => component.key === field.key);
        return (
          <label key={field.key} className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-[minmax(0,1fr)_10rem_10rem] sm:items-center">
            <span>
              <span className="block text-sm font-semibold text-[#172554]">{field.label}</span>
              <span className="text-xs font-medium text-slate-500">Weight {result?.weight ?? 0}%</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="sr-only">{field.label} score</span>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.5}
                value={markValues[field.key] ?? ''}
                onChange={(event) => {
                  const rawValue = event.currentTarget.value;
                  const parsed = Number(rawValue);
                  onMarksChange({
                    ...marks,
                    [field.key]: rawValue === ''
                      ? ''
                      : Math.min(100, Math.max(0, Number.isFinite(parsed) ? parsed : 0)),
                  } as TMarks);
                }}
                placeholder="Score"
                aria-label={`${field.label} score out of 100`}
                className="min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-[#172554] tabular-nums font-numeric focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
              />
              <span className="shrink-0 text-xs font-semibold text-slate-600 tabular-nums font-numeric">/ 100</span>
            </span>
            <span className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:block sm:text-right">
              <span className="font-semibold text-slate-500 sm:block">Contributes</span>
              <span className="font-black tabular-nums text-[#172554]">{result?.contribution.toFixed(2) ?? '0.00'} / {result?.weight ?? 0}</span>
            </span>
          </label>
        );
      })}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm font-black text-[#172554]">
        <span>Continuous Assessment total</span>
        <span className="tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</span>
      </div>
    </div>
    </section>
  );
}

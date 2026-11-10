import React from 'react';
import { Calculator, LoaderCircle } from 'lucide-react';
import type { CalculationBreakdown, ProjectWorkMarks } from '../types';

type ProjectWorkSection = 'Continuous Assessment' | 'End-Semester Examination';

interface ProjectWorkAssessmentSectionProps {
  marks: ProjectWorkMarks;
  onMarksChange: (marks: ProjectWorkMarks) => void;
  breakdown: CalculationBreakdown;
  onCalculate: () => void;
  calculationState: 'idle' | 'calculating' | 'saving' | 'success' | 'error';
  hasCalculated: boolean;
  guestMode: boolean;
  savePending: boolean;
  assessmentTitle?: string;
}

const COMPONENTS: Array<{
  key: keyof ProjectWorkMarks;
  label: string;
  section: ProjectWorkSection;
  weight: number;
}> = [
  { key: 'reviewI', label: 'Review I', section: 'Continuous Assessment', weight: 10 },
  { key: 'reviewII', label: 'Review II', section: 'Continuous Assessment', weight: 20 },
  { key: 'reviewIII', label: 'Review III', section: 'Continuous Assessment', weight: 30 },
  { key: 'thesisGuide', label: 'Project Thesis Report Evaluation — Guide', section: 'End-Semester Examination', weight: 10 },
  { key: 'thesisExternal', label: 'Project Thesis Report Evaluation — External Examiner', section: 'End-Semester Examination', weight: 10 },
  { key: 'vivaExternal', label: 'Viva-Voce — External Examiner', section: 'End-Semester Examination', weight: 10 },
  { key: 'vivaInternal', label: 'Viva-Voce — Internal Examiner', section: 'End-Semester Examination', weight: 10 },
];

export const ProjectWorkAssessmentSection: React.FC<ProjectWorkAssessmentSectionProps> = ({
  marks,
  onMarksChange,
  breakdown,
  onCalculate,
  calculationState,
  hasCalculated,
  guestMode,
  savePending,
  assessmentTitle = 'Project Work / Internship cum Project Work',
}) => {
  const projectComponents = breakdown.projectWorkComponents ?? [];
  const isBusy = calculationState === 'calculating' || calculationState === 'saving';
  const renderGroup = (section: ProjectWorkSection) => {
    const components = COMPONENTS.filter((component) => component.section === section);
    return (
      <section
        className="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161618] shadow-sm"
        aria-label={`${section} assessment components`}
      >
        <div className="flex items-center gap-3 bg-[#172554] px-4 py-3 text-white rounded-t-xl">
          <h3 className="text-sm font-black">{section}</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {components.map((component) => {
            const result = projectComponents.find((item) => item.key === component.key);
            return (
            <label
              key={component.key}
              className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_10rem_10rem] sm:items-center bg-white dark:bg-[#161618] hover:bg-slate-50 dark:hover:bg-[#202024] transition-colors"
            >
              <span>
                <span className="block text-sm font-semibold text-[#172554] dark:text-[#f1f1f3]">{component.label}</span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Weight {component.weight}%</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="sr-only">{component.label} score</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step={0.5}
                  value={marks[component.key]}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    const parsed = Number(value);
                    onMarksChange({
                      ...marks,
                      [component.key]:
                        value === ''
                          ? ''
                          : Math.max(0, Math.min(100, Number.isFinite(parsed) ? parsed : 0)),
                    });
                  }}
                  placeholder="Score"
                  aria-label={`${component.label} score out of 100`}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#202024] px-3 py-2 text-sm font-bold text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric focus:border-[#172554] dark:focus:border-[#e08564] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:focus:ring-[#e08564]"
                />
                <span className="shrink-0 text-xs font-semibold text-slate-600 dark:text-slate-400 tabular-nums font-numeric">
                  / 100
                </span>
              </span>
              <span className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-[#202024] sm:block sm:text-right">
                <span className="font-semibold text-slate-500 dark:text-slate-400 sm:block">Contributes</span>
                <span className="font-black tabular-nums text-[#172554] dark:text-[#f1f1f3]">
                  {result?.contribution.toFixed(2) ?? '0.00'} / {component.weight}
                </span>
              </span>
            </label>
          );})}
          <div className="flex items-center justify-between bg-slate-50 px-4 py-3 text-sm font-black text-[#172554] dark:bg-[#202024] dark:text-[#f1f1f3]">
            <span>{section} subtotal ({section === 'Continuous Assessment' ? '60%' : '40%'})</span>
            <span className="tabular-nums font-numeric">
              {section === 'Continuous Assessment'
                ? `${breakdown.internal_total.toFixed(2)} / 60`
                : `${breakdown.ese_p.toFixed(2)} / 40`}
            </span>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/30 px-4 py-3 text-sm text-[#172554] dark:text-[#f1f1f3] shadow-xs">
        <p className="font-black text-base">{assessmentTitle}</p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Enter each component score out of 100. Contributions update as you type; Reviews I–III total 60% and thesis report/viva-voce total 40%.
        </p>
      </div>
      {renderGroup('Continuous Assessment')}
      {renderGroup('End-Semester Examination')}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-[#161618] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">Project total</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{breakdown.total.toFixed(2)} / 100 · indicative grade {breakdown.grade.letter}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCalculate}
            disabled={isBusy}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#172554] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#1e3a8a] disabled:cursor-wait disabled:opacity-60 dark:bg-[#d97757] dark:hover:bg-[#c85a32]"
          >
            {isBusy ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Calculator className="h-4 w-4" aria-hidden="true" />}
            {calculationState === 'calculating' ? 'Calculating result…' : calculationState === 'saving' ? 'Saving result…' : hasCalculated ? 'Recalculate Mark & Grade' : 'Calculate Mark & Grade'}
          </button>
          {(isBusy || (calculationState === 'success' && hasCalculated)) && (
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400" role="status" aria-live="polite">
              {calculationState === 'calculating'
                ? 'Calculating result…'
                : calculationState === 'saving'
                  ? 'Saving result to your account…'
                  : savePending
                    ? 'Grade calculated; waiting to sync your account.'
                    : guestMode
                      ? 'Result calculated for this temporary session only.'
                      : 'Result calculated and saved to your account.'}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

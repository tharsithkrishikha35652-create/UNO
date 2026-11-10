import React, { useEffect, useRef, useState } from 'react';
import { Calculator, LoaderCircle, Pencil } from 'lucide-react';
import type { CalculationBreakdown, ProjectWorkMarks } from '../types';

type ProjectWorkSection = 'Continuous Assessment' | 'End-Semester Examination';

interface ProjectWorkAssessmentSectionProps {
  semester?: number | null;
  marks: ProjectWorkMarks;
  onMarksChange: (marks: ProjectWorkMarks) => void;
  maxima?: Record<string, number | string>;
  onMaximumChange?: (key: string, value: number | string) => void;
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

interface ProjectMaximumControlProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
}

const ProjectMaximumControl: React.FC<ProjectMaximumControlProps> = ({
  id,
  label,
  value,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <span className="relative inline-flex shrink-0 items-center gap-1">
      <span className="text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">/ {value}</span>
      <button
        type="button"
        onClick={() => setIsEditing((editing) => !editing)}
        aria-label={`${isEditing ? 'Close' : 'Edit'} ${label.toLowerCase()}`}
        aria-expanded={isEditing}
        title={label}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 transition-colors hover:border-[#172554] hover:bg-white hover:text-[#172554] focus-visible:outline-2 focus-visible:outline-[#172554] dark:border-slate-600 dark:bg-[#202024] dark:text-slate-300 dark:hover:text-white"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {isEditing && (
        <span className="absolute right-0 top-full z-30 mt-1 rounded-lg border border-slate-300 bg-white p-2 shadow-lg dark:border-slate-600 dark:bg-[#202024]">
          <ProjectMaximumInput
            id={id}
            label={label}
            value={value}
            onChange={onChange}
          />
        </span>
      )}
    </span>
  );
};

const ProjectMaximumInput: React.FC<ProjectMaximumControlProps> = ({
  id,
  label,
  value,
  onChange,
}) => {
  const [draft, setDraft] = useState(String(value));
  const cancelCommitRef = useRef(false);

  useEffect(() => setDraft(String(value)), [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (!draft.trim() || !Number.isFinite(parsed) || parsed < 1) {
      setDraft(String(value));
      return;
    }
    onChange(Math.max(1, parsed));
  };

  return (
    <label className="flex items-center gap-2 whitespace-nowrap text-[11px] font-semibold text-slate-600 dark:text-slate-300">
      <span>Max marks</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={1}
        step={0.5}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={() => {
          if (cancelCommitRef.current) {
            cancelCommitRef.current = false;
            setDraft(String(value));
            return;
          }
          commit();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') {
            cancelCommitRef.current = true;
            setDraft(String(value));
            event.currentTarget.blur();
          }
        }}
        aria-label={label}
        className="h-8 w-16 rounded-md border border-slate-300 bg-white px-2 text-xs font-bold text-[#172554] tabular-nums focus:border-[#172554] focus:outline-2 focus:outline-[#172554] dark:border-slate-600 dark:bg-[#161618] dark:text-[#f1f1f3]"
      />
    </label>
  );
};

export const ProjectWorkAssessmentSection: React.FC<ProjectWorkAssessmentSectionProps> = ({
  semester,
  marks,
  onMarksChange,
  maxima = {},
  onMaximumChange,
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
  const isCompactSemester = semester === 8;
  const renderGroup = (section: ProjectWorkSection) => {
    const components = COMPONENTS.filter((component) => component.section === section);
    return (
      <section
        className="relative rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161618] shadow-sm"
        aria-label={`${section} assessment components`}
      >
        <div className={`flex items-center gap-3 bg-[#172554] text-white rounded-t-xl ${isCompactSemester ? 'px-3 py-2' : 'px-4 py-3'}`}>
          <h3 className={`${isCompactSemester ? 'text-xs' : 'text-sm'} font-black`}>{section}</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {components.map((component) => {
            const result = projectComponents.find((item) => item.key === component.key);
            const maximumKey = `project.${component.key}`;
            const maxScore = Math.max(1, Number(maxima[maximumKey] ?? result?.maxScore ?? 100) || 100);
            return (
            <div
              key={component.key}
              className={isCompactSemester
                ? 'flex flex-col gap-1.5 bg-white px-3 py-2 dark:bg-[#161618]'
                : 'grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_10rem_10rem] sm:items-center bg-white dark:bg-[#161618] hover:bg-slate-50 dark:hover:bg-[#202024] transition-colors'}
            >
              <span className={isCompactSemester ? 'flex min-w-0 items-start justify-between gap-2' : ''}>
                <span className={`block min-w-0 font-semibold text-[#172554] dark:text-[#f1f1f3] ${isCompactSemester ? 'text-xs leading-tight' : 'text-sm'}`}>{component.label}</span>
                {semester !== 8 && (
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Weight {component.weight}%</span>
                )}
                {isCompactSemester && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>Contributes</span>
                    <span className="font-black tabular-nums text-[#172554] dark:text-[#f1f1f3]">{result?.contribution.toFixed(2) ?? '0.00'} / {component.weight}</span>
                  </span>
                )}
              </span>
              <span className={`flex min-w-0 items-center ${isCompactSemester ? 'gap-1.5' : 'flex-wrap gap-2'}`}>
                <span className="sr-only">{component.label} score</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={maxScore}
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
                          : Math.max(0, Math.min(maxScore, Number.isFinite(parsed) ? parsed : 0)),
                    });
                  }}
                  placeholder="Score"
                  aria-label={`${component.label} score out of ${maxScore}`}
                  className={`min-w-0 rounded-lg border border-slate-300 bg-white font-bold text-[#172554] tabular-nums font-numeric focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] dark:border-slate-600 dark:bg-[#202024] dark:text-[#f1f1f3] dark:focus:border-[#e08564] dark:focus:ring-[#e08564] ${isCompactSemester ? 'h-9 flex-1 px-2.5 py-1 text-sm' : 'w-full px-3 py-2 text-sm'}`}
                />
                {onMaximumChange ? (
                  <ProjectMaximumControl
                    id={`max-project-${component.key}`}
                    label={`Maximum marks for ${component.label}`}
                    value={maxima[maximumKey] ?? result?.maxScore ?? 100}
                    onChange={(value) => {
                      const nextMax = Math.max(1, Number(value) || maxScore);
                      onMaximumChange(maximumKey, value);
                      const current = marks[component.key];
                      if (current !== '') {
                        onMarksChange({
                          ...marks,
                          [component.key]: Math.min(nextMax, Math.max(0, Number(current) || 0)),
                        });
                      }
                    }}
                  />
                ) : (
                  <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-600 dark:text-slate-300">/ {maxScore}</span>
                )}
              </span>
              {!isCompactSemester && (
                <span className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-[#202024] sm:block sm:text-right">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 sm:block">Contributes</span>
                  <span className="font-black tabular-nums text-[#172554] dark:text-[#f1f1f3]">
                    {result?.contribution.toFixed(2) ?? '0.00'} / {component.weight}
                  </span>
                </span>
              )}
            </div>
          );})}
          <div className={`flex items-center justify-between rounded-b-xl bg-slate-50 font-black text-[#172554] dark:bg-[#202024] dark:text-[#f1f1f3] ${isCompactSemester ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}`}>
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
    <div className={isCompactSemester ? 'space-y-3' : 'space-y-5'}>
      <div className={`overflow-hidden rounded-xl border border-blue-200 bg-blue-50/80 text-[#172554] shadow-xs dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-[#f1f1f3] ${isCompactSemester ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm'}`}>
        <p className={`font-black ${isCompactSemester ? 'text-sm' : 'text-base'}`}>{assessmentTitle}</p>
        <p className={`text-slate-600 dark:text-slate-300 ${isCompactSemester ? 'mt-0.5 text-[10px] leading-snug' : 'mt-1 text-xs'}`}>
          Set each component’s maximum marks as needed. Contributions update as you type; Reviews I–III total 60% and thesis report/viva-voce total 40%.
        </p>
      </div>
      {renderGroup('Continuous Assessment')}
      {renderGroup('End-Semester Examination')}
      <section className={`flex flex-col gap-2 rounded-xl border border-slate-300 bg-white shadow-sm dark:border-slate-700 dark:bg-[#161618] sm:flex-row sm:items-center sm:justify-between ${isCompactSemester ? 'p-3' : 'gap-3 rounded-2xl p-4'}`}>
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

import React from 'react';
import type { ProjectWorkMarks } from '../types';

type ProjectWorkSection = 'Continuous Assessment' | 'End-Semester Examination';

interface ProjectWorkAssessmentSectionProps {
  marks: ProjectWorkMarks;
  onMarksChange: (marks: ProjectWorkMarks) => void;
  assessmentTitle?: string;
}

const COMPONENTS: Array<{
  key: keyof ProjectWorkMarks;
  label: string;
  section: ProjectWorkSection;
}> = [
  { key: 'reviewI', label: 'Review I', section: 'Continuous Assessment' },
  { key: 'reviewII', label: 'Review II', section: 'Continuous Assessment' },
  { key: 'reviewIII', label: 'Review III', section: 'Continuous Assessment' },
  { key: 'thesisGuide', label: 'Project Thesis Report Evaluation — Guide', section: 'End-Semester Examination' },
  { key: 'thesisExternal', label: 'Project Thesis Report Evaluation — External Examiner', section: 'End-Semester Examination' },
  { key: 'vivaExternal', label: 'Viva-Voce — External Examiner', section: 'End-Semester Examination' },
  { key: 'vivaInternal', label: 'Viva-Voce — Internal Examiner', section: 'End-Semester Examination' },
];

export const ProjectWorkAssessmentSection: React.FC<ProjectWorkAssessmentSectionProps> = ({
  marks,
  onMarksChange,
  assessmentTitle = 'Project Work / Internship cum Project Work',
}) => {
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
          {components.map((component) => (
            <label
              key={component.key}
              className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center bg-white dark:bg-[#161618] hover:bg-slate-50 dark:hover:bg-[#202024] transition-colors"
            >
              <span className="text-sm font-semibold text-[#172554] dark:text-[#f1f1f3]">
                {component.label}
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
            </label>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/80 dark:bg-blue-950/30 px-4 py-3 text-sm text-[#172554] dark:text-[#f1f1f3] shadow-xs">
        <p className="font-black text-base">{assessmentTitle}</p>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
          Enter each component score out of 100. Each score is scaled by its listed weight; Reviews I–III total 60% and the thesis report and viva-voce components total 40%.
        </p>
      </div>
      {renderGroup('Continuous Assessment')}
      {renderGroup('End-Semester Examination')}
    </div>
  );
};

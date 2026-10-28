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
  weight: number;
  section: ProjectWorkSection;
}> = [
  { key: 'reviewI', label: 'Review I', weight: 10, section: 'Continuous Assessment' },
  { key: 'reviewII', label: 'Review II', weight: 20, section: 'Continuous Assessment' },
  { key: 'reviewIII', label: 'Review III', weight: 30, section: 'Continuous Assessment' },
  { key: 'thesisGuide', label: 'Project Thesis Report Evaluation — Guide', weight: 10, section: 'End-Semester Examination' },
  { key: 'thesisExternal', label: 'Project Thesis Report Evaluation — External Examiner', weight: 10, section: 'End-Semester Examination' },
  { key: 'vivaExternal', label: 'Viva-Voce — External Examiner', weight: 10, section: 'End-Semester Examination' },
  { key: 'vivaInternal', label: 'Viva-Voce — Internal Examiner', weight: 10, section: 'End-Semester Examination' },
];

export const ProjectWorkAssessmentSection: React.FC<ProjectWorkAssessmentSectionProps> = ({ marks, onMarksChange, assessmentTitle = 'Project Work assessment — Table 6' }) => {
  const renderGroup = (section: ProjectWorkSection) => {
    const components = COMPONENTS.filter((component) => component.section === section);
    const maxWeight = components.reduce((total, component) => total + component.weight, 0);
    return (
      <section className="border border-slate-300 bg-white" aria-label={`${section} assessment components`}>
        <div className="flex items-center justify-between gap-3 bg-[#172554] px-4 py-3 text-white">
          <h3 className="text-sm font-black">{section}</h3>
          <span className="text-xs font-bold">Total weight: {maxWeight}%</span>
        </div>
        <div className="divide-y divide-slate-200">
          {components.map((component) => (
            <label key={component.key} className="grid grid-cols-1 gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_5rem_12rem] sm:items-center">
              <span className="text-sm font-semibold text-[#172554]">{component.label}</span>
              <span className="text-xs font-bold text-slate-600">{component.weight}%</span>
              <span className="flex items-center gap-2">
                <span className="sr-only">{component.label} score</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={marks[component.key]}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    const parsed = Number(value);
                    onMarksChange({
                      ...marks,
                      [component.key]: value === '' ? '' : Math.max(0, Math.min(100, Number.isFinite(parsed) ? parsed : 0)),
                    });
                  }}
                  placeholder="Score"
                  aria-label={`${component.label} score out of 100`}
                  className="w-full border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-[#172554] focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554]"
                />
                <span className="shrink-0 text-xs font-semibold text-slate-600">/ 100</span>
              </span>
            </label>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-5">
      <div className="border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-[#172554]">
        <p className="font-black">{assessmentTitle}</p>
        <p className="mt-1">Enter each component score out of 100. Each score is scaled by its listed weight; Reviews I–III total 60% and the thesis report and viva-voce components total 40%.</p>
      </div>
      {renderGroup('Continuous Assessment')}
      {renderGroup('End-Semester Examination')}
    </div>
  );
};

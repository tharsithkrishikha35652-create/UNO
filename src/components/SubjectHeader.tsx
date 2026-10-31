import React from 'react';
import { SubjectData } from '../types';
import { getCourseType, getCourseWeights } from '../calculatorUtils';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface SubjectHeaderProps {
  subject: SubjectData;
  onResetToBlank: () => void;
  onBack?: () => void;
  semester?: number | null;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subject,
  onResetToBlank,
  onBack,
  semester,
}) => {
  const courseTypeLabel = getCourseWeights(getCourseType(subject)).courseTypeLabel;

  return (
    <div className="rounded-lg bg-white border border-slate-300 p-4 sm:p-6 mb-8 shadow-sm">
      {onBack && (
        <div className="mb-4 pb-3 border-b border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#172554] hover:text-[#1e3a8a] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {semester ? `Semester ${semester} Courses` : 'Courses'}</span>
          </button>
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Details Selection Dialog Trigger */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-[#172554] mb-1.5">
            Course / Subject Name:
          </label>

          {subject.name ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md p-3 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#172554]">
                  {subject.name}
                </span>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-[#172554] text-white">
                  {courseTypeLabel}
                </span>
                {subject.code && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 bg-white border border-slate-300 text-slate-700">
                    {subject.code}
                  </span>
                )}
              </div>

            </div>
          ) : (
            <div className="w-full border border-slate-200 bg-slate-50 px-3.5 py-3 text-xs font-semibold text-slate-600">
              Select a course from the tabs above.
            </div>
          )}
        </div>

        {/* Action: Clear form */}
        <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          <button
            type="button"
            onClick={onResetToBlank}
            className="rounded-md text-xs px-3.5 py-2.5 border border-slate-300 bg-white hover:border-[#172554] hover:bg-slate-50 text-[#172554] font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
            title="Clear all fields to enter fresh marks"
          >
            <RotateCcw className="w-4 h-4 text-[#172554]" />
            <span>Clear / Blank Form</span>
          </button>
        </div>
      </div>
    </div>
  );
};

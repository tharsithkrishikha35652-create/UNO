import React from 'react';
import { SubjectData } from '../types';
import { getCourseType, getCourseWeights } from '../calculatorUtils';
import { RotateCcw, BookOpen, ChevronRight } from 'lucide-react';

interface SubjectHeaderProps {
  subject: SubjectData;
  onOpenDialog: () => void;
  onResetToBlank: () => void;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subject,
  onOpenDialog,
  onResetToBlank,
}) => {
  const courseTypeLabel = getCourseWeights(getCourseType(subject)).courseTypeLabel;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-4 sm:p-5 mb-6 shadow-2xs transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Details Selection Dialog Trigger */}
        <div className="flex-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Active Course / Subject:
          </label>

          {subject.name ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#172554] dark:text-slate-100">
                  {subject.name}
                </span>
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-[#172554] dark:bg-blue-600 text-white">
                  {courseTypeLabel}
                </span>
                {subject.code && (
                  <span className="text-[10px] sm:text-xs font-mono font-semibold px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                    {subject.code}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={onOpenDialog}
                className="text-xs px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#172554] dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#172554] dark:text-slate-200 font-bold uppercase tracking-wider transition-colors shrink-0 inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
                title="Change subject from dialog box"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Change Course</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenDialog}
              className="w-full px-3.5 py-3 text-left text-xs sm:text-sm font-bold text-[#172554] dark:text-blue-300 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 hover:border-[#172554] transition-colors flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-[#172554] dark:text-blue-400 shrink-0" />
                <span>Select a course or course type from the semester catalog</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-extrabold uppercase tracking-wider text-[#172554] dark:text-blue-300 underline shrink-0">
                <span>Open Catalog</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          )}
        </div>

        {/* Action: Clear / Blank Form */}
        <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onResetToBlank}
            className="text-xs px-3.5 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#172554] dark:hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#172554] dark:text-slate-200 font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            title="Clear all fields to enter fresh marks"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#172554] dark:text-blue-400" />
            <span>Reset Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

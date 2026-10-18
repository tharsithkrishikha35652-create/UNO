import React from 'react';
import { X, Plus, Trash2, Check, BookOpen, Layers } from 'lucide-react';
import type { SubjectData } from '../types';

interface CourseBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: SubjectData[];
  currentSubjectId: string;
  onSelectSubject: (id: string) => void;
  onAddNewSubject: () => void;
  onDeleteSubject: (id: string) => void;
  calculatedSignatures?: Record<string, string>;
  semesterNumber: number;
}

export const CourseBottomSheet: React.FC<CourseBottomSheetProps> = ({
  isOpen,
  onClose,
  subjects,
  currentSubjectId,
  onSelectSubject,
  onAddNewSubject,
  onDeleteSubject,
  calculatedSignatures = {},
  semesterNumber,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Up Sheet Container */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-t border-slate-300 dark:border-slate-700 shadow-2xl z-10 max-h-[85vh] flex flex-col transition-all">
        {/* Grab Handle & Top Header */}
        <div className="pt-3 pb-2 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-[#172554] dark:bg-blue-600 text-white font-mono font-bold text-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Semester {semesterNumber} Courses
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {subjects.length} course{subjects.length === 1 ? '' : 's'} enrolled
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close courses drawer"
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Course Cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y-0">
          {subjects.map((sub, idx) => {
            const isSelected = sub.id === currentSubjectId;
            const hasCalculation = Boolean(calculatedSignatures[sub.id]);

            return (
              <div
                key={sub.id}
                onClick={() => {
                  onSelectSubject(sub.id);
                  onClose();
                }}
                className={`p-3.5 flex items-center justify-between gap-3 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-[#172554] dark:border-blue-500'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`mt-0.5 w-6 h-6 flex items-center justify-center font-mono text-[11px] font-bold shrink-0 ${
                      isSelected
                        ? 'bg-[#172554] dark:bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {sub.name || `Course ${idx + 1} (Unselected)`}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {sub.code && (
                        <span className="text-[10px] font-mono font-semibold px-1 py-0.2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                          {sub.code}
                        </span>
                      )}
                      <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 bg-[#172554] text-white">
                        {sub.courseType}
                      </span>
                      {hasCalculation && (
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1 py-0.2 border border-emerald-200 dark:border-emerald-800">
                          Calculated
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isSelected && (
                    <span className="p-1 text-[#172554] dark:text-blue-400 font-bold">
                      <Check className="w-4 h-4" />
                    </span>
                  )}

                  {subjects.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSubject(sub.id);
                      }}
                      aria-label={`Delete ${sub.name || 'course'}`}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onAddNewSubject();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 bg-[#172554] dark:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1e3a8a] dark:hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Another Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};

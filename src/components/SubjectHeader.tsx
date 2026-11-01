import React, { useEffect, useRef, useState } from 'react';
import { SubjectData } from '../types';
import { getCourseType, getCourseWeights } from '../calculatorUtils';
import { ArrowLeft, ArrowUpDown, Check, RotateCcw, Search, X } from 'lucide-react';
import { acknowledgeSelection } from '../haptics';

export interface QuickSwitcherCourse {
  id: string;
  name: string;
  code?: string;
  courseType?: string;
}

interface SubjectHeaderProps {
  subject: SubjectData;
  onResetToBlank: () => void;
  onBack?: () => void;
  semester?: number | null;
  availableCourses?: QuickSwitcherCourse[];
  onSelectSubject?: (subjectId: string) => void;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  subject,
  onResetToBlank,
  onBack,
  semester,
  availableCourses = [],
  onSelectSubject,
}) => {
  const courseTypeLabel = getCourseWeights(getCourseType(subject)).courseTypeLabel;
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (switcherOpen) {
      setQuery('');
      window.requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [switcherOpen]);

  const normalized = query.trim().toLowerCase();
  const filteredCourses = availableCourses.filter(
    (c) =>
      !normalized ||
      c.name.toLowerCase().includes(normalized) ||
      (c.code && c.code.toLowerCase().includes(normalized))
  );

  return (
    <div className="rounded-lg bg-white dark:bg-[#202024] border border-slate-300 dark:border-slate-700 p-4 sm:p-6 mb-8 shadow-sm transition-colors">
      {onBack && (
        <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#172554] dark:text-[#f1f1f3] hover:text-[#1e3a8a] dark:hover:text-[#e08564] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to {semester ? `Semester ${semester} Courses` : 'Courses'}</span>
          </button>
        </div>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Course Details */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-[#172554] dark:text-[#f1f1f3] mb-1.5">
            Course / Subject Name:
          </label>

          {subject.name ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-md p-3 bg-slate-50 dark:bg-[#161618] border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm sm:text-base font-black text-[#172554] dark:text-[#f1f1f3]">
                  {subject.name}
                </span>
                <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-[#172554] dark:bg-[#35353b] text-white rounded">
                  {courseTypeLabel}
                </span>
                {subject.code && (
                  <span className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 bg-white dark:bg-[#202024] border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-mono rounded">
                    {subject.code}
                  </span>
                )}
              </div>

              {availableCourses.length > 1 && onSelectSubject && (
                <button
                  type="button"
                  onClick={() => setSwitcherOpen(true)}
                  aria-label="Switch course in this semester"
                  aria-haspopup="dialog"
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#202024] px-2.5 py-1.5 text-xs font-bold text-[#172554] dark:text-[#f1f1f3] hover:bg-slate-50 dark:hover:bg-[#2a2a30] transition-colors focus-visible:outline-2 focus-visible:outline-[#172554] shrink-0"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Switch course</span>
                </button>
              )}
            </div>
          ) : (
            <div className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] px-3.5 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 rounded-md">
              Select a course from the tabs above.
            </div>
          )}
        </div>

        {/* Action: Clear form */}
        <div className="flex items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onResetToBlank}
            className="rounded-md text-xs px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#161618] hover:border-[#172554] dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-[#202024] text-[#172554] dark:text-[#f1f1f3] font-bold transition-colors inline-flex items-center gap-2 cursor-pointer"
            title="Clear all fields to enter fresh marks"
          >
            <RotateCcw className="w-4 h-4 text-[#172554] dark:text-[#f1f1f3]" />
            <span>Clear / Blank Form</span>
          </button>
        </div>
      </div>

      {/* Quick Subject Switcher Dialog */}
      {switcherOpen && onSelectSubject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="switcher-heading"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setSwitcherOpen(false);
          }}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] p-5 shadow-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 id="switcher-heading" className="text-base font-black text-[#172554] dark:text-[#f1f1f3]">
                  Switch Course
                </h3>
                {semester && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Semester {semester}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSwitcherOpen(false)}
                aria-label="Close subject switcher"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mt-3 mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by course name or code..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#161618] text-[#172554] dark:text-[#f1f1f3] placeholder:text-slate-400 focus:outline-2 focus:outline-[#172554] dark:focus:outline-[#e08564]"
              />
            </div>

            {/* Courses list */}
            <div className="flex-1 overflow-y-auto space-y-1 mt-2 divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((c) => {
                  const isCurrent = c.id === subject.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        acknowledgeSelection();
                        onSelectSubject(c.id);
                        setSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? 'bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40'
                          : 'hover:bg-slate-50 dark:hover:bg-[#2a2a30]'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="block truncate text-xs sm:text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                          {c.name}
                        </span>
                        {(c.code || c.courseType) && (
                          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                            {c.code ? `${c.code} · ` : ''}
                            {c.courseType}
                          </span>
                        )}
                      </div>
                      {isCurrent ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#172554] dark:bg-[#e08564] text-white">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </span>
                      ) : null}
                    </button>
                  );
                })
              ) : (
                <p className="py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  No courses match “{query.trim()}”.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

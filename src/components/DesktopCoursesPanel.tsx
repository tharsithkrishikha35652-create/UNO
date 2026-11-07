import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { transitions } from '../motion';
import { AlertCircle, BookOpen, Check, CheckCircle2, Circle, GraduationCap, PencilLine, Search, X } from 'lucide-react';
import { acknowledgeSelection } from '../haptics';
import type { PresetCourse, SemesterNumber } from './SubjectSelectionDialog';
import type {
  CourseProgress,
  SemesterCourseRow,
  SemesterElectiveRow,
} from './SemesterCourseDashboard';

interface DesktopCoursesPanelProps {
  semester: SemesterNumber | null;
  courses: SemesterCourseRow[];
  electiveSlots: SemesterElectiveRow[];
  electiveOptions: Record<string, PresetCourse[]>;
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onCalculateGpa: () => void;
}

function CourseProgressStatus({ progress }: { progress: CourseProgress }) {
  const reduceMotion = useReducedMotion();
  const isComplete = progress === 'Calculated' || progress === 'Marks completed';
  const isMissing = progress === 'Missing information';
  const isInProgress = progress === 'Marks entered' || progress === 'In progress';

  const Icon = isComplete
    ? CheckCircle2
    : isMissing
      ? AlertCircle
      : isInProgress
        ? PencilLine
        : Circle;
  const iconClass = isComplete
    ? 'text-emerald-700'
    : isMissing
      ? 'text-amber-700'
      : isInProgress
        ? 'text-blue-800'
        : 'text-slate-400';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={progress}
        className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-700"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
        transition={transitions.feedback}
      >
        <Icon className={`h-4 w-4 ${iconClass}`} aria-hidden="true" />
        {progress}
      </motion.span>
    </AnimatePresence>
  );
}

export const DesktopCoursesPanel: React.FC<DesktopCoursesPanelProps> = ({
  semester,
  courses,
  electiveSlots,
  electiveOptions,
  selectedSubjectId,
  allCoursesCalculated,
  onSelectCourse,
  onSelectElective,
  onCalculateGpa,
}) => {
  const [expandedElectiveSlot, setExpandedElectiveSlot] = useState<string | null>(null);
  const [electiveQuery, setElectiveQuery] = useState('');

  useEffect(() => {
    setElectiveQuery('');
  }, [expandedElectiveSlot, semester]);

  if (semester === null) {
    return (
      <section className="mx-auto my-6 max-w-xl rounded-2xl border border-slate-300 bg-white px-6 py-6 text-center shadow-sm">
        <h1 className="text-lg font-black text-[#172554]">Choose your semester</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Select a semester from the menu at the top right to see its courses and start entering marks.
        </p>
      </section>
    );
  }

  const courseCount = courses.length + electiveSlots.length;
  const professionalElectiveSlots = electiveSlots.filter(
    (entry) => !entry.slot.toLowerCase().includes('open')
  );
  const openElectiveSlots = electiveSlots.filter(
    (entry) => entry.slot.toLowerCase().includes('open')
  );

  const renderElectiveSlot = ({ slot, course, subject, progress }: SemesterElectiveRow) => {
    const expanded = expandedElectiveSlot === slot;
    const options = electiveOptions[slot] ?? [];
    const filteredOptions = options.filter((option) => {
      if (!electiveQuery.trim()) return true;
      return option.name.toLowerCase().includes(electiveQuery.trim().toLowerCase());
    });

    return (
      <li
        key={slot}
        className={`rounded-xl border transition-colors ${
          expanded
            ? 'border-indigo-400 bg-indigo-50/50'
            : subject?.id === selectedSubjectId
              ? 'border-blue-200 bg-blue-50/50'
              : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex min-h-14 items-center gap-4 px-4 py-3">
          <button
            type="button"
            onClick={() => course ? onSelectCourse(course) : setExpandedElectiveSlot((current) => current === slot ? null : slot)}
            aria-pressed={subject?.id === selectedSubjectId}
            className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <span className="min-w-0">
              <span className="block text-xs font-semibold text-slate-500">{slot}</span>
              <span className="mt-0.5 block truncate text-sm font-bold text-[#172554]">
                {course?.name ?? 'Choose elective'}
              </span>
            </span>
            {course ? (
              <CourseProgressStatus progress={progress} />
            ) : (
              <BookOpen className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setExpandedElectiveSlot((current) => current === slot ? null : slot)}
            aria-label={`${expanded ? 'Hide' : 'Show'} ${slot} choices`}
            aria-expanded={expanded}
            className="min-h-10 shrink-0 rounded-lg border border-slate-300 px-3 text-xs font-bold text-[#172554] hover:border-[#172554] hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            {expanded ? 'Close choices' : course ? 'Change' : 'Choose'}
          </button>
        </div>

        {expanded && (
          <div className="border-t border-slate-200 p-4 pt-3">
            {/* Elective Search Input */}
            <div className="mb-3">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={electiveQuery}
                  onChange={(e) => setElectiveQuery(e.target.value)}
                  placeholder="Search electives…"
                  className="w-full rounded-lg border border-slate-300 bg-white py-1.5 pl-8 pr-8 text-xs font-medium text-[#172554] placeholder:text-slate-400 focus:border-[#172554] focus:outline-none focus:ring-1 focus:ring-[#172554] transition-colors"
                />
                {electiveQuery && (
                  <button
                    type="button"
                    onClick={() => setElectiveQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer rounded-full"
                    aria-label="Clear elective search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            <ul className="grid gap-2 sm:grid-cols-2" aria-label={`Available choices for ${slot}`}>
              {filteredOptions.length === 0 ? (
                <li className="col-span-2 py-4 text-center">
                  <p className="text-xs font-semibold text-slate-500">
                    {electiveQuery.trim()
                      ? `No electives found matching "${electiveQuery.trim()}".`
                      : 'No choices available for this slot.'}
                  </p>
                  {electiveQuery.trim() && (
                    <button
                      type="button"
                      onClick={() => setElectiveQuery('')}
                      className="mt-1.5 text-xs font-bold text-[#172554] hover:underline cursor-pointer"
                    >
                      Clear search
                    </button>
                  )}
                </li>
              ) : (
                filteredOptions.map((option) => {
                  const isSelectedInThisSlot = option.id === course?.id || option.code === course?.code;
                  const isChosenInOtherSlot = electiveSlots.some(
                    (s) => s.slot !== slot && s.course && (s.course.id === option.id || (Boolean(s.course.code) && s.course.code === option.code))
                  );

                  return (
                    <li key={option.id}>
                      <button
                        type="button"
                        disabled={isChosenInOtherSlot}
                        onClick={() => {
                          onSelectCourse(option);
                          setExpandedElectiveSlot(null);
                        }}
                        className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#172554] ${
                          isSelectedInThisSlot
                            ? 'border-[#172554] bg-blue-50/80'
                            : isChosenInOtherSlot
                              ? 'cursor-not-allowed border-slate-200 bg-slate-100/60 opacity-60'
                              : 'border-slate-300 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold text-[#172554]">{option.name}</span>
                        </span>
                        {isSelectedInThisSlot ? (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#172554] text-white">
                            <Check className="h-3 w-3 stroke-[3]" aria-label="Selected" />
                          </span>
                        ) : isChosenInOtherSlot ? (
                          <span className="shrink-0 text-[10px] font-bold text-slate-400">
                            Already selected
                          </span>
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <section className="mx-auto max-w-4xl" aria-labelledby="desktop-courses-title">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 id="desktop-courses-title" className="text-xl font-black text-[#172554]">
            Semester {semester} Courses
          </h1>
          <p className="mt-1 text-sm text-slate-600">Select a course to edit its marks.</p>
        </div>
        <p className="shrink-0 text-xs font-semibold text-slate-600" aria-live="polite">
          {courseCount} course{courseCount === 1 ? '' : 's'} in this semester
        </p>
      </header>

      <div className="space-y-6">
        {/* Core Courses */}
        <section aria-labelledby="desktop-core-courses-title">
          <h2 id="desktop-core-courses-title" className="mb-2 text-xs font-black text-slate-600">
            Core Courses
          </h2>
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {courses.map(({ course, subject, progress }) => (
              <li key={course.id}>
                <button
                  type="button"
                  onClick={() => { acknowledgeSelection(); onSelectCourse(course); }}
                  aria-pressed={subject?.id === selectedSubjectId}
                  className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                    subject?.id === selectedSubjectId ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[#172554]">{course.name}</span>
                  </span>
                  <CourseProgressStatus progress={progress} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Professional Electives (kept distinct) */}
        {professionalElectiveSlots.length > 0 && (
          <section aria-labelledby="desktop-professional-electives-title">
            <h2 id="desktop-professional-electives-title" className="mb-2 text-xs font-black text-slate-600">
              Professional Electives
            </h2>
            <ul className="space-y-2">
              {professionalElectiveSlots.map(renderElectiveSlot)}
            </ul>
          </section>
        )}

        {/* Open Electives (kept distinct) */}
        {openElectiveSlots.length > 0 && (
          <section aria-labelledby="desktop-open-electives-title">
            <h2 id="desktop-open-electives-title" className="mb-2 text-xs font-black text-slate-600">
              Open Electives
            </h2>
            <ul className="space-y-2">
              {openElectiveSlots.map(renderElectiveSlot)}
            </ul>
          </section>
        )}

      </div>

      {allCoursesCalculated && (
        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-semibold text-emerald-900">
            All courses in Semester {semester} have calculated marks and grades. You can calculate the semester GPA when ready.
          </p>
          <button
            type="button"
            onClick={onCalculateGpa}
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Calculate GPA
          </button>
        </div>
      )}
    </section>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { BookOpen, Check, CheckCircle2, Circle, Pencil, PencilLine, X } from 'lucide-react';
import type { SubjectData } from '../types';
import type { PresetCourse, SemesterNumber } from './SubjectSelectionDialog';
import type {
  CourseProgress,
  SemesterCourseRow,
  SemesterElectiveRow,
} from './SemesterCourseDashboard';
import { motionVariants, transitions } from '../motion';

interface MobileCoursesSheetProps {
  isOpen: boolean;
  semester: SemesterNumber | null;
  courses: SemesterCourseRow[];
  electiveSlots: SemesterElectiveRow[];
  electiveOptions: Record<string, PresetCourse[]>;
  otherCourses: Array<{ subject: SubjectData; progress: CourseProgress }>;
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onClose: () => void;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectOtherCourse: (subject: SubjectData) => void;
  onCalculateGpa: () => void;
}

function ProgressIndicator({ progress }: { progress: CourseProgress }) {
  const reduceMotion = useReducedMotion();
  const Icon = progress === 'Calculated'
    ? CheckCircle2
    : progress === 'Marks entered'
      ? PencilLine
      : Circle;
  const iconColor = progress === 'Calculated'
    ? 'text-emerald-700'
    : progress === 'Marks entered'
      ? 'text-blue-800'
      : 'text-slate-400';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={progress}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.85 }}
        transition={transitions.feedback}
      >
        <Icon className={`h-4 w-4 ${iconColor}`} aria-hidden="true" />
        {progress}
      </motion.span>
    </AnimatePresence>
  );
}

export const MobileCoursesSheet: React.FC<MobileCoursesSheetProps> = (props) => (
  <AnimatePresence initial={false}>
    {props.isOpen && <MobileCoursesSheetBody {...props} />}
  </AnimatePresence>
);

const MobileCoursesSheetBody: React.FC<MobileCoursesSheetProps> = ({
  isOpen,
  semester,
  courses,
  electiveSlots,
  electiveOptions,
  otherCourses,
  selectedSubjectId,
  allCoursesCalculated,
  onClose,
  onSelectCourse,
  onSelectOtherCourse,
  onCalculateGpa,
}) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(true);
  const [expandedElectiveSlot, setExpandedElectiveSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (restoreFocusRef.current) previouslyFocused?.focus();
      restoreFocusRef.current = true;
    };
  }, [isOpen, onClose]);

  const courseCount = courses.length + electiveSlots.length + otherCourses.length;

  const professionalElectiveSlots = electiveSlots.filter(
    (entry) => !entry.slot.toLowerCase().includes('open')
  );
  const openElectiveSlots = electiveSlots.filter(
    (entry) => entry.slot.toLowerCase().includes('open')
  );

  const renderElectiveSlotRow = ({ slot, course, subject, progress }: SemesterElectiveRow) => {
    const isExpanded = expandedElectiveSlot === slot;
    const options = electiveOptions[slot] ?? [];

    return (
      <li
        key={slot}
        className={`rounded-xl border transition-colors ${
          isExpanded
            ? 'border-indigo-400 bg-indigo-50/50'
            : subject?.id === selectedSubjectId
              ? 'border-blue-200 bg-blue-50/50'
              : 'border-slate-200 bg-white'
        }`}
      >
        <div className="flex min-h-14 items-center justify-between gap-3 p-3">
          <button
            type="button"
            onClick={() => {
              if (course) {
                onSelectCourse(course);
              } else {
                setExpandedElectiveSlot((current) => current === slot ? null : slot);
              }
            }}
            aria-pressed={subject?.id === selectedSubjectId}
            aria-expanded={isExpanded}
            aria-controls={`elective-options-${slot.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-bold text-slate-500">{slot}</span>
              <span className="mt-0.5 block truncate text-sm font-bold text-[#172554]">
                {course?.name ?? 'Choose elective'}
              </span>
              {course && (course.code || course.type) && (
                <span className="mt-0.5 block text-[11px] text-slate-500">
                  {course.code}{course.code && course.type ? ' · ' : ''}{course.type}
                </span>
              )}
            </span>
            {course ? (
              <ProgressIndicator progress={progress} />
            ) : (
              <BookOpen className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setExpandedElectiveSlot((current) => current === slot ? null : slot)}
            aria-label={`${isExpanded ? 'Hide' : 'Change'} choices for ${slot}`}
            aria-expanded={isExpanded}
            aria-controls={`elective-options-${slot.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 text-xs font-bold text-[#172554] hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isExpanded ? 'Close' : course ? 'Change' : 'Choose'}</span>
          </button>
        </div>

        {isExpanded && (
          <div className="elective-options-expansion border-t border-slate-200 p-3 pt-2">
            <div className="mb-2">
              <p className="text-[10px] font-black text-slate-500">
                Available in Semester {semester}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Only choices for this semester and slot are shown.
              </p>
            </div>

            <ul
              id={`elective-options-${slot.replace(/\s+/g, '-').toLowerCase()}`}
              className="max-h-64 space-y-1.5 overflow-y-auto pr-1"
            >
              {options.map((option) => {
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
                      className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                        isSelectedInThisSlot
                          ? 'border-[#172554] bg-blue-50/80'
                          : isChosenInOtherSlot
                            ? 'cursor-not-allowed border-slate-200 bg-slate-100/60 opacity-60'
                            : 'border-slate-300 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-[#172554]">
                          {option.name}
                        </span>
                        <span className="block text-[10px] text-slate-500">
                          {option.code} · {option.type}
                        </span>
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
              })}
            </ul>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <motion.button
        type="button"
        tabIndex={-1}
        aria-label="Close courses"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/55"
        variants={reduceMotion ? undefined : motionVariants.backdrop}
        initial={reduceMotion ? { opacity: 1 } : 'initial'}
        animate="animate"
        exit="exit"
      />
      <motion.section
        id="mobile-courses-sheet"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-courses-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border border-slate-300 bg-white shadow-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        variants={reduceMotion ? undefined : motionVariants.sheet}
        initial={reduceMotion ? { y: 0 } : 'initial'}
        animate="animate"
        exit="exit"
      >
        <div className="flex justify-center pt-2" aria-hidden="true">
          <span className="h-1 w-14 rounded-full bg-slate-300" />
        </div>
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3.5">
          <div className="min-w-0">
            <h2 id="mobile-courses-title" className="text-base font-black text-[#172554]">Courses</h2>
            {semester !== null && (
              <p className="mt-0.5 text-xs text-slate-600">
                Semester {semester} · {courseCount} courses
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close courses"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {semester === null ? (
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Select a semester from the menu at the top right to see its courses and start entering marks.
            </p>
          ) : (
            <>
              {/* 1. Core Courses */}
              <section aria-labelledby="mobile-core-courses-heading">
                <h3 id="mobile-core-courses-heading" className="mb-2 text-xs font-black text-slate-600">
                  Core Courses
                </h3>
                <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                  {courses.map(({ course, subject, progress }) => (
                    <li key={course.id}>
                      <button
                        type="button"
                        onClick={() => onSelectCourse(course)}
                        aria-pressed={subject?.id === selectedSubjectId}
                        className={`flex min-h-14 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                          subject?.id === selectedSubjectId
                            ? 'bg-blue-50/80'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold text-[#172554]">
                            {course.name}
                          </span>
                          {(course.code || course.type) && (
                            <span className="mt-0.5 block truncate text-[11px] text-slate-500">
                              {course.code}{course.code && course.type ? ' · ' : ''}{course.type}
                            </span>
                          )}
                        </span>
                        <ProgressIndicator progress={progress} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              {/* 2. Professional Electives (kept distinct) */}
              {professionalElectiveSlots.length > 0 && (
                <section aria-labelledby="mobile-professional-electives-heading">
                  <h3 id="mobile-professional-electives-heading" className="mb-2 text-xs font-black text-slate-600">
                    Professional Electives
                  </h3>
                  <ul className="space-y-2">
                    {professionalElectiveSlots.map(renderElectiveSlotRow)}
                  </ul>
                </section>
              )}

              {/* 3. Open Electives (kept distinct) */}
              {openElectiveSlots.length > 0 && (
                <section aria-labelledby="mobile-open-electives-heading">
                  <h3 id="mobile-open-electives-heading" className="mb-2 text-xs font-black text-slate-600">
                    Open Electives
                  </h3>
                  <ul className="space-y-2">
                    {openElectiveSlots.map(renderElectiveSlotRow)}
                  </ul>
                </section>
              )}

              {/* 4. Other courses */}
              {otherCourses.length > 0 && (
                <section aria-labelledby="mobile-other-courses-heading">
                  <h3 id="mobile-other-courses-heading" className="mb-2 text-xs font-black text-slate-600">
                    Other Courses
                  </h3>
                  <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                    {otherCourses.map(({ subject, progress }) => (
                      <li key={subject.id}>
                        <button
                          type="button"
                          onClick={() => onSelectOtherCourse(subject)}
                          aria-pressed={subject.id === selectedSubjectId}
                          className={`flex min-h-14 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                            subject.id === selectedSubjectId
                              ? 'bg-blue-50/80'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-[#172554]">
                              {subject.name || 'Other course'}
                            </span>
                            {subject.code && (
                              <span className="mt-0.5 block font-mono text-[11px] text-slate-500">
                                {subject.code}
                              </span>
                            )}
                          </span>
                          <ProgressIndicator progress={progress} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>

        {semester !== null && allCoursesCalculated && (
          <footer className="border-t border-slate-200 bg-white px-4 py-3">
            <button
              type="button"
              onClick={onCalculateGpa}
              className="min-h-11 w-full rounded-xl border border-[#172554] bg-white px-4 py-2.5 text-xs font-bold text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              Calculate GPA
            </button>
          </footer>
        )}
      </motion.section>
    </div>
  );
};

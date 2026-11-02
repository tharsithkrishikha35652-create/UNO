import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react';
import {
  AlertCircle,
  BookOpen,
  Check,
  CheckCircle2,
  Circle,
  Pencil,
  PencilLine,
  Search,
  X,
} from 'lucide-react';
import type { SubjectData } from '../types';
import type { PresetCourse, SemesterNumber } from './SubjectSelectionDialog';
import { isObsoleteCurriculumCourse } from '../calculatorUtils';
import type {
  CourseProgress,
  SemesterCourseRow,
  SemesterElectiveRow,
} from './SemesterCourseDashboard';
import { motionVariants, transitions } from '../motion';
import { acknowledgeInteraction, acknowledgeSelection } from '../haptics';

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
  const iconColor = isComplete
    ? 'text-emerald-700 dark:text-emerald-400'
    : isMissing
      ? 'text-amber-700 dark:text-amber-400'
      : isInProgress
        ? 'text-blue-800 dark:text-blue-400'
        : 'text-slate-400 dark:text-slate-500';

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={progress}
        className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
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
  onClose,
  onSelectCourse,
  onSelectOtherCourse,
}) => {
  const reduceMotion = useReducedMotion();
  const dragControls = useDragControls();
  const dialogRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef(true);
  const [expandedElectiveSlot, setExpandedElectiveSlot] = useState<string | null>(null);
  const [courseQuery, setCourseQuery] = useState('');
  const [sheetHeight, setSheetHeight] = useState(0);

  useEffect(() => {
    if (!sheetRef.current) return;
    const updateHeight = () => setSheetHeight(sheetRef.current?.getBoundingClientRect().height ?? 0);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(sheetRef.current);
    return () => observer.disconnect();
  }, []);

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
  const normalizedQuery = courseQuery.trim().toLowerCase();
  const matchesCourseQuery = (course?: { name?: string; code?: string }, label = '') =>
    !normalizedQuery || `${course?.name ?? ''} ${course?.code ?? ''} ${label}`.toLowerCase().includes(normalizedQuery);
  const visibleCourses = courses.filter(({ course }) => !isObsoleteCurriculumCourse(course) && matchesCourseQuery(course));
  const visibleOtherCourses = otherCourses.filter(({ subject }) => !isObsoleteCurriculumCourse(subject) && matchesCourseQuery(subject));

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
            ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
            : subject?.id === selectedSubjectId
              ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/30'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618]'
        }`}
      >
        <div className="flex min-h-14 items-center justify-between gap-3 p-3">
          <button
            type="button"
            onClick={() => {
              if (course) {
                acknowledgeSelection();
                onSelectCourse(course);
              } else {
                setExpandedElectiveSlot((current) => current === slot ? null : slot);
              }
            }}
            aria-pressed={subject?.id === selectedSubjectId}
            aria-expanded={isExpanded}
            aria-controls={`elective-options-${slot.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564]"
          >
            <span className="min-w-0">
              <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">{slot}</span>
              <span className="mt-0.5 block truncate text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                {course?.name ?? 'Choose elective'}
              </span>
              {course && (course.code || course.type) && (
                <span className="mt-0.5 block text-[11px] text-slate-500 dark:text-slate-400">
                  {course.code}{course.code && course.type ? ' · ' : ''}{course.type}
                </span>
              )}
            </span>
            {course ? (
              <ProgressIndicator progress={progress} />
            ) : (
              <BookOpen className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setExpandedElectiveSlot((current) => current === slot ? null : slot)}
            aria-label={`${isExpanded ? 'Hide' : 'Change'} choices for ${slot}`}
            aria-expanded={isExpanded}
            aria-controls={`elective-options-${slot.replace(/\s+/g, '-').toLowerCase()}`}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-600 px-2.5 text-xs font-bold text-[#172554] dark:text-[#f1f1f3] hover:bg-slate-50 dark:hover:bg-[#202024] transition-colors focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isExpanded ? 'Close' : course ? 'Change' : 'Choose'}</span>
          </button>
        </div>

        {isExpanded && (
          <div className="elective-options-expansion border-t border-slate-200 dark:border-slate-700 p-3 pt-2">
            <div className="mb-2">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400">
                Available in Semester {semester}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">
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
                        acknowledgeSelection();
                        onSelectCourse(option);
                        setExpandedElectiveSlot(null);
                      }}
                      className={`flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564] ${
                        isSelectedInThisSlot
                          ? 'border-[#172554] dark:border-[#e08564] bg-blue-50/80 dark:bg-blue-950/40'
                          : isChosenInOtherSlot
                            ? 'cursor-not-allowed border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/40 opacity-60'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161618] hover:bg-slate-50 dark:hover:bg-[#202024]'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold text-[#172554] dark:text-[#f1f1f3]">
                          {option.name}
                        </span>
                        <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                          {option.code} · {option.type}
                        </span>
                      </span>

                      {isSelectedInThisSlot ? (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#172554] dark:bg-[#e08564] text-white">
                          <Check className="h-3 w-3 stroke-[3]" aria-label="Selected" />
                        </span>
                      ) : isChosenInOtherSlot ? (
                        <span className="shrink-0 text-[10px] font-bold text-slate-400">
                          Already selected
                        </span>
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300 dark:border-slate-600" aria-hidden="true" />
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
    <div className="fixed inset-0 z-50 md:hidden" data-no-swipe>
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
        ref={(node) => {
          dialogRef.current = node;
          sheetRef.current = node;
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-courses-title"
        className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] shadow-2xl"
        style={{ paddingBottom: 'var(--safe-area-bottom, env(safe-area-inset-bottom, 0px))' }}
        initial={reduceMotion ? { y: 0 } : { y: '100%' }}
        animate={{ y: 0, transition: reduceMotion ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
        exit={reduceMotion ? { y: 0 } : { y: '100%', transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
        drag={reduceMotion ? false : 'y'}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: sheetHeight }}
        dragElastic={0.04}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          const dismissThreshold = sheetHeight * 0.25;
          if (info.offset.y > dismissThreshold || info.velocity.y > 650) {
            acknowledgeInteraction();
            onClose();
          }
        }}
      >
        {/* Visible, dedicated drag handle */}
        <button
          type="button"
          aria-label="Drag down to close courses"
          onPointerDown={(event) => dragControls.start(event)}
          className="flex touch-none cursor-grab justify-center pt-2.5 pb-1 active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564]"
        >
          <span className="h-1.5 w-14 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
        </button>

        <header className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="min-w-0">
            <h2 id="mobile-courses-title" className="text-base font-black text-[#172554] dark:text-[#f1f1f3]">Courses</h2>
            {semester !== null && (
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                Semester {semester} · {courseCount} courses
              </p>
            )}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close courses"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-[#172554] dark:text-[#f1f1f3] hover:bg-slate-50 dark:hover:bg-[#2a2a30] focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {/* Search input */}
        <div className="px-4 pt-3 pb-1 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              type="text"
              value={courseQuery}
              onChange={(e) => setCourseQuery(e.target.value)}
              placeholder="Search course name or code..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#161618] text-[#172554] dark:text-[#f1f1f3] placeholder:text-slate-400 focus:outline-2 focus:outline-[#172554] dark:focus:outline-[#e08564]"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
          {semester === null ? (
            <p className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] p-4 text-sm text-slate-700 dark:text-slate-300">
              Select a semester from the menu at the top right to see its courses and start entering marks.
            </p>
          ) : (
            <>
              {/* 1. Core Courses */}
              {visibleCourses.length > 0 && (
                <section aria-labelledby="mobile-core-courses-heading">
                  <h3 id="mobile-core-courses-heading" className="mb-2 text-xs font-black text-slate-600 dark:text-slate-400">
                    Core Courses
                  </h3>
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618]">
                    {visibleCourses.map(({ course, subject, progress }) => (
                      <li key={course.id}>
                        <button
                          type="button"
                          onClick={() => {
                            acknowledgeSelection();
                            onSelectCourse(course);
                          }}
                          aria-pressed={subject?.id === selectedSubjectId}
                          className={`flex min-h-14 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564] ${
                            subject?.id === selectedSubjectId
                              ? 'bg-blue-50/80 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50 dark:hover:bg-[#202024]'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                              {course.name}
                            </span>
                            {(course.code || course.type) && (
                              <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">
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
              )}

              {/* 2. Professional Electives */}
              {professionalElectiveSlots.filter(({ course, slot }) => matchesCourseQuery(course ?? undefined, slot)).length > 0 && (
                <section aria-labelledby="mobile-professional-electives-heading">
                  <h3 id="mobile-professional-electives-heading" className="mb-2 text-xs font-black text-slate-600 dark:text-slate-400">
                    Professional Electives
                  </h3>
                  <ul className="space-y-2">
                    {professionalElectiveSlots.filter(({ course, slot }) => matchesCourseQuery(course ?? undefined, slot)).map(renderElectiveSlotRow)}
                  </ul>
                </section>
              )}

              {/* 3. Open Electives */}
              {openElectiveSlots.filter(({ course, slot }) => matchesCourseQuery(course ?? undefined, slot)).length > 0 && (
                <section aria-labelledby="mobile-open-electives-heading">
                  <h3 id="mobile-open-electives-heading" className="mb-2 text-xs font-black text-slate-600 dark:text-slate-400">
                    Open Electives
                  </h3>
                  <ul className="space-y-2">
                    {openElectiveSlots.filter(({ course, slot }) => matchesCourseQuery(course ?? undefined, slot)).map(renderElectiveSlotRow)}
                  </ul>
                </section>
              )}

              {/* 4. Other courses */}
              {visibleOtherCourses.length > 0 && (
                <section aria-labelledby="mobile-other-courses-heading">
                  <h3 id="mobile-other-courses-heading" className="mb-2 text-xs font-black text-slate-600 dark:text-slate-400">
                    Other Courses
                  </h3>
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618]">
                    {visibleOtherCourses.map(({ subject, progress }) => (
                      <li key={subject.id}>
                        <button
                          type="button"
                          onClick={() => {
                            acknowledgeSelection();
                            onSelectOtherCourse(subject);
                          }}
                          aria-pressed={subject.id === selectedSubjectId}
                          className={`flex min-h-14 w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564] ${
                            subject.id === selectedSubjectId
                              ? 'bg-blue-50/80 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50 dark:hover:bg-[#202024]'
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                              {subject.name}
                            </span>
                            {subject.code && (
                              <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">
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

              {normalizedQuery && visibleCourses.length === 0 && visibleOtherCourses.length === 0 &&
                electiveSlots.every(({ course, slot }) => !matchesCourseQuery(course ?? undefined, slot)) && (
                <p className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] p-4 text-sm text-slate-700 dark:text-slate-300" role="status">
                  No courses match “{courseQuery.trim()}”. Try a course name or code.
                </p>
              )}
            </>
          )}
        </div>
      </motion.section>
    </div>
  );
};

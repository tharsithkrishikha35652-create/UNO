import React from 'react';
import { AlertCircle, BookOpen, CheckCircle2, Circle, GraduationCap, Pencil, PencilLine } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { SubjectData } from '../types';
import type { PresetCourse } from './SubjectSelectionDialog';
import { motionVariants, transitions } from '../motion';

export type CourseProgress = 'Not started' | 'In progress' | 'Marks completed' | 'Missing information' | 'Calculated' | 'Marks entered';

export interface SemesterCourseRow {
  course: PresetCourse;
  subject: SubjectData | null;
  progress: CourseProgress;
}

export interface SemesterElectiveRow {
  slot: string;
  course: PresetCourse | null;
  subject: SubjectData | null;
  progress: CourseProgress;
}

interface SemesterCourseDashboardProps {
  semester: number;
  courses: SemesterCourseRow[];
  electiveSlots: SemesterElectiveRow[];
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onCalculateGpa: () => void;
  estimatedGpa?: {
    gpa: number | null;
    completedCount: number;
    totalCount: number;
    isProvisional: boolean;
  };
}

function ProgressMark({ progress, isSelected }: { progress: CourseProgress; isSelected?: boolean }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={progress}
        className="inline-flex items-center justify-center shrink-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
        transition={transitions.feedback}
      >
        {progress === 'Calculated' || progress === 'Marks completed' ? (
          <CheckCircle2
            className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}
            aria-label="Marks completed"
          />
        ) : progress === 'Missing information' ? (
          <AlertCircle
            className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-200' : 'text-amber-600'}`}
            aria-label="Missing information"
          />
        ) : progress === 'Marks entered' || progress === 'In progress' ? (
          <PencilLine
            className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-200' : 'text-blue-800'}`}
            aria-label="In progress"
          />
        ) : (
          <Circle
            className={`h-3 w-3 shrink-0 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}
            aria-label="Not started"
          />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export const SemesterCourseDashboard: React.FC<SemesterCourseDashboardProps> = ({
  semester,
  courses,
  electiveSlots,
  selectedSubjectId,
  allCoursesCalculated,
  onSelectCourse,
  onSelectElective,
  onCalculateGpa,
  estimatedGpa,
}) => {
  const reduceMotion = useReducedMotion();
  const courseItemMotion = reduceMotion ? {} : motionVariants.listItem;
  const courseProgress = [
    ...courses.map(({ progress }) => progress),
    ...electiveSlots.map(({ progress }) => progress),
  ];
  const calculatedCount = courseProgress.filter((p) => p === 'Calculated' || p === 'Marks completed').length;
  const inProgressCount = courseProgress.filter((p) => p === 'Marks entered' || p === 'In progress' || p === 'Missing information').length;
  const notStartedCount = courseProgress.filter((p) => p === 'Not started').length;

  return (
  <section className="mx-auto min-w-0 max-w-full" aria-labelledby="semester-courses-heading">
    <div className="mb-3.5 flex items-end justify-between gap-3">
      <div>
        <h1 id="semester-courses-heading" className="text-lg font-black text-[#172554] sm:text-xl">
          Semester {semester} Courses
        </h1>
        <p className="mt-0.5 text-xs text-slate-600">Select a course to edit its marks.</p>
      </div>
      <p className="shrink-0 text-[11px] font-semibold text-slate-600" aria-live="polite">
        {courseProgress.length} course{courseProgress.length === 1 ? '' : 's'} in this semester
      </p>
    </div>

    <dl className="mb-4 grid grid-cols-3 divide-x divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white text-center sm:max-w-md">
      <div className="px-2 py-2.5">
        <dt className="text-[10px] font-semibold text-slate-500">Completed</dt>
        <dd className="mt-0.5 text-base font-black tabular-nums text-emerald-700">{calculatedCount}</dd>
      </div>
      <div className="px-2 py-2.5">
        <dt className="text-[10px] font-semibold text-slate-500">In progress</dt>
        <dd className="mt-0.5 text-base font-black tabular-nums text-[#172554]">{inProgressCount}</dd>
      </div>
      <div className="px-2 py-2.5">
        <dt className="text-[10px] font-semibold text-slate-500">Awaiting marks</dt>
        <dd className="mt-0.5 text-base font-black tabular-nums text-slate-600">{notStartedCount}</dd>
      </div>
    </dl>

    {estimatedGpa && estimatedGpa.gpa !== null && (
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 dark:border-blue-900/40 dark:bg-blue-950/20 px-3.5 py-2.5 text-xs text-[#172554] dark:text-[#f1f1f3]">
        <div className="min-w-0">
          <span className="font-bold">
            {estimatedGpa.isProvisional ? 'Provisional Estimated GPA' : 'Semester GPA'}
          </span>
          <span className="block text-[11px] text-slate-500 dark:text-slate-400">
            {estimatedGpa.isProvisional
              ? `Based on ${estimatedGpa.completedCount} of ${estimatedGpa.totalCount} completed courses`
              : 'All courses calculated'}
          </span>
        </div>
        <span className="text-lg font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
          {estimatedGpa.gpa.toFixed(2)}
        </span>
      </div>
    )}

    {/* Staggered alternating zig-zag list on mobile, clean two-column grid on desktop */}
    <div className="w-full">
      <motion.ul
        aria-label={`Semester ${semester} courses`}
        className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-2.5"
        variants={reduceMotion ? undefined : motionVariants.list}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
      >
        {courses.map(({ course, subject, progress }) => {
          const isSelected =
            (Boolean(subject) && (subject!.id === selectedSubjectId || `course_${subject!.id}` === selectedSubjectId || subject!.id === selectedSubjectId.replace(/^course_/, ''))) ||
            course.id === selectedSubjectId ||
            `course_${course.id}` === selectedSubjectId ||
            (Boolean(course.code) && Boolean(subject?.code) && course.code.toUpperCase() === subject?.code.toUpperCase() && subject?.id === selectedSubjectId);

          return (
            <motion.li
              key={course.id}
              className="w-full"
              variants={courseItemMotion}
              layout="position"
            >
              <motion.button
                type="button"
                onClick={() => onSelectCourse(course)}
                aria-pressed={isSelected}
                aria-label={`${course.name}, ${progress}`}
                title={`${course.name}${course.code ? ` · ${course.code}` : ''} — ${progress}`}
                className={`group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] cursor-pointer dark:border-slate-700 dark:bg-[#161618] ${
                  isSelected
                    ? 'font-extrabold text-black dark:text-white'
                    : 'text-black hover:border-slate-300 hover:bg-white dark:text-white dark:hover:border-slate-600 dark:hover:bg-[#161618]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  {course.code && (
                    <span
                      className={`mb-0.5 block text-[11px] font-bold ${
                        isSelected ? 'text-black dark:text-white' : 'text-[#111111] dark:text-slate-300'
                      }`}
                    >
                      {course.code}
                    </span>
                  )}
                  <span className="block text-xs sm:text-sm font-bold leading-snug break-words whitespace-normal">
                    {course.name}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 pl-2">
                  <ProgressMark progress={progress} isSelected={isSelected} />
                </div>
              </motion.button>
            </motion.li>
          );
        })}

        {electiveSlots.map(({ slot, course, subject, progress }) => {
          const isSelected = subject?.id === selectedSubjectId;

          return (
            <motion.li
              key={slot}
              className="w-full"
              variants={courseItemMotion}
              layout="position"
            >
              <div
                className="group flex min-h-14 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-left text-black transition-colors dark:border-slate-700 dark:bg-[#161618] dark:text-white"
              >
                <button
                  type="button"
                  onClick={() => (course ? onSelectCourse(course) : onSelectElective(slot))}
                  aria-pressed={isSelected}
                  aria-label={`${slot}${course ? `: ${course.name}` : ', choose course'}${course ? `, ${progress}` : ''}`}
                  title={course ? `${slot}: ${course.name} — ${progress}` : `${slot}: choose an option`}
                  className={`min-w-0 flex-1 bg-white px-0 py-0 text-left cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] dark:bg-[#161618] ${
                    isSelected
                      ? 'font-extrabold text-black dark:text-white'
                      : 'text-black hover:text-black dark:text-white dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span
                      className={`inline-block text-[11px] font-bold tracking-wider uppercase ${
                        isSelected ? 'text-black dark:text-white' : 'text-[#111111] dark:text-slate-300'
                      }`}
                    >
                      {slot}
                    </span>
                  </div>
                  <span
                    className={`block text-xs sm:text-sm leading-snug break-words whitespace-normal ${
                      !course
                        ? 'italic font-medium text-black dark:text-white'
                        : 'font-bold'
                    }`}
                  >
                    {course?.name ?? ''}
                  </span>
                </button>

                <div className="shrink-0 flex items-center gap-2 pl-1 pr-0.5">
                  {course ? (
                    <>
                      <ProgressMark progress={progress} isSelected={isSelected} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectElective(slot);
                        }}
                        aria-label={`Change ${slot} course`}
                        title={`Change ${slot} course`}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                          isSelected
                            ? 'text-black dark:text-white'
                            : 'text-black hover:text-black dark:text-white dark:hover:text-white'
                        }`}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectElective(slot)}
                      aria-label={`Choose course for ${slot}`}
                      title={`Choose course for ${slot}`}
                      className={`inline-flex min-h-10 items-center gap-1.5 px-2.5 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                        isSelected
                          ? 'text-black dark:text-white'
                          : 'text-black hover:text-black dark:text-white dark:hover:text-white'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                      <span className="text-[11px] font-bold">Choose</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>

    {allCoursesCalculated && (
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <p className="text-xs font-semibold text-emerald-900">
          All courses in Semester {semester} have calculated marks and grades. You can calculate the semester GPA when ready.
        </p>
        <button
          type="button"
          onClick={onCalculateGpa}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-bold text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer shadow-xs"
        >
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Calculate GPA
        </button>
      </div>
    )}
  </section>
  );
};

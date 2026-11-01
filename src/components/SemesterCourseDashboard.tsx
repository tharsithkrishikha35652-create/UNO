import { isObsoleteCurriculumCourse } from '../calculatorUtils';
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
  otherCourses: Array<{ subject: SubjectData; progress: CourseProgress }>;
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onSelectOtherCourse: (subject: SubjectData) => void;
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
  otherCourses,
  selectedSubjectId,
  allCoursesCalculated,
  onSelectCourse,
  onSelectElective,
  onSelectOtherCourse,
  onCalculateGpa,
  estimatedGpa,
}) => {
  const reduceMotion = useReducedMotion();
  const courseItemMotion = reduceMotion ? {} : motionVariants.listItem;
  const courseProgress = [
    ...courses.map(({ progress }) => progress),
    ...electiveSlots.map(({ progress }) => progress),
    ...otherCourses.map(({ progress }) => progress),
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
        className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3"
        variants={reduceMotion ? undefined : motionVariants.list}
        initial={reduceMotion ? false : 'initial'}
        animate="animate"
      >
        {courses.filter(({ course }) => !isObsoleteCurriculumCourse(course)).map(({ course, subject, progress }, idx) => {
          const isSelected = subject?.id === selectedSubjectId;
          const isEven = idx % 2 === 0;

          return (
            <motion.li
              key={course.id}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
              variants={courseItemMotion}
              layout="position"
            >
              <motion.button
                type="button"
                onClick={() => onSelectCourse(course)}
                aria-pressed={isSelected}
                aria-label={`${course.name}, ${progress}`}
                title={`${course.name}${course.code ? ` · ${course.code}` : ''} — ${progress}`}
                className={`group flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-[#172554] bg-[#172554] text-white shadow-sm'
                    : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554] hover:bg-slate-50'
                }`}
                animate={{ scale: isSelected && !reduceMotion ? 1.01 : 1 }}
                transition={transitions.feedback}
              >
                <div className="min-w-0 flex-1">
                  {course.code && (
                    <span
                      className={`block text-[10px] font-bold font-mono mb-0.5 ${
                        isSelected ? 'text-blue-100/80' : 'text-slate-500'
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

        {electiveSlots.map(({ slot, course, subject, progress }, idx) => {
          const isSelected = subject?.id === selectedSubjectId;
          const globalIdx = courses.length + idx;
          const isEven = globalIdx % 2 === 0;

          return (
            <motion.li
              key={slot}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
              variants={courseItemMotion}
              layout="position"
            >
              <div
                className={`group flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all shadow-xs ${
                  isSelected
                    ? 'border-[#172554] bg-[#172554] text-white shadow-sm'
                    : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => (course ? onSelectCourse(course) : onSelectElective(slot))}
                  aria-pressed={isSelected}
                  aria-label={`${slot}${course ? `: ${course.name}` : ', choose course'}${course ? `, ${progress}` : ''}`}
                  title={course ? `${slot}: ${course.name} — ${progress}` : `${slot}: choose an option`}
                  className="min-w-0 flex-1 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554]"
                >
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className={`inline-block text-[10px] font-bold tracking-wide uppercase ${
                        isSelected ? 'text-blue-100/90' : 'text-slate-500'
                      }`}
                    >
                      {slot}
                    </span>
                    {course?.code && (
                      <span
                        className={`inline-block text-[10px] font-bold font-mono ${
                          isSelected ? 'text-blue-200/80' : 'text-slate-400'
                        }`}
                      >
                        · {course.code}
                      </span>
                    )}
                  </div>
                  <span
                    className={`block text-xs sm:text-sm font-bold leading-snug break-words whitespace-normal ${
                      !course ? 'italic font-medium text-slate-500' : ''
                    }`}
                  >
                    {course ? course.name : 'Choose elective course…'}
                  </span>
                </button>
                <div className="shrink-0 flex items-center gap-2 pl-1.5">
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
                        className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                          isSelected
                            ? 'border-white/30 text-white/90 hover:bg-white/15'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#172554]'
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
                      className={`flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                        isSelected
                          ? 'border-white/30 text-white hover:bg-white/15'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      <span className="text-[11px]">Choose</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.li>
          );
        })}

        {otherCourses.filter(({ subject }) => !isObsoleteCurriculumCourse(subject)).map(({ subject, progress }, idx) => {
          const isSelected = subject.id === selectedSubjectId;
          const globalIdx = courses.length + electiveSlots.length + idx;
          const isEven = globalIdx % 2 === 0;

          return (
            <motion.li
              key={subject.id}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
              variants={courseItemMotion}
              layout="position"
            >
              <motion.button
                type="button"
                onClick={() => onSelectOtherCourse(subject)}
                aria-pressed={isSelected}
                aria-label={`${subject.name || 'Other course'}, ${progress}`}
                title={`${subject.name || 'Other course'}${subject.code ? ` · ${subject.code}` : ''} — ${progress}`}
                className={`flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-[#172554] bg-[#172554] text-white shadow-sm'
                    : 'border-slate-300 bg-white text-[#172554] hover:border-[#172554] hover:bg-slate-50'
                }`}
                animate={{ scale: isSelected && !reduceMotion ? 1.01 : 1 }}
                transition={transitions.feedback}
              >
                <div className="min-w-0 flex-1">
                  {subject.code && (
                    <span
                      className={`block text-[10px] font-bold font-mono mb-0.5 ${
                        isSelected ? 'text-blue-100/80' : 'text-slate-500'
                      }`}
                    >
                      {subject.code}
                    </span>
                  )}
                  <span className="block text-xs sm:text-sm font-bold leading-snug break-words whitespace-normal">
                    {subject.name || 'Other course'}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 pl-2">
                  <ProgressMark progress={progress} isSelected={isSelected} />
                </div>
              </motion.button>
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

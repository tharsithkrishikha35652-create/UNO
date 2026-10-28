import React from 'react';
import { BookOpen, CheckCircle2, Circle, GraduationCap, Pencil, PencilLine } from 'lucide-react';
import type { SubjectData } from '../types';
import type { PresetCourse } from './SubjectSelectionDialog';

export type CourseProgress = 'Not started' | 'Marks entered' | 'Calculated';

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
}

function ProgressMark({ progress, isSelected }: { progress: CourseProgress; isSelected?: boolean }) {
  if (progress === 'Calculated') {
    return (
      <CheckCircle2
        className={`h-4 w-4 shrink-0 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}
        aria-label="Calculated"
      />
    );
  }
  if (progress === 'Marks entered') {
    return (
      <PencilLine
        className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-amber-200' : 'text-blue-800'}`}
        aria-label="Marks entered"
      />
    );
  }
  return (
    <Circle
      className={`h-3 w-3 shrink-0 ${isSelected ? 'text-white/60' : 'text-slate-400'}`}
      aria-label="Not started"
    />
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
}) => (
  <section className="mx-auto min-w-0 max-w-full" aria-labelledby="semester-courses-heading">
    <div className="mb-3.5 flex items-end justify-between gap-3">
      <div>
        <h1 id="semester-courses-heading" className="text-lg font-black uppercase tracking-wide text-[#172554] sm:text-xl">
          Semester {semester} courses
        </h1>
        <p className="mt-0.5 text-xs text-slate-600">Select a course to edit its marks.</p>
      </div>
      <p className="shrink-0 text-[11px] font-semibold text-slate-600" aria-live="polite">
        {courses.length + electiveSlots.length + otherCourses.length} course{courses.length + electiveSlots.length + otherCourses.length === 1 ? '' : 's'} in this semester
      </p>
    </div>

    {/* Staggered alternating zig-zag list on mobile, clean two-column grid on desktop */}
    <div className="w-full">
      <ul
        aria-label={`Semester ${semester} courses`}
        className="flex flex-col gap-2.5 sm:grid sm:grid-cols-2 sm:gap-3"
      >
        {courses.map(({ course, subject, progress }, idx) => {
          const isSelected = subject?.id === selectedSubjectId;
          const isEven = idx % 2 === 0;

          return (
            <li
              key={course.id}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
            >
              <button
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
              >
                <div className="min-w-0 flex-1">
                  {course.code && (
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
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
              </button>
            </li>
          );
        })}

        {electiveSlots.map(({ slot, course, subject, progress }, idx) => {
          const isSelected = subject?.id === selectedSubjectId;
          const globalIdx = courses.length + idx;
          const isEven = globalIdx % 2 === 0;

          return (
            <li
              key={slot}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
            >
              <div
                className={`flex min-h-[3.25rem] w-full items-stretch rounded-xl border transition-all shadow-xs ${
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
                  className={`flex min-w-0 flex-1 items-center justify-between gap-3 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#172554] cursor-pointer rounded-l-xl ${
                    !course ? 'rounded-r-xl' : ''
                  } ${isSelected ? 'text-white' : 'text-[#172554] hover:bg-slate-50'}`}
                >
                  <div className="min-w-0 flex-1">
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                        isSelected ? 'text-blue-100/80' : 'text-slate-500'
                      }`}
                    >
                      {slot}
                    </span>
                    <span
                      className={`block text-xs sm:text-sm font-bold leading-snug break-words whitespace-normal ${
                        !course ? 'italic font-medium text-slate-500' : ''
                      }`}
                    >
                      {course ? course.name : 'Choose elective course…'}
                    </span>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5 pl-2">
                    {course ? (
                      <ProgressMark progress={progress} isSelected={isSelected} />
                    ) : (
                      <BookOpen className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    )}
                  </div>
                </button>
                {course && (
                  <button
                    type="button"
                    onClick={() => onSelectElective(slot)}
                    aria-label={`Change ${slot} option`}
                    title={`Change ${slot} option`}
                    className={`flex w-11 shrink-0 items-center justify-center border-l transition-colors focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer rounded-r-xl ${
                      isSelected
                        ? 'border-white/20 text-white/90 hover:bg-white/10'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-[#172554]'
                    }`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          );
        })}

        {otherCourses.map(({ subject, progress }, idx) => {
          const isSelected = subject.id === selectedSubjectId;
          const globalIdx = courses.length + electiveSlots.length + idx;
          const isEven = globalIdx % 2 === 0;

          return (
            <li
              key={subject.id}
              className={`w-[89%] ${isEven ? 'self-start mr-auto ml-0' : 'self-end ml-auto mr-0'} sm:w-full sm:m-0 sm:self-auto`}
            >
              <button
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
              >
                <div className="min-w-0 flex-1">
                  {subject.code && (
                    <span
                      className={`block text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
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
              </button>
            </li>
          );
        })}
      </ul>
    </div>

    {allCoursesCalculated && (
      <div className="mt-4 flex flex-col gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-xs">
        <p className="text-xs font-semibold text-emerald-900">
          All courses in Semester {semester} have calculated marks and grades. You can calculate the semester GPA when ready.
        </p>
        <button
          type="button"
          onClick={onCalculateGpa}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer shadow-xs"
        >
          <GraduationCap className="h-4 w-4" aria-hidden="true" />
          Calculate GPA
        </button>
      </div>
    )}
  </section>
);

import React, { useState } from 'react';
import { BookOpen, Check, CheckCircle2, Circle, GraduationCap, PencilLine } from 'lucide-react';
import type { SubjectData } from '../types';
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
  otherCourses: Array<{ subject: SubjectData; progress: CourseProgress }>;
  selectedSubjectId: string;
  allCoursesCalculated: boolean;
  onSelectCourse: (course: PresetCourse) => void;
  onSelectElective: (slot: string) => void;
  onSelectOtherCourse: (subject: SubjectData) => void;
  onCalculateGpa: () => void;
}

function CourseProgressStatus({ progress }: { progress: CourseProgress }) {
  const Icon = progress === 'Calculated'
    ? CheckCircle2
    : progress === 'Marks entered'
      ? PencilLine
      : Circle;
  const iconClass = progress === 'Calculated'
    ? 'text-emerald-700'
    : progress === 'Marks entered'
      ? 'text-blue-800'
      : 'text-slate-400';

  return (
    <span className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-slate-700">
      <Icon className={`h-4 w-4 ${iconClass}`} aria-hidden="true" />
      {progress}
    </span>
  );
}

export const DesktopCoursesPanel: React.FC<DesktopCoursesPanelProps> = ({
  semester,
  courses,
  electiveSlots,
  electiveOptions,
  otherCourses,
  selectedSubjectId,
  allCoursesCalculated,
  onSelectCourse,
  onSelectElective,
  onSelectOtherCourse,
  onCalculateGpa,
}) => {
  const [expandedElectiveSlot, setExpandedElectiveSlot] = useState<string | null>(null);

  if (semester === null) {
    return (
      <section className="mx-auto my-6 max-w-xl rounded-2xl border border-slate-300 bg-white px-6 py-6 text-center shadow-sm">
        <h1 className="text-lg font-black uppercase tracking-wide text-[#172554]">Choose your semester</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          Select a semester from the menu at the top right to see its courses and start entering marks.
        </p>
      </section>
    );
  }

  const courseCount = courses.length + electiveSlots.length + otherCourses.length;
  const professionalElectiveSlots = electiveSlots.filter(
    (entry) => !entry.slot.toLowerCase().includes('open')
  );
  const openElectiveSlots = electiveSlots.filter(
    (entry) => entry.slot.toLowerCase().includes('open')
  );

  const renderElectiveSlot = ({ slot, course, subject, progress }: SemesterElectiveRow) => {
    const expanded = expandedElectiveSlot === slot;
    const options = electiveOptions[slot] ?? [];

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
              {course && (course.code || course.type) && (
                <span className="mt-1 block truncate text-xs text-slate-500">
                  {course.code}{course.code && course.type ? ' · ' : ''}{course.type}
                </span>
              )}
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
            <div className="mb-2.5">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                Available choices in Semester {semester}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Only choices for this semester and slot are shown.
              </p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2" aria-label={`Available choices for ${slot}`}>
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
                        <span className="mt-0.5 block text-xs text-slate-500">{option.code} · {option.type}</span>
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
    <section className="mx-auto max-w-4xl" aria-labelledby="desktop-courses-title">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h1 id="desktop-courses-title" className="text-xl font-black uppercase tracking-wide text-[#172554]">
            Semester {semester} courses
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
          <h2 id="desktop-core-courses-title" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
            Core courses
          </h2>
          <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
            {courses.map(({ course, subject, progress }) => (
              <li key={course.id}>
                <button
                  type="button"
                  onClick={() => onSelectCourse(course)}
                  aria-pressed={subject?.id === selectedSubjectId}
                  className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                    subject?.id === selectedSubjectId ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-[#172554]">{course.name}</span>
                    {(course.code || course.type) && (
                      <span className="mt-1 block truncate text-xs text-slate-500">
                        {course.code}{course.code && course.type ? ' · ' : ''}{course.type}
                      </span>
                    )}
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
            <h2 id="desktop-professional-electives-title" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
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
            <h2 id="desktop-open-electives-title" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
              Open Electives
            </h2>
            <ul className="space-y-2">
              {openElectiveSlots.map(renderElectiveSlot)}
            </ul>
          </section>
        )}

        {/* Other courses */}
        {otherCourses.length > 0 && (
          <section aria-labelledby="desktop-other-courses-title">
            <h2 id="desktop-other-courses-title" className="mb-2 text-xs font-black uppercase tracking-wide text-slate-600">
              Other courses
            </h2>
            <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white overflow-hidden">
              {otherCourses.map(({ subject, progress }) => (
                <li key={subject.id}>
                  <button
                    type="button"
                    onClick={() => onSelectOtherCourse(subject)}
                    aria-pressed={subject.id === selectedSubjectId}
                    className={`flex min-h-14 w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
                      subject.id === selectedSubjectId ? 'bg-blue-50/80' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-[#172554]">{subject.name || 'Other course'}</span>
                      {subject.code && <span className="mt-1 block truncate text-xs text-slate-500">{subject.code}</span>}
                    </span>
                    <CourseProgressStatus progress={progress} />
                  </button>
                </li>
              ))}
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
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#172554] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            Calculate GPA
          </button>
        </div>
      )}
    </section>
  );
};

import React, { useState } from 'react';
import { CheckCircle2, GraduationCap } from 'lucide-react';
import type { SubjectData } from '../types';
import type { GpaHistoryEntry } from '../firebaseData';
import { GPA_COURSES, type GpaCourse } from '../gpaCourses';
import { PRESET_COURSES } from './SubjectSelectionDialog';
import {
  calculateMarks,
  getCourseType,
  getCourseWeights,
} from '../calculatorUtils';

const matchesPresetSubject = (subject: SubjectData, course: (typeof PRESET_COURSES)[number]) =>
  (Boolean(course.code) && subject.code === course.code) ||
  subject.name.trim().toLowerCase() === course.name.trim().toLowerCase();

const findCourseSubject = (subjects: SubjectData[], course: GpaCourse) =>
  [...subjects].reverse().find((subject) => {
    if (course.electiveSlot) {
      return PRESET_COURSES.some((preset) =>
        preset.semester === course.semester &&
        preset.electiveSlot === course.electiveSlot &&
        matchesPresetSubject(subject, preset)
      );
    }
    return (Boolean(course.code) && subject.code === course.code) ||
      (course.code === 'CS23801' && ['project', 'project-work'].includes(getCourseType(subject))) ||
      subject.name.trim().toLowerCase() === course.name.toLowerCase();
  });

const getGpaCourseSemester = (subject: SubjectData): number | null => {
  const match = GPA_COURSES.find(
    (course) =>
      (Boolean(course.code) && subject.code === course.code) ||
      (course.code === 'CS23801' && ['project', 'project-work'].includes(getCourseType(subject))) ||
      subject.name.trim().toLowerCase() === course.name.toLowerCase() ||
      (Boolean(course.electiveSlot) && PRESET_COURSES.some((preset) =>
        preset.semester === course.semester && preset.electiveSlot === course.electiveSlot && matchesPresetSubject(subject, preset)
      ))
  );
  return match ? match.semester : null;
};

const getHistorySemester = (entry: GpaHistoryEntry): number | null => {
  if (Number.isInteger(entry.semester)) return entry.semester ?? null;
  const semesters = entry.courses.map((savedCourse) =>
    GPA_COURSES.find((course) =>
      (Boolean(course.code) && course.code === savedCourse.code) ||
      course.name.trim().toLowerCase() === savedCourse.name.trim().toLowerCase()
    )?.semester
  );
  if (semesters.length === 0 || semesters.some((semester) => semester === undefined)) return null;
  return semesters.every((semester) => semester === semesters[0]) ? semesters[0] ?? null : null;
};

const entered = (value: unknown): boolean =>
  value !== '' &&
  value !== null &&
  value !== undefined &&
  Number.isFinite(Number(value));

function scoresComplete(countValue: number | string, scores: (number | string)[]) {
  if (!entered(countValue)) return false;
  const count = Number(countValue);
  if (!Number.isInteger(count) || count < 0) return false;
  return scores.length >= count && scores.slice(0, count).every(entered);
}

function subjectMarksComplete(subject: SubjectData, allowEstimatedMarks = false): boolean {
  if (!subject.name?.trim()) return false;

  const courseType = getCourseType(subject);
  if (courseType === 'self-learning') return entered(subject.ese);
  if (courseType === 'laboratory-course') {
    return entered(subject.labCourseWorkMark) && entered(subject.labCourseMidtermMark) && entered(subject.labCourseExamMark);
  }
  if (courseType === 'universal-human-values') {
    return entered(subject.test1) &&
      Number(subject.act1No) >= 1 && scoresComplete(subject.act1No, subject.act1Scores) &&
      Number(subject.act2No) >= 1 && scoresComplete(subject.act2No, subject.act2Scores);
  }

  const weights = getCourseWeights(courseType);

  if (weights.testWeight > 0 && (!entered(subject.test1) || !entered(subject.test2))) return false;
  if (weights.courseType === 'project-work' || weights.courseType === 'project') {
    const marks = subject.projectWorkMarks;
    if (!marks || Object.values(marks).some((value) => !entered(value))) return false;
    return true;
  }
  if (weights.actWeight > 0) {
    if (!allowEstimatedMarks && (!entered(subject.act1No) || !entered(subject.act2No))) return false;
    if (!scoresCompleteOrEstimated(subject.act1No, subject.act1Scores, allowEstimatedMarks)) return false;
    if (!scoresCompleteOrEstimated(subject.act2No, subject.act2Scores, allowEstimatedMarks)) return false;
  }

  if (weights.labWeight > 0) {
    if (!allowEstimatedMarks && (!entered(subject.lab1No) || !entered(subject.lab2No))) return false;
    if (!scoresCompleteOrEstimated(subject.lab1No, subject.lab1Scores, allowEstimatedMarks)) return false;
    if (!scoresCompleteOrEstimated(subject.lab2No, subject.lab2Scores, allowEstimatedMarks)) return false;
  }

  if (weights.eseTheoryWeight > 0 && !entered(subject.ese)) return false;
  if (weights.eseLabWeight > 0 && !entered(subject.eseLab) && !allowEstimatedMarks) return false;

  return true;
}

function scoresCompleteOrEstimated(
    countValue: number | string,
    scores: (number | string)[],
    includeEstimates: boolean
  ): boolean {
    if (!includeEstimates) return scoresComplete(countValue, scores);
    if (!entered(countValue)) return true;
    const count = Number(countValue);
    return Number.isInteger(count) && count >= 0;
}

function fillEstimatedScores(
  countValue: number | string,
  existingScores: (number | string)[] | undefined,
  estimatePercentage: number
): (number | string)[] {
  const count = Math.max(0, Math.floor(Number(countValue) || 0));
  const finalCount = count === 0 ? 1 : count;
  const estimateMark = (10 * estimatePercentage) / 100;
  return Array.from({ length: finalCount }, (_, i): number | string => {
    const existing = existingScores?.[i];
    return existing !== undefined && entered(existing) ? existing : estimateMark;
  });
}

function estimatedCount(countValue: number | string): number | string {
  return !entered(countValue) || Number(countValue) === 0 ? 1 : countValue;
}

export function applyEstimatedScores(subject: SubjectData, estimatePercentage: number): SubjectData {
  const clampedEstimate = Math.max(0, Math.min(100, Number(estimatePercentage) || 0));
  const weights = getCourseWeights(getCourseType(subject));
  const hasEnteredEseLab = entered(subject.eseLab);
  const eseLabMax = Number(subject.eseLabMax) > 0 ? Number(subject.eseLabMax) : 100;
  const estimatedEseLab = (eseLabMax * clampedEstimate) / 100;

  return {
    ...subject,
    ...(weights.actWeight > 0
      ? {
          act1No: estimatedCount(subject.act1No),
          act2No: estimatedCount(subject.act2No),
          act1Scores: fillEstimatedScores(subject.act1No, subject.act1Scores, clampedEstimate),
          act2Scores: fillEstimatedScores(subject.act2No, subject.act2Scores, clampedEstimate),
        }
      : {}),
    ...(weights.labWeight > 0
      ? {
          lab1No: estimatedCount(subject.lab1No),
          lab2No: estimatedCount(subject.lab2No),
        }
      : {}),
    lab1Scores: weights.labWeight > 0
      ? fillEstimatedScores(subject.lab1No, subject.lab1Scores, clampedEstimate)
      : subject.lab1Scores,
    lab2Scores: weights.labWeight > 0
      ? fillEstimatedScores(subject.lab2No, subject.lab2Scores, clampedEstimate)
      : subject.lab2Scores,
    ...(weights.eseLabWeight > 0
      ? {
          eseLab: hasEnteredEseLab ? subject.eseLab : estimatedEseLab,
        }
      : {}),
  };
}

export function hasEstimateableComponents(subject: SubjectData): boolean {
    const weights = getCourseWeights(getCourseType(subject));
  if (['project', 'project-work', 'self-learning', 'laboratory-course', 'universal-human-values'].includes(weights.courseType)) return false;
    return weights.actWeight > 0 || weights.labWeight > 0 || weights.eseLabWeight > 0;
}

export function isGpaReady(
  subjects: SubjectData[],
  includeEstimates = false,
  selectedSemester = 1,
  calculatedSignatures: Record<string, string> = {}
): boolean {
  const semesterCourses = GPA_COURSES.filter((course) => course.semester === selectedSemester);
  const selectedSemester8Projects = subjects.filter((subject) =>
    getGpaCourseSemester(subject) === selectedSemester &&
    ['project', 'project-work'].includes(getCourseType(subject))
  );
  if (selectedSemester === 8 && selectedSemester8Projects.length > 1) return false;

  return semesterCourses.every((course) => {
    const subject = findCourseSubject(subjects, course);
    return Boolean(subject && (
      subjectMarksComplete(subject, includeEstimates) ||
      calculatedSignatures[subject.id] === JSON.stringify(subject)
    ));
  });
}

interface GPACalculatorProps {
  subjects: SubjectData[];
  calculatedSignatures: Record<string, string>;
  history: GpaHistoryEntry[];
  onCalculate: (entry: GpaHistoryEntry) => Promise<void>;
  initialSemester: number;
  includeEstimates: boolean;
  estimatePercentage: number;
  guestMode: boolean;
}

export const GPACalculator: React.FC<GPACalculatorProps> = ({
  subjects,
  calculatedSignatures,
  history,
  onCalculate,
  initialSemester,
  includeEstimates,
  estimatePercentage,
  guestMode,
}) => {
  const [calculatedInputSignature, setCalculatedInputSignature] = useState<string | null>(null);
  const [calculationState, setCalculationState] = useState<'idle' | 'calculating' | 'saving' | 'success' | 'error'>('idle');
  const selectedSemester = initialSemester;
  const [calculationError, setCalculationError] = useState('');
  const semesterCourses = GPA_COURSES.filter((course) => course.semester === selectedSemester);
  const gpaReady = isGpaReady(subjects, includeEstimates, selectedSemester, calculatedSignatures);
  const inputSignature = JSON.stringify({
    semester: selectedSemester,
    courses: semesterCourses.map((course) => ({
      courseCode: course.code,
      subject: findCourseSubject(subjects, course) ?? null,
    })),
    includeEstimates,
    estimatePercentage,
  });
  const isBusy = calculationState === 'calculating' || calculationState === 'saving';
  const rows = semesterCourses.map((course) => {
    const subject = findCourseSubject(subjects, course);
    const complete = Boolean(subject && (
      subjectMarksComplete(subject, includeEstimates) ||
      calculatedSignatures[subject.id] === JSON.stringify(subject)
    ));
    const usedEstimate = Boolean(includeEstimates && subject && hasEstimateableComponents(subject));
    const calculationSubject = subject && usedEstimate
      ? applyEstimatedScores(subject, estimatePercentage)
      : subject;
    const result = complete && calculationSubject ? calculateMarks(calculationSubject) : null;
    return {
      ...course,
      name: subject?.name ?? course.name,
      code: subject?.code || course.code,
      complete: Boolean(result),
      usedEstimate,
      mark: result?.total ?? null,
      grade: result?.grade.letter ?? null,
      gradePoint: result?.grade.gradePoint ?? null,
      weightedPoints: result ? course.credits * result.grade.gradePoint : null,
    };
  });

  const totalCredits = rows.reduce((sum, row) => sum + row.credits, 0);
  const totalWeightedPoints = rows.reduce((sum, row) => sum + (row.weightedPoints ?? 0), 0);
  const gpa = totalCredits ? totalWeightedPoints / totalCredits : 0;
  const completedCourses = rows.filter((row) => row.complete).length;
  const incompleteCourses = rows.filter((row) => !row.complete);
  const totalSemesterCourses = rows.length;
  const hasCalculated = gpaReady && (
    (calculatedInputSignature === inputSignature && calculationState === 'success') ||
    history.some((entry) => {
      if (entry.semester === selectedSemester && entry.inputSignature === inputSignature) return true;
      if (entry.inputSignature || getHistorySemester(entry) !== selectedSemester || entry.courses.length !== rows.length) return false;
      return rows.every((row) => {
        const savedCourse = entry.courses.find((course) => course.code === row.code);
        return Boolean(savedCourse) &&
          savedCourse?.mark === row.mark &&
          savedCourse.grade === row.grade &&
          savedCourse.gradePoint === row.gradePoint;
      });
    })
  );
  const handleCalculateGpa = async () => {
    if (!gpaReady || isBusy) return;
    setCalculatedInputSignature(null);
    setCalculationState('calculating');
    setCalculationError('');
    try {
      const entry: GpaHistoryEntry = {
        id: `gpa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        semester: selectedSemester,
        inputSignature,
        gpa,
        totalCredits,
        weightedGradePoints: totalWeightedPoints,
        createdAtMs: Date.now(),
        estimate: {
          enabled: includeEstimates,
          percentage: estimatePercentage,
          appliedToCourses: rows.filter((row) => row.usedEstimate).length,
        },
        courses: rows.map((row) => ({
          code: row.code,
          name: row.name,
          credits: row.credits,
          mark: row.mark ?? 0,
          grade: row.grade ?? '',
          gradePoint: row.gradePoint ?? 0,
        })),
      };
      setCalculationState(guestMode ? 'calculating' : 'saving');
      await onCalculate(entry);
      setCalculatedInputSignature(inputSignature);
      setCalculationState('success');
    } catch {
      setCalculationState('error');
      setCalculationError('Could not save GPA history. Check your connection and try again.');
    }
  };

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white border border-slate-300 p-5 sm:p-7 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 flex items-center justify-center bg-[#172554] text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">
              Semester {selectedSemester} · B.E. CSE
            </p>
            <h2 className="text-xl sm:text-2xl font-black text-[#172554]">
              GPA Calculator
            </h2>
          </div>
        </div>

        <p className="mt-5 border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-[#172554]" role="status">
          Enter all marks for Semester {selectedSemester} before calculating GPA. Change semesters using the selector in the header.
        </p>
          <p className="text-xs font-bold text-[#172554] mt-3" aria-live="polite">
            {completedCourses} of {totalSemesterCourses} courses complete
          </p>
          {incompleteCourses.length > 0 && (
            <div className="mt-2 rounded-lg border border-[#E4DDD2] bg-[#FCFAF6] px-3 py-2.5 text-xs leading-relaxed text-[#6E6E73]" role="status">
              <span className="font-bold text-[#2C2C30]">Still missing marks: </span>
              {incompleteCourses.slice(0, 3).map((course) => course.name).join(', ')}
              {incompleteCourses.length > 3 ? ` and ${incompleteCourses.length - 3} more` : ''}.
              <span className="block mt-1">Complete these courses before calculating GPA. Your GPA is not calculated from incomplete marks.</span>
            </div>
          )}
      </div>

      <div className="bg-white border border-slate-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#172554] text-white text-xs">
              <tr>
                <th scope="col" className="px-4 py-3">Course</th>
                <th scope="col" className="px-4 py-3 text-center">Credits</th>
                <th scope="col" className="px-4 py-3 text-center">Marks status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr key={`${row.semester}-${row.code || row.name}`} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-bold text-[#172554]">{row.name}</p>
                    <p className="text-xs text-slate-500">{row.code}</p>
                  </td>
                  <td className="px-4 py-3 text-center">{row.credits}</td>
                  <td className="px-4 py-3 text-center">
                    {row.complete ? (
                      <span className={`inline-flex items-center gap-1.5 font-bold ${row.usedEstimate ? 'text-amber-800' : 'text-emerald-800'}`}>
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        {row.usedEstimate ? 'Estimated' : 'Complete'}
                      </span>
                    ) : (
                      <span className="font-semibold text-slate-600">Input marks</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {!hasCalculated && (
            <p className="text-xs text-slate-600">
              {gpaReady
              ? includeEstimates && rows.some((row) => row.usedEstimate)
                ? `Lab/activity marks calculated at ${estimatePercentage}%.`
                : `All ${totalSemesterCourses} courses in Semester ${selectedSemester} are complete. You can calculate your GPA.`
              : `Complete the missing marks in Semester ${selectedSemester} before calculating.`}
            </p>
          )}
          <button
            type="button"
            onClick={handleCalculateGpa}
            disabled={!gpaReady || isBusy || hasCalculated}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold bg-[#172554] text-white hover:bg-[#1e3a8a] disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <GraduationCap className="w-4 h-4" aria-hidden="true" />
            {calculationState === 'calculating'
              ? 'Calculating GPA…'
              : calculationState === 'saving'
                ? 'Saving result…'
                : hasCalculated
                  ? 'GPA already calculated'
                  : 'Calculate GPA'}
          </button>
        </div>
        {calculationState === 'success' && hasCalculated && (
          <p className="border-t border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900" role="status">
            {guestMode ? 'GPA calculated for this temporary session.' : 'GPA calculated and saved to your account.'}
          </p>
        )}
        {calculationError && <p className="border-t border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">{calculationError}</p>}
      </div>

      {hasCalculated && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold text-slate-500">Semester GPA</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{gpa.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Out of 10.00</p>
            </div>
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold text-slate-500">Total Credits</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{totalCredits}</p>
              <p className="text-xs text-slate-500">Across {totalSemesterCourses} courses</p>
            </div>
            <div className="bg-white border border-slate-300 p-4">
              <p className="text-xs font-bold text-slate-500">Weighted Grade Points</p>
              <p className="text-3xl font-black text-[#172554] mt-1">{totalWeightedPoints.toFixed(2)}</p>
              <p className="text-xs text-slate-500">Credits × grade points</p>
            </div>
          </div>

          <div className="bg-white border border-slate-300 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#172554] text-white text-xs">
                <tr>
                  <th scope="col" className="px-4 py-3">Course</th>
                  <th scope="col" className="px-4 py-3 text-center">Credits</th>
                  <th scope="col" className="px-4 py-3 text-center">Final Mark</th>
                  <th scope="col" className="px-4 py-3 text-center">Grade</th>
                  <th scope="col" className="px-4 py-3 text-center">Grade Point</th>
                  <th scope="col" className="px-4 py-3 text-center">Weighted Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {rows.map((row) => (
                  <tr key={row.code} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#172554]">{row.name}</p>
                      <p className="text-xs text-slate-500">{row.code}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{row.credits}</td>
                    <td className="px-4 py-3 text-center">{row.mark?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center font-bold">{row.grade}</td>
                    <td className="px-4 py-3 text-center">{row.gradePoint}</td>
                    <td className="px-4 py-3 text-center">{row.weightedPoints?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-black text-[#172554]">
                <tr>
                  <td className="px-4 py-3">Total</td>
                  <td className="px-4 py-3 text-center">{totalCredits}</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">—</td>
                  <td className="px-4 py-3 text-center">{totalWeightedPoints.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <p className="text-xs text-slate-500">
            Total Semester {selectedSemester} credits: {totalCredits}.
          </p>
        </>
      )}

      {history.length > 0 && (
        <section className="bg-white border border-slate-300 shadow-sm overflow-x-auto" aria-labelledby="gpa-history-heading">
          <div className="p-4 border-b border-slate-200">
            <h3 id="gpa-history-heading" className="font-black text-[#172554]">GPA history</h3>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-3">Calculated</th>
                <th scope="col" className="px-4 py-3 text-center">Credits</th>
                <th scope="col" className="px-4 py-3 text-center">GPA</th>
                <th scope="col" className="px-4 py-3 text-center">Estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {history.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3">{new Date(entry.createdAtMs).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">{entry.totalCredits}</td>
                  <td className="px-4 py-3 text-center font-black text-[#172554]">{entry.gpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center text-xs">
                    {entry.estimate?.enabled && entry.estimate.appliedToCourses > 0
                      ? `${entry.estimate.percentage}% (${entry.estimate.appliedToCourses} courses)`
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </section>
  );
};

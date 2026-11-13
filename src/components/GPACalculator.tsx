import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { CheckCircle2, GraduationCap, X, RotateCcw, Award } from 'lucide-react';
import type { SubjectData } from '../types';
import type { GpaHistoryEntry } from '../firebaseData';
import { GPA_COURSES, getGpaCourses, getAllGpaCourses, type GpaCourse } from '../gpaCourses';
import { PRESET_COURSES, getPresetCourses, getAllPresetCourses, type PresetCourse } from './SubjectSelectionDialog';
import {
  calculateMarks,
  getCourseType,
  getCourseWeights,
} from '../calculatorUtils';
import { AnimatedNumber } from './AnimatedNumber';
import { motionVariants } from '../motion';

const getDepartmentDegreeName = (dept?: string): string => {
  if (dept === 'ECE') return 'B.E. ECE';
  if (dept === 'CIVIL' || dept === 'CE') return 'B.E. Civil';
  if (dept === 'GEO' || dept === 'GI' || dept === 'GEOINFORMATICS') return 'B.E. Geoinformatics';
  if (dept === 'BME' || dept === 'BM' || dept === 'BIOMEDICAL') return 'B.E. Biomedical';
  if (dept === 'IT' || dept === 'INFORMATION_TECHNOLOGY' || dept === 'INFOTECH') return 'B.Tech. IT';
  if (dept === 'EEE' || dept === 'ELECTRICAL') return 'B.E. EEE';
  if (dept === 'MFG' || dept === 'MANUFACTURING') return 'B.E. MFG';
  if (dept === 'VLSI' || dept === 'ELECTRONICS_VLSI') return 'B.Tech. VLSI';
  if (dept === 'MECH' || dept === 'MECHANICAL') return 'B.E. Mechanical';
  if (dept === 'PT' || dept === 'PRINTING' || dept === 'PPT') return 'B.E. PT';
  if (dept === 'MINING' || dept === 'MINE' || dept === 'MN' || dept === 'MI') return 'B.E. Mining';
  if (dept === 'MSE' || dept === 'MATSCI' || dept === 'MS') return 'B.E. MSE';
  if (dept === 'IE' || dept === 'INDUSTRIAL') return 'B.E. IE';
  return 'B.E. CSE';
};

const getDepartmentShortName = (dept?: string): string => {
  if (dept === 'ECE') return 'ECE';
  if (dept === 'CIVIL' || dept === 'CE') return 'Civil';
  if (dept === 'GEO' || dept === 'GI' || dept === 'GEOINFORMATICS') return 'Geoinformatics';
  if (dept === 'BME' || dept === 'BM' || dept === 'BIOMEDICAL') return 'Biomedical';
  if (dept === 'IT' || dept === 'INFORMATION_TECHNOLOGY' || dept === 'INFOTECH') return 'IT';
  if (dept === 'EEE' || dept === 'ELECTRICAL') return 'EEE';
  if (dept === 'MFG' || dept === 'MANUFACTURING') return 'MFG';
  if (dept === 'VLSI' || dept === 'ELECTRONICS_VLSI') return 'VLSI';
  if (dept === 'MECH' || dept === 'MECHANICAL') return 'Mechanical';
  if (dept === 'PT' || dept === 'PRINTING' || dept === 'PPT') return 'Printing';
  if (dept === 'MINING' || dept === 'MINE' || dept === 'MN' || dept === 'MI') return 'Mining';
  if (dept === 'MSE' || dept === 'MATSCI' || dept === 'MS') return 'Materials Science';
  if (dept === 'IE' || dept === 'INDUSTRIAL') return 'Industrial';
  return 'CSE';
};

const matchesPresetSubject = (subject: SubjectData, course: (typeof PRESET_COURSES)[number]) => {
  if (subject.id === `course_${course.id}` || subject.id === course.id) return true;
  if (course.code && subject.code) {
    return subject.code.trim().toUpperCase() === course.code.trim().toUpperCase();
  }
  if (subject.electiveSlot && course.electiveSlot) {
    return subject.electiveSlot === course.electiveSlot && subject.name.trim().toLowerCase() === course.name.trim().toLowerCase();
  }
  return subject.name.trim().toLowerCase() === course.name.trim().toLowerCase();
};

const findCourseSubject = (subjects: SubjectData[], course: GpaCourse, presets: PresetCourse[] = PRESET_COURSES as PresetCourse[]) =>
  [...subjects].reverse().find((subject) => {
    if (course.electiveSlot) {
      if (subject.electiveSlot) {
        return subject.electiveSlot === course.electiveSlot && (subject.semester === undefined || subject.semester === course.semester);
      }
      return presets.some((preset) =>
        preset.semester === course.semester &&
        preset.electiveSlot === course.electiveSlot &&
        matchesPresetSubject(subject, preset)
      );
    }
    return (Boolean(course.code) && subject.code === course.code) ||
      ((course.code === 'CS23801' || course.code === 'EC23801' || course.code === 'VL23801' || course.code === 'CE23801' || course.code === 'GI23801' || course.code === 'BM23801' || course.code === 'IT23801' || course.code.endsWith('801')) && ['project', 'project-work'].includes(getCourseType(subject))) ||
      subject.name.trim().toLowerCase() === course.name.toLowerCase();
  });

const getGpaCourseSemester = (
  subject: SubjectData,
  gpaList: readonly GpaCourse[] = getAllGpaCourses(),
  presets: PresetCourse[] = getAllPresetCourses()
): number | null => {
  const match = gpaList.find(
    (course) =>
      (Boolean(course.code) && subject.code === course.code) ||
      ((course.code === 'CS23801' || course.code === 'EC23801' || course.code === 'VL23801' || course.code === 'CE23801' || course.code === 'GI23801' || course.code === 'BM23801' || course.code === 'IT23801' || course.code.endsWith('801')) && ['project', 'project-work'].includes(getCourseType(subject))) ||
      subject.name.trim().toLowerCase() === course.name.toLowerCase() ||
      (Boolean(course.electiveSlot) && presets.some((preset) =>
        preset.semester === course.semester && preset.electiveSlot === course.electiveSlot && matchesPresetSubject(subject, preset)
      ))
  );
  return match ? match.semester : null;
};

const getHistorySemester = (entry: GpaHistoryEntry, gpaList: readonly GpaCourse[] = getAllGpaCourses()): number | null => {
  if (Number.isInteger(entry.semester)) return entry.semester ?? null;
  const semesters = entry.courses.map((savedCourse) =>
    gpaList.find((course) =>
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

export function subjectMarksComplete(subject: SubjectData, allowEstimatedMarks = false): boolean {
  if (!subject.name?.trim()) return false;

  const courseType = getCourseType(subject);
  if (courseType === 'self-learning') return entered(subject.ese);
  if (courseType === 'mini-project') {
    const marks = subject.miniProjectMarks;
    if (!marks) return false;
    return [marks.reviewI, marks.reviewII, marks.reviewIIIReport, marks.reviewIIIViva].every(entered);
  }
  if (courseType === 'internship-training') {
    const marks = subject.internshipTrainingMarks;
    if (!marks) return false;
    return [marks.report, marks.presentation, marks.vivaVoce, marks.industryViva].every(entered);
  }
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
  estimatePercentage: number,
  maxMarkPerBox = 10,
): (number | string)[] {
  const count = Math.max(0, Math.floor(Number(countValue) || 0));
  const finalCount = count === 0 ? 1 : count;
  const estimateMark = (maxMarkPerBox * estimatePercentage) / 100;
  return Array.from({ length: finalCount }, (_, i): number | string => {
    const existing = existingScores?.[i];
    return existing !== undefined && entered(existing) ? existing : estimateMark;
  });
}

function estimatedCount(countValue: number | string): number | string {
  return !entered(countValue) || Number(countValue) === 0 ? 1 : countValue;
}

export function applyEstimatedScores(subject: SubjectData, estimatePercentage: number): SubjectData {
  const weights = getCourseWeights(getCourseType(subject));
  const hasEnteredEseLab = entered(subject.eseLab);
  const eseLabMax = Number(subject.eseLabMax) > 0 ? Number(subject.eseLabMax) : 100;
  const estimatedEseLab = (eseLabMax * estimatePercentage) / 100;
  const activity1Max = Math.max(1, Number(subject.markMaxima?.act1) || 10);
  const activity2Max = Math.max(1, Number(subject.markMaxima?.act2) || 10);
  const lab1Max = Math.max(1, Number(subject.markMaxima?.lab1) || 10);
  const lab2Max = Math.max(1, Number(subject.markMaxima?.lab2) || 10);

  return {
    ...subject,
    ...(weights.actWeight > 0
      ? {
          act1No: estimatedCount(subject.act1No),
          act2No: estimatedCount(subject.act2No),
          act1Scores: fillEstimatedScores(subject.act1No, subject.act1Scores, estimatePercentage, activity1Max),
          act2Scores: fillEstimatedScores(subject.act2No, subject.act2Scores, estimatePercentage, activity2Max),
        }
      : {}),
    ...(weights.labWeight > 0
      ? {
          lab1No: estimatedCount(subject.lab1No),
          lab2No: estimatedCount(subject.lab2No),
        }
      : {}),
    lab1Scores: weights.labWeight > 0
      ? fillEstimatedScores(subject.lab1No, subject.lab1Scores, estimatePercentage, lab1Max)
      : subject.lab1Scores,
    lab2Scores: weights.labWeight > 0
      ? fillEstimatedScores(subject.lab2No, subject.lab2Scores, estimatePercentage, lab2Max)
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

export function isTargetSimulatorReady(
  subject: SubjectData | null | undefined,
  includeEstimates = false
): boolean {
  if (!subject || !subject.name?.trim()) return false;

  const courseType = getCourseType(subject);
  const weights = getCourseWeights(courseType);

  if (weights.eseWeight <= 0) return false;

  // 1. Marks for both CAs (tests) must be entered
  if (weights.testWeight > 0) {
    if (!entered(subject.test1) || !entered(subject.test2)) {
      return false;
    }
  }

  // 2. All assignments must be entered (or estimated via checkbox)
  if (weights.actWeight > 0) {
    if (!includeEstimates) {
      if (!entered(subject.act1No) || !entered(subject.act2No)) return false;
      const act1Count = Math.floor(Number(subject.act1No) || 0);
      const act2Count = Math.floor(Number(subject.act2No) || 0);
      if (act1Count <= 0 || act2Count <= 0) return false;
      if (!scoresComplete(act1Count, subject.act1Scores)) return false;
      if (!scoresComplete(act2Count, subject.act2Scores)) return false;
    }
  }

  // 3. All CA lab practicals must be entered (or estimated via checkbox)
  if (weights.labWeight > 0) {
    if (!includeEstimates) {
      if (!entered(subject.lab1No) || !entered(subject.lab2No)) return false;
      const lab1Count = Math.floor(Number(subject.lab1No) || 0);
      const lab2Count = Math.floor(Number(subject.lab2No) || 0);
      if (lab1Count <= 0 || lab2Count <= 0) return false;
      if (!scoresComplete(lab1Count, subject.lab1Scores)) return false;
      if (!scoresComplete(lab2Count, subject.lab2Scores)) return false;
    }
  }

  // 4. End Semester Lab Practical (if course has one AND has ESE theory)
  // Checkbox for estimated lab/activity average must also apply to end semester practical.
  // If not estimated, the student must have entered the ESE practical mark.
  if (weights.eseLabWeight > 0 && weights.eseTheoryWeight > 0) {
    if (!entered(subject.eseLab) && !includeEstimates) {
      return false;
    }
  }

  return true;
}

export function isGpaReady(
  subjects: SubjectData[],
  includeEstimates = false,
  selectedSemester = 1,
  calculatedSignatures: Record<string, string> = {},
  department?: string
): boolean {
  const courseList = getGpaCourses(department);
  const presets = getPresetCourses(department);
  const semesterCourses = courseList.filter((course) => course.semester === selectedSemester);
  const selectedSemester8Projects = subjects.filter((subject) =>
    getGpaCourseSemester(subject, courseList, presets) === selectedSemester &&
    ['project', 'project-work'].includes(getCourseType(subject))
  );
  if (selectedSemester === 8 && selectedSemester8Projects.length > 1) return false;

  return semesterCourses.every((course) => {
    const subject = findCourseSubject(subjects, course, presets);
    return Boolean(subject && (
      subjectMarksComplete(subject, includeEstimates) ||
      calculatedSignatures[subject.id] === JSON.stringify(subject)
    ));
  });
}

export interface EstimatedSemesterGpaResult {
  gpa: number | null;
  completedCount: number;
  totalCount: number;
  isProvisional: boolean;
}

export function calculateEstimatedSemesterGpa(
  semester: number,
  subjects: SubjectData[],
  department?: string
): EstimatedSemesterGpaResult {
  const courseList = getGpaCourses(department);
  const presets = getPresetCourses(department);
  const semesterCourses = courseList.filter((course) => course.semester === semester);
  if (semesterCourses.length === 0) {
    return { gpa: null, completedCount: 0, totalCount: 0, isProvisional: false };
  }

  let totalWeighted = 0;
  let totalCredits = 0;
  let completedCount = 0;

  for (const course of semesterCourses) {
    const subject = findCourseSubject(subjects, course, presets);
    if (!subject) continue;
    const isComplete = subjectMarksComplete(subject);
    if (isComplete) {
      completedCount++;
      const breakdown = calculateMarks(subject);
      totalWeighted += course.credits * breakdown.grade.gradePoint;
      totalCredits += course.credits;
    }
  }

  if (completedCount === 0 || totalCredits === 0) {
    return {
      gpa: null,
      completedCount: 0,
      totalCount: semesterCourses.length,
      isProvisional: true,
    };
  }

  const rawGpa = totalWeighted / totalCredits;
  const roundedGpa = Math.round(rawGpa * 100) / 100;
  return {
    gpa: roundedGpa,
    completedCount,
    totalCount: semesterCourses.length,
    isProvisional: completedCount < semesterCourses.length,
  };
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
  department?: string;
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
  department,
}) => {
  const reduceMotion = useReducedMotion();
  const [calculatedInputSignature, setCalculatedInputSignature] = useState<string | null>(null);
  const [calculationState, setCalculationState] = useState<'idle' | 'calculating' | 'saving' | 'success' | 'error'>('idle');
  const selectedSemester = initialSemester;
  const [calculationError, setCalculationError] = useState('');

  // Explicit / Custom Grade-Based GPA state
  const [showExplicitGradeModal, setShowExplicitGradeModal] = useState(false);
  const [explicitGrades, setExplicitGrades] = useState<Record<string, string>>({});
  const [explicitCalculationResult, setExplicitCalculationResult] = useState<{
    gpa: number;
    totalCredits: number;
    totalWeightedPoints: number;
    courses: Array<{
      code: string;
      name: string;
      credits: number;
      grade: string;
      gradePoint: number;
      weightedPoints: number;
      mark?: number;
    }>;
  } | null>(null);

  // Clear explicit result when semester or department changes
  React.useEffect(() => {
    setExplicitCalculationResult(null);
  }, [selectedSemester, department]);

  React.useEffect(() => {
    if (!showExplicitGradeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowExplicitGradeModal(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showExplicitGradeModal]);
  const deptGpaCourses = getGpaCourses(department);
  const deptPresets = getPresetCourses(department);
  const semesterCourses = deptGpaCourses.filter((course) => course.semester === selectedSemester);
  const gpaReady = isGpaReady(subjects, includeEstimates, selectedSemester, calculatedSignatures, department);
  const inputSignature = JSON.stringify({
    semester: selectedSemester,
    department: department || 'CSE',
    courses: semesterCourses.map((course) => ({
      courseCode: course.code,
      subject: findCourseSubject(subjects, course, deptPresets) ?? null,
    })),
    includeEstimates,
    estimatePercentage,
  });
  const isBusy = calculationState === 'calculating' || calculationState === 'saving';
  const rows = semesterCourses.map((course) => {
    const subject = findCourseSubject(subjects, course, deptPresets);
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

  const GRADE_OPTIONS = [
    { letter: 'S', point: 10, label: 'S (10)' },
    { letter: 'A+', point: 9, label: 'A+ (9)' },
    { letter: 'A', point: 8, label: 'A (8)' },
    { letter: 'B+', point: 7, label: 'B+ (7)' },
    { letter: 'B', point: 6, label: 'B (6)' },
    { letter: 'C', point: 5, label: 'C (5)' },
    { letter: 'U', point: 0, label: 'U (0)' },
  ] as const;

  const currentExplicitCourses = semesterCourses.map((course) => {
    const subject = findCourseSubject(subjects, course, deptPresets);
    const key = course.code || course.name;
    const chosenGrade = explicitGrades[key] || 'S';
    const opt = GRADE_OPTIONS.find((g) => g.letter === chosenGrade) ?? GRADE_OPTIONS[0];
    const isElective = Boolean(course.electiveSlot);
    const hasSelectedElective = Boolean(
      subject && subject.name.trim().toLowerCase() !== course.name.trim().toLowerCase()
    );
    const displayName = hasSelectedElective ? subject!.name : course.name;
    const displayCode = hasSelectedElective && subject?.code ? subject.code : course.code;
    return {
      code: displayCode,
      name: displayName,
      slotLabel: isElective ? course.name : undefined,
      hasSelectedElective,
      credits: course.credits,
      grade: opt.letter,
      gradePoint: opt.point,
      weightedPoints: course.credits * opt.point,
    };
  });

  const explicitTotalCredits = currentExplicitCourses.reduce((sum, c) => sum + c.credits, 0);
  const explicitWeightedPoints = currentExplicitCourses.reduce((sum, c) => sum + c.weightedPoints, 0);
  const explicitLiveGpa = explicitTotalCredits ? explicitWeightedPoints / explicitTotalCredits : 0;

  const setAllGrades = (letter: string) => {
    const updated: Record<string, string> = {};
    semesterCourses.forEach((c) => {
      updated[c.code || c.name] = letter;
    });
    setExplicitGrades(updated);
  };

  const handleApplyExplicitGrades = async () => {
    const coursesData = currentExplicitCourses.map((c) => ({
      code: c.code,
      name: c.name,
      credits: c.credits,
      mark: c.grade === 'S' ? 95 : c.grade === 'A+' ? 85 : c.grade === 'A' ? 75 : c.grade === 'B+' ? 65 : c.grade === 'B' ? 58 : c.grade === 'C' ? 52 : 0,
      grade: c.grade,
      gradePoint: c.gradePoint,
      weightedPoints: c.weightedPoints,
    }));

    const result = {
      gpa: explicitLiveGpa,
      totalCredits: explicitTotalCredits,
      totalWeightedPoints: explicitWeightedPoints,
      courses: coursesData,
    };

    setExplicitCalculationResult(result);
    setShowExplicitGradeModal(false);

    try {
      const entry: GpaHistoryEntry = {
        id: `gpa_explicit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        semester: selectedSemester,
        inputSignature: `explicit_${selectedSemester}_${Date.now()}`,
        gpa: explicitLiveGpa,
        totalCredits: explicitTotalCredits,
        weightedGradePoints: explicitWeightedPoints,
        createdAtMs: Date.now(),
        courses: coursesData.map((c) => ({
          code: c.code,
          name: c.name,
          credits: c.credits,
          mark: c.mark,
          grade: c.grade,
          gradePoint: c.gradePoint,
        })),
      };
      await onCalculate(entry);
    } catch (err) {
      console.error('Failed to save custom GPA entry to history:', err);
    }
  };

  const displayGpa = explicitCalculationResult ? explicitCalculationResult.gpa : gpa;
  const displayCredits = explicitCalculationResult ? explicitCalculationResult.totalCredits : totalCredits;
  const displayWeightedPoints = explicitCalculationResult ? explicitCalculationResult.totalWeightedPoints : totalWeightedPoints;
  const displayRows = explicitCalculationResult ? explicitCalculationResult.courses : rows;

  return (
    <section className="max-w-5xl mx-auto space-y-6">
      <div className="rounded-xl bg-white border border-slate-300 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 flex items-center justify-center bg-[#172554] text-white rounded-xl shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">
                Semester {selectedSemester} · {getDepartmentDegreeName(department)}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-[#172554]">
                GPA Calculator
              </h2>
            </div>
          </div>

          <button
            id="tour-grades-of-choice-button"
            data-tour="grades-of-choice-button"
            type="button"
            onClick={() => setShowExplicitGradeModal(true)}
            className="inline-flex h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#d97757] hover:bg-[#b95f43] dark:bg-[#e08564] dark:hover:bg-[#cf6d4c] px-4 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <Award className="w-4 h-4 text-white" aria-hidden="true" />
            Enter Grades of Choice
          </button>
        </div>

        {explicitCalculationResult && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/80 p-3.5 text-xs">
            <div className="flex items-center gap-2 text-[#172554]">
              <Award className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="font-semibold">
                Displaying GPA calculated from your custom grades (GPA: <strong className="tabular-nums font-numeric">{explicitCalculationResult.gpa.toFixed(2)}</strong>)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowExplicitGradeModal(true)}
                className="font-bold text-[#172554] hover:underline cursor-pointer"
              >
                Modify Grades
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={() => setExplicitCalculationResult(null)}
                className="font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Clear Custom View
              </button>
            </div>
          </div>
        )}

        <p className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-bold text-[#172554]" role="status">
          Enter all marks for Semester {selectedSemester} before calculating GPA. Change semesters using the selector in the header.
        </p>
          <p className="text-xs font-bold text-[#172554] mt-3" aria-live="polite">
            {completedCourses} of {totalSemesterCourses} courses complete
          </p>
      </div>

      <div className="rounded-xl bg-white border border-slate-300 shadow-xs overflow-hidden">
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
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums font-numeric">{row.credits}</td>
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
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold bg-[#172554] text-white hover:bg-[#1e3a8a] disabled:bg-slate-300 disabled:text-white disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs sm:w-56"
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

      <AnimatePresence initial={false}>
      {(hasCalculated || explicitCalculationResult) && (
        <motion.div
          key={`${selectedSemester}-${displayGpa}-${Boolean(explicitCalculationResult)}`}
          className="space-y-6 sm:space-y-7"
          variants={reduceMotion ? undefined : motionVariants.card}
          initial={reduceMotion ? false : 'initial'}
          animate="animate"
          exit="exit"
        >
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div className="flex flex-col justify-between rounded-xl border border-slate-300 bg-white p-4.5 sm:p-5 shadow-xs">
              <p className="text-xs font-bold text-slate-500">Semester GPA</p>
              <AnimatedNumber value={displayGpa} className="my-2 block text-3xl sm:text-4xl font-black text-[#172554] tabular-nums font-numeric tracking-tight leading-none" />
              <p className="text-xs font-medium text-slate-500">Out of 10.00</p>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-slate-300 bg-white p-4.5 sm:p-5 shadow-xs">
              <p className="text-xs font-bold text-slate-500">Total Credits</p>
              <AnimatedNumber value={displayCredits} decimals={0} className="my-2 block text-3xl sm:text-4xl font-black text-[#172554] tabular-nums font-numeric tracking-tight leading-none" />
              <p className="text-xs font-medium text-slate-500">Across {totalSemesterCourses} courses</p>
            </div>
            <div className="flex flex-col justify-between rounded-xl border border-slate-300 bg-white p-4.5 sm:p-5 shadow-xs">
              <p className="text-xs font-bold text-slate-500">Weighted Grade Points</p>
              <AnimatedNumber value={displayWeightedPoints} className="my-2 block text-3xl sm:text-4xl font-black text-[#172554] tabular-nums font-numeric tracking-tight leading-none" />
              <p className="text-xs font-medium text-slate-500">Credits × grade points</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3 sm:px-5">
              <div>
                <h3 className="text-sm font-black text-[#172554]">Course Grade &amp; Credit Breakdown</h3>
                <p className="text-xs text-slate-500">Course-by-course contribution to Semester {selectedSemester} GPA</p>
              </div>
              <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-[#172554] shadow-2xs">
                {displayCredits} Credits · {displayRows.length} Courses
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[42rem] text-left text-sm">
                <thead className="bg-[#172554] text-white text-xs">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-bold sm:px-5">Course</th>
                    <th scope="col" className="px-4 py-3 text-center font-bold">Credits</th>
                    <th scope="col" className="px-4 py-3 text-center font-bold">Final Mark</th>
                    <th scope="col" className="px-4 py-3 text-center font-bold">Grade</th>
                    <th scope="col" className="px-4 py-3 text-center font-bold">Grade Point</th>
                    <th scope="col" className="px-4 py-3 text-center font-bold sm:px-5">Weighted Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {displayRows.map((row) => (
                    <tr key={row.code} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 sm:px-5">
                        <p className="font-bold text-[#172554]">{row.name}</p>
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums font-numeric font-semibold text-slate-700">{row.credits}</td>
                      <td className="px-4 py-3.5 text-center tabular-nums font-numeric text-slate-700">
                        {explicitCalculationResult ? (
                          <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
                            Custom
                          </span>
                        ) : row.mark !== undefined && row.mark !== null ? (
                          <span className="font-semibold text-slate-800">{row.mark.toFixed(2)}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="inline-flex min-w-7 items-center justify-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-black text-[#172554]">
                          {row.grade ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums font-numeric font-semibold text-slate-800">
                        {row.gradePoint !== null && row.gradePoint !== undefined ? row.gradePoint : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-center tabular-nums font-numeric font-bold text-[#172554] sm:px-5">
                        {row.weightedPoints !== null && row.weightedPoints !== undefined
                          ? row.weightedPoints.toFixed(2)
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-slate-300 bg-slate-50/90 font-black text-[#172554]">
                  <tr>
                    <td className="px-4 py-3.5 text-sm font-black sm:px-5">Total</td>
                    <td className="px-4 py-3.5 text-center tabular-nums font-numeric text-sm font-black">{displayCredits}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 font-normal">—</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 font-normal">—</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 font-normal">—</td>
                    <td className="px-4 py-3.5 text-center tabular-nums font-numeric text-sm font-black text-[#172554] sm:px-5">
                      {displayWeightedPoints.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <p className="px-1 text-xs text-slate-500">
            Total Semester {selectedSemester} credits: <span className="tabular-nums font-numeric">{totalCredits}</span>.
          </p>
        </>
        </motion.div>
      )}
      </AnimatePresence>

      {history.length > 0 && (
        <section className="rounded-xl bg-white border border-slate-300 shadow-xs overflow-hidden" aria-labelledby="gpa-history-heading">
          <div className="p-4 border-b border-slate-200 bg-slate-50/80">
            <h3 id="gpa-history-heading" className="font-black text-[#172554]">GPA history</h3>
          </div>
          <div className="overflow-x-auto">
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
                    <td className="px-4 py-3 text-center font-black text-[#172554] tabular-nums font-numeric">{entry.gpa.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center text-xs">
                      {entry.estimate?.enabled && entry.estimate.appliedToCourses > 0
                        ? `${entry.estimate.percentage}% (${entry.estimate.appliedToCourses} courses)`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Explicit / Custom Grade Entry Modal */}
      <AnimatePresence>
      {showExplicitGradeModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-grade-modal-title"
          variants={reduceMotion ? undefined : motionVariants.backdrop}
          initial={reduceMotion ? { opacity: 1 } : 'initial'}
          animate="animate"
          exit="exit"
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] shadow-2xl overflow-hidden"
            variants={reduceMotion ? undefined : motionVariants.dialog}
            initial={reduceMotion ? { opacity: 1 } : 'initial'}
            animate="animate"
            exit="exit"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 px-5 py-4 bg-white dark:bg-[#161618] shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--app-soft-accent)] dark:bg-[#3c302b] border border-[var(--app-divider)] dark:border-[#5a5a62] px-2.5 py-0.5 text-[10px] font-bold text-[var(--app-action-accent-strong)] dark:text-[#e08564] uppercase tracking-wider">
                    <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                    Semester {selectedSemester} · {getDepartmentShortName(department)}
                  </span>
                </div>
                <h3 id="custom-grade-modal-title" className="text-lg sm:text-xl font-black text-[#172554] dark:text-[#f1f1f3] mt-1.5">
                  Enter Grades of Your Choice
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Select grades for each course to calculate your semester GPA immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowExplicitGradeModal(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#202024] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#2a2a30] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] dark:focus-visible:outline-[#e08564]"
                aria-label="Close dialog"
              >
                <X className="h-4.5 w-4.5" aria-hidden="true" />
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="px-5 py-3 bg-slate-50/80 dark:bg-[#1a1a1c] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Quick Fill:</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {['S', 'A+', 'A', 'B+'].map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => setAllGrades(letter)}
                    className="rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#202024] px-3 py-1 text-xs font-bold text-[#172554] dark:text-[#f1f1f3] hover:border-[#d97757] hover:text-[#d97757] dark:hover:border-[#e08564] dark:hover:text-[#e08564] shadow-2xs transition-colors cursor-pointer active:scale-95"
                  >
                    All {letter}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setExplicitGrades({})}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#202024] px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 transition-colors cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* Courses List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800/80">
              {currentExplicitCourses.map((course, idx) => {
                const rawCourse = semesterCourses[idx] || course;
                const key = rawCourse.code || rawCourse.name;
                const currentGrade = explicitGrades[key] || 'S';
                return (
                  <div key={key} className="pt-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0 pr-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[#172554] dark:text-[#f1f1f3]">{course.name}</span>
                        <span className="shrink-0 rounded-md bg-slate-100 dark:bg-[#161618] border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          <span className="tabular-nums font-numeric">{course.credits}</span> Credits
                        </span>
                      </div>
                      {course.slotLabel && course.hasSelectedElective && (
                        <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                          {course.slotLabel}
                        </p>
                      )}
                      {course.slotLabel && !course.hasSelectedElective && (
                        <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                          Elective not chosen yet (using default credits)
                        </p>
                      )}
                    </div>

                    {/* Grade Selector Button Group */}
                    <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                      {GRADE_OPTIONS.map((opt) => {
                        const isSelected = currentGrade === opt.letter;
                        return (
                          <button
                            key={opt.letter}
                            type="button"
                            onClick={() => {
                              setExplicitGrades((prev) => ({
                                ...prev,
                                [key]: opt.letter,
                              }));
                            }}
                            className={`min-w-8.5 h-8 px-2.5 text-xs rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#d97757] dark:bg-[#e08564] border-[#d97757] dark:border-[#e08564] text-white shadow-xs font-black scale-[1.03]'
                                : 'bg-white dark:bg-[#161618] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#2a2a30] hover:border-slate-300 font-bold active:scale-95'
                            }`}
                          >
                            {opt.letter}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Calculation Footer */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#1a1a1c] p-4 sm:p-5 shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-baseline gap-4 sm:gap-6">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Calculated GPA</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#d97757] dark:text-[#e08564] tabular-nums font-numeric">
                    {explicitLiveGpa.toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold"> / 10.00</span>
                </div>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-4 sm:pl-6">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Credits</span>
                  <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {explicitTotalCredits}
                  </span>
                </div>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-4 sm:pl-6">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Weighted Points</span>
                  <span className="text-lg sm:text-xl font-bold text-slate-800 dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {explicitWeightedPoints.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowExplicitGradeModal(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2a2a30] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyExplicitGrades}
                  className="rounded-xl bg-[#d97757] dark:bg-[#e08564] hover:bg-[#b95f43] dark:hover:bg-[#cf6d4c] px-5 py-2.5 text-xs font-bold text-white transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  Calculate &amp; Apply GPA
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
};

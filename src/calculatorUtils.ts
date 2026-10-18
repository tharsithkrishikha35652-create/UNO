import { SubjectData, CalculationBreakdown, GradeInfo, SpecialGradeInfo, CourseType } from './types';

export const GRADE_SCALE: GradeInfo[] = [
  {
    letter: 'S',
    label: 'Outstanding',
    gradePoint: 10,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 91,
    maxScore: 100,
    rangeLabel: '91 – 100',
  },
  {
    letter: 'A+',
    label: 'Excellent',
    gradePoint: 9,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 81,
    maxScore: 90,
    rangeLabel: '81 – 90',
  },
  {
    letter: 'A',
    label: 'Very Good',
    gradePoint: 8,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 71,
    maxScore: 80,
    rangeLabel: '71 – 80',
  },
  {
    letter: 'B+',
    label: 'Good',
    gradePoint: 7,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 61,
    maxScore: 70,
    rangeLabel: '61 – 70',
  },
  {
    letter: 'B',
    label: 'Average',
    gradePoint: 6,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 56,
    maxScore: 60,
    rangeLabel: '56 – 60',
  },
  {
    letter: 'C',
    label: 'Satisfactory',
    gradePoint: 5,
    colorClass: 'text-[#172554]',
    bgClass: 'bg-slate-100',
    minScore: 50,
    maxScore: 55,
    rangeLabel: '50 – 55',
  },
  {
    letter: 'U',
    label: 'Re-appearance',
    gradePoint: 0,
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50',
    minScore: 0,
    maxScore: 49.99,
    rangeLabel: '< 50',
  },
];

export const SPECIAL_GRADES: SpecialGradeInfo[] = [
  { code: 'SA', description: 'Shortage of Attendance', gradePoint: 0 },
  { code: 'WC', description: 'Withdrawal of Course', gradePoint: 0 },
];

export function getGradeForScore(score: number): GradeInfo {
  const rounded = Math.round(score * 100) / 100;
  for (const grade of GRADE_SCALE) {
    if (rounded >= grade.minScore) {
      return grade;
    }
  }
  return GRADE_SCALE[GRADE_SCALE.length - 1];
}

export interface CourseWeights {
  courseType: CourseType;
  courseTypeLabel: string;
  testWeight: number; // per CA
  actWeight: number; // per CA
  labWeight: number; // per CA
  caMax: number; // per CA (25, or 20 for theory-only courses)
  internalMax: number; // CA 1 + CA 2 (50, or 40 for theory-only courses)
  eseWeight: number; // total ESE (50, or 60 for theory-only courses)
  eseTheoryWeight: number; // 0 for practical-only courses
  eseLabWeight: number; // 0 for theory-only courses
  totalMax: number;
}

// Single source of truth for Semester I course types:
// 1. Foundation English: 2-0-2 / 2+2
// 2. Engineering Physics: 3-0-2 / 3+2
// 3. Programming in C: 2-0-4 / 2+4
// 4. Computational Thinking: 1-0-2 / 1+2
const COURSE_WEIGHTS: Record<CourseType, Omit<CourseWeights, 'courseType' | 'caMax' | 'internalMax' | 'eseWeight' | 'totalMax'>> = {
  // Foundation English: LIT 2-0-2
  '2-0-2': { courseTypeLabel: '2-0-2 LIT', testWeight: 15, actWeight: 2.5, labWeight: 7.5, eseTheoryWeight: 50, eseLabWeight: 0 },
  // Engineering Physics: LIT 3-0-2
  '3-0-2': { courseTypeLabel: '3-0-2 LIT', testWeight: 15, actWeight: 2.5, labWeight: 7.5, eseTheoryWeight: 50, eseLabWeight: 0 },
  '3+2': { courseTypeLabel: '3-0-2 LIT', testWeight: 15, actWeight: 2.5, labWeight: 7.5, eseTheoryWeight: 50, eseLabWeight: 0 },
  // Programming in C: LIT 2-0-4
  '2-0-4': { courseTypeLabel: '2-0-4 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  '2+4': { courseTypeLabel: '2-0-4 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  // Computational Thinking: LIT 1-0-2
  '1-0-2': { courseTypeLabel: '1-0-2 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 0, eseLabWeight: 50 },
  '1+2': { courseTypeLabel: '1-0-2 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 0, eseLabWeight: 50 },
  // Later semester mixed courses using the same CA pattern as the existing 3-0-2 / 2-0-4 logic, with ESE split as 40 theory + 10 practical.
  '3-0-4': { courseTypeLabel: '3-0-4 LIT', testWeight: 15, actWeight: 2.5, labWeight: 7.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  '3+4': { courseTypeLabel: '3-0-4 LIT', testWeight: 15, actWeight: 2.5, labWeight: 7.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  '1-0-4': { courseTypeLabel: '1-0-4 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  '1+4': { courseTypeLabel: '1-0-4 LIT', testWeight: 10, actWeight: 2.5, labWeight: 12.5, eseTheoryWeight: 40, eseLabWeight: 10 },
  // Theory-only courses (Heritage of Tamils, Calculus, Fundamentals of Electrical and Electronics Engineering):
  // 100 = ESE 60 + Internals 40; Internals = CA1 20 + CA2 20; each CA = Test 16 + Activities 4
  theory: { courseTypeLabel: 'Theory Only', testWeight: 16, actWeight: 4, labWeight: 0, eseTheoryWeight: 60, eseLabWeight: 0 },
};

export function isCourseType(value: unknown): value is CourseType {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(COURSE_WEIGHTS, value);
}

export function getCourseType(data: SubjectData): CourseType {
  if (isCourseType(data.courseType)) return data.courseType;
  return '2-0-2'; // fallback
}

export function getCourseWeights(courseType: CourseType): CourseWeights {
  const w = COURSE_WEIGHTS[courseType] ?? COURSE_WEIGHTS['2-0-2'];
  const caMax = w.testWeight + w.actWeight + w.labWeight;
  return {
    courseType: COURSE_WEIGHTS[courseType] ? courseType : '2-0-2',
    caMax,
    internalMax: caMax * 2,
    eseWeight: w.eseTheoryWeight + w.eseLabWeight,
    totalMax: 100,
    ...w,
  };
}

/** Short human-readable weightage line, generated from the table above. */
export function describeWeights(courseType: CourseType): string {
  const w = getCourseWeights(courseType);
  const ca = w.labWeight > 0
    ? `CA 1 & 2: Test ${w.testWeight}M · Assignment ${w.actWeight}M · Lab ${w.labWeight}M - ${w.caMax}M each`
    : `CA 1 & 2: Test ${w.testWeight}M · Activities ${w.actWeight}M - ${w.caMax}M each`;
  let ese: string;
  if (w.eseTheoryWeight > 0 && w.eseLabWeight > 0) {
    ese = `ESE: Theory ${w.eseTheoryWeight}M + Lab ${w.eseLabWeight}M - 50M total`;
  } else if (w.eseLabWeight > 0) {
    ese = `ESE: Practical Exam ${w.eseLabWeight}M - 50M total`;
  } else {
    ese = `ESE: Theory Exam ${w.eseTheoryWeight}M - ${w.eseWeight}M total`;
  }
  return `${ca} | ${ese}`;
}

/**
 * Ensures an array of scores matches the target length `count`.
 * Preserves existing values where possible, leaves new slots empty ('') for user to input.
 */
export function syncScoresArray(
  currentScores: (number | string)[] = [],
  count: number | string
): (number | string)[] {
  const targetCount = Math.max(0, Math.floor(Number(count) || 0));
  const result: (number | string)[] = [];
  for (let i = 0; i < targetCount; i++) {
    if (i < currentScores.length && currentScores[i] !== undefined && currentScores[i] !== null && currentScores[i] !== '') {
      result.push(currentScores[i]);
    } else {
      result.push(8); // default to 8 as requested
    }
  }
  return result;
}

export function calculateMarks(data: SubjectData): CalculationBreakdown {
  const parseNum = (val: number | string | undefined | null): number => {
    if (val === '' || val === undefined || val === null) return 0;
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const courseType = getCourseType(data);
  const weights = getCourseWeights(courseType);

  // 1. ESE:
  // ESE weights come from the course type: theory-only (50, or 60 for the new theory-only courses), theory + practical (40 + 10), or practical-only (50)
  const ese = Math.max(0, Math.min(100, parseNum(data.ese)));
  const ese_theory_p = (ese / 100) * weights.eseTheoryWeight;

  let ese_lab_p = 0;
  if (weights.eseLabWeight > 0) {
    const eseLabMax = Math.max(1, parseNum(data.eseLabMax) || 100);
    const eseLab = Math.max(0, Math.min(eseLabMax, parseNum(data.eseLab)));
    ese_lab_p = eseLabMax > 0 ? (eseLab / eseLabMax) * weights.eseLabWeight : 0;
  }

  const ese_p = ese_theory_p + ese_lab_p;

  // 2. Test 1: test1_p = (test1 / test1_max) * testWeight (max = testWeight of the course type)
  const test1Max = Math.max(1, parseNum(data.test1Max) || 50);
  const test1 = Math.max(0, Math.min(test1Max, parseNum(data.test1)));
  const test1_p = test1Max > 0 ? (test1 / test1Max) * weights.testWeight : 0;

  // 3. Test 2: test2_p = (test2 / test2_max) * testWeight (max = testWeight of the course type)
  const test2Max = Math.max(1, parseNum(data.test2Max) || 50);
  const test2 = Math.max(0, Math.min(test2Max, parseNum(data.test2)));
  const test2_p = test2Max > 0 ? (test2 / test2Max) * weights.testWeight : 0;

  // 4. Activity 1: act1_p = (act1 / (act1_no * 10)) * actWeight (max 2.5)
  const act1No = Math.max(0, parseNum(data.act1No));
  const act1Scores = syncScoresArray(data.act1Scores, act1No);
  const act1_sum = act1Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const act1_p = act1No > 0 ? (act1_sum / (act1No * 10)) * weights.actWeight : 0;

  // 5. Activity 2: act2_p = (act2 / (act2_no * 10)) * actWeight (max 2.5)
  const act2No = Math.max(0, parseNum(data.act2No));
  const act2Scores = syncScoresArray(data.act2Scores, act2No);
  const act2_sum = act2Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const act2_p = act2No > 0 ? (act2_sum / (act2No * 10)) * weights.actWeight : 0;

  // 6. Lab 1: lab1_p = (lab1 / (lab1_no * 10)) * labWeight (max = labWeight of the course type)
  const lab1No = Math.max(0, parseNum(data.lab1No));
  const lab1Scores = syncScoresArray(data.lab1Scores, lab1No);
  const lab1_sum = lab1Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const lab1_p = lab1No > 0 ? (lab1_sum / (lab1No * 10)) * weights.labWeight : 0;

  // 7. Lab 2: lab2_p = (lab2 / (lab2_no * 10)) * labWeight (max = labWeight of the course type)
  const lab2No = Math.max(0, parseNum(data.lab2No));
  const lab2Scores = syncScoresArray(data.lab2Scores, lab2No);
  const lab2_sum = lab2Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const lab2_p = lab2No > 0 ? (lab2_sum / (lab2No * 10)) * weights.labWeight : 0;

  // Subtotals
  const ca1_total = test1_p + act1_p + lab1_p; // max = caMax (25, or 20 for theory-only)
  const ca2_total = test2_p + act2_p + lab2_p; // max = caMax
  const internal_total = ca1_total + ca2_total; // max = internalMax (50, or 40 for theory-only)

  // Total
  const total = ese_p + internal_total; // max 100
  const grade = getGradeForScore(total);

  return {
    courseType: weights.courseType,
    courseTypeLabel: weights.courseTypeLabel,
    testWeight: weights.testWeight,
    actWeight: weights.actWeight,
    labWeight: weights.labWeight,
    caMax: weights.caMax,
    internalMax: weights.internalMax,
    eseWeight: weights.eseWeight,
    eseTheoryWeight: weights.eseTheoryWeight,
    eseLabWeight: weights.eseLabWeight,
    ese_p: round2(ese_p),
    ese_theory_p: round2(ese_theory_p),
    ese_lab_p: round2(ese_lab_p),
    test1_p: round2(test1_p),
    test2_p: round2(test2_p),
    act1_sum: round2(act1_sum),
    act1_p: round2(act1_p),
    act2_sum: round2(act2_sum),
    act2_p: round2(act2_p),
    lab1_sum: round2(lab1_sum),
    lab1_p: round2(lab1_p),
    lab2_sum: round2(lab2_sum),
    lab2_p: round2(lab2_p),
    ca1_total: round2(ca1_total),
    ca2_total: round2(ca2_total),
    internal_total: round2(internal_total),
    total: round2(total),
    grade,
  };
}

export function round2(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

// Clean initial blank subject with no prefilled marks
export const DEFAULT_SUBJECT: SubjectData = {
  id: 'sub_1',
  name: '',
  code: '',
  ese: '',
  eseLab: '',
  eseLabMax: 100,
  test1Max: 50,
  test1: '',
  act1No: '',
  act1Scores: [],
  lab1No: '',
  lab1Scores: [],
  test2Max: 50,
  test2: '',
  act2No: '',
  act2Scores: [],
  lab2No: '',
  lab2Scores: [],
};

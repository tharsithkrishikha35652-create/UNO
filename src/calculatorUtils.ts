import { SubjectData, CalculationBreakdown, GradeInfo, SpecialGradeInfo, CourseType, ProjectWorkMarks, ProjectWorkComponentResult } from './types';

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
  '1-0-4': { courseTypeLabel: '1-0-4 LIT', testWeight: 5, actWeight: 2.5, labWeight: 17.5, eseTheoryWeight: 0, eseLabWeight: 50 },
  '1+4': { courseTypeLabel: '1-0-4 LIT', testWeight: 5, actWeight: 2.5, labWeight: 17.5, eseTheoryWeight: 0, eseLabWeight: 50 },
  // Theory-only courses (Calculus, Fundamentals of Electrical and Electronics Engineering):
  // 100 = ESE 60 + Internals 40; Internals = CA1 20 + CA2 20; each CA = Test 16 + Activities 4
  theory: { courseTypeLabel: 'Theory Only', testWeight: 16, actWeight: 4, labWeight: 0, eseTheoryWeight: 60, eseLabWeight: 0 },
  // Project / internship evaluation per the university regulation table:
  // CA = Review I (10%) + Review II (20%) + Review III (30%) = 60%
  // ESE = Report evaluation + viva voce = 40%
  project: { courseTypeLabel: 'Internship cum Project Work — current 60% CA, 40% ESE', testWeight: 10, actWeight: 20, labWeight: 0, eseTheoryWeight: 40, eseLabWeight: 0 },
  // Project Work alone follows Table 6's seven review, thesis-report, and viva-voce components.
  'project-work': { courseTypeLabel: 'Project Work — Table 6 (60% CA, 40% ESE)', testWeight: 0, actWeight: 0, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  // SDC flowchart: two CAs of 30 each (Test 5 + Activity 2.5 + Lab 22.5),
  // plus ESE Theory 15 and ESE Practical 25, for a total of 100.
  'self-development': { courseTypeLabel: 'Self Development Course — 60% CA, 40% ESE', testWeight: 5, actWeight: 2.5, labWeight: 22.5, eseTheoryWeight: 15, eseLabWeight: 25 },
  // Industry Oriented Courses: two equally weighted tests; no ESE.
  'industry-oriented-tests': { courseTypeLabel: 'Industry Oriented Course — Two Tests, 50% Each', testWeight: 50, actWeight: 0, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  'universal-human-values': { courseTypeLabel: 'Universal Human Values — Test 70%, Assignments 30%', testWeight: 70, actWeight: 30, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  'standards-course': { courseTypeLabel: 'Standards — Two Equal Tests, No ESE', testWeight: 50, actWeight: 0, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  'audit-course': { courseTypeLabel: 'Audit Course — Two Equal Tests, No ESE', testWeight: 50, actWeight: 0, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  'self-learning': { courseTypeLabel: 'Self-Learning Course — External Result', testWeight: 0, actWeight: 0, labWeight: 0, eseTheoryWeight: 0, eseLabWeight: 0 },
  'laboratory-course': { courseTypeLabel: 'Laboratory Course — 60% CA, 40% ESE', testWeight: 15, actWeight: 0, labWeight: 45, eseTheoryWeight: 0, eseLabWeight: 40 },
  'heritage-course': { courseTypeLabel: 'Heritage of Tamils — Tests 16% + Activities 4% per assessment, ESE 60%', testWeight: 16, actWeight: 4, labWeight: 0, eseTheoryWeight: 60, eseLabWeight: 0 },
};

export function isCourseType(value: unknown): value is CourseType {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(COURSE_WEIGHTS, value);
}

export function getCourseType(data: SubjectData): CourseType {
  const normalizedName = data.name.trim().toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ');
  if (normalizedName === 'industry oriented course i' || normalizedName === 'industry oriented course ii') {
    return 'industry-oriented-tests';
  }
  if (normalizedName === 'industry oriented course iii') return 'industry-oriented-tests';
  if (normalizedName === 'universal human values') return 'universal-human-values';
  if (normalizedName === 'standards computer science & engg.') return 'standards-course';
  if (normalizedName === 'self learning course') return 'self-learning';
  if (normalizedName === 'audit course i' || normalizedName === 'audit course ii') return 'audit-course';
  if (normalizedName === 'heritage of tamils' || normalizedName === 'tamils and technology') return 'heritage-course';
  if (isCourseType(data.courseType)) return data.courseType;
  return '2-0-2'; // fallback
}

export function getCourseWeights(courseType: CourseType): CourseWeights {
  const w = COURSE_WEIGHTS[courseType] ?? COURSE_WEIGHTS['2-0-2'];
  if (courseType === 'project-work' || courseType === 'project') {
    return {
      courseType,
      courseTypeLabel: w.courseTypeLabel,
      testWeight: 0,
      actWeight: 0,
      labWeight: 0,
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      eseTheoryWeight: 0,
      eseLabWeight: 0,
      totalMax: 100,
    };
  }
  if (courseType === 'universal-human-values') {
    return {
      courseType,
      courseTypeLabel: w.courseTypeLabel,
      testWeight: w.testWeight,
      actWeight: w.actWeight,
      labWeight: 0,
      caMax: 100,
      internalMax: 100,
      eseWeight: 0,
      eseTheoryWeight: 0,
      eseLabWeight: 0,
      totalMax: 100,
    };
  }
  if (courseType === 'laboratory-course') {
    return {
      courseType,
      courseTypeLabel: w.courseTypeLabel,
      testWeight: 15,
      actWeight: 0,
      labWeight: 45,
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      eseTheoryWeight: 0,
      eseLabWeight: 40,
      totalMax: 100,
    };
  }
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
    ese = `ESE: Theory ${w.eseTheoryWeight}M + Lab ${w.eseLabWeight}M - ${w.eseWeight}M total`;
  } else if (w.eseLabWeight > 0) {
    ese = `ESE: Practical Exam ${w.eseLabWeight}M - 50M total`;
  } else if (w.eseWeight === 0) {
    ese = 'ESE: None';
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
    if (i < currentScores.length && currentScores[i] !== undefined && currentScores[i] !== null) {
      result.push(currentScores[i]);
    } else {
      result.push(''); // blank box for the user to enter marks!
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

  if (courseType === 'project-work' || courseType === 'project') {
    const score = (value: number | string | undefined): number => {
      const parsed = parseNum(value);
      return Math.max(0, Math.min(100, parsed));
    };
    const marks: ProjectWorkMarks = data.projectWorkMarks ?? {
      reviewI: '', reviewII: '', reviewIII: '', thesisGuide: '', thesisExternal: '', vivaExternal: '', vivaInternal: '',
    };
    const componentDefinitions: Array<Pick<ProjectWorkComponentResult, 'key' | 'label' | 'section' | 'weight'>> = [
      { key: 'reviewI', label: 'Review I', section: 'Continuous Assessment' as const, weight: 10 },
      { key: 'reviewII', label: 'Review II', section: 'Continuous Assessment' as const, weight: 20 },
      { key: 'reviewIII', label: 'Review III', section: 'Continuous Assessment' as const, weight: 30 },
      { key: 'thesisGuide', label: 'Project Thesis Report Evaluation — Guide', section: 'End-Semester Examination' as const, weight: 10 },
      { key: 'thesisExternal', label: 'Project Thesis Report Evaluation — External Examiner', section: 'End-Semester Examination' as const, weight: 10 },
      { key: 'vivaExternal', label: 'Viva-Voce — External Examiner', section: 'End-Semester Examination' as const, weight: 10 },
      { key: 'vivaInternal', label: 'Viva-Voce — Internal Examiner', section: 'End-Semester Examination' as const, weight: 10 },
    ];
    const components: ProjectWorkComponentResult[] = componentDefinitions.map((component) => {
      const componentScore = score(marks[component.key]);
      return { ...component, score: componentScore, contribution: round2(componentScore * component.weight / 100) };
    });
    const internalTotal = components
      .filter((component) => component.section === 'Continuous Assessment')
      .reduce((sum, component) => sum + component.contribution, 0);
    const eseTotal = components
      .filter((component) => component.section === 'End-Semester Examination')
      .reduce((sum, component) => sum + component.contribution, 0);
    const total = round2(internalTotal + eseTotal);
    const reviewsAndVivaComplete = componentDefinitions.every((component) => marks[component.key] !== '' && marks[component.key] !== null && marks[component.key] !== undefined);

    return {
      courseType,
      courseTypeLabel: weights.courseTypeLabel,
      testWeight: 0,
      actWeight: 0,
      labWeight: 0,
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      eseTheoryWeight: 0,
      eseLabWeight: 0,
      ese_p: round2(eseTotal),
      ese_theory_p: 0,
      ese_lab_p: 0,
      test1_p: 0,
      test2_p: 0,
      act1_sum: 0,
      act1_p: 0,
      act2_sum: 0,
      act2_p: 0,
      lab1_sum: 0,
      lab1_p: 0,
      lab2_sum: 0,
      lab2_p: 0,
      ca1_total: round2(components[0].contribution),
      ca2_total: round2(components[1].contribution + components[2].contribution),
      internal_total: round2(internalTotal),
      total,
      grade: getGradeForScore(reviewsAndVivaComplete && total >= 50 && eseTotal / 40 * 100 >= 45 ? total : 49),
      projectWorkComponents: components,
    };
  }

  if (courseType === 'universal-human-values') {
    const rawTestMax = parseNum(data.test1Max);
    const testMax = rawTestMax > 0 ? rawTestMax : 50;
    const test = Math.max(0, Math.min(testMax, parseNum(data.test1)));
    const activity1Count = Math.max(0, Math.floor(parseNum(data.act1No)));
    const activity2Count = Math.max(0, Math.floor(parseNum(data.act2No)));
    const activity1Scores = syncScoresArray(data.act1Scores, activity1Count);
    const activity2Scores = syncScoresArray(data.act2Scores, activity2Count);
    const activity1Sum = activity1Scores.reduce<number>((sum, value) => sum + Math.max(0, Math.min(10, parseNum(value))), 0);
    const activity2Sum = activity2Scores.reduce<number>((sum, value) => sum + Math.max(0, Math.min(10, parseNum(value))), 0);
    const testPoints = test / testMax * 70;
    const activity1Points = activity1Count > 0 ? activity1Sum / (activity1Count * 10) * 15 : 0;
    const activity2Points = activity2Count > 0 ? activity2Sum / (activity2Count * 10) * 15 : 0;
    const total = round2(testPoints + activity1Points + activity2Points);
    const requiredActivitiesComplete = activity1Count > 0 && activity2Count > 0 &&
      activity1Scores.every((value) => value !== '' && value !== null && value !== undefined) &&
      activity2Scores.every((value) => value !== '' && value !== null && value !== undefined);
    return {
      courseType,
      courseTypeLabel: weights.courseTypeLabel,
      testWeight: 70,
      actWeight: 30,
      labWeight: 0,
      caMax: 100,
      internalMax: 100,
      eseWeight: 0,
      eseTheoryWeight: 0,
      eseLabWeight: 0,
      ese_p: 0,
      ese_theory_p: 0,
      ese_lab_p: 0,
      test1_p: round2(testPoints),
      test2_p: 0,
      act1_sum: round2(activity1Sum),
      act1_p: round2(activity1Points),
      act2_sum: round2(activity2Sum),
      act2_p: round2(activity2Points),
      lab1_sum: 0,
      lab1_p: 0,
      lab2_sum: 0,
      lab2_p: 0,
      ca1_total: round2(testPoints + activity1Points),
      ca2_total: round2(activity2Points),
      internal_total: total,
      total,
      grade: getGradeForScore(data.test1 !== '' && data.test1 !== null && data.test1 !== undefined && requiredActivitiesComplete && total >= 50 ? total : 49),
    };
  }

  if (courseType === 'laboratory-course') {
    const workMark = Math.max(0, Math.min(100, parseNum(data.labCourseWorkMark)));
    const midtermMark = Math.max(0, Math.min(100, parseNum(data.labCourseMidtermMark)));
    const examMark = Math.max(0, Math.min(100, parseNum(data.labCourseExamMark)));
    const workPoints = round2(workMark * 0.45);
    const midtermPoints = round2(midtermMark * 0.15);
    const examPoints = round2(examMark * 0.40);
    const internalTotal = round2(workPoints + midtermPoints);
    const total = round2(internalTotal + examPoints);
    return {
      courseType,
      courseTypeLabel: weights.courseTypeLabel,
      testWeight: 15,
      actWeight: 0,
      labWeight: 45,
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      eseTheoryWeight: 0,
      eseLabWeight: 40,
      ese_p: examPoints,
      ese_theory_p: 0,
      ese_lab_p: examPoints,
      test1_p: midtermPoints,
      test2_p: 0,
      act1_sum: 0,
      act1_p: 0,
      act2_sum: 0,
      act2_p: 0,
      lab1_sum: workMark,
      lab1_p: workPoints,
      lab2_sum: 0,
      lab2_p: 0,
      ca1_total: internalTotal,
      ca2_total: 0,
      internal_total: internalTotal,
      total,
      grade: getGradeForScore(data.labCourseWorkMark !== '' && data.labCourseWorkMark !== undefined && data.labCourseWorkMark !== null && data.labCourseMidtermMark !== '' && data.labCourseMidtermMark !== undefined && data.labCourseMidtermMark !== null && data.labCourseExamMark !== '' && data.labCourseExamMark !== undefined && data.labCourseExamMark !== null && total >= 50 && examMark >= 45 ? total : 49),
    };
  }

  if (courseType === 'self-learning') {
    const mark = Math.max(0, Math.min(100, parseNum(data.ese)));
    const passMark = Number(data.selfLearningPassMark) === 40 ? 40 : 50;
    const slcGrade = mark >= 90
      ? { ...GRADE_SCALE[0], minScore: 90, maxScore: 100, rangeLabel: '90 – 100' }
      : mark >= 80
        ? { ...GRADE_SCALE[1], minScore: 80, maxScore: 89, rangeLabel: '80 – 89' }
        : mark >= 70
          ? { ...GRADE_SCALE[2], minScore: 70, maxScore: 79, rangeLabel: '70 – 79' }
          : mark >= 60
            ? { ...GRADE_SCALE[3], minScore: 60, maxScore: 69, rangeLabel: '60 – 69' }
            : mark >= 50
              ? { ...GRADE_SCALE[4], minScore: 50, maxScore: 59, rangeLabel: '50 – 59' }
              : mark >= 40
                ? { ...GRADE_SCALE[5], minScore: 40, maxScore: 49, rangeLabel: '40 – 49' }
                : { ...GRADE_SCALE[GRADE_SCALE.length - 1], minScore: 0, maxScore: 39, rangeLabel: '< 40' };
    return {
      courseType,
      courseTypeLabel: weights.courseTypeLabel,
      testWeight: 0,
      actWeight: 0,
      labWeight: 0,
      caMax: 0,
      internalMax: 0,
      eseWeight: 0,
      eseTheoryWeight: 0,
      eseLabWeight: 0,
      ese_p: 0,
      ese_theory_p: 0,
      ese_lab_p: 0,
      test1_p: 0,
      test2_p: 0,
      act1_sum: 0,
      act1_p: 0,
      act2_sum: 0,
      act2_p: 0,
      lab1_sum: 0,
      lab1_p: 0,
      lab2_sum: 0,
      lab2_p: 0,
      ca1_total: 0,
      ca2_total: 0,
      internal_total: 0,
      total: mark,
      grade: mark >= passMark
        ? slcGrade
        : { ...GRADE_SCALE[GRADE_SCALE.length - 1], minScore: 0, maxScore: passMark - 0.01, rangeLabel: `< ${passMark}` },
    };
  }

  // 1. ESE:
  // ESE weights come from the course type: theory-only (50, or 60 for the new theory-only courses), theory + practical (40 + 10), or practical-only (50)
  const ese = Math.max(0, Math.min(100, parseNum(data.ese)));
  const ese_theory_p = (ese / 100) * weights.eseTheoryWeight;

  let ese_lab_p = 0;
  if (weights.eseLabWeight > 0) {
    const rawEseLabMax = parseNum(data.eseLabMax);
    const eseLabMax = rawEseLabMax > 0 ? rawEseLabMax : 100;
    const eseLab = Math.max(0, Math.min(eseLabMax, parseNum(data.eseLab)));
    ese_lab_p = (eseLab / eseLabMax) * weights.eseLabWeight;
  }

  const ese_p = ese_theory_p + ese_lab_p;

  // 2. Test 1: test1_p = (test1 / test1_max) * testWeight (max = testWeight of the course type)
  const rawTest1Max = parseNum(data.test1Max);
  const test1Max = rawTest1Max > 0 ? rawTest1Max : 50;
  const test1 = Math.max(0, Math.min(test1Max, parseNum(data.test1)));
  const test1_p = (test1 / test1Max) * weights.testWeight;

  // 3. Test 2: test2_p = (test2 / test2_max) * testWeight (max = testWeight of the course type)
  const rawTest2Max = parseNum(data.test2Max);
  const test2Max = rawTest2Max > 0 ? rawTest2Max : 50;
  const test2 = Math.max(0, Math.min(test2Max, parseNum(data.test2)));
  const test2_p = (test2 / test2Max) * weights.testWeight;

  // 4. Activity 1: act1_p = (act1 / (act1_no * 10)) * actWeight (max 2.5)
  const act1No = Math.max(0, Math.floor(parseNum(data.act1No)));
  const act1Scores = syncScoresArray(data.act1Scores, act1No);
  const act1_sum = act1Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const act1_p = act1No > 0 ? (act1_sum / (act1No * 10)) * weights.actWeight : 0;

  // 5. Activity 2: act2_p = (act2 / (act2_no * 10)) * actWeight (max 2.5)
  const act2No = Math.max(0, Math.floor(parseNum(data.act2No)));
  const act2Scores = syncScoresArray(data.act2Scores, act2No);
  const act2_sum = act2Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const act2_p = act2No > 0 ? (act2_sum / (act2No * 10)) * weights.actWeight : 0;

  // 6. Lab 1: lab1_p = (lab1 / (lab1_no * 10)) * labWeight (max = labWeight of the course type)
  const lab1No = Math.max(0, Math.floor(parseNum(data.lab1No)));
  const lab1Scores = syncScoresArray(data.lab1Scores, lab1No);
  const lab1_sum = lab1Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const lab1_p = lab1No > 0 ? (lab1_sum / (lab1No * 10)) * weights.labWeight : 0;

  // 7. Lab 2: lab2_p = (lab2 / (lab2_no * 10)) * labWeight (max = labWeight of the course type)
  const lab2No = Math.max(0, Math.floor(parseNum(data.lab2No)));
  const lab2Scores = syncScoresArray(data.lab2Scores, lab2No);
  const lab2_sum = lab2Scores.reduce<number>((acc, curr) => acc + Math.max(0, Math.min(10, parseNum(curr))), 0);
  const lab2_p = lab2No > 0 ? (lab2_sum / (lab2No * 10)) * weights.labWeight : 0;

  // Subtotals
  const ca1_total = test1_p + act1_p + lab1_p; // max = caMax (25, or 20 for theory-only)
  const ca2_total = test2_p + act2_p + lab2_p; // max = caMax
  const internal_total = ca1_total + ca2_total; // max = internalMax (50, or 40 for theory-only)

  // Total
  const total = ese_p + internal_total; // max 100
  const eseExamPercentage = weights.eseWeight > 0 ? ese_p / weights.eseWeight * 100 : 100;
  const allScoresEntered = (values: Array<number | string | undefined>): boolean =>
    values.every((value) => value !== '' && value !== null && value !== undefined);
  const scoresEntered =
    (weights.testWeight === 0 || allScoresEntered([data.test1, data.test2])) &&
    (weights.actWeight === 0 || (Number(data.act1No) >= 1 && Number(data.act2No) >= 1 &&
      allScoresEntered(syncScoresArray(data.act1Scores, data.act1No)) &&
      allScoresEntered(syncScoresArray(data.act2Scores, data.act2No)))) &&
    (weights.labWeight === 0 || (Number(data.lab1No) >= 1 && Number(data.lab2No) >= 1 &&
      allScoresEntered(syncScoresArray(data.lab1Scores, data.lab1No)) &&
      allScoresEntered(syncScoresArray(data.lab2Scores, data.lab2No)))) &&
    (weights.eseTheoryWeight === 0 || allScoresEntered([data.ese])) &&
    (weights.eseLabWeight === 0 || allScoresEntered([data.eseLab]));
  const grade = getGradeForScore(scoresEntered && total >= 50 && eseExamPercentage >= 45 ? total : 49);

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
  projectWorkMarks: {
    reviewI: '',
    reviewII: '',
    reviewIII: '',
    thesisGuide: '',
    thesisExternal: '',
    vivaExternal: '',
    vivaInternal: '',
  },
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

export interface CourseGradeEntry {
  credits: number;
  gradePoint: number;
}

/**
 * Calculates GPA from a list of courses with credits and grade points.
 * Returns 0 if total credits is 0.
 */
export function calculateGPA(courses: Array<CourseGradeEntry>): number {
  const totalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  if (totalCredits <= 0) return 0;
  const totalWeightedPoints = courses.reduce(
    (sum, c) => sum + (Number(c.credits) || 0) * (Number(c.gradePoint) || 0),
    0
  );
  return round2(totalWeightedPoints / totalCredits);
}

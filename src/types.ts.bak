export type CourseType =
  | '2-0-2'
  | '3-0-2'
  | '2-0-4'
  | '1-0-2'
  | '1-0-4'
  | '3-0-4'
  | '3+2'
  | '2+4'
  | '1+2'
  | '1+4'
  | '3+4'
  | 'theory'
  | 'project'
  | 'project-work'
  | 'self-development'
  | 'industry-oriented-tests'
  | 'universal-human-values'
  | 'standards-course'
  | 'audit-course'
  | 'self-learning'
  | 'laboratory-course'
  | 'heritage-course';

export interface SubjectData {
  id: string;
  name: string;
  code: string;
  courseType?: CourseType;
  projectWorkMarks?: ProjectWorkMarks;
  selfLearningPassMark?: number | string;
  labCourseWorkMark?: number | string;
  labCourseMidtermMark?: number | string;
  labCourseExamMark?: number | string;
  
  // End Semester
  ese: number | string; // out of 100 (ESE Theory)
  eseLab?: number | string; // ESE Lab Practical marks
  eseLabMax?: number | string; // User-input max marks for ESE Lab (default e.g. 100)
  
  // CA 1
  test1Max: number | string;
  test1: number | string;
  act1No: number | string;
  act1Scores: (number | string)[];
  lab1No: number | string;
  lab1Scores: (number | string)[];
  
  // CA 2
  test2Max: number | string;
  test2: number | string;
  act2No: number | string;
  act2Scores: (number | string)[];
  lab2No: number | string;
  lab2Scores: (number | string)[];
}

export interface AcademicProfileData {
  studentName: string;
  rollNumber: string;
  department: string;
}

export interface ProjectWorkMarks {
  reviewI: number | string;
  reviewII: number | string;
  reviewIII: number | string;
  thesisGuide: number | string;
  thesisExternal: number | string;
  vivaExternal: number | string;
  vivaInternal: number | string;
}

export interface ProjectWorkComponentResult {
  key: keyof ProjectWorkMarks;
  label: string;
  section: 'Continuous Assessment' | 'End-Semester Examination';
  weight: number;
  score: number;
  contribution: number;
}

export interface CalculationBreakdown {
  courseType: CourseType;
  courseTypeLabel: string;
  testWeight: number;
  actWeight: number;
  labWeight: number;
  caMax: number;
  internalMax: number;
  eseWeight: number;
  eseTheoryWeight: number;
  eseLabWeight: number;

  // Points / Marks Contributed for Total
  ese_p: number;
  ese_theory_p: number;
  ese_lab_p: number;
  test1_p: number;
  test2_p: number;
  act1_sum: number;
  act1_p: number;
  act2_sum: number;
  act2_p: number;
  lab1_sum: number;
  lab1_p: number;
  lab2_sum: number;
  lab2_p: number;
  
  // Subtotals
  ca1_total: number; // out of caMax (25, or 20 for theory-only courses)
  ca2_total: number; // out of caMax
  internal_total: number; // out of internalMax (50, or 40 for theory-only courses)
  
  // Grand Total
  total: number; // out of 100
  
  // Academic Grade
  grade: GradeInfo;
  projectWorkComponents?: ProjectWorkComponentResult[];
}

export interface GradeInfo {
  letter: string;
  label: string;
  gradePoint: number;
  colorClass: string;
  bgClass: string;
  minScore: number;
  maxScore?: number;
  rangeLabel?: string;
}

export interface SpecialGradeInfo {
  code: string;
  description: string;
  gradePoint: number;
}

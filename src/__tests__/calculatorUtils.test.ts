import { describe, it, expect } from 'vitest';
import {
  GRADE_SCALE,
  SPECIAL_GRADES,
  getGradeForScore,
  getCourseType,
  getCourseWeights,
  describeWeights,
  syncScoresArray,
  calculateMarks,
  calculateGPA,
  round2,
  isCourseType,
  DEFAULT_SUBJECT,
} from '../calculatorUtils';
import { SubjectData } from '../types';

describe('calculatorUtils - Unit Tests', () => {
  describe('GRADE_SCALE and getGradeForScore', () => {
    it('returns S (10 points) for scores in 91 – 100', () => {
      expect(getGradeForScore(100)).toMatchObject({ letter: 'S', gradePoint: 10 });
      expect(getGradeForScore(95.5)).toMatchObject({ letter: 'S', gradePoint: 10 });
      expect(getGradeForScore(91.0)).toMatchObject({ letter: 'S', gradePoint: 10 });
    });

    it('returns A+ (9 points) for scores in 81 – 90.99', () => {
      expect(getGradeForScore(90.9)).toMatchObject({ letter: 'A+', gradePoint: 9 });
      expect(getGradeForScore(85.0)).toMatchObject({ letter: 'A+', gradePoint: 9 });
      expect(getGradeForScore(81.0)).toMatchObject({ letter: 'A+', gradePoint: 9 });
    });

    it('returns A (8 points) for scores in 71 – 80.99', () => {
      expect(getGradeForScore(80.9)).toMatchObject({ letter: 'A', gradePoint: 8 });
      expect(getGradeForScore(75.0)).toMatchObject({ letter: 'A', gradePoint: 8 });
      expect(getGradeForScore(71.0)).toMatchObject({ letter: 'A', gradePoint: 8 });
    });

    it('returns B+ (7 points) for scores in 61 – 70.99', () => {
      expect(getGradeForScore(70.9)).toMatchObject({ letter: 'B+', gradePoint: 7 });
      expect(getGradeForScore(65.0)).toMatchObject({ letter: 'B+', gradePoint: 7 });
      expect(getGradeForScore(61.0)).toMatchObject({ letter: 'B+', gradePoint: 7 });
    });

    it('returns B (6 points) for scores in 56 – 60.99', () => {
      expect(getGradeForScore(60.9)).toMatchObject({ letter: 'B', gradePoint: 6 });
      expect(getGradeForScore(58.0)).toMatchObject({ letter: 'B', gradePoint: 6 });
      expect(getGradeForScore(56.0)).toMatchObject({ letter: 'B', gradePoint: 6 });
    });

    it('returns C (5 points) for scores in 50 – 55.99', () => {
      expect(getGradeForScore(55.9)).toMatchObject({ letter: 'C', gradePoint: 5 });
      expect(getGradeForScore(52.5)).toMatchObject({ letter: 'C', gradePoint: 5 });
      expect(getGradeForScore(50.0)).toMatchObject({ letter: 'C', gradePoint: 5 });
    });

    it('returns U (0 points) for scores below 50', () => {
      expect(getGradeForScore(49.99)).toMatchObject({ letter: 'U', gradePoint: 0 });
      expect(getGradeForScore(25.0)).toMatchObject({ letter: 'U', gradePoint: 0 });
      expect(getGradeForScore(0)).toMatchObject({ letter: 'U', gradePoint: 0 });
      expect(getGradeForScore(-5)).toMatchObject({ letter: 'U', gradePoint: 0 });
    });

    it('handles rounding precision at boundaries', () => {
      expect(getGradeForScore(90.995)).toMatchObject({ letter: 'S', gradePoint: 10 });
      expect(getGradeForScore(90.994)).toMatchObject({ letter: 'A+', gradePoint: 9 });
      expect(getGradeForScore(49.995)).toMatchObject({ letter: 'C', gradePoint: 5 });
      expect(getGradeForScore(49.994)).toMatchObject({ letter: 'U', gradePoint: 0 });
    });

    it('exports valid special grades SA and WC with 0 grade points', () => {
      expect(SPECIAL_GRADES).toEqual([
        { code: 'SA', description: 'Shortage of Attendance', gradePoint: 0 },
        { code: 'WC', description: 'Withdrawal of Course', gradePoint: 0 },
      ]);
    });
  });

  describe('isCourseType type guard', () => {
    it('returns true for all recognized course types', () => {
      expect(isCourseType('theory')).toBe(true);
      expect(isCourseType('2-0-2')).toBe(true);
      expect(isCourseType('2-0-4')).toBe(true);
      expect(isCourseType('1-0-2')).toBe(true);
      expect(isCourseType('3-0-4')).toBe(true);
      expect(isCourseType('1-0-4')).toBe(true);
      expect(isCourseType('project-work')).toBe(true);
      expect(isCourseType('project')).toBe(true);
      expect(isCourseType('laboratory-course')).toBe(true);
      expect(isCourseType('self-learning')).toBe(true);
      expect(isCourseType('universal-human-values')).toBe(true);
      expect(isCourseType('self-development')).toBe(true);
      expect(isCourseType('industry-oriented-tests')).toBe(true);
      expect(isCourseType('standards-course')).toBe(true);
      expect(isCourseType('audit-course')).toBe(true);
      expect(isCourseType('heritage-course')).toBe(true);
    });

    it('returns false for invalid types, null, or undefined', () => {
      expect(isCourseType('invalid-type')).toBe(false);
      expect(isCourseType('')).toBe(false);
      expect(isCourseType(null)).toBe(false);
      expect(isCourseType(undefined)).toBe(false);
      expect(isCourseType(123)).toBe(false);
    });
  });

  describe('round2 precision utility', () => {
    it('rounds numbers to two decimal places', () => {
      expect(round2(10.123)).toBe(10.12);
      expect(round2(10.126)).toBe(10.13);
      expect(round2(0)).toBe(0);
      expect(round2(-5.678)).toBe(-5.68);
    });
  });

  describe('getCourseType and getCourseWeights', () => {
    it('detects course types by known subject names', () => {
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Universal Human Values' })).toBe('universal-human-values');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Heritage of Tamils' })).toBe('heritage-course');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Tamils and Technology' })).toBe('heritage-course');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Industry Oriented Course I' })).toBe('industry-oriented-tests');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Audit Course I' })).toBe('audit-course');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Self Learning Course' })).toBe('self-learning');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Standards Computer Science & Engg.' })).toBe('standards-course');
    });

    it('preserves explicit valid courseType on subject', () => {
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Random Course', courseType: 'theory' })).toBe('theory');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Random Course', courseType: '2-0-4' })).toBe('2-0-4');
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Random Course', courseType: 'project-work' })).toBe('project-work');
    });

    it('falls back to 2-0-2 for unknown subject and courseType', () => {
      expect(getCourseType({ ...DEFAULT_SUBJECT, name: 'Unknown Subject', courseType: undefined })).toBe('2-0-2');
    });

    it('provides correct weight totals for various course types', () => {
      const theory = getCourseWeights('theory');
      expect(theory.caMax).toBe(20);
      expect(theory.internalMax).toBe(40);
      expect(theory.eseWeight).toBe(60);
      expect(theory.totalMax).toBe(100);

      const lit202 = getCourseWeights('2-0-2');
      expect(lit202.caMax).toBe(25);
      expect(lit202.internalMax).toBe(50);
      expect(lit202.eseWeight).toBe(50);
      expect(lit202.totalMax).toBe(100);

      const lit204 = getCourseWeights('2-0-4');
      expect(lit204.caMax).toBe(25);
      expect(lit204.eseTheoryWeight).toBe(40);
      expect(lit204.eseLabWeight).toBe(10);
      expect(lit204.eseWeight).toBe(50);

      const sdc = getCourseWeights('self-development');
      expect(sdc.caMax).toBe(30);
      expect(sdc.internalMax).toBe(60);
      expect(sdc.eseTheoryWeight).toBe(15);
      expect(sdc.eseLabWeight).toBe(25);
      expect(sdc.eseWeight).toBe(40);

      const industry = getCourseWeights('industry-oriented-tests');
      expect(industry.caMax).toBe(50);
      expect(industry.internalMax).toBe(100);
      expect(industry.eseWeight).toBe(0);

      const project = getCourseWeights('project-work');
      expect(project.internalMax).toBe(60);
      expect(project.eseWeight).toBe(40);
    });

    it('generates human-readable descriptions with describeWeights', () => {
      expect(describeWeights('theory')).toContain('Test 16M');
      expect(describeWeights('2-0-2')).toContain('Lab 7.5M');
      expect(describeWeights('universal-human-values')).toContain('ESE: None');
    });
  });

  describe('syncScoresArray', () => {
    it('preserves existing values and pads new slots with empty strings', () => {
      expect(syncScoresArray([8, 9], 4)).toEqual([8, 9, '', '']);
    });

    it('truncates array if count is smaller than current length', () => {
      expect(syncScoresArray([10, 8, 9, 7], 2)).toEqual([10, 8]);
    });

    it('handles count 0 or negative count gracefully', () => {
      expect(syncScoresArray([5, 6], 0)).toEqual([]);
      expect(syncScoresArray([5, 6], -2)).toEqual([]);
    });

    it('handles invalid / non-numeric count gracefully', () => {
      expect(syncScoresArray([5, 6], 'abc')).toEqual([]);
      expect(syncScoresArray([5, 6], '')).toEqual([]);
    });
  });

  describe('calculateMarks - 0 Marks Across All Components', () => {
    it('calculates 0 total and U grade for a theory course with all zeros', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 0,
        act1No: 1,
        act1Scores: [0],
        test2Max: 50,
        test2: 0,
        act2No: 1,
        act2Scores: [0],
        ese: 0,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(0);
      expect(result.test1_p).toBe(0);
      expect(result.act1_p).toBe(0);
      expect(result.test2_p).toBe(0);
      expect(result.act2_p).toBe(0);
      expect(result.ese_p).toBe(0);
      expect(result.internal_total).toBe(0);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('calculates 0 total and U grade for a 2-0-2 LIT course with all zeros', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Engineering Physics',
        courseType: '2-0-2',
        test1Max: 50,
        test1: 0,
        act1No: 1,
        act1Scores: [0],
        lab1No: 1,
        lab1Scores: [0],
        test2Max: 50,
        test2: 0,
        act2No: 1,
        act2Scores: [0],
        lab2No: 1,
        lab2Scores: [0],
        ese: 0,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(0);
      expect(result.internal_total).toBe(0);
      expect(result.ese_p).toBe(0);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('calculates 0 total and U grade for project work with all zeros', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Project Work',
        courseType: 'project-work',
        projectWorkMarks: {
          reviewI: 0,
          reviewII: 0,
          reviewIII: 0,
          thesisGuide: 0,
          thesisExternal: 0,
          vivaExternal: 0,
          vivaInternal: 0,
        },
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(0);
      expect(result.internal_total).toBe(0);
      expect(result.ese_p).toBe(0);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });
  });

  describe('calculateMarks - Maximum Marks (100) Across All Course Types', () => {
    it('awards 100 total and S grade (10 points) for theory course with perfect scores', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 50,
        act1No: 2,
        act1Scores: [10, 10],
        test2Max: 50,
        test2: 50,
        act2No: 2,
        act2Scores: [10, 10],
        ese: 100,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(16);
      expect(result.act1_p).toBe(4);
      expect(result.ca1_total).toBe(20);
      expect(result.test2_p).toBe(16);
      expect(result.act2_p).toBe(4);
      expect(result.ca2_total).toBe(20);
      expect(result.internal_total).toBe(40);
      expect(result.ese_p).toBe(60);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total and S grade for 2-0-2 LIT course with perfect scores', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Foundation English',
        courseType: '2-0-2',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        lab1No: 1,
        lab1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        lab2No: 1,
        lab2Scores: [10],
        ese: 100,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(15);
      expect(result.act1_p).toBe(2.5);
      expect(result.lab1_p).toBe(7.5);
      expect(result.ca1_total).toBe(25);
      expect(result.internal_total).toBe(50);
      expect(result.ese_p).toBe(50);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total and S grade for 2-0-4 LIT course (Programming in C)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Programming in C',
        courseType: '2-0-4',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        lab1No: 1,
        lab1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        lab2No: 1,
        lab2Scores: [10],
        ese: 100,
        eseLab: 100,
        eseLabMax: 100,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(10);
      expect(result.act1_p).toBe(2.5);
      expect(result.lab1_p).toBe(12.5);
      expect(result.ca1_total).toBe(25);
      expect(result.internal_total).toBe(50);
      expect(result.ese_theory_p).toBe(40);
      expect(result.ese_lab_p).toBe(10);
      expect(result.ese_p).toBe(50);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total and S grade for 1-0-2 LIT course (Computational Thinking)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Computational Thinking',
        courseType: '1-0-2',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        lab1No: 1,
        lab1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        lab2No: 1,
        lab2Scores: [10],
        eseLab: 100,
        eseLabMax: 100,
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(50);
      expect(result.ese_theory_p).toBe(0);
      expect(result.ese_lab_p).toBe(50);
      expect(result.ese_p).toBe(50);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for SDC (Self Development Course) with 60% CA and 40% ESE', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Skill Development Course – I',
        courseType: 'self-development',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        lab1No: 1,
        lab1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        lab2No: 1,
        lab2Scores: [10],
        ese: 100,
        eseLab: 100,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(5);
      expect(result.act1_p).toBe(2.5);
      expect(result.lab1_p).toBe(22.5);
      expect(result.ca1_total).toBe(30);
      expect(result.internal_total).toBe(60);
      expect(result.ese_theory_p).toBe(15);
      expect(result.ese_lab_p).toBe(25);
      expect(result.ese_p).toBe(40);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for Industry Oriented Courses (Two 50% Tests, No ESE)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Industry Oriented Course I',
        test1Max: 50,
        test1: 50,
        test2Max: 50,
        test2: 50,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(50);
      expect(result.test2_p).toBe(50);
      expect(result.internal_total).toBe(100);
      expect(result.ese_p).toBe(0);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for Standards Course (Two 50% Tests, No ESE)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Standards Computer Science & Engg.',
        test1Max: 50,
        test1: 50,
        test2Max: 50,
        test2: 50,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for Audit Course (Two 50% Tests, No ESE)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Audit Course I',
        test1Max: 50,
        test1: 50,
        test2Max: 50,
        test2: 50,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total and S grade for Project Work with 100 across all 7 parts', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Project Work',
        courseType: 'project-work',
        projectWorkMarks: {
          reviewI: 100,
          reviewII: 100,
          reviewIII: 100,
          thesisGuide: 100,
          thesisExternal: 100,
          vivaExternal: 100,
          vivaInternal: 100,
        },
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(60);
      expect(result.ese_p).toBe(40);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for Universal Human Values with 100%', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Universal Human Values',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        act2No: 1,
        act2Scores: [10],
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(70);
      expect(result.act1_p).toBe(15);
      expect(result.act2_p).toBe(15);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('awards 100 total for Laboratory Course with perfect marks', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Data Structures Lab',
        courseType: 'laboratory-course',
        labCourseWorkMark: 100,
        labCourseMidtermMark: 100,
        labCourseExamMark: 100,
      };

      const result = calculateMarks(subject);
      expect(result.lab1_p).toBe(45);
      expect(result.test1_p).toBe(15);
      expect(result.internal_total).toBe(60);
      expect(result.ese_p).toBe(40);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });
  });

  describe('calculateMarks - Empty Subjects & Incomplete Inputs', () => {
    it('returns 0 total and U grade for DEFAULT_SUBJECT', () => {
      const result = calculateMarks(DEFAULT_SUBJECT);
      expect(result.total).toBe(0);
      expect(result.internal_total).toBe(0);
      expect(result.ese_p).toBe(0);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('withholds grade (assigns U / 0 points) when scores are incomplete even if entered subtotal >= 50', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        ese: '',
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(40);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('withholds grade when activity boxes are defined but scores are blank', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 50,
        act1No: 2,
        act1Scores: [10, ''],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        ese: 80,
      };

      const result = calculateMarks(subject);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });
  });

  describe('calculateMarks - Invalid and Edge Case Inputs', () => {
    it('clamps negative marks to 0', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: -20,
        act1No: 1,
        act1Scores: [-5],
        test2Max: 50,
        test2: -15,
        act2No: 1,
        act2Scores: [-10],
        ese: -80,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(0);
      expect(result.act1_p).toBe(0);
      expect(result.test2_p).toBe(0);
      expect(result.act2_p).toBe(0);
      expect(result.ese_p).toBe(0);
      expect(result.total).toBe(0);
      expect(result.grade.letter).toBe('U');
    });

    it('clamps marks that exceed max limits', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 999,
        act1No: 1,
        act1Scores: [50],
        test2Max: 50,
        test2: 200,
        act2No: 1,
        act2Scores: [99],
        ese: 250,
      };

      const result = calculateMarks(subject);
      expect(result.test1_p).toBe(16);
      expect(result.act1_p).toBe(4);
      expect(result.test2_p).toBe(16);
      expect(result.act2_p).toBe(4);
      expect(result.ese_p).toBe(60);
      expect(result.total).toBe(100);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('safely parses non-numeric string values as 0', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 'not_a_number' as unknown as number,
        act1No: 1,
        act1Scores: ['invalid' as unknown as number],
        test2Max: 50,
        test2: 'NaN' as unknown as number,
        act2No: 1,
        act2Scores: ['xyz' as unknown as number],
        ese: 'undefined_val' as unknown as number,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(0);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
      expect(Number.isNaN(result.total)).toBe(false);
    });

    it('handles testMax = 0 or negative testMax safely by defaulting to 50', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 0,
        test1: 25,
        test2Max: -10,
        test2: 25,
        act1No: 1,
        act1Scores: [10],
        act2No: 1,
        act2Scores: [10],
        ese: 100,
      };

      const result = calculateMarks(subject);
      // With fallback max 50: 25/50 * 16 = 8 points each
      expect(result.test1_p).toBe(8);
      expect(result.test2_p).toBe(8);
      expect(Number.isFinite(result.total)).toBe(true);
    });

    it('floors decimal activity counts to whole numbers properly', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 50,
        act1No: '2.8' as unknown as number,
        act1Scores: [10, 10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        ese: 100,
      };

      const result = calculateMarks(subject);
      expect(result.act1_p).toBe(4);
    });
  });

  describe('calculateMarks - Academic Regulation Thresholds (45% ESE)', () => {
    it('fails Theory course with U grade if ESE percentage is below 45% even if total >= 50', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 50,
        act1No: 1,
        act1Scores: [10],
        test2Max: 50,
        test2: 50,
        act2No: 1,
        act2Scores: [10],
        ese: 33.33,
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(40);
      expect(result.total).toBeGreaterThanOrEqual(50);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('passes Theory course with C grade when total >= 50 and ESE percentage >= 45%', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
        test1Max: 50,
        test1: 25,
        act1No: 1,
        act1Scores: [8.75],
        test2Max: 50,
        test2: 25,
        act2No: 1,
        act2Scores: [8.75],
        ese: 45,
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(23);
      expect(result.ese_p).toBe(27);
      expect(result.total).toBe(50);
      expect(result.grade.letter).toBe('C');
      expect(result.grade.gradePoint).toBe(5);
    });

    it('fails Project Work with U grade if ESE percentage is below 45% (18/40)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Project Work',
        courseType: 'project-work',
        projectWorkMarks: {
          reviewI: 100, // 10
          reviewII: 100, // 20
          reviewIII: 100, // 30 -> internalTotal = 60
          thesisGuide: 30, // 3
          thesisExternal: 40, // 4
          vivaExternal: 35, // 3.5
          vivaInternal: 35, // 3.5 -> eseTotal = 14 / 40 = 35% < 45%
        },
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(60);
      expect(result.total).toBe(74); // 74 >= 50!
      // Must fail due to ESE < 45%
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });

    it('fails Laboratory Course with U grade if practical exam mark is below 45%', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Operating Systems Lab',
        courseType: 'laboratory-course',
        labCourseWorkMark: 100, // 45M
        labCourseMidtermMark: 100, // 15M -> internalTotal = 60M
        labCourseExamMark: 40, // 40 < 45 -> 16M
      };

      const result = calculateMarks(subject);
      expect(result.internal_total).toBe(60);
      expect(result.total).toBe(76); // 76 >= 50!
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });
  });

  describe('calculateMarks - Self-Learning Course Custom Grade Scale', () => {
    it('awards S grade for score 90 in Self-Learning Course', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Self Learning Course',
        ese: 90,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(90);
      expect(result.grade.letter).toBe('S');
      expect(result.grade.gradePoint).toBe(10);
    });

    it('respects passMark 40 for Self-Learning Course', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Self Learning Course',
        ese: 45,
        selfLearningPassMark: 40,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(45);
      expect(result.grade.letter).toBe('C');
      expect(result.grade.gradePoint).toBe(5);
    });

    it('fails score 45 when passMark is 50 for Self-Learning Course', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Self Learning Course',
        ese: 45,
        selfLearningPassMark: 50,
      };

      const result = calculateMarks(subject);
      expect(result.total).toBe(45);
      expect(result.grade.letter).toBe('U');
      expect(result.grade.gradePoint).toBe(0);
    });
  });

  describe('calculateGPA - Production Function Tests', () => {
    it('calculates GPA correctly from course grades and credits', () => {
      const courses = [
        { credits: 4, gradePoint: 10 },
        { credits: 3, gradePoint: 9 },
        { credits: 3, gradePoint: 8 },
        { credits: 2, gradePoint: 7 },
      ];

      const gpa = calculateGPA(courses);
      expect(gpa).toBe(8.75);
    });

    it('returns 10.0 GPA when all courses have S grade', () => {
      const courses = [
        { credits: 4, gradePoint: 10 },
        { credits: 4, gradePoint: 10 },
        { credits: 3, gradePoint: 10 },
      ];
      expect(calculateGPA(courses)).toBe(10.0);
    });

    it('returns 0.0 GPA when all courses have U grade', () => {
      const courses = [
        { credits: 4, gradePoint: 0 },
        { credits: 3, gradePoint: 0 },
      ];
      expect(calculateGPA(courses)).toBe(0.0);
    });

    it('handles 0 total credits safely without division by zero', () => {
      expect(calculateGPA([])).toBe(0);
      expect(calculateGPA([{ credits: 0, gradePoint: 8 }])).toBe(0);
    });

    it('handles single course with fractional credits safely', () => {
      expect(calculateGPA([{ credits: 4, gradePoint: 9 }])).toBe(9.0);
    });
  });
});

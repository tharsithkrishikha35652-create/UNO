import { describe, it, expect } from 'vitest';
import { applyEstimatedScores, hasEstimateableComponents, isGpaReady } from '../components/GPACalculator';
import { DEFAULT_SUBJECT } from '../calculatorUtils';
import { GPA_COURSES } from '../gpaCourses';
import { SubjectData } from '../types';

describe('GPACalculator - Estimation & Calculation Utilities', () => {
  describe('hasEstimateableComponents', () => {
    it('returns true for 2-0-2 LIT courses with activities and lab components', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Foundation English',
        courseType: '2-0-2',
      };
      expect(hasEstimateableComponents(subject)).toBe(true);
    });

    it('returns true for theory courses with activities', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Calculus',
        courseType: 'theory',
      };
      expect(hasEstimateableComponents(subject)).toBe(true);
    });

    it('returns false for self learning courses without activities, lab or eseLab', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Self Learning Course',
        courseType: 'self-learning',
      };
      expect(hasEstimateableComponents(subject)).toBe(false);
    });
  });

  describe('applyEstimatedScores', () => {
    it('fills blank activities and lab scores with the specified percentage (e.g. 80%)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Foundation English',
        courseType: '2-0-2',
        act1No: 2,
        act1Scores: [10, ''], // second activity unentered
        act2No: '',
        act2Scores: [],
        lab1No: '',
        lab1Scores: [],
        lab2No: '',
        lab2Scores: [],
      };

      const estimated = applyEstimatedScores(subject, 80);
      // 80% of 10 is 8
      expect(estimated.act1Scores).toEqual([10, 8]);
      expect(estimated.act2Scores).toEqual([8]);
      expect(estimated.lab1Scores).toEqual([8]);
      expect(estimated.lab2Scores).toEqual([8]);
    });

    it('preserves existing entered scores when applying estimates', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Foundation English',
        courseType: '2-0-2',
        act1No: 1,
        act1Scores: [9.5],
        lab1No: 1,
        lab1Scores: [7],
      };

      const estimated = applyEstimatedScores(subject, 70);
      expect(estimated.act1Scores).toEqual([9.5]);
      expect(estimated.lab1Scores).toEqual([7]);
    });

    it('fills unentered ESE practical exam with estimated mark (e.g. 80% of eseLabMax)', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Programming in C',
        courseType: '2-0-4',
        eseLabMax: 100,
        eseLab: '', // unentered
      };

      const estimated = applyEstimatedScores(subject, 85);
      expect(estimated.eseLab).toBe(85);
    });

    it('preserves already entered ESE practical mark', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Programming in C',
        courseType: '2-0-4',
        eseLabMax: 100,
        eseLab: 92,
      };

      const estimated = applyEstimatedScores(subject, 85);
      expect(estimated.eseLab).toBe(92);
    });

    it('clamps negative estimatePercentage to 0%', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Programming in C',
        courseType: '2-0-4',
        act1No: 1,
        act1Scores: [''],
        eseLabMax: 100,
        eseLab: '',
      };

      const estimated = applyEstimatedScores(subject, -25);
      // 0% of 10 is 0
      expect(estimated.act1Scores).toEqual([0]);
      // 0% of 100 is 0
      expect(estimated.eseLab).toBe(0);
    });

    it('clamps estimatePercentage over 100% to 100%', () => {
      const subject: SubjectData = {
        ...DEFAULT_SUBJECT,
        name: 'Programming in C',
        courseType: '2-0-4',
        act1No: 1,
        act1Scores: [''],
        eseLabMax: 100,
        eseLab: '',
      };

      const estimated = applyEstimatedScores(subject, 150);
      // 100% of 10 is 10
      expect(estimated.act1Scores).toEqual([10]);
      // 100% of 100 is 100
      expect(estimated.eseLab).toBe(100);
    });
  });

  describe('isGpaReady', () => {
    it('returns false when subjects list is empty', () => {
      expect(isGpaReady([], false, 1)).toBe(false);
    });

    it('returns false for semester 8 when multiple project courses are present', () => {
      const s8Projects: SubjectData[] = [
        {
          ...DEFAULT_SUBJECT,
          id: 'proj-1',
          name: 'Project Work I',
          courseType: 'project-work',
          semester: 8,
        },
        {
          ...DEFAULT_SUBJECT,
          id: 'proj-2',
          name: 'Project Work II',
          courseType: 'project-work',
          semester: 8,
        },
      ];
      expect(isGpaReady(s8Projects, false, 8)).toBe(false);
    });

    it('returns true when all courses in the semester have valid calculated signatures', () => {
      const semester1Courses = GPA_COURSES.filter((c) => c.semester === 1);
      const subjects: SubjectData[] = semester1Courses.map((c) => ({
        ...DEFAULT_SUBJECT,
        id: `s-${c.code}`,
        code: c.code,
        name: c.name,
        semester: 1,
      }));

      // Map each subject's ID to its serialized state in calculatedSignatures
      const signatures: Record<string, string> = {};
      subjects.forEach((s) => {
        signatures[s.id] = JSON.stringify(s);
      });

      expect(isGpaReady(subjects, false, 1, signatures)).toBe(true);
    });
  });
});

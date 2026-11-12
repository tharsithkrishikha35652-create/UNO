import { describe, expect, it } from 'vitest';
import {
  calculateNeededTheoryMark,
  calculateTargetGradeEseRequirement,
} from '../src/components/EndSemesterSection';
import { calculateMarks, DEFAULT_SUBJECT, GRADE_SCALE } from '../src/calculatorUtils';

describe('Target Grade Simulator - ESE Minimum Passing Requirement', () => {
  const internalTotal = 38.4;
  const eseTheoryWeight = 60;
  const numericEseMax = 100;

  it('calculates the exact required ESE marks enforcing the 45% ESE minimum (C=45, B=45, B+=45, A=55, A+=72, S=88)', () => {
    const expectedValues: Record<string, number> = {
      C: 45,
      B: 45,
      'B+': 45,
      A: 55,
      'A+': 72,
      S: 88,
    };

    GRADE_SCALE.filter((g) => g.letter !== 'U').forEach((grade) => {
      const result = calculateTargetGradeEseRequirement({
        targetMinScore: grade.minScore,
        internalTotal,
        eseTheoryWeight,
        numericEseMax,
      });

      expect(result.minEsePass).toBe(45);
      expect(result.neededEse).toBe(expectedValues[grade.letter]);
      expect(result.isImpossible).toBe(false);
      expect(result.isAlreadySecured).toBe(false);
    });
  });

  it('enforces 45% minimum ESE requirement even when internal marks alone exceed target score', () => {
    const highInternals = 52;
    const result = calculateTargetGradeEseRequirement({
      targetMinScore: 50,
      internalTotal: highInternals,
      eseTheoryWeight,
      numericEseMax,
    });

    expect(result.gradeNeededEse).toBeLessThanOrEqual(0);
    expect(result.minEsePass).toBe(45);
    expect(result.neededEse).toBe(45);
    expect(result.isAlreadySecured).toBe(false);
  });

  it('flags unattainable grades when required ESE exceeds max marks', () => {
    const lowInternals = 15;
    const result = calculateTargetGradeEseRequirement({
      targetMinScore: 91, // S Grade
      internalTotal: lowInternals,
      eseTheoryWeight,
      numericEseMax,
    });

    expect(result.neededEse).toBeGreaterThan(100);
    expect(result.isImpossible).toBe(true);
  });

  it('scales correctly with non-standard ESE maximum marks', () => {
    const customEseMax = 50;
    const result = calculateTargetGradeEseRequirement({
      targetMinScore: 50,
      internalTotal,
      eseTheoryWeight,
      numericEseMax: customEseMax,
    });

    // 45% of 50 = 22.5 -> ceil is 23
    expect(result.minEsePass).toBe(23);
    expect(result.neededEse).toBe(23);
  });
});

describe('calculateMarks agreement with Target Grade Simulator requirements', () => {
  const baseTheoryCourse = {
    ...DEFAULT_SUBJECT,
    name: 'Calculus',
    courseType: 'theory' as const,
    // Construct internal total = 38.4 / 40
    // CA1: test1 (16/16) + act1 (3.2/4) = 19.2
    // CA2: test2 (16/16) + act2 (3.2/4) = 19.2 -> total internals = 38.4
    test1: 50,
    test1Max: 50,
    test2: 50,
    test2Max: 50,
    act1No: 1,
    act1Scores: [8],
    act2No: 1,
    act2Scores: [8],
  };

  it('1. Internal: 38.4/40, ESE: 20/100 -> U Grade (overall 50.4, but fails 45% ESE pass requirement)', () => {
    const result = calculateMarks({
      ...baseTheoryCourse,
      ese: 20,
    });

    expect(result.internal_total).toBe(38.4);
    expect(result.ese_p).toBe(12);
    expect(result.total).toBe(50.4);
    expect(result.grade.letter).toBe('U');
  });

  it('2. Internal: 23/40, ESE: 45/100 -> C Grade (meets both 50 overall threshold and 45 ESE requirement)', () => {
    const cCourse = {
      ...DEFAULT_SUBJECT,
      name: 'Calculus',
      courseType: 'theory' as const,
      // CA internals = 23 (e.g. test1: 25/50 -> 8, test2: 25/50 -> 8, act1: 8.75/10 -> 3.5, act2: 8.75/10 -> 3.5 = 23)
      test1: 25,
      test1Max: 50,
      test2: 25,
      test2Max: 50,
      act1No: 1,
      act1Scores: [8.75],
      act2No: 1,
      act2Scores: [8.75],
      ese: 45,
    };
    const result = calculateMarks(cCourse);

    expect(result.internal_total).toBe(23);
    expect(result.ese_p).toBe(27);
    expect(result.total).toBe(50);
    expect(result.grade.letter).toBe('C');
  });

  it('3. Internal: 38.4/40, ESE: 45/100 -> B+ Grade (meets 45% ESE pass requirement)', () => {
    const result = calculateMarks({
      ...baseTheoryCourse,
      ese: 45,
    });

    expect(result.internal_total).toBe(38.4);
    expect(result.ese_p).toBe(27);
    expect(result.total).toBe(65.4);
    expect(result.grade.letter).toBe('B+');
  });

  it('4. Internal: 38.4/40, ESE: 55/100 -> A Grade', () => {
    const result = calculateMarks({
      ...baseTheoryCourse,
      ese: 55,
    });

    expect(result.internal_total).toBe(38.4);
    expect(result.ese_p).toBe(33);
    expect(result.total).toBe(71.4);
    expect(result.grade.letter).toBe('A');
  });

  it('5. Internal: 38.4/40, ESE: 100/100 -> S Grade', () => {
    const result = calculateMarks({
      ...baseTheoryCourse,
      ese: 100,
    });

    expect(result.internal_total).toBe(38.4);
    expect(result.ese_p).toBe(60);
    expect(result.total).toBe(98.4);
    expect(result.grade.letter).toBe('S');
  });
});

describe('target grade simulator theory requirement (legacy)', () => {
  it('assumes 90% of the ESE lab contribution when no lab mark is entered', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 32,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 0,
        labWeight: 10,
        hasEnteredLabMark: false,
      })
    ).toBe(58);
  });

  it('uses the entered lab contribution instead of the assumption', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 32,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 4,
        labWeight: 10,
        hasEnteredLabMark: true,
      })
    ).toBe(70);
  });

  it('returns zero theory marks when the ESE target is already covered', () => {
    expect(
      calculateNeededTheoryMark({
        neededTotalEse: 8,
        theoryWeight: 40,
        theoryMax: 100,
        labPoints: 0,
        labWeight: 10,
        hasEnteredLabMark: false,
      })
    ).toBe(0);
  });
});

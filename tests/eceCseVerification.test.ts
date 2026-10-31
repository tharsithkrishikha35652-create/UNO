import { describe, it, expect } from 'vitest';
import {
  CSE_GPA_COURSES,
  ECE_GPA_COURSES,
  VLSI_GPA_COURSES,
  getGpaCourses,
  getAllGpaCourses,
} from '../src/gpaCourses';
import {
  CSE_PRESET_COURSES,
  ECE_PRESET_COURSES,
  VLSI_PRESET_COURSES,
  getPresetCourses,
  getElectiveSlotsBySemester,
} from '../src/components/SubjectSelectionDialog';
import { getCourseWeights, getCourseType, calculateMarks } from '../src/calculatorUtils';

describe('Department Course & Curriculum Verification', () => {
  it('verifies CSE total credits is 171 and individual semesters match exactly', () => {
    const cseSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      CSE_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(cseSemCredits).toEqual([21, 22, 27, 23, 26, 27, 17, 8]);
    expect(cseSemCredits.reduce((a, b) => a + b, 0)).toBe(171);
  });

  it('verifies ECE total credits is 170 and individual semesters match CEG curriculum exactly', () => {
    const eceSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      ECE_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    // Sem 1: 23, Sem 2: 24, Sem 3: 22, Sem 4: 24, Sem 5: 23, Sem 6: 23, Sem 7: 23, Sem 8: 8
    expect(eceSemCredits).toEqual([23, 24, 22, 24, 23, 23, 23, 8]);
    expect(eceSemCredits.reduce((a, b) => a + b, 0)).toBe(170);
  });

  it('verifies VLSI total credits is 173 and individual semesters match CEG curriculum exactly', () => {
    const vlsiSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      VLSI_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    // Sem 1: 23, Sem 2: 24, Sem 3: 23, Sem 4: 25, Sem 5: 24, Sem 6: 24, Sem 7: 22, Sem 8: 8
    expect(vlsiSemCredits).toEqual([23, 24, 23, 25, 24, 24, 22, 8]);
    expect(vlsiSemCredits.reduce((a, b) => a + b, 0)).toBe(173);

    // Sem 3 non-CGPA UHV is 2 credits -> CGPA credits = 171
    const sem3Uhv = VLSI_GPA_COURSES.find((c) => c.semester === 3 && c.code === 'UC23U01');
    expect(sem3Uhv?.credits).toBe(2);
    expect(173 - (sem3Uhv?.credits ?? 0)).toBe(171);
  });

  it('verifies getGpaCourses returns correct catalog for CSE, ECE, and VLSI without mutation', () => {
    expect(getGpaCourses('CSE')).toBe(CSE_GPA_COURSES);
    expect(getGpaCourses('ECE')).toBe(ECE_GPA_COURSES);
    expect(getGpaCourses('VLSI')).toBe(VLSI_GPA_COURSES);
    expect(getGpaCourses(undefined)).toBe(CSE_GPA_COURSES);
    expect(getAllGpaCourses().length).toBe(
      CSE_GPA_COURSES.length + ECE_GPA_COURSES.length + VLSI_GPA_COURSES.length
    );
  });

  it('verifies getPresetCourses and elective slots for CSE, ECE, and VLSI', () => {
    expect(getPresetCourses('CSE')).toBe(CSE_PRESET_COURSES);
    expect(getPresetCourses('ECE')).toBe(ECE_PRESET_COURSES);
    expect(getPresetCourses('VLSI')).toBe(VLSI_PRESET_COURSES);

    const vlsiSlots = getElectiveSlotsBySemester('VLSI');
    expect(vlsiSlots[5]).toEqual(['Emerging Technology Course I', 'Professional Elective I']);
    expect(vlsiSlots[6]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective II',
      'Professional Elective III',
      'Open Elective I',
    ]);
    expect(vlsiSlots[7]).toEqual([
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);

    const eceSlots = getElectiveSlotsBySemester('ECE');
    expect(eceSlots[5]).toEqual(['Professional Elective I']);
    expect(eceSlots[6]).toEqual(['Emerging Technology Course I', 'Open Elective I']);
    expect(eceSlots[7]).toEqual([
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
      'Emerging Technology Course II',
      'Open Elective II',
    ]);

    const cseSlots = getElectiveSlotsBySemester('CSE');
    expect(cseSlots[5]).toEqual(['Open Elective I', 'Professional Elective I']);
    expect(cseSlots[6]).toEqual(['Open Elective II', 'Professional Elective II', 'Professional Elective III']);
    expect(cseSlots[7]).toEqual(['Professional Elective IV', 'Professional Elective V', 'Professional Elective VI']);
  });

  it('verifies ECE and VLSI specific course types and weights according to Regulations 2023', () => {
    // Theory: 40% CA, 60% ESE
    expect(getCourseWeights('theory')).toMatchObject({
      caMax: 20,
      internalMax: 40,
      eseWeight: 60,
      totalMax: 100,
    });

    // LIT 3-0-2: 50% CA, 50% ESE
    expect(getCourseWeights('3-0-2')).toMatchObject({
      caMax: 25,
      internalMax: 50,
      eseWeight: 50,
      totalMax: 100,
    });

    // LIT 2-0-4: 50% CA (25 theory + 25 practical), 50% ESE (40 theory + 10 practical)
    expect(getCourseWeights('2-0-4')).toMatchObject({
      caMax: 25,
      internalMax: 50,
      eseWeight: 50,
      totalMax: 100,
    });

    // LIT 1-0-4: 50% CA, 50% ESE
    expect(getCourseWeights('1-0-4')).toMatchObject({
      caMax: 25,
      internalMax: 50,
      eseWeight: 50,
      totalMax: 100,
    });

    // SDC 1-0-2: 60% CA, 40% ESE
    expect(getCourseWeights('self-development')).toMatchObject({
      caMax: 30,
      internalMax: 60,
      eseWeight: 40,
      totalMax: 100,
    });

    // Mini Project & Idea to Product: 60% CA, 40% ESE
    expect(getCourseWeights('laboratory-course')).toMatchObject({
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      totalMax: 100,
    });

    // Project Work: 60% CA, 40% ESE
    expect(getCourseWeights('project')).toMatchObject({
      caMax: 60,
      internalMax: 60,
      eseWeight: 40,
      totalMax: 100,
    });

    // IOC: 100% CA, 0% ESE
    expect(getCourseWeights('industry-oriented-tests')).toMatchObject({
      caMax: 50,
      internalMax: 100,
      eseWeight: 0,
      totalMax: 100,
    });

    // Standards: 100% CA, 0% ESE
    expect(getCourseWeights('standards-course')).toMatchObject({
      caMax: 50,
      internalMax: 100,
      eseWeight: 0,
      totalMax: 100,
    });

    // Verify course type inferences
    expect(getCourseType({ id: '1', name: 'Idea to Product', courseType: 'laboratory-course' } as any)).toBe('laboratory-course');
    expect(getCourseType({ id: '2', name: 'Standards - Electronics Engineering (VLSI Design and Technology)', courseType: 'standards-course' } as any)).toBe('standards-course');
  });

  it('verifies calculation of marks for an ECE subject', () => {
    // Testing 3-0-2 LIT (e.g. Digital VLSI Design or Antenna and Wave Propagation)
    const breakdown = calculateMarks({
      id: 'test_vlsi',
      name: 'Digital VLSI Design',
      code: 'EC23C14',
      courseType: '3-0-2',
      test1: 50,
      test1Max: 50,
      act1No: 1,
      act1Scores: [10],
      lab1No: 1,
      lab1Scores: [100],
      test2: 50,
      test2Max: 50,
      act2No: 1,
      act2Scores: [10],
      lab2No: 1,
      lab2Scores: [100],
      ese: 100,
    });
    expect(breakdown.total).toBe(100);
    expect(breakdown.grade.letter).toBe('S');
    expect(breakdown.grade.gradePoint).toBe(10);
  });
});

import { describe, it, expect } from 'vitest';
import {
  CSE_GPA_COURSES,
  ECE_GPA_COURSES,
  getGpaCourses,
  getAllGpaCourses,
} from '../src/gpaCourses';
import {
  CSE_PRESET_COURSES,
  ECE_PRESET_COURSES,
  getPresetCourses,
  getElectiveSlotsBySemester,
} from '../src/components/SubjectSelectionDialog';
import { getCourseWeights, getCourseType, calculateMarks, isGhostPlaceholderCourse } from '../src/calculatorUtils';

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

  it('verifies getGpaCourses returns correct catalog for CSE and ECE without mutation', () => {
    expect(getGpaCourses('CSE')).toBe(CSE_GPA_COURSES);
    expect(getGpaCourses('ECE')).toBe(ECE_GPA_COURSES);
    expect(getGpaCourses(undefined)).toBe(CSE_GPA_COURSES);
    expect(getAllGpaCourses().length).toBe(
      CSE_GPA_COURSES.length + ECE_GPA_COURSES.length
    );
  });

  it('verifies getPresetCourses and elective slots for CSE and ECE', () => {
    expect(getPresetCourses('CSE')).toBe(CSE_PRESET_COURSES);
    expect(getPresetCourses('ECE')).toBe(ECE_PRESET_COURSES);

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
it('verifies explicit grade-based GPA calculation for a chosen semester', () => {
    const sem1Courses = CSE_GPA_COURSES.filter((c) => c.semester === 1);
    const mockGrades: Record<string, number> = {
      'EN23C03': 10, // S
      'MA23C11': 10, // S
      'PH23C11': 9,  // A+
      'EE23C02': 8,  // A
      'CS23C04': 10, // S
      'CS23101': 10, // S
      'UC23H01': 10, // S
    };
    const totalCredits = sem1Courses.reduce((sum, c) => sum + c.credits, 0);
    const totalWeightedPoints = sem1Courses.reduce((sum, c) => sum + c.credits * (mockGrades[c.code] ?? 10), 0);
    const gpa = totalWeightedPoints / totalCredits;
    expect(totalCredits).toBe(21);
    expect(totalWeightedPoints).toBe(200);
    expect(Number(gpa.toFixed(2))).toBe(9.52);
  });
  it('correctly detects obsolete ghost dummy placeholder courses and preserves real courses', () => {
    expect(isGhostPlaceholderCourse({ name: 'Course 1 (Sem 5)' })).toBe(true);
    expect(isGhostPlaceholderCourse({ name: 'Course 1 (Sem 1)' })).toBe(true);
    expect(isGhostPlaceholderCourse({ name: 'Course 2 (Semester 3)' })).toBe(true);
    expect(isGhostPlaceholderCourse({ name: 'Course 1' })).toBe(true);
    expect(isGhostPlaceholderCourse({ name: 'Course 9' })).toBe(true);

    expect(isGhostPlaceholderCourse({ name: 'Foundation English' })).toBe(false);
    expect(isGhostPlaceholderCourse({ name: 'Matrices and Calculus' })).toBe(false);
    expect(isGhostPlaceholderCourse({ name: 'Digital VLSI Design' })).toBe(false);
    expect(isGhostPlaceholderCourse({ name: 'Object Oriented Programming' })).toBe(false);
  });
});

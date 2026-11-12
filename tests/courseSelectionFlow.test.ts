import { describe, it, expect } from 'vitest';
import { DEFAULT_SUBJECT } from '../src/calculatorUtils';
import { getPresetCourses, type PresetCourse } from '../src/components/SubjectSelectionDialog';
import type { SubjectData, Department } from '../src/types';

// Mirroring the pure course application logic from App.tsx for deterministic test verification
function applyPresetCourseToSubjects(
  previous: SubjectData[],
  course: PresetCourse,
  department: Department
): { nextSubjects: SubjectData[]; targetSubjectId: string } {
  const stableId = `course_${course.id}`;
  let targetSubjectId = stableId;

  // Match existing subject by ID, code, or name
  const existing = previous.find((s) => {
    if (s.id === stableId || s.id === course.id || s.id === `course_${course.id.replace(/^course_/, '')}`) return true;
    if (course.code && s.code && s.code.trim().toUpperCase() === course.code.trim().toUpperCase()) return true;
    if (s.name && course.name && s.name.trim().toLowerCase() === course.name.trim().toLowerCase()) return true;
    return false;
  });

  if (existing) {
    targetSubjectId = existing.id;
    let hasChanges = false;
    let updatedSubject = existing;

    if (!updatedSubject.semester && course.semester) {
      updatedSubject = { ...updatedSubject, semester: course.semester };
      hasChanges = true;
    }
    if (!updatedSubject.code && course.code) {
      updatedSubject = { ...updatedSubject, code: course.code };
      hasChanges = true;
    }
    if (!updatedSubject.courseType && course.courseType) {
      updatedSubject = { ...updatedSubject, courseType: course.courseType };
      hasChanges = true;
    }

    const nextSubjects = hasChanges
      ? previous.map((s) => (s.id === existing.id ? updatedSubject : s))
      : previous;

    return { nextSubjects, targetSubjectId };
  }

  const newSubject: SubjectData = {
    ...DEFAULT_SUBJECT,
    id: stableId,
    name: course.name,
    code: course.code,
    semester: course.semester,
    courseType: course.courseType,
    electiveSlot: course.electiveSlot,
  };
  targetSubjectId = newSubject.id;
  return { nextSubjects: [...previous, newSubject], targetSubjectId };
}

function resolveCurrentSubject(
  subjects: SubjectData[],
  currentSubjectId: string,
  selectedSemester: number | null,
  department: Department = 'ECE'
): SubjectData {
  let found = subjects.find((s) => s.id === currentSubjectId);
  if (found) return found;

  if (currentSubjectId) {
    const strippedId = currentSubjectId.replace(/^course_/, '');
    const altFound = subjects.find(
      (s) => s.id === strippedId || s.id === `course_${strippedId}`
    );
    if (altFound) return altFound;

    const presets = getPresetCourses(department);
    const matchingPreset = presets.find(
      (p) =>
        p.id === currentSubjectId ||
        `course_${p.id}` === currentSubjectId ||
        p.id === strippedId ||
        (Boolean(p.code) && p.code.toUpperCase() === strippedId.toUpperCase())
    );
    if (matchingPreset) {
      const presetSubject = subjects.find((s) => {
        if (s.id === `course_${matchingPreset.id}` || s.id === matchingPreset.id) return true;
        if (matchingPreset.code && s.code && s.code.toUpperCase() === matchingPreset.code.toUpperCase()) return true;
        return false;
      });
      if (presetSubject) return presetSubject;
    }
  }

  if (selectedSemester !== null) {
    const semSubject = subjects.find((s) => s.semester === selectedSemester);
    if (semSubject) return semSubject;
  }

  return subjects[0] || DEFAULT_SUBJECT;
}

describe('Course Selection and Multi-Course Marks Isolation', () => {
  const eceSem1Presets = getPresetCourses('ECE').filter(
    (c) => c.semester === 1 && c.group !== 'elective'
  );

  it('contains exactly 7 core courses in ECE Semester 1', () => {
    expect(eceSem1Presets.length).toBe(7);
  });

  it('selects Foundation English and enters marks without cross-contamination', () => {
    let subjects: SubjectData[] = [];
    const englishCourse = eceSem1Presets.find((c) => c.name === 'Foundation English')!;
    expect(englishCourse).toBeDefined();

    const openEnglish = applyPresetCourseToSubjects(subjects, englishCourse, 'ECE');
    subjects = openEnglish.nextSubjects;
    let currentSubjectId = openEnglish.targetSubjectId;

    let activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.name).toBe('Foundation English');
    expect(activeSubject.code).toBe(englishCourse.code);

    // Enter marks for Foundation English
    subjects = subjects.map((s) =>
      s.id === activeSubject.id ? { ...s, test1: 42, test2: 45, ese: 80 } : s
    );

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.test1).toBe(42);
    expect(activeSubject.test2).toBe(45);
    expect(activeSubject.ese).toBe(80);

    // Step 2: Select Calculus
    const calculusCourse = eceSem1Presets.find((c) => c.name === 'Calculus')!;
    expect(calculusCourse).toBeDefined();

    const openCalculus = applyPresetCourseToSubjects(subjects, calculusCourse, 'ECE');
    subjects = openCalculus.nextSubjects;
    currentSubjectId = openCalculus.targetSubjectId;

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.name).toBe('Calculus');
    expect(activeSubject.code).toBe(calculusCourse.code);
    expect(activeSubject.courseType).toBe('theory');
    // Calculus marks should be clean / default, not English marks!
    expect(activeSubject.test1).toBe('');
    expect(activeSubject.test2).toBe('');
    expect(activeSubject.ese).toBe('');

    // Step 3: Enter marks for Calculus
    subjects = subjects.map((s) =>
      s.id === activeSubject.id ? { ...s, test1: 48, test2: 50, ese: 92 } : s
    );

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.test1).toBe(48);
    expect(activeSubject.test2).toBe(50);
    expect(activeSubject.ese).toBe(92);

    // Step 4: Select Engineering Physics
    const physicsCourse = eceSem1Presets.find((c) => c.name === 'Engineering Physics')!;
    expect(physicsCourse).toBeDefined();

    const openPhysics = applyPresetCourseToSubjects(subjects, physicsCourse, 'ECE');
    subjects = openPhysics.nextSubjects;
    currentSubjectId = openPhysics.targetSubjectId;

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.name).toBe('Engineering Physics');
    expect(activeSubject.courseType).toBe('3-0-2');
    expect(activeSubject.test1).toBe('');

    // Step 5: Return to Foundation English
    const returnEnglish = applyPresetCourseToSubjects(subjects, englishCourse, 'ECE');
    subjects = returnEnglish.nextSubjects;
    currentSubjectId = returnEnglish.targetSubjectId;

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.name).toBe('Foundation English');
    // Original marks for Foundation English are perfectly preserved!
    expect(activeSubject.test1).toBe(42);
    expect(activeSubject.test2).toBe(45);
    expect(activeSubject.ese).toBe(80);

    // Step 6: Return to Calculus
    const returnCalculus = applyPresetCourseToSubjects(subjects, calculusCourse, 'ECE');
    subjects = returnCalculus.nextSubjects;
    currentSubjectId = returnCalculus.targetSubjectId;

    activeSubject = resolveCurrentSubject(subjects, currentSubjectId, 1, 'ECE');
    expect(activeSubject.name).toBe('Calculus');
    // Original marks for Calculus are also perfectly preserved!
    expect(activeSubject.test1).toBe(48);
    expect(activeSubject.test2).toBe(50);
    expect(activeSubject.ese).toBe(92);
  });

  it('cycles reliably across all 7 courses without state bleeding', () => {
    let subjects: SubjectData[] = [];
    const courseIds = eceSem1Presets.map((c) => c.id);

    // Open each course in sequence and enter distinct marks
    eceSem1Presets.forEach((course, index) => {
      const openResult = applyPresetCourseToSubjects(subjects, course, 'ECE');
      subjects = openResult.nextSubjects;
      const active = resolveCurrentSubject(subjects, openResult.targetSubjectId, 1, 'ECE');
      expect(active.name).toBe(course.name);

      // Assign unique score based on index
      subjects = subjects.map((s) =>
        s.id === active.id ? { ...s, test1: 20 + index, test2: 25 + index } : s
      );
    });

    expect(subjects.length).toBe(7);

    // Re-verify all 7 courses preserve their exact assigned scores
    eceSem1Presets.forEach((course, index) => {
      const openResult = applyPresetCourseToSubjects(subjects, course, 'ECE');
      const active = resolveCurrentSubject(subjects, openResult.targetSubjectId, 1, 'ECE');
      expect(active.name).toBe(course.name);
      expect(active.test1).toBe(20 + index);
      expect(active.test2).toBe(25 + index);
    });
  });

  it('handles ID prefix variations seamlessly without falling back to the first course', () => {
    // Subject stored with legacy un-prefixed ID 'MA23C11_ECE'
    const legacySubject: SubjectData = {
      ...DEFAULT_SUBJECT,
      id: 'MA23C11_ECE',
      name: 'Calculus',
      code: 'MA23C11',
      semester: 1,
      courseType: 'theory',
      test1: 49,
    };

    const firstSubject: SubjectData = {
      ...DEFAULT_SUBJECT,
      id: 'course_EN23C05_ECE',
      name: 'Foundation English',
      code: 'EN23C05',
      semester: 1,
      courseType: '2-0-2',
      test1: 35,
    };

    const subjects = [firstSubject, legacySubject];

    // Even if caller asks for 'course_MA23C11_ECE', it must resolve to Calculus, NOT Foundation English!
    const resolved = resolveCurrentSubject(subjects, 'course_MA23C11_ECE', 1, 'ECE');
    expect(resolved.name).toBe('Calculus');
    expect(resolved.test1).toBe(49);
    expect(resolved.id).toBe('MA23C11_ECE');
  });

  it('accurately detects active selection state for UI buttons with prefix flexibility', () => {
    const isSelected = (
      subjectId: string | null,
      courseId: string,
      selectedSubjectId: string
    ) =>
      Boolean(
        (subjectId && (subjectId === selectedSubjectId || `course_${subjectId}` === selectedSubjectId || subjectId === selectedSubjectId.replace(/^course_/, ''))) ||
        courseId === selectedSubjectId ||
        `course_${courseId}` === selectedSubjectId
      );

    expect(isSelected('course_MA23C11_ECE', 'MA23C11_ECE', 'course_MA23C11_ECE')).toBe(true);
    expect(isSelected('MA23C11_ECE', 'MA23C11_ECE', 'course_MA23C11_ECE')).toBe(true);
    expect(isSelected('course_MA23C11_ECE', 'MA23C11_ECE', 'MA23C11_ECE')).toBe(true);
    expect(isSelected('course_EN23C05_ECE', 'EN23C05_ECE', 'course_MA23C11_ECE')).toBe(false);
  });
});

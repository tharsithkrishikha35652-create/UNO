import { describe, it, expect } from 'vitest';
import {
  CSE_GPA_COURSES,
  ECE_GPA_COURSES,
  CIVIL_GPA_COURSES,
  GEO_GPA_COURSES,
  BME_GPA_COURSES,
  IT_GPA_COURSES,
  EEE_GPA_COURSES,
  MFG_GPA_COURSES,
  VLSI_GPA_COURSES,
  MECH_GPA_COURSES,
  PT_GPA_COURSES,
  MINING_GPA_COURSES,
  MSE_GPA_COURSES,
  IE_GPA_COURSES,
  getGpaCourses,
  getAllGpaCourses,
} from '../src/gpaCourses';
import {
  CSE_PRESET_COURSES,
  ECE_PRESET_COURSES,
  CIVIL_PRESET_COURSES,
  GEO_PRESET_COURSES,
  BME_PRESET_COURSES,
  IT_PRESET_COURSES,
  EEE_PRESET_COURSES,
  MFG_PRESET_COURSES,
  VLSI_PRESET_COURSES,
  MECH_PRESET_COURSES,
  PT_PRESET_COURSES,
  MINING_PRESET_COURSES,
  MSE_PRESET_COURSES,
  IE_PRESET_COURSES,
  getPresetCourses,
  getElectiveSlotsBySemester,
} from '../src/components/SubjectSelectionDialog';
import { getCourseWeights, getCourseType, calculateMarks, isGhostPlaceholderCourse } from '../src/calculatorUtils';
import { DEPARTMENT_OPTIONS } from '../src/components/AcademicProfile';
import { isVersionOutdated } from '../src/versionUtils';

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

  it('verifies Civil Engineering total credits is 172 and individual semesters match CEG curriculum exactly', () => {
    const civilSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      CIVIL_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    // Sem 1: 22, Sem 2: 23, Sem 3: 26, Sem 4: 26, Sem 5: 25, Sem 6: 21, Sem 7: 21, Sem 8: 8
    expect(civilSemCredits).toEqual([22, 23, 26, 26, 25, 21, 21, 8]);
    expect(civilSemCredits.reduce((a, b) => a + b, 0)).toBe(172);
  });

  it('verifies getPresetCourses and elective slots for Civil Engineering', () => {
    expect(getPresetCourses('CIVIL')).toBe(CIVIL_PRESET_COURSES);
    expect(getPresetCourses('CE')).toBe(CIVIL_PRESET_COURSES);

    const civilSlots = getElectiveSlotsBySemester('CIVIL');
    expect(civilSlots[5]).toEqual(['Professional Elective I', 'Professional Elective II', 'Open Elective I']);
    expect(civilSlots[6]).toEqual(['Professional Elective III', 'Open Elective II', 'Emerging Technology Course I']);
    expect(civilSlots[7]).toEqual([
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
      'Emerging Technology Course II',
    ]);
  });

  it('verifies Civil Engineering elective catalog matches the 2026 syllabus exactly', () => {
    const civilCatalog = getPresetCourses('CIVIL');

    const openElectiveI = civilCatalog
      .filter((course) => course.group === 'elective' && course.electiveSlot === 'Open Elective I')
      .map((course) => course.code)
      .filter(Boolean)
      .sort();

    const emergingTechI = civilCatalog
      .filter((course) => course.group === 'elective' && course.electiveSlot === 'Emerging Technology Course I')
      .map((course) => course.code)
      .filter(Boolean)
      .sort();

    expect(openElectiveI).toEqual(['CE23901', 'CE23902', 'CE23903']);
    expect(emergingTechI).toEqual(['CE23E01', 'CE23E02', 'CE23E03', 'CE23E04']);
  });

  it('verifies IT Engineering open electives are limited to the official IT syllabus set', () => {
    const itCatalog = getPresetCourses('IT');

    const openElectiveCodes = itCatalog
      .filter((course) => course.group === 'elective' && course.electiveSlot === 'Open Elective I')
      .map((course) => course.code)
      .filter(Boolean)
      .sort();

    expect(openElectiveCodes).toEqual([
      'IT23901',
      'IT23902',
      'IT23903',
      'IT23904',
      'IT23905',
      'IT23906',
      'IT23907',
      'IT23908',
    ]);
    expect(openElectiveCodes.every((code) => code.startsWith('IT23'))).toBe(true);
  });

  it('verifies Civil Engineering specific course types and weights', () => {
    expect(getCourseType({ id: 'ce1', name: 'Building and Structural Drawing', courseType: 'laboratory-course' } as any)).toBe('laboratory-course');
    expect(getCourseType({ id: 'ce2', name: 'Environmental Engineering Drawing', courseType: 'laboratory-course' } as any)).toBe('laboratory-course');
    expect(getCourseType({ id: 'ce3', name: 'Digitalized Construction Lab', courseType: 'laboratory-course' } as any)).toBe('laboratory-course');
    expect(getCourseType({ id: 'ce4', name: 'Standards – Civil Engineering', courseType: 'standards-course' } as any)).toBe('standards-course');

    // 3-0-4 LIT (Surveying, Soil Mechanics, Highway Engineering)
    expect(getCourseWeights('3-0-4')).toMatchObject({
      caMax: 25,
      internalMax: 50,
      eseWeight: 50,
      eseTheoryWeight: 40,
      eseLabWeight: 10,
      totalMax: 100,
    });
  });

  it('verifies explicit grade-based GPA calculation for Civil Engineering Semester 1', () => {
    const sem1Courses = CIVIL_GPA_COURSES.filter((c) => c.semester === 1);
    const mockGrades: Record<string, number> = {
      'EN23C05': 9,  // A+ (3 credits = 27)
      'MA23C11': 10, // S  (4 credits = 40)
      'CY23C10': 8,  // A  (4 credits = 32)
      'EE23C02': 9,  // A+ (3 credits = 27)
      'ME23C01': 10, // S  (4 credits = 40)
      'ME23C04': 10, // S  (3 credits = 30)
      'UC23H01': 10, // S  (1 credit  = 10)
    };
    const totalCredits = sem1Courses.reduce((sum, c) => sum + c.credits, 0);
    const totalWeightedPoints = sem1Courses.reduce((sum, c) => sum + c.credits * (mockGrades[c.code] ?? 10), 0);
    const gpa = totalWeightedPoints / totalCredits;
    expect(totalCredits).toBe(22);
    expect(totalWeightedPoints).toBe(206);
    expect(Number(gpa.toFixed(2))).toBe(9.36);
  });


  it('verifies getGpaCourses returns correct catalog for all 14 departments without mutation', () => {
    expect(getGpaCourses('CSE')).toBe(CSE_GPA_COURSES);
    expect(getGpaCourses('ECE')).toBe(ECE_GPA_COURSES);
    expect(getGpaCourses(undefined)).toBe(CSE_GPA_COURSES);
    expect(getAllGpaCourses().length).toBe(
      CSE_GPA_COURSES.length +
        ECE_GPA_COURSES.length +
        CIVIL_GPA_COURSES.length +
        GEO_GPA_COURSES.length +
        BME_GPA_COURSES.length +
        IT_GPA_COURSES.length +
        EEE_GPA_COURSES.length +
        MFG_GPA_COURSES.length +
        VLSI_GPA_COURSES.length +
        MECH_GPA_COURSES.length +
        PT_GPA_COURSES.length +
        MINING_GPA_COURSES.length +
        MSE_GPA_COURSES.length +
        IE_GPA_COURSES.length
    );
    expect(getGpaCourses('CIVIL')).toBe(CIVIL_GPA_COURSES);
    expect(getGpaCourses('CE')).toBe(CIVIL_GPA_COURSES);
    expect(getGpaCourses('GEO')).toBe(GEO_GPA_COURSES);
    expect(getGpaCourses('GI')).toBe(GEO_GPA_COURSES);
    expect(getGpaCourses('BME')).toBe(BME_GPA_COURSES);
    expect(getGpaCourses('BM')).toBe(BME_GPA_COURSES);
    expect(getGpaCourses('IT')).toBe(IT_GPA_COURSES);
    expect(getGpaCourses('EEE')).toBe(EEE_GPA_COURSES);
    expect(getGpaCourses('ELECTRICAL')).toBe(EEE_GPA_COURSES);
    expect(getGpaCourses('MFG')).toBe(MFG_GPA_COURSES);
    expect(getGpaCourses('MANUFACTURING')).toBe(MFG_GPA_COURSES);
    expect(getGpaCourses('VLSI')).toBe(VLSI_GPA_COURSES);
    expect(getGpaCourses('ELECTRONICS_VLSI')).toBe(VLSI_GPA_COURSES);
    expect(getGpaCourses('MECH')).toBe(MECH_GPA_COURSES);
    expect(getGpaCourses('MECHANICAL')).toBe(MECH_GPA_COURSES);
    expect(getGpaCourses('PT')).toBe(PT_GPA_COURSES);
    expect(getGpaCourses('PRINTING')).toBe(PT_GPA_COURSES);
    expect(getGpaCourses('MINING')).toBe(MINING_GPA_COURSES);
    expect(getGpaCourses('MINE')).toBe(MINING_GPA_COURSES);
    expect(getGpaCourses('MSE')).toBe(MSE_GPA_COURSES);
    expect(getGpaCourses('MATSCI')).toBe(MSE_GPA_COURSES);
    expect(getGpaCourses('IE')).toBe(IE_GPA_COURSES);
    expect(getGpaCourses('INDUSTRIAL')).toBe(IE_GPA_COURSES);
  });

  it('keeps every non-elective syllabus course visible in the matching app catalog', () => {
    const departmentCatalogs = [
      ['CSE', CSE_GPA_COURSES],
      ['ECE', ECE_GPA_COURSES],
      ['CIVIL', CIVIL_GPA_COURSES],
      ['GEO', GEO_GPA_COURSES],
      ['BME', BME_GPA_COURSES],
      ['IT', IT_GPA_COURSES],
      ['EEE', EEE_GPA_COURSES],
      ['MFG', MFG_GPA_COURSES],
      ['VLSI', VLSI_GPA_COURSES],
      ['MECH', MECH_GPA_COURSES],
      ['PT', PT_GPA_COURSES],
      ['MINING', MINING_GPA_COURSES],
      ['MSE', MSE_GPA_COURSES],
      ['IE', IE_GPA_COURSES],
    ] as const;

    for (const [department, syllabusCourses] of departmentCatalogs) {
      const visibleCourses = getPresetCourses(department);
      for (const syllabusCourse of syllabusCourses.filter((course) => course.code && !course.electiveSlot)) {
        const normalizedSyllabusName = syllabusCourse.name.trim().toLowerCase();
        expect(
          visibleCourses.some((course) =>
            course.semester === syllabusCourse.semester &&
            (course.code === syllabusCourse.code || course.name.trim().toLowerCase() === normalizedSyllabusName)
          ),
          `${department} ${syllabusCourse.code}`
        ).toBe(true);
      }
    }
  });

  it('verifies Electrical and Electronics Engineering (EEE) total credits is 174 and individual semesters match exactly', () => {
    const eeeSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      EEE_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(eeeSemCredits).toEqual([24, 22, 24, 26, 25, 23, 22, 8]);
    expect(eeeSemCredits.reduce((a, b) => a + b, 0)).toBe(174);
    expect(getPresetCourses('EEE')).toBe(EEE_PRESET_COURSES);
    expect(getPresetCourses('ELECTRICAL')).toBe(EEE_PRESET_COURSES);

    const eeeSlots = getElectiveSlotsBySemester('EEE');
    expect(eeeSlots[4]).toEqual(['Emerging Technology Course I']);
    expect(eeeSlots[5]).toEqual(['Professional Elective I']);
    expect(eeeSlots[6]).toEqual(['Professional Elective II', 'Professional Elective III', 'Open Elective I']);
    expect(eeeSlots[7]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
  });

  it('verifies Manufacturing Engineering (MFG) total credits is 168 and individual semesters match exactly', () => {
    const mfgSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      MFG_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(mfgSemCredits).toEqual([25, 21, 24, 23, 23, 21, 23, 8]);
    expect(mfgSemCredits.reduce((a, b) => a + b, 0)).toBe(168);
    expect(getPresetCourses('MFG')).toBe(MFG_PRESET_COURSES);
    expect(getPresetCourses('MANUFACTURING')).toBe(MFG_PRESET_COURSES);

    const mfgSlots = getElectiveSlotsBySemester('MFG');
    expect(mfgSlots[5]).toEqual(['Emerging Technology Course I']);
    expect(mfgSlots[6]).toEqual([
      'Professional Elective I',
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
      'Professional Elective V',
      'Open Elective I',
    ]);
    expect(mfgSlots[7]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective VI',
      'Open Elective II',
    ]);
    expect(
      getPresetCourses('MFG')
        .filter((course) => course.group === 'elective' && course.electiveSlot === 'Emerging Technology Course II')
        .map((course) => course.code)
    ).toContain('MF23E04');
  });

  it('verifies Electronics Engineering (VLSI Design & Tech) total credits is 172 and individual semesters match exactly', () => {
    const vlsiSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      VLSI_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(vlsiSemCredits).toEqual([23, 24, 23, 24, 24, 24, 22, 8]);
    expect(vlsiSemCredits.reduce((a, b) => a + b, 0)).toBe(172);
    expect(getPresetCourses('VLSI')).toBe(VLSI_PRESET_COURSES);
    expect(getPresetCourses('ELECTRONICS_VLSI')).toBe(VLSI_PRESET_COURSES);

    const vlsiSlots = getElectiveSlotsBySemester('VLSI');
    expect(vlsiSlots[5]).toEqual(['Emerging Technology I', 'Professional Elective I']);
    expect(vlsiSlots[6]).toEqual([
      'Emerging Technology II',
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

    const vlsiCourses = getPresetCourses('VLSI');
    expect(vlsiCourses.filter((course) => course.group === 'elective' && course.electiveSlot === 'Emerging Technology I').map((course) => course.code)).toEqual([
      'VL23E01', 'VL23E02', 'VL23E03', 'VL23E04',
    ]);
    for (const courseCode of ['VL23045', 'VL23046', 'EC23E06', 'VL23048', 'VL23049', 'VL23050', 'VL23051']) {
      expect(vlsiCourses.some((course) => course.group === 'elective' && course.code === courseCode), courseCode).toBe(true);
    }
  });

  it('verifies Mechanical Engineering (MECH) total credits is 177 and individual semesters match exactly', () => {
    const mechSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      MECH_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(mechSemCredits).toEqual([23, 22, 25, 25, 27, 21, 26, 8]);
    expect(mechSemCredits.reduce((a, b) => a + b, 0)).toBe(177);
    expect(getPresetCourses('MECH')).toBe(MECH_PRESET_COURSES);
    expect(getPresetCourses('MECHANICAL')).toBe(MECH_PRESET_COURSES);

    const mechSlots = getElectiveSlotsBySemester('MECH');
    expect(mechSlots[5]).toEqual(['Professional Elective I']);
    expect(mechSlots[6]).toEqual([
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
      'Professional Elective V',
      'Open Elective I',
      'Emerging Technology Course I',
    ]);
    expect(mechSlots[7]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective VI',
      'Open Elective II',
    ]);
    const mechOpenElectiveCodes = getPresetCourses('MECH')
      .filter((course) => course.group === 'elective' && course.electiveSlot === 'Open Elective I')
      .map((course) => course.code);
    expect(mechOpenElectiveCodes).toEqual([
      'ME23901', 'ME23902', 'ME23903', 'ME23904', 'ME23905', 'ME23906',
      'ME23907', 'ME23908', 'ME23909', 'ME23910', 'ME23911',
    ]);
  });

  it('verifies Geoinformatics (GEO) total credits is 171 and individual semesters match exactly', () => {
    const geoSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      GEO_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(geoSemCredits).toEqual([23, 21, 24, 25, 27, 24, 19, 8]);
    expect(geoSemCredits.reduce((a, b) => a + b, 0)).toBe(171);
    expect(getPresetCourses('GEO')).toBe(GEO_PRESET_COURSES);
    expect(getPresetCourses('GI')).toBe(GEO_PRESET_COURSES);

    const geoSlots = getElectiveSlotsBySemester('GEO');
    expect(geoSlots[5]).toEqual(['Professional Elective I', 'Emerging Technology Course I', 'Open Elective I']);
    expect(geoSlots[6]).toEqual(['Professional Elective II', 'Professional Elective III', 'Professional Elective IV', 'Open Elective II']);
    expect(geoSlots[7]).toEqual(['Professional Elective V', 'Professional Elective VI', 'Emerging Technology Course II']);
  });

  it('verifies Biomedical Engineering (BME) total credits is 169 and individual semesters match exactly', () => {
    const bmeSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      BME_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(bmeSemCredits).toEqual([18, 27, 21, 23, 25, 24, 23, 8]);
    expect(bmeSemCredits.reduce((a, b) => a + b, 0)).toBe(169);
    expect(getPresetCourses('BME')).toBe(BME_PRESET_COURSES);
    expect(getPresetCourses('BM')).toBe(BME_PRESET_COURSES);

    const bmeSlots = getElectiveSlotsBySemester('BME');
    expect(bmeSlots[4]).toEqual(['Open Elective I']);
    expect(bmeSlots[5]).toEqual(['Professional Elective I', 'Professional Elective II']);
    expect(bmeSlots[6]).toEqual(['Emerging Technology Course I', 'Professional Elective III', 'Open Elective II']);
    expect(bmeSlots[7]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
    ]);
    const bmeOpenElectives = getPresetCourses('BME').filter(
      (course) => course.group === 'elective' && course.electiveSlot === 'Open Elective I'
    );
    expect(bmeOpenElectives.map((course) => course.code)).toEqual([
      'BM23901', 'BM23902', 'BM23903', 'BM23904',
    ]);
  });

  it('verifies Information Technology (IT) total credits is 170 and individual semesters match exactly', () => {
    const itSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      IT_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(itSemCredits).toEqual([22, 23, 21, 24, 25, 25, 22, 8]);
    expect(itSemCredits.reduce((a, b) => a + b, 0)).toBe(170);
    expect(getPresetCourses('IT')).toBe(IT_PRESET_COURSES);

    const itSlots = getElectiveSlotsBySemester('IT');
    expect(itSlots[5]).toEqual(['Professional Elective I']);
    expect(itSlots[6]).toEqual(['Emerging Technology Course I', 'Professional Elective II', 'Professional Elective III', 'Open Elective I']);
    expect(itSlots[7]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
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
    expect(cseSlots[5]).toEqual(['Professional Elective I', 'Open Elective I']);
    expect(cseSlots[6]).toEqual(['Open Elective II', 'Professional Elective II', 'Professional Elective III']);
    expect(cseSlots[7]).toEqual([
      'Emerging Technology Course I',
      'Emerging Technology Course II',
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
    ]);
    const cseOptions = getPresetCourses('CSE');
    expect(cseOptions.some((course) => course.code === 'CS23063' && course.electiveSlot === 'Professional Elective VI')).toBe(true);
    expect(cseOptions.some((course) => course.code === 'CS23E01' && course.electiveSlot === 'Emerging Technology Course I')).toBe(true);
    expect(cseOptions.some((course) => course.code === 'CS23E02' && course.electiveSlot === 'Emerging Technology Course II')).toBe(true);
    expect(cseOptions.some((course) => course.code === 'CS23904' && course.electiveSlot === 'Open Elective II')).toBe(true);
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

    // Regulation 17.6 laboratory courses: 60% CA, 40% ESE
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

    expect(getCourseWeights('mini-project')).toMatchObject({
      caMax: 100,
      internalMax: 100,
      eseWeight: 0,
      totalMax: 100,
    });
    expect(getCourseWeights('internship-training')).toMatchObject({
      caMax: 100,
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

  it('calculates Mini-Project Table 8 as 100% CA and applies the 50% pass threshold', () => {
    const fullMarks = calculateMarks({
      id: 'mini-project-full',
      name: 'Mini Project',
      code: 'EC23702',
      courseType: 'mini-project',
      miniProjectMarks: {
        reviewI: 100,
        reviewII: 100,
        reviewIIIReport: 100,
        reviewIIIViva: 100,
      },
    } as any);

    expect(fullMarks.continuousAssessmentComponents?.map((component) => component.weight)).toEqual([25, 25, 30, 20]);
    expect(fullMarks.total).toBe(100);
    expect(fullMarks.eseWeight).toBe(0);
    expect(fullMarks.grade.letter).toBe('S');

    const atPassThreshold = calculateMarks({
      id: 'mini-project-pass',
      name: 'Mini Project',
      code: 'EC23702',
      courseType: 'mini-project',
      miniProjectMarks: {
        reviewI: 100,
        reviewII: 100,
        reviewIIIReport: 0,
        reviewIIIViva: 0,
      },
    } as any);
    expect(atPassThreshold.total).toBe(50);
    expect(atPassThreshold.grade.letter).toBe('C');

    const incomplete = calculateMarks({
      id: 'mini-project-incomplete',
      name: 'Mini Project',
      code: 'EC23702',
      courseType: 'mini-project',
      miniProjectMarks: { reviewI: 100, reviewII: 100, reviewIIIReport: 100, reviewIIIViva: '' },
    } as any);
    expect(incomplete.grade.letter).toBe('U');
  });

  it('calculates Internship/Industrial Training Table 7 as 100% CA with the industry viva share', () => {
    const result = calculateMarks({
      id: 'internship-training',
      name: 'Summer Internship',
      code: 'BM23504',
      courseType: 'internship-training',
      internshipTrainingMarks: {
        report: 100,
        presentation: 100,
        vivaVoce: 100,
        industryViva: 100,
      },
    } as any);

    expect(result.continuousAssessmentComponents?.map((component) => component.weight)).toEqual([40, 30, 20, 10]);
    expect(result.total).toBe(100);
    expect(result.eseWeight).toBe(0);
    expect(result.grade.letter).toBe('S');
    expect(getCourseType({ id: 'training-inference', name: 'Industrial Training – I' } as any)).toBe('internship-training');
  });

  it('assigns regulation-only mini-project and internship course mappings without altering lab/project courses', () => {
    const expectedTypes: Array<[string, string, string]> = [
      ['ECE', 'EC23702', 'mini-project'],
      ['BME', 'BM23704', 'mini-project'],
      ['BME', 'BM23504', 'internship-training'],
      ['BME', 'BM23703', 'internship-training'],
      ['MFG', 'MF23503', 'internship-training'],
      ['MECH', 'ME23703', 'internship-training'],
      ['PT', 'PP23704', 'internship-training'],
      ['MINING', 'MI23505', 'internship-training'],
      ['MINING', 'MI23705', 'internship-training'],
      ['ECE', 'EC23801', 'project'],
      ['EEE', 'EE23406', 'laboratory-course'],
    ];

    for (const [department, code, courseType] of expectedTypes) {
      const preset = getPresetCourses(department).find((course) => course.code === code);
      expect(preset?.courseType, `${department} ${code}`).toBe(courseType);
    }
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
  it('keeps restored mathematics courses active in every applicable catalog', () => {
    expect(CSE_GPA_COURSES.some((course) => course.code === 'MA23C11')).toBe(true);
    expect(CSE_GPA_COURSES.some((course) => course.code === 'MA23C04')).toBe(true);
    expect(BME_GPA_COURSES.some((course) => course.code === 'MA23C11')).toBe(true);
    expect(MECH_GPA_COURSES.find((course) => course.code === 'ME23403')?.credits).toBe(4);
  });

  it('uses each 2026 syllabus Foundation English course code', () => {
    expect(CSE_GPA_COURSES.find((course) => course.name === 'Foundation English')?.code).toBe('EN23C03');
    expect(ECE_GPA_COURSES.find((course) => course.name === 'Foundation English')?.code).toBe('EN23C05');
    expect(CSE_PRESET_COURSES.find((course) => course.name === 'Foundation English')?.code).toBe('EN23C03');
    expect(ECE_PRESET_COURSES.find((course) => course.name === 'Foundation English')?.code).toBe('EN23C05');
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

  it('verifies Printing and Packaging Technology (PT) total credits is 175 and individual semesters match exactly', () => {
    const ptSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      PT_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(ptSemCredits).toEqual([24, 21, 26, 25, 25, 23, 23, 8]);
    expect(ptSemCredits.reduce((a, b) => a + b, 0)).toBe(175);
    expect(getPresetCourses('PT')).toBe(PT_PRESET_COURSES);
    expect(getPresetCourses('PRINTING')).toBe(PT_PRESET_COURSES);

    const ptSlots = getElectiveSlotsBySemester('PT');
    expect(ptSlots[5]).toEqual(['Emerging Technology Course I']);
    expect(ptSlots[6]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective I',
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
      'Open Elective I',
    ]);
    expect(ptSlots[7]).toEqual([
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
    const ptOptions = getPresetCourses('PT');
    expect(ptOptions.some((course) => course.code === 'PP23001' && course.electiveSlot === 'Professional Elective I')).toBe(true);
    expect(ptOptions.some((course) => course.code === 'IE23028' && course.electiveSlot === 'Professional Elective VI')).toBe(true);
    expect(ptOptions.some((course) => course.code === 'PP23E04' && course.electiveSlot === 'Emerging Technology Course I')).toBe(true);
    expect(ptOptions.some((course) => course.code === 'PP23903' && course.electiveSlot === 'Open Elective II')).toBe(true);
  });

  it('verifies Mining Engineering (MINING) total credits is 181 and individual semesters match exactly', () => {
    const miningSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      MINING_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(miningSemCredits).toEqual([22, 22, 21, 26, 26, 28, 28, 8]);
    expect(miningSemCredits.reduce((a, b) => a + b, 0)).toBe(181);
    expect(getPresetCourses('MINING')).toBe(MINING_PRESET_COURSES);
    expect(getPresetCourses('MINE')).toBe(MINING_PRESET_COURSES);

    const miningSlots = getElectiveSlotsBySemester('MINING');
    expect(miningSlots[5]).toEqual(['Professional Elective I']);
    expect(miningSlots[6]).toEqual([
      'Open Elective I',
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
    ]);
    expect(miningSlots[7]).toEqual([
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
  });

  it('verifies Materials Science and Engineering (MSE) total credits is 176 and individual semesters match exactly', () => {
    const mseSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      MSE_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(mseSemCredits).toEqual([23, 22, 24, 27, 28, 19, 25, 8]);
    expect(mseSemCredits.reduce((a, b) => a + b, 0)).toBe(176);
    expect(getPresetCourses('MSE')).toBe(MSE_PRESET_COURSES);
    expect(getPresetCourses('MATSCI')).toBe(MSE_PRESET_COURSES);

    const mseSlots = getElectiveSlotsBySemester('MSE');
    expect(mseSlots[5]).toEqual(['Emerging Technology Course I']);
    expect(mseSlots[6]).toEqual([
      'Emerging Technology Course II',
      'Professional Elective I',
      'Professional Elective II',
      'Professional Elective III',
      'Open Elective I',
    ]);
    expect(mseSlots[7]).toEqual([
      'Professional Elective IV',
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
    const mseCourses = getPresetCourses('MSE');
    expect(mseCourses.filter((course) => course.electiveSlot === 'Emerging Technology Course I').map((course) => course.code))
      .toEqual(['MS23E01', 'MS23E02']);
    expect(mseCourses.filter((course) => course.electiveSlot === 'Emerging Technology Course II').map((course) => course.code))
      .toEqual(['MS23E03', 'MS23E04']);
    expect(mseCourses.filter((course) => course.electiveSlot === 'Open Elective I').map((course) => course.code))
      .toEqual(['MS23901', 'MS23902']);
  });

  it('verifies Industrial Engineering (IE) total credits is 177 and individual semesters match exactly', () => {
    const ieSemCredits = [1, 2, 3, 4, 5, 6, 7, 8].map((sem) =>
      IE_GPA_COURSES.filter((c) => c.semester === sem).reduce((s, c) => s + c.credits, 0)
    );
    expect(ieSemCredits).toEqual([24, 21, 23, 23, 28, 23, 27, 8]);
    expect(ieSemCredits.reduce((a, b) => a + b, 0)).toBe(177);
    expect(getPresetCourses('IE')).toBe(IE_PRESET_COURSES);
    expect(getPresetCourses('INDUSTRIAL')).toBe(IE_PRESET_COURSES);

    const ieSlots = getElectiveSlotsBySemester('IE');
    expect(ieSlots[6]).toEqual([
      'Professional Elective I',
      'Professional Elective II',
      'Professional Elective III',
      'Professional Elective IV',
      'Emerging Technology Course I',
      'Open Elective I',
      'Emerging Technology Course II',
    ]);
    expect(ieSlots[7]).toEqual([
      'Professional Elective V',
      'Professional Elective VI',
      'Open Elective II',
    ]);
    const ieCourses = getPresetCourses('IE');
    for (const courseCode of ['IE23015', 'IE23020', 'IE23025', 'IE23031']) {
      expect(ieCourses.some((course) => course.group === 'elective' && course.code === courseCode), courseCode).toBe(true);
    }
    expect(ieCourses.filter((course) => course.electiveSlot === 'Emerging Technology Course I').map((course) => course.code))
      .toEqual(['IE23E01', 'IE23E02', 'IE23E03', 'IE23E04']);
  });

  it('verifies department dropdown options are arranged alphabetically by department name', () => {
    const labels = DEPARTMENT_OPTIONS.map((opt) => opt.label);
    const sortedLabels = [...labels].sort((a, b) => a.localeCompare(b));
    expect(labels).toEqual(sortedLabels);
    expect(labels.length).toBe(14);
  });

  it('verifies version gate comparison semantics correctly block outdated versions', () => {
    expect(isVersionOutdated('1.0.0', '1.0.0')).toBe(false);
    expect(isVersionOutdated('1.0.0', '1.0.1')).toBe(true);
    expect(isVersionOutdated('1.0.1', '1.0.0')).toBe(false);
    expect(isVersionOutdated('1.0.9', '1.1.0')).toBe(true);
    expect(isVersionOutdated('1.9.0', '1.10.0')).toBe(true);
    expect(isVersionOutdated('1.10.0', '1.9.0')).toBe(false);
    expect(isVersionOutdated('v1.0.0', '1.0.1')).toBe(true);
    expect(isVersionOutdated('1.0.0', '')).toBe(false);
  });
});

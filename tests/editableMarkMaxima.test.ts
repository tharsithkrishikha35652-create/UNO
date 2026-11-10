import { describe, expect, it } from 'vitest';
import { calculateMarks, DEFAULT_SUBJECT, getCourseWeights } from '../src/calculatorUtils';

describe('editable assessment maxima', () => {
  it('normalizes regular LIT theory, lab, and ESE marks by their configured maxima', () => {
    const breakdown = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: '2-0-2',
      test1: 25,
      test2: 25,
      ese: 200,
      eseLab: 200,
      eseLabMax: 200,
      act1No: 1,
      act1Scores: [20],
      act2No: 1,
      act2Scores: [20],
      lab1No: 1,
      lab1Scores: [40],
      lab2No: 1,
      lab2Scores: [40],
      markMaxima: {
        eseTheory: 200,
        act1: 20,
        act2: 20,
        lab1: 40,
        lab2: 40,
      },
    });
    const weights = getCourseWeights('2-0-2');

    expect(breakdown.ese_theory_p).toBe(weights.eseTheoryWeight);
    expect(breakdown.ese_lab_p).toBe(weights.eseLabWeight);
    expect(breakdown.act1_p).toBe(weights.actWeight);
    expect(breakdown.act2_p).toBe(weights.actWeight);
    expect(breakdown.lab1_p).toBe(weights.labWeight);
    expect(breakdown.lab2_p).toBe(weights.labWeight);
  });

  it('normalizes UHV assignment scores by independent configured maxima', () => {
    const breakdown = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'universal-human-values',
      test1: 50,
      act1No: 1,
      act1Scores: [25],
      act2No: 1,
      act2Scores: [40],
      markMaxima: { act1: 25, act2: 40 },
    });

    expect(breakdown.act1_p).toBe(15);
    expect(breakdown.act2_p).toBe(15);
    expect(breakdown.total).toBe(100);
  });

  it('normalizes each laboratory-course component independently', () => {
    const breakdown = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'laboratory-course',
      labCourseWorkMark: 80,
      labCourseMidtermMark: 25,
      labCourseExamMark: 150,
      markMaxima: {
        labCourseWork: 80,
        labCourseMidterm: 25,
        labCourseExam: 150,
      },
    });

    expect(breakdown.lab1_p).toBe(45);
    expect(breakdown.test1_p).toBe(15);
    expect(breakdown.ese_p).toBe(40);
    expect(breakdown.total).toBe(100);
  });

  it('normalizes project and continuous-assessment-only components by their configured maxima', () => {
    const project = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'project',
      projectWorkMarks: {
        reviewI: 200,
        reviewII: 0,
        reviewIII: 0,
        thesisGuide: 0,
        thesisExternal: 0,
        vivaExternal: 0,
        vivaInternal: 0,
      },
      markMaxima: { 'project.reviewI': 200 },
    });
    const miniProject = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'mini-project',
      miniProjectMarks: {
        reviewI: 50,
        reviewII: 0,
        reviewIIIReport: 0,
        reviewIIIViva: 0,
      },
      markMaxima: { 'mini-project.reviewI': 50 },
    });
    const internship = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'internship-training',
      internshipTrainingMarks: {
        report: 200,
        presentation: 0,
        vivaVoce: 0,
        industryViva: 0,
      },
      markMaxima: { 'internship-training.report': 200 },
    });

    expect(project.projectWorkComponents?.[0]).toMatchObject({ score: 200, maxScore: 200, contribution: 10 });
    expect(miniProject.continuousAssessmentComponents?.[0]).toMatchObject({ score: 50, maxScore: 50, contribution: 25 });
    expect(internship.continuousAssessmentComponents?.[0]).toMatchObject({ score: 200, maxScore: 200, contribution: 40 });
  });

  it('converts a provider result to a percentage before applying self-learning grades', () => {
    const breakdown = calculateMarks({
      ...DEFAULT_SUBJECT,
      courseType: 'self-learning',
      ese: 180,
      markMaxima: { eseTheory: 200 },
      selfLearningPassMark: 50,
    });

    expect(breakdown.total).toBe(90);
    expect(breakdown.grade.letter).toBe('S');
  });
});

import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalculationBreakdown, SubjectData } from '../types';
import { Check, Copy, Layers } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { motionVariants } from '../motion';

interface ResultsSummaryPanelProps {
  breakdown: CalculationBreakdown;
  subject: SubjectData;
}

interface MobileSummaryRow {
  label: string;
  weight?: string;
  rawMarks: string;
  contribution?: string;
}

export const ResultsSummaryPanel: React.FC<ResultsSummaryPanelProps> = ({
  breakdown,
  subject,
}) => {
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  const testWeight = breakdown.testWeight;
  const labWeight = breakdown.labWeight;
  const actWeight = breakdown.actWeight;
  const eseTheoryWeight = breakdown.eseTheoryWeight;
  const eseLabWeight = breakdown.eseLabWeight;
  const eseWeight = eseTheoryWeight + eseLabWeight;
  const isSplit = eseTheoryWeight > 0 && eseLabWeight > 0;
  const isPracticalOnly = eseTheoryWeight === 0 && eseLabWeight > 0;
  const eseLabMaxNum = Number(subject.eseLabMax) || 100;
  const caMax = breakdown.caMax;
  const internalMax = breakdown.internalMax;
  const hasLab = labWeight > 0;
  const isSelfDevelopment = breakdown.courseType === 'self-development';
  const isIndustryOrientedTests = breakdown.courseType === 'industry-oriented-tests';
  const isStandardsCourse = breakdown.courseType === 'standards-course';
  const isAuditCourse = breakdown.courseType === 'audit-course';
  const isSelfLearningCourse = breakdown.courseType === 'self-learning';
  const isUhvCourse = breakdown.courseType === 'universal-human-values';
  const isLaboratoryCourse = breakdown.courseType === 'laboratory-course';
  const isHeritageCourse = breakdown.courseType === 'heritage-course';
  const projectWorkComponents = breakdown.projectWorkComponents ?? [];
  const hasProjectWorkComponents = Boolean(breakdown.projectWorkComponents);
  const continuousAssessmentComponents = breakdown.continuousAssessmentComponents ?? [];
  const hasContinuousAssessmentComponents = Boolean(breakdown.continuousAssessmentComponents);
  const assessmentOneName = isIndustryOrientedTests
    ? 'Mid Term Test'
    : isStandardsCourse
      ? 'Standards Test I'
      : isAuditCourse
        ? 'Audit Test I'
          : isHeritageCourse
            ? 'Heritage Assessment Test I'
        : 'CA Test 1';
  const assessmentTwoName = isIndustryOrientedTests
    ? 'End Course Test'
    : isStandardsCourse
      ? 'Standards Test II'
      : isAuditCourse
        ? 'Audit Test II'
        : isHeritageCourse
          ? 'Heritage Assessment Test II'
        : 'CA Test 2';

  const test1MaxNum = Number(subject.test1Max) || 50;
  const test2MaxNum = Number(subject.test2Max) || 50;

  const act1Count = Math.max(0, parseInt(String(subject.act1No), 10) || 0);
  const act1Sum = subject.act1Scores
    .slice(0, act1Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const lab1Count = Math.max(0, parseInt(String(subject.lab1No), 10) || 0);
  const lab1Sum = subject.lab1Scores
    .slice(0, lab1Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const act2Count = Math.max(0, parseInt(String(subject.act2No), 10) || 0);
  const act2Sum = subject.act2Scores
    .slice(0, act2Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const lab2Count = Math.max(0, parseInt(String(subject.lab2No), 10) || 0);
  const lab2Sum = subject.lab2Scores
    .slice(0, lab2Count)
    .reduce<number>((acc, v) => acc + (v === '' || isNaN(Number(v)) ? 0 : Number(v)), 0);

  const mobileSummaryRows: MobileSummaryRow[] = isUhvCourse
    ? [
        { label: 'One test', weight: '70%', rawMarks: `${Number(subject.test1 || 0).toFixed(2)} / ${test1MaxNum}`, contribution: `${breakdown.test1_p.toFixed(2)} / 70` },
        { label: `Assignment 1 (${act1Count})`, weight: '15%', rawMarks: `${act1Sum.toFixed(2)} / ${act1Count * 10}`, contribution: `${breakdown.act1_p.toFixed(2)} / 15` },
        { label: `Assignment 2 (${act2Count})`, weight: '15%', rawMarks: `${act2Sum.toFixed(2)} / ${act2Count * 10}`, contribution: `${breakdown.act2_p.toFixed(2)} / 15` },
      ]
    : hasContinuousAssessmentComponents
      ? continuousAssessmentComponents.map((component) => ({
          label: component.label,
          weight: `${component.weight}%`,
          rawMarks: `${component.score.toFixed(2)} / 100`,
          contribution: `${component.contribution.toFixed(2)} / ${component.weight}`,
        }))
    : isLaboratoryCourse
      ? [
          { label: 'Work, observation and record', weight: '45%', rawMarks: `${Number(subject.labCourseWorkMark || 0).toFixed(2)} / 100`, contribution: `${breakdown.lab1_p.toFixed(2)} / 45` },
          { label: 'Midterm practical test', weight: '15%', rawMarks: `${Number(subject.labCourseMidtermMark || 0).toFixed(2)} / 100`, contribution: `${breakdown.test1_p.toFixed(2)} / 15` },
          { label: 'End-semester practical', weight: '40%', rawMarks: `${Number(subject.labCourseExamMark || 0).toFixed(2)} / 100`, contribution: `${breakdown.ese_p.toFixed(2)} / 40` },
        ]
      : isSelfLearningCourse
        ? [{
            label: subject.name || 'Self-Learning Course',
            weight: `Pass threshold: ${Number(subject.selfLearningPassMark) === 40 ? 40 : 50}%`,
            rawMarks: `${Number(subject.ese || 0).toFixed(2)} / 100`,
            contribution: `Indicative grade: ${breakdown.grade.letter}`,
          }]
        : hasProjectWorkComponents
          ? projectWorkComponents.map((component) => ({
              label: component.label,
              weight: `${component.weight}%`,
              rawMarks: `${component.score.toFixed(2)} / 100`,
              contribution: `${component.contribution.toFixed(2)} / ${component.weight}`,
            }))
          : [
              ...(testWeight > 0 ? [
                { label: assessmentOneName, weight: `${testWeight}%`, rawMarks: `${Number(subject.test1 || 0).toFixed(2)} / ${test1MaxNum}`, contribution: `${breakdown.test1_p.toFixed(2)} / ${testWeight}` },
                { label: assessmentTwoName, weight: `${testWeight}%`, rawMarks: `${Number(subject.test2 || 0).toFixed(2)} / ${test2MaxNum}`, contribution: `${breakdown.test2_p.toFixed(2)} / ${testWeight}` },
              ] : []),
              ...(actWeight > 0 ? [
                { label: `${isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'} 1`, weight: `${actWeight}%`, rawMarks: `${act1Sum.toFixed(2)} / ${act1Count * 10}`, contribution: `${breakdown.act1_p.toFixed(2)} / ${actWeight}` },
                { label: `${isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'} 2`, weight: `${actWeight}%`, rawMarks: `${act2Sum.toFixed(2)} / ${act2Count * 10}`, contribution: `${breakdown.act2_p.toFixed(2)} / ${actWeight}` },
              ] : []),
              ...(hasLab ? [
                { label: 'Lab practicals 1', weight: `${labWeight}%`, rawMarks: `${lab1Sum.toFixed(2)} / ${lab1Count * 10}`, contribution: `${breakdown.lab1_p.toFixed(2)} / ${labWeight}` },
                { label: 'Lab practicals 2', weight: `${labWeight}%`, rawMarks: `${lab2Sum.toFixed(2)} / ${lab2Count * 10}`, contribution: `${breakdown.lab1_p.toFixed(2)} / ${labWeight}` },
              ] : []),
              ...(eseTheoryWeight > 0 ? [{
                label: 'ESE Theory Exam',
                weight: `${eseTheoryWeight}%`,
                rawMarks: `${Number(subject.ese || 0).toFixed(2)} / 100`,
                contribution: `${breakdown.ese_theory_p.toFixed(2)} / ${eseTheoryWeight.toFixed(2)}`,
              }] : []),
              ...(eseLabWeight > 0 ? [{
                label: isSelfDevelopment ? 'ESE Practical Exam' : 'ESE Lab Practical Exam',
                weight: `${eseLabWeight}%`,
                rawMarks: `${Number(subject.eseLab || 0).toFixed(2)} / ${eseLabMaxNum}`,
                contribution: `${breakdown.ese_lab_p.toFixed(2)} / ${eseLabWeight.toFixed(2)}`,
              }] : []),
            ];

  const handleCopy = () => {
    if (isUhvCourse) {
      const text = [
        'Universal Human Values — Continuous Assessment only',
        `Course: ${subject.name}`,
        `Test: ${Number(subject.test1 || 0).toFixed(2)} / ${test1MaxNum} | Contribution ${breakdown.test1_p.toFixed(2)} / 70`,
        `Assignment 1: ${act1Sum.toFixed(2)} / ${act1Count * 10} | Contribution ${breakdown.act1_p.toFixed(2)} / 15`,
        `Assignment 2: ${act2Sum.toFixed(2)} / ${act2Count * 10} | Contribution ${breakdown.act2_p.toFixed(2)} / 15`,
        `Total: ${breakdown.total.toFixed(2)} / 100`,
        `Indicative outcome: ${breakdown.grade.letter}`,
      ].join('\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (hasContinuousAssessmentComponents) {
      const isMiniProject = breakdown.courseType === 'mini-project';
      const title = isMiniProject ? 'Mini-Project — Regulation 17.10' : 'Internship / Industrial Training — Regulation 17.9';
      navigator.clipboard.writeText([
        title,
        `Course: ${subject.name}`,
        'Continuous Assessment (100%)',
        ...continuousAssessmentComponents.map((component) =>
          `- ${component.label}: ${component.score.toFixed(2)} / 100 × ${component.weight}% = ${component.contribution.toFixed(2)}`
        ),
        `Continuous Assessment total: ${breakdown.total.toFixed(2)} / 100`,
        `Indicative outcome: ${breakdown.grade.letter}`,
        'End-Semester Examination: None',
      ].join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (isLaboratoryCourse) {
      const text = [
        'Laboratory Course — Regulation 17.6',
        `Course: ${subject.name}`,
        `Work / observation / record: ${Number(subject.labCourseWorkMark || 0).toFixed(2)} / 100 | Contribution ${breakdown.lab1_p.toFixed(2)} / 45`,
        `Midterm practical test: ${Number(subject.labCourseMidtermMark || 0).toFixed(2)} / 100 | Contribution ${breakdown.test1_p.toFixed(2)} / 15`,
        `End-semester practical: ${Number(subject.labCourseExamMark || 0).toFixed(2)} / 100 | Contribution ${breakdown.ese_p.toFixed(2)} / 40`,
        `Total: ${breakdown.total.toFixed(2)} / 100`,
        `Indicative outcome: ${breakdown.grade.letter}`,
      ].join('\n');
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (isSelfLearningCourse) {
      const passMark = Number(subject.selfLearningPassMark) === 40 ? 40 : 50;
      navigator.clipboard.writeText([
        'Self-Learning Course — External Result',
        `Course: ${subject.name || 'Self-Learning Course'}`,
        `Provider mark: ${Number(subject.ese || 0).toFixed(2)} / 100`,
        `Pass threshold: ${passMark}%`,
        `Indicative outcome: ${breakdown.grade.letter}`,
        'The provider’s official result and grade conversion remain authoritative.',
      ].join('\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    if (breakdown.projectWorkComponents) {
      const componentLines = projectWorkComponents.map((component) =>
        `- ${component.label}: ${component.score.toFixed(2)}/100 × ${component.weight}% = ${component.contribution.toFixed(2)}`
      );
      const projectText = [
        breakdown.courseType === 'project'
          ? 'Internship cum Project Work — Regulation 17.7'
          : 'Project Work — Table 6',
        `Course: ${subject.name || 'Project Work'}`,
        'Continuous Assessment (60%)',
        ...componentLines.slice(0, 3),
        `CA subtotal: ${breakdown.internal_total.toFixed(2)} / 60`,
        'End-Semester Examination (40%)',
        ...componentLines.slice(3),
        `ESE subtotal: ${breakdown.ese_p.toFixed(2)} / 40`,
        `Final total: ${breakdown.total.toFixed(2)} / 100`,
        `Final grade: ${breakdown.grade.letter} — ${breakdown.grade.label} | Grade Point: ${breakdown.grade.gradePoint}`,
      ].join('\n');
      navigator.clipboard.writeText(projectText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const eseText = eseWeight === 0
      ? 'End-Semester Examination: None (two-test course)'
      : isSplit
      ? `End-Semester Examination:
- ESE Theory Exam: Scored ${subject.ese || 0}/100 | Contributed: ${breakdown.ese_theory_p.toFixed(2)} / ${eseTheoryWeight.toFixed(2)}
    - ESE ${isSelfDevelopment ? 'Practical' : 'Lab Practical'} Exam: Scored ${subject.eseLab || 0}/${eseLabMaxNum} | Contributed: ${breakdown.ese_lab_p.toFixed(2)} / ${eseLabWeight.toFixed(2)}
ESE subtotal: ${breakdown.ese_p.toFixed(2)} / ${eseWeight.toFixed(2)}`
      : isPracticalOnly
        ? `End-Semester Examination: Practical exam scored ${subject.eseLab || 0}/${eseLabMaxNum} | Contributed: ${breakdown.ese_lab_p.toFixed(2)} / ${eseLabWeight.toFixed(2)}`
        : `End-Semester Examination: Scored ${subject.ese || 0}/100 | Contributed: ${breakdown.ese_p.toFixed(2)} / ${eseWeight.toFixed(2)}`;
    const text = `
Academic Marks & Grade Summary
Course: ${subject.name || 'Course'} - ${breakdown.courseTypeLabel}
============================================================
${isIndustryOrientedTests || isStandardsCourse || isAuditCourse || isHeritageCourse ? assessmentOneName : 'Continuous Assessment 1'}
- ${assessmentOneName}: Scored ${subject.test1 || 0}/${test1MaxNum} | Contributed: ${breakdown.test1_p.toFixed(2)} / ${testWeight}
${actWeight > 0 ? `- ${isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'}: Scored ${act1Sum}/${act1Count * 10} | Contributed: ${breakdown.act1_p.toFixed(2)} / ${actWeight}\n` : ''}
${hasLab ? `- ${isSelfDevelopment ? 'Lab' : 'Lab Practicals'}: Scored ${lab1Sum}/${lab1Count * 10} | Contributed: ${breakdown.lab1_p.toFixed(2)} / ${labWeight}\n` : ''}CA 1 Subtotal: ${breakdown.ca1_total.toFixed(2)} / ${caMax.toFixed(2)}

${isIndustryOrientedTests || isStandardsCourse || isAuditCourse || isHeritageCourse ? assessmentTwoName : 'Continuous Assessment 2'}
- ${assessmentTwoName}: Scored ${subject.test2 || 0}/${test2MaxNum} | Contributed: ${breakdown.test2_p.toFixed(2)} / ${testWeight}
${actWeight > 0 ? `- ${isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'}: Scored ${act2Sum}/${act2Count * 10} | Contributed: ${breakdown.act2_p.toFixed(2)} / ${actWeight}\n` : ''}
${hasLab ? `- ${isSelfDevelopment ? 'Lab' : 'Lab Practicals'}: Scored ${lab2Sum}/${lab2Count * 10} | Contributed: ${breakdown.lab2_p.toFixed(2)} / ${labWeight}\n` : ''}CA 2 Subtotal: ${breakdown.ca2_total.toFixed(2)} / ${caMax.toFixed(2)}

Internal assessment total: ${breakdown.internal_total.toFixed(2)} / ${internalMax.toFixed(2)}
${eseText}
============================================================
Final total: ${breakdown.total.toFixed(2)} / 100.00
Final grade: Grade ${breakdown.grade.letter} - ${breakdown.grade.label} | Grade Point: ${breakdown.grade.gradePoint}
============================================================
`.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key={subject.id}
      className="results-summary min-w-0 max-w-full overflow-hidden rounded-2xl bg-white dark:bg-[#161618] border border-slate-300 dark:border-slate-700 p-4 sm:p-6 shadow-sm text-slate-900 dark:text-[#f1f1f3]"
      variants={reduceMotion ? undefined : motionVariants.card}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
    >
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-700 mb-5">
        <span className="text-xs font-bold text-[#c85a32] dark:text-[#e08564] block">
          Academic Performance Evaluation
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-[#172554] dark:text-[#f1f1f3] tracking-tight mt-0.5">
          Marks &amp; Grade Summary
        </h2>
        <div className="flex items-center gap-2 flex-wrap mt-1.5">
          <span className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
            {subject.name || 'Selected Course'}
          </span>
          <span className="text-xs font-bold bg-[#172554] dark:bg-[#27272a] text-white px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>{breakdown.courseTypeLabel}</span>
          </span>
        </div>

        {/* Copy summary action button */}
        <div className="mt-3.5">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 py-2 px-4 text-xs font-bold bg-[#c85a32] hover:bg-[#b54f2a] dark:bg-[#e08564] dark:hover:bg-[#d97757] text-white rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy summary'}</span>
          </button>
        </div>
      </div>

      {/* Primary Result Overview Bar (3 columns with vertical dividers) */}
      <div className="grid grid-cols-3 border-y border-slate-200 dark:border-slate-700 divide-x divide-slate-200 dark:divide-slate-700 my-5 py-3 sm:py-4">
        {/* Total Marks */}
        <div className="pr-2 sm:pr-4 flex flex-col justify-center text-left">
          <span className="text-xs font-bold text-[#c85a32] dark:text-[#e08564] leading-tight break-words mb-1">
            Total Mark
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <AnimatedNumber
              value={breakdown.total}
              className="text-2xl sm:text-4xl font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric"
            />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">/ 100</span>
          </div>
        </div>

        {/* Final Letter Grade */}
        <div className="px-2 sm:px-4 flex flex-col justify-center text-center">
          <span className="text-xs font-bold text-[#c85a32] dark:text-[#e08564] leading-tight break-words mb-1">
            Indicative Grade
          </span>
          <motion.div
            key={breakdown.grade.letter}
            className="text-2xl sm:text-4xl font-black text-[#172554] dark:text-[#f1f1f3] mt-0.5"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {breakdown.grade.letter}
          </motion.div>
          <span className="text-xs font-bold text-[#c85a32] dark:text-[#e08564] leading-tight break-words mt-0.5">
            {breakdown.grade.label}
          </span>
        </div>

        {/* Grade Point */}
        <div className="pl-2 sm:pl-4 flex flex-col justify-center text-right">
          <span className="text-xs font-bold text-[#c85a32] dark:text-[#e08564] leading-tight break-words mb-1">
            Grade Point
          </span>
          <div className="flex justify-end mt-0.5">
            <AnimatedNumber
              value={breakdown.grade.gradePoint}
              decimals={0}
              className="text-2xl sm:text-4xl font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric"
            />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-tight break-words mt-0.5">
            Scale 0 - 10
          </span>
        </div>
      </div>

      {/* Breakdown Rows Container */}
      <section className="mb-4 min-w-0 w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618] sm:hidden" aria-label="Marks breakdown">
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {mobileSummaryRows.map((row, index) => (
            <div key={`${row.label}-${index}`} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
              <div className="min-w-0">
                <p className="break-words text-sm font-bold leading-snug text-[#172554] dark:text-[#f1f1f3]">{row.label}</p>
              </div>
              <div className="min-w-0 text-right shrink-0">
                {row.contribution && <p className="text-base sm:text-lg font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">{row.contribution}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Detailed Calculation Tables */}
      {isUhvCourse ? (
      <div className="hidden overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#161618] sm:block">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <thead className="bg-[#172554] dark:bg-[#202024] text-white text-xs">
            <tr>
              <th className="px-4 py-3">Continuous assessment component</th>
              <th className="px-4 py-3 text-center">Weight</th>
              <th className="px-4 py-3 text-right">Raw marks</th>
              <th className="px-4 py-3 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr><td className="px-4 py-3 font-semibold">One test</td><td className="px-4 py-3 text-center">70%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.test1 || 0).toFixed(2)} / {test1MaxNum}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.test1_p.toFixed(2)} / 70</td></tr>
            <tr><td className="px-4 py-3 font-semibold">Assignment 1 ({act1Count})</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{act1Sum.toFixed(2)} / {act1Count * 10}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.act1_p.toFixed(2)} / 15</td></tr>
            <tr><td className="px-4 py-3 font-semibold">Assignment 2 ({act2Count})</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{act2Sum.toFixed(2)} / {act2Count * 10}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.act2_p.toFixed(2)} / 15</td></tr>
            <tr className="bg-[#172554] dark:bg-[#202024] text-white font-black"><td className="px-4 py-3 font-bold">Total</td><td className="px-4 py-3 text-center">100%</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td></tr>
          </tbody>
        </table>
      </div>
      ) : hasContinuousAssessmentComponents ? (
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618] sm:block">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <thead className="bg-[#172554] dark:bg-[#202024] text-white text-xs">
            <tr>
              <th className="px-4 py-3">Continuous assessment component</th>
              <th className="px-4 py-3 text-center">Weight</th>
              <th className="px-4 py-3 text-right">Score / 100</th>
              <th className="px-4 py-3 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {continuousAssessmentComponents.map((component) => (
              <tr key={component.key} className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="px-4 py-3 font-semibold">{component.label}</td>
                <td className="px-4 py-3 text-center font-bold">{component.weight}%</td>
                <td className="px-4 py-3 text-right tabular-nums font-numeric">{component.score.toFixed(2)} / 100</td>
                <td className="px-4 py-3 text-right font-black tabular-nums font-numeric">{component.contribution.toFixed(2)} / {component.weight}</td>
              </tr>
            ))}
            <tr className="bg-[#172554] dark:bg-[#202024] text-white font-black">
              <td className="px-4 py-3 font-bold">Continuous Assessment total</td>
              <td className="px-4 py-3 text-center">100%</td>
              <td className="px-4 py-3 text-right">—</td>
              <td className="px-4 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : isLaboratoryCourse ? (
      <div className="hidden overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#161618] sm:block">
        <table className="w-full min-w-[500px] border-collapse text-left text-sm">
          <thead className="bg-[#172554] dark:bg-[#202024] text-white text-xs">
            <tr>
              <th className="px-4 py-3">Assessment component</th>
              <th className="px-4 py-3 text-center">Weight</th>
              <th className="px-4 py-3 text-right">Raw marks</th>
              <th className="px-4 py-3 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr><td className="px-4 py-3 font-semibold">Work, observation and record</td><td className="px-4 py-3 text-center">45%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseWorkMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.lab1_p.toFixed(2)} / 45</td></tr>
            <tr><td className="px-4 py-3 font-semibold">Midterm practical test</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseMidtermMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.test1_p.toFixed(2)} / 15</td></tr>
            <tr><td className="px-4 py-3 font-semibold">End-semester practical</td><td className="px-4 py-3 text-center">40%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseExamMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.ese_p.toFixed(2)} / 40</td></tr>
            <tr className="bg-[#172554] dark:bg-[#202024] text-white font-black"><td className="px-4 py-3 font-bold">Total</td><td className="px-4 py-3 text-center">100%</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td></tr>
          </tbody>
        </table>
      </div>
      ) : isSelfLearningCourse ? (
      <div className="hidden overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#161618] sm:block">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <thead className="bg-[#172554] dark:bg-[#202024] text-white text-xs">
            <tr><th className="px-4 py-3">Provider result</th><th className="px-4 py-3 text-center">Pass mark</th><th className="px-4 py-3 text-right">Entered score</th><th className="px-4 py-3 text-right">Indicative grade</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td className="px-4 py-3 font-semibold">{subject.name || 'Self-Learning Course'}</td>
              <td className="px-4 py-3 text-center">{Number(subject.selfLearningPassMark) === 40 ? 40 : 50}%</td>
              <td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{Number(subject.ese || 0).toFixed(2)} / 100</td>
              <td className="px-4 py-3 text-right font-black">{breakdown.grade.letter}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : hasProjectWorkComponents ? (
      <div className="hidden border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#161618] overflow-x-auto sm:block">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#172554] dark:bg-[#202024] text-white text-[11px] sm:text-xs font-extrabold">
              <th className="py-2.5 px-3 sm:px-4">{breakdown.courseType === 'project' ? 'Internship cum Project Work component' : 'Table 6 component'}</th>
              <th className="py-2.5 px-2 text-center">Weight</th>
              <th className="py-2.5 px-3 text-right">Score / 100</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm">
            <tr className="bg-slate-100 dark:bg-[#202024] font-bold">
              <td colSpan={4} className="py-2 px-3 sm:px-4 text-[#172554] dark:text-[#f1f1f3]">Continuous Assessment (60%)</td>
            </tr>
            {projectWorkComponents.slice(0, 3).map((component) => (
              <tr key={component.key} className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">{component.label}</td>
                <td className="py-2 px-2 text-center text-[#172554] dark:text-[#f1f1f3]">{component.weight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{component.score.toFixed(2)}</td>
                <td className="py-2 px-3 sm:px-4 text-right font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{component.contribution.toFixed(2)} / {component.weight}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 dark:bg-[#202024]/80 font-bold">
              <td colSpan={2} className="py-2 px-3 sm:px-4 text-[#172554] dark:text-[#f1f1f3]">Continuous Assessment Subtotal</td>
              <td className="py-2 px-3 text-right text-[#172554] dark:text-[#f1f1f3]">60%</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{breakdown.internal_total.toFixed(2)} / 60</td>
            </tr>
            <tr className="bg-slate-100 dark:bg-[#202024] font-bold">
              <td colSpan={4} className="py-2 px-3 sm:px-4 text-[#172554] dark:text-[#f1f1f3]">End-Semester Examination (40%)</td>
            </tr>
            {projectWorkComponents.slice(3).map((component) => (
              <tr key={component.key} className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">{component.label}</td>
                <td className="py-2 px-2 text-center text-[#172554] dark:text-[#f1f1f3]">{component.weight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{component.score.toFixed(2)}</td>
                <td className="py-2 px-3 sm:px-4 text-right font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{component.contribution.toFixed(2)} / {component.weight}</td>
              </tr>
            ))}
            <tr className="bg-slate-50 dark:bg-[#202024]/80 font-bold">
              <td colSpan={2} className="py-2 px-3 sm:px-4 text-[#172554] dark:text-[#f1f1f3]">End-Semester Examination Subtotal</td>
              <td className="py-2 px-3 text-right text-[#172554] dark:text-[#f1f1f3]">40%</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">{breakdown.ese_p.toFixed(2)} / 40</td>
            </tr>
            <tr className="bg-[#172554] dark:bg-[#202024] text-white font-black">
              <td colSpan={2} className="py-3 px-3 sm:px-4">Project Work total</td>
              <td className="py-3 px-3 text-right">100%</td>
              <td className="py-3 px-3 sm:py-4 sm:px-4 text-right tabular-nums font-numeric text-base sm:text-lg">{breakdown.total.toFixed(2)} / 100</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : (
      /* Standard Course Calculation Table */
      <div className="hidden border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-[#161618] overflow-x-auto sm:block">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#172554] dark:bg-[#202024] text-white text-[11px] sm:text-xs font-extrabold">
              <th className="py-2.5 px-3 sm:px-4">Assessment component</th>
              <th className="py-2.5 px-2 text-center">Weight</th>
              <th className="py-2.5 px-3 text-right">Score</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 text-xs sm:text-sm">
            {/* CA 1 Header */}
            <tr className="bg-slate-100 dark:bg-[#202024] font-bold">
              <td colSpan={2} className="py-2 px-3 sm:px-4 text-[11px] sm:text-xs text-[#172554] dark:text-[#f1f1f3]">
                {isIndustryOrientedTests ? 'Mid Term Test' : isStandardsCourse ? 'Standards Test I' : isAuditCourse ? 'Audit Test I' : isHeritageCourse ? 'Heritage Assessment Test I' : 'Continuous Assessment 1'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs font-black text-[#172554] dark:text-[#f1f1f3]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 1 */}
            {testWeight > 0 && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {assessmentOneName}
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{testWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {subject.test1 === '' ? '0.00' : Number(subject.test1).toFixed(2)} / {test1MaxNum}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.test1_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {testWeight}</span>
                </td>
              </tr>
            )}

            {/* Assignment 1 */}
            {actWeight > 0 && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'} ({act1Count})
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{actWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {act1Count === 0 ? '—' : `${act1Sum.toFixed(2)} / ${act1Count * 10}`}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.act1_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {actWeight}</span>
                </td>
              </tr>
            )}

            {/* Lab 1 */}
            {hasLab && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {isSelfDevelopment ? 'Lab' : 'Lab Practicals'} ({lab1Count})
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{labWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {lab1Count === 0 ? '—' : `${lab1Sum.toFixed(2)} / ${lab1Count * 10}`}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.lab1_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {labWeight}</span>
                </td>
              </tr>
            )}

            {/* CA 1 Subtotal */}
            <tr className="bg-slate-50 dark:bg-[#202024]/80 font-bold border-b border-slate-200 dark:border-slate-700">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] dark:text-[#f1f1f3] text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'Mid Term Test Total' : isStandardsCourse ? 'Standards Test I Total' : isAuditCourse ? 'Audit Test I Total' : isHeritageCourse ? 'Heritage Assessment I Total' : 'CA 1 subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#172554] dark:text-[#f1f1f3] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                {breakdown.ca1_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {caMax}</span>
              </td>
            </tr>

            {/* CA 2 Header */}
            <tr className="bg-slate-100 dark:bg-[#202024] font-bold border-t-2 border-[#172554] dark:border-slate-600">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-bold text-[11px] sm:text-xs text-[#172554] dark:text-[#f1f1f3]">
                {isIndustryOrientedTests ? 'End Course Test' : isStandardsCourse ? 'Standards Test II' : isAuditCourse ? 'Audit Test II' : isHeritageCourse ? 'Heritage Assessment Test II' : 'Continuous Assessment 2'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs font-black text-[#172554] dark:text-[#f1f1f3]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 2 */}
            {testWeight > 0 && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {assessmentTwoName}
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{testWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {subject.test2 === '' ? '0.00' : Number(subject.test2).toFixed(2)} / {test2MaxNum}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.test2_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {testWeight}</span>
                </td>
              </tr>
            )}

            {/* Assignment 2 */}
            {actWeight > 0 && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'} ({act2Count})
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{actWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {act2Count === 0 ? '—' : `${act2Sum.toFixed(2)} / ${act2Count * 10}`}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.act2_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {actWeight}</span>
                </td>
              </tr>
            )}

            {/* Lab 2 */}
            {hasLab && (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2 px-3 sm:px-4 font-semibold text-[#172554] dark:text-[#f1f1f3]">
                  {isSelfDevelopment ? 'Lab' : 'Lab Practicals'} ({lab2Count})
                </td>
                <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{labWeight}%</td>
                <td className="py-2 px-3 text-right tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {lab2Count === 0 ? '—' : `${lab2Sum.toFixed(2)} / ${lab2Count * 10}`}
                </td>
                <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.lab2_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {labWeight}</span>
                </td>
              </tr>
            )}

            {/* CA 2 Subtotal */}
            <tr className="bg-slate-50 dark:bg-[#202024]/80 font-bold border-b border-slate-200 dark:border-slate-700">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] dark:text-[#f1f1f3] text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'End Course Test Total' : isStandardsCourse ? 'Standards Test II Total' : isAuditCourse ? 'Audit Test II Total' : isHeritageCourse ? 'Heritage Assessment II Total' : 'CA 2 subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#172554] dark:text-[#f1f1f3] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                {breakdown.ca2_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {caMax}</span>
              </td>
            </tr>

            {/* Internal Total */}
            <tr className="bg-slate-200 dark:bg-[#202024] font-black border-t-2 border-b-2 border-[#172554] dark:border-slate-600">
              <td colSpan={2} className="py-2.5 px-3 sm:px-4 text-[#172554] dark:text-[#f1f1f3] font-bold text-[11px] sm:text-sm">
                {isIndustryOrientedTests ? 'Two-test total' : 'Internal total'}
              </td>
              <td className="py-2.5 px-3 text-right text-[#172554] dark:text-[#f1f1f3] font-black text-[11px]">{internalMax}%</td>
              <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric text-sm sm:text-lg">
                {breakdown.internal_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {internalMax}</span>
              </td>
            </tr>

            {/* End Semester Section */}
            {eseWeight > 0 && <>
            <tr className="bg-slate-100 dark:bg-[#202024] font-bold border-b border-slate-200 dark:border-slate-700">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-bold text-[11px] sm:text-xs text-[#172554] dark:text-[#f1f1f3]">
                End-Semester Examination
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] text-[11px]">Max {eseWeight}%</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs font-black text-[#172554] dark:text-[#f1f1f3]">
                {eseWeight}%
              </td>
            </tr>

            {isSplit ? (
              <>
                {/* ESE Theory */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#172554] dark:text-[#f1f1f3]">
                    ESE Theory Exam
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{eseTheoryWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {breakdown.ese_theory_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {eseTheoryWeight}</span>
                  </td>
                </tr>

                {/* ESE Lab Practicals */}
                <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#172554] dark:text-[#f1f1f3]">
                    ESE Lab Practicals
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{eseLabWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {breakdown.ese_lab_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {eseLabWeight}</span>
                  </td>
                </tr>

                {/* ESE Combined Subtotal */}
                <tr className="bg-slate-100 dark:bg-[#202024] font-bold border-b border-slate-200 dark:border-slate-700">
                  <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#172554] dark:text-[#f1f1f3] text-[11px] sm:text-xs">
                    ESE subtotal
                  </td>
                  <td className="py-2 px-3 text-right text-[#172554] dark:text-[#f1f1f3] font-bold text-[11px]">50%</td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                    {breakdown.ese_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ 50</span>
                  </td>
                </tr>
              </>
            ) : isPracticalOnly ? (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#172554] dark:text-[#f1f1f3]">
                  ESE Practical Exam
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{eseLabWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.ese_lab_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {eseLabWeight}</span>
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-slate-50 dark:hover:bg-[#202024]/50 transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#172554] dark:text-[#f1f1f3]">
                  End Semester Theory
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#172554] dark:text-[#f1f1f3]">{eseTheoryWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#172554] dark:text-[#f1f1f3] tabular-nums font-numeric">
                  {breakdown.ese_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500">/ {eseTheoryWeight}</span>
                </td>
              </tr>
            )}
            </>}

            {/* GRAND TOTAL ROW */}
            <tr className="bg-[#172554] dark:bg-[#202024] text-white font-black border-t-2 border-[#172554] dark:border-slate-600">
              <td colSpan={2} className="py-3 px-3 sm:py-4 sm:px-4 font-bold text-xs sm:text-base">
                Grand total score
              </td>
              <td className="py-3 px-3 text-right text-xs font-black font-numeric tabular-nums">
                100%
              </td>
              <td className="py-3 px-3 sm:py-4 sm:px-4 text-right tabular-nums font-numeric text-lg sm:text-2xl text-white">
                {breakdown.total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-slate-300">/ 100</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
    </motion.div>
  );
};

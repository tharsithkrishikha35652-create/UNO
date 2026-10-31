import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { CalculationBreakdown, SubjectData } from '../types';
import { Check, Copy, GraduationCap, Layers } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import { motionVariants } from '../motion';

const LaurelBranch: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
  <svg
    className={`w-5 h-9 text-[#7ca97b] opacity-80 shrink-0 ${flip ? '-scale-x-100' : ''}`}
    viewBox="0 0 24 44"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 40 C10 34 6 24 8 12 C9 7 12 3 15 2" />
    <path d="M14 32 C10 29 8 24 9 20 C10 17 12 16 14 17" />
    <path d="M11 23 C7 20 6 16 7 13 C8 11 10 10 12 11" />
    <path d="M10 14 C7 12 6 9 7 7 C8 6 9 5 11 6" />
  </svg>
);

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
                { label: 'Lab practicals 2', weight: `${labWeight}%`, rawMarks: `${lab2Sum.toFixed(2)} / ${lab2Count * 10}`, contribution: `${breakdown.lab2_p.toFixed(2)} / ${labWeight}` },
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
      className="results-summary min-w-0 max-w-full overflow-hidden rounded-2xl bg-[#161618] border border-[#2d2d33] p-4 sm:p-6 shadow-xl text-[#f1f1f3]"
      variants={reduceMotion ? undefined : motionVariants.card}
      initial={reduceMotion ? false : 'initial'}
      animate="animate"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#2d2d33] mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#f1f1f3] tracking-tight">
            Marks &amp; Grade Summary
          </h2>
          <div className="flex items-center gap-2 flex-wrap mt-1.5">
            <span className="text-xs sm:text-sm font-bold text-[#d4d4d8]">
              {subject.name || 'Selected Course'}
            </span>
            <span className="text-[10px] sm:text-xs font-bold bg-[#27272a] text-[#d4d4d8] border border-[#3f3f46] px-2.5 py-0.5 rounded-md inline-flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-[#d97757]" />
              <span>{breakdown.courseTypeLabel}</span>
            </span>
          </div>
        </div>

        {/* Action buttons & Decorative cap */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 py-2 px-3 sm:px-4 text-[11px] sm:text-xs font-bold bg-[#27272a] text-[#f1f1f3] hover:bg-[#323238] transition-colors border border-[#3f3f46] rounded-xl cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{copied ? 'Copied' : 'Copy summary'}</span>
          </button>
          <div
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#d97757]/15 border border-[#d97757]/30 text-[#d97757] shrink-0"
            aria-hidden="true"
          >
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
          </div>
        </div>
      </div>

      {/* 3 Distinct Rounded Summary Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Panel 1 — Total Mark (Warm Terracotta / Brown) */}
        <div className="rounded-2xl border border-[#d97757]/30 bg-[#241c19]/60 p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#d49782] uppercase tracking-wider mb-2">
            Total Mark
          </span>
          <div className="flex items-baseline gap-1.5">
            <AnimatedNumber
              value={breakdown.total}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f1f1f3] tabular-nums font-numeric"
            />
            <span className="text-sm sm:text-base font-bold text-[#d97757] tabular-nums font-numeric">
              / 100
            </span>
          </div>
        </div>

        {/* Panel 2 — Indicative Grade (Sage / Olive Green with Laurel details and classification) */}
        <div className="rounded-2xl border border-[#5b8c5a]/40 bg-[#152319]/70 p-4 sm:p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <span className="text-[11px] font-bold text-[#86b585] uppercase tracking-wider mb-1">
            Indicative Grade
          </span>
          <div className="flex items-center justify-center gap-2 my-1">
            <LaurelBranch />
            <motion.div
              key={breakdown.grade.letter}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f1f1f3] min-w-10 text-center"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              {breakdown.grade.letter}
            </motion.div>
            <LaurelBranch flip />
          </div>
          <span className="text-xs sm:text-sm font-bold text-[#a5d6a4] leading-tight">
            {breakdown.grade.label}
          </span>
        </div>

        {/* Panel 3 — Grade Point (Restrained Slate / Muted Violet, strictly NO slider, NO Scale 0-10) */}
        <div className="rounded-2xl border border-[#6366f1]/30 bg-[#1c1d2e]/60 p-4 sm:p-5 flex flex-col justify-between">
          <span className="text-[11px] font-bold text-[#a5b4fc] uppercase tracking-wider mb-2">
            Grade Point
          </span>
          <div className="flex items-baseline gap-1.5">
            <AnimatedNumber
              value={breakdown.grade.gradePoint}
              decimals={0}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#f1f1f3] tabular-nums font-numeric"
            />
          </div>
        </div>
      </div>

      <section className="mb-4 min-w-0 w-full overflow-hidden rounded-xl border border-[#2d2d33] bg-[#1a1a1d] sm:hidden" aria-label="Marks breakdown">
        <div className="divide-y divide-[#2d2d33]">
          {mobileSummaryRows.map((row, index) => (
            <div key={`${row.label}-${index}`} className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-start gap-2 px-3 py-2.5">
              <div className="min-w-0">
                <p className="break-words text-[13px] font-bold leading-snug text-[#f1f1f3]">{row.label}</p>
                <p className="mt-0.5 text-xs text-slate-400 tabular-nums font-numeric">Marks Scored: {row.rawMarks}</p>
              </div>
              <div className="min-w-0 text-right">
                {row.weight && <p className="text-xs font-semibold text-[#d49782]">{row.weight}</p>}
                {row.contribution && <p className="text-sm font-black text-[#f1f1f3] tabular-nums font-numeric">{row.contribution}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {isUhvCourse ? (
      <div className="hidden overflow-x-auto border border-[#2d2d33] rounded-xl bg-[#1a1a1d] sm:block">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <thead className="bg-[#222226] text-[#f1f1f3] text-xs font-bold border-b border-[#2d2d33]">
            <tr>
              <th className="px-4 py-3">Continuous assessment component</th>
              <th className="px-4 py-3 text-center">Weight</th>
              <th className="px-4 py-3 text-right">Raw marks</th>
              <th className="px-4 py-3 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d33] text-[#e4e4e7]">
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">One test</td><td className="px-4 py-3 text-center">70%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.test1 || 0).toFixed(2)} / {test1MaxNum}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.test1_p.toFixed(2)} / 70</td></tr>
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">Assignment 1 ({act1Count})</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{act1Sum.toFixed(2)} / {act1Count * 10}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.act1_p.toFixed(2)} / 15</td></tr>
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">Assignment 2 ({act2Count})</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{act2Sum.toFixed(2)} / {act2Count * 10}</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.act2_p.toFixed(2)} / 15</td></tr>
            <tr className="bg-[#271d1a] text-[#f1f1f3] font-black border-t-2 border-[#d97757]/60"><td className="px-4 py-3 font-bold">Total</td><td className="px-4 py-3 text-center">100%</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td></tr>
          </tbody>
        </table>
      </div>
      ) : isLaboratoryCourse ? (
      <div className="hidden overflow-x-auto border border-[#2d2d33] rounded-xl bg-[#1a1a1d] sm:block">
        <table className="w-full min-w-[500px] border-collapse text-left text-sm">
          <thead className="bg-[#222226] text-[#f1f1f3] text-xs font-bold border-b border-[#2d2d33]">
            <tr>
              <th className="px-4 py-3">Assessment component</th>
              <th className="px-4 py-3 text-center">Weight</th>
              <th className="px-4 py-3 text-right">Raw marks</th>
              <th className="px-4 py-3 text-right">Contribution</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d33] text-[#e4e4e7]">
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">Work, observation and record</td><td className="px-4 py-3 text-center">45%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseWorkMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.lab1_p.toFixed(2)} / 45</td></tr>
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">Midterm practical test</td><td className="px-4 py-3 text-center">15%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseMidtermMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.test1_p.toFixed(2)} / 15</td></tr>
            <tr className="hover:bg-[#232328] transition-colors"><td className="px-4 py-3 font-semibold">End-semester practical</td><td className="px-4 py-3 text-center">40%</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{Number(subject.labCourseExamMark || 0).toFixed(2)} / 100</td><td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{breakdown.ese_p.toFixed(2)} / 40</td></tr>
            <tr className="bg-[#271d1a] text-[#f1f1f3] font-black border-t-2 border-[#d97757]/60"><td className="px-4 py-3 font-bold">Total</td><td className="px-4 py-3 text-center">100%</td><td className="px-4 py-3 text-right">—</td><td className="px-4 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td></tr>
          </tbody>
        </table>
      </div>
      ) : isSelfLearningCourse ? (
      <div className="hidden overflow-x-auto border border-[#2d2d33] rounded-xl bg-[#1a1a1d] sm:block">
        <table className="w-full min-w-[440px] border-collapse text-left text-sm">
          <thead className="bg-[#222226] text-[#f1f1f3] text-xs font-bold border-b border-[#2d2d33]">
            <tr>
              <th className="px-4 py-3">Provider result</th>
              <th className="px-4 py-3 text-center">Pass mark</th>
              <th className="px-4 py-3 text-right">Entered score</th>
              <th className="px-4 py-3 text-right">Indicative grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d33] text-[#e4e4e7]">
            <tr className="hover:bg-[#232328] transition-colors">
              <td className="px-4 py-3 font-semibold">{subject.name || 'Self-Learning Course'}</td>
              <td className="px-4 py-3 text-center">{Number(subject.selfLearningPassMark) === 40 ? 40 : 50}%</td>
              <td className="px-4 py-3 text-right font-bold tabular-nums font-numeric">{Number(subject.ese || 0).toFixed(2)} / 100</td>
              <td className="px-4 py-3 text-right font-black">{breakdown.grade.letter}</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : hasProjectWorkComponents ? (
      <div className="hidden border border-[#2d2d33] rounded-xl bg-[#1a1a1d] overflow-x-auto sm:block">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#222226] text-[#f1f1f3] text-[11px] sm:text-xs font-bold border-b border-[#2d2d33]">
              <th className="py-2.5 px-3 sm:px-4">{breakdown.courseType === 'project' ? 'Internship cum Project Work component' : 'Table 6 component'}</th>
              <th className="py-2.5 px-2 text-center">Weight</th>
              <th className="py-2.5 px-3 text-right">Score / 100</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d33] text-[#e4e4e7]">
            {(['Continuous Assessment', 'End-Semester Examination'] as const).map((section) => {
              const components = projectWorkComponents.filter((component) => component.section === section);
              const weight = components.reduce((sum, component) => sum + component.weight, 0);
              const contribution = components.reduce((sum, component) => sum + component.contribution, 0);
              return (
                <React.Fragment key={section}>
                  <tr className="bg-[#202025] font-bold border-t border-b border-[#2d2d33]">
                    <td colSpan={2} className="px-3 py-2 font-bold text-[#f1f1f3]">{section}</td>
                    <td className="px-3 py-2 text-right text-[#d4d4d8]">{weight}%</td>
                    <td className="px-3 py-2 text-right font-black text-[#f1f1f3] font-numeric tabular-nums">{contribution.toFixed(2)} / {weight}</td>
                  </tr>
                  {components.map((component) => (
                    <tr key={component.key} className="hover:bg-[#232328] transition-colors">
                      <td className="px-3 py-2 font-semibold text-[#f1f1f3]">{component.label}</td>
                      <td className="px-2 py-2 text-center font-bold text-[#d4d4d8]">{component.weight}%</td>
                      <td className="px-3 py-2 text-right tabular-nums font-numeric">{component.score.toFixed(2)} / 100</td>
                      <td className="px-3 py-2 text-right font-black tabular-nums font-numeric">{component.contribution.toFixed(2)} / {component.weight}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
            <tr className="bg-[#271d1a] text-[#f1f1f3] font-black border-t-2 border-[#d97757]/60">
              <td colSpan={2} className="px-3 py-3 font-bold">Grand total score</td>
              <td className="px-3 py-3 text-right">100%</td>
              <td className="px-3 py-3 text-right tabular-nums font-numeric">{breakdown.total.toFixed(2)} / 100</td>
            </tr>
          </tbody>
        </table>
      </div>
      ) : (
      /* Complete Organized Marks Distribution Table - horizontally scrollable on mobile */
      <div className="hidden border border-[#2d2d33] rounded-xl bg-[#1a1a1d] overflow-x-auto sm:block">
        <table className="min-w-[560px] w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#222226] text-[#f1f1f3] text-[11px] sm:text-xs font-bold border-b border-[#2d2d33]">
              <th className="py-2.5 px-3 sm:px-4">Assessment Component</th>
              <th className="py-2.5 px-2 text-center w-24">Weightage</th>
              <th className="py-2.5 px-3 text-right">Marks Scored</th>
              <th className="py-2.5 px-3 sm:px-4 text-right">Contributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2d2d33] text-[#e4e4e7]">
            {/* --- CA 1 Header --- */}
            <tr className="bg-[#202025] font-bold border-t border-b border-[#2d2d33]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 text-[11px] sm:text-xs font-bold text-[#f1f1f3]">
                {isIndustryOrientedTests ? 'Mid Term Test' : isStandardsCourse ? 'Standards Test I' : isAuditCourse ? 'Audit Test I' : isHeritageCourse ? 'Heritage Assessment Test I' : 'Continuous Assessment 1'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#d4d4d8] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs font-black text-[#f1f1f3]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 1 */}
            <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                {assessmentOneName}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{testWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {subject.test1 === '' ? '0.00' : Number(subject.test1).toFixed(2)} / {test1MaxNum}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.test1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {testWeight}</span>
              </td>
            </tr>

            {/* Assignments 1 */}
            {actWeight > 0 && <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                {isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{actWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {act1Sum.toFixed(2)} / {act1Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.act1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {actWeight}</span>
              </td>
            </tr>}

            {/* Lab 1 */}
            {hasLab && (
            <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                Lab Practicals
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{labWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {lab1Sum.toFixed(2)} / {lab1Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.lab1_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {labWeight}</span>
              </td>
            </tr>
            )}

            {/* CA 1 Subtotal */}
            <tr className="bg-[#202024] font-bold border-b border-[#2d2d33]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#f1f1f3] text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'Mid Term Test Total' : isStandardsCourse ? 'Standards Test I Total' : isAuditCourse ? 'Audit Test I Total' : isHeritageCourse ? 'Heritage Assessment I Total' : 'CA 1 subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#d4d4d8] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.ca1_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {caMax}</span>
              </td>
            </tr>

            {/* --- CA 2 Header --- */}
            <tr className="bg-[#202025] font-bold border-t border-b border-[#2d2d33]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-bold text-[11px] sm:text-xs text-[#f1f1f3]">
                {isIndustryOrientedTests ? 'End Course Test' : isStandardsCourse ? 'Standards Test II' : isAuditCourse ? 'Audit Test II' : isHeritageCourse ? 'Heritage Assessment Test II' : 'Continuous Assessment 2'}
              </td>
              <td className="py-2 px-3 text-right font-bold text-[#d4d4d8] text-[11px]">Max {caMax}M</td>
              <td className="py-2 px-3 sm:px-4 text-right text-[11px] sm:text-xs font-black text-[#f1f1f3]">
                {caMax.toFixed(2)} M
              </td>
            </tr>

            {/* Test 2 */}
            <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                {assessmentTwoName}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{testWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {subject.test2 === '' ? '0.00' : Number(subject.test2).toFixed(2)} / {test2MaxNum}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.test2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {testWeight}</span>
              </td>
            </tr>

            {/* Assignments 2 */}
            {actWeight > 0 && <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                {isHeritageCourse ? 'Activity' : isSelfDevelopment ? 'Activities' : 'Assignments'}
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{actWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {act2Sum.toFixed(2)} / {act2Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.act2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {actWeight}</span>
              </td>
            </tr>}

            {/* Lab 2 */}
            {hasLab && (
            <tr className="hover:bg-[#232328] transition-colors">
              <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                Lab Practicals
              </td>
              <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{labWeight}%</td>
              <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {lab2Sum.toFixed(2)} / {lab2Count * 10}
              </td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.lab2_p.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {labWeight}</span>
              </td>
            </tr>
            )}

            {/* CA 2 Subtotal */}
            <tr className="bg-[#202024] font-bold border-b border-[#2d2d33]">
              <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#f1f1f3] text-[11px] sm:text-xs">
                {isIndustryOrientedTests ? 'End Course Test Total' : isStandardsCourse ? 'Standards Test II Total' : isAuditCourse ? 'Audit Test II Total' : isHeritageCourse ? 'Heritage Assessment II Total' : 'CA 2 subtotal'}
              </td>
              <td className="py-2 px-3 text-right text-[#d4d4d8] font-bold text-[11px]">—</td>
              <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                {breakdown.ca2_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {caMax}</span>
              </td>
            </tr>

            {/* Internal Total */}
            <tr className="bg-[#26262c] font-black border-t-2 border-b-2 border-[#3f3f46]">
              <td colSpan={2} className="py-2.5 px-3 sm:px-4 text-[#f1f1f3] font-bold text-[11px] sm:text-sm">
                {isIndustryOrientedTests ? 'Two-test total' : 'Internal total'}
              </td>
              <td className="py-2.5 px-3 text-right text-[#f1f1f3] font-black text-[11px] font-numeric tabular-nums">{internalMax}%</td>
              <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric text-sm sm:text-lg whitespace-nowrap">
                {breakdown.internal_total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {internalMax}</span>
              </td>
            </tr>

            {/* ESE Rows */}
            {eseWeight > 0 && <>
            {isSplit ? (
              <>
                {/* ESE Theory */}
                <tr className="hover:bg-[#232328] transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                    ESE Theory Exam
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{eseTheoryWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                    {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                    {breakdown.ese_theory_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {eseTheoryWeight}</span>
                  </td>
                </tr>

                {/* ESE Lab Practicals */}
                <tr className="hover:bg-[#232328] transition-colors">
                  <td className="py-2 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                    ESE Lab Practicals
                  </td>
                  <td className="py-2 px-2 text-center font-bold text-[#d4d4d8]">{eseLabWeight}%</td>
                  <td className="py-2 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                    {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                    {breakdown.ese_lab_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {eseLabWeight}</span>
                  </td>
                </tr>

                {/* ESE Combined Subtotal */}
                <tr className="bg-[#202024] font-bold border-b border-[#2d2d33]">
                  <td colSpan={2} className="py-2 px-3 sm:px-4 font-black text-[#f1f1f3] text-[11px] sm:text-xs">
                    ESE subtotal
                  </td>
                  <td className="py-2 px-3 text-right text-[#d4d4d8] font-bold text-[11px]">50%</td>
                  <td className="py-2 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                    {breakdown.ese_p.toFixed(2)}{' '}
                    <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ 50</span>
                  </td>
                </tr>
              </>
            ) : isPracticalOnly ? (
              <tr className="hover:bg-[#232328] transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                  ESE Practical Exam
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#d4d4d8]">{eseLabWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                  {subject.eseLab === '' ? '0.00' : Number(subject.eseLab).toFixed(2)} / {eseLabMaxNum}
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                  {breakdown.ese_lab_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {eseLabWeight}</span>
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-[#232328] transition-colors">
                <td className="py-2.5 px-3 sm:px-4 font-bold text-[#f1f1f3]">
                  End Semester Theory
                </td>
                <td className="py-2.5 px-2 text-center font-bold text-[#d4d4d8]">{eseTheoryWeight}%</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                  {subject.ese === '' ? '0.00' : Number(subject.ese).toFixed(2)} / 100
                </td>
                <td className="py-2.5 px-3 sm:px-4 text-right font-black text-[#f1f1f3] tabular-nums font-numeric whitespace-nowrap">
                  {breakdown.ese_p.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ {eseTheoryWeight}</span>
                </td>
              </tr>
            )}
            </>}

            {/* GRAND TOTAL ROW */}
            <tr className="bg-[#271d1a] text-[#f1f1f3] font-black border-t-2 border-[#d97757]/60">
              <td colSpan={2} className="py-3 px-3 sm:py-4 sm:px-4 font-bold text-xs sm:text-base">
                Grand total score
              </td>
              <td className="py-3 px-3 text-right text-xs font-black font-numeric tabular-nums">
                100%
              </td>
              <td className="py-3 px-3 sm:py-4 sm:px-4 text-right tabular-nums font-numeric text-lg sm:text-2xl text-white whitespace-nowrap">
                {breakdown.total.toFixed(2)}{' '}
                <span className="text-[10px] sm:text-xs font-bold text-[#d49782]">/ 100</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      )}
    </motion.div>
  );
};

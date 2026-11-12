import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { motionVariants } from '../motion';
import { GraduationCap, Target, FlaskConical, ChevronDown, Calculator, LoaderCircle, Pencil, AlertCircle } from 'lucide-react';
import { GRADE_SCALE } from '../calculatorUtils';
import { CourseType } from '../types';
import { MaxMarksInput } from './MaxMarksInput';

interface EseMaximumControlProps {
  id: string;
  label: string;
  value: number | string;
  onChange?: (value: number | string) => void;
}

const EseMaximumControl: React.FC<EseMaximumControlProps> = ({ id, label, value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="absolute right-2 top-2 flex items-center gap-1">
        <span className="text-xs font-bold text-[#d97757] tabular-nums font-numeric">/ {value}</span>
        {onChange && (
          <button
            type="button"
            onClick={() => setIsEditing((editing) => !editing)}
            aria-label={`${isEditing ? 'Close' : 'Edit'} ${label}`}
            aria-expanded={isEditing}
            title={isEditing ? 'Close maximum marks editor' : `Edit ${label.toLowerCase()}`}
            className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#172554] focus-visible:outline-2 focus-visible:outline-[#172554]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      {isEditing && onChange && (
        <div className="mt-2 flex justify-end">
          <MaxMarksInput id={id} label={label} value={value} onChange={onChange} />
        </div>
      )}
    </>
  );
};

interface NeededTheoryMarkInput {
  targetMinScore?: number;
  internalTotal?: number;
  neededTotalEse?: number;
  theoryWeight: number;
  theoryMax: number;
  labPoints?: number;
  labWeight?: number;
  hasEnteredLabMark?: boolean;
}

export function calculateNeededTheoryMark({
  targetMinScore,
  internalTotal = 0,
  neededTotalEse,
  theoryWeight,
  theoryMax,
  labPoints = 0,
  labWeight = 0,
  hasEnteredLabMark,
}: NeededTheoryMarkInput): number {
  if (theoryWeight <= 0) return 0;
  const totalEseNeeded =
    neededTotalEse !== undefined
      ? neededTotalEse
      : Math.max(0, (targetMinScore ?? 0) - internalTotal);
  const labContribution =
    hasEnteredLabMark !== undefined
      ? (hasEnteredLabMark ? labPoints : labWeight * 0.9)
      : labPoints;
  const neededFromTheory = Math.max(0, totalEseNeeded - labContribution);
  return Math.ceil((neededFromTheory / theoryWeight) * theoryMax);
}

export interface TargetGradeEseRequirementInput {
  targetMinScore: number;
  internalTotal: number;
  eseTheoryWeight: number;
  numericEseMax?: number;
  minPassPercentage?: number;
}

export interface TargetGradeEseRequirementResult {
  minEsePass: number;
  gradeNeededEse: number;
  neededEse: number;
  isImpossible: boolean;
  isAlreadySecured: boolean;
}

export function calculateTargetGradeEseRequirement({
  targetMinScore,
  internalTotal,
  eseTheoryWeight,
  numericEseMax = 100,
  minPassPercentage = 45,
}: TargetGradeEseRequirementInput): TargetGradeEseRequirementResult {
  const minEsePass = eseTheoryWeight > 0 ? Math.ceil((minPassPercentage / 100) * numericEseMax) : 0;
  const gradeNeededEse = eseTheoryWeight > 0
    ? Math.ceil(((targetMinScore - internalTotal) / eseTheoryWeight) * numericEseMax)
    : 0;
  const neededEse = Math.max(gradeNeededEse, minEsePass);
  const isImpossible = neededEse > numericEseMax;
  const isAlreadySecured = eseTheoryWeight <= 0 && internalTotal >= targetMinScore;

  return {
    minEsePass,
    gradeNeededEse,
    neededEse,
    isImpossible,
    isAlreadySecured,
  };
}

interface EndSemesterSectionProps {
  courseType?: CourseType;
  onCalculate: () => void;
  calculationState: 'idle' | 'calculating' | 'saving' | 'success' | 'error';
  hasCalculated: boolean;
  savePending?: boolean;
  guestMode: boolean;
  ese: number | string;
  onEseChange: (val: number | string) => void;
  eseTheoryMax?: number | string;
  onEseTheoryMaxChange?: (val: number | string) => void;
  eseLab?: number | string;
  onEseLabChange?: (val: number | string) => void;
  eseLabMax?: number | string;
  onEseLabMaxChange?: (val: number | string) => void;
  esePoints: number;
  eseTheoryPoints?: number;
  eseLabPoints?: number;
  eseTheoryWeight?: number;
  eseLabWeight?: number;
  internalTotal: number;
  estimatedLabMark?: boolean;
  estimatePercentage?: number;
  isSimulatorReady?: boolean;
  isTourActive?: boolean;
}

export const EndSemesterSection: React.FC<EndSemesterSectionProps> = ({
  courseType,
  onCalculate,
  calculationState,
  hasCalculated,
  savePending = false,
  guestMode,
  ese,
  onEseChange,
  eseTheoryMax = 100,
  onEseTheoryMaxChange,
  eseLab = '',
  onEseLabChange,
  eseLabMax = 100,
  onEseLabMaxChange,
  esePoints,
  eseTheoryPoints = 0,
  eseLabPoints = 0,
  eseTheoryWeight = 50,
  eseLabWeight = 0,
  internalTotal,
  estimatedLabMark = false,
  estimatePercentage = 80,
  isSimulatorReady = false,
  isTourActive = false,
}) => {
  const eseWeight = eseTheoryWeight + eseLabWeight;
  const numericEseMax = Math.max(1, Number(eseTheoryMax) || 100);
  const hasTheory = eseTheoryWeight > 0;
  const hasLab = eseLabWeight > 0;
  const isSplit = hasTheory && hasLab; // theory + practical
  const isPracticalOnly = !hasTheory && hasLab; // practical exam is the whole ESE
  const labName = isPracticalOnly || courseType === 'self-development' ? 'Practical' : 'Lab';
  const [isSplitSimulatorOpen, setIsSplitSimulatorOpen] = useState(true);
  const [isTheorySimulatorOpen, setIsTheorySimulatorOpen] = useState(true);

  const handleEseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onEseChange('');
      return;
    }
    const val = parseFloat(raw);
    onEseChange(isNaN(val) ? '' : Math.max(0, Math.min(numericEseMax, val)));
  };

  const handleLabMaxChange = (value: number | string) => {
    if (!onEseLabMaxChange) return;
    const raw = String(value);
    if (raw === '') {
      onEseLabMaxChange('');
      return;
    }
    const val = parseFloat(raw);
    onEseLabMaxChange(isNaN(val) ? 100 : Math.max(1, val));
  };

  const handleLabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onEseLabChange) return;
    const raw = e.target.value;
    if (raw === '') {
      onEseLabChange('');
      return;
    }
    const maxVal = Math.max(1, Number(eseLabMax) || 100);
    const val = parseFloat(raw);
    onEseLabChange(isNaN(val) ? '' : Math.max(0, Math.min(maxVal, val)));
  };

  const numericLabMax = Math.max(1, eseLabMax === '' || eseLabMax === undefined ? 100 : Number(eseLabMax) || 100);
  const numericLab = eseLab === '' || eseLab === undefined ? 0 : Number(eseLab) || 0;
  const hasEnteredLabMark = eseLab !== '' && eseLab !== undefined && Number.isFinite(Number(eseLab));
  const hasEnteredEse = ese !== '' && ese !== undefined && Number.isFinite(Number(ese));
  const theoryMinEsePass = eseTheoryWeight > 0 ? Math.ceil(0.45 * numericEseMax) : 0;
  const isTheoryEseBelowPass = hasEnteredEse && Number(ese) < theoryMinEsePass;

  const minTotalEse = 0.45 * eseWeight;
  const minLabPass = Math.ceil(0.45 * numericLabMax);
  const allRequiredEseEntered = (!hasTheory || hasEnteredEse) && (!hasLab || hasEnteredLabMark);
  const isSplitEseBelowPass =
    (isSplit && allRequiredEseEntered && esePoints < minTotalEse) ||
    (isPracticalOnly && hasEnteredLabMark && Number(eseLab) < minLabPass);

  const reduceMotion = useReducedMotion();

  return (
    <motion.section variants={reduceMotion ? undefined : motionVariants.card} initial={reduceMotion ? false : "initial"} animate="animate" className="overflow-hidden rounded-lg bg-white border border-slate-300 mb-8 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 bg-[#172554] text-white">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-white text-[#172554] font-black text-sm">
            ESE
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-wide">
              End Semester Examination
            </h3>
          </div>
        </div>

      </div>

      {isSplit || isPracticalOnly ? (
        /* --- Split layout: Theory + Practical + Simulator, or Practical + Simulator when the ESE is practical-only --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Column 1: ESE Theory (only when the course has a theory exam) */}
          {hasTheory && (
          <div className={`${hasTheory ? 'lg:col-span-4' : 'lg:col-span-6'} p-3 sm:p-4 flex flex-col justify-between bg-white`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[#3b4d66] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#d97757] dark:text-[#d97757]">
                    ESE Theory Exam
                  </h4>
                </div>
              </div>

              <label
                htmlFor="ese-theory-input"
                className="block text-xs font-bold text-[#172554] mb-1.5"
              >
                Theory marks scored:
              </label>
              <div className="relative mb-3">
                <input
                  id="ese-theory-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={numericEseMax}
                  step={0.5}
                  value={ese === '' || ese === undefined ? '' : ese}
                  placeholder={`Enter theory marks (0 - ${numericEseMax})`}
                  onChange={handleEseChange}
                  className="h-11 w-full rounded-lg py-2 pl-3 pr-20 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric"
                />
                <EseMaximumControl
                  id="ese-theory-max"
                  label="Maximum marks for ESE theory"
                  value={numericEseMax}
                  onChange={onEseTheoryMaxChange}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-sm font-bold">
                  Marks contributed:
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums font-numeric">
                    {eseTheoryPoints.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-[#d97757] font-numeric tabular-nums">/ {eseTheoryWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Column 2: ESE Lab / Practical exam with User Input Max Marks */}
          <div className={`${hasTheory ? 'lg:col-span-4' : 'lg:col-span-6'} p-3 sm:p-4 flex flex-col justify-between bg-white`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[#3b4d66] shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#d97757] dark:text-[#d97757]">
                    {isPracticalOnly || courseType === 'self-development' ? 'ESE Practical Exam' : 'ESE Lab Exam'}
                  </h4>
                </div>
              </div>

              {/* Lab Marks Scored Input */}
              <label
                htmlFor="ese-lab-input"
                className="block text-xs font-bold text-[#172554] mb-1.5"
              >
                {labName} marks scored:
              </label>
              {estimatedLabMark && (
                <span className="block text-[11px] font-semibold text-amber-800 mb-1.5">
                  Estimated at <strong className="font-numeric tabular-nums">{estimatePercentage}%</strong> (applied via estimate checkbox)
                </span>
              )}
              <div className="relative mb-3">
                <input
                  id="ese-lab-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={numericLabMax}
                  step={0.5}
                  value={hasEnteredLabMark ? eseLab : estimatedLabMark ? String(Math.round(((numericLabMax * estimatePercentage) / 100) * 10) / 10) : ''}
                  disabled={estimatedLabMark}
                  readOnly={estimatedLabMark}
                  placeholder={`Enter ${labName.toLowerCase()} marks (0 - ${numericLabMax})`}
                  onChange={handleLabChange}
                  className={`h-11 w-full rounded-lg py-2 pl-3 pr-20 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric ${estimatedLabMark ? 'bg-amber-50/50 cursor-not-allowed opacity-90' : ''}`}
                />
                <EseMaximumControl
                  id="ese-lab-max"
                  label={`Maximum marks for ESE ${labName.toLowerCase()}`}
                  value={numericLabMax}
                  onChange={!estimatedLabMark && onEseLabMaxChange ? handleLabMaxChange : undefined}
                />
              </div>

              {isPracticalOnly && hasEnteredLabMark && Number(eseLab) < minLabPass && (
                <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700 text-xs font-semibold flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" aria-hidden="true" />
                  <span>Below minimum ESE practical passing mark ({minLabPass}/{numericLabMax} marks — 45%)</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-sm font-bold">
                  {estimatedLabMark ? 'Marks contributed (estimate):' : 'Marks contributed:'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums font-numeric">
                    {eseLabPoints.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-[#d97757] font-numeric tabular-nums">/ {eseLabWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Simulator & Combined ESE Breakdown */}
          <div className={`${hasTheory ? 'lg:col-span-4' : 'lg:col-span-6'} p-3 sm:p-4 bg-white flex flex-col justify-between`}>
            <div className="w-full">
              <button
                type="button"
                onClick={() => setIsSplitSimulatorOpen((open) => !open)}
                aria-expanded={isSplitSimulatorOpen}
                id="tour-target-grade-simulator"
                data-tour="target-grade-simulator"
                className="flex w-full cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554] text-left"
              >
                <div className="text-[#d97757] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 id="tour-target-grade-simulator-text" data-tour="target-grade-simulator-text" className="text-sm font-bold text-[#172554]">
                    Target Grade Simulator
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {hasTheory ? 'ESE Theory Requirement' : 'Practical Exam Requirement'}
                  </span>
                </div>
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 text-[#3b4d66] transition-transform duration-300 ease-out ${
                    isSplitSimulatorOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {isSplitSimulatorOpen && (
                  <motion.div
                    key="split-simulator-dropdown"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    {!isSimulatorReady ? (
                      <div className="mt-3 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] text-center">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Enter all previous assessment marks to use the Target Grade Simulator.
                        </p>
                      </div>
                    ) : (
                      <>
                        {isSplitEseBelowPass && (
                          <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5" role="alert">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" aria-hidden="true" />
                            <span>
                              {isPracticalOnly
                                ? `Current Practical ESE (${Number(eseLab)}/${numericLabMax}) is below the minimum passing requirement of ${minLabPass} (45%).`
                                : `Current ESE contribution (${esePoints.toFixed(2)}/${eseWeight.toFixed(2)}) is below the minimum 45% passing requirement (${minTotalEse.toFixed(2)} points).`}
                            </span>
                          </div>
                        )}

                        <div className="mt-3 rounded-xl border border-[#172554] divide-y divide-[#172554] text-xs font-medium mb-3 overflow-hidden">
                          {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                            if (hasTheory) {
                              const gradeNeededTotalEse = Math.max(0, g.minScore - internalTotal);
                              const neededTotalEse = Math.max(gradeNeededTotalEse, minTotalEse);
                              const neededTheoryPoints = Math.max(0, neededTotalEse - eseLabPoints);
                              const neededTheoryMark = Math.ceil((neededTheoryPoints / eseTheoryWeight) * numericEseMax);
                              const isImpossible = neededTheoryMark > numericEseMax;
                              const isAlreadySecured = eseTheoryWeight <= 0 && internalTotal + eseLabPoints >= g.minScore && eseLabPoints >= minTotalEse;

                              return (
                                <div
                                  key={g.letter}
                                  className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-6 font-black text-sm text-[#172554]">{g.letter}</span>
                                    <span className="text-[#172554] font-semibold text-[11px] font-numeric tabular-nums">{g.minScore}+</span>
                                  </div>

                                  <div className="text-right">
                                    {isAlreadySecured ? (
                                      <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 rounded-md border border-[#172554] text-[10px]">
                                        Already Secured
                                      </span>
                                    ) : isImpossible ? (
                                      <span className="text-rose-700 font-bold text-[10px]">
                                        Needs &gt;{numericEseMax} in Theory - Unattainable
                                      </span>
                                    ) : (
                                      <span className="text-[#172554] font-bold text-[11px]">
                                        Need <span className="underline decoration-2 text-[#1e3a8a] font-numeric tabular-nums">{neededTheoryMark}</span> / {numericEseMax} in ESE Theory
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            } else {
                              const isAlreadySecured = internalTotal >= g.minScore;
                              const neededLabPoints = Math.max(0, g.minScore - internalTotal);
                              const neededLabMark = Math.ceil((neededLabPoints / eseLabWeight) * numericLabMax);
                              const isImpossible = neededLabMark > numericLabMax;

                              return (
                                <div
                                  key={g.letter}
                                  className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-6 font-black text-sm text-[#172554]">{g.letter}</span>
                                    <span className="text-[#172554] font-semibold text-[11px] font-numeric tabular-nums">{g.minScore}+</span>
                                  </div>

                                  <div className="text-right">
                                    {isAlreadySecured ? (
                                      <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 rounded-md border border-[#172554] text-[10px]">
                                        Already Secured
                                      </span>
                                    ) : isImpossible ? (
                                      <span className="text-rose-700 font-bold text-[10px]">
                                        Needs &gt;{numericLabMax} in Practical - Unattainable
                                      </span>
                                    ) : (
                                      <span className="text-[#172554] font-bold text-[11px]">
                                        Need <span className="underline decoration-2 text-[#1e3a8a] font-numeric tabular-nums">{neededLabMark}</span> / {numericLabMax} in Practical
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* --- Theory-only ESE: Standard Layout (Theory + Target Simulator) --- */
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#172554]">
          {/* Main ESE Input Section */}
          <div className="md:col-span-6 p-3 sm:p-4 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-[#3b4d66] shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#d97757] dark:text-[#d97757]">
                  End-Semester marks scored
                </h4>
              </div>

              <label
                htmlFor="ese-marks-input"
                className="block text-xs font-bold text-[#172554] mb-1.5"
              >
                Marks scored:
              </label>
              <div className="relative mb-3">
                <input
                  id="ese-marks-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={numericEseMax}
                  step={0.5}
                  value={ese === '' || ese === undefined ? '' : ese}
                  placeholder={`Enter your ESE marks (0 - ${numericEseMax})`}
                  onChange={handleEseChange}
                  className="h-11 w-full rounded-lg py-2 pl-3 pr-20 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric"
                />
                <EseMaximumControl
                  id="ese-theory-max"
                  label="Maximum marks for ESE theory"
                  value={numericEseMax}
                  onChange={onEseTheoryMaxChange}
                />
              </div>

              {isTheoryEseBelowPass && (
                <div className="mb-3 rounded-lg bg-rose-50 border border-rose-200 px-3 py-2 text-rose-700 text-xs font-semibold flex items-center gap-1.5" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" aria-hidden="true" />
                  <span>Below minimum ESE passing mark ({theoryMinEsePass}/{numericEseMax} marks — 45%)</span>
                </div>
              )}
            </div>

            {/* Marks Contributed for Total at bottom */}
            <div className="pt-1">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-sm font-bold">Marks contributed:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums font-numeric">
                    {esePoints.toFixed(2)}
                  </span>
                  <span className="text-base font-bold text-[#d97757] font-numeric tabular-nums">/ {eseTheoryWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Grade "What-If" Planner */}
          <div className="md:col-span-6 p-3 sm:p-4 bg-white flex flex-col justify-between">
            <div className="w-full">
              <button
                type="button"
                onClick={() => setIsTheorySimulatorOpen((open) => !open)}
                aria-expanded={isTheorySimulatorOpen}
                id="tour-target-grade-simulator"
                data-tour="target-grade-simulator"
                className="flex w-full cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554] text-left"
              >
                <div className="text-[#d97757] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h4 id="tour-target-grade-simulator-text" data-tour="target-grade-simulator-text" className="text-sm font-bold text-[#172554]">Target Grade Simulator</h4>
                <ChevronDown
                  className={`ml-auto h-4 w-4 shrink-0 text-[#3b4d66] transition-transform duration-300 ease-out ${
                    isTheorySimulatorOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {isTheorySimulatorOpen && (
                  <motion.div
                    key="theory-simulator-dropdown"
                    initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    {!isSimulatorReady ? (
                      <div className="mt-3 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] text-center">
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Enter all previous assessment marks to use the Target Grade Simulator.
                        </p>
                      </div>
                    ) : (
                      <>
                        {isTheoryEseBelowPass && (
                          <div className="mt-2 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1.5 text-rose-700 text-[11px] font-semibold flex items-center gap-1.5" role="alert">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" aria-hidden="true" />
                            <span>Current ESE ({Number(ese)}/{numericEseMax}) does not meet the 45% passing requirement ({theoryMinEsePass}).</span>
                          </div>
                        )}

                        <div className="mt-3 rounded-xl border border-[#172554] divide-y divide-[#172554] text-xs font-medium overflow-hidden">
                          {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                            const { neededEse, isImpossible, isAlreadySecured } = calculateTargetGradeEseRequirement({
                              targetMinScore: g.minScore,
                              internalTotal,
                              eseTheoryWeight,
                              numericEseMax,
                            });

                            return (
                              <div
                                key={g.letter}
                                className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-8 font-black text-sm text-[#172554]">{g.letter}</span>
                                  <span className="text-[#172554] font-semibold font-numeric tabular-nums">{g.minScore}+ marks</span>
                                </div>

                                <div className="text-right">
                                  {isAlreadySecured ? (
                                    <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 rounded-md border border-[#172554] text-[11px]">
                                      Already Secured
                                    </span>
                                  ) : isImpossible ? (
                                    <span className="text-rose-700 font-bold text-[11px]">
                                      Needs &gt;{numericEseMax} - Unattainable
                                    </span>
                                  ) : (
                                    <span className="text-[#172554] font-bold">
                                      Need <span className="underline decoration-2 text-[#1e3a8a] font-numeric tabular-nums">{neededEse}</span> / {numericEseMax} in ESE
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-slate-200 bg-slate-50 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onCalculate}
            disabled={calculationState === 'calculating' || calculationState === 'saving'}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#172554] px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-[#1e3a8a] disabled:cursor-wait disabled:opacity-60"
          >
            {calculationState === 'calculating' || calculationState === 'saving' ? (
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Calculator className="h-4 w-4" aria-hidden="true" />
            )}
            {calculationState === 'calculating'
              ? 'Calculating result…'
              : calculationState === 'saving'
                ? 'Saving result…'
                : hasCalculated
                  ? 'Recalculate Mark & Grade'
                  : 'Calculate Mark & Grade'}
          </button>
          {(calculationState === 'calculating' ||
            calculationState === 'saving' ||
            (calculationState === 'success' && hasCalculated)) && (
            <p className="text-xs font-semibold text-slate-600" role="status" aria-live="polite">
              {calculationState === 'calculating'
                ? 'Calculating result…'
                : calculationState === 'saving'
                  ? 'Saving result to your account…'
                  : savePending
                    ? 'Grade calculated; waiting to sync your account.'
                  : guestMode
                    ? 'Result calculated for this temporary session only.'
                    : 'Result calculated and saved to your account.'}
            </p>
          )}
        </div>
      </div>
    </motion.section>
  );
};

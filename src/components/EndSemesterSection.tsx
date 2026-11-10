import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionVariants } from '../motion';
import { GraduationCap, Target, FlaskConical, ChevronDown, Calculator, LoaderCircle } from 'lucide-react';
import { GRADE_SCALE } from '../calculatorUtils';
import { CourseType } from '../types';
import { MaxMarksInput } from './MaxMarksInput';

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
}) => {
  const eseWeight = eseTheoryWeight + eseLabWeight;
  const numericEseMax = Math.max(1, Number(eseTheoryMax) || 100);
  const hasTheory = eseTheoryWeight > 0;
  const hasLab = eseLabWeight > 0;
  const isSplit = hasTheory && hasLab; // theory + practical
  const isPracticalOnly = !hasTheory && hasLab; // practical exam is the whole ESE
  const labName = isPracticalOnly || courseType === 'self-development' ? 'Practical' : 'Lab';

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
          <div className="lg:col-span-4 p-3 sm:p-4 flex flex-col justify-between bg-white">
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
                  className="h-11 w-full rounded-lg px-3 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#d97757] tabular-nums font-numeric">/ {numericEseMax}</span>
              </div>
              {onEseTheoryMaxChange && (
                <MaxMarksInput
                  id="ese-theory-max"
                  label="Maximum marks for ESE theory"
                  value={eseTheoryMax}
                  onChange={onEseTheoryMaxChange}
                  className="mb-2"
                />
              )}



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
              <div className="relative mb-3">
                <input
                  id="ese-lab-input"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={numericLabMax}
                  step={0.5}
                  value={eseLab === '' || eseLab === undefined ? '' : eseLab}
                  placeholder={`Enter ${labName.toLowerCase()} marks (0 - ${numericLabMax})`}
                  onChange={handleLabChange}
                  className="h-11 w-full rounded-lg px-3 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#d97757] tabular-nums font-numeric">
                  / {numericLabMax}
                </span>
              </div>
              {onEseLabMaxChange && (
                <MaxMarksInput
                  id="ese-lab-max"
                  label={`Maximum marks for ESE ${labName.toLowerCase()}`}
                  value={eseLabMax}
                  onChange={handleLabMaxChange}
                  className="mb-2"
                />
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
            <details className="group">
              <summary id="tour-target-grade-simulator" data-tour="target-grade-simulator" className="flex cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554]">
                <div className="text-[#d97757] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 id="tour-target-grade-simulator-text" data-tour="target-grade-simulator-text" className="text-sm font-bold text-[#172554]">
                    Target Grade Simulator
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isPracticalOnly ? `ESE Requirement` : `Combined ESE Requirement`}
                  </span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-[#3b4d66] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>

              <div className="mt-3 rounded-xl border border-[#172554] divide-y divide-[#172554] text-xs font-medium mb-3 overflow-hidden">
                {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                  const neededTotalEse = Math.max(0, g.minScore - internalTotal);
                  const isAlreadySecured = internalTotal >= g.minScore;
                  const isImpossible = neededTotalEse > eseWeight;

                  // Theory course: needed from Theory assuming current practical marks.
                  // Practical-only course: needed from the practical exam itself.
                  const approxScale = hasTheory ? numericEseMax : numericLabMax;
                  const approxName = hasTheory ? 'Theory' : 'Practical';
                  const approxNeeded = hasTheory
                    ? Math.ceil((Math.max(0, neededTotalEse - eseLabPoints) / eseTheoryWeight) * numericEseMax)
                    : Math.ceil((neededTotalEse / eseLabWeight) * numericLabMax);

                  return (
                    <div
                      key={g.letter}
                      className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 font-black text-sm text-[#172554]">{g.letter}</span>
                        <span className="text-[#172554] font-semibold text-[11px]">{g.minScore}+</span>
                      </div>

                      <div className="text-right">
                        {isAlreadySecured ? (
                          <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 rounded-md border border-[#172554] text-[10px]">
                            Secured
                          </span>
                        ) : isImpossible ? (
                          <span className="text-rose-700 font-bold text-[10px]">
                            Needs &gt;{eseWeight} in ESE
                          </span>
                        ) : (
                          <span className="text-[#172554] font-bold text-[11px]">
                            Need <strong className="text-[#1e3a8a] font-numeric tabular-nums">{neededTotalEse.toFixed(1)}</strong>/{eseWeight} in ESE
                            {approxNeeded <= approxScale && (
                              <span className="block text-[10px] font-normal text-slate-600">
                                ~{approxNeeded}/{approxScale} in {approxName}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>

          </div>
        </div>
      ) : (
        /* --- Theory-only ESE: Standard 2-Column Layout (Theory + Target Simulator) --- */
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
                  className="h-11 w-full rounded-lg px-3 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums font-numeric"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#d97757] tabular-nums font-numeric">/ {numericEseMax}</span>
              </div>
              {onEseTheoryMaxChange && (
                <MaxMarksInput
                  id="ese-theory-max"
                  label="Maximum marks for ESE theory"
                  value={eseTheoryMax}
                  onChange={onEseTheoryMaxChange}
                  className="mb-2"
                />
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
            <details className="group">
              <summary id="tour-target-grade-simulator" data-tour="target-grade-simulator" className="flex cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554]">
                <div className="text-[#d97757] shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h4 id="tour-target-grade-simulator-text" data-tour="target-grade-simulator-text" className="text-sm font-bold text-[#172554]">Target Grade Simulator</h4>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-[#3b4d66] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>

              <div className="mt-3 rounded-xl border border-[#172554] divide-y divide-[#172554] text-xs font-medium overflow-hidden">
                {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                  const neededEse = Math.max(0, Math.ceil(((g.minScore - internalTotal) / eseTheoryWeight) * numericEseMax));
                  const isAlreadySecured = internalTotal >= g.minScore;
                  const isImpossible = neededEse > numericEseMax;

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
                            Need <span className="underline decoration-2 text-[#1e3a8a]">{neededEse}</span> / {numericEseMax} in ESE
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

            </details>
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

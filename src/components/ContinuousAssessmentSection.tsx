import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { motionVariants } from '../motion';
import { DynamicScoreBoxes } from './DynamicScoreBoxes';
import { FileCheck, Pencil, X } from 'lucide-react';

interface ContinuousAssessmentSectionProps {
  number: 1 | 2;
  title: string;
  testMax: number | string;
  test: number | string;
  onTestMaxChange: (val: number | string) => void;
  onTestChange: (val: number | string) => void;
  testPoints: number;
  testWeight?: number;
  allowCustomTestMax?: boolean;
  isSelfDevelopment?: boolean;
  testDisplayName?: string;
  isTwoTestCourse?: boolean;
  isSingleAssessment?: boolean;
  minimumActivityCount?: number;
  maximumActivityCount?: number;
  activityTitle?: string;
  activityScoreLabel?: string;

  actNo: number | string;
  onActNoChange: (val: number | string) => void;
  actScores: (number | string)[];
  onActScoresChange: (scores: (number | string)[]) => void;
  actPoints: number;
  actWeight?: number;
  actStartIndex: number;

  labNo: number | string;
  onLabNoChange: (val: number | string) => void;
  labScores: (number | string)[];
  onLabScoresChange: (scores: (number | string)[]) => void;
  labPoints: number;
  labWeight?: number;
  labStartIndex: number;

  estimatedMarks?: boolean;
}

export const ContinuousAssessmentSection: React.FC<ContinuousAssessmentSectionProps> = ({
  number,
  title,
  testMax,
  test,
  onTestMaxChange,
  onTestChange,
  testPoints,
  testWeight = 15,
  allowCustomTestMax: _allowCustomTestMax = false,
  isSelfDevelopment: _isSelfDevelopment = false,
  testDisplayName,
  isTwoTestCourse = false,
  isSingleAssessment = false,
  minimumActivityCount = 0,
  maximumActivityCount = 20,
  activityTitle,
  activityScoreLabel,
  actNo,
  onActNoChange,
  actScores,
  onActScoresChange,
  actPoints,
  actWeight = 2.5,
  actStartIndex,
  labNo,
  onLabNoChange,
  labScores,
  onLabScoresChange,
  labPoints,
  labWeight = 7.5,
  labStartIndex,
  estimatedMarks = false,
}) => {
  const hasLab = labWeight > 0;
  const hasActivities = actWeight > 0;
  const testColumnClass = hasLab ? 'lg:col-span-4' : hasActivities ? 'lg:col-span-6' : 'lg:col-span-12';
  const reduceMotion = useReducedMotion();

  // Current maximum marks: accepts any positive configured value, defaults to 50
  const currentMax = Math.max(1, Number(testMax) || 50);

  // Maximum marks configuration state
  const [isEditingMax, setIsEditingMax] = useState(false);
  const [tempMax, setTempMax] = useState(String(currentMax));
  const [maxError, setMaxError] = useState<string | null>(null);
  const editMaxRef = useRef<HTMLDivElement>(null);

  // Close editing on click outside
  useEffect(() => {
    if (!isEditingMax) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (editMaxRef.current && !editMaxRef.current.contains(event.target as Node)) {
        setIsEditingMax(false);
        setMaxError(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditingMax]);

  const handleSaveMax = () => {
    const val = parseFloat(tempMax);
    if (isNaN(val) || val <= 0) {
      setMaxError('Maximum marks must be greater than 0');
      return;
    }

    // Prevent scored marks from exceeding the newly configured maximum
    if (test !== '' && test !== undefined && test !== null) {
      const scoredVal = typeof test === 'number' ? test : parseFloat(test);
      if (!isNaN(scoredVal) && scoredVal > val) {
        onTestChange(val);
      }
    }

    onTestMaxChange(val);
    setIsEditingMax(false);
    setMaxError(null);
  };

  const handleCancelMax = () => {
    setTempMax(String(currentMax));
    setIsEditingMax(false);
    setMaxError(null);
  };

  return (
    <motion.section
      variants={reduceMotion ? undefined : motionVariants.card}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      className="overflow-hidden rounded-xl bg-white dark:bg-[#161618] border border-slate-300 dark:border-slate-700 mb-3 sm:mb-4 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 sm:px-4 bg-[#172554] text-white">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-white text-[#172554] font-black text-sm rounded">
            {isTwoTestCourse ? `Test ${number}` : isSingleAssessment ? 'Assessment' : `CA ${number}`}
          </span>
          <h3 className="text-base sm:text-lg font-bold tracking-wide">
            {isTwoTestCourse ? testDisplayName : title}
          </h3>
        </div>

      </div>

      {/* Categories separated by simple vertical formal navy line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700">
        {/* Category 1: Written Examination */}
        <div className={`${testColumnClass} p-2.5 sm:p-3 flex flex-col justify-between bg-white dark:bg-[#202024]`}>
          <div className="p-3">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-[#3b4d66] shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#d97757] dark:text-[#e08564]">
                    {testDisplayName ?? `CA Test ${number}`}
                  </h4>
                </div>
              </div>
            </div>

            {/* Test Marks Scored with integrated configurable maximum marks */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`test-scored-${number}`}
                  className="block text-xs font-bold text-[#172554] dark:text-[#f1f1f3]"
                >
                  Marks scored:
                </label>
              </div>

              <div className="relative">
                <input
                  id={`test-scored-${number}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={currentMax}
                  step={0.5}
                  value={test === '' ? '' : test}
                  placeholder={`0 - ${currentMax}`}
                  onChange={(e) => {
                    const raw = e.target.value;
                    onTestChange(
                      raw === '' ? '' : Math.max(0, Math.min(currentMax, parseFloat(raw) || 0))
                    );
                  }}
                  className="h-11 w-full min-w-0 pl-3.5 pr-24 text-xl sm:text-2xl font-black text-[#172554] dark:text-[#f1f1f3] bg-white dark:bg-[#161618] border border-[#172554] dark:border-slate-700 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm font-numeric tabular-nums"
                />

                {/* Right-aligned maximum marks + pencil icon inside existing input border */}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 shrink-0 select-none">
                  <span className="text-xs sm:text-sm font-bold text-[#d97757] dark:text-[#d97757] font-numeric tabular-nums">
                    / {currentMax}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTempMax(String(currentMax));
                      setMaxError(null);
                      setIsEditingMax(!isEditingMax);
                    }}
                    title="Configure maximum marks"
                    aria-label={`Configure maximum marks for ${testDisplayName ?? `CA Test ${number}`}`}
                    className="p-1 rounded text-slate-400 hover:text-[#172554] dark:hover:text-[#f1f1f3] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Configurable maximum marks popover */}
                <AnimatePresence>
                  {isEditingMax && (
                    <motion.div
                      ref={editMaxRef}
                      initial={reduceMotion ? false : { opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-1.5 z-30 w-72 max-w-[calc(100vw-2rem)] p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#172554] dark:text-[#f1f1f3]">
                          Configure Max Marks
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelMax}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                          aria-label="Cancel editing maximum marks"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={1}
                          step={1}
                          value={tempMax}
                          onChange={(e) => {
                            setTempMax(e.target.value);
                            setMaxError(null);
                          }}
                          placeholder="e.g. 25, 30, 50"
                          className="h-9 w-full px-2.5 text-sm font-bold border border-[#172554] dark:border-slate-600 rounded-lg bg-white dark:bg-[#161618] text-[#172554] dark:text-[#f1f1f3] focus:outline-hidden font-numeric tabular-nums"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveMax();
                            if (e.key === 'Escape') handleCancelMax();
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleSaveMax}
                          className="h-9 px-3 bg-[#172554] dark:bg-[#d97757] text-white text-xs font-bold rounded-lg hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelMax}
                          className="h-9 px-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                      {maxError && (
                        <p className="mt-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                          {maxError}
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Marks Contributed for Total at bottom of Category 1 */}
          <div className="mt-4 pt-1 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline justify-between text-[#172554] dark:text-[#f1f1f3]">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Marks Contributed:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
                  {testPoints.toFixed(2)}
                </span>
                <span className="text-base font-bold text-[#d97757] dark:text-[#d97757] font-numeric tabular-nums">
                  / {testWeight}
                </span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Category 2: Assignments / Activities */}
        {hasActivities && (
          <div className="lg:col-span-4 p-2.5 sm:p-3 bg-white dark:bg-[#202024]">
            <DynamicScoreBoxes
              title={activityTitle ?? 'Assignments / Activities'}
              category="assignment"
              count={actNo}
              onCountChange={onActNoChange}
              scores={actScores}
              onScoresChange={onActScoresChange}
              startIndex={actStartIndex}
              maxMarkPerBox={10}
              weight={actWeight}
              calculatedPoints={actPoints}
              caName={`CA ${number}`}
              estimatedMarks={estimatedMarks}
              minimumCount={minimumActivityCount}
              maximumCount={maximumActivityCount}
              scoreLabel={activityScoreLabel}
            />
          </div>
        )}

        {/* Category 3: Laboratory Practical */}
        {hasLab && (
          <div className="lg:col-span-4 p-2.5 sm:p-3 bg-white dark:bg-[#202024]">
            <DynamicScoreBoxes
              title="Lab Practical Evaluation"
              category="lab"
              count={labNo}
              onCountChange={onLabNoChange}
              scores={labScores}
              onScoresChange={onLabScoresChange}
              startIndex={labStartIndex}
              maxMarkPerBox={10}
              weight={labWeight}
              calculatedPoints={labPoints}
              caName={`CA ${number}`}
              estimatedMarks={estimatedMarks}
            />
          </div>
        )}
      </div>
    </motion.section>
  );
};

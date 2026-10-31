import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { motionVariants } from '../motion';
import { DynamicScoreBoxes } from './DynamicScoreBoxes';
import { FileCheck } from 'lucide-react';

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

  subtotal: number;
  caMax?: number;
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
  allowCustomTestMax = false,
  isSelfDevelopment = false,
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
  subtotal,
  caMax = 25,
  estimatedMarks = false,
}) => {
  const hasLab = labWeight > 0;
  const hasActivities = actWeight > 0;
  const testColumnClass = hasLab ? 'lg:col-span-4' : hasActivities ? 'lg:col-span-6' : 'lg:col-span-12';
  const reduceMotion = useReducedMotion();
  const currentMax = allowCustomTestMax
    ? Math.max(1, Number(testMax) || 50)
    : (Number(testMax) === 30 ? 30 : 50);

  return (
    <motion.section variants={reduceMotion ? undefined : motionVariants.card} initial={reduceMotion ? false : "initial"} animate="animate" className="overflow-hidden rounded-xl bg-white border border-slate-300 mb-3 sm:mb-4 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 sm:px-4 bg-[#172554] text-white">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-white text-[#172554] font-black text-sm">
            {isTwoTestCourse ? `Test ${number}` : isSingleAssessment ? 'Assessment' : `CA ${number}`}
          </span>
          <h3 className="text-base sm:text-lg font-bold tracking-wide">{isTwoTestCourse ? testDisplayName : title}</h3>
        </div>

        {/* Subtotal without enclosing rectangular border box */}
        <div className="flex items-baseline gap-2 self-start sm:self-auto text-white">
          <span className="text-xs font-bold text-slate-200">
            Marks contributed:
          </span>
          <span className="text-lg font-black tabular-nums">
            {subtotal.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-slate-300">
              / {caMax.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      {/* Categories separated by simple vertical formal navy line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Category 1: Written Examination (weight depends on course type) */}
        <div className={`${testColumnClass} p-2.5 sm:p-3 flex flex-col justify-between bg-white`}>
          <div>
            {/* Header - no horizontal underline */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 text-[#172554] border border-blue-100 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172554]">
                    {testDisplayName ?? `CA Test ${number}`}
                  </h4>
                  <span className="text-xs font-semibold text-[#1e3a8a]">
                    Weightage: {testWeight}%
                  </span>
                </div>
              </div>
            </div>

            {/* Maximum Test Marks */}
            {allowCustomTestMax ? (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`test-max-input-${number}`}
                    className="text-xs font-bold text-[#172554]"
                  >
                    Maximum test marks:
                  </label>
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1">
                    {(isTwoTestCourse ? [] : [20, 25, 30, 50]).map((presetVal) => (
                      <button
                        key={presetVal}
                        type="button"
                        onClick={() => onTestMaxChange(presetVal)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 border cursor-pointer transition-colors ${
                          Number(testMax) === presetVal
                            ? 'bg-[#172554] text-white border-[#172554]'
                            : 'bg-white text-[#172554] border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {presetVal}M
                      </button>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <input
                    id={`test-max-input-${number}`}
                    type="number"
                    min={1}
                    step={1}
                    value={testMax === '' || testMax === undefined ? '' : testMax}
                    placeholder={isTwoTestCourse ? 'Enter this test’s maximum marks' : 'Enter maximum marks - e.g. 25, 30, 50'}
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        onTestMaxChange('');
                        return;
                      }
                      const val = parseFloat(raw);
                      onTestMaxChange(isNaN(val) ? '' : Math.max(1, val));
                    }}
                    className="h-11 w-full min-w-0 px-3 pr-24 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-500">
                    Max Scale
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  {isTwoTestCourse ? 'Enter the maximum marks for this test.' : 'Enter maximum marks or select a preset'}
                </p>
              </div>
            ) : (
              <div className="mb-3">
                <label className="block text-xs font-bold text-[#172554] mb-1.5">
                  Maximum test marks:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[50, 30].map((val) => {
                    const isSelected = currentMax === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onTestMaxChange(val)}
                        className={`h-11 px-3 text-xs font-bold border transition-colors text-center ${
                          isSelected
                            ? 'bg-[#172554] text-white border-[#172554]'
                            : 'bg-white hover:bg-slate-100 text-[#172554] border-[#172554]'
                        }`}
                      >
                        {val} Marks
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Test Marks Scored */}
            <div className="mb-3">
              <label
                htmlFor={`test-scored-${number}`}
                className="block text-xs font-bold text-[#172554] mb-1.5"
              >
                Marks scored:
              </label>
              <div className="relative">
                <input
                  id={`test-scored-${number}`}
                  type="number"
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
                  className="h-11 w-full min-w-0 px-3 pr-16 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-[#1e3a8a]">
                  / {currentMax}
                </span>
              </div>
            </div>
          </div>

          {/* Marks Contributed for Total at bottom of Category 1: NO horizontal line and NO rectangular box */}
          <div className="mt-4 pt-1">
            <div className="flex items-baseline justify-between text-[#172554]">
              <span className="text-xs font-bold">
                Marks contributed:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tabular-nums">
                  {testPoints.toFixed(2)}
                </span>
                <span className="text-xs font-bold text-[#1e3a8a]">
                  / {testWeight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: Assignments / Activities (weight depends on course type) */}
        {hasActivities &&         <div className={`${hasLab ? 'lg:col-span-4' : 'lg:col-span-6'} min-w-0 bg-white`}>
          <DynamicScoreBoxes
            title={activityTitle ?? (hasLab && !isSelfDevelopment ? 'Assignments' : 'Activities')}
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
        </div>}

        {/* Category 3: Lab Practical Evaluations (only for courses with a lab component) */}
        {hasLab && (
        <div className="min-w-0 lg:col-span-4 bg-white">
          <DynamicScoreBoxes
            title="Lab Practical Evaluations"
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

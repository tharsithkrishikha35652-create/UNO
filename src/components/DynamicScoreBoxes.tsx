import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { transitions } from '../motion';
import { FlaskConical, FileText } from 'lucide-react';
import { NumberStepper } from './NumberStepper';
import { MaxMarksInput } from './MaxMarksInput';

interface DynamicScoreBoxesProps {
  title: string;
  category: 'assignment' | 'lab';
  count: number | string;
  onCountChange: (newCount: number | string) => void;
  scores: (number | string)[];
  onScoresChange: (newScores: (number | string)[]) => void;
  startIndex?: number;
  maxMarkPerBox?: number | string;
  onMaxMarkPerBoxChange?: (max: number | string) => void;
  weight: number;
  calculatedPoints: number;
  caName: string;
  estimatedMarks?: boolean;
  minimumCount?: number;
  maximumCount?: number;
  scoreLabel?: string;
  itemLabel?: string;
}

export const DynamicScoreBoxes: React.FC<DynamicScoreBoxesProps> = ({
  title,
  category,
  count,
  onCountChange,
  scores,
  onScoresChange,
  startIndex = 1,
  maxMarkPerBox = 10,
  onMaxMarkPerBoxChange,
  weight,
  calculatedPoints,
  caName,
  estimatedMarks = false,
  minimumCount = 0,
  maximumCount = 20,
  scoreLabel,
  itemLabel,
}) => {
  const reduceMotion = useReducedMotion();
  const numericCount = Math.max(0, parseInt(String(count), 10) || 0);
  const numericMaxMarkPerBox = Math.max(1, Number(maxMarkPerBox) || 10);
  const accessibleItemLabel = itemLabel ?? scoreLabel ?? (category === 'assignment' ? 'Assignment' : 'Lab Evaluation');

  const handleBoxChange = (index: number, val: string) => {
    const newScores = [...scores];
    if (val === '') {
      newScores[index] = '';
    } else {
      const num = parseFloat(val);
      newScores[index] = isNaN(num) ? '' : Math.max(0, Math.min(numericMaxMarkPerBox, num));
    }
    onScoresChange(newScores);
  };

  const adjustBoxScore = (index: number, delta: number) => {
    const current = parseFloat(String(scores[index] ?? 0)) || 0;
    const updated = Math.max(0, Math.min(numericMaxMarkPerBox, parseFloat((current + delta).toFixed(2))));
    const newScores = [...scores];
    newScores[index] = updated;
    onScoresChange(newScores);
  };

  const incrementCount = () => {
    if (numericCount < maximumCount) {
      onCountChange(numericCount + 1);
    }
  };

  const decrementCount = () => {
    if (numericCount > minimumCount) {
      onCountChange(numericCount - 1);
    }
  };

  const handleCountInputChange = (val: number | string) => {
    const strVal = String(val);
    if (strVal === '') {
      onCountChange('');
      return;
    }
    const parsed = parseInt(strVal, 10);
    if (isNaN(parsed)) {
      onCountChange('');
      return;
    }
    const clamped = Math.max(minimumCount, Math.min(maximumCount, parsed));
    onCountChange(clamped);
  };

  return (
    <div className="flex flex-col justify-between h-full p-3">
      <div>
        {/* Header with Title and Count Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="text-[#3b4d66]">
              {category === 'assignment' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <FlaskConical className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#d97757] dark:text-[#e08564]">{title}</h4>
            </div>
          </div>

          {/* Stepper for number of items */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {onMaxMarkPerBoxChange && (
              <MaxMarksInput
                id={`max-score-${category}-${caName.replace(/\s+/g, '-').toLowerCase()}`}
                label={`Maximum marks for each ${accessibleItemLabel.toLowerCase()} in ${caName}`}
                value={maxMarkPerBox}
                onChange={(value) => {
                  const nextMax = Math.max(1, Number(value) || numericMaxMarkPerBox);
                  onMaxMarkPerBoxChange(value);
                  if (!estimatedMarks) {
                    onScoresChange(scores.map((score) =>
                      score === '' ? '' : Math.min(nextMax, Math.max(0, Number(score) || 0))
                    ));
                  }
                }}
              />
            )}
            <label
              htmlFor={`count-${category}-${caName}`}
              className="text-xs font-bold text-[#172554] dark:text-[#f1f1f3]"
            >
              Number:
            </label>
            <NumberStepper
              id={`count-${category}-${caName}`}
              value={count === '' || count === undefined ? '' : count}
              onChange={handleCountInputChange}
              onIncrement={incrementCount}
              onDecrement={decrementCount}
              min={minimumCount}
              max={maximumCount}
              step={1}
              disabled={estimatedMarks}
              ariaLabel={`Number of ${accessibleItemLabel.toLowerCase()} items in ${caName}`}
              ariaLabelDecrement={`Decrease number of ${accessibleItemLabel.toLowerCase()} items in ${caName}`}
              ariaLabelIncrement={`Increase number of ${accessibleItemLabel.toLowerCase()} items in ${caName}`}
              size="md"
            />
          </div>
        </div>

        {/* Dynamic Entries: Two-column grid row-by-row */}
        <AnimatePresence initial={false} mode="wait">
        {numericCount === 0 ? (
          <motion.div
            key="empty"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={transitions.feedback}
            className="py-3 text-center text-[#172554] dark:text-[#f1f1f3] text-xs my-1"
          >
            <p className="font-medium text-slate-600 dark:text-slate-400">
              Set the number of {category === 'assignment' ? 'assignments' : 'lab practical evaluations'} above
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={transitions.feedback}
            className="my-2 bg-transparent"
          >
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <AnimatePresence initial={false}>
              {Array.from({ length: numericCount }).map((_, idx) => {
                const displayIndex = startIndex + idx;
                const rawScore = scores[idx];
                const displayVal = rawScore === undefined || rawScore === null ? '' : rawScore;

                return (
                  <motion.div
                    key={`box-${startIndex}-${idx}`}
                    layout
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.95, y: 4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.95, y: -4 }}
                    transition={transitions.state}
                    className="min-w-0 p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#161618] flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-[#202024] transition-colors"
                  >
                    <span className="text-[10px] sm:text-xs font-bold text-[#172554] dark:text-[#f1f1f3] mb-1.5 whitespace-normal text-center leading-tight">
                      {accessibleItemLabel === 'Assignment' || accessibleItemLabel === 'Lab Evaluation'
                        ? category === 'assignment' ? `Assignment ${displayIndex}` : `Lab ${displayIndex}`
                        : `${accessibleItemLabel} ${displayIndex}`}
                    </span>

                    <div className="flex items-center gap-1 sm:gap-1.5 w-full justify-center">
                      <NumberStepper
                        value={displayVal}
                        onChange={(val) => handleBoxChange(idx, String(val))}
                        onIncrement={() => adjustBoxScore(idx, 0.5)}
                        onDecrement={() => adjustBoxScore(idx, -0.5)}
                        min={0}
                        max={numericMaxMarkPerBox}
                        step={0.5}
                        disabled={estimatedMarks}
                        readOnly={estimatedMarks}
                        ariaLabel={`${accessibleItemLabel} ${displayIndex} mark out of ${numericMaxMarkPerBox}`}
                        ariaLabelDecrement={`Decrease ${category === 'assignment' ? 'assignment' : 'lab'} ${displayIndex} mark by 0.5`}
                        ariaLabelIncrement={`Increase ${category === 'assignment' ? 'assignment' : 'lab'} ${displayIndex} mark by 0.5`}
                        size="sm"
                      />
                      <span className="text-[10px] sm:text-xs font-bold text-[#d97757] dark:text-[#d97757] font-numeric tabular-nums shrink-0">
                        /{numericMaxMarkPerBox}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      {/* Marks Contributed for Total at bottom */}
      <div className="mt-2 pt-2 space-y-1 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[#172554] dark:text-[#f1f1f3] pt-1">
          <span className="min-w-0 text-sm font-bold text-slate-700 dark:text-slate-300">
            {estimatedMarks ? 'Marks Contributed (estimate):' : 'Marks Contributed:'}
          </span>
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-lg font-black tabular-nums font-numeric text-[#172554] dark:text-[#f1f1f3]">
              {calculatedPoints.toFixed(2)}
            </span>
            <span className="text-base font-bold text-[#d97757] dark:text-[#d97757] font-numeric tabular-nums">
              / {weight}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

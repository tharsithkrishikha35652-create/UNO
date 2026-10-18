import React from 'react';
import { Plus, Minus, FlaskConical, FileText } from 'lucide-react';

interface DynamicScoreBoxesProps {
  title: string;
  category: 'assignment' | 'lab';
  count: number | string;
  onCountChange: (newCount: number | string) => void;
  scores: (number | string)[];
  onScoresChange: (newScores: (number | string)[]) => void;
  startIndex?: number;
  maxMarkPerBox?: number;
  weight: number;
  calculatedPoints: number;
  caName: string;
  estimatedMarks?: boolean;
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
  weight,
  calculatedPoints,
  caName,
  estimatedMarks = false,
}) => {
  const numericCount = Math.max(0, parseInt(String(count), 10) || 0);

  const handleBoxChange = (index: number, val: string) => {
    const newScores = [...scores];
    if (val === '') {
      newScores[index] = '';
    } else {
      const num = Math.max(0, Math.min(maxMarkPerBox, parseFloat(val) || 0));
      newScores[index] = num;
    }
    onScoresChange(newScores);
  };

  const incrementScore = (index: number) => {
    const current = scores[index] === '' || scores[index] === undefined ? 8 : Number(scores[index]);
    const nextVal = Math.min(maxMarkPerBox, Math.round((current + 0.5) * 10) / 10);
    handleBoxChange(index, String(nextVal));
  };

  const decrementScore = (index: number) => {
    const current = scores[index] === '' || scores[index] === undefined ? 8 : Number(scores[index]);
    const nextVal = Math.max(0, Math.round((current - 0.5) * 10) / 10);
    handleBoxChange(index, String(nextVal));
  };

  const handleCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onCountChange('');
      return;
    }
    const val = parseInt(raw, 10);
    const safeVal = isNaN(val) ? 0 : Math.max(0, Math.min(20, val));
    onCountChange(safeVal);
  };

  const incrementCount = () => {
    if (numericCount < 20) {
      const nextCount = numericCount + 1;
      const newScores = [...scores];
      if (newScores[numericCount] === undefined || newScores[numericCount] === '') {
        newScores[numericCount] = 8;
      }
      onScoresChange(newScores);
      onCountChange(nextCount);
    }
  };

  const decrementCount = () => {
    if (numericCount > 0) {
      onCountChange(numericCount - 1);
    }
  };

  const sum = scores
    .slice(0, numericCount)
    .reduce<number>((acc, curr) => acc + (curr === '' || isNaN(Number(curr)) ? 0 : Number(curr)), 0);
  const maxPossibleSum = numericCount * maxMarkPerBox;

  return (
    <div className="p-4 sm:p-5 flex flex-col justify-between h-full bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
      <div>
        {/* Header with Title, Weightage & Count Stepper */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 flex items-center justify-center bg-[#172554] dark:bg-blue-600 text-white shrink-0">
              {category === 'assignment' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <FlaskConical className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#172554] dark:text-blue-200">{title}</h4>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Weightage: <span className="font-bold text-[#1e3a8a] dark:text-blue-400">{weight}%</span>
              </span>
            </div>
          </div>

          {/* Precision Count Stepper */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label
              htmlFor={`count-${category}-${caName}`}
              className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Number:
            </label>
            <div className="inline-flex items-center border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-2xs">
              <button
                type="button"
                onClick={decrementCount}
                disabled={estimatedMarks || numericCount <= 0}
                aria-label={`Decrease number of ${category}s`}
                className="w-8 h-8 flex items-center justify-center text-[#172554] dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors border-r border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <input
                id={`count-${category}-${caName}`}
                type="number"
                min={0}
                max={20}
                value={count === '' || count === undefined ? '' : count}
                placeholder="0"
                disabled={estimatedMarks}
                onChange={handleCountInputChange}
                className="w-10 text-center font-mono text-xs font-bold py-1 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden tabular-nums"
              />
              <button
                type="button"
                onClick={incrementCount}
                disabled={estimatedMarks || numericCount >= 20}
                aria-label={`Increase number of ${category}s`}
                className="w-8 h-8 flex items-center justify-center text-[#172554] dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300 dark:active:bg-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Entries: Horizontal scroll strip with tactile steppers */}
        {numericCount === 0 ? (
          <div className="py-5 text-center text-xs text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 my-2">
            Use the <span className="font-bold text-[#172554] dark:text-blue-300">+</span> button above to set the number of {category === 'assignment' ? 'assignments' : 'lab practicals'}
          </div>
        ) : (
          <div className="my-3 overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max">
              {Array.from({ length: numericCount }).map((_, idx) => {
                const displayIndex = startIndex + idx;
                const rawScore = scores[idx];
                const displayVal = rawScore === undefined || rawScore === null || rawScore === '' ? 8 : rawScore;

                return (
                  <div
                    key={idx}
                    className="p-2.5 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 min-w-[124px] shadow-2xs"
                  >
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                      {category === 'assignment' ? `Assign ${displayIndex}` : `Lab ${displayIndex}`}
                    </span>

                    {/* Hardware-inspired Stepper */}
                    <div className="inline-flex items-center border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => decrementScore(idx)}
                        disabled={estimatedMarks || Number(displayVal) <= 0}
                        aria-label={`Decrease score for ${category} ${displayIndex} by 0.5`}
                        className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 disabled:opacity-25 disabled:pointer-events-none transition-colors border-r border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>

                      <div className="relative flex items-center justify-center px-1">
                        <input
                          type="number"
                          min={0}
                          max={maxMarkPerBox}
                          step={0.5}
                          value={displayVal}
                          readOnly={estimatedMarks}
                          onChange={(e) => handleBoxChange(idx, e.target.value)}
                          aria-label={`${category === 'assignment' ? 'Assignment' : 'Lab Evaluation'} ${displayIndex} mark out of ${maxMarkPerBox}`}
                          className="w-9 py-1 text-center font-mono text-xs font-extrabold text-[#172554] dark:text-blue-300 bg-transparent focus:outline-hidden tabular-nums"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => incrementScore(idx)}
                        disabled={estimatedMarks || Number(displayVal) >= maxMarkPerBox}
                        aria-label={`Increase score for ${category} ${displayIndex} by 0.5`}
                        className="w-7 h-7 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 disabled:opacity-25 disabled:pointer-events-none transition-colors border-l border-slate-200 dark:border-slate-700 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1">
                      out of {maxMarkPerBox}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Contributed marks footer */}
      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
          <span className="text-[11px] font-medium">Total Raw Marks:</span>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
            {sum} / {maxPossibleSum}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#172554] dark:text-blue-300">
            {estimatedMarks ? 'Estimated Weight:' : 'Marks Contributed:'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-black font-mono text-[#172554] dark:text-white tabular-nums">
              {calculatedPoints.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ {weight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

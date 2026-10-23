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
  weight,
  calculatedPoints,
  caName,
  estimatedMarks = false,
  minimumCount = 0,
  maximumCount = 20,
  scoreLabel,
  itemLabel,
}) => {
  const numericCount = Math.max(0, parseInt(String(count), 10) || 0);
  const accessibleItemLabel = itemLabel ?? scoreLabel ?? (category === 'assignment' ? 'Assignment' : 'Lab Evaluation');

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

  const adjustBoxScore = (index: number, amount: number) => {
    const currentScore = Number(scores[index]) || 0;
    const nextScores = [...scores];
    nextScores[index] = Math.max(0, Math.min(maxMarkPerBox, Math.round((currentScore + amount) * 2) / 2));
    onScoresChange(nextScores);
  };

  const handleCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      onCountChange(minimumCount > 0 ? minimumCount : '');
      return;
    }
    const val = parseInt(raw, 10);
    const safeVal = isNaN(val) ? minimumCount : Math.max(minimumCount, Math.min(maximumCount, val));
    onCountChange(safeVal);
  };

  const incrementCount = () => {
    if (numericCount < maximumCount) {
      onCountChange(numericCount < minimumCount ? minimumCount : numericCount + 1);
    }
  };

  const decrementCount = () => {
    if (numericCount > minimumCount) {
      onCountChange(numericCount - 1);
    }
  };

  const sum = scores
    .slice(0, numericCount)
    .reduce<number>((acc, curr) => acc + (curr === '' || isNaN(Number(curr)) ? 0 : Number(curr)), 0);
  const maxPossibleSum = numericCount * maxMarkPerBox;

  return (
    <div className="p-3 sm:p-4 flex flex-col justify-between h-full bg-white">
      {/* Category Header - no horizontal underline */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#172554] text-white shrink-0">
              {category === 'assignment' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <FlaskConical className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">{title}</h4>
              <span className="text-xs font-semibold text-[#1e3a8a]">
                Weightage: {weight}%
              </span>
            </div>
          </div>

          {/* Stepper with the word "number" */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label
              htmlFor={`count-${category}-${caName}`}
              className="text-xs font-bold text-[#172554] uppercase tracking-wider"
            >
              Number:
            </label>
            <div className="flex items-center border border-[#172554] bg-white">
              <button
                type="button"
                onClick={decrementCount}
                disabled={estimatedMarks || numericCount <= minimumCount}
                aria-label={`Decrease number of ${accessibleItemLabel.toLowerCase()} items in ${caName}`}
                className="flex h-11 w-10 items-center justify-center text-[#172554] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border-r border-slate-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                id={`count-${category}-${caName}`}
                type="number"
                min={minimumCount}
                max={maximumCount}
                value={count === '' || count === undefined ? '' : count}
                placeholder="0"
                disabled={estimatedMarks}
                onChange={handleCountInputChange}
                className="h-11 w-14 text-center text-base font-bold bg-white text-[#172554] focus:outline-hidden disabled:bg-blue-50 disabled:text-[#1e3a8a]"
              />
              <button
                type="button"
                onClick={incrementCount}
                disabled={estimatedMarks || numericCount >= maximumCount}
                aria-label={`Increase number of ${accessibleItemLabel.toLowerCase()} items in ${caName}`}
                className="flex h-11 w-10 items-center justify-center text-[#172554] hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors border-l border-slate-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Entries: Separated only by simple vertical lines with no horizontal borders */}
        {numericCount === 0 ? (
          <div className="py-3 text-center text-[#172554] text-xs my-1">
            <p className="font-medium text-slate-600">
              Set the number of {category === 'assignment' ? 'assignments' : 'lab practical evaluations'} above
            </p>
          </div>
        ) : (
          <div className="my-3 bg-white">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {Array.from({ length: numericCount }).map((_, idx) => {
                const displayIndex = startIndex + idx;
                const rawScore = scores[idx];
                const displayVal = rawScore === undefined || rawScore === null ? '' : rawScore;

                return (
                  <div
                    key={idx}
                    className="min-w-0 p-2 sm:p-2.5 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-[11px] sm:text-xs font-bold text-[#172554] mb-1.5 whitespace-nowrap">
                      {accessibleItemLabel === 'Assignment' || accessibleItemLabel === 'Lab Evaluation'
                        ? category === 'assignment' ? `Assignment ${displayIndex}` : `Lab ${displayIndex}`
                        : `${accessibleItemLabel} ${displayIndex}`}
                    </span>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      <button
                        type="button"
                        onClick={() => adjustBoxScore(idx, -0.5)}
                        disabled={estimatedMarks || Number(displayVal || 0) <= 0}
                        aria-label={`Decrease ${category === 'assignment' ? 'assignment' : 'lab'} ${displayIndex} mark by 0.5`}
                        className="flex h-8 w-7 sm:h-9 sm:w-8 items-center justify-center border border-slate-300 text-sm sm:text-base font-black text-[#172554] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={0}
                        max={maxMarkPerBox}
                        step={0.5}
                        value={displayVal}
                        placeholder="0"
                        readOnly={estimatedMarks}
                        onChange={(e) => handleBoxChange(idx, e.target.value)}
                        aria-label={`${accessibleItemLabel} ${displayIndex} mark out of ${maxMarkPerBox}`}
                        className="h-8 w-10 sm:h-9 sm:w-14 px-1 text-xs sm:text-sm font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] text-center read-only:bg-blue-50 read-only:text-[#1e3a8a]"
                      />
                      <button
                        type="button"
                        onClick={() => adjustBoxScore(idx, 0.5)}
                        disabled={estimatedMarks || Number(displayVal || 0) >= maxMarkPerBox}
                        aria-label={`Increase ${category === 'assignment' ? 'assignment' : 'lab'} ${displayIndex} mark by 0.5`}
                        className="flex h-8 w-7 sm:h-9 sm:w-8 items-center justify-center border border-slate-300 text-sm sm:text-base font-black text-[#172554] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                      <span className="text-[10px] sm:text-xs font-bold text-[#1e3a8a]">/{maxMarkPerBox}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Marks Contributed for Total at bottom: NO horizontal line and NO rectangular box */}
      <div className="mt-3 pt-2.5 space-y-1 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-[#172554]">
          <span className="font-medium">Total Marks Obtained:</span>
          <span className="font-bold">
            {sum} / {maxPossibleSum}
          </span>
        </div>

        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-[#172554] pt-1">
          <span className="min-w-0 text-xs font-bold uppercase tracking-wider">
            {estimatedMarks ? 'MARKS CONTRIBUTED (ESTIMATE):' : 'MARKS CONTRIBUTED:'}
          </span>
          <div className="flex shrink-0 items-baseline gap-1">
            <span className="text-lg font-black tabular-nums">
              {calculatedPoints.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-[#1e3a8a]">/ {weight}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

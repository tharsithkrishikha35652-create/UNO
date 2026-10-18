import React from 'react';
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
  const currentMax = allowCustomTestMax
    ? Math.max(1, Number(testMax) || 50)
    : (Number(testMax) === 30 ? 30 : 50);

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 mb-8 shadow-xs transition-colors">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 bg-[#172554] dark:bg-slate-950 text-white border-b border-[#172554] dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-white text-[#172554] font-black text-xs uppercase tracking-wider font-mono">
            CA {number}
          </span>
          <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase">{title}</h3>
        </div>

        {/* Subtotal without enclosing rectangular border box */}
        <div className="flex items-baseline gap-2 self-start sm:self-auto text-white">
          <span className="text-[11px] uppercase font-bold tracking-widest text-slate-300">
            MARKS:
          </span>
          <span className="text-lg font-black font-mono tabular-nums">
            {subtotal.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-slate-300">
              / {caMax.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      {/* Categories separated by simple vertical formal navy line */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800">
        {/* Category 1: Written Examination (weight depends on course type) */}
        <div className={`${hasLab ? 'lg:col-span-4' : 'lg:col-span-6'} p-4 sm:p-5 flex flex-col justify-between bg-white dark:bg-slate-900`}>
          <div>
            {/* Header - no horizontal underline */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 dark:bg-blue-950/50 text-[#172554] dark:text-blue-300 border border-blue-100 dark:border-blue-900 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#172554] dark:text-blue-200 uppercase tracking-wide">
                    CA Test {number}
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    Weightage: <span className="font-bold text-[#1e3a8a] dark:text-blue-400">{testWeight}%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Maximum Test Marks */}
            {allowCustomTestMax ? (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor={`test-max-input-${number}`}
                    className="text-xs font-bold text-[#172554] uppercase tracking-wider"
                  >
                    Maximum Test Marks:
                  </label>
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1">
                    {[20, 25, 30, 50].map((presetVal) => (
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
                    placeholder="Enter maximum marks - e.g. 25, 30, 50"
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (raw === '') {
                        onTestMaxChange('');
                        return;
                      }
                      const val = parseFloat(raw);
                      onTestMaxChange(isNaN(val) ? '' : Math.max(1, val));
                    }}
                    className="w-full px-3 py-2 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] font-semibold text-slate-500">
                    Max Scale
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  Enter maximum marks or select a preset
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Maximum Test Marks:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[50, 30].map((val) => {
                    const isSelected = currentMax === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onTestMaxChange(val)}
                        className={`py-2 px-3 text-xs font-bold border transition-all text-center cursor-pointer shadow-2xs ${
                          isSelected
                            ? 'bg-[#172554] dark:bg-blue-600 text-white border-[#172554] dark:border-blue-600'
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-[#172554] dark:text-slate-200 border-slate-300 dark:border-slate-700'
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
            <div className="mb-4">
              <label
                htmlFor={`test-scored-${number}`}
                className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
              >
                Marks Scored in Test:
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
                  className="w-full px-3 py-2 text-base font-bold font-mono text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm tabular-nums shadow-2xs"
                />
                <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400 dark:text-slate-500">
                  / {currentMax}
                </span>
              </div>
            </div>
          </div>

          {/* Marks Contributed for Total at bottom of Category 1 */}
          <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-baseline justify-between text-slate-700 dark:text-slate-300">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#172554] dark:text-blue-300">
                MARKS CONTRIBUTED:
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black font-mono tabular-nums text-[#172554] dark:text-white">
                  {testPoints.toFixed(2)}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  / {testWeight}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Category 2: Assignments / Activities (weight depends on course type) */}
        <div className={`${hasLab ? 'lg:col-span-4' : 'lg:col-span-6'} bg-white dark:bg-slate-900`}>
          <DynamicScoreBoxes
            title={hasLab ? 'Assignments' : 'Activities'}
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
          />
        </div>

        {/* Category 3: Lab Practical Evaluations (only for courses with a lab component) */}
        {hasLab && (
        <div className="lg:col-span-4 bg-white dark:bg-slate-900">
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
    </section>
  );
};

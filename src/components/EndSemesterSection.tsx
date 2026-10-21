import React from 'react';
import { GraduationCap, Target, FlaskConical, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { GRADE_SCALE } from '../calculatorUtils';
import { CourseType } from '../types';

interface EndSemesterSectionProps {
  courseType?: CourseType;
  ese: number | string;
  onEseChange: (val: number | string) => void;
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
  internalMax?: number;
  estimatedLabMark?: boolean;
}

export const EndSemesterSection: React.FC<EndSemesterSectionProps> = ({
  courseType,
  ese,
  onEseChange,
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
  internalMax = 50,
  estimatedLabMark = false,
}) => {
  const eseWeight = eseTheoryWeight + eseLabWeight;
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
    onEseChange(isNaN(val) ? '' : Math.max(0, Math.min(100, val)));
  };

  const handleLabMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onEseLabMaxChange) return;
    const raw = e.target.value;
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

  const numericEse = ese === '' || ese === undefined ? 0 : Number(ese) || 0;
  const numericLabMax = Math.max(1, eseLabMax === '' || eseLabMax === undefined ? 100 : Number(eseLabMax) || 100);
  const numericLab = eseLab === '' || eseLab === undefined ? 0 : Number(eseLab) || 0;

  return (
    <section className="overflow-hidden rounded-lg bg-white border border-slate-300 mb-8 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-5 bg-[#172554] text-white">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-white text-[#172554] font-black text-sm uppercase">
            ESE
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-wide">
              End Semester Examination
            </h3>
            {isSplit && (
              <span className="text-[11px] font-semibold text-amber-200">
                Split Weightage: Theory {eseTheoryWeight}% + Lab Practicals {eseLabWeight}%
              </span>
            )}
          </div>
        </div>

        {/* Subtotal */}
        <div className="flex items-baseline gap-2 self-start sm:self-auto text-white">
          <span className="text-xs uppercase font-bold tracking-wider text-slate-200">
            MARKS CONTRIBUTED:
          </span>
          <span className="text-lg font-black tabular-nums">
            {esePoints.toFixed(2)}{' '}
            <span className="text-xs font-semibold text-slate-300">/ {eseWeight.toFixed(2)}</span>
          </span>
        </div>
      </div>

      {isSplit || isPracticalOnly ? (
        /* --- Split layout: Theory + Practical + Simulator, or Practical + Simulator when the ESE is practical-only --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Column 1: ESE Theory (only when the course has a theory exam) */}
          {hasTheory && (
          <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-50 text-[#172554] border border-blue-100 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">
                    ESE Theory Exam
                  </h4>
                  <span className="text-[11px] font-bold text-[#1e3a8a]">
                    Weightage: {eseTheoryWeight}%
                  </span>
                </div>
              </div>

              <label
                htmlFor="ese-theory-input"
                className="block text-xs font-bold text-[#172554] uppercase tracking-wider mb-1.5"
              >
                Theory Marks Scored:
              </label>
              <div className="relative mb-3">
                <input
                  id="ese-theory-input"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={ese === '' || ese === undefined ? '' : ese}
                  placeholder="Enter theory marks (0 - 100)"
                  onChange={handleEseChange}
                  className="w-full px-3 py-2 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#1e3a8a]">/ 100</span>
              </div>

              {/* Theory Slider */}
              <div className="pt-1 mb-4">
                <div className="flex justify-between text-xs font-bold text-[#172554] mb-1">
                  <span>0</span>
                  <span className="sr-only">Adjust theory marks</span>
                  <span>100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={numericEse}
                  onChange={(e) => onEseChange(parseFloat(e.target.value))}
                  aria-label="Adjust ESE Theory Marks slider"
                  className="w-full accent-[#172554] cursor-pointer"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-xs font-bold uppercase tracking-wider">
                  MARKS CONTRIBUTED:
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums">
                    {eseTheoryPoints.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#1e3a8a]">/ {eseTheoryWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Column 2: ESE Lab / Practical exam with User Input Max Marks */}
          <div className={`${hasTheory ? 'lg:col-span-4' : 'lg:col-span-6'} p-4 sm:p-5 flex flex-col justify-between bg-white`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-50 text-[#172554] border border-blue-100 shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">
                    {isPracticalOnly || courseType === 'self-development' ? 'ESE Practical Exam' : 'ESE Lab Exam'}
                  </h4>
                  <span className="text-[11px] font-bold text-[#1e3a8a]">
                    Weightage: {eseLabWeight}%
                  </span>
                </div>
              </div>

              {/* Configurable Max Marks for ESE Lab */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="ese-lab-max-input"
                    className="text-xs font-bold text-[#172554] uppercase tracking-wider"
                  >
                    Max Marks for ESE {labName}:
                  </label>
                  {/* Preset quick buttons */}
                  <div className="flex items-center gap-1">
                    {[50, 75, 100].map((presetVal) => (
                      <button
                        key={presetVal}
                        type="button"
                        onClick={() => onEseLabMaxChange && onEseLabMaxChange(presetVal)}
                        className={`text-[10px] font-bold px-1.5 py-0.5 border cursor-pointer transition-colors ${
                          Number(eseLabMax) === presetVal
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
                    id="ese-lab-max-input"
                    type="number"
                    min={1}
                    step={1}
                    value={eseLabMax === '' || eseLabMax === undefined ? '' : eseLabMax}
                    placeholder="Enter maximum marks (e.g. 100 or 50)"
                    onChange={handleLabMaxChange}
                    className="w-full px-3 py-1.5 text-sm font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal"
                  />
                  <span className="absolute right-3 top-2 text-[11px] font-semibold text-slate-500">
                    Max Scale
                  </span>
                </div>
              </div>

              {/* Lab Marks Scored Input */}
              <label
                htmlFor="ese-lab-input"
                className="block text-xs font-bold text-[#172554] uppercase tracking-wider mb-1.5"
              >
                {labName} Marks Scored:
              </label>
              <div className="relative mb-3">
                <input
                  id="ese-lab-input"
                  type="number"
                  min={0}
                  max={numericLabMax}
                  step={0.5}
                  value={eseLab === '' || eseLab === undefined ? '' : eseLab}
                  placeholder={`Enter ${labName.toLowerCase()} marks (0 - ${numericLabMax})`}
                  readOnly={estimatedLabMark}
                  onChange={handleLabChange}
                  className="w-full px-3 py-2 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm read-only:bg-blue-50 read-only:text-[#1e3a8a]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#1e3a8a]">
                  / {numericLabMax}
                </span>
              </div>

              {/* Lab Slider */}
              <div className="pt-1 mb-4">
                <div className="flex justify-between text-xs font-bold text-[#172554] mb-1">
                  <span>0</span>
                  <span className="uppercase text-[11px] text-[#1e3a8a]">Adjust Lab Slider</span>
                  <span>{numericLabMax}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={numericLabMax}
                  step={1}
                  value={Math.min(numericLabMax, numericLab)}
                  disabled={estimatedLabMark}
                  onChange={(e) => onEseLabChange && onEseLabChange(parseFloat(e.target.value))}
                  aria-label="Adjust ESE Lab Marks slider"
                  className="w-full accent-[#172554] cursor-pointer"
                />
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {estimatedLabMark ? 'MARKS CONTRIBUTED (ESTIMATE):' : 'MARKS CONTRIBUTED:'}
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums">
                    {eseLabPoints.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#1e3a8a]">/ {eseLabWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Simulator & Combined ESE Breakdown */}
          <div className={`${hasTheory ? 'lg:col-span-4' : 'lg:col-span-6'} p-4 sm:p-5 bg-white flex flex-col justify-between`}>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554]">
                <div className="p-1.5 bg-[#172554] text-white shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">
                    Target Grade Simulator
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {isPracticalOnly ? `ESE Requirement` : `Combined ESE Requirement`}
                  </span>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-[#172554] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>

              <div className="mt-3 border border-[#172554] divide-y divide-[#172554] text-xs font-medium mb-3">
                {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                  const neededTotalEse = Math.max(0, g.minScore - internalTotal);
                  const isAlreadySecured = internalTotal >= g.minScore;
                  const isImpossible = neededTotalEse > eseWeight;

                  // Theory course: needed from Theory assuming current practical marks.
                  // Practical-only course: needed from the practical exam itself.
                  const approxScale = hasTheory ? 100 : numericLabMax;
                  const approxName = hasTheory ? 'Theory' : 'Practical';
                  const approxNeeded = hasTheory
                    ? Math.ceil((Math.max(0, neededTotalEse - eseLabPoints) / eseTheoryWeight) * 100)
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
                          <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 border border-[#172554] text-[10px]">
                            Secured
                          </span>
                        ) : isImpossible ? (
                          <span className="text-rose-700 font-bold text-[10px]">
                            Needs &gt;{eseWeight} in ESE
                          </span>
                        ) : (
                          <span className="text-[#172554] font-bold text-[11px]">
                            Need <strong className="text-[#1e3a8a]">{neededTotalEse.toFixed(1)}</strong>/{eseWeight} in ESE
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

            {/* Combined ESE Footer Card */}
            <div className="p-3 bg-slate-50 border border-[#172554] text-xs space-y-1">
              <div className="flex justify-between text-[#172554] font-medium">
                <span>
                  {isPracticalOnly
                    ? `Practical: ${eseLabPoints.toFixed(2)} / ${eseLabWeight}`
                    : `Theory: ${eseTheoryPoints.toFixed(2)} / ${eseTheoryWeight} + Lab: ${eseLabPoints.toFixed(2)} / ${eseLabWeight}`}
                </span>
                <span className="font-bold tabular-nums">{esePoints.toFixed(2)} / {eseWeight}M</span>
              </div>
              <div className="flex justify-between text-[#172554] font-medium pt-1 border-t border-slate-300">
                <span>Internal CA Secured:</span>
                <span className="font-bold tabular-nums">{internalTotal.toFixed(2)} / {internalMax}M</span>
              </div>
              <div className="flex justify-between text-[#172554] font-black pt-1 border-t border-[#172554]">
                <span>Total Course Mark:</span>
                <span className="text-sm tabular-nums">{(internalTotal + esePoints).toFixed(2)} / 100M</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- Theory-only ESE: Standard 2-Column Layout (Theory + Target Simulator) --- */
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#172554]">
          {/* Main ESE Input Section */}
          <div className="md:col-span-6 p-4 sm:p-5 flex flex-col justify-between bg-white">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-[#172554] text-white shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">
                  End Semester Marks Scored
                </h4>
                <span className="text-xs font-semibold text-[#1e3a8a] ml-auto">
                  Weightage: {eseTheoryWeight}%
                </span>
              </div>

              <label
                htmlFor="ese-marks-input"
                className="block text-xs font-bold text-[#172554] uppercase tracking-wider mb-1.5"
              >
                Marks Scored:
              </label>
              <div className="relative mb-4">
                <input
                  id="ese-marks-input"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  value={ese === '' || ese === undefined ? '' : ese}
                  placeholder="Enter your ESE marks (0 - 100)"
                  onChange={handleEseChange}
                  className="w-full px-3 py-2 text-base font-bold text-[#172554] bg-white border border-[#172554] focus:outline-hidden focus:ring-1 focus:ring-[#172554] placeholder:text-slate-400 placeholder:font-normal placeholder:text-sm"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-[#1e3a8a]">/ 100</span>
              </div>

              {/* Slider */}
              <div className="pt-2 mb-4">
                <div className="flex justify-between text-xs font-bold text-[#172554] mb-1">
                  <span>0</span>
                  <span className="sr-only">Adjust end-semester marks</span>
                  <span>100</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={numericEse}
                  onChange={(e) => onEseChange(parseFloat(e.target.value))}
                  aria-label="Adjust End Semester Marks slider"
                  className="w-full accent-[#172554] cursor-pointer"
                />
              </div>
            </div>

            {/* Marks Contributed for Total at bottom */}
            <div className="pt-1">
              <div className="flex items-baseline justify-between text-[#172554]">
                <span className="text-xs font-bold uppercase tracking-wider">
                  MARKS CONTRIBUTED:
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black tabular-nums">
                    {esePoints.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-[#1e3a8a]">/ {eseTheoryWeight.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Target Grade "What-If" Planner */}
          <div className="md:col-span-6 p-4 sm:p-5 bg-white flex flex-col justify-between">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 py-1 focus-visible:outline-2 focus-visible:outline-[#172554]">
                <div className="p-1.5 bg-[#172554] text-white shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#172554] uppercase tracking-wide">
                  Target Grade Simulator
                </h4>
                <ChevronDown className="ml-auto h-4 w-4 shrink-0 text-[#172554] transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>

              <div className="mt-3 border border-[#172554] divide-y divide-[#172554] text-xs font-medium">
                {GRADE_SCALE.filter((g) => g.letter !== 'U').map((g) => {
                  const neededEse = Math.max(0, Math.ceil(((g.minScore - internalTotal) / eseTheoryWeight) * 100));
                  const isAlreadySecured = internalTotal >= g.minScore;
                  const isImpossible = neededEse > 100;

                  return (
                    <div
                      key={g.letter}
                      className="flex items-center justify-between p-2 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-8 font-black text-sm text-[#172554]">{g.letter}</span>
                        <span className="text-[#172554] font-semibold">{g.minScore}+ marks</span>
                      </div>

                      <div className="text-right">
                        {isAlreadySecured ? (
                          <span className="text-[#172554] font-bold bg-slate-200 px-1.5 py-0.5 border border-[#172554] text-[11px]">
                            Already Secured
                          </span>
                        ) : isImpossible ? (
                          <span className="text-rose-700 font-bold text-[11px]">
                            Needs &gt;100 - Unattainable
                          </span>
                        ) : (
                          <span className="text-[#172554] font-bold">
                            Need <span className="underline decoration-2 text-[#1e3a8a]">{neededEse}</span> / 100 in ESE
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
    </section>
  );
};

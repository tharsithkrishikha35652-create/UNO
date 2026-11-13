import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { motionVariants } from '../motion';
import { DynamicScoreBoxes } from './DynamicScoreBoxes';
import { FileCheck, Pencil, X, ChevronDown, FileText, FlaskConical, Info } from 'lucide-react';

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
  actMaxPerBox?: number | string;
  onActMaxPerBoxChange?: (max: number | string) => void;
  actStartIndex: number;

  labNo: number | string;
  onLabNoChange: (val: number | string) => void;
  labScores: (number | string)[];
  onLabScoresChange: (scores: (number | string)[]) => void;
  labPoints: number;
  labWeight?: number;
  labMaxPerBox?: number | string;
  onLabMaxPerBoxChange?: (max: number | string) => void;
  labStartIndex: number;

  estimatedMarks?: boolean;
  estimatePercentage?: number;
  onUncheckEstimate?: () => void;
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
  actMaxPerBox = 10,
  onActMaxPerBoxChange,
  actStartIndex,
  labNo,
  onLabNoChange,
  labScores,
  onLabScoresChange,
  labPoints,
  labWeight = 7.5,
  labMaxPerBox = 10,
  onLabMaxPerBoxChange,
  labStartIndex,
  estimatedMarks = false,
  estimatePercentage = 80,
  onUncheckEstimate,
}) => {
  const hasLab = labWeight > 0;
  const hasActivities = actWeight > 0;
  const testColumnClass = hasLab ? 'lg:col-span-4' : hasActivities ? 'lg:col-span-6' : 'lg:col-span-12';
  const reduceMotion = useReducedMotion();

  // Current maximum marks: accepts any positive configured value, defaults to 50
  const currentMax = Math.max(1, Number(testMax) || 50);

  // Collapsible dropdown states when estimatedMarks checkbox is selected
  // Starts minimized/collapsed when the estimated tick box is ticked
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);
  const [isLabOpen, setIsLabOpen] = useState(false);

  // When estimated checkbox toggles, ensure dropdowns start in minimized/collapsed state
  useEffect(() => {
    if (estimatedMarks) {
      setIsActivitiesOpen(false);
      setIsLabOpen(false);
    }
  }, [estimatedMarks]);

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

  const renderTestCategory = (wrapperClassName: string, innerClassName: string = "p-3") => (
    <div className={wrapperClassName}>
      <div className={innerClassName}>
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

            <div className="relative max-w-md">
              <input
                id={`test-scored-${number}`}
                data-tour={number === 1 ? "marks-entry" : undefined}
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
                  id={`tour-test-max-pencil-${number}`}
                  data-tour="test-max-pencil"
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
                    id={`tour-test-max-editor-${number}`}
                    data-tour="test-max-editor"
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
                        id={`tour-test-max-cancel-${number}`}
                        data-tour="test-max-cancel"
                        onClick={handleCancelMax}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                        aria-label="Cancel editing maximum marks"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id={`tour-test-max-input-${number}`}
                        data-tour="test-max-input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        step={1}
                        value={tempMax}
                        readOnly={typeof document !== 'undefined' && document.body.hasAttribute('data-tour-active')}
                        onChange={(e) => {
                          if (typeof document !== 'undefined' && document.body.hasAttribute('data-tour-active')) return;
                          setTempMax(e.target.value);
                          setMaxError(null);
                        }}
                        placeholder="e.g. 25, 30, 50"
                        className="h-9 w-full px-2.5 text-sm font-bold border border-[#172554] dark:border-slate-600 rounded-lg bg-white dark:bg-[#161618] text-[#172554] dark:text-[#f1f1f3] focus:outline-hidden font-numeric tabular-nums"
                        autoFocus={!(typeof document !== 'undefined' && document.body.hasAttribute('data-tour-active'))}
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
        <div className="mt-4 pt-1 border-t border-slate-100 dark:border-slate-800 max-w-md">
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
  );

  return (
    <motion.section
      layout
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
      <AnimatePresence mode="wait" initial={false}>
        {estimatedMarks ? (
          <motion.div
            key="ca-estimated-dropdowns-view"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-[#202024]"
          >
            {/* Category 1: Written Examination (Clean Top Section) */}
            {renderTestCategory("p-1 sm:p-2 bg-white dark:bg-[#202024]")}

            {/* Category 2: Assignments / Activities - Collapsible Dropdown */}
            {hasActivities && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
                  aria-expanded={isActivitiesOpen}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:px-4 text-left transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                    isActivitiesOpen
                      ? 'bg-slate-100/90 dark:bg-slate-800/60 text-[#172554] dark:text-[#f1f1f3]'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 text-[#172554] dark:text-[#f1f1f3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 text-slate-500 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold truncate text-[#172554] dark:text-[#f1f1f3]">
                      {activityTitle ?? 'Assignments / Activities'}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 font-numeric tabular-nums">
                      {estimatePercentage}% estimate
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="inline-flex items-baseline gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-700 text-[#172554] dark:text-[#f1f1f3]">
                      <span className="font-numeric tabular-nums font-black text-xs sm:text-sm text-[#172554] dark:text-[#f1f1f3]">
                        {actPoints.toFixed(2)}
                      </span>
                      <span className="font-numeric tabular-nums text-[11px] font-bold text-[#d97757] dark:text-[#d97757]">
                        / {actWeight}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ease-out text-slate-400 dark:text-slate-500 ${
                        isActivitiesOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isActivitiesOpen && (
                    <motion.div
                      key="ca-activities-dropdown"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#202024]"
                    >
                      <div className="p-2.5 sm:p-3">
                        {/* Notice banner for editing in estimated mode */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 mb-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                          <div className="flex items-center gap-2 min-w-0">
                            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>
                              Want to edit marks? Uncheck the <strong>"Include estimated lab &amp; activity average"</strong> box above.
                            </span>
                          </div>
                          {onUncheckEstimate && (
                            <button
                              type="button"
                              onClick={onUncheckEstimate}
                              className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-bold bg-[#172554] hover:bg-[#1e3a8a] text-white rounded-md shrink-0 transition-colors cursor-pointer"
                            >
                              Uncheck Box
                            </button>
                          )}
                        </div>

                        <DynamicScoreBoxes
                          title={activityTitle ?? 'Assignments / Activities'}
                          category="assignment"
                          count={actNo}
                          onCountChange={onActNoChange}
                          scores={actScores}
                          onScoresChange={onActScoresChange}
                          startIndex={actStartIndex}
                          maxMarkPerBox={actMaxPerBox}
                          onMaxMarkPerBoxChange={onActMaxPerBoxChange}
                          weight={actWeight}
                          calculatedPoints={actPoints}
                          caName={`CA ${number}`}
                          estimatedMarks={estimatedMarks}
                          minimumCount={minimumActivityCount}
                          maximumCount={maximumActivityCount}
                          scoreLabel={activityScoreLabel}
                          estimatePercentage={estimatePercentage}
                          onUncheckEstimate={onUncheckEstimate}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Category 3: Laboratory Practical - Collapsible Dropdown */}
            {hasLab && (
              <div className="border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsLabOpen(!isLabOpen)}
                  aria-expanded={isLabOpen}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 sm:px-4 text-left transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#172554] ${
                    isLabOpen
                      ? 'bg-slate-100/90 dark:bg-slate-800/60 text-[#172554] dark:text-[#f1f1f3]'
                      : 'bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 text-[#172554] dark:text-[#f1f1f3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="shrink-0 text-slate-500 dark:text-slate-400">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold truncate text-[#172554] dark:text-[#f1f1f3]">
                      {_isSelfDevelopment ? 'Lab' : 'Lab Practicals'}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 font-numeric tabular-nums">
                      {estimatePercentage}% estimate
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="inline-flex items-baseline gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-700 text-[#172554] dark:text-[#f1f1f3]">
                      <span className="font-numeric tabular-nums font-black text-xs sm:text-sm text-[#172554] dark:text-[#f1f1f3]">
                        {labPoints.toFixed(2)}
                      </span>
                      <span className="font-numeric tabular-nums text-[11px] font-bold text-[#d97757] dark:text-[#d97757]">
                        / {labWeight}
                      </span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ease-out text-slate-400 dark:text-slate-500 ${
                        isLabOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isLabOpen && (
                    <motion.div
                      key="ca-lab-dropdown"
                      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-[#202024]"
                    >
                      <div className="p-2.5 sm:p-3">
                        {/* Notice banner for editing in estimated mode */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 mb-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                          <div className="flex items-center gap-2 min-w-0">
                            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                            <span>
                              Want to edit marks? Uncheck the <strong>"Include estimated lab &amp; activity average"</strong> box above.
                            </span>
                          </div>
                          {onUncheckEstimate && (
                            <button
                              type="button"
                              onClick={onUncheckEstimate}
                              className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-bold bg-[#172554] hover:bg-[#1e3a8a] text-white rounded-md shrink-0 transition-colors cursor-pointer"
                            >
                              Uncheck Box
                            </button>
                          )}
                        </div>

                        <DynamicScoreBoxes
                          title="Lab Practical Evaluation"
                          category="lab"
                          count={labNo}
                          onCountChange={onLabNoChange}
                          scores={labScores}
                          onScoresChange={onLabScoresChange}
                          startIndex={labStartIndex}
                          maxMarkPerBox={labMaxPerBox}
                          onMaxMarkPerBoxChange={onLabMaxPerBoxChange}
                          weight={labWeight}
                          calculatedPoints={labPoints}
                          caName={`CA ${number}`}
                          estimatedMarks={estimatedMarks}
                          estimatePercentage={estimatePercentage}
                          onUncheckEstimate={onUncheckEstimate}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="ca-standard-grid-view"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-700"
          >
            {renderTestCategory(`${testColumnClass} p-2.5 sm:p-3 flex flex-col justify-between bg-white dark:bg-[#202024]`)}

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
                  maxMarkPerBox={actMaxPerBox}
                  onMaxMarkPerBoxChange={onActMaxPerBoxChange}
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
                  maxMarkPerBox={labMaxPerBox}
                  onMaxMarkPerBoxChange={onLabMaxPerBoxChange}
                  weight={labWeight}
                  calculatedPoints={labPoints}
                  caName={`CA ${number}`}
                  estimatedMarks={estimatedMarks}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

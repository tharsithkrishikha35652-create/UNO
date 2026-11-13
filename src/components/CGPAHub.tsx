import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChartColumnIncreasing,
  Check,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { GPA_COURSES, getGpaCourses } from "../gpaCourses";
import { AnimatedNumber } from "./AnimatedNumber";
import { motionVariants } from "../motion";

interface SemesterResultInput {
  gpa: string;
  uhvGradePoint: string;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export interface CGPAHubProps {
  department?: string;
}

const ROMAN_SEMESTERS: Record<number, string> = {
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
};

const getUhvSemester = (department?: string): number => {
  if (department === 'MFG' || department === 'MANUFACTURING') return 1;
  if (department === 'MECH' || department === 'MECHANICAL') return 6;
  if (department === 'CIVIL' || department === 'CE') return 4;
  if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') return 4;
  if (department === 'PT' || department === 'PRINTING' || department === 'PPT') return 4;
  if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') return 4;
  if (department === 'MSE' || department === 'MATSCI' || department === 'MS') return 4;
  if (department === 'IE' || department === 'INDUSTRIAL') return 3;
  return 3;
};

const getUhvSemTotalCredits = (department?: string): number => {
  if (department === 'MFG' || department === 'MANUFACTURING') return 25;
  if (department === 'MECH' || department === 'MECHANICAL') return 21;
  if (department === 'CIVIL' || department === 'CE') return 26;
  if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') return 23;
  if (department === 'ECE') return 22;
  if (department === 'GEO' || department === 'GI' || department === 'GEOINFORMATICS') return 24;
  if (department === 'IT' || department === 'INFORMATION_TECHNOLOGY' || department === 'INFOTECH') return 21;
  if (department === 'EEE' || department === 'ELECTRICAL') return 24;
  if (department === 'VLSI' || department === 'ELECTRONICS_VLSI') return 23;
  if (department === 'PT' || department === 'PRINTING' || department === 'PPT') return 25;
  if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') return 26;
  if (department === 'MSE' || department === 'MATSCI' || department === 'MS') return 27;
  if (department === 'IE' || department === 'INDUSTRIAL') return 23;
  return 27;
};

const getUhvSemCgpaCredits = (department?: string): number => {
  if (department === 'MFG' || department === 'MANUFACTURING') return 23;
  if (department === 'MECH' || department === 'MECHANICAL') return 19;
  if (department === 'CIVIL' || department === 'CE') return 24;
  if (department === 'BME' || department === 'BM' || department === 'BIOMEDICAL') return 21;
  if (department === 'ECE') return 20;
  if (department === 'GEO' || department === 'GI' || department === 'GEOINFORMATICS') return 22;
  if (department === 'IT' || department === 'INFORMATION_TECHNOLOGY' || department === 'INFOTECH') return 19;
  if (department === 'EEE' || department === 'ELECTRICAL') return 22;
  if (department === 'VLSI' || department === 'ELECTRONICS_VLSI') return 21;
  if (department === 'PT' || department === 'PRINTING' || department === 'PPT') return 23;
  if (department === 'MINING' || department === 'MINE' || department === 'MN' || department === 'MI') return 24;
  if (department === 'MSE' || department === 'MATSCI' || department === 'MS') return 25;
  if (department === 'IE' || department === 'INDUSTRIAL') return 21;
  return 25;
};

export const getSemesterFixedCredits = (
  semester: number,
  department?: string
): number => {
  const uhvSem = getUhvSemester(department);
  if (semester === uhvSem) {
    return getUhvSemCgpaCredits(department);
  }
  const courses = getGpaCourses(department);
  const semCourses = courses.filter((course) => course.semester === semester);
  const total = semCourses.reduce((sum, course) => sum + course.credits, 0);
  return total > 0 ? total : 21;
};

const getInitialSemesterInputs = (): Record<number, SemesterResultInput> => {
  return Object.fromEntries(
    SEMESTERS.map((semester) => [
      semester,
      {
        gpa: "",
        uhvGradePoint: "",
      },
    ])
  );
};

const exceedsMaximumGpa = (value: string): boolean =>
  value.trim() !== "" &&
  Number.isFinite(Number(value)) &&
  Number(value) > 10;

const cachedSemesterInputsByDept: Record<string, Record<number, SemesterResultInput>> = {};
let cachedSelectedSemester = 1;

export const CGPAHub: React.FC<CGPAHubProps> = ({ department }) => {
  const reduceMotion = useReducedMotion();
  const uhvSem = getUhvSemester(department);
  const uhvSemTotalCredits = getUhvSemTotalCredits(department);
  const uhvSemCgpaCredits = getUhvSemCgpaCredits(department);
  const [selectedSemester, setSelectedSemester] = useState<number>(() => cachedSelectedSemester);
  const [semesterInputs, setSemesterInputs] = useState(() => {
    const key = department || 'CSE';
    if (!cachedSemesterInputsByDept[key]) {
      cachedSemesterInputsByDept[key] = getInitialSemesterInputs();
    }
    return cachedSemesterInputsByDept[key];
  });

  const [showUhvHelp, setShowUhvHelp] = useState(false);
  const [isSemesterMenuOpen, setIsSemesterMenuOpen] = useState(false);
  const uhvHelpRef = useRef<HTMLDivElement>(null);
  const semesterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUhvHelp && !isSemesterMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowUhvHelp(false);
        setIsSemesterMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        uhvHelpRef.current &&
        !uhvHelpRef.current.contains(e.target as Node)
      ) {
        setShowUhvHelp(false);
      }
      if (
        semesterMenuRef.current &&
        !semesterMenuRef.current.contains(e.target as Node)
      ) {
        setIsSemesterMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showUhvHelp, isSemesterMenuOpen]);

  const completedSemesters = SEMESTERS.slice(0, selectedSemester);
  const validEntries = useMemo(
    () =>
      completedSemesters.map((semester) => {
        const gpa = Number(semesterInputs[semester]?.gpa);
        const credits = getSemesterFixedCredits(semester, department);
        const uhvGradePointValue = semesterInputs[semester]?.uhvGradePoint ?? "";
        const uhvGradePoint = Number(uhvGradePointValue);
        return {
          semester,
          gpa,
          credits,
          uhvGradePoint,
          valid:
            Boolean(semesterInputs[semester]?.gpa?.trim()) &&
            Number.isFinite(gpa) &&
            gpa >= 0 &&
            gpa <= 10 &&
            credits > 0 &&
            (semester !== uhvSem ||
              (uhvGradePointValue.trim() !== "" &&
                Number.isFinite(uhvGradePoint) &&
                uhvGradePoint >= 0 &&
                uhvGradePoint <= 10)),
        };
      }),
    [completedSemesters, semesterInputs, department, uhvSem]
  );

  const allInputsValid = validEntries.every((entry) => entry.valid);
  const totalCredits = validEntries.reduce(
    (total, entry) => total + (entry.valid ? entry.credits : 0),
    0
  );
  const weightedGradePoints = validEntries.reduce(
    (total, entry) =>
      total +
      (entry.valid
        ? entry.gpa *
            (entry.semester === uhvSem ? uhvSemTotalCredits : entry.credits) -
          (entry.semester === uhvSem ? 2 * entry.uhvGradePoint : 0)
        : 0),
    0
  );
  const cgpa =
    allInputsValid && totalCredits > 0
      ? weightedGradePoints / totalCredits
      : null;

  const updateInput = (
    semester: number,
    field: keyof SemesterResultInput,
    value: string
  ) => {
    setSemesterInputs((previous) => {
      const next = {
        ...previous,
        [semester]: { ...previous[semester], [field]: value },
      };
      cachedSemesterInputsByDept[department || 'CSE'] = next;
      return next;
    });
  };

  const getDropdownSemesterLabel = (sem: number): string =>
    sem === 8 ? "All Semesters (Semesters 1 – 8)" : `Semester ${sem}`;

  return (
    <section
      className="mx-auto max-w-3xl space-y-5"
      aria-labelledby="cgpa-hub-heading"
    >
      <header className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#172554] text-white">
            <ChartColumnIncreasing className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-500">
              Cumulative academic performance
            </p>
            <h1
              id="cgpa-hub-heading"
              className="text-xl font-black text-[#172554] sm:text-2xl"
            >
              CGPA Hub
            </h1>
          </div>
        </div>
      </header>

      <section
        className="rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-7"
        aria-label="CGPA inputs"
      >
        <div className="block max-w-sm">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">
            Calculate through semester
          </span>
          <div ref={semesterMenuRef} className="relative">
            <button
              type="button"
              aria-label="Calculate through semester"
              aria-haspopup="listbox"
              aria-expanded={isSemesterMenuOpen}
              onClick={() => setIsSemesterMenuOpen((open) => !open)}
              onKeyDown={(event) => {
                if (event.key === "Escape") setIsSemesterMenuOpen(false);
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  setIsSemesterMenuOpen(true);
                }
              }}
              className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[var(--app-divider)] bg-[var(--app-surface)] px-3.5 py-2.5 text-sm font-semibold text-[var(--app-primary-text)] shadow-xs transition-colors hover:border-[var(--app-action-accent)] focus:border-[var(--app-action-accent)] focus:outline-2 focus:outline-[var(--app-action-accent)] cursor-pointer"
            >
              <span>{getDropdownSemesterLabel(selectedSemester)}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform duration-300 ease-out ${
                  isSemesterMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {isSemesterMenuOpen && (
                <motion.div
                  key="cgpa-semester-dropdown"
                  initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformOrigin: "top" }}
                  role="listbox"
                  aria-label="Calculate through semester options"
                  className="absolute left-0 z-40 mt-1.5 w-full min-w-44 overflow-hidden rounded-xl border border-[var(--app-divider)] bg-[var(--app-surface)] p-1.5 shadow-lg ring-1 ring-black/5"
                >
                  {SEMESTERS.map((semester) => {
                    const isSelected = selectedSemester === semester;
                    return (
                      <button
                        key={semester}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedSemester(semester);
                          cachedSelectedSemester = semester;
                          setIsSemesterMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[var(--app-soft-accent)] text-[var(--app-action-accent-strong)] font-bold"
                            : "text-[var(--app-primary-text)] hover:bg-[var(--app-structural-accent)]/10 hover:text-[var(--app-action-accent-strong)]"
                        }`}
                      >
                        <span>{getDropdownSemesterLabel(semester)}</span>
                        {isSelected && (
                          <Check
                            className="h-3.5 w-3.5 text-[var(--app-action-accent-strong)]"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {completedSemesters.map((semester) => {
            const semCredits = getSemesterFixedCredits(semester, department);
            return (
              <div
                key={semester}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#202024] p-3.5 sm:p-4 space-y-2.5"
              >
                {/* Header line with Semester title and fixed Regulation Credits */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                      Semester {semester}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-[#161618] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-numeric tabular-nums">
                      {semCredits} credits
                      {semester === uhvSem && (
                        <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">(UHV excluded)</span>
                      )}
                    </span>
                    {semester === uhvSem && (
                      <div
                        className="relative inline-flex items-center"
                        ref={uhvHelpRef}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowUhvHelp((prev) => !prev);
                          }}
                          className="cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:text-[#172554] dark:hover:text-[#f1f1f3] focus:text-[#172554] focus:outline-hidden"
                          aria-label={`How Semester ${uhvSem} UHV credits and GPA work`}
                          aria-expanded={showUhvHelp}
                          aria-controls="uhv-help-popover"
                        >
                          <HelpCircle className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {showUhvHelp && (
                          <div
                            id="uhv-help-popover"
                            role="tooltip"
                            className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 z-40 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-300 bg-white p-3.5 shadow-xl text-xs text-slate-700 space-y-2 animate-[sticky-result-in_160ms_ease-out]"
                          >
                            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                              <p className="font-bold text-[#172554]">
                                Semester {ROMAN_SEMESTERS[uhvSem] || uhvSem} CGPA &amp; UHV
                              </p>
                              <button
                                type="button"
                                onClick={() => setShowUhvHelp(false)}
                                className="cursor-pointer px-1 text-xs font-bold text-slate-400 hover:text-slate-700"
                                aria-label="Close help"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="leading-relaxed text-[11px] font-semibold text-[#172554]">
                              UHV is included in GPA calculation, but excluded in
                              CGPA calculation.
                            </p>
                            <p className="leading-relaxed text-[11px] text-slate-600">
                              Semester {ROMAN_SEMESTERS[uhvSem] || uhvSem} is counted as{" "}
                              <strong><span className="font-numeric tabular-nums">{uhvSemCgpaCredits}</span> CGPA credits</strong>. Enter its GPA
                              including UHV and the UHV grade point; the hub
                              subtracts UHV’s two-credit contribution.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct GPA inputs without unnecessary credits box/padding */}
                <div className={semester === uhvSem ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {semester === uhvSem
                        ? "Semester GPA (including UHV)"
                        : "Semester GPA"}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.01}
                      inputMode="decimal"
                      aria-label={`Semester ${semester} GPA`}
                      aria-invalid={exceedsMaximumGpa(semesterInputs[semester]?.gpa ?? "")}
                      aria-describedby={
                        exceedsMaximumGpa(semesterInputs[semester]?.gpa ?? "")
                          ? `semester-${semester}-gpa-error`
                          : undefined
                      }
                      placeholder="0.00 – 10.00"
                      value={semesterInputs[semester]?.gpa ?? ""}
                      onChange={(event) =>
                        updateInput(semester, "gpa", event.currentTarget.value)
                      }
                      className="min-h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#161618] px-3 py-2 text-sm text-slate-900 dark:text-[#f1f1f3] font-numeric tabular-nums focus:border-[#172554] dark:focus:border-[#e08564] focus:outline-2 focus:outline-[#172554]"
                    />
                    {exceedsMaximumGpa(semesterInputs[semester]?.gpa ?? "") && (
                      <span
                        id={`semester-${semester}-gpa-error`}
                        className="mt-1 block text-xs font-semibold text-rose-700 dark:text-rose-400"
                        role="alert"
                      >
                        Please enter a valid GPA from 0 to 10.
                      </span>
                    )}
                  </label>

                  {semester === uhvSem && (
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                        UHV grade point to exclude (2 credits)
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={10}
                        step={0.01}
                        inputMode="decimal"
                        aria-label="Universal Human Values grade point to exclude"
                        placeholder="0.00 – 10.00"
                        value={semesterInputs[semester]?.uhvGradePoint ?? ""}
                        onChange={(event) =>
                          updateInput(
                            semester,
                            "uhvGradePoint",
                            event.currentTarget.value
                          )
                        }
                        className="min-h-11 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#161618] px-3 py-2 text-sm text-slate-900 dark:text-[#f1f1f3] font-numeric tabular-nums focus:border-[#172554] dark:focus:border-[#e08564] focus:outline-2 focus:outline-[#172554]"
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <AnimatePresence initial={false} mode="wait">
      {cgpa !== null && (
        <motion.section
          key="cgpa-result"
          className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-5 shadow-sm sm:p-7"
          aria-live="polite"
          aria-label="CGPA result"
          variants={reduceMotion ? undefined : motionVariants.card}
          initial={reduceMotion ? false : "initial"}
          animate="animate"
          exit="exit"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              {selectedSemester === 8
                ? "Cumulative GPA for All Semesters"
                : `Cumulative GPA through Semester ${selectedSemester}`}
            </p>
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 font-numeric tabular-nums">
              {totalCredits} total credits
            </span>
          </div>
          <AnimatedNumber value={cgpa} className="mt-1 text-4xl font-black text-[#172554] dark:text-[#f1f1f3] font-numeric tabular-nums" />
        </motion.section>
      )}
      </AnimatePresence>
    </section>
  );
};

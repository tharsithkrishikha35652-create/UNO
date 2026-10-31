import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ChartColumnIncreasing,
  Check,
  ChevronDown,
  HelpCircle,
} from "lucide-react";
import { GPA_COURSES, getGpaCourses } from "../gpaCourses";

interface SemesterResultInput {
  gpa: string;
  credits: string;
  uhvGradePoint: string;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export interface CGPAHubProps {
  department?: string;
}

const getInitialSemesterInputs = (
  department?: string
): Record<number, SemesterResultInput> => {
  const courses = getGpaCourses(department);
  const sem3Credits = department === "VLSI" ? 21 : department === "ECE" ? 20 : 25;
  return Object.fromEntries(
    SEMESTERS.map((semester) => [
      semester,
      {
        gpa: "",
        credits: String(
          semester === 3
            ? sem3Credits
            : courses
                .filter((course) => course.semester === semester)
                .reduce((total, course) => total + course.credits, 0)
        ),
        uhvGradePoint: "",
      },
    ])
  );
};

export const CGPAHub: React.FC<CGPAHubProps> = ({ department }) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [semesterInputs, setSemesterInputs] = useState(() =>
    getInitialSemesterInputs(department)
  );

  useEffect(() => {
    setSemesterInputs((prev) => {
      const defaults = getInitialSemesterInputs(department);
      const updated = { ...prev };
      for (const sem of SEMESTERS) {
        if (!updated[sem].gpa) {
          updated[sem] = { ...updated[sem], credits: defaults[sem].credits };
        }
      }
      return updated;
    });
  }, [department]);
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
        const gpa = Number(semesterInputs[semester].gpa);
        const credits = Number(semesterInputs[semester].credits);
        const uhvGradePointValue = semesterInputs[semester].uhvGradePoint ?? "";
        const uhvGradePoint = Number(uhvGradePointValue);
        return {
          semester,
          gpa,
          credits,
          uhvGradePoint,
          valid:
            semesterInputs[semester].gpa.trim() !== "" &&
            Number.isFinite(gpa) &&
            gpa >= 0 &&
            gpa <= 10 &&
            semesterInputs[semester].credits.trim() !== "" &&
            Number.isFinite(credits) &&
            credits > 0 &&
            (semester !== 3 ||
              (uhvGradePointValue.trim() !== "" &&
                Number.isFinite(uhvGradePoint) &&
                uhvGradePoint >= 0 &&
                uhvGradePoint <= 10)),
        };
      }),
    [completedSemesters, semesterInputs]
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
            (entry.semester === 3
              ? department === "VLSI"
                ? 23
                : department === "ECE"
                ? 22
                : 27
              : entry.credits) -
          (entry.semester === 3 ? 2 * entry.uhvGradePoint : 0)
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
    setSemesterInputs((previous) => ({
      ...previous,
      [semester]: { ...previous[semester], [field]: value },
    }));
  };

  return (
    <section
      className="mx-auto max-w-3xl space-y-5"
      aria-labelledby="cgpa-hub-heading"
    >
      <header className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#172554] text-white">
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
        className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7"
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
              <span>Semester {selectedSemester}</span>
              <ChevronDown
                className={`h-4 w-4 text-slate-500 transition-transform ${
                  isSemesterMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {isSemesterMenuOpen && (
              <div
                role="listbox"
                aria-label="Calculate through semester options"
                className="absolute left-0 z-40 mt-1.5 w-full min-w-44 overflow-hidden rounded-xl border border-[var(--app-divider)] bg-[var(--app-surface)] p-1.5 shadow-lg ring-1 ring-black/5 animate-[sticky-result-in_160ms_ease-out]"
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
                        setIsSemesterMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-[var(--app-soft-accent)] text-[var(--app-action-accent-strong)] font-bold"
                          : "text-[var(--app-primary-text)] hover:bg-[var(--app-structural-accent)]/10 hover:text-[var(--app-action-accent-strong)]"
                      }`}
                    >
                      <span>Semester {semester}</span>
                      {isSelected && (
                        <Check
                          className="h-3.5 w-3.5 text-[var(--app-action-accent-strong)]"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {completedSemesters.map((semester) => (
            <div
              key={semester}
              className="grid gap-3 border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_1fr_1fr] sm:items-end"
            >
              <h2 className="text-sm font-bold text-[#172554]">
                Semester {semester}
              </h2>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">
                  {semester === 3
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
                  placeholder="0.00 – 10.00"
                  value={semesterInputs[semester].gpa}
                  onChange={(event) =>
                    updateInput(semester, "gpa", event.currentTarget.value)
                  }
                  className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
                />
              </label>
              <div className="block">
                <div className="mb-1 flex items-center justify-between gap-1 text-xs font-semibold text-slate-600">
                  <label htmlFor={`semester-${semester}-credits`}>
                    {semester === 3
                      ? "Credits counted (UHV excluded)"
                      : "Credits counted"}
                  </label>
                  {semester === 3 && (
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
                        className="cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:text-[#172554] focus:text-[#172554] focus:outline-hidden"
                        aria-label="How Semester 3 UHV credits and GPA work"
                        aria-expanded={showUhvHelp}
                        aria-controls="uhv-help-popover"
                      >
                        <HelpCircle className="h-4 w-4" aria-hidden="true" />
                      </button>
                      {showUhvHelp && (
                        <div
                          id="uhv-help-popover"
                          role="tooltip"
                          className="absolute right-0 top-full mt-1.5 z-40 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-slate-300 bg-white p-3.5 shadow-xl text-xs text-slate-700 space-y-2 animate-[sticky-result-in_160ms_ease-out]"
                        >
                          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                            <p className="font-bold text-[#172554]">
                              Semester III CGPA &amp; UHV
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
                            Semester III is counted as{" "}
                            <strong>{department === "VLSI" ? "21" : department === "ECE" ? "20" : "25"} CGPA credits</strong>. Enter its GPA
                            including UHV and the UHV grade point; the hub
                            subtracts UHV’s two-credit contribution.
                          </p>
                          <p className="leading-relaxed text-[11px] text-slate-500">
                            UHV remains included in the Semester III GPA Hub
                            calculation.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <input
                  id={`semester-${semester}-credits`}
                  type="number"
                  min={0.01}
                  step={0.5}
                  inputMode="decimal"
                  aria-label={`Semester ${semester} credits counted in CGPA`}
                  value={semesterInputs[semester].credits}
                  onChange={(event) =>
                    updateInput(semester, "credits", event.currentTarget.value)
                  }
                  readOnly={semester === 3}
                  className={`min-h-11 w-full border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554] ${
                    semester === 3 ? "bg-slate-100" : "bg-white"
                  }`}
                />
              </div>
              {semester === 3 && (
                <label className="block sm:col-span-3">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">
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
                    value={semesterInputs[semester].uhvGradePoint}
                    onChange={(event) =>
                      updateInput(
                        semester,
                        "uhvGradePoint",
                        event.currentTarget.value
                      )
                    }
                    className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554] sm:max-w-xs"
                  />
                </label>
              )}
            </div>
          ))}
        </div>
      </section>

      {cgpa !== null ? (
        <section
          className="border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-7"
          aria-live="polite"
          aria-label="CGPA result"
        >
          <p className="text-xs font-bold text-emerald-800">
            Cumulative GPA through Semester {selectedSemester}
          </p>
          <p className="mt-1 text-4xl font-black text-[#172554]">
            {cgpa.toFixed(2)}
          </p>
        </section>
      ) : (
        <p
          className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950"
          role="status"
        >
          Enter a GPA from 0 to 10 and positive counted credits for each of the{" "}
          {selectedSemester} semesters to calculate CGPA.
        </p>
      )}
    </section>
  );
};

import React, { useMemo, useState } from 'react';
import { ChartColumnIncreasing } from 'lucide-react';
import { GPA_COURSES } from '../gpaCourses';

interface SemesterResultInput {
  gpa: string;
  credits: string;
  uhvGradePoint: string;
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

const initialSemesterInputs: Record<number, SemesterResultInput> = Object.fromEntries(
  SEMESTERS.map((semester) => [
    semester,
    {
      gpa: '',
      credits: String(semester === 3 ? 25 : GPA_COURSES
        .filter((course) => course.semester === semester)
        .reduce((total, course) => total + course.credits, 0)),
      uhvGradePoint: '',
    },
  ])
);

export const CGPAHub: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [semesterInputs, setSemesterInputs] = useState(initialSemesterInputs);

  const completedSemesters = SEMESTERS.slice(0, selectedSemester);
  const validEntries = useMemo(() => completedSemesters.map((semester) => {
    const gpa = Number(semesterInputs[semester].gpa);
    const credits = Number(semesterInputs[semester].credits);
    const uhvGradePointValue = semesterInputs[semester].uhvGradePoint ?? '';
    const uhvGradePoint = Number(uhvGradePointValue);
    return {
      semester,
      gpa,
      credits,
      uhvGradePoint,
      valid: semesterInputs[semester].gpa.trim() !== '' &&
        Number.isFinite(gpa) && gpa >= 0 && gpa <= 10 &&
        semesterInputs[semester].credits.trim() !== '' &&
        Number.isFinite(credits) && credits > 0 &&
        (semester !== 3 || (
          uhvGradePointValue.trim() !== '' &&
          Number.isFinite(uhvGradePoint) && uhvGradePoint >= 0 && uhvGradePoint <= 10
        )),
    };
  }), [completedSemesters, semesterInputs]);

  const allInputsValid = validEntries.every((entry) => entry.valid);
  const totalCredits = validEntries.reduce((total, entry) => total + (entry.valid ? entry.credits : 0), 0);
  const weightedGradePoints = validEntries.reduce(
    (total, entry) => total + (entry.valid
      ? entry.gpa * (entry.semester === 3 ? 27 : entry.credits) -
        (entry.semester === 3 ? 2 * entry.uhvGradePoint : 0)
      : 0),
    0
  );
  const cgpa = allInputsValid && totalCredits > 0 ? weightedGradePoints / totalCredits : null;

  const updateInput = (semester: number, field: keyof SemesterResultInput, value: string) => {
    setSemesterInputs((previous) => ({
      ...previous,
      [semester]: { ...previous[semester], [field]: value },
    }));
  };

  return (
    <section className="mx-auto max-w-3xl space-y-5" aria-labelledby="cgpa-hub-heading">
      <header className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#172554] text-white">
            <ChartColumnIncreasing className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold text-slate-500">Cumulative academic performance</p>
            <h1 id="cgpa-hub-heading" className="text-xl font-black text-[#172554] sm:text-2xl">CGPA Hub</h1>
          </div>
        </div>
      </header>

      <section className="border border-slate-300 bg-white p-5 shadow-sm sm:p-7" aria-label="CGPA inputs">
        <label className="block max-w-sm">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Calculate through semester</span>
          <select
            aria-label="CGPA through semester"
            value={selectedSemester}
            onChange={(event) => setSelectedSemester(Number(event.currentTarget.value))}
            className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>Semester {semester}</option>
            ))}
          </select>
        </label>

        <div className="mt-5 space-y-3">
          {completedSemesters.map((semester) => (
            <div key={semester} className="grid gap-3 border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[minmax(0,1fr)_1fr_1fr] sm:items-end">
              <h2 className="text-sm font-bold text-[#172554]">Semester {semester}</h2>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">
                  {semester === 3 ? 'Semester GPA (including UHV)' : 'Semester GPA'}
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
                  onChange={(event) => updateInput(semester, 'gpa', event.currentTarget.value)}
                  className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-slate-600">
                  {semester === 3 ? 'Credits counted (UHV excluded)' : 'Credits counted'}
                </span>
                <input
                  type="number"
                  min={0.01}
                  step={0.5}
                  inputMode="decimal"
                  aria-label={`Semester ${semester} credits counted in CGPA`}
                  value={semesterInputs[semester].credits}
                  onChange={(event) => updateInput(semester, 'credits', event.currentTarget.value)}
                  readOnly={semester === 3}
                  className={`min-h-11 w-full border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554] ${semester === 3 ? 'bg-slate-100' : 'bg-white'}`}
                />
              </label>
              {semester === 3 && (
                <label className="block sm:col-span-3">
                  <span className="mb-1 block text-xs font-semibold text-slate-600">UHV grade point to exclude (2 credits)</span>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    step={0.01}
                    inputMode="decimal"
                    aria-label="Universal Human Values grade point to exclude"
                    placeholder="0.00 – 10.00"
                    value={semesterInputs[semester].uhvGradePoint}
                    onChange={(event) => updateInput(semester, 'uhvGradePoint', event.currentTarget.value)}
                    className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554] sm:max-w-xs"
                  />
                </label>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 border border-blue-200 bg-blue-50 p-3 text-xs leading-relaxed text-[#172554]">
          Semester III is counted as 25 CGPA credits. Enter its GPA including UHV and the UHV grade point; the hub subtracts UHV’s two-credit contribution. UHV remains included in the Semester III GPA Hub calculation.
        </p>
      </section>

      {cgpa !== null ? (
        <section className="border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-7" aria-live="polite" aria-label="CGPA result">
          <p className="text-xs font-bold text-emerald-800">Cumulative GPA through Semester {selectedSemester}</p>
          <p className="mt-1 text-4xl font-black text-[#172554]">{cgpa.toFixed(2)}</p>
        </section>
      ) : (
        <p className="border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
          Enter a GPA from 0 to 10 and positive counted credits for each of the {selectedSemester} semesters to calculate CGPA.
        </p>
      )}
    </section>
  );
};

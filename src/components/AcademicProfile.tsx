import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, ChevronDown, LoaderCircle, LogOut, MessageSquare, Sparkles, TableProperties, UsersRound, X } from 'lucide-react';
import type { AcademicProfileData } from '../types';
import type { SemesterNumber } from './SubjectSelectionDialog';
import { ThemeToggle, type AppTheme } from './ThemeToggle';
import CalCreditLogo from './CalCreditLogo';
import { motionVariants, transitions } from '../motion';
import { CURRENT_APP_VERSION } from '../versionUtils';
import { acquireOverlayScrollLock } from './TourErrorBoundary';

export interface AcademicProfileFormValues extends AcademicProfileData {
  selectedSemester: SemesterNumber;
}

interface AcademicProfileFormProps {
  profile: AcademicProfileData | null;
  initialSemester: SemesterNumber | null;
  email: string;
  guestMode: boolean;
  submitLabel: string;
  onSave: (values: AcademicProfileFormValues) => Promise<void>;
  onCancel?: () => void;
}

const semesterOptions: SemesterNumber[] = [1, 2, 3, 4, 5, 6, 7, 8];

const normalizeDept = (d?: string): string => {
  if (!d) return 'CSE';
  const u = d.trim().toUpperCase();
  if (u === 'ECE') return 'ECE';
  if (u === 'CIVIL' || u === 'CE') return 'CIVIL';
  if (u === 'GEO' || u === 'GI' || u === 'GEOINFORMATICS') return 'GEO';
  if (u === 'BME' || u === 'BM' || u === 'BIOMEDICAL') return 'BME';
  if (u === 'IT' || u === 'INFORMATION_TECHNOLOGY' || u === 'INFOTECH') return 'IT';
  if (u === 'EEE' || u === 'ELECTRICAL') return 'EEE';
  if (u === 'MFG' || u === 'MANUFACTURING') return 'MFG';
  if (u === 'VLSI' || u === 'ELECTRONICS_VLSI') return 'VLSI';
  if (u === 'MECH' || u === 'MECHANICAL') return 'MECH';
  if (u === 'PT' || u === 'PRINTING' || u === 'PPT') return 'PT';
  if (u === 'MINING' || u === 'MINE' || u === 'MN' || u === 'MI') return 'MINING';
  if (u === 'MSE' || u === 'MATSCI' || u === 'MS') return 'MSE';
  if (u === 'IE' || u === 'INDUSTRIAL') return 'IE';
  return 'CSE';
};

export const DEPARTMENT_OPTIONS = [
  { value: 'BME', label: 'Biomedical Engineering (BME)' },
  { value: 'CIVIL', label: 'Civil Engineering (CIVIL)' },
  { value: 'CSE', label: 'Computer Science and Engineering (CSE)' },
  { value: 'EEE', label: 'Electrical and Electronics Engineering (EEE)' },
  { value: 'ECE', label: 'Electronics and Communication Engineering (ECE)' },
  { value: 'VLSI', label: 'Electronics Engineering (VLSI Design and Technology)' },
  { value: 'GEO', label: 'Geoinformatics (GEO)' },
  { value: 'IE', label: 'Industrial Engineering (IE)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'MFG', label: 'Manufacturing Engineering (MFG)' },
  { value: 'MSE', label: 'Materials Science and Engineering (MSE)' },
  { value: 'MECH', label: 'Mechanical Engineering (MECH)' },
  { value: 'MINING', label: 'Mining Engineering (MINING)' },
  { value: 'PT', label: 'Printing and Packaging Technology (PT)' },
] as const;

export const AcademicProfileForm: React.FC<AcademicProfileFormProps> = ({
  profile,
  initialSemester,
  email,
  guestMode,
  submitLabel,
  onSave,
  onCancel,
}) => {
  const [studentName, setStudentName] = useState(profile?.studentName ?? '');
  const [rollNumber, setRollNumber] = useState(profile?.rollNumber ?? '');
  const [department, setDepartment] = useState(() => normalizeDept(profile?.department));
  const [semester, setSemester] = useState(initialSemester?.toString() ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isSemOpen, setIsSemOpen] = useState(false);
  const deptMenuRef = useRef<HTMLDivElement>(null);
  const semMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDeptOpen && !isSemOpen) return;
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (deptMenuRef.current && !deptMenuRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
      if (semMenuRef.current && !semMenuRef.current.contains(event.target as Node)) {
        setIsSemOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDeptOpen(false);
        setIsSemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDeptOpen, isSemOpen]);

  useEffect(() => {
    setStudentName(profile?.studentName ?? '');
    setRollNumber(profile?.rollNumber ?? '');
    setDepartment(normalizeDept(profile?.department));
    setSemester(initialSemester?.toString() ?? '');
    setError('');
  }, [profile, initialSemester]);

  useEffect(() => {
    document.getElementById('academic-student-name')?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = {
      studentName: studentName.trim(),
      rollNumber: rollNumber.trim(),
      department,
    };
    const semesterValue = Number(semester);
    if (!values.studentName || !values.rollNumber) {
      setError('Enter your student name and roll number to continue.');
      return;
    }
    if (!semesterOptions.includes(semesterValue as SemesterNumber)) {
      setError('Choose your current semester to continue.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({ ...values, selectedSemester: semesterValue as SemesterNumber });
    } catch (saveError) {
      console.error('Unable to save academic profile:', saveError);
      setError('Your profile could not be saved. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#172554]">
            Student name
          </span>
          <input
            id="academic-student-name"
            name="studentName"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            value={studentName}
            onChange={(event) => setStudentName(event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'academic-profile-error' : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-bold text-[#172554]">
            Roll number
          </span>
          <input
            id="academic-roll-number"
            name="rollNumber"
            type="text"
            autoComplete="off"
            placeholder="Enter your roll number"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'academic-profile-error' : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 tabular-nums font-numeric"
          />
        </label>

        <div>
          <span className="mb-1.5 block text-xs font-bold text-[#172554]">
            Email address
          </span>
          <p className="min-h-11 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 break-words">
            {guestMode ? 'Temporary guest session' : email || 'Email unavailable'}
          </p>
        </div>

        {/* Department Dropdown matching App UI */}
        <div className="relative" ref={deptMenuRef}>
          <span className="mb-1.5 block text-xs font-bold text-[#172554]">
            Department
          </span>
          <button
            id="academic-department-trigger"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isDeptOpen}
            onClick={() => {
              setIsDeptOpen((prev) => !prev);
              setIsSemOpen(false);
            }}
            className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:border-[#172554] focus:border-[#172554] focus:outline-2 focus:outline-[#172554] cursor-pointer"
          >
            <span className="truncate pr-2">
              {DEPARTMENT_OPTIONS.find((d) => d.value === department)?.label || department}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isDeptOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {isDeptOpen && (
            <div
              role="listbox"
              aria-label="Department options"
              className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto overscroll-contain pr-1 custom-department-scrollbar rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-[sticky-result-in_140ms_ease-out]"
            >
              {DEPARTMENT_OPTIONS.map((opt) => {
                const isSelected = department === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setDepartment(opt.value);
                      setIsDeptOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-[#172554] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#172554]" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          )}

        </div>

        {/* Semester Dropdown matching App UI */}
        <div className="relative" ref={semMenuRef}>
          <span className="mb-1.5 block text-xs font-bold text-[#172554]">
            Current semester
          </span>
          <button
            id="academic-semester-trigger"
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isSemOpen}
            onClick={() => {
              setIsSemOpen((prev) => !prev);
              setIsDeptOpen(false);
            }}
            className="flex min-h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm font-semibold text-slate-900 shadow-xs transition-colors hover:border-[#172554] focus:border-[#172554] focus:outline-2 focus:outline-[#172554] cursor-pointer"
          >
            <span className={semester ? 'text-slate-900' : 'text-slate-400'}>
              {semester ? `Semester ${semester}` : 'Choose semester…'}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${isSemOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
          {isSemOpen && (
            <div
              role="listbox"
              aria-label="Semester options"
              className="absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto overscroll-contain pr-1 custom-department-scrollbar rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl ring-1 ring-black/5 animate-[sticky-result-in_140ms_ease-out]"
            >
              {semesterOptions.map((opt) => {
                const isSelected = semester === String(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      setSemester(String(opt));
                      setIsSemOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 text-[#172554] font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>Semester {opt}</span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#172554]" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {error && (
        <p id="academic-profile-error" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-900" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-[#172554] hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="min-h-11 rounded-lg bg-[#172554] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e3a8a] disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
        >
          {saving ? 'Saving profile…' : submitLabel}
        </button>
      </div>
    </form>
  );
};

interface AcademicSetupScreenProps extends Omit<AcademicProfileFormProps, 'submitLabel' | 'onCancel'> {
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const AcademicSetupScreen: React.FC<AcademicSetupScreenProps> = ({ theme, onToggleTheme, ...props }) => (
  <main className="min-h-screen bg-transparent px-4 py-8 pt-[calc(2rem+var(--safe-area-top))] pb-[calc(2rem+var(--safe-area-bottom))] transition-[padding] duration-300 ease-out text-slate-900 sm:px-6 sm:py-12">
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-slate-300 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex min-w-0 flex-col gap-2">
          <CalCreditLogo markSize={36} wordHeight={22} />
          <div>
            <h1 className="text-xl font-black text-[#172554] sm:text-2xl">Academic Setup</h1>
            <p className="mt-1 max-w-prose text-xs text-slate-600">Add your academic details to personalize your course workspace.</p>
          </div>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
      <AcademicProfileForm {...props} submitLabel="Save and continue" />
    </section>
  </main>
);

interface ProfileDrawerProps extends Omit<AcademicProfileFormProps, 'submitLabel'> {
  isOpen: boolean;
  onClose: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
  onOpenGrades: () => void;
  onOpenFeedback: () => void;
  onOpenCredits: () => void;
  onReplayTour?: () => void;
  onLogout: () => void;
  logoutPending: boolean;
  appVersion?: string;
}

const ProfileDrawerBody: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  initialSemester,
  email,
  guestMode,
  onSave,
  theme,
  onToggleTheme,
  onOpenGrades,
  onOpenFeedback,
  onOpenCredits,
  onReplayTour,
  onLogout,
  logoutPending,
  appVersion = CURRENT_APP_VERSION,
}) => {
  const reduceMotion = useReducedMotion();
  const [editing, setEditing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const releaseScrollLock = acquireOverlayScrollLock();
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const drawer = document.getElementById('academic-profile-drawer');
      const focusable = drawer?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      releaseScrollLock();
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setEditing(false);
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-[70] h-dvh max-h-dvh overflow-hidden" role="presentation">
      <motion.button
        type="button"
        aria-label="Close profile"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/55"
        variants={reduceMotion ? undefined : motionVariants.backdrop}
        initial={reduceMotion ? { opacity: 1 } : 'initial'}
        animate="animate"
        exit={reduceMotion ? undefined : 'exit'}
      />
      <motion.aside
        id="academic-profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-profile-title"
        className="absolute inset-y-0 left-0 flex h-full max-h-dvh w-[86vw] max-w-[21rem] sm:max-w-sm flex-col rounded-r-2xl border-r border-slate-300 dark:border-slate-800 bg-white dark:bg-[#161618] shadow-2xl overflow-hidden"
        initial={reduceMotion ? { x: 0 } : { x: '-100%' }}
        animate={{ x: 0 }}
        exit={reduceMotion ? undefined : { x: '-100%' }}
        transition={reduceMotion ? { duration: 0 } : transitions.overlay}
      >
        <header className="shrink-0 flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161618] px-3.5 sm:px-4 py-2 pt-[calc(0.5rem+var(--safe-area-top))]">
          <div className="flex items-center gap-2.5">
            {editing ? (
              <>
                <CalCreditLogo markSize={26} wordHeight={0} />
                <h2 id="academic-profile-title" className="text-sm font-black text-[#172554] dark:text-slate-100">
                  Edit Profile
                </h2>
              </>
            ) : (
              <h2 id="academic-profile-title" className="flex items-center">
                <CalCreditLogo markSize={28} wordHeight={16} subtitle />
              </h2>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="flex h-8.5 w-8.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e1e20] text-[#172554] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252528] focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto custom-department-scrollbar p-4 sm:p-5 space-y-4 pb-[calc(1.5rem+var(--safe-area-bottom))] transition-[padding] duration-300 ease-out sm:pb-6">
          {editing ? (
            <AcademicProfileForm
              profile={profile}
              initialSemester={initialSemester}
              email={email}
              guestMode={guestMode}
              submitLabel="Save Changes"
              onSave={async (values) => {
                await onSave(values);
                setEditing(false);
                window.requestAnimationFrame(() => editButtonRef.current?.focus());
              }}
              onCancel={() => {
                setEditing(false);
                window.requestAnimationFrame(() => editButtonRef.current?.focus());
              }}
            />
          ) : (
            <>
              {/* 1. Your Profile banner */}
              <div className="rounded-xl bg-[#172554] px-4 py-3 text-white flex items-center shadow-sm">
                <span className="text-xs font-black">Your Profile</span>
              </div>

              {/* 2-6. Profile Details Card: Student Name -> Roll Number -> Email -> Department -> Current Semester */}
              <div className="rounded-xl border border-slate-300 bg-white p-4 shadow-sm divide-y divide-slate-200">
                <div className="pb-3">
                  <dt className="text-[10px] font-bold text-slate-500">Student Name</dt>
                  <dd className="mt-1 text-sm font-bold text-[#172554] break-words">
                    {profile?.studentName || (guestMode ? 'Guest Student' : 'Student')}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[10px] font-bold text-slate-500">Roll Number</dt>
                  <dd className="mt-1 text-sm font-bold text-[#172554] break-words">
                    {profile?.rollNumber || 'Not provided'}
                  </dd>
                </div>
                <div className="py-3">
                  <dt className="text-[10px] font-bold text-slate-500">Email</dt>
                  <dd className="mt-1 text-sm font-semibold text-slate-800 break-words">
                    {guestMode ? 'Temporary guest session' : email || 'Email unavailable'}
                  </dd>
                </div>
                <div id="tour-profile-department" className="py-3">
                  <dt className="text-[10px] font-bold text-slate-500">Department</dt>
                  <dd className="mt-1 text-sm font-bold text-[#172554]">
                    {profile?.department === 'ECE'
                      ? 'Electronics & Communication Engg.'
                      : profile?.department === 'CIVIL' || profile?.department === 'CE'
                      ? 'Civil Engineering'
                      : profile?.department === 'GEO' || profile?.department === 'GI' || profile?.department === 'GEOINFORMATICS'
                      ? 'Geoinformatics'
                      : profile?.department === 'BME' || profile?.department === 'BM' || profile?.department === 'BIOMEDICAL'
                      ? 'Biomedical Engineering'
                      : profile?.department === 'IT' || profile?.department === 'INFORMATION_TECHNOLOGY' || profile?.department === 'INFOTECH'
                      ? 'Information Technology'
                      : profile?.department === 'EEE' || profile?.department === 'ELECTRICAL'
                      ? 'Electrical & Electronics Engg.'
                      : profile?.department === 'MFG' || profile?.department === 'MANUFACTURING'
                      ? 'Manufacturing Engineering'
                      : profile?.department === 'VLSI' || profile?.department === 'ELECTRONICS_VLSI'
                      ? 'Electronics Engg. (VLSI Design & Tech)'
                      : profile?.department === 'MECH' || profile?.department === 'MECHANICAL'
                      ? 'Mechanical Engineering'
                      : profile?.department === 'PT' || profile?.department === 'PRINTING' || profile?.department === 'PPT'
                      ? 'Printing and Packaging Technology'
                      : profile?.department === 'MINING' || profile?.department === 'MINE' || profile?.department === 'MN' || profile?.department === 'MI'
                      ? 'Mining Engineering'
                      : profile?.department === 'MSE' || profile?.department === 'MATSCI' || profile?.department === 'MS'
                      ? 'Materials Science and Engineering'
                      : profile?.department === 'IE' || profile?.department === 'INDUSTRIAL'
                      ? 'Industrial Engineering'
                      : 'Computer Science & Engg.'}
                  </dd>
                </div>
                <div className="pt-3">
                  <dt className="text-[10px] font-bold text-slate-500">Current Semester</dt>
                  <dd className="mt-1 text-sm font-bold text-[#172554]">
                    {initialSemester ? `Semester ${initialSemester}` : 'Not selected'}
                  </dd>
                </div>
              </div>

              {/* 7. Edit Profile */}
              <button
                ref={editButtonRef}
                type="button"
                id="tour-edit-profile"
                data-tour="edit-profile"
                onClick={() => setEditing(true)}
                className="min-h-11 w-full rounded-xl bg-[#172554] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
              >
                Edit Profile
              </button>

              {/* Grading reference, directly above Feedback */}
              <button
                type="button"
                onClick={onOpenGrades}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white p-3.5 text-left transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#172554]">
                    <TableProperties className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#172554]">Grading</span>
                  </div>
                </div>
              </button>

              {/* Feedback */}
              <button
                type="button"
                id="tour-profile-feedback"
                data-tour="profile-feedback"
                onClick={onOpenFeedback}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white p-3.5 text-left hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#172554]">
                    <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#172554]">Feedback</span>
                  </div>
                </div>
              </button>

              {/* 9. Credits */}
              <button
                type="button"
                onClick={onOpenCredits}
                className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white p-3.5 text-left hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#172554]">
                    <UsersRound className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#172554]">Credits</span>
                  </div>
                </div>
              </button>

              {/* Replay tour */}
              {onReplayTour && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onReplayTour();
                  }}
                  className="flex min-h-12 w-full items-center justify-between rounded-xl border border-slate-300 bg-white p-3.5 text-left hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-[#172554] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-[#F0482E]">
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-[#172554]">Replay tour</span>
                    </div>
                  </div>
                </button>
              )}

              {/* 10. App Version Explanatory Text */}
              {guestMode && (
                <div
                  className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950"
                  role="status"
                >
                  <strong className="font-black">Guest session:</strong> Your
                  courses and results exist only in memory and will be cleared
                  when you reload or close this page.
                </div>
              )}
              <p className="text-center text-xs text-slate-400 font-medium pt-1">
                CalCredit <span className="font-mono font-semibold text-slate-500">v{appVersion}</span>
              </p>

            </>
          )}
        </div>

        {/* 10. Logout at the bottom with safe-area spacing elevated only for mobile 3-button navigation */}
        {!editing && (
          <footer className="shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161618] p-4 pb-[calc(1rem+var(--safe-area-bottom))] transition-[padding] duration-300 ease-out sm:pb-4">
            <button
              type="button"
              onClick={onLogout}
              disabled={logoutPending}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 px-4 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-rose-500 cursor-pointer"
            >
              {logoutPending
                ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                : <LogOut className="h-4 w-4" aria-hidden="true" />}
              {logoutPending ? 'Signing out…' : guestMode ? 'Exit Guest Session' : 'Log out'}
            </button>
          </footer>
        )}
      </motion.aside>
    </div>
  );
};

export const ProfileDrawer: React.FC<ProfileDrawerProps> = (props) => (
  <AnimatePresence initial={false}>
    {props.isOpen && <ProfileDrawerBody {...props} />}
  </AnimatePresence>
);

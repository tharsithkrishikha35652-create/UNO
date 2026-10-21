import React, { useEffect, useRef, useState, type FormEvent } from 'react';
import { LoaderCircle, LogOut, MessageSquare, UsersRound, X } from 'lucide-react';
import type { AcademicProfileData } from '../types';
import type { SemesterNumber } from './SubjectSelectionDialog';
import { ThemeToggle, type AppTheme } from './ThemeToggle';

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
  const [department, setDepartment] = useState('CSE');
  const [semester, setSemester] = useState(initialSemester?.toString() ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setStudentName(profile?.studentName ?? '');
    setRollNumber(profile?.rollNumber ?? '');
    setDepartment('CSE');
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
    if (Object.values(values).some((value) => !value)) {
      setError('Enter your name and roll number to continue.');
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
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Student name</span>
          <input
            id="academic-student-name"
            name="studentName"
            type="text"
            autoComplete="name"
            value={studentName}
            onChange={(event) => setStudentName(event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'academic-profile-error' : undefined}
            className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Roll number</span>
          <input
            id="academic-roll-number"
            name="rollNumber"
            type="text"
            autoComplete="off"
            value={rollNumber}
            onChange={(event) => setRollNumber(event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'academic-profile-error' : undefined}
            className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Department</span>
          <select
            id="academic-department"
            name="department"
            value={department}
            onChange={(event) => setDepartment(event.currentTarget.value)}
            className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          >
            <option value="CSE">Computer Science and Engineering (CSE)</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Email address</span>
          <p className="min-h-11 border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            {guestMode ? 'Temporary guest session' : email || 'Email unavailable'}
          </p>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Current semester</span>
          <select
            aria-label="Current semester"
            value={semester}
            onChange={(event) => setSemester(event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'academic-profile-error' : undefined}
            className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900"
          >
            <option value="">Choose semester…</option>
            {semesterOptions.map((option) => (
              <option key={option} value={option}>Semester {option}</option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p id="academic-profile-error" className="border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm font-semibold text-rose-900" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="min-h-11 border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="min-h-11 bg-[#172554] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] disabled:cursor-wait disabled:opacity-60"
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
  <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-12">
    <section className="mx-auto w-full max-w-3xl border border-slate-300 bg-white p-5 shadow-sm sm:p-8">
      <div className="mb-7 flex items-start justify-between gap-3 border-b border-slate-200 pb-5">
        <div className="flex min-w-0 items-start gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[#172554] text-blue-100 shadow-sm">
            <span className="text-base font-black tracking-[-0.12em]" aria-hidden="true">CC</span>
            <span className="absolute bottom-1.5 h-0.5 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-bold tracking-[0.08em] text-blue-800">CalCredit</p>
            <h1 className="mt-1 text-xl font-black text-[#172554] sm:text-2xl">Academic Setup</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-600">Add your academic details to personalize your course workspace.</p>
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
  onOpenFeedback: () => void;
  onOpenCredits: () => void;
  onLogout: () => void;
  logoutPending: boolean;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  initialSemester,
  email,
  guestMode,
  onSave,
  theme,
  onToggleTheme,
  onOpenFeedback,
  onOpenCredits,
  onLogout,
  logoutPending,
}) => {
  const [editing, setEditing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

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
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) setEditing(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const entries = [
    ['Student name', profile?.studentName || (guestMode ? 'Guest Student' : 'Student')],
    ['Roll number', profile?.rollNumber || 'Not provided'],
    ['Email address', guestMode ? 'Not available in a guest session' : email || 'Email unavailable'],
    ['Department', profile?.department || 'CSE'],
    ['Current semester', initialSemester ? `Semester ${initialSemester}` : 'Not selected'],
  ];

  return (
    <div className="fixed inset-0 z-[70] h-dvh max-h-dvh overflow-hidden" role="presentation">
      <button
        type="button"
        aria-label="Close profile"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/55 animate-[profile-backdrop-in_180ms_ease-out]"
      />
      <aside
        id="academic-profile-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="academic-profile-title"
        className="absolute inset-y-0 left-0 flex h-full max-h-dvh w-[min(100%,26rem)] flex-col border-r border-slate-300 bg-white shadow-2xl animate-[profile-slide-in_220ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 id="academic-profile-title" className="text-base font-black uppercase tracking-wide text-[#172554]">
              {editing ? 'Edit academic profile' : 'Student profile'}
            </h2>
            <p className="mt-1 text-xs text-slate-600">{guestMode ? 'Temporary guest session' : 'Your saved academic information'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center border border-slate-300 text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          {editing ? (
            <AcademicProfileForm
              profile={profile}
              initialSemester={initialSemester}
              email={email}
              guestMode={guestMode}
              submitLabel="Save profile"
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
              <dl className="divide-y divide-slate-200">
                {entries.map(([label, value]) => (
                  <div key={label} className="py-3">
                    <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-semibold text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
              {guestMode && (
                <p className="mt-5 border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950" role="status">
                  Guest profile details stay in this temporary session and are cleared when it ends. They are not sent to Firebase.
                </p>
              )}
              <button
                ref={editButtonRef}
                type="button"
                onClick={() => setEditing(true)}
                className="mt-6 min-h-11 w-full bg-[#172554] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
              >
                Edit profile
              </button>
            </>
          )}
        </div>
        {!editing && (
          <footer className="shrink-0 space-y-2 border-t border-slate-200 bg-white p-5">
            <button
              type="button"
              onClick={onOpenFeedback}
              className="flex min-h-11 w-full items-center gap-3 border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              <MessageSquare className="h-4 w-4" aria-hidden="true" />
              Feedback Hub
            </button>
            <button
              type="button"
              onClick={onOpenCredits}
              className="flex min-h-11 w-full items-center gap-3 border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              <UsersRound className="h-4 w-4" aria-hidden="true" />
              Credits
            </button>
            <button
              type="button"
              onClick={onLogout}
              disabled={logoutPending}
              className="flex min-h-11 w-full items-center gap-3 border border-slate-300 px-3 py-2 text-left text-sm font-semibold text-[#172554] hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-[#172554]"
            >
              {logoutPending
                ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
                : <LogOut className="h-4 w-4" aria-hidden="true" />}
              {logoutPending ? 'Signing out…' : guestMode ? 'Exit guest session' : 'Log out'}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
};

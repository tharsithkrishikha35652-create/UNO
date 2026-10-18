import React, { useState, useEffect, useMemo, useRef } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { SubjectData, CourseType } from './types';
import {
  DEFAULT_SUBJECT,
  calculateMarks,
  syncScoresArray,
  GRADE_SCALE,
  SPECIAL_GRADES,
} from './calculatorUtils';
import { ContinuousAssessmentSection } from './components/ContinuousAssessmentSection';
import { EndSemesterSection } from './components/EndSemesterSection';
import { ResultsSummaryPanel } from './components/ResultsSummaryPanel';
import { SubjectHeader } from './components/SubjectHeader';
import { SubjectSelectionDialog, PRESET_COURSES } from './components/SubjectSelectionDialog';
import { AcademicSetupModal, type StudentProfile } from './components/AcademicSetupModal';
import { CourseBottomSheet } from './components/CourseBottomSheet';
import {
  applyEstimatedScores,
  GPACalculator,
  hasEstimateableComponents,
} from './components/GPACalculator';
import { GPA_COURSES } from './gpaCourses';
import { AuthScreen } from './components/AuthScreen';
import { auth, firebaseConfigReady } from './firebase';
import {
  importLegacySubjects,
  loadUserWorkspace,
  saveCalculatedGrade,
  saveGpaHistory,
  saveUserPreferences,
  skipLegacyMigration,
  syncUserSubjects,
  type GpaHistoryEntry,
} from './firebaseData';
import {
  Calculator,
  TableProperties,
  Plus,
  Trash2,
  ArrowDown,
  BookOpen,
  GraduationCap,
  LogOut,
  LoaderCircle,
  AlertCircle,
  Sun,
  Moon,
  Layers,
  ChevronDown,
} from 'lucide-react';

export function loadCoursesForSemester(sem: number): SubjectData[] {
  const presets = PRESET_COURSES.filter((c) => c.semester === sem && c.category === 'core');
  if (presets.length === 0) {
    return [
      {
        ...DEFAULT_SUBJECT,
        id: `sub_${sem}_1_${Date.now()}`,
        name: `Course 1 (Sem ${sem})`,
        code: '',
        courseType: '2-0-2',
      },
    ];
  }
  return presets.map((p, idx) => ({
    ...DEFAULT_SUBJECT,
    id: `sub_${sem}_${p.code || idx}_${Date.now() + idx}`,
    name: p.name,
    code: p.code,
    courseType: p.courseType,
    act1Scores: syncScoresArray([], DEFAULT_SUBJECT.act1No),
    act2Scores: syncScoresArray([], DEFAULT_SUBJECT.act2No),
    lab1Scores: syncScoresArray([], DEFAULT_SUBJECT.lab1No),
    lab2Scores: syncScoresArray([], DEFAULT_SUBJECT.lab2No),
  }));
}

const LEGACY_STORAGE_KEY = 'ca_ese_calculator_sem1_user_selected_v18';

export const INITIAL_EMPTY_SUBJECT: SubjectData = {
  ...DEFAULT_SUBJECT,
  id: 'sub_1',
  name: '',
  code: '',
  courseType: '2-0-2',
};

interface AuthenticatedAppProps {
  user: User;
  onSignOut: () => Promise<void>;
  signOutPending: boolean;
  signOutError: string;
}

function parseLegacySubjects(): SubjectData[] {
  try {
    const saved = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : null;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SubjectData =>
        Boolean(item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim())
    );
  } catch {
    return [];
  }
}

function WorkspaceLoading({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-[#172554]">
        <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" />
        {message}
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(() => {
    return typeof window !== 'undefined' && localStorage.getItem('calcredit_guest_session') === 'true';
  });
  const [authResolved, setAuthResolved] = useState(false);
  const [authError, setAuthError] = useState('');
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  useEffect(() => {
    if (!auth) {
      setAuthResolved(true);
      return;
    }
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        setAuthResolved(true);
        setAuthError('');
        setSignOutPending(false);
      },
      (error) => {
        console.error('Unable to resolve authentication state:', error);
        setAuthError('Could not verify your sign-in state. Check your connection and reload the page.');
        setAuthResolved(true);
      }
    );
  }, []);

  const handleGuestLogin = () => {
    setIsGuest(true);
    localStorage.setItem('calcredit_guest_session', 'true');
  };

  const handleSignOut = async () => {
    if (isGuest) {
      setIsGuest(false);
      localStorage.removeItem('calcredit_guest_session');
      return;
    }
    if (!auth || signOutPending) return;
    setSignOutPending(true);
    setSignOutError('');
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Unable to sign out:', error);
      setSignOutError('Could not log out. Please try again.');
      setSignOutPending(false);
    }
  };

  if ((!firebaseConfigReady || !auth) && !isGuest) {
    return <AuthScreen onGuestLogin={handleGuestLogin} configurationError="Firebase is not configured. You can continue as a Guest or add VITE_FIREBASE_* credentials." />;
  }

  if (!authResolved && !isGuest) return <WorkspaceLoading message="Checking your sign-in…" />;

  if (authError && !isGuest) {
    return (
      <main className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6">
        <section className="max-w-lg w-full bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-800 p-6 shadow-sm text-sm text-rose-900 dark:text-rose-200" role="alert">
          {authError}
          <div className="mt-4 flex gap-3">
            <button type="button" onClick={() => window.location.reload()} className="bg-[#172554] dark:bg-blue-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
              Reload
            </button>
            <button type="button" onClick={handleGuestLogin} className="border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#172554] dark:text-slate-200">
              Continue as Guest
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (!user && !isGuest) return <AuthScreen onGuestLogin={handleGuestLogin} />;

  const activeUser = user || ({
    uid: 'guest_student',
    email: 'guest@annauniv.edu',
    displayName: 'Guest Student',
  } as User);

  return (
    <AuthenticatedApp
      key={activeUser.uid}
      user={activeUser}
      onSignOut={handleSignOut}
      signOutPending={signOutPending}
      signOutError={signOutError}
    />
  );
}

function AuthenticatedApp({ user, onSignOut, signOutPending, signOutError }: AuthenticatedAppProps) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [currentSubjectId, setCurrentSubjectId] = useState('');
  const [activeTab, setActiveTab] = useState<'calculator' | 'grades' | 'gpa'>('calculator');
  const [includeEstimates, setIncludeEstimates] = useState(false);
  const [estimatePercentage, setEstimatePercentage] = useState(80);
  const [calculatedSignatures, setCalculatedSignatures] = useState<Record<string, string>>({});
  const [gpaHistory, setGpaHistory] = useState<GpaHistoryEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [legacySubjects, setLegacySubjects] = useState<SubjectData[]>([]);
  const [migrationResolved, setMigrationResolved] = useState(false);
  const [migrationBusy, setMigrationBusy] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [calculationBusy, setCalculationBusy] = useState(false);
  const persistedSubjectsRef = useRef<Map<string, string>>(new Map());
  const persistQueueRef = useRef<Promise<void>>(Promise.resolve());
  const preferencesQueueRef = useRef<Promise<void>>(Promise.resolve());
  const preferencesSignatureRef = useRef('');
  const calculationRevisionRef = useRef(0);

  const [isDark, setIsDark] = useState(() => {
    return typeof window !== 'undefined' && (localStorage.getItem('calcredit_theme') === 'dark' || document.documentElement.classList.contains('dark'));
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('calcredit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('calcredit_theme', 'light');
    }
  }, [isDark]);

  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem(`calcredit_profile_${user.uid}`) : null;
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      name: user.displayName || (user.email ? user.email.split('@')[0] : 'Student'),
      department: 'CS',
      semester: 1,
    };
  });
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(() => {
    return typeof window !== 'undefined' && !localStorage.getItem(`calcredit_profile_${user.uid}`);
  });
  const [isCourseSheetOpen, setIsCourseSheetOpen] = useState(false);

  const handleSaveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem(`calcredit_profile_${user.uid}`, JSON.stringify(newProfile));
    setIsProfileModalOpen(false);
    if (subjects.length <= 1 && (!subjects[0]?.name || !subjects[0].name.trim())) {
      const semCourses = loadCoursesForSemester(newProfile.semester);
      setSubjects(semCourses);
      setCurrentSubjectId(semCourses[0]?.id || '');
    }
  };

  const handleSemesterChange = (newSem: number) => {
    const updated = { ...profile, semester: newSem };
    setProfile(updated);
    localStorage.setItem(`calcredit_profile_${user.uid}`, JSON.stringify(updated));
    const semCourses = loadCoursesForSemester(newSem);
    setSubjects(semCourses);
    setCurrentSubjectId(semCourses[0]?.id || '');
  };

  useEffect(() => {
    let cancelled = false;
    setDataLoading(true);
    setDataError('');
    void loadUserWorkspace(user.uid)
      .then((workspace) => {
        if (cancelled) return;
        const loadedSubjects = workspace.subjects.length ? workspace.subjects : [INITIAL_EMPTY_SUBJECT];
        const preferredId = workspace.preferences.currentSubjectId;
        const selectedId = loadedSubjects.some((subject) => subject.id === preferredId)
          ? preferredId
          : loadedSubjects[0].id;
        setSubjects(loadedSubjects);
        setCurrentSubjectId(selectedId);
        setActiveTab(workspace.preferences.activeTab);
        setIncludeEstimates(workspace.preferences.includeEstimates);
        setEstimatePercentage(workspace.preferences.estimatePercentage);
        setCalculatedSignatures(workspace.calculatedSignatures);
        setGpaHistory(workspace.gpaHistory);
        setLegacySubjects(parseLegacySubjects());
        setMigrationResolved(workspace.migrationResolved);
        persistedSubjectsRef.current = workspace.persistedSubjectSnapshots;
        preferencesSignatureRef.current = JSON.stringify({
          currentSubjectId: selectedId,
          activeTab: workspace.preferences.activeTab,
          includeEstimates: workspace.preferences.includeEstimates,
          estimatePercentage: workspace.preferences.estimatePercentage,
        });
        setIsDialogOpen(false);
        setDataLoading(false);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error('Unable to load account data:', error);
        setDataError('Could not load your account data. Check your connection and Firestore rules, then retry.');
        setDataLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user.uid, loadAttempt]);

  useEffect(() => {
    if (dataLoading || dataError) return;
    const snapshot = [...subjects];
    const timeout = window.setTimeout(() => {
      persistQueueRef.current = persistQueueRef.current
        .then(async () => {
          const latestSnapshots = await syncUserSubjects(
            user.uid,
            snapshot,
            persistedSubjectsRef.current
          );
          persistedSubjectsRef.current = latestSnapshots;
          setSaveError('');
        })
        .catch((error: unknown) => {
          console.error('Unable to save account data:', error);
          setSaveError('Some changes could not be saved. Check your connection and retry.');
        });
    }, 450);
    return () => window.clearTimeout(timeout);
  }, [subjects, user.uid, dataLoading, dataError]);

  useEffect(() => {
    if (dataLoading || dataError || !currentSubjectId) return;
    const preferences = {
      currentSubjectId,
      activeTab,
      includeEstimates,
      estimatePercentage,
    };
    const signature = JSON.stringify(preferences);
    if (signature === preferencesSignatureRef.current) return;
    const timeout = window.setTimeout(() => {
      preferencesQueueRef.current = preferencesQueueRef.current
        .then(async () => {
          if (signature === preferencesSignatureRef.current) return;
          await saveUserPreferences(user.uid, preferences);
          preferencesSignatureRef.current = signature;
        })
        .catch((error: unknown) => {
          console.error('Unable to save account preferences:', error);
          setSaveError('Your latest preferences could not be saved.');
        });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [currentSubjectId, activeTab, includeEstimates, estimatePercentage, user.uid, dataLoading, dataError]);

  const currentSubject = useMemo(() => {
    return subjects.find((s) => s.id === currentSubjectId) || subjects[0] || DEFAULT_SUBJECT;
  }, [subjects, currentSubjectId]);

  const hasSubjectSelected = Boolean(currentSubject.name && currentSubject.name.trim().length > 0);
  const currentSubjectSignature = JSON.stringify(currentSubject);
  const hasCalculatedCurrentSubject = calculatedSignatures[currentSubject.id] === currentSubjectSignature;
  const currentSubjectUsesEstimates = includeEstimates && hasEstimateableComponents(currentSubject);
  const displayedSubject = currentSubjectUsesEstimates
    ? applyEstimatedScores(currentSubject, estimatePercentage)
    : currentSubject;
  const isComputationalThinking =
    currentSubject.code === 'CS23101' ||
    currentSubject.courseType === '1-0-2' ||
    Boolean(currentSubject.name && currentSubject.name.toLowerCase().includes('computational'));

  // Update specific fields of the current subject
  const updateCurrentSubject = (updates: Partial<SubjectData>) => {
    calculationRevisionRef.current += 1;
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== currentSubject.id) return s;

        const updated = { ...s, ...updates };

        // Ensure dynamic arrays stay synced if counts changed without filling mock values
        if (updates.act1No !== undefined) {
          updated.act1Scores = syncScoresArray(updated.act1Scores, updates.act1No);
        }
        if (updates.act2No !== undefined) {
          updated.act2Scores = syncScoresArray(updated.act2Scores, updates.act2No);
        }
        if (updates.lab1No !== undefined) {
          updated.lab1Scores = syncScoresArray(updated.lab1Scores, updates.lab1No);
        }
        if (updates.lab2No !== undefined) {
          updated.lab2Scores = syncScoresArray(updated.lab2Scores, updates.lab2No);
        }

        return updated;
      })
    );
  };

  const updateEstimateSettings = (nextEnabled: boolean, nextPercentage = estimatePercentage) => {
    calculationRevisionRef.current += 1;
    setIncludeEstimates(nextEnabled);
    setEstimatePercentage(nextPercentage);
    setCalculatedSignatures((previous) => {
      const next = { ...previous };
      delete next[currentSubject.id];
      return next;
    });
  };

  const handleSelectSubjectFromDialog = (name: string, code: string, courseType: CourseType) => {
    updateCurrentSubject({ name, code, courseType });
    setIsDialogOpen(false);
  };

  const handleAddNewSubject = () => {
    calculationRevisionRef.current += 1;
    const newId = `sub_${Date.now()}`;
    const newSub: SubjectData = {
      ...DEFAULT_SUBJECT,
      id: newId,
      name: '',
      code: '',
      courseType: '2-0-2',
    };
    setSubjects((prev) => [...prev, newSub]);
    setCurrentSubjectId(newId);
    setIsDialogOpen(true);
  };

  const handleDeleteSubject = (idToDelete: string) => {
    if (subjects.length <= 1) return;
    calculationRevisionRef.current += 1;
    const remaining = subjects.filter((s) => s.id !== idToDelete);
    setSubjects(remaining);
    if (currentSubjectId === idToDelete) {
      setCurrentSubjectId(remaining[0].id);
    }
  };

  const handleReset = () => {
    updateCurrentSubject({
      ...DEFAULT_SUBJECT,
      id: currentSubject.id,
      name: currentSubject.name,
      code: currentSubject.code,
      courseType: currentSubject.courseType,
    });
  };

  const handleImportLegacy = async () => {
    if (migrationBusy || legacySubjects.length === 0) return;
    setMigrationBusy(true);
    setMigrationError('');
    try {
      const imported = await importLegacySubjects(user.uid, legacySubjects, subjects);
      const nextSubjects = [...subjects, ...imported];
      persistedSubjectsRef.current = new Map(
        nextSubjects.map((subject) => [subject.id, JSON.stringify(subject)])
      );
      setSubjects(nextSubjects);
      setCurrentSubjectId(imported[0]?.id ?? currentSubjectId);
      setMigrationResolved(true);
    } catch (error) {
      console.error('Unable to import browser data:', error);
      setMigrationError('Import did not complete. Your browser data was left unchanged; please try again.');
    } finally {
      setMigrationBusy(false);
    }
  };

  const handleSkipLegacy = async () => {
    if (migrationBusy) return;
    setMigrationBusy(true);
    setMigrationError('');
    try {
      await skipLegacyMigration(user.uid);
      setMigrationResolved(true);
    } catch (error) {
      console.error('Unable to save migration choice:', error);
      setMigrationError('Your choice could not be saved. Please try again.');
    } finally {
      setMigrationBusy(false);
    }
  };

  const handleCalculateMarks = async () => {
    if (calculationBusy) return;
    const revisionAtStart = calculationRevisionRef.current;
    const subjectIdAtStart = currentSubjectId;
    const subjectSnapshot: SubjectData = {
      ...currentSubject,
      act1Scores: [...currentSubject.act1Scores],
      act2Scores: [...currentSubject.act2Scores],
      lab1Scores: [...currentSubject.lab1Scores],
      lab2Scores: [...currentSubject.lab2Scores],
    };
    const subjectsSnapshot = subjects.map((subject) => ({
      ...subject,
      act1Scores: [...subject.act1Scores],
      act2Scores: [...subject.act2Scores],
      lab1Scores: [...subject.lab1Scores],
      lab2Scores: [...subject.lab2Scores],
    }));
    const estimateEnabledAtStart = includeEstimates;
    const estimatePercentageAtStart = estimatePercentage;
    const estimateWasApplied =
      estimateEnabledAtStart && hasEstimateableComponents(subjectSnapshot);
    const calculationSubject = estimateWasApplied
      ? applyEstimatedScores(subjectSnapshot, estimatePercentageAtStart)
      : subjectSnapshot;
    const calculationBreakdown = calculateMarks(calculationSubject);
    const inputSignature = JSON.stringify(subjectSnapshot);
    const course = GPA_COURSES.find(
      (item) => item.code === subjectSnapshot.code || item.name.toLowerCase() === subjectSnapshot.name.trim().toLowerCase()
    );

    setCalculationBusy(true);
    setSaveError('');
    try {
      const syncTask = persistQueueRef.current.then(async () => {
        const latestSnapshots = await syncUserSubjects(
          user.uid,
          subjectsSnapshot,
          persistedSubjectsRef.current
        );
        persistedSubjectsRef.current = latestSnapshots;
      });
      persistQueueRef.current = syncTask.catch(() => undefined);
      await syncTask;

      await saveCalculatedGrade(user.uid, subjectSnapshot, {
        inputSignature,
        credits: course?.credits ?? 0,
        total: calculationBreakdown.total,
        grade: calculationBreakdown.grade.letter,
        gradeLabel: calculationBreakdown.grade.label,
        gradePoint: calculationBreakdown.grade.gradePoint,
        courseType: calculationBreakdown.courseTypeLabel,
        estimate: {
          enabled: estimateWasApplied,
          percentage: estimatePercentageAtStart,
        },
      });

      const currentRevisionMatches = calculationRevisionRef.current === revisionAtStart;
      const currentCourseMatches =
        currentSubjectId === subjectIdAtStart &&
        JSON.stringify(currentSubject) === inputSignature &&
        includeEstimates === estimateEnabledAtStart &&
        estimatePercentage === estimatePercentageAtStart;
      if (currentRevisionMatches && currentCourseMatches) {
        setCalculatedSignatures((previous) => ({ ...previous, [subjectIdAtStart]: inputSignature }));
        setSaveError('');
      }
    } catch (error) {
      console.error('Unable to save calculated grade:', error);
      setSaveError('The latest marks or result could not be saved. Check your connection and recalculate.');
    } finally {
      setCalculationBusy(false);
    }
  };

  const handleCalculateGpa = async (entry: GpaHistoryEntry) => {
    await saveGpaHistory(user.uid, entry);
    setGpaHistory((previous) => [entry, ...previous].sort((a, b) => b.createdAtMs - a.createdAtMs));
  };

  // Perform calculations
  const breakdown = useMemo(() => {
    return calculateMarks(displayedSubject);
  }, [displayedSubject]);

  const scrollToSummary = () => {
    const el = document.getElementById('summary-at-end');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (signOutPending) return <WorkspaceLoading message="Signing out…" />;
  if (dataLoading) return <WorkspaceLoading message="Loading your courses…" />;

  if (dataError) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <section className="max-w-lg w-full bg-white border border-slate-300 p-6 shadow-sm">
          <div className="flex items-start gap-3 text-rose-900">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm" role="alert">{dataError}</p>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" onClick={() => setLoadAttempt((count) => count + 1)} className="bg-[#172554] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a]">
              Retry
            </button>
            <button type="button" onClick={onSignOut} className="border border-slate-300 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50">
              Log out
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors pb-32">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 sm:h-16 flex items-center justify-between gap-3">
          {/* Brand & Student Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              title="Edit Profile"
              className="w-8 h-8 sm:w-9 sm:h-9 bg-[#172554] dark:bg-blue-600 text-white flex items-center justify-center text-xs font-mono font-black shadow-xs shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              CC
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span
                onClick={() => setIsProfileModalOpen(true)}
                title="Edit student profile"
                className="text-xs sm:text-sm font-black text-[#172554] dark:text-slate-100 tracking-tight truncate cursor-pointer hover:underline"
              >
                {profile.name}
              </span>
              <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-[#172554] dark:text-blue-300 font-mono font-bold text-[10px] tracking-wider border border-blue-200 dark:border-blue-800 shrink-0">
                {profile.department}
              </span>
            </div>
          </div>

          {/* Center/Right Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Interactive Semester Dropdown */}
            <div className="relative">
              <select
                value={profile.semester}
                onChange={(e) => handleSemesterChange(Number(e.target.value))}
                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[#172554] dark:text-blue-300 font-mono font-bold text-xs py-1.5 pl-2.5 pr-7 cursor-pointer focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 shadow-2xs"
                aria-label="Select Semester"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    SEM - {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-2.5 pointer-events-none" />
            </div>

            {/* Circular Sun/Moon Theme Toggle */}
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#172554]" />}
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#172554] dark:text-slate-300 ml-2">
              <button
                type="button"
                onClick={() => setActiveTab('calculator')}
                className={`transition-colors py-1 cursor-pointer ${
                  activeTab === 'calculator'
                    ? 'text-[#172554] dark:text-blue-400 font-black border-b-2 border-[#172554] dark:border-blue-400'
                    : 'text-slate-500 hover:text-[#172554] dark:hover:text-white'
                }`}
              >
                Calculator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('grades')}
                className={`transition-colors py-1 cursor-pointer ${
                  activeTab === 'grades'
                    ? 'text-[#172554] dark:text-blue-400 font-black border-b-2 border-[#172554] dark:border-blue-400'
                    : 'text-slate-500 hover:text-[#172554] dark:hover:text-white'
                }`}
              >
                Grading System
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gpa')}
                className={`transition-colors py-1 cursor-pointer ${
                  activeTab === 'gpa'
                    ? 'text-[#172554] dark:text-blue-400 font-black border-b-2 border-[#172554] dark:border-blue-400'
                    : 'text-slate-500 hover:text-[#172554] dark:hover:text-white'
                }`}
              >
                GPA Calculator
              </button>
            </nav>

            {/* Sign Out on Desktop */}
            <button
              type="button"
              onClick={() => void onSignOut()}
              disabled={signOutPending}
              className="hidden lg:inline-flex items-center gap-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#172554] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-60 cursor-pointer ml-1"
            >
              {signOutPending ? <LoaderCircle className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <LogOut className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{signOutPending ? '...' : 'Log out'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {saveError && (
          <div className="mb-5 flex items-start justify-between gap-3 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
            <span>{saveError}</span>
            <button type="button" onClick={() => setSaveError('')} aria-label="Dismiss save error" className="font-bold underline">Dismiss</button>
          </div>
        )}
        {signOutError && (
          <div className="mb-5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">{signOutError}</div>
        )}

        {!migrationResolved && legacySubjects.length > 0 && (
          <section className="mb-6 border border-amber-300 bg-amber-50 p-4 sm:p-5" aria-labelledby="migration-heading">
            <h2 id="migration-heading" className="font-black text-[#172554]">Existing browser data found</h2>
            <p className="mt-1 text-sm text-slate-700">
              There are {legacySubjects.length} saved course{legacySubjects.length === 1 ? '' : 's'} in this browser. These records predate sign-in and are not linked to an account; import only if they belong to you. Importing copies them into {user.email ?? 'your account'} without replacing cloud records or deleting the browser copy.
            </p>
            {migrationError && <p className="mt-2 text-sm font-semibold text-rose-800" role="alert">{migrationError}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleImportLegacy()} disabled={migrationBusy} className="inline-flex items-center gap-2 bg-[#172554] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] disabled:opacity-60">
                {migrationBusy && <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />}
                Import a copy
              </button>
              <button type="button" onClick={() => void handleSkipLegacy()} disabled={migrationBusy} className="border border-slate-400 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50 disabled:opacity-60">
                Keep account separate
              </button>
            </div>
          </section>
        )}

        {/* Course Tab Selector Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 overflow-x-auto gap-3 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#172554] whitespace-nowrap hidden sm:inline">
              Courses:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {subjects.map((sub, idx) => {
                const isSelected = sub.id === currentSubject.id;
                const label = sub.name || `Course ${idx + 1} - Unselected`;
                return (
                  <div
                    key={sub.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#172554] text-white border-[#172554]'
                        : 'bg-white text-[#172554] border-slate-300 hover:border-[#172554] hover:bg-slate-50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (sub.id !== currentSubjectId) calculationRevisionRef.current += 1;
                        setCurrentSubjectId(sub.id);
                      }}
                      className="whitespace-nowrap !bg-transparent !text-inherit cursor-pointer"
                    >
                      {label}
                    </button>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(sub.id);
                        }}
                        aria-label={`Delete ${sub.name || 'course'}`}
                        className={`p-0.5 transition-colors cursor-pointer ${
                          isSelected ? 'text-slate-300 hover:text-white' : 'text-slate-500 hover:text-rose-600'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddNewSubject}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-white text-[#172554] border border-slate-300 hover:border-[#172554] hover:bg-slate-50 transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Mobile Navigation Segmented Control */}
        <div className="grid grid-cols-3 md:hidden mb-6 border border-slate-300 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            aria-pressed={activeTab === 'calculator'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'calculator' ? 'bg-[#172554] text-white' : 'text-[#172554]'
            }`}
          >
            Calculator
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            aria-pressed={activeTab === 'grades'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${
              activeTab === 'grades' ? 'bg-[#172554] text-white' : 'text-[#172554]'
            }`}
          >
            Grading Scale
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gpa')}
            aria-pressed={activeTab === 'gpa'}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors border-l border-slate-300 ${activeTab === 'gpa' ? 'bg-[#172554] text-white' : 'text-[#172554]'}`}
          >
            GPA
          </button>
        </div>

        {/* Subject Header with Dialog Box Trigger */}
        {activeTab === 'calculator' && (
          <SubjectHeader
            subject={currentSubject}
            onOpenDialog={() => setIsDialogOpen(true)}
            onResetToBlank={handleReset}
          />
        )}

        {activeTab === 'calculator' && (
          <>
            {hasSubjectSelected ? (
              <div className="space-y-8">
                {/* Course Type Specification */}
                <div>
                  <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#172554] mb-2.5">
                    Course Type = {breakdown.courseTypeLabel}
                  </div>

                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border border-slate-300 bg-white px-3 py-2.5">
                    <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#172554] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeEstimates}
                        onChange={(event) => updateEstimateSettings(event.target.checked)}
                        className="h-4 w-4 accent-[#172554]"
                      />
                      <span>Include estimated lab &amp; activity average</span>
                    </label>
                    {includeEstimates && (
                      <label className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <span>Estimate</span>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          value={estimatePercentage}
                          aria-label={`Estimated lab and activity percentage for ${currentSubject.name}`}
                          onChange={(event) => {
                            const normalizedInput = event.currentTarget.value.replace(/^0+(?=\d)/, '');
                            event.currentTarget.value = normalizedInput;
                            const value = Number(normalizedInput);
                            updateEstimateSettings(
                              includeEstimates,
                              Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))
                            );
                          }}
                          className="w-14 border border-slate-300 bg-white px-1.5 py-1 text-center text-xs font-bold text-[#172554] focus:border-[#172554]"
                        />
                        <span>%</span>
                      </label>
                    )}
                    {currentSubjectUsesEstimates && (
                      <span className="text-[11px] font-semibold text-amber-800">
                        Lab/activity marks calculated at {estimatePercentage}%
                      </span>
                    )}
                  </div>

                  {/* CA 1 Section */}
                  <ContinuousAssessmentSection
                    number={1}
                    title="Continuous Assessment 1"
                    testMax={currentSubject.test1Max}
                    test={currentSubject.test1}
                    onTestMaxChange={(val) => updateCurrentSubject({ test1Max: val })}
                    onTestChange={(val) => updateCurrentSubject({ test1: val })}
                    testPoints={breakdown.test1_p}
                    testWeight={breakdown.testWeight}
                    allowCustomTestMax={isComputationalThinking}
                    actNo={displayedSubject.act1No}
                    onActNoChange={(val) => updateCurrentSubject({ act1No: val })}
                    actScores={displayedSubject.act1Scores}
                    onActScoresChange={(scores) => updateCurrentSubject({ act1Scores: scores })}
                    actPoints={breakdown.act1_p}
                    actWeight={breakdown.actWeight}
                    actStartIndex={1}
                    labNo={displayedSubject.lab1No}
                    onLabNoChange={(val) => updateCurrentSubject({ lab1No: val })}
                    labScores={displayedSubject.lab1Scores}
                    onLabScoresChange={(scores) => updateCurrentSubject({ lab1Scores: scores })}
                    labPoints={breakdown.lab1_p}
                    labWeight={breakdown.labWeight}
                    labStartIndex={1}
                    subtotal={breakdown.ca1_total}
                    caMax={breakdown.caMax}
                    estimatedMarks={currentSubjectUsesEstimates}
                  />
                </div>

                {/* CA 2 Section */}
                <ContinuousAssessmentSection
                  number={2}
                  title="Continuous Assessment 2"
                  testMax={currentSubject.test2Max}
                  test={currentSubject.test2}
                  onTestMaxChange={(val) => updateCurrentSubject({ test2Max: val })}
                  onTestChange={(val) => updateCurrentSubject({ test2: val })}
                  testPoints={breakdown.test2_p}
                  testWeight={breakdown.testWeight}
                  allowCustomTestMax={isComputationalThinking}
                  actNo={displayedSubject.act2No}
                  onActNoChange={(val) => updateCurrentSubject({ act2No: val })}
                  actScores={displayedSubject.act2Scores}
                  onActScoresChange={(scores) => updateCurrentSubject({ act2Scores: scores })}
                  actPoints={breakdown.act2_p}
                  actWeight={breakdown.actWeight}
                  actStartIndex={(Number(displayedSubject.act1No) || 0) + 1}
                  labNo={displayedSubject.lab2No}
                  onLabNoChange={(val) => updateCurrentSubject({ lab2No: val })}
                  labScores={displayedSubject.lab2Scores}
                  onLabScoresChange={(scores) => updateCurrentSubject({ lab2Scores: scores })}
                  labPoints={breakdown.lab2_p}
                  labWeight={breakdown.labWeight}
                  labStartIndex={(Number(displayedSubject.lab1No) || 0) + 1}
                  subtotal={breakdown.ca2_total}
                  caMax={breakdown.caMax}
                  estimatedMarks={currentSubjectUsesEstimates}
                />

                {/* End Semester Section */}
                <EndSemesterSection
                  courseType={breakdown.courseType}
                  ese={currentSubject.ese}
                  onEseChange={(val) => updateCurrentSubject({ ese: val })}
                  eseLab={displayedSubject.eseLab}
                  onEseLabChange={(val) => updateCurrentSubject({ eseLab: val })}
                  eseLabMax={currentSubject.eseLabMax}
                  onEseLabMaxChange={(val) => updateCurrentSubject({ eseLabMax: val })}
                  esePoints={breakdown.ese_p}
                  eseTheoryPoints={breakdown.ese_theory_p}
                  eseLabPoints={breakdown.ese_lab_p}
                  eseTheoryWeight={breakdown.eseTheoryWeight}
                  eseLabWeight={breakdown.eseLabWeight}
                  internalTotal={breakdown.internal_total}
                  internalMax={breakdown.internalMax}
                  estimatedLabMark={currentSubjectUsesEstimates && breakdown.eseLabWeight > 0}
                />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-slate-300 bg-white p-4">
                  <button
                    type="button"
                    onClick={() => void handleCalculateMarks()}
                    disabled={calculationBusy}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider bg-[#172554] text-white hover:bg-[#1e3a8a] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {calculationBusy ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Calculator className="w-4 h-4" aria-hidden="true" />}
                    {calculationBusy ? 'Saving result…' : hasCalculatedCurrentSubject ? 'Recalculate Mark & Grade' : 'Calculate Mark & Grade'}
                  </button>
                </div>

                {/* Show the final marks and grade only after an explicit calculation. */}
                {hasCalculatedCurrentSubject && (
                  <div id="summary-at-end" className="pt-2">
                    <ResultsSummaryPanel breakdown={breakdown} subject={displayedSubject} />
                  </div>
                )}
              </div>
            ) : (
              /* Prompt when no subject has been selected yet from dialog box */
              <div className="bg-white border-2 border-[#172554] p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
                <div className="w-16 h-16 bg-slate-50 border-2 border-[#172554] text-[#172554] flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#172554] mb-2">
                  Please Select Subject
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 mb-6 max-w-lg mx-auto leading-relaxed">
                  Choose a course from the semester selector to calculate your Continuous Assessment and End Semester grades.
                </p>
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="px-6 py-3 bg-[#172554] text-white font-bold uppercase tracking-wider text-xs hover:bg-[#1e3a8a] transition-colors inline-flex items-center gap-2.5 cursor-pointer shadow-xs"
                >
                  <BookOpen className="w-4 h-4 text-amber-300" />
                  <span>Select Course Now</span>
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'grades' && (
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
            {/* Table 11: Grading of Courses */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#172554] mb-1 uppercase tracking-wide">
                Table 11 – Grading of Courses
              </h2>
              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#172554] text-white border-b-2 border-[#172554] text-xs font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-4">Grade</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4 text-center">Grade Points</th>
                      <th className="py-3 px-4">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                    {GRADE_SCALE.map((grade) => {
                      const isCurrent = hasCalculatedCurrentSubject && hasSubjectSelected && breakdown.grade.letter === grade.letter;
                      return (
                        <tr
                          key={grade.letter}
                          className={isCurrent ? 'bg-blue-50 font-bold text-[#172554]' : 'hover:bg-slate-50'}
                        >
                          <td className="py-3 px-4 text-base font-black text-[#172554]">{grade.letter}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{grade.label}</td>
                          <td className="py-3 px-4 text-center font-bold text-[#172554]">{grade.gradePoint}</td>
                          <td className="py-3 px-4">
                            {isCurrent ? (
                              <span className="inline-flex items-center gap-1 text-xs font-black text-[#172554] bg-blue-50 border border-blue-200 px-2 py-0.5 uppercase tracking-wider">
                                Current Grade
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Special grades from Table 11 */}
                    {SPECIAL_GRADES.map((sg) => (
                      <tr key={sg.code} className="hover:bg-slate-50 text-slate-600">
                        <td className="py-3 px-4 text-base font-black text-[#172554]">{sg.code}</td>
                        <td className="py-3 px-4 font-semibold text-slate-700">{sg.description}</td>
                        <td className="py-3 px-4 text-center font-bold text-[#172554]">{sg.gradePoint}</td>
                        <td className="py-3 px-4 text-slate-400">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 12: Range of Marks for Absolute grading system */}
            <div className="bg-white border border-slate-300 p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#172554] mb-1 uppercase tracking-wide">
                Table 12 – Range of Marks for Absolute grading system
              </h2>
              <p className="text-xs font-semibold text-slate-600 mb-4">
                Score ranges out of 100 total marks.
              </p>

              <div className="overflow-x-auto border border-slate-200">
                <table className="w-full text-center text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#172554] text-white border-b-2 border-[#172554] text-xs font-extrabold uppercase tracking-wider divide-x divide-white">
                      {GRADE_SCALE.map((g) => (
                        <th key={g.letter} className="py-3 px-3">
                          {g.letter}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="divide-x divide-[#172554] text-xs sm:text-sm font-bold text-[#172554]">
                      {GRADE_SCALE.map((g) => {
                        const isCurrent = hasCalculatedCurrentSubject && hasSubjectSelected && breakdown.grade.letter === g.letter;
                        return (
                          <td
                            key={g.letter}
                            className={`py-3.5 px-3 ${isCurrent ? 'bg-slate-200 font-black' : ''}`}
                          >
                            {g.rangeLabel}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
    
        {activeTab === 'gpa' && (
          <GPACalculator
            subjects={subjects}
            history={gpaHistory}
            onCalculate={handleCalculateGpa}
            includeEstimates={includeEstimates}
            estimatePercentage={estimatePercentage}
            onIncludeEstimatesChange={(enabled) => updateEstimateSettings(enabled)}
            onEstimatePercentageChange={(percentage) => updateEstimateSettings(includeEstimates, percentage)}
          />
        )}
      </main>

      {/* Floating Live Grade Pill (shows on calculator tab when subject is active) */}
      {activeTab === 'calculator' && hasSubjectSelected && (
        <aside
          aria-label="Current subject score snapshot"
          className="fixed bottom-18 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-30 bg-[#172554] dark:bg-slate-900 text-white p-3 border border-blue-900 dark:border-slate-700 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-blue-200 truncate">
              {currentSubject.name}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-black font-mono tabular-nums">
                {hasCalculatedCurrentSubject ? `${breakdown.total.toFixed(2)} / 100` : 'Calculating…'}
              </span>
              {hasCalculatedCurrentSubject && (
                <span className="text-xs font-mono font-bold px-1.5 py-0.2 bg-emerald-500 text-slate-950">
                  Grade {breakdown.grade.letter}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={scrollToSummary}
            className="px-2.5 py-1.5 bg-white text-[#172554] hover:bg-blue-50 text-[11px] font-bold uppercase tracking-wider shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
          >
            <span>Summary</span>
            <ArrowDown className="w-3 h-3" />
          </button>
        </aside>
      )}

      {/* Fixed Bottom Tab Bar */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-300 dark:border-slate-800 shadow-xl px-2 py-1.5 sm:py-2"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1 text-center">
          <button
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'calculator'
                ? 'text-[#172554] dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCourseSheetOpen(true)}
            className="py-1 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 hover:text-[#172554] dark:hover:text-blue-400 transition-colors cursor-pointer relative"
          >
            <div className="relative">
              <Layers className="w-5 h-5 mb-0.5" />
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#172554] dark:bg-blue-600 text-white font-mono text-[9px] font-bold rounded-full flex items-center justify-center">
                {subjects.length}
              </span>
            </div>
            <span className="text-[10px] font-bold tracking-tight">Courses ▾</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('gpa')}
            className={`py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'gpa'
                ? 'text-[#172554] dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">GPA Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('grades')}
            className={`py-1 flex flex-col items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'grades'
                ? 'text-[#172554] dark:text-blue-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TableProperties className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Grading</span>
          </button>

          <button
            type="button"
            onClick={() => void onSignOut()}
            disabled={signOutPending}
            className="py-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-bold tracking-tight">Logout</span>
          </button>
        </div>
      </nav>

      {/* Slide-Up Course Bottom Sheet */}
      <CourseBottomSheet
        isOpen={isCourseSheetOpen}
        onClose={() => setIsCourseSheetOpen(false)}
        subjects={subjects}
        currentSubjectId={currentSubject.id}
        onSelectSubject={(id) => {
          if (id !== currentSubjectId) calculationRevisionRef.current += 1;
          setCurrentSubjectId(id);
        }}
        onAddNewSubject={handleAddNewSubject}
        onDeleteSubject={handleDeleteSubject}
        calculatedSignatures={calculatedSignatures}
        semesterNumber={profile.semester}
      />

      {/* Academic Profile Setup Modal */}
      <AcademicSetupModal
        isOpen={isProfileModalOpen}
        initialProfile={profile}
        onSave={handleSaveProfile}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Subject Selection Modal Dialog Box */}
      <SubjectSelectionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSelectSubject={handleSelectSubjectFromDialog}
        currentSubjectName={currentSubject.name}
      />
    </div>
  );
}

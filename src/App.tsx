import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { AcademicProfileData, SubjectData } from './types';
import {
  DEFAULT_SUBJECT,
  calculateMarks,
  getCourseType,
  getCourseWeights,
  syncScoresArray,
  GRADE_SCALE,
  SPECIAL_GRADES,
} from './calculatorUtils';
import { ContinuousAssessmentSection } from './components/ContinuousAssessmentSection';
import { DynamicScoreBoxes } from './components/DynamicScoreBoxes';
import { EndSemesterSection } from './components/EndSemesterSection';
import { ResultsSummaryPanel } from './components/ResultsSummaryPanel';
import { SubjectHeader } from './components/SubjectHeader';
import {
  ELECTIVE_SLOTS_BY_SEMESTER,
  PRESET_COURSES,
  SubjectSelectionDialog,
  type PresetCourse,
  type SemesterNumber,
} from './components/SubjectSelectionDialog';
import {
  SemesterCourseDashboard,
  type CourseProgress,
  type SemesterCourseRow,
  type SemesterElectiveRow,
} from './components/SemesterCourseDashboard';
import { ProjectWorkAssessmentSection } from './components/ProjectWorkAssessmentSection';
import {
  applyEstimatedScores,
  GPACalculator,
  hasEstimateableComponents,
} from './components/GPACalculator';
import { MobileBottomNavigation } from './components/MobileBottomNavigation';
import { MobileCoursesSheet } from './components/MobileCoursesSheet';
import { DesktopCoursesPanel } from './components/DesktopCoursesPanel';
import { AcademicProfileFormValues, AcademicSetupScreen, ProfileDrawer } from './components/AcademicProfile';
import { StickyResultSummary } from './components/StickyResultSummary';
import { ThemeToggle, type AppTheme } from './components/ThemeToggle';
import { CGPAHub } from './components/CGPAHub';
import { GPA_COURSES } from './gpaCourses';
import { AuthScreen } from './components/AuthScreen';
import { FeedbackHub } from './components/FeedbackHub';
import { CreditsScreen } from './components/CreditsScreen';
import { auth, firebaseConfigReady } from './firebase';
import {
  importLegacySubjects,
  loadUserWorkspace,
  saveCalculatedGrade,
  saveGpaHistory,
  saveUserAcademicProfile,
  saveUserPreferences,
  skipLegacyMigration,
  syncUserSubjects,
  type GpaHistoryEntry,
} from './firebaseData';
import {
  BookOpen,
  Calculator,
  ArrowDown,
  GraduationCap,
  LoaderCircle,
  AlertCircle,
  ChevronDown,
  HelpCircle,
  Check,
} from 'lucide-react';

const LEGACY_STORAGE_KEY = 'ca_ese_calculator_sem1_user_selected_v18';
const THEME_STORAGE_KEY = 'calcredit_theme';
const GOOGLE_ACCOUNT_SELECTION_KEY = 'calcredit_choose_google_account_after_signout';

function getInitialTheme(): AppTheme {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch (error) {
    console.error('Unable to load the saved theme preference:', error);
    return 'light';
  }
}

function findSubjectForCourse(subjects: SubjectData[], course: PresetCourse): SubjectData | undefined {
  return subjects.find((subject) => {
    if (subject.id === `course_${course.id}` || subject.id === course.id) return true;
    if (course.code && subject.code && subject.code.trim().toUpperCase() === course.code.trim().toUpperCase()) return true;
    return subject.name.trim().toLowerCase() === course.name.trim().toLowerCase();
  });
}

function findPresetForSubject(subject: SubjectData): PresetCourse | undefined {
  return PRESET_COURSES.find((course) => {
    if (subject.id === `course_${course.id}` || subject.id === course.id) return true;
    if (course.code && subject.code && subject.code.trim().toUpperCase() === course.code.trim().toUpperCase()) return true;
    return subject.name.trim().toLowerCase() === course.name.trim().toLowerCase();
  });
}

function getSubjectSemester(subject: SubjectData): number | null {
  const match = subject.name.match(/(?:sem|semester)[-.\s_]*([1-8])/i) ||
                (subject.code && subject.code.match(/(?:sem|semester)[-.\s_]*([1-8])/i));
  if (match) {
    return parseInt(match[1], 10);
  }
  if (typeof subject.semester === 'number' && subject.semester >= 1 && subject.semester <= 8) {
    return subject.semester;
  }
  const preset = findPresetForSubject(subject);
  if (preset?.semester) {
    return preset.semester;
  }
  const gpaMatch = GPA_COURSES.find(
    (c) => (Boolean(c.code) && subject.code === c.code) ||
      c.name.trim().toLowerCase() === subject.name.trim().toLowerCase()
  );
  if (gpaMatch?.semester) {
    return gpaMatch.semester;
  }
  return null;
}

function normalizeSubjectForSyllabus(subject: SubjectData): SubjectData {
  const normalizedName = subject.name.trim().toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ');
  if (normalizedName === 'universal human values') return { ...subject, courseType: 'universal-human-values' };
  if (normalizedName === 'standards computer science & engg.') return { ...subject, courseType: 'standards-course' };
  if (normalizedName === 'industry oriented course i' || normalizedName === 'industry oriented course ii' || normalizedName === 'industry oriented course iii') {
    return { ...subject, courseType: 'industry-oriented-tests' };
  }
  if (normalizedName === 'audit course i' || normalizedName === 'audit course ii') return { ...subject, courseType: 'audit-course' };
  if (normalizedName === 'heritage of tamils' || normalizedName === 'tamils and technology') {
    const activityOneCount = Math.max(1, Math.floor(Number(subject.act1No) || 0));
    const activityTwoCount = Math.max(1, Math.floor(Number(subject.act2No) || 0));
    return {
      ...subject,
      courseType: 'heritage-course',
      act1No: activityOneCount,
      act1Scores: syncScoresArray(subject.act1Scores, activityOneCount),
      act2No: activityTwoCount,
      act2Scores: syncScoresArray(subject.act2Scores, activityTwoCount),
    };
  }
  if (normalizedName === 'self learning course') return { ...subject, code: 'CS23L01', courseType: 'self-learning' };
  if (normalizedName === 'skill development course i') return { ...subject, courseType: 'laboratory-course' };
  if (normalizedName === 'open elective ii') return { ...subject, code: '', courseType: 'theory' };
  if (normalizedName === 'cryptography and system security' || normalizedName === 'compiler design') return { ...subject, courseType: '3-0-2' };
  if (normalizedName === 'engineering entrepreneurship development') return { ...subject, code: 'UC23E01', courseType: '2-0-2' };
  if (normalizedName === 'perspectives of sustainable development' || normalizedName === 'perspectives of sustainability development') {
    return { ...subject, name: 'Perspectives of Sustainability Development', code: 'CS23U02', courseType: '2-0-2' };
  }
  if (normalizedName === 'makespace' || normalizedName === 'makerspace') return { ...subject, name: 'Makerspace', courseType: '1-0-4' };
  if (normalizedName === 'project work' || normalizedName === 'internship cum project work' || normalizedName === 'project work internship cum project work') {
    return { ...subject, name: 'Project Work / Internship cum Project Work', code: 'CS23801', courseType: 'project' };
  }
  const matchingPreset = PRESET_COURSES.find((course) =>
    course.name.trim().toLowerCase().replace(/[–—-]/g, ' ').replace(/\s+/g, ' ') === normalizedName
  );
  if (matchingPreset) {
    return { ...subject, name: matchingPreset.name, code: matchingPreset.code, courseType: matchingPreset.courseType };
  }
  return subject;
}

function mergeDuplicateProjectSubjects(subjects: SubjectData[]): SubjectData[] {
  const projects = subjects.filter((subject) => ['project', 'project-work'].includes(getCourseType(subject)));
  if (projects.length < 2) return subjects;
  const projectMarkKeys: Array<keyof NonNullable<SubjectData['projectWorkMarks']>> = [
    'reviewI', 'reviewII', 'reviewIII', 'thesisGuide', 'thesisExternal', 'vivaExternal', 'vivaInternal',
  ];
  const projectWithMostMarks = [...projects].sort((first, second) => {
    const countMarks = (subject: SubjectData) => projectMarkKeys.filter((key) => {
      const mark = subject.projectWorkMarks?.[key];
      return mark !== '' && mark !== null && mark !== undefined;
    }).length;
    return countMarks(second) - countMarks(first);
  })[0];
  const mergedProjectMark = (key: keyof NonNullable<SubjectData['projectWorkMarks']>) => {
    const markedSubject = projects.find((subject) => {
      const mark = subject.projectWorkMarks?.[key];
      return mark !== '' && mark !== null && mark !== undefined;
    });
    return markedSubject?.projectWorkMarks?.[key] ?? '';
  };
  const projectWorkMarks = {
    reviewI: mergedProjectMark('reviewI'),
    reviewII: mergedProjectMark('reviewII'),
    reviewIII: mergedProjectMark('reviewIII'),
    thesisGuide: mergedProjectMark('thesisGuide'),
    thesisExternal: mergedProjectMark('thesisExternal'),
    vivaExternal: mergedProjectMark('vivaExternal'),
    vivaInternal: mergedProjectMark('vivaInternal'),
  };
  const merged = {
    ...projectWithMostMarks,
    name: 'Project Work / Internship cum Project Work',
    code: 'CS23801',
    courseType: 'project' as const,
    projectWorkMarks,
  };
  const projectIds = new Set(projects.map((subject) => subject.id));
  return [...subjects.filter((subject) => !projectIds.has(subject.id)), merged];
}

function hasEnteredSubjectMarks(subject: SubjectData): boolean {
  const scalarMarks = [subject.ese, subject.eseLab, subject.test1, subject.test2,
    subject.act1No, subject.act2No, subject.lab1No, subject.lab2No,
    subject.labCourseWorkMark, subject.labCourseMidtermMark, subject.labCourseExamMark];
  return scalarMarks.some((value) => value !== '' && value !== null && value !== undefined) ||
    [...subject.act1Scores, ...subject.act2Scores, ...subject.lab1Scores, ...subject.lab2Scores]
      .some((value) => value !== '' && value !== null && value !== undefined) ||
    Object.values(subject.projectWorkMarks ?? {}).some((value) => value !== '' && value !== null && value !== undefined);
}

function getCourseProgress(subject: SubjectData | undefined, calculatedSignatures: Record<string, string>): CourseProgress {
  if (!subject) return 'Not started';
  if (calculatedSignatures[subject.id] === JSON.stringify(subject)) return 'Calculated';
  return hasEnteredSubjectMarks(subject) ? 'Marks entered' : 'Not started';
}

interface AuthenticatedAppProps {
  user: User | null;
  guestMode: boolean;
  onSignOut: () => Promise<void>;
  onExitGuest: () => void;
  signOutPending: boolean;
  signOutError: string;
  theme: AppTheme;
  onToggleTheme: () => void;
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
    <main className="min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-[#172554]">
        <LoaderCircle className="w-5 h-5 animate-spin" aria-hidden="true" />
        {message}
      </div>
    </main>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [guestMode, setGuestMode] = useState(false);
  const [theme, setTheme] = useState<AppTheme>(getInitialTheme);
  const [authResolved, setAuthResolved] = useState(false);
  const [authError, setAuthError] = useState('');
  const [forceGoogleAccountSelection, setForceGoogleAccountSelection] = useState(() => {
    try {
      return window.localStorage.getItem(GOOGLE_ACCOUNT_SELECTION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error('Unable to save the theme preference:', error);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }, []);

  useEffect(() => {
    if (!auth) {
      setAuthResolved(true);
      return;
    }
    return onAuthStateChanged(
      auth,
      (nextUser) => {
        setUser(nextUser);
        if (nextUser) {
          setForceGoogleAccountSelection(false);
          try {
            window.localStorage.removeItem(GOOGLE_ACCOUNT_SELECTION_KEY);
          } catch (error) {
            console.error('Unable to clear Google account selection preference:', error);
          }
        }
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

  const handleSignOut = async () => {
    if (!auth || signOutPending) return;
    setSignOutPending(true);
    setSignOutError('');
    setForceGoogleAccountSelection(true);
    try {
      window.localStorage.setItem(GOOGLE_ACCOUNT_SELECTION_KEY, 'true');
    } catch (error) {
      console.error('Unable to save Google account selection preference:', error);
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Unable to sign out:', error);
      setForceGoogleAccountSelection(false);
      try {
        window.localStorage.removeItem(GOOGLE_ACCOUNT_SELECTION_KEY);
      } catch (storageError) {
        console.error('Unable to clear Google account selection preference:', storageError);
      }
      setSignOutError('Could not log out. Please try again.');
      setSignOutPending(false);
    }
  };

  const handleContinueAsGuest = () => {
    setAuthError('');
    setGuestMode(true);
  };

  const handleExitGuest = () => setGuestMode(false);

  if (guestMode) {
    return (
      <AuthenticatedApp
        key="guest-session"
        user={null}
        guestMode
        onSignOut={handleSignOut}
        onExitGuest={handleExitGuest}
        signOutPending={false}
        signOutError=""
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (!firebaseConfigReady || !auth) {
    return (
      <AuthScreen
        configurationError="Firebase is not configured. Account sign-in is unavailable, but you can continue as a guest."
        forceGoogleAccountSelection={forceGoogleAccountSelection}
        onContinueAsGuest={handleContinueAsGuest}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (!authResolved) return <WorkspaceLoading message="Checking your sign-in…" />;

  if (authError) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <section className="max-w-lg w-full bg-white border border-rose-200 p-6 shadow-sm text-sm text-rose-900" role="alert">
          {authError}
          <button type="button" onClick={() => window.location.reload()} className="mt-4 block bg-[#172554] px-4 py-2.5 text-xs font-bold text-white">
            Reload
          </button>
        </section>
      </main>
    );
  }

  if (!user) return <AuthScreen forceGoogleAccountSelection={forceGoogleAccountSelection} onContinueAsGuest={handleContinueAsGuest} theme={theme} onToggleTheme={toggleTheme} />;

  return (
    <AuthenticatedApp
      key={user.uid}
      user={user}
      guestMode={false}
      onSignOut={handleSignOut}
      onExitGuest={handleExitGuest}
      signOutPending={signOutPending}
      signOutError={signOutError}
      theme={theme}
      onToggleTheme={toggleTheme}
    />
  );
}

function AuthenticatedApp({ user, guestMode, onSignOut, onExitGuest, signOutPending, signOutError, theme, onToggleTheme }: AuthenticatedAppProps) {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [profile, setProfile] = useState<AcademicProfileData | null>(null);
  const [currentSubjectId, setCurrentSubjectId] = useState('');
  const [selectedSemester, setSelectedSemester] = useState<SemesterNumber | null>(null);
  const [isSemesterMenuOpen, setIsSemesterMenuOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'grades' | 'gpa' | 'cgpa'>('calculator');
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [isDesktopCoursesOpen, setIsDesktopCoursesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showFeedbackHub, setShowFeedbackHub] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [includeEstimates, setIncludeEstimates] = useState(false);
  const [estimatePercentage, setEstimatePercentage] = useState(80);
  const [showEstimateHelp, setShowEstimateHelp] = useState(false);
  const estimateHelpRef = useRef<HTMLDivElement>(null);
  const [calculatedSignatures, setCalculatedSignatures] = useState<Record<string, string>>({});
  const [gpaHistory, setGpaHistory] = useState<GpaHistoryEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogElectiveSlot, setDialogElectiveSlot] = useState<string | null>(null);
  const [dataLoading, setDataLoading] = useState(Boolean(user));
  const [dataError, setDataError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isErrorDismissing, setIsErrorDismissing] = useState(false);
  const errorTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!showEstimateHelp) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEstimateHelp(false);
    };
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (estimateHelpRef.current && !estimateHelpRef.current.contains(e.target as Node)) {
        setShowEstimateHelp(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showEstimateHelp]);

  useEffect(() => {
    if (!saveError) {
      setIsErrorDismissing(false);
      return;
    }

    setIsErrorDismissing(false);
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }

    // Auto-dismiss after 7 seconds with left-to-right exit transition
    errorTimeoutRef.current = window.setTimeout(() => {
      setIsErrorDismissing(true);
      errorTimeoutRef.current = window.setTimeout(() => {
        setSaveError('');
        setIsErrorDismissing(false);
      }, 320);
    }, 7000);

    return () => {
      if (errorTimeoutRef.current) {
        window.clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [saveError]);

  const handleDismissSaveError = () => {
    if (errorTimeoutRef.current) {
      window.clearTimeout(errorTimeoutRef.current);
    }
    setIsErrorDismissing(true);
    errorTimeoutRef.current = window.setTimeout(() => {
      setSaveError('');
      setIsErrorDismissing(false);
    }, 320);
  };
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [legacySubjects, setLegacySubjects] = useState<SubjectData[]>([]);
  const [migrationResolved, setMigrationResolved] = useState(false);
  const [migrationBusy, setMigrationBusy] = useState(false);
  const [migrationError, setMigrationError] = useState('');
  const [calculationState, setCalculationState] = useState<'idle' | 'calculating' | 'saving' | 'success' | 'error'>('idle');
  const persistedSubjectsRef = useRef<Map<string, string>>(new Map());
  const persistQueueRef = useRef<Promise<void>>(Promise.resolve());
  const preferencesQueueRef = useRef<Promise<void>>(Promise.resolve());
  const preferencesSignatureRef = useRef('');
  const semesterMenuRef = useRef<HTMLDivElement>(null);
  const latestPreferencesRef = useRef({
    currentSubjectId,
    activeTab,
    includeEstimates,
    estimatePercentage,
    selectedSemester,
  });
  const calculationRevisionRef = useRef(0);

  useEffect(() => {
    if (!isSemesterMenuOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (semesterMenuRef.current && !semesterMenuRef.current.contains(event.target as Node)) {
        setIsSemesterMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isSemesterMenuOpen]);
  const mobileCoursesButtonRef = useRef<HTMLButtonElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const dialogReturnFocusRef = useRef<HTMLElement | null>(null);
  latestPreferencesRef.current = {
    currentSubjectId,
    activeTab,
    includeEstimates,
    estimatePercentage,
    selectedSemester,
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setDataLoading(true);
    setDataError('');
    void loadUserWorkspace(user.uid)
      .then((workspace) => {
        if (cancelled) return;
        const loadedSubjects = mergeDuplicateProjectSubjects(workspace.subjects.map(normalizeSubjectForSyllabus));
        setProfile(workspace.profile);
        const preferredId = workspace.preferences.currentSubjectId;
        const selectedId = loadedSubjects.some((subject) => subject.id === preferredId)
          ? preferredId
          : loadedSubjects[0]?.id ?? '';
        const recalculationRequiredTypes = new Set([
          'universal-human-values', 'standards-course', 'audit-course', 'heritage-course', 'self-learning',
          'laboratory-course', 'project', 'project-work',
        ]);
        const currentCalculationSignatures = { ...workspace.calculatedSignatures };
        loadedSubjects.forEach((subject) => {
          if (recalculationRequiredTypes.has(getCourseType(subject))) delete currentCalculationSignatures[subject.id];
        });
        setSubjects(loadedSubjects);
        setCurrentSubjectId(selectedId);
        const firstMatchedCourse = loadedSubjects.map(findPresetForSubject).find(Boolean);
        const savedSemester = workspace.preferences.selectedSemester;
        const initialSemester = savedSemester !== null && savedSemester >= 1 && savedSemester <= 8
          ? savedSemester as SemesterNumber
          : firstMatchedCourse?.semester ?? null;
        setSelectedSemester(initialSemester);
        setIsEditorOpen(false);
        setActiveTab(workspace.preferences.activeTab);
        setIncludeEstimates(workspace.preferences.includeEstimates);
        setEstimatePercentage(workspace.preferences.estimatePercentage);
        setCalculatedSignatures(currentCalculationSignatures);
        setGpaHistory(workspace.gpaHistory);
        setLegacySubjects(parseLegacySubjects());
        setMigrationResolved(workspace.migrationResolved);
        persistedSubjectsRef.current = workspace.persistedSubjectSnapshots;
        preferencesSignatureRef.current = JSON.stringify({
          currentSubjectId: selectedId,
          activeTab: workspace.preferences.activeTab,
          includeEstimates: workspace.preferences.includeEstimates,
          estimatePercentage: workspace.preferences.estimatePercentage,
          selectedSemester: initialSemester,
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
  }, [user?.uid, loadAttempt]);

  useEffect(() => {
    if (!user || dataLoading || dataError) return;
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
  }, [subjects, user?.uid, dataLoading, dataError]);

  useEffect(() => {
    if (!user || dataLoading || dataError) return;
    const preferences = {
      currentSubjectId,
      activeTab,
      includeEstimates,
      estimatePercentage,
      selectedSemester,
    };
    const signature = JSON.stringify(preferences);
    if (signature === preferencesSignatureRef.current) return;
    const timeout = window.setTimeout(() => {
      preferencesQueueRef.current = preferencesQueueRef.current
        .then(async () => {
          if (
            signature === preferencesSignatureRef.current ||
            signature !== JSON.stringify(latestPreferencesRef.current)
          ) return;
          await saveUserPreferences(user.uid, preferences);
          if (signature === JSON.stringify(latestPreferencesRef.current)) {
            preferencesSignatureRef.current = signature;
          }
        })
        .catch((error: unknown) => {
          console.error('Unable to save account preferences:', error);
          setSaveError('Your latest preferences could not be saved.');
        });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [currentSubjectId, activeTab, includeEstimates, estimatePercentage, selectedSemester, user?.uid, dataLoading, dataError]);

  useEffect(() => {
    if (isDialogOpen || !dialogReturnFocusRef.current) return;
    dialogReturnFocusRef.current.focus();
    dialogReturnFocusRef.current = null;
  }, [isDialogOpen]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentSubjectId]);

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
  const isIndustryOrientedTests = getCourseType(currentSubject) === 'industry-oriented-tests';
  const currentCourseType = getCourseType(currentSubject);
  const isUniversalHumanValues = currentCourseType === 'universal-human-values';
  const isSelfLearning = currentCourseType === 'self-learning';
  const isLaboratoryCourse = currentCourseType === 'laboratory-course';
  const isTwoTestCourse = ['industry-oriented-tests', 'standards-course', 'audit-course'].includes(currentCourseType);

  // Update specific fields of the current subject
  const updateCurrentSubject = (updates: Partial<SubjectData>) => {
    calculationRevisionRef.current += 1;
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== currentSubject.id) return s;

        const updated = { ...s, ...updates };

        // Preserve existing scores and default newly added entries to 8 when estimates are off.
        if (updates.act1No !== undefined) {
          const previousLength = updated.act1Scores.length;
          updated.act1Scores = syncScoresArray(updated.act1Scores, updates.act1No);
          if (!includeEstimates && !isUniversalHumanValues) {
            for (let index = previousLength; index < updated.act1Scores.length; index += 1) updated.act1Scores[index] = 8;
          }
        }
        if (updates.act2No !== undefined) {
          const previousLength = updated.act2Scores.length;
          updated.act2Scores = syncScoresArray(updated.act2Scores, updates.act2No);
          if (!includeEstimates && !isUniversalHumanValues) {
            for (let index = previousLength; index < updated.act2Scores.length; index += 1) updated.act2Scores[index] = 8;
          }
        }
        if (updates.lab1No !== undefined) {
          const previousLength = updated.lab1Scores.length;
          updated.lab1Scores = syncScoresArray(updated.lab1Scores, updates.lab1No);
          if (!includeEstimates && !isUniversalHumanValues) {
            for (let index = previousLength; index < updated.lab1Scores.length; index += 1) updated.lab1Scores[index] = 8;
          }
        }
        if (updates.lab2No !== undefined) {
          const previousLength = updated.lab2Scores.length;
          updated.lab2Scores = syncScoresArray(updated.lab2Scores, updates.lab2No);
          if (!includeEstimates && !isUniversalHumanValues) {
            for (let index = previousLength; index < updated.lab2Scores.length; index += 1) updated.lab2Scores[index] = 8;
          }
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

  const handleSemesterChange = (value: string) => {
    const semester = Number(value) as SemesterNumber;
    if (!Number.isInteger(semester) || semester < 1 || semester > 8) {
      setSelectedSemester(null);
      return;
    }
    setSelectedSemester(semester);
    setIsEditorOpen(false);
    if (activeTab !== 'cgpa') setActiveTab('calculator');
    setIsDesktopCoursesOpen(false);
    setShowFeedbackHub(false);
  };

  const handleOpenPresetCourse = (course: PresetCourse) => {
    calculationRevisionRef.current += 1;
    const isHeritageCourse =
      getCourseType({
        ...DEFAULT_SUBJECT,
        name: course.name,
        courseType: course.courseType,
      }) === 'heritage-course' ||
      course.name.trim().toLowerCase() === 'heritage of tamils' ||
      course.code === 'UC23H01';

    const stableId = `course_${course.id}`;
    let targetSubjectId = stableId;

    setSubjects((previous) => {
      const existing = findSubjectForCourse(previous, course);
      if (existing) {
        targetSubjectId = existing.id;
        if (isHeritageCourse) {
          const act1Count = Math.max(1, Number(existing.act1No) || 0);
          const act2Count = Math.max(1, Number(existing.act2No) || 0);
          return previous.map((subject) => {
            if (subject.id !== existing.id) return subject;
            return {
              ...subject,
              courseType: 'heritage-course',
              act1No: act1Count,
              act1Scores: syncScoresArray(subject.act1Scores, act1Count),
              act2No: act2Count,
              act2Scores: syncScoresArray(subject.act2Scores, act2Count),
            };
          });
        }
        if (course.electiveSlot) {
          const selected = previous.find((subject) => subject.id === existing.id);
          return selected
            ? [...previous.filter((subject) => subject.id !== selected.id), selected]
            : previous;
        }
        return previous;
      }

      const newSubject: SubjectData = {
        ...DEFAULT_SUBJECT,
        id: stableId,
        name: course.name,
        code: course.code,
        semester: course.semester,
        courseType: isHeritageCourse ? 'heritage-course' : course.courseType,
        ...(course.courseType === 'universal-human-values'
          ? { act1No: 1, act1Scores: [''], act2No: 1, act2Scores: [''] }
          : {}),
        ...(isHeritageCourse
          ? { act1No: 1, act1Scores: [''], act2No: 1, act2Scores: [''] }
          : {}),
        ...(course.courseType === 'self-learning' ? { selfLearningPassMark: 50 } : {}),
      };
      targetSubjectId = newSubject.id;
      return [...previous, newSubject];
    });

    setCurrentSubjectId(targetSubjectId);
    setSelectedSemester(course.semester);
    setActiveTab('calculator');
    setIsDesktopCoursesOpen(false);
    setShowFeedbackHub(false);
    setIsEditorOpen(true);
    setIsDialogOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenOtherCourse = (subject: SubjectData) => {
    setCurrentSubjectId(subject.id);
    setActiveTab('calculator');
    setIsDesktopCoursesOpen(false);
    setShowFeedbackHub(false);
    setIsEditorOpen(true);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleOpenElectivePicker = (slot: string) => {
    const activeElement = document.activeElement;
    dialogReturnFocusRef.current = activeElement instanceof HTMLElement &&
      activeElement.closest('#mobile-courses-sheet')
      ? mobileCoursesButtonRef.current
      : activeElement instanceof HTMLElement
        ? activeElement
        : null;
    setDialogElectiveSlot(slot);
    setIsDialogOpen(true);
  };

  const handleCloseSubjectDialog = () => {
    setIsDialogOpen(false);
  };

  const closeMobileCourses = useCallback(() => setIsMobileCoursesOpen(false), []);
  const closeProfileDrawer = useCallback(() => setIsProfileOpen(false), []);
  const handleOpenFeedbackHub = () => {
    setIsProfileOpen(false);
    setIsMobileCoursesOpen(false);
    setIsDesktopCoursesOpen(false);
    setShowCredits(false);
    setShowFeedbackHub(true);
  };

  const handleOpenGrades = () => {
    setIsProfileOpen(false);
    setIsMobileCoursesOpen(false);
    setIsDesktopCoursesOpen(false);
    setShowCredits(false);
    setShowFeedbackHub(false);
    setActiveTab('grades');
  };

  const handleOpenCredits = () => {
    setIsProfileOpen(false);
    setIsMobileCoursesOpen(false);
    setIsDesktopCoursesOpen(false);
    setShowFeedbackHub(false);
    setShowCredits(true);
  };

  const handleSaveAcademicProfile = async (values: AcademicProfileFormValues) => {
    const { selectedSemester: nextSemester, ...nextProfile } = values;
    const nextActiveTab = selectedSemester !== nextSemester ? 'calculator' : activeTab;
    const nextPreferences = {
      currentSubjectId,
      activeTab: nextActiveTab,
      includeEstimates,
      estimatePercentage,
      selectedSemester: nextSemester,
    };
    latestPreferencesRef.current = nextPreferences;

    if (user) {
      const saveTask = preferencesQueueRef.current.then(async () => {
        await saveUserAcademicProfile(user.uid, nextProfile, nextPreferences);
        preferencesSignatureRef.current = JSON.stringify(nextPreferences);
      });
      preferencesQueueRef.current = saveTask.catch(() => undefined);
      await saveTask;
    }

    setProfile(nextProfile);
    setSelectedSemester(nextSemester);
    setActiveTab(nextActiveTab);
    if (selectedSemester !== nextSemester) {
      setIsEditorOpen(false);
      setIsMobileCoursesOpen(false);
      setIsDialogOpen(false);
    }
    setSaveError('');
  };

  const handleProfileLogout = () => {
    setIsProfileOpen(false);
    setIsMobileCoursesOpen(false);
    if (user) {
      void onSignOut();
    } else {
      onExitGuest();
    }
  };

  const handleReset = () => {
    updateCurrentSubject({
      ...DEFAULT_SUBJECT,
      id: currentSubject.id,
      name: currentSubject.name,
      code: currentSubject.code,
      courseType: currentSubject.courseType,
      ...(getCourseType(currentSubject) === 'heritage-course'
        ? { act1No: 1, act1Scores: [''], act2No: 1, act2Scores: [''] }
        : {}),
    });
  };

  const handleImportLegacy = async () => {
    if (!user || migrationBusy || legacySubjects.length === 0) return;
    setMigrationBusy(true);
    setMigrationError('');
    try {
      const imported = await importLegacySubjects(
        user.uid,
        mergeDuplicateProjectSubjects(legacySubjects.map(normalizeSubjectForSyllabus)),
        subjects
      );
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
    if (!user || migrationBusy) return;
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
    if (calculationState === 'calculating' || calculationState === 'saving') return;
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
    const presetCourse = PRESET_COURSES.find(
      (item) => (Boolean(item.code) && item.code === subjectSnapshot.code) ||
        item.name.trim().toLowerCase() === subjectSnapshot.name.trim().toLowerCase()
    );
    const course = presetCourse?.electiveSlot
      ? GPA_COURSES.find((item) =>
          item.semester === presetCourse.semester && item.electiveSlot === presetCourse.electiveSlot
        )
      : GPA_COURSES.find(
          (item) => (Boolean(item.code) && item.code === subjectSnapshot.code) ||
            item.name.toLowerCase() === subjectSnapshot.name.trim().toLowerCase() ||
            (item.code === 'CS23801' && ['project', 'project-work'].includes(subjectSnapshot.courseType ?? ''))
        );
    const hasMark = (value: number | string | null | undefined) => value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value));
    const calculationType = getCourseType(subjectSnapshot);
    let incompleteMessage = '';
    if (calculationType === 'self-learning' && !hasMark(subjectSnapshot.ese)) {
      incompleteMessage = 'Enter the final mark from the approved Self-Learning Course provider.';
    } else if (calculationType === 'universal-human-values' && (
      !hasMark(subjectSnapshot.test1) ||
      Number(subjectSnapshot.act1No) < 1 || Number(subjectSnapshot.act2No) < 1 ||
      subjectSnapshot.act1Scores.slice(0, Number(subjectSnapshot.act1No)).some((score) => !hasMark(score)) ||
      subjectSnapshot.act2Scores.slice(0, Number(subjectSnapshot.act2No)).some((score) => !hasMark(score))
    )) {
      incompleteMessage = 'Enter the UHV test mark and at least one assignment mark in each 15% assessment.';
    } else if (calculationType === 'laboratory-course' && [subjectSnapshot.labCourseWorkMark, subjectSnapshot.labCourseMidtermMark, subjectSnapshot.labCourseExamMark].some((mark) => !hasMark(mark))) {
      incompleteMessage = 'Enter all three laboratory-course marks before calculating.';
    } else if ((calculationType === 'project' || calculationType === 'project-work') && Object.values(subjectSnapshot.projectWorkMarks ?? {}).some((mark) => !hasMark(mark))) {
      incompleteMessage = 'Enter all review, project-report, and viva marks before calculating.';
    } else if (calculationType !== 'self-learning' && calculationType !== 'universal-human-values' && calculationType !== 'laboratory-course' && calculationType !== 'project' && calculationType !== 'project-work') {
      const weights = getCourseWeights(calculationType);
      if (weights.testWeight > 0 && (!hasMark(subjectSnapshot.test1) || !hasMark(subjectSnapshot.test2))) incompleteMessage = 'Enter marks for both assessments before calculating.';
      else if (weights.actWeight > 0 && (!includeEstimates && (Number(subjectSnapshot.act1No) < 1 || Number(subjectSnapshot.act2No) < 1 || subjectSnapshot.act1Scores.slice(0, Number(subjectSnapshot.act1No)).some((mark) => !hasMark(mark)) || subjectSnapshot.act2Scores.slice(0, Number(subjectSnapshot.act2No)).some((mark) => !hasMark(mark))))) incompleteMessage = 'Enter at least one activity mark for each assessment before calculating.';
      else if (weights.labWeight > 0 && (!includeEstimates && (Number(subjectSnapshot.lab1No) < 1 || Number(subjectSnapshot.lab2No) < 1 || subjectSnapshot.lab1Scores.slice(0, Number(subjectSnapshot.lab1No)).some((mark) => !hasMark(mark)) || subjectSnapshot.lab2Scores.slice(0, Number(subjectSnapshot.lab2No)).some((mark) => !hasMark(mark))))) incompleteMessage = 'Enter at least one practical/lab mark for each assessment before calculating.';
      else if (weights.eseTheoryWeight > 0 && !hasMark(subjectSnapshot.ese)) incompleteMessage = 'Enter the end-semester theory mark before calculating.';
      else if (weights.eseLabWeight > 0 && !includeEstimates && !hasMark(subjectSnapshot.eseLab)) incompleteMessage = 'Enter the end-semester practical mark or enable estimates before calculating.';
    }
    if (incompleteMessage) {
      setSaveError(incompleteMessage);
      return;
    }

    setCalculationState('calculating');
    setSaveError('');
    try {
      if (user) {
        setCalculationState('saving');
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
      }

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
      setCalculationState('success');
    } catch (error) {
      console.error('Unable to save calculated grade:', error);
      setCalculationState('error');
      setSaveError('The latest marks or result could not be saved. Check your connection and recalculate.');
    }
  };

  const handleCalculateGpa = async (entry: GpaHistoryEntry) => {
    if (user) await saveGpaHistory(user.uid, entry);
    setGpaHistory((previous) => [entry, ...previous].sort((a, b) => b.createdAtMs - a.createdAtMs));
  };

  // Perform calculations
  const breakdown = useMemo(() => {
    return calculateMarks(displayedSubject);
  }, [displayedSubject]);

  const semesterCourseRows = useMemo<SemesterCourseRow[]>(() => {
    if (selectedSemester === null) return [];
    return PRESET_COURSES
      .filter((course) => course.semester === selectedSemester && course.group !== 'elective')
      .map((course) => {
        const subject = findSubjectForCourse(subjects, course) ?? null;
        return { course, subject, progress: getCourseProgress(subject ?? undefined, calculatedSignatures) };
      });
  }, [selectedSemester, subjects, calculatedSignatures]);

  const semesterElectiveRows = useMemo<SemesterElectiveRow[]>(() => {
    if (selectedSemester === null) return [];
    return (ELECTIVE_SLOTS_BY_SEMESTER[selectedSemester] ?? []).map((slot) => {
      const existingOption = subjects
        .map((subject) => ({ subject, course: findPresetForSubject(subject) }))
        .filter((entry) => entry.course?.semester === selectedSemester && entry.course.group === 'elective' && entry.course.electiveSlot === slot)
        .at(-1);
      const course = existingOption?.course ?? null;
      const subject = existingOption?.subject ?? null;
      return { slot, course, subject, progress: getCourseProgress(subject ?? undefined, calculatedSignatures) };
    });
  }, [selectedSemester, subjects, calculatedSignatures]);

  const mobileElectiveOptions = useMemo(() => Object.fromEntries(
    (selectedSemester === null ? [] : ELECTIVE_SLOTS_BY_SEMESTER[selectedSemester] ?? []).map((slot) => [
      slot,
      PRESET_COURSES.filter((course) => course.semester === selectedSemester && course.electiveSlot === slot),
    ])
  ), [selectedSemester]);

  const otherCourseRows = useMemo(() => {
    if (selectedSemester === null) return [];
    return subjects
      .filter((subject) => {
        if (!subject.name.trim() || findPresetForSubject(subject)) return false;
        const courseSemester = getSubjectSemester(subject);
        if (courseSemester !== null) {
          return courseSemester === selectedSemester;
        }
        return false;
      })
      .map((subject) => ({ subject, progress: getCourseProgress(subject, calculatedSignatures) }));
  }, [subjects, calculatedSignatures, selectedSemester]);

  const courseFlow = useMemo(() => [
    ...semesterCourseRows.map((row) => ({ kind: 'course' as const, course: row.course, subject: row.subject })),
    ...semesterElectiveRows.map((row) => ({ kind: 'elective' as const, course: row.course, subject: row.subject, slot: row.slot })),
    ...otherCourseRows.map((row) => ({ kind: 'other' as const, subject: row.subject })),
  ], [semesterCourseRows, semesterElectiveRows, otherCourseRows]);
  const currentCourseFlowIndex = courseFlow.findIndex((item) => item.subject?.id === currentSubjectId);
  const nextCourseFlowItem = currentCourseFlowIndex >= 0
    ? courseFlow[currentCourseFlowIndex + 1]
    : undefined;
  const nextCourseActionLabel = currentCourseFlowIndex < 0
    ? null
    : nextCourseFlowItem
      ? 'Next Course'
      : 'Go to GPA Hub';

  const handleNextCourse = () => {
    if (!hasCalculatedCurrentSubject || currentCourseFlowIndex < 0) return;
    if (!nextCourseFlowItem) {
      setIsMobileCoursesOpen(false);
      setActiveTab('gpa');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }

    if (nextCourseFlowItem.kind === 'elective' && !nextCourseFlowItem.course) {
      setIsMobileCoursesOpen(false);
      handleOpenElectivePicker(nextCourseFlowItem.slot);
    } else if (nextCourseFlowItem.kind === 'other') {
      handleOpenOtherCourse(nextCourseFlowItem.subject);
    } else if (nextCourseFlowItem.course) {
      handleOpenPresetCourse(nextCourseFlowItem.course);
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const allSemesterCoursesCalculated = useMemo(() => {
    if (selectedSemester === null || semesterCourseRows.length === 0) return false;
    const projectOptions = semesterCourseRows.filter(({ course }) =>
      ['project', 'project-work'].includes(course.courseType)
    );
    const requiredCourses = semesterCourseRows.filter(({ course }) =>
      !['project', 'project-work'].includes(course.courseType)
    );
    const coreCoursesCalculated = requiredCourses.every((row) => row.progress === 'Calculated');
    const projectRequirementMet = projectOptions.length === 0 ||
      projectOptions.some((row) => row.progress === 'Calculated');
    const electiveSlotsCalculated = semesterElectiveRows.every(
      (row) => Boolean(row.course) && row.progress === 'Calculated'
    );
    return coreCoursesCalculated && projectRequirementMet && electiveSlotsCalculated;
  }, [selectedSemester, semesterCourseRows, semesterElectiveRows]);

  const scrollToSummary = () => {
    document.getElementById('summary-at-end')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (signOutPending) return <WorkspaceLoading message="Signing out…" />;
  if (dataLoading) return <WorkspaceLoading message="Loading your courses…" />;

  if (dataError) {
    return (
      <main className="min-h-screen bg-transparent flex items-center justify-center p-6">
        <section className="max-w-lg w-full bg-white border border-slate-300 p-6 shadow-sm">
          <div className="flex items-start gap-3 text-rose-900">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm" role="alert">{dataError}</p>
          </div>
          <div className="flex gap-3 mt-5">
            <button type="button" onClick={() => setLoadAttempt((count) => count + 1)} className="bg-[#172554] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e3a8a]">
              Retry
            </button>
            <button type="button" onClick={onSignOut} className="border border-slate-300 px-4 py-2.5 text-xs font-bold text-[#172554] hover:bg-slate-50">
              Log out
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (user && !profile) {
    return (
      <AcademicSetupScreen
        profile={profile}
        initialSemester={selectedSemester}
        email={user.email ?? ''}
        guestMode={false}
        onSave={handleSaveAcademicProfile}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-transparent text-slate-900 flex flex-col font-sans">
      {/* Top Bar */}
      <div className="sticky top-0 z-30">
      <header className="bg-white border-b border-slate-200 shadow-sm pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-14 py-1.5 sm:h-14 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand wordmark */}
          <button
            ref={profileButtonRef}
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-label="Open student profile"
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            aria-controls={isProfileOpen ? 'academic-profile-drawer' : undefined}
            className="flex min-w-0 shrink items-center gap-2 text-left text-base font-black tracking-tight text-[#172554] transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] sm:text-xl"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#172554] text-blue-100">
              <span className="text-sm font-black tracking-[-0.12em]" aria-hidden="true">CC</span>
              <span className="absolute bottom-1.5 h-0.5 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="tracking-[0.08em]">CalCredit</span>
            </span>
          </button>

          <div className="hidden min-w-0 max-w-44 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
            <div className="min-w-0">
              <p
                className="truncate text-xs font-bold text-[#172554]"
                title={profile?.studentName.trim() || (guestMode ? 'Guest Student' : 'Student')}
              >
                {profile?.studentName.trim() || (guestMode ? 'Guest Student' : 'Student')}
              </p>
              <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">CSE</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-[#172554]">
            <button
              type="button"
              onClick={() => { setIsDesktopCoursesOpen(false); setShowFeedbackHub(false); setShowCredits(false); setActiveTab('calculator'); }}
              aria-label="Assessment Calculator"
              className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${
                activeTab === 'calculator'
                  ? 'text-[#172554] font-black border-b-2 border-[#172554]'
                  : 'text-slate-600 hover:text-[#172554]'
              }`}
            >
              <Calculator className="w-5 h-5" />
              <span className="hidden lg:inline">Assessment Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsMobileCoursesOpen(false);
                setShowFeedbackHub(false);
                setShowCredits(false);
                setIsDesktopCoursesOpen(true);
              }}
              aria-label="Courses"
              className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${
                isDesktopCoursesOpen
                  ? 'text-[#172554] font-black border-b-2 border-[#172554]'
                  : 'text-slate-600 hover:text-[#172554]'
              }`}
              aria-current={isDesktopCoursesOpen ? 'page' : undefined}
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden lg:inline">Courses</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsDesktopCoursesOpen(false); setShowFeedbackHub(false); setShowCredits(false); setActiveTab('gpa'); }}
            aria-label="GPA Calculator"
            className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${activeTab === 'gpa' ? 'text-[#172554] font-black border-b-2 border-[#172554]' : 'text-slate-600 hover:text-[#172554]'}`}
            >
            <GraduationCap className="w-5 h-5" />
            <span className="hidden lg:inline">GPA Calculator</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsDesktopCoursesOpen(false); setShowFeedbackHub(false); setShowCredits(false); setActiveTab('cgpa'); }}
              aria-label="CGPA Hub"
              className={`transition-colors flex items-center gap-2 py-1 cursor-pointer ${activeTab === 'cgpa' ? 'text-[#172554] font-black border-b-2 border-[#172554]' : 'text-slate-600 hover:text-[#172554]'}`}
            >
              <GraduationCap className="w-5 h-5" aria-hidden="true" />
              <span className="hidden lg:inline">CGPA Hub</span>
            </button>
          </nav>

          <label className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] font-bold text-[#172554] sm:gap-2">
            <span className="hidden md:inline">Semester</span>
            <div ref={semesterMenuRef} className="relative">
              <button
                type="button"
                aria-label="Choose semester"
                aria-haspopup="listbox"
                aria-expanded={isSemesterMenuOpen}
                onClick={() => setIsSemesterMenuOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setIsSemesterMenuOpen(false);
                  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                    event.preventDefault();
                    setIsSemesterMenuOpen(true);
                  }
                }}
                className="inline-flex h-10 min-w-24 items-center justify-between gap-2 rounded-full border border-[var(--app-divider)] bg-[var(--app-surface)] pl-3 pr-3 text-xs font-bold text-[var(--app-primary-text)] shadow-sm transition-colors hover:border-[var(--app-action-accent)] focus:border-[var(--app-action-accent)] focus:outline-2 focus:outline-[var(--app-action-accent)] sm:min-w-28 sm:pl-4"
              >
                <span>{selectedSemester ? `Semester ${selectedSemester}` : 'Choose…'}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isSemesterMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isSemesterMenuOpen && (
                <div
                  role="listbox"
                  aria-label="Semester options"
                  className="absolute right-0 z-40 mt-2 w-36 overflow-hidden rounded-xl border border-[var(--app-divider)] bg-[var(--app-surface)] p-1.5 shadow-lg ring-1 ring-black/5"
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedSemester === null}
                    onClick={() => { handleSemesterChange(''); setIsSemesterMenuOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                      selectedSemester === null
                        ? 'bg-[var(--app-soft-accent)] text-[var(--app-action-accent-strong)] font-bold'
                        : 'text-[var(--app-primary-text)] hover:bg-[var(--app-structural-accent)]/10 hover:text-[var(--app-action-accent-strong)]'
                    }`}
                  >
                    <span>Choose…</span>
                    {selectedSemester === null && <Check className="h-3.5 w-3.5 text-[var(--app-action-accent-strong)]" aria-hidden="true" />}
                  </button>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => {
                    const isSelected = selectedSemester === semester;
                    return (
                      <button
                        key={semester}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => { handleSemesterChange(String(semester)); setIsSemesterMenuOpen(false); }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-[var(--app-soft-accent)] text-[var(--app-action-accent-strong)] font-bold'
                            : 'text-[var(--app-primary-text)] hover:bg-[var(--app-structural-accent)]/10 hover:text-[var(--app-action-accent-strong)]'
                        }`}
                      >
                        <span>Semester {semester}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-[var(--app-action-accent-strong)]" aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </label>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        </div>
      </header>
      {!showFeedbackHub && !showCredits && activeTab === 'calculator' && isEditorOpen && hasSubjectSelected && (
        hasCalculatedCurrentSubject ? (
          <StickyResultSummary
            key={currentSubject.id}
            subjectName={currentSubject.name}
            total={breakdown.total}
            grade={breakdown.grade.letter}
            gradePoint={breakdown.grade.gradePoint}
            actionLabel={nextCourseActionLabel}
            onAction={handleNextCourse}
            onSummary={scrollToSummary}
          />
        ) : (
          <div
            key={currentSubject.id}
            className="w-full border-b border-slate-200 bg-white shadow-xs animate-[sticky-result-in_160ms_ease-out]"
            role="status"
            aria-live="polite"
            aria-label="Current subject status"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:px-8 sm:py-2.5">
              <span className="truncate text-xs sm:text-sm font-black text-[#172554]" title={currentSubject.name}>
                {currentSubject.name}
              </span>
              {hasEnteredSubjectMarks(currentSubject) && (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-amber-800">
                  <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden="true" />
                  Enter all marks
                </span>
              )}
            </div>
          </div>
        )
      )}
      </div>

      <MobileBottomNavigation
        activeTab={showFeedbackHub || showCredits ? null : activeTab}
        coursesOpen={isMobileCoursesOpen}
        onNavigate={(tab) => {
          setIsMobileCoursesOpen(false);
          setIsDesktopCoursesOpen(false);
          setShowFeedbackHub(false);
          setShowCredits(false);
          setActiveTab(tab);
        }}
        onToggleCourses={() => {
          setShowFeedbackHub(false);
          setShowCredits(false);
          setIsMobileCoursesOpen((open) => !open);
        }}
        coursesButtonRef={mobileCoursesButtonRef}
      />

      {saveError && (
        <div
          className={`fixed inset-x-3 z-[100] flex items-start justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900 shadow-lg sm:inset-x-auto sm:right-6 sm:w-[min(28rem,calc(100vw-3rem))] ${
            isErrorDismissing ? 'toast-exit-lr pointer-events-none' : 'toast-in'
          } bottom-[calc(6.25rem+env(safe-area-inset-bottom))] md:bottom-6`}
          role="alert"
          aria-live="assertive"
        >
          <span className="min-w-0 break-words">{saveError}</span>
          <button
            type="button"
            onClick={handleDismissSaveError}
            className="min-h-11 shrink-0 font-bold underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-8">
        {guestMode && !showCredits && (
          <div className="mb-5 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950" role="status">
            <strong className="font-black">Guest session:</strong>{' '}
            Your courses and results exist only in memory and will be cleared when you reload or close this page.
          </div>
        )}
        {signOutError && (
          <div className="mb-5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">{signOutError}</div>
        )}

        {user && !migrationResolved && legacySubjects.length > 0 && (
          <section className="mb-6 border border-amber-300 bg-amber-50 p-4 sm:p-5" aria-labelledby="migration-heading">
            <h2 id="migration-heading" className="font-black text-[#172554]">Existing browser data found</h2>
            <p className="mt-1 text-sm text-slate-700">
              There are {legacySubjects.length} saved course{legacySubjects.length === 1 ? '' : 's'} in this browser. These records predate sign-in and are not linked to an account; import only if they belong to you. Importing copies them into {user.email ?? 'your account'} without replacing cloud records or deleting the browser copy.
            </p>
            {migrationError && <p className="mt-2 text-sm font-semibold text-rose-800" role="alert">{migrationError}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleImportLegacy()} disabled={migrationBusy} className="inline-flex items-center gap-2 bg-[#172554] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1e3a8a] disabled:opacity-60">
                {migrationBusy && <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />}
                Import a copy
              </button>
              <button type="button" onClick={() => void handleSkipLegacy()} disabled={migrationBusy} className="border border-slate-400 bg-white px-4 py-2.5 text-xs font-bold text-[#172554] hover:bg-slate-50 disabled:opacity-60">
                Keep account separate
              </button>
            </div>
          </section>
        )}

        {showFeedbackHub ? (
          <FeedbackHub
            user={user}
            guestMode={guestMode}
          />
        ) : showCredits ? <CreditsScreen /> : null}

        {!showFeedbackHub && !showCredits && isDesktopCoursesOpen && (
          <div className="hidden md:block">
            <DesktopCoursesPanel
              semester={selectedSemester}
              courses={semesterCourseRows}
              electiveSlots={semesterElectiveRows}
              electiveOptions={mobileElectiveOptions}
              otherCourses={otherCourseRows}
              selectedSubjectId={isEditorOpen ? currentSubjectId : ''}
              allCoursesCalculated={allSemesterCoursesCalculated}
              onSelectCourse={handleOpenPresetCourse}
              onSelectElective={handleOpenElectivePicker}
              onSelectOtherCourse={handleOpenOtherCourse}
              onCalculateGpa={() => {
                setIsDesktopCoursesOpen(false);
                setActiveTab('gpa');
              }}
            />
          </div>
        )}

        <div className={isDesktopCoursesOpen ? 'md:hidden' : ''}>
        {!showFeedbackHub && !showCredits && activeTab === 'calculator' && selectedSemester === null && (
          <section className="mx-auto my-6 max-w-xl border border-slate-300 bg-white px-4 py-5 text-center shadow-sm sm:px-6 sm:py-6">
            <h1 className="text-lg font-black text-[#172554]">Choose your semester</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">Select a semester from the menu at the top right to see its courses and start entering marks.</p>
          </section>
        )}

        {!showFeedbackHub && !showCredits && activeTab === 'calculator' && selectedSemester !== null && (
          <div className="min-w-0 space-y-6">
            <div className={`min-w-0 ${isEditorOpen ? 'hidden md:block' : ''}`}>
              <SemesterCourseDashboard
                semester={selectedSemester}
                courses={semesterCourseRows}
                electiveSlots={semesterElectiveRows}
                otherCourses={otherCourseRows}
                selectedSubjectId={isEditorOpen ? currentSubjectId : ''}
                allCoursesCalculated={allSemesterCoursesCalculated}
                onSelectCourse={handleOpenPresetCourse}
                onSelectElective={handleOpenElectivePicker}
                onSelectOtherCourse={handleOpenOtherCourse}
                onCalculateGpa={() => setActiveTab('gpa')}
              />
            </div>

            {isEditorOpen && hasSubjectSelected && (
              <div className="min-w-0">
                <SubjectHeader
                  subject={currentSubject}
                  onResetToBlank={handleReset}
                />
              <div className="space-y-5">
                {/* Course Type Specification */}
                <div>
                  {breakdown.courseType !== 'heritage-course' && (
                    <div className="text-xs sm:text-sm font-bold text-[#172554] mb-2.5">
                      Course type: {breakdown.courseTypeLabel}
                    </div>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border border-slate-300 bg-white px-3 py-2.5">
                    <div className="inline-flex items-center gap-1.5">
                      <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#172554] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={includeEstimates}
                          onChange={(event) => updateEstimateSettings(event.target.checked)}
                          className="h-4 w-4 accent-[#172554]"
                        />
                        <span>Include estimated lab &amp; activity average</span>
                      </label>

                      {/* Accessible help tooltip/popover */}
                      <div className="relative inline-flex items-center" ref={estimateHelpRef}>
                        <button
                          type="button"
                          onClick={() => setShowEstimateHelp((prev) => !prev)}
                          className="p-1 text-slate-400 hover:text-[#172554] focus:outline-hidden focus:text-[#172554] cursor-pointer rounded-full transition-colors"
                          aria-label="How estimated marks work"
                          aria-expanded={showEstimateHelp}
                          aria-controls="estimate-help-popover"
                        >
                          <HelpCircle className="w-4 h-4" aria-hidden="true" />
                        </button>
                        {showEstimateHelp && (
                          <div
                            id="estimate-help-popover"
                            role="tooltip"
                            className="absolute left-0 top-full mt-1.5 z-40 w-72 sm:w-80 rounded-lg border border-slate-300 bg-white p-3.5 shadow-xl text-xs text-slate-700 space-y-2 animate-[sticky-result-in_160ms_ease-out]"
                          >
                            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                              <p className="font-bold text-[#172554]">Estimated Lab &amp; Activity Marks</p>
                              <button
                                type="button"
                                onClick={() => setShowEstimateHelp(false)}
                                className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer"
                                aria-label="Close help"
                              >
                                ✕
                              </button>
                            </div>
                            <p className="leading-relaxed text-[11px]">
                              When enabled, missing lab practicals, assignments, or activities are projected at this percentage (default 80%) so you can preview your overall grade early.
                            </p>
                            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600">
                              <li><strong>Entered marks are kept:</strong> Any marks you manually type are always preserved and never overwritten by the estimate.</li>
                              <li><strong>Missing scores only:</strong> The percentage is only applied to unentered activities or unentered ESE lab marks.</li>
                              <li><strong>Customizable:</strong> Adjust the percentage anytime to test different outcome scenarios.</li>
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
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

                  {isLaboratoryCourse ? (
                    <section className="space-y-3 border border-slate-300 bg-white p-4 sm:p-5" aria-labelledby="lab-course-heading">
                      <h3 id="lab-course-heading" className="font-black text-[#172554]">Laboratory Course Assessment</h3>
                      <p className="text-sm text-slate-600">Regulation 17.6: work/observation/record 45%, midterm practical test 15%, and end-semester practical examination 40%.</p>
                      <label className="block text-xs font-bold text-[#172554]" htmlFor="lab-course-work">Student work, observation and record — 45%</label>
                      <input id="lab-course-work" type="number" min={0} max={100} step={0.5} value={currentSubject.labCourseWorkMark ?? ''} onChange={(event) => {
                        const raw = event.currentTarget.value;
                        updateCurrentSubject({ labCourseWorkMark: raw === '' ? '' : Math.min(100, Math.max(0, Number(raw) || 0)) });
                      }} className="w-full max-w-xs border border-[#172554] bg-white px-3 py-2 text-base font-bold text-[#172554]" placeholder="Score out of 100" />
                      <label className="block text-xs font-bold text-[#172554]" htmlFor="lab-course-midterm">Midterm practical test — 15%</label>
                      <input id="lab-course-midterm" type="number" min={0} max={100} step={0.5} value={currentSubject.labCourseMidtermMark ?? ''} onChange={(event) => {
                        const raw = event.currentTarget.value;
                        updateCurrentSubject({ labCourseMidtermMark: raw === '' ? '' : Math.min(100, Math.max(0, Number(raw) || 0)) });
                      }} className="w-full max-w-xs border border-[#172554] bg-white px-3 py-2 text-base font-bold text-[#172554]" placeholder="Score out of 100" />
                      <label className="block text-xs font-bold text-[#172554]" htmlFor="lab-course-exam">End-semester practical examination — 40%</label>
                      <input id="lab-course-exam" type="number" min={0} max={100} step={0.5} value={currentSubject.labCourseExamMark ?? ''} onChange={(event) => {
                        const raw = event.currentTarget.value;
                        updateCurrentSubject({ labCourseExamMark: raw === '' ? '' : Math.min(100, Math.max(0, Number(raw) || 0)) });
                      }} className="w-full max-w-xs border border-[#172554] bg-white px-3 py-2 text-base font-bold text-[#172554]" placeholder="Score out of 100" />
                    </section>
                  ) : isSelfLearning ? (
                    <section className="border border-slate-300 bg-white p-4 sm:p-5" aria-labelledby="slc-result-heading">
                      <h3 id="slc-result-heading" className="font-black text-[#172554]">Self-Learning Course Result</h3>
                      <p className="mt-1 text-sm text-slate-600">Enter the final mark reported by the approved learning provider. No CA or ESE is calculated in this app.</p>
                      <label className="mt-4 block text-xs font-bold text-[#172554]" htmlFor="slc-final-mark">External result out of 100</label>
                      <input
                        id="slc-final-mark"
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={currentSubject.ese}
                        onChange={(event) => {
                          const raw = event.currentTarget.value;
                          updateCurrentSubject({ ese: raw === '' ? '' : Math.min(100, Math.max(0, Number(raw) || 0)) });
                        }}
                        className="mt-1 w-full max-w-xs border border-[#172554] bg-white px-3 py-2 text-base font-bold text-[#172554]"
                      />
                      <label className="mt-4 flex max-w-sm flex-col gap-1 text-xs font-bold text-[#172554]" htmlFor="slc-pass-mark">
                        Passing threshold
                        <select
                          id="slc-pass-mark"
                          value={Number(currentSubject.selfLearningPassMark) === 40 ? 40 : 50}
                          onChange={(event) => updateCurrentSubject({ selfLearningPassMark: Number(event.currentTarget.value) })}
                          className="border border-slate-300 bg-white px-3 py-2 text-sm font-semibold normal-case"
                        >
                          <option value={50}>Other approved provider — 50%</option>
                          <option value={40}>NPTEL / SWAYAM — 40%</option>
                        </select>
                      </label>
                      <p className="mt-2 text-xs text-slate-600">The provider’s official result and grade conversion remain authoritative.</p>
                    </section>
                  ) : isUniversalHumanValues ? (
                    <div className="space-y-4">
                      <ContinuousAssessmentSection
                        number={1}
                        title="Universal Human Values — Test"
                        testMax={currentSubject.test1Max}
                        test={currentSubject.test1}
                        onTestMaxChange={(val) => updateCurrentSubject({ test1Max: val })}
                        onTestChange={(val) => updateCurrentSubject({ test1: val })}
                        testPoints={breakdown.test1_p}
                        testWeight={70}
                        allowCustomTestMax
                        testDisplayName="UHV Test"
                        isSingleAssessment
                        actNo={0}
                        onActNoChange={() => undefined}
                        actScores={[]}
                        onActScoresChange={() => undefined}
                        actPoints={0}
                        actWeight={0}
                        actStartIndex={1}
                        labNo={0}
                        onLabNoChange={() => undefined}
                        labScores={[]}
                        onLabScoresChange={() => undefined}
                        labPoints={0}
                        labWeight={0}
                        labStartIndex={1}
                        subtotal={breakdown.test1_p}
                        caMax={70}
                      />
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <DynamicScoreBoxes
                          title="Assignment 1"
                          category="assignment"
                          count={currentSubject.act1No}
                          onCountChange={(count) => updateCurrentSubject({ act1No: count })}
                          scores={currentSubject.act1Scores}
                          onScoresChange={(scores) => updateCurrentSubject({ act1Scores: scores })}
                          startIndex={1}
                          maxMarkPerBox={10}
                          weight={15}
                          calculatedPoints={breakdown.act1_p}
                          caName="UHV Assignment 1"
                          minimumCount={1}
                        />
                        <DynamicScoreBoxes
                          title="Assignment 2"
                          category="assignment"
                          count={currentSubject.act2No}
                          onCountChange={(count) => updateCurrentSubject({ act2No: count })}
                          scores={currentSubject.act2Scores}
                          onScoresChange={(scores) => updateCurrentSubject({ act2Scores: scores })}
                          startIndex={1}
                          maxMarkPerBox={10}
                          weight={15}
                          calculatedPoints={breakdown.act2_p}
                          caName="UHV Assignment 2"
                          minimumCount={1}
                        />
                      </div>
                    </div>
                  ) : breakdown.courseType === 'project-work' || breakdown.courseType === 'project' ? (
                    <ProjectWorkAssessmentSection
                      assessmentTitle={breakdown.courseType === 'project' ? 'Internship cum Project Work assessment — Regulation 17.7' : undefined}
                      marks={currentSubject.projectWorkMarks ?? {
                        reviewI: '', reviewII: '', reviewIII: '', thesisGuide: '', thesisExternal: '', vivaExternal: '', vivaInternal: '',
                      }}
                      onMarksChange={(projectWorkMarks) => updateCurrentSubject({ projectWorkMarks })}
                    />
                  ) : (
                  <>
                  {/* CA 1 Section */}
                  <ContinuousAssessmentSection
                    number={1}
                    title={isIndustryOrientedTests ? 'Mid-Term Test' : currentCourseType === 'standards-course' ? 'Standards Test I — Mid-Term' : currentCourseType === 'audit-course' ? 'Audit Test I — Mid-Term' : currentCourseType === 'heritage-course' ? 'Continuous Assessment 1' : 'Continuous Assessment 1'}
                    testMax={currentSubject.test1Max}
                    test={currentSubject.test1}
                    onTestMaxChange={(val) => updateCurrentSubject({ test1Max: val })}
                    onTestChange={(val) => updateCurrentSubject({ test1: val })}
                    testPoints={breakdown.test1_p}
                    testWeight={breakdown.testWeight}
                    allowCustomTestMax={isComputationalThinking || isTwoTestCourse}
                    testDisplayName={isIndustryOrientedTests ? 'Mid Term Test' : currentCourseType === 'standards-course' ? 'Standards Test I' : currentCourseType === 'audit-course' ? 'Audit Test I' : currentCourseType === 'heritage-course' ? 'CA 1' : undefined}
                    isTwoTestCourse={isTwoTestCourse}
                    isSelfDevelopment={breakdown.courseType === 'self-development'}
                    actNo={displayedSubject.act1No}
                    onActNoChange={(val) => updateCurrentSubject({ act1No: val })}
                    actScores={displayedSubject.act1Scores}
                    onActScoresChange={(scores) => updateCurrentSubject({ act1Scores: scores })}
                    actPoints={breakdown.act1_p}
                    actWeight={breakdown.actWeight}
                    actStartIndex={1}
                    minimumActivityCount={currentCourseType === 'heritage-course' ? 1 : 0}
                    maximumActivityCount={currentCourseType === 'heritage-course' ? 1 : 20}
                    activityTitle={currentCourseType === 'heritage-course' ? 'Activities' : undefined}
                    activityScoreLabel={currentCourseType === 'heritage-course' ? 'Activity' : undefined}
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

                {/* CA 2 Section */}
                {!isUniversalHumanValues && <ContinuousAssessmentSection
                  number={2}
                  title={isIndustryOrientedTests ? 'End-Course Test' : currentCourseType === 'standards-course' ? 'Standards Test II' : currentCourseType === 'audit-course' ? 'Audit Test II' : currentCourseType === 'heritage-course' ? 'Continuous Assessment 2' : 'Continuous Assessment 2'}
                  testMax={currentSubject.test2Max}
                  test={currentSubject.test2}
                  onTestMaxChange={(val) => updateCurrentSubject({ test2Max: val })}
                  onTestChange={(val) => updateCurrentSubject({ test2: val })}
                  testPoints={breakdown.test2_p}
                  testWeight={breakdown.testWeight}
                  allowCustomTestMax={isComputationalThinking || isTwoTestCourse}
                  testDisplayName={isIndustryOrientedTests ? 'End Course Test' : currentCourseType === 'standards-course' ? 'Standards Test II' : currentCourseType === 'audit-course' ? 'Audit Test II' : currentCourseType === 'heritage-course' ? 'CA 2' : undefined}
                  isTwoTestCourse={isTwoTestCourse}
                  isSelfDevelopment={breakdown.courseType === 'self-development'}
                  actNo={displayedSubject.act2No}
                  onActNoChange={(val) => updateCurrentSubject({ act2No: val })}
                  actScores={displayedSubject.act2Scores}
                  onActScoresChange={(scores) => updateCurrentSubject({ act2Scores: scores })}
                  actPoints={breakdown.act2_p}
                  actWeight={breakdown.actWeight}
                  actStartIndex={(Number(displayedSubject.act1No) || 0) + 1}
                  minimumActivityCount={currentCourseType === 'heritage-course' ? 1 : 0}
                  maximumActivityCount={currentCourseType === 'heritage-course' ? 1 : 20}
                  activityTitle={currentCourseType === 'heritage-course' ? 'Activities' : undefined}
                  activityScoreLabel={currentCourseType === 'heritage-course' ? 'Activity' : undefined}
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
                />}

                {/* End Semester Section */}
                {breakdown.eseWeight > 0 && <EndSemesterSection
                  courseType={breakdown.courseType}
                  ese={currentSubject.ese}
                  onEseChange={(val) => updateCurrentSubject({ ese: val })}
                  eseLab={currentSubject.eseLab}
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
                  estimatedLabMark={currentSubjectUsesEstimates && breakdown.eseLabWeight > 0 && (currentSubject.eseLab === '' || currentSubject.eseLab === undefined)}
                />}
                  </>
                  )}
                </div>

                <div className="space-y-3 border border-slate-300 bg-white p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => void handleCalculateMarks()}
                      disabled={calculationState === 'calculating' || calculationState === 'saving'}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold bg-[#172554] text-white hover:bg-[#1e3a8a] disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {calculationState === 'calculating' || calculationState === 'saving' ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Calculator className="w-4 h-4" aria-hidden="true" />}
                      {calculationState === 'calculating'
                        ? 'Calculating result…'
                        : calculationState === 'saving'
                          ? 'Saving result…'
                          : hasCalculatedCurrentSubject
                            ? 'Recalculate Mark & Grade'
                            : 'Calculate Mark & Grade'}
                    </button>
                    {(calculationState === 'calculating' || calculationState === 'saving' || (calculationState === 'success' && hasCalculatedCurrentSubject)) && (
                      <p className="text-xs font-semibold text-slate-600" role="status" aria-live="polite">
                        {calculationState === 'calculating'
                          ? 'Calculating result…'
                          : calculationState === 'saving'
                            ? 'Saving result to your account…'
                          : guestMode
                              ? 'Result calculated for this temporary session only.'
                              : 'Result calculated and saved to your account.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Show the final marks and grade only after an explicit calculation. */}
                {hasCalculatedCurrentSubject && (
                  <div id="summary-at-end" className="pt-2">
                    <ResultsSummaryPanel breakdown={breakdown} subject={displayedSubject} />
                  </div>
                )}
              </div>
              </div>
            )}
          </div>
        )}
        </div>

        {!showFeedbackHub && !showCredits && activeTab === 'grades' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-slate-300 p-3 sm:p-5 shadow-sm">
              <h2 className="text-lg font-black text-[#172554] mb-2">
                Grading of Courses
              </h2>
              <p className="mb-3 border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-950">
                These mark bands are indicative only. Official grades may differ.
              </p>
              <div className="border border-slate-200">
                <table className="w-full table-fixed text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#172554] text-white border-b-2 border-[#172554] text-xs font-extrabold">
                      <th className="w-[20%] py-2 px-2">Grade</th>
                      <th className="w-[50%] py-2 px-2">Description</th>
                      <th className="w-[30%] py-2 px-1 text-center text-[10px] leading-tight sm:px-2 sm:text-xs">Grade Points</th>
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
                          <td
                            className={`py-2 px-2 text-base font-black text-[#172554] ${
                              isCurrent ? 'bg-blue-100 ring-2 ring-inset ring-[#172554]' : ''
                            }`}
                            aria-current={isCurrent ? 'true' : undefined}
                          >
                            {grade.letter}
                            {isCurrent && <span className="sr-only"> — Current grade</span>}
                          </td>
                          <td className={`py-2 px-2 font-semibold leading-tight text-slate-800 break-words ${isCurrent ? 'bg-blue-50 font-black text-[#172554]' : ''}`}>
                            {grade.label}
                          </td>
                          <td className={`py-2 px-1 text-center font-bold text-[#172554] break-words sm:px-2 ${isCurrent ? 'bg-blue-50 font-black' : ''}`}>
                            {grade.gradePoint}
                          </td>
                        </tr>
                      );
                    })}
                    {/* Special grades from Table 11 */}
                    {SPECIAL_GRADES.map((sg) => (
                      <tr key={sg.code} className="hover:bg-slate-50 text-slate-600">
                        <td className="py-2 px-2 text-base font-black text-[#172554]">{sg.code}</td>
                        <td className="py-2 px-2 font-semibold leading-tight text-slate-700 break-words">{sg.description}</td>
                        <td className="py-2 px-1 text-center font-bold text-[#172554] break-words sm:px-2">{sg.gradePoint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
    
        {!showFeedbackHub && !showCredits && activeTab === 'gpa' && (
          <GPACalculator
            subjects={subjects}
            calculatedSignatures={calculatedSignatures}
            history={gpaHistory}
            onCalculate={handleCalculateGpa}
            initialSemester={selectedSemester ?? 1}
            includeEstimates={includeEstimates}
            estimatePercentage={estimatePercentage}
            guestMode={guestMode}
          />
        )}
        <div className={!showFeedbackHub && !showCredits && activeTab === 'cgpa' ? '' : 'hidden'}>
          <CGPAHub />
        </div>
</main>

<MobileCoursesSheet
  isOpen={isMobileCoursesOpen}
  semester={selectedSemester}
  courses={semesterCourseRows}
  electiveSlots={semesterElectiveRows}
  electiveOptions={mobileElectiveOptions}
  otherCourses={otherCourseRows}
  selectedSubjectId={isEditorOpen ? currentSubjectId : ''}
  allCoursesCalculated={allSemesterCoursesCalculated}
  onClose={closeMobileCourses}
  onSelectCourse={(course) => {
    setIsMobileCoursesOpen(false);
    handleOpenPresetCourse(course);
  }}
  onSelectOtherCourse={(subject) => {
    setIsMobileCoursesOpen(false);
    handleOpenOtherCourse(subject);
  }}
  onCalculateGpa={() => {
    setIsMobileCoursesOpen(false);
    setActiveTab('gpa');
  }}
/>

<ProfileDrawer
  isOpen={isProfileOpen}
  onClose={closeProfileDrawer}
  profile={profile}
  initialSemester={selectedSemester}
  email={user?.email ?? ''}
  guestMode={guestMode}
  onSave={handleSaveAcademicProfile}
  theme={theme}
  onToggleTheme={onToggleTheme}
  onOpenGrades={handleOpenGrades}
  onOpenFeedback={handleOpenFeedbackHub}
  onOpenCredits={handleOpenCredits}
  onLogout={handleProfileLogout}
  logoutPending={signOutPending}
/>

{/* Subject Selection Modal Dialog Box */}
      <SubjectSelectionDialog
        isOpen={isDialogOpen}
        onClose={handleCloseSubjectDialog}
        onSelectCourse={handleOpenPresetCourse}
        initialSemester={selectedSemester}
        initialElectiveSlot={dialogElectiveSlot}
      />
    </div>
  );
}

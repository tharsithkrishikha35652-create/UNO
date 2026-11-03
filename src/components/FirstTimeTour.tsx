import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Minus,
  Plus,
  Sparkles,
  Target,
} from 'lucide-react';
import type { AppTheme } from './ThemeToggle';
import { TOUR_STORAGE_KEY } from './TourErrorBoundary';

export interface FirstTimeTourProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: AppTheme;
  openProfile?: () => void;
  closeProfile?: () => void;
  openFeedbackHub?: () => void;
  closeFeedbackHub?: () => void;
  openTargetSimulator?: () => void;
  goToTab?: (tab: 'calculator' | 'courses' | 'gpa' | 'cgpa') => void;
}

export type TourStep =
  | 'welcome'
  | 'profile_icon'
  | 'department'
  | 'feedback_hub'
  | 'semester_selector'
  | 'marks_entry'
  | 'target_simulator'
  | 'features_types'
  | 'features_prediction'
  | 'grades_of_choice'
  | 'bottom_bar'
  | 'finish';

type BottomBarTab = 'calculator' | 'courses' | 'gpa' | 'cgpa';

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const RED_PEN_COLOR = '#F0482E'; // CalCredit logo red

export const FirstTimeTour: React.FC<FirstTimeTourProps> = ({
  isOpen,
  onClose,
  openProfile = () => {},
  closeProfile = () => {},
  openFeedbackHub = () => {},
  closeFeedbackHub = () => {},
  openTargetSimulator = () => {},
  goToTab = () => {},
}) => {
  const reduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState<TourStep>('welcome');
  const [bottomTab, setBottomTab] = useState<BottomBarTab>('calculator');
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [penDrawn, setPenDrawn] = useState(false);

  // Sample marks state for Step 5 (Marks entry)
  const [sampleTest1, setSampleTest1] = useState(44); // out of 50
  const [sampleTest2, setSampleTest2] = useState(46); // out of 50
  const [sampleEse, setSampleEse] = useState(86);     // out of 100
  const [marksAdjusted, setMarksAdjusted] = useState(false);

  // Looping course types state for Step 7
  const [courseTypeIndex, setCourseTypeIndex] = useState(0);

  // Target GPA prediction state for Step 8
  const [targetGpa, setTargetGpa] = useState(8.5);

  const measureTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  // Cleanup all timers on unmount or step change
  const clearAllTimers = useCallback(() => {
    if (measureTimerRef.current !== null) {
      window.clearTimeout(measureTimerRef.current);
      measureTimerRef.current = null;
    }
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearAllTimers();
    // Return user to Calculator tab and close any open drawers/screens
    closeProfile();
    closeFeedbackHub();
    goToTab('calculator');
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
    onClose();
  }, [clearAllTimers, closeProfile, closeFeedbackHub, goToTab, onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Target element selector mapping
  const getStepTargetSelector = useCallback((step: TourStep, bTab: BottomBarTab): string | null => {
    switch (step) {
      case 'profile_icon':
        return '#tour-profile-button, [data-tour="profile-button"]';
      case 'department':
        return '#tour-profile-department, [data-tour="profile-department"]';
      case 'feedback_hub':
        return '#tour-feedback-header, [data-tour="feedback-header"], #feedback-hub-heading, #tour-feedback-hub';
      case 'semester_selector':
        return '#tour-semester-selector, [data-tour="semester-selector"]';
      case 'target_simulator':
        return '#tour-target-grade-simulator, [data-tour="target-grade-simulator"]';
      case 'grades_of_choice':
        return '#tour-grades-of-choice-button, [data-tour="grades-of-choice-button"]';
      case 'bottom_bar':
        if (bTab === 'calculator') return '#tour-tab-calculator, [data-tour="tab-calculator"], #tour-desktop-tab-calculator';
        if (bTab === 'courses') return '#tour-tab-courses, [data-tour="tab-courses"], #tour-desktop-tab-courses';
        if (bTab === 'gpa') return '#tour-tab-gpa, [data-tour="tab-gpa"], #tour-desktop-tab-gpa';
        if (bTab === 'cgpa') return '#tour-tab-cgpa, [data-tour="tab-cgpa"], #tour-desktop-tab-cgpa';
        return null;
      default:
        return null;
    }
  }, []);

  // Measure target position once per step (and on resize/rotation)
  const measureTarget = useCallback((step: TourStep, bTab: BottomBarTab, retryCount = 0) => {
    const selector = getStepTargetSelector(step, bTab);
    if (!selector) {
      setTargetRect(null);
      setPenDrawn(true);
      return;
    }

    const element = document.querySelector(selector);
    if (element instanceof HTMLElement) {
      if (typeof element.scrollIntoView === 'function') {
        if (step === 'department' || step === 'target_simulator' || step === 'grades_of_choice') {
          element.scrollIntoView({ block: 'center', behavior: 'instant' });
        }
      }
      if (step === 'target_simulator') {
        const details = element.closest('details') || element.querySelector('details');
        if (details instanceof HTMLDetailsElement) details.open = true;
      }
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        setPenDrawn(false);
        if (measureTimerRef.current !== null) {
          window.clearTimeout(measureTimerRef.current);
        }
        measureTimerRef.current = window.setTimeout(() => {
          setPenDrawn(true);
        }, 50);
        return;
      }
    }

    // Element might still be mounting or animating in: retry once after 120ms
    if (retryCount < 2) {
      if (measureTimerRef.current !== null) {
        window.clearTimeout(measureTimerRef.current);
      }
      measureTimerRef.current = window.setTimeout(() => {
        measureTarget(step, bTab, retryCount + 1);
      }, 120);
      return;
    }

    // If target cannot be found or measured, per instructions: skip to next step
    if (step === 'profile_icon') {
      navigateToStep('department');
    } else if (step === 'department') {
      navigateToStep('feedback_hub');
    } else if (step === 'feedback_hub') {
      navigateToStep('semester_selector');
    } else if (step === 'semester_selector') {
      navigateToStep('marks_entry');
    } else if (step === 'target_simulator') {
      navigateToStep('features_types');
    } else if (step === 'grades_of_choice') {
      navigateToStep('bottom_bar');
    } else if (step === 'bottom_bar') {
      navigateToStep('finish');
    } else {
      setTargetRect(null);
      setPenDrawn(true);
    }
  }, [getStepTargetSelector]);

  // Navigate to real screens for each step and wait until fully appeared
  const navigateToStep = useCallback((nextStep: TourStep) => {
    clearAllTimers();
    setTargetRect(null);
    setPenDrawn(false);
    setCurrentStep(nextStep);

    let screenWaitMs = 60;

    switch (nextStep) {
      case 'welcome':
      case 'profile_icon':
        closeProfile();
        closeFeedbackHub();
        goToTab('calculator');
        screenWaitMs = 100;
        break;

      case 'department':
        openProfile();
        screenWaitMs = 320; // Allow profile drawer transition to finish
        break;

      case 'feedback_hub':
        closeProfile();
        openFeedbackHub();
        screenWaitMs = 250; // Allow feedback hub screen to animate in
        break;

      case 'semester_selector':
        closeFeedbackHub();
        closeProfile();
        goToTab('calculator');
        screenWaitMs = 200;
        break;

      case 'marks_entry':
        closeFeedbackHub();
        closeProfile();
        goToTab('calculator');
        screenWaitMs = 50;
        break;

      case 'target_simulator':
        closeFeedbackHub();
        closeProfile();
        openTargetSimulator();
        screenWaitMs = 300; // Allow course editor and EndSemesterSection to mount
        break;

      case 'features_types':
      case 'features_prediction':
        closeFeedbackHub();
        closeProfile();
        goToTab('calculator');
        screenWaitMs = 50;
        break;

      case 'grades_of_choice':
        closeFeedbackHub();
        closeProfile();
        goToTab('gpa');
        screenWaitMs = 280; // Allow GPA Hub screen to render
        break;

      case 'bottom_bar':
        closeFeedbackHub();
        closeProfile();
        setBottomTab('calculator');
        goToTab('calculator');
        screenWaitMs = 150;
        break;

      case 'finish':
        closeFeedbackHub();
        closeProfile();
        goToTab('calculator');
        screenWaitMs = 50;
        break;
    }

    transitionTimerRef.current = window.setTimeout(() => {
      measureTarget(nextStep, 'calculator');
    }, screenWaitMs);
  }, [clearAllTimers, closeProfile, openProfile, closeFeedbackHub, openFeedbackHub, openTargetSimulator, goToTab, measureTarget]);

  // Listen for resize / rotation: re-measure once
  useEffect(() => {
    const handleResize = () => {
      measureTarget(currentStep, bottomTab);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [currentStep, bottomTab, measureTarget]);

  // Looping demo for Step 7 (Course Types): cycles every 1.8s
  useEffect(() => {
    if (currentStep !== 'features_types') return;
    const interval = window.setInterval(() => {
      setCourseTypeIndex((prev) => (prev + 1) % 4);
    }, 1800);
    return () => window.clearInterval(interval);
  }, [currentStep]);

  // Bottom Bar tab sequencing (Step 10 of 10): ~1.5s per tab
  const advanceBottomBarTab = useCallback((nextTab: BottomBarTab) => {
    clearAllTimers();
    setBottomTab(nextTab);
    goToTab(nextTab);
    setTargetRect(null);
    setPenDrawn(false);
    transitionTimerRef.current = window.setTimeout(() => {
      measureTarget('bottom_bar', nextTab);
    }, 150);
  }, [clearAllTimers, goToTab, measureTarget]);

  useEffect(() => {
    if (currentStep !== 'bottom_bar') return;

    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }

    autoAdvanceTimerRef.current = window.setTimeout(() => {
      if (bottomTab === 'calculator') advanceBottomBarTab('courses');
      else if (bottomTab === 'courses') advanceBottomBarTab('gpa');
      else if (bottomTab === 'gpa') advanceBottomBarTab('cgpa');
      else if (bottomTab === 'cgpa') navigateToStep('finish');
    }, 1500);

    return () => {
      if (autoAdvanceTimerRef.current !== null) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [currentStep, bottomTab, advanceBottomBarTab, navigateToStep]);

  // Initial measurement when tour opens
  useEffect(() => {
    if (!isOpen) return;
    navigateToStep('welcome');
    return () => clearAllTimers();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sample marks calculation (Anna University Theory course rules: 40% CA, 60% ESE)
  const sampleResult = useMemo(() => {
    const ca = ((sampleTest1 + sampleTest2) / 100) * 40;
    const ese = (sampleEse / 100) * 60;
    const total = Math.round(ca + ese);

    let letter = 'U';
    let gradePoint = 0;
    if (total >= 91) {
      letter = 'S';
      gradePoint = 10;
    } else if (total >= 81) {
      letter = 'A+';
      gradePoint = 9;
    } else if (total >= 71) {
      letter = 'A';
      gradePoint = 8;
    } else if (total >= 61) {
      letter = 'B+';
      gradePoint = 7;
    } else if (total >= 56) {
      letter = 'B';
      gradePoint = 6;
    } else if (total >= 50) {
      letter = 'C';
      gradePoint = 5;
    }

    return { total, letter, gradePoint };
  }, [sampleTest1, sampleTest2, sampleEse]);

  if (!isOpen) return null;

  // Hand-drawn organic SVG pen paths
  const circlePath = targetRect
    ? `M ${targetRect.x + targetRect.width * 0.1} ${targetRect.y + targetRect.height * 0.15} ` +
      `C ${targetRect.x + targetRect.width * 0.5} ${targetRect.y - 6}, ` +
      `${targetRect.x + targetRect.width + 6} ${targetRect.y + targetRect.height * 0.25}, ` +
      `${targetRect.x + targetRect.width + 5} ${targetRect.y + targetRect.height * 0.65} ` +
      `C ${targetRect.x + targetRect.width + 4} ${targetRect.y + targetRect.height + 6}, ` +
      `${targetRect.x + targetRect.width * 0.45} ${targetRect.y + targetRect.height + 7}, ` +
      `${targetRect.x - 5} ${targetRect.y + targetRect.height * 0.65} ` +
      `C ${targetRect.x - 6} ${targetRect.y + targetRect.height * 0.25}, ` +
      `${targetRect.x + targetRect.width * 0.3} ${targetRect.y - 5}, ` +
      `${targetRect.x + targetRect.width * 0.85} ${targetRect.y + 2}`
    : '';

  const underlinePath = targetRect
    ? `M ${targetRect.x} ${targetRect.y + targetRect.height + 3} ` +
      `Q ${targetRect.x + targetRect.width * 0.5} ${targetRect.y + targetRect.height + 7} ` +
      `${targetRect.x + targetRect.width} ${targetRect.y + targetRect.height + 2}`
    : '';

  const isUnderlineStep = currentStep === 'bottom_bar';

  // Course types metadata for Step 7
  const courseTypesDemo = [
    { title: 'Theory', badge: '40 CA / 60 ESE', desc: 'Continuous assessments + End Semester Theory Exam' },
    { title: 'Theory + Lab', badge: '50 CA / 50 ESE', desc: 'Integrated lecture, tests, and practical examination' },
    { title: 'Project Work', badge: '40 Review / 60 Viva', desc: 'Zero written exam. Graded by 3 review stages and viva' },
    { title: 'Practical / Lab', badge: '60 CA / 40 Exam', desc: 'Model practicals, continuous lab marks and viva' },
  ];

  return (
    <div
      className="fixed inset-0 z-[80] pointer-events-auto select-none font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Tour"
    >
      {/* Background layer: clean, transparent, no dark spotlight, no glassmorphism */}
      <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />

      {/* SVG Canvas for the Hand-Drawn Red Pen */}
      {targetRect && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          aria-hidden="true"
        >
          <path
            d={isUnderlineStep ? underlinePath : circlePath}
            fill="none"
            stroke={RED_PEN_COLOR}
            strokeWidth={isUnderlineStep ? 3.5 : 2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={reduceMotion || penDrawn ? 0 : 100}
            style={{
              transition: reduceMotion
                ? 'none'
                : 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
      )}

      {/* Main Tour Content Card container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
        {/* STEP 0: Welcome Card */}
        {currentStep === 'welcome' && (
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40 text-[#F0482E]">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-lg font-black text-[#172554] dark:text-[#f1f1f3] leading-snug">
              Your CEG GPA, calculated the right way.
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 font-semibold">
              Take a 30-second tour.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigateToStep('profile_icon')}
                className="flex-1 min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-98 transition-transform cursor-pointer"
              >
                <span>Show me</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-11 px-4 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Profile Icon (Step 1 of 10) */}
        {currentStep === 'profile_icon' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 170, targetRect.y + targetRect.height + 16) : '20%',
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 10, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Your profile lives here.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">1</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('department')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Department on Profile Page (Step 2 of 10) */}
        {currentStep === 'department' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 170, targetRect.y + targetRect.height + 16) : '35%',
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 10, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Your department is set here.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">2</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('feedback_hub')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Feedback Hub (Step 3 of 10) */}
        {currentStep === 'feedback_hub' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 170, targetRect.y + targetRect.height + 16) : '25%',
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 10, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Tell us what to improve or report a problem.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">3</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('semester_selector')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Semester Selector (Step 4 of 10) */}
        {currentStep === 'semester_selector' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 170, targetRect.y + targetRect.height + 16) : '20%',
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 120, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Choose or change your semester here.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">4</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('marks_entry')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Marks Entry (Step 5 of 10) */}
        {currentStep === 'marks_entry' && (
          <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 sm:p-6 shadow-2xl text-left">
            <div>
              <p className="text-sm sm:text-base font-black text-[#172554] dark:text-[#f1f1f3]">
                Enter your marks. Watch your grade update live.
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Graded with the exact Anna University rules.
              </p>
            </div>

            {/* Interactive Live Sample Course Card */}
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-[#161618] p-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-500">Sample Theory Course</span>
                  <p className="text-xs sm:text-sm font-bold text-[#172554] dark:text-[#f1f1f3]">
                    Data Structures and Algorithms
                  </p>
                </div>
                {/* Live result badge */}
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 font-bold">Total</span>
                    <span className="text-sm font-black font-numeric tabular-nums text-[#172554] dark:text-[#f1f1f3]">
                      {sampleResult.total}/100
                    </span>
                  </div>
                  <div className="flex h-10 w-11 items-center justify-center rounded-lg bg-[#172554] text-white">
                    <span className="text-base font-black font-numeric">{sampleResult.letter}</span>
                  </div>
                </div>
              </div>

              {/* Adjust sliders/steppers */}
              <div className="mt-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>Assessment 1 (out of 50)</span>
                    <span className="text-[#172554] dark:text-[#f1f1f3] font-black font-numeric tabular-nums">{sampleTest1}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease Assessment 1"
                      onClick={() => { setSampleTest1((v) => Math.max(0, v - 2)); setMarksAdjusted(true); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202024]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={50}
                      value={sampleTest1}
                      onChange={(e) => { setSampleTest1(Number(e.target.value)); setMarksAdjusted(true); }}
                      className="flex-1 accent-[#F0482E] cursor-pointer"
                    />
                    <button
                      type="button"
                      aria-label="Increase Assessment 1"
                      onClick={() => { setSampleTest1((v) => Math.min(50, v + 2)); setMarksAdjusted(true); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202024]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span>End Semester Exam (out of 100)</span>
                    <span className="text-[#172554] dark:text-[#f1f1f3] font-black font-numeric tabular-nums">{sampleEse}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Decrease End Semester"
                      onClick={() => { setSampleEse((v) => Math.max(0, v - 5)); setMarksAdjusted(true); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202024]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sampleEse}
                      onChange={(e) => { setSampleEse(Number(e.target.value)); setMarksAdjusted(true); }}
                      className="flex-1 accent-[#F0482E] cursor-pointer"
                    />
                    <button
                      type="button"
                      aria-label="Increase End Semester"
                      onClick={() => { setSampleEse((v) => Math.min(100, v + 5)); setMarksAdjusted(true); }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202024]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">5</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('target_simulator')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#172554] px-4 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>{marksAdjusted ? 'Continue' : 'Next'}</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Target Grade Simulator (Step 6 of 10) */}
        {currentStep === 'target_simulator' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              top: targetRect ? Math.min(window.innerHeight - 170, targetRect.y + targetRect.height + 16) : '40%',
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 10, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Pick a target grade. See the marks you need.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">6</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('features_types')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Course Types Demo (Step 7 of 10) */}
        {currentStep === 'features_types' && (
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#172554] dark:text-[#a9bbd0]">
              <BookOpen className="h-6 w-6" aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-base font-black text-[#172554] dark:text-[#f1f1f3]">
              Every course type, graded by its own rules.
            </h2>

            {/* Cycling course type card */}
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] p-3.5 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#172554] dark:text-[#f1f1f3]">
                  {courseTypesDemo[courseTypeIndex]?.title}
                </span>
                <span className="rounded-full bg-red-100 dark:bg-red-950/50 border border-red-300 dark:border-red-800 px-2 py-0.5 text-[10px] font-black font-numeric tabular-nums text-[#F0482E]">
                  {courseTypesDemo[courseTypeIndex]?.badge}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                {courseTypesDemo[courseTypeIndex]?.desc}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">7</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('features_prediction')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#172554] px-4 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 8: Target GPA Prediction Demo (Step 8 of 10) */}
        {currentStep === 'features_prediction' && (
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <Target className="h-6 w-6" aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-base font-black text-[#172554] dark:text-[#f1f1f3]">
              Predict the marks you need to hit your target GPA.
            </h2>

            {/* Mini prediction preview */}
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#161618] p-3.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Target Semester GPA</span>
                <span className="text-[#172554] dark:text-[#f1f1f3] font-black font-numeric tabular-nums">{targetGpa.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={7.0}
                max={9.5}
                step={0.1}
                value={targetGpa}
                onChange={(e) => setTargetGpa(Number(e.target.value))}
                className="mt-2 w-full accent-[#F0482E] cursor-pointer"
              />
              <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1.5">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300">Required in End Sem</span>
                <span className="text-xs font-black font-numeric tabular-nums text-emerald-900 dark:text-emerald-200">
                  {Math.round(targetGpa * 8.8 + 2)} / 100
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">8</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('grades_of_choice')}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-[#172554] px-4 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 9: Enter Grades of Choice (Step 9 of 10) */}
        {currentStep === 'grades_of_choice' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left"
            style={{
              bottom: targetRect ? Math.max(16, window.innerHeight - targetRect.y + 16) : 100,
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 20, window.innerWidth - 320)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                Pick a grade per course. Get a quick GPA, no marks needed.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">9</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => navigateToStep('bottom_bar')}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 10: Bottom Bar Underline Sequence (Step 10 of 10) */}
        {currentStep === 'bottom_bar' && (
          <div
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-4 shadow-2xl text-left"
            style={{
              bottom: targetRect ? Math.max(16, window.innerHeight - targetRect.y + 16) : 90,
              left: targetRect ? Math.max(16, Math.min(targetRect.x - 30, window.innerWidth - 300)) : 16,
            }}
          >
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#F0482E] shrink-0" />
              <p className="text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                {bottomTab === 'calculator' && 'Quick marks, instant grade.'}
                {bottomTab === 'courses' && 'Your subjects and course types.'}
                {bottomTab === 'gpa' && "This semester's GPA, and predictions."}
                {bottomTab === 'cgpa' && 'Your overall CGPA across all semesters.'}
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
              >
                Skip tour
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">
                  Step <span className="font-numeric tabular-nums">10</span> of <span className="font-numeric tabular-nums">10</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (bottomTab === 'calculator') advanceBottomBarTab('courses');
                    else if (bottomTab === 'courses') advanceBottomBarTab('gpa');
                    else if (bottomTab === 'gpa') advanceBottomBarTab('cgpa');
                    else if (bottomTab === 'cgpa') navigateToStep('finish');
                  }}
                  className="inline-flex min-h-8 items-center gap-1 rounded-lg bg-[#172554] px-3 text-[11px] font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 11: Finish Card */}
        {currentStep === 'finish' && (
          <div className="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Check className="h-6 w-6 stroke-[3]" aria-hidden="true" />
            </div>

            <h2 className="mt-4 text-lg font-black text-[#172554] dark:text-[#f1f1f3] leading-snug">
              You're set. Replay this tour anytime from Profile.
            </h2>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="w-full min-h-11 inline-flex items-center justify-center gap-2 rounded-xl bg-[#172554] px-4 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-98 transition-transform cursor-pointer"
              >
                <span>Start calculating</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstTimeTour;

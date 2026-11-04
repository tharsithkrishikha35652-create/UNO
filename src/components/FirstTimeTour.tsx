import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { AppTheme } from './ThemeToggle';
import {
  TOUR_STORAGE_KEY,
  lockTourScroll,
  forceUnlockTourScroll,
} from './TourErrorBoundary';

export interface FirstTimeTourProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: AppTheme;
  openProfile?: () => void;
  closeProfile?: () => void;
  openFeedbackHub?: () => void;
  closeFeedbackHub?: () => void;
  openCourseCalculator?: () => void;
  restoreTestMax?: () => void;
  openTargetSimulator?: () => void;
  goToTab?: (tab: 'calculator' | 'courses' | 'gpa' | 'cgpa') => void;
}

export type TourStep =
  | 'welcome'
  | 'profile_icon'          // Step 1 of 10
  | 'edit_profile'          // Step 2 of 10
  | 'feedback_drawer'       // Step 3 of 10
  | 'feedback_screen'       // Step 4 of 10
  | 'semester_selector'     // Step 5 of 10
  | 'estimated_lab'         // Step 6 of 10
  | 'marks_entry'           // Step 7 of 10
  | 'change_total_marks'    // Step 8 of 10 (2 beats)
  | 'target_simulator'      // Step 9 of 10
  | 'grades_of_choice'      // Step 10 of 10
  | 'finish';

interface TargetRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CardPosition {
  top: number;
  left: number;
  placement: 'above' | 'below';
  arrowX: number;
}

const TOTAL_STEPS = 10;

// Exact pen colors read from src/assets/branding/calcredit_logo_final.svg
// Light theme (#markL): stroke="#E23B22"
// Dark theme (#markD): stroke="#F0482E"
const PEN_COLOR_LIGHT = '#E23B22';
const PEN_COLOR_DARK = '#F0482E';

function safeScrollIntoView(el: HTMLElement, options?: ScrollIntoViewOptions) {
  try {
    el.scrollIntoView(options ?? { block: 'center', behavior: 'auto' });
  } catch {
    try {
      el.scrollIntoView(true);
    } catch {}
  }
}

function findVisibleTarget(selector: string): HTMLElement | null {
  try {
    const candidates = document.querySelectorAll<HTMLElement>(selector);
    for (const element of candidates) {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      if (
        rect.width > 0 &&
        rect.height > 0 &&
        element.getClientRects().length > 0 &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        Number(style.opacity) > 0
      ) {
        return element;
      }
    }
  } catch {}
  return null;
}

/** Computes non-overlapping tooltip positioning and arrow alignment */
function computeCardPosition(
  target: TargetRect | null,
  step?: TourStep,
  cardHeight: number = 150
): CardPosition {
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const cardWidth = Math.min(320, vw - 32);

  if (!target) {
    let defaultTop = Math.round(vh * 0.22);
    let defaultLeft = Math.max(16, Math.round((vw - cardWidth) / 2));
    let placement: 'above' | 'below' = 'below';
    let arrowX = Math.round(cardWidth / 2);

    if (step === 'semester_selector') {
      defaultTop = 64;
      defaultLeft = Math.max(16, vw - cardWidth - 16);
      arrowX = cardWidth - 45;
    } else if (step === 'grades_of_choice') {
      defaultTop = Math.max(20, Math.round(vh * 0.45));
      defaultLeft = Math.max(16, Math.round((vw - cardWidth) / 2));
      placement = 'above';
      arrowX = Math.round(cardWidth / 2);
    }

    return {
      top: defaultTop,
      left: defaultLeft,
      placement,
      arrowX,
    };
  }

  const targetCenterX = target.x + target.width / 2;
  const spaceBelow = vh - (target.y + target.height);
  const spaceAbove = target.y;

  // Prefer side with ample clearance, strictly ensuring the element is NEVER covered
  let placement: 'above' | 'below' = 'below';
  if (step === 'grades_of_choice') {
    // Strictly position above the button to guarantee it is never covered
    placement = 'above';
  } else if (step === 'semester_selector' || step === 'feedback_screen') {
    // Strictly position below header dropdown or heading
    placement = 'below';
  } else if (spaceBelow >= cardHeight + 20) {
    placement = 'below';
  } else if (spaceAbove >= cardHeight + 20) {
    placement = 'above';
  } else {
    placement = spaceBelow >= spaceAbove ? 'below' : 'above';
  }

  let top: number;
  if (placement === 'below') {
    // Top of card is at least 14px below bottom of target
    top = Math.round(target.y + target.height + 14);
  } else {
    // Bottom of card is at least 14px above top of target
    top = Math.round(target.y - cardHeight - 14);
  }

  // Ensure card never overlaps the target element
  if (placement === 'below' && top < target.y + target.height + 8) {
    top = Math.round(target.y + target.height + 8);
  } else if (placement === 'above' && top + cardHeight > target.y - 8) {
    top = Math.round(target.y - cardHeight - 8);
  }

  // Strictly clamp inside visible viewport so card is never cut off
  top = Math.max(12, Math.min(top, vh - cardHeight - 12));

  // Horizontally position card:
  // For semester selector, align card towards right so arrow points into the pill button
  let left: number;
  if (step === 'semester_selector') {
    left = Math.max(16, vw - cardWidth - 16);
  } else {
    left = Math.round(targetCenterX - cardWidth / 2);
    left = Math.max(16, Math.min(left, vw - cardWidth - 16));
  }

  // Arrow offset relative to card left, clamped to keep inside card curves
  const arrowX = Math.max(24, Math.min(Math.round(targetCenterX - left), cardWidth - 24));

  return {
    top,
    left,
    placement,
    arrowX,
  };
}

export const FirstTimeTour: React.FC<FirstTimeTourProps> = ({
  isOpen,
  onClose,
  theme,
  openProfile = () => {},
  closeProfile = () => {},
  openFeedbackHub = () => {},
  closeFeedbackHub = () => {},
  openCourseCalculator = () => {},
  restoreTestMax = () => {},
  openTargetSimulator = () => {},
  goToTab = () => {},
}) => {
  const reduceMotion = useReducedMotion();
  const [currentStep, setCurrentStep] = useState<TourStep>('welcome');
  const [totalMarksBeat, setTotalMarksBeat] = useState<1 | 2>(1);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [penDrawn, setPenDrawn] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = useState(150);
  const [cardPosition, setCardPosition] = useState<CardPosition>(() =>
    computeCardPosition(null, 'welcome', 150)
  );

  useLayoutEffect(() => {
    if (cardRef.current) {
      const h = cardRef.current.offsetHeight;
      if (h > 0 && Math.abs(h - cardHeight) > 4) {
        setCardHeight(h);
      }
    }
  }, [cardHeight, currentStep, totalMarksBeat]);

  // Exact theme-matching pen color
  const isDark =
    theme === 'dark' ||
    (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const penColor = isDark ? PEN_COLOR_DARK : PEN_COLOR_LIGHT;

  const pollTimerRef = useRef<number | null>(null);
  const penDrawTimerRef = useRef<number | null>(null);
  const refineTimerRef = useRef<number | null>(null);
  const currentStepRef = useRef<TourStep>('welcome');

  // Keep currentStepRef in sync with currentStep state
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  // Helper to close total marks editor and restore 50
  const closeMaxEditor = useCallback(() => {
    try {
      const cancelBtn = document.querySelector(
        '#tour-test-max-cancel-1, [data-tour="test-max-cancel"]'
      ) as HTMLButtonElement | null;
      if (cancelBtn) {
        cancelBtn.click();
      } else {
        const pencilBtn = document.querySelector(
          '#tour-test-max-pencil-1, [data-tour="test-max-pencil"]'
        ) as HTMLButtonElement | null;
        const editor = document.querySelector(
          '#tour-test-max-editor-1, [data-tour="test-max-editor"]'
        );
        if (pencilBtn && editor) pencilBtn.click();
      }
      restoreTestMax();
    } catch (err) {
      console.warn('Error closing max editor:', err);
    }
  }, [restoreTestMax]);

  // Cleanup all timers on unmount or step change
  const clearAllTimers = useCallback(() => {
    if (pollTimerRef.current !== null) {
      window.clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    if (penDrawTimerRef.current !== null) {
      window.clearTimeout(penDrawTimerRef.current);
      penDrawTimerRef.current = null;
    }
    if (refineTimerRef.current !== null) {
      window.clearTimeout(refineTimerRef.current);
      refineTimerRef.current = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    clearAllTimers();
    closeMaxEditor();
    forceUnlockTourScroll();
    closeProfile();
    closeFeedbackHub();
    goToTab('calculator');
    if (typeof document !== 'undefined') {
      document.body.removeAttribute('data-tour-active');
    }
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
    onClose();
  }, [clearAllTimers, closeMaxEditor, closeProfile, closeFeedbackHub, goToTab, onClose]);

  // Clean unlock on unmount
  useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      document.body.setAttribute('data-tour-active', 'true');
    }
    return () => {
      clearAllTimers();
      closeMaxEditor();
      forceUnlockTourScroll();
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('data-tour-active');
      }
    };
  }, [isOpen, clearAllTimers, closeMaxEditor]);

  // Window-level scroll blocking while tour is active
  useEffect(() => {
    if (!isOpen) {
      forceUnlockTourScroll();
      return;
    }

    lockTourScroll();

    const handleWheel = (e: WheelEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };

    const scrollKeys = new Set([
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' ',
      'Spacebar',
    ]);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }
      if (scrollKeys.has(e.key)) {
        e.preventDefault();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  // Target element selector mapping
  const getStepTargetSelector = useCallback(
    (step: TourStep, marksBeat: 1 | 2): string | null => {
      switch (step) {
        case 'profile_icon':
          return '#tour-profile-button, [data-tour="profile-button"]';
        case 'edit_profile':
          return '#tour-edit-profile, [data-tour="edit-profile"]';
        case 'feedback_drawer':
          return '#tour-profile-feedback, [data-tour="profile-feedback"]';
        case 'feedback_screen':
          return '#feedback-hub-heading, [data-tour="feedback-hub-text"], #tour-feedback-header h1, #tour-feedback-header';
        case 'semester_selector':
          return '#tour-semester-selector, [data-tour="semester-selector"]';
        case 'estimated_lab':
          return '#tour-estimated-lab-checkbox, [data-tour="estimated-lab-checkbox"]';
        case 'marks_entry':
          return '#test-scored-1, [data-tour="marks-entry"]';
        case 'change_total_marks':
          if (marksBeat === 1) {
            return '#tour-test-max-pencil-1, [data-tour="test-max-pencil"]';
          }
          return '#tour-test-max-input-1, [data-tour="test-max-input"], #tour-test-max-editor-1, [data-tour="test-max-editor"]';
        case 'target_simulator':
          return '#tour-target-grade-simulator-text, [data-tour="target-grade-simulator-text"], #tour-target-grade-simulator h4, #tour-target-grade-simulator';
        case 'grades_of_choice':
          return '#tour-grades-of-choice-button, [data-tour="grades-of-choice-button"]';
        default:
          return null;
      }
    },
    []
  );

  // Measure target position with resilient polling & smooth scrolling
  const measureTarget = useCallback(
    (step: TourStep, marksBeat: 1 | 2) => {
      const selector = getStepTargetSelector(step, marksBeat);
      if (!selector) {
        setTargetRect(null);
        setPenDrawn(true);
        return;
      }

      let attempt = 0;
      const maxAttempts = 80; // Allow drawers and tab content time to finish rendering

      const applyTargetMeasurement = (element: HTMLElement, sel: string, st: TourStep) => {
        const finalRect = element.getBoundingClientRect();
        if (finalRect.width > 0 && finalRect.height > 0) {
          const nextTargetRect = {
            x: Math.round(finalRect.left),
            y: Math.round(finalRect.top),
            width: Math.round(finalRect.width),
            height: Math.round(finalRect.height),
          };
          const measuredCardHeight = cardRef.current?.offsetHeight || cardHeight;
          setTargetRect(nextTargetRect);
          setCardPosition(computeCardPosition(nextTargetRect, st, measuredCardHeight));

          // Lock scrolling after element is in position
          lockTourScroll();

          setPenDrawn(true);

          // Refine measurement after ongoing animations settle
          if (refineTimerRef.current !== null) {
            window.clearTimeout(refineTimerRef.current);
          }
          refineTimerRef.current = window.setTimeout(() => {
            if (currentStepRef.current !== st) return;
            try {
              const refinedEl = findVisibleTarget(sel);
              if (refinedEl) {
                const r = refinedEl.getBoundingClientRect();
                if (r.width > 0 && r.height > 0) {
                  const refinedTargetRect = {
                    x: Math.round(r.left),
                    y: Math.round(r.top),
                    width: Math.round(r.width),
                    height: Math.round(r.height),
                  };
                  setTargetRect(refinedTargetRect);
                  setCardPosition(
                    computeCardPosition(
                      refinedTargetRect,
                      st,
                      cardRef.current?.offsetHeight || cardHeight
                    )
                  );
                }
              }
            } catch {}
          }, 140);
        }
      };

      const pollForElement = () => {
        attempt += 1;
        if (currentStepRef.current !== step) return;

        try {
          const element = findVisibleTarget(selector);
          if (element) {
            if (step === 'target_simulator') {
              const details = element.closest('details') || element.querySelector('details');
              if (details instanceof HTMLDetailsElement) details.open = true;
            }
            const isHeader = element.closest('header') !== null;
            const curRect = element.getBoundingClientRect();
            const inViewport =
              curRect.top >= 20 &&
              curRect.bottom <= (window.innerHeight || 800) - 20 &&
              curRect.left >= 0 &&
              curRect.right <= (window.innerWidth || 400);

            const needsScroll = !isHeader && !inViewport;

            if (needsScroll) {
              safeScrollIntoView(element, { block: 'center', behavior: 'auto' });

              // Allow browser layout and scroll to settle before measuring
              window.setTimeout(() => {
                if (currentStepRef.current !== step) return;
                const settledElement = findVisibleTarget(selector);
                if (settledElement) {
                  applyTargetMeasurement(settledElement, selector, step);
                } else if (attempt < maxAttempts) {
                  pollTimerRef.current = window.setTimeout(pollForElement, 50);
                }
              }, 100);
              return;
            }

            // Element is already in visible viewport
            applyTargetMeasurement(element, selector, step);
            return;
          }
        } catch (err) {
          console.warn('Tour measuring error:', err);
        }

        if (attempt < maxAttempts) {
          pollTimerRef.current = window.setTimeout(pollForElement, 50);
        } else {
          lockTourScroll();
          setPenDrawn(true);
        }
      };

      pollForElement();
    },
    [cardHeight, getStepTargetSelector]
  );

  // Navigate to real screens for each step and measure
  const navigateToStep = useCallback(
    (nextStep: TourStep) => {
      currentStepRef.current = nextStep;
      clearAllTimers();
      setTargetRect(null);
      setPenDrawn(false);
      setCurrentStep(nextStep);

      // Temporarily release scroll lock so programmatic scrolling operates cleanly
      forceUnlockTourScroll();

      switch (nextStep) {
        case 'welcome':
        case 'profile_icon':
          closeMaxEditor();
          closeProfile();
          closeFeedbackHub();
          goToTab('calculator');
          break;

        case 'edit_profile':
          closeMaxEditor();
          openProfile();
          break;

        case 'feedback_drawer':
          closeMaxEditor();
          openProfile();
          break;

        case 'feedback_screen':
          closeMaxEditor();
          closeProfile();
          openFeedbackHub();
          break;

        case 'semester_selector':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          goToTab('calculator');
          break;

        case 'estimated_lab':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          openCourseCalculator();
          break;

        case 'marks_entry':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          openCourseCalculator();
          break;

        case 'change_total_marks':
          closeFeedbackHub();
          closeProfile();
          openCourseCalculator();
          setTotalMarksBeat(1);
          break;

        case 'target_simulator':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          openTargetSimulator();
          break;

        case 'grades_of_choice':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          goToTab('gpa');
          break;

        case 'finish':
          closeMaxEditor();
          closeFeedbackHub();
          closeProfile();
          goToTab('calculator');
          setTargetRect(null);
          return;
      }

    },
    [
      clearAllTimers,
      closeMaxEditor,
      closeProfile,
      openProfile,
      closeFeedbackHub,
      openFeedbackHub,
      openCourseCalculator,
      openTargetSimulator,
      goToTab,
      measureTarget,
    ]
  );

  // Measure after each step has rendered its destination screen. Keeping this
  // tied to step state avoids losing the target outline during batched updates.
  useEffect(() => {
    if (!isOpen || currentStep === 'welcome' || currentStep === 'finish') return;
    const timer = window.setTimeout(() => {
      measureTarget(currentStep, totalMarksBeat);
    }, 75);
    return () => window.clearTimeout(timer);
  }, [isOpen, currentStep, totalMarksBeat, measureTarget]);

  // Resize / orientation listener to recalculate position smoothly
  useEffect(() => {
    const handleResize = () => {
      measureTarget(currentStep, totalMarksBeat);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [currentStep, totalMarksBeat, measureTarget]);

  // Initial measurement when tour opens
  useEffect(() => {
    if (!isOpen) return;
    navigateToStep('welcome');
    return () => clearAllTimers();
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  // Viewport bounds for safe coordinate clamping
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  // Hand-drawn organic SVG pen paths matching CalCredit logo
  // Clamped inside visible viewport so strokes are never cut off by screen edges
  const circlePath = targetRect
    ? (() => {
        const minX = Math.max(3, targetRect.x - 7);
        const maxX = Math.min(vw - 3, targetRect.x + targetRect.width + 7);
        const minY = Math.max(3, targetRect.y - 7);
        const maxY = Math.min(vh - 3, targetRect.y + targetRect.height + 7);

        const startX = Math.max(3, targetRect.x + targetRect.width * 0.1);
        const startY = Math.max(3, targetRect.y + targetRect.height * 0.15);
        const topMidX = targetRect.x + targetRect.width * 0.5;
        const bottomMidX = targetRect.x + targetRect.width * 0.45;
        const overlapX = Math.min(maxX, targetRect.x + targetRect.width * 0.85);
        const overlapY = Math.max(3, targetRect.y + 2);

        return (
          `M ${startX} ${startY} ` +
          `C ${topMidX} ${minY}, ${maxX} ${targetRect.y + targetRect.height * 0.25}, ${maxX - 1} ${targetRect.y + targetRect.height * 0.65} ` +
          `C ${maxX - 2} ${maxY}, ${bottomMidX} ${maxY}, ${minX} ${targetRect.y + targetRect.height * 0.65} ` +
          `C ${minX} ${targetRect.y + targetRect.height * 0.25}, ${targetRect.x + targetRect.width * 0.3} ${minY}, ${overlapX} ${overlapY}`
        );
      })()
    : '';

  // Smart computed positioning and arrow offset
  const cardPos = computeCardPosition(targetRect, currentStep, cardHeight);

  return (
    <div
      className="fixed inset-0 z-[80] pointer-events-auto select-none font-sans"
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Tour"
    >
      {/* Background layer: clean, transparent, no dark spotlight, no glassmorphism */}
      <div className="absolute inset-0 bg-slate-900/25 pointer-events-none" />

      {/* SVG Canvas for the Hand-Drawn Red Pen matching CalCredit logo stroke */}
      {targetRect && (
        <svg
          className="fixed inset-0 w-full h-full pointer-events-none z-[85]"
          aria-hidden="true"
        >
          <path
            d={circlePath}
            fill="none"
            stroke={penColor}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={reduceMotion || penDrawn ? 0 : 100}
            style={{
              transition: reduceMotion
                ? 'none'
                : 'stroke-dashoffset 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </svg>
      )}

      {/* Main Tour Content Card container */}
      <div className="fixed inset-0 pointer-events-none z-[90]">
        {/* STEP 0: Welcome Card */}
        {currentStep === 'welcome' && (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950/40"
                style={{ color: penColor }}
              >
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 font-heading text-lg font-black text-[#172554] dark:text-[#f1f1f3] leading-snug">
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
          </div>
        )}

        {/* STEPS 1-10: Smart positioned tooltip card with directional arrow pointing to target */}
        {currentStep !== 'welcome' && currentStep !== 'finish' && (
          <div
            ref={cardRef}
            className="pointer-events-auto absolute max-w-xs w-[calc(100%-2rem)] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-5 shadow-2xl text-left transition-[top,left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
            style={{
              top: cardPosition.top,
              left: cardPosition.left,
            }}
          >
            {/* Visual Pointer Arrow pointing directly into the circled target button */}
            {targetRect && (
              <div
                className={`absolute w-3.5 h-3.5 rotate-45 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] shadow-xs ${
                  cardPos.placement === 'below'
                    ? '-top-2 border-t border-l'
                    : '-bottom-2 border-b border-r'
                }`}
                style={{ left: cardPos.arrowX - 7 }}
                aria-hidden="true"
              />
            )}

            {/* STEP 1: Profile Icon (Step 1 of 10) */}
            {currentStep === 'profile_icon' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
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
                      Step <span className="font-numeric tabular-nums">1</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('edit_profile')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Edit Profile Button in Drawer (Step 2 of 10) */}
            {currentStep === 'edit_profile' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                    Edit your profile. Keep your details up to date.
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
                      Step <span className="font-numeric tabular-nums">2</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('feedback_drawer')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: Feedback Item in Drawer (Step 3 of 10) */}
            {currentStep === 'feedback_drawer' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                    Feedback is here.
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
                      Step <span className="font-numeric tabular-nums">3</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('feedback_screen')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 4: Feedback Screen (Step 4 of 10) - Points to Feedback Hub text without hiding it */}
            {currentStep === 'feedback_screen' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
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
                      Step <span className="font-numeric tabular-nums">4</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
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
              </>
            )}

            {/* STEP 5: Semester Selector (Step 5 of 10) - Points to header dropdown without hiding it */}
            {currentStep === 'semester_selector' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
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
                      Step <span className="font-numeric tabular-nums">5</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('estimated_lab')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 6: Estimated Lab & Activity Average (Step 6 of 10) */}
            {currentStep === 'estimated_lab' && (
              <>
                <div className="flex items-start gap-2">
                  <span className="mt-1 flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <div>
                    <p className="font-heading text-xs font-black text-[#172554] dark:text-[#f1f1f3] leading-snug">
                      Projects missing lab &amp; activity marks to preview your grade early.
                    </p>
                  </div>
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
                      Step <span className="font-numeric tabular-nums">6</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
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
              </>
            )}

            {/* STEP 7: Real Marks Entry Field (Step 7 of 10) */}
            {currentStep === 'marks_entry' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                    Enter your marks here. Your grade updates live.
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
                      Step <span className="font-numeric tabular-nums">7</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('change_total_marks')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 8: Change Total Marks (Step 8 of 10, 2 beats) */}
            {currentStep === 'change_total_marks' && (
              <>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                    {totalMarksBeat === 1
                      ? 'Maximum marks not out of 50?'
                      : 'Teachers set different totals. Match it to your paper.'}
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
                      Step <span className="font-numeric tabular-nums">8</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (totalMarksBeat === 1) {
                          // Advance to Beat 2: open the max editor popover
                          const pencilBtn = document.querySelector(
                            '#tour-test-max-pencil-1, [data-tour="test-max-pencil"]'
                          ) as HTMLButtonElement | null;
                          const editor = document.querySelector(
                            '#tour-test-max-editor-1, [data-tour="test-max-editor"]'
                          );
                          if (pencilBtn && !editor) {
                            pencilBtn.click();
                          }
                          setTotalMarksBeat(2);
                          setPenDrawn(false);
                          window.setTimeout(() => {
                            measureTarget('change_total_marks', 2);
                          }, 80);
                        } else {
                          // Beat 2 completed: close editor, restore 50, navigate to target simulator
                          closeMaxEditor();
                          navigateToStep('target_simulator');
                        }
                      }}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 9: Target Grade Simulator Text (Step 9 of 10) - Scrolls down further and circles text */}
            {currentStep === 'target_simulator' && (
              <>
                <div className="flex items-start gap-2">
                  <span className="mt-1 flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <div>
                    <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                      Pick a target grade. See the marks you need.
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Calculates the exact exam score required based on your continuous assessment.
                    </p>
                  </div>
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
                      Step <span className="font-numeric tabular-nums">9</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('grades_of_choice')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 10: Enter Grades of Choice on GPA Hub (Step 10 of 10) - Positioned above button without hiding it */}
            {currentStep === 'grades_of_choice' && (
              <>
                <div className="flex items-start gap-2">
                  <span className="mt-1 flex h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: penColor }} />
                  <div>
                    <p className="font-heading text-sm font-black text-[#172554] dark:text-[#f1f1f3]">
                      Already know your grades? Enter them here.
                    </p>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                      Get your semester GPA without entering any marks.
                    </p>
                  </div>
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
                      Step <span className="font-numeric tabular-nums">10</span> of{' '}
                      <span className="font-numeric tabular-nums">{TOTAL_STEPS}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => navigateToStep('finish')}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-[#172554] px-3.5 text-xs font-bold text-white hover:bg-[#1e3a8a] active:scale-95 transition-transform cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* FINISH CARD: Appears after Step 10 */}
        {currentStep === 'finish' && (
          <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e1e22] p-6 shadow-2xl text-left">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                <Check className="h-6 w-6 stroke-[3]" aria-hidden="true" />
              </div>

              <h2 className="mt-4 font-heading text-lg font-black text-[#172554] dark:text-[#f1f1f3] leading-snug">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default FirstTimeTour;

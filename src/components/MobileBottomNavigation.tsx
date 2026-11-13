import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BookOpen,
  Calculator,
  ChartColumnIncreasing,
  GraduationCap,
} from 'lucide-react';
import { transitions } from '../motion';

type WorkspaceTab = 'calculator' | 'grades' | 'gpa' | 'cgpa';

interface MobileBottomNavigationProps {
  activeTab: WorkspaceTab | null;
  coursesOpen: boolean;
  onNavigate: (tab: WorkspaceTab) => void;
  onToggleCourses: () => void;
  coursesButtonRef: React.Ref<HTMLButtonElement>;
  swipeOffset?: number;
}

const destinations = [
  { label: 'Calculator', tab: 'calculator', Icon: Calculator },
  { label: 'Courses', tab: null, Icon: BookOpen },
  { label: 'GPA Hub', tab: 'gpa', Icon: GraduationCap },
  { label: 'CGPA Hub', tab: 'cgpa', Icon: ChartColumnIncreasing },
] as const;

export const MobileBottomNavigation: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  coursesOpen,
  onNavigate,
  onToggleCourses,
  coursesButtonRef,
  swipeOffset = 0,
}) => (
  <MobileNavigationContent
    activeTab={activeTab}
    coursesOpen={coursesOpen}
    onNavigate={onNavigate}
    onToggleCourses={onToggleCourses}
    coursesButtonRef={coursesButtonRef}
    swipeOffset={swipeOffset}
  />
);

const MobileNavigationContent: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  coursesOpen,
  onNavigate,
  onToggleCourses,
  coursesButtonRef,
  swipeOffset = 0,
}) => {
  const reduceMotion = useReducedMotion();

  let targetCol = -1;
  if (coursesOpen) {
    targetCol = 1;
  } else if (activeTab === 'calculator') {
    targetCol = 0;
  } else if (activeTab === 'gpa') {
    targetCol = 2;
  } else if (activeTab === 'cgpa') {
    targetCol = 3;
  }

  // Factor in real-time swipe offset between calculator (col 0), gpa (col 2), and cgpa (col 3)
  const effectiveCol = targetCol >= 0 ? targetCol + swipeOffset : -1;

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-3 bottom-[calc(0.75rem+var(--safe-area-bottom))] z-40 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-300 dark:border-slate-700 bg-white/98 dark:bg-[#202024]/98 shadow-sm transition-[bottom] duration-300 ease-out md:hidden"
    >
      {effectiveCol >= 0 && (
        <motion.div
          className="pointer-events-none absolute top-0 h-0.5"
          style={{ width: '25%' }}
          animate={{
            x: `${effectiveCol * 100}%`,
            opacity: 1,
          }}
          initial={false}
          transition={
            swipeOffset !== 0
              ? { duration: 0 }
              : reduceMotion
                ? { duration: 0 }
                : transitions.spring
          }
          aria-hidden="true"
        >
          <span className="mx-auto block h-full w-12 rounded-b-full bg-[#d97757] dark:bg-[#e08564]" />
        </motion.div>
      )}

      {destinations.map(({ label, tab, Icon }) => {
        const isActive = tab === null ? coursesOpen : activeTab === tab;
        return (
          <button
            key={label}
            id={`tour-tab-${tab || 'courses'}`}
            data-tour={`tab-${tab || 'courses'}`}
            ref={tab === null ? coursesButtonRef : undefined}
            type="button"
            onClick={tab === null ? onToggleCourses : () => onNavigate(tab)}
            aria-pressed={isActive}
            aria-expanded={tab === null ? coursesOpen : undefined}
            aria-controls={tab === null && coursesOpen ? 'mobile-courses-sheet' : undefined}
            className={`relative flex min-h-[4.25rem] flex-col items-center justify-center gap-1 border-t-2 px-1 py-2 text-[9px] font-bold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#d97757] dark:focus-visible:outline-[#e08564] ${
              isActive
                ? 'border-transparent text-[#172554] dark:text-[#f1f1f3]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#2a2a30] hover:text-[#172554] dark:hover:text-[#f1f1f3]'
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] transition-colors ${
                isActive ? 'text-[#d97757] dark:text-[#e08564]' : ''
              }`}
              aria-hidden="true"
            />
            <span className="whitespace-nowrap">{label}</span>
          </button>
        );
      })}
    </nav>
  );
};

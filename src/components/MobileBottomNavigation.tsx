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
}) => (
  <MobileNavigationContent
    activeTab={activeTab}
    coursesOpen={coursesOpen}
    onNavigate={onNavigate}
    onToggleCourses={onToggleCourses}
    coursesButtonRef={coursesButtonRef}
  />
);

const MobileNavigationContent: React.FC<MobileBottomNavigationProps> = ({
  activeTab,
  coursesOpen,
  onNavigate,
  onToggleCourses,
  coursesButtonRef,
}) => {
  const reduceMotion = useReducedMotion();

  return <nav
    aria-label="Mobile navigation"
    className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 grid grid-cols-4 overflow-hidden rounded-2xl border border-slate-300 bg-white/95 shadow-sm backdrop-blur-sm md:hidden"
  >
    {destinations.map(({ label, tab, Icon }) => {
      const isActive = tab === null ? coursesOpen : activeTab === tab;
      return (
        <button
          key={label}
          ref={tab === null ? coursesButtonRef : undefined}
          type="button"
          onClick={tab === null ? onToggleCourses : () => onNavigate(tab)}
          aria-pressed={isActive}
          aria-expanded={tab === null ? coursesOpen : undefined}
          aria-controls={tab === null && coursesOpen ? 'mobile-courses-sheet' : undefined}
          className={`relative flex min-h-[4.25rem] flex-col items-center justify-center gap-1 border-t-2 px-1 py-2 text-[9px] font-bold transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554] ${
            isActive ? 'border-transparent text-[#172554]' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-[#172554]'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId="mobile-navigation-indicator"
              className="absolute inset-x-3 top-0 h-0.5 rounded-b-full bg-[#172554]"
              transition={reduceMotion ? { duration: 0 } : transitions.spring}
              aria-hidden="true"
            />
          )}
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
          <span className="whitespace-nowrap">{label}</span>
        </button>
      );
    })}
  </nav>
};

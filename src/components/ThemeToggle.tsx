import React from 'react';
import { Moon, Sun } from 'lucide-react';

export type AppTheme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: AppTheme;
  onToggle: () => void;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle, className }) => {
  const action = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
  const Icon = theme === 'dark' ? Sun : Moon;

  const defaultClasses = 'h-10 w-10 rounded-full';
  const customClasses = className ? className : defaultClasses;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={action}
      title={action}
      className={`inline-flex shrink-0 items-center justify-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e1e20] text-[#172554] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252528] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] transition-colors cursor-pointer ${customClasses}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
};

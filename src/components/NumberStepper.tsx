import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface NumberStepperProps {
  value: number | string;
  onChange: (val: number | string) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  ariaLabel?: string;
  ariaLabelDecrement?: string;
  ariaLabelIncrement?: string;
  id?: string;
  size?: 'sm' | 'md';
  className?: string;
  placeholder?: string;
}

/**
 * Reusable stepper component with unified visual structure:
 * [ − ] [ VALUE ] [ + ]
 *
 * Provides touch-friendly targets, equal-sized buttons, centre-aligned
 * numerical value, and Inter with tabular numerals.
 */
export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  onIncrement,
  onDecrement,
  min = 0,
  max,
  step = 1,
  disabled = false,
  readOnly = false,
  ariaLabel,
  ariaLabelDecrement,
  ariaLabelIncrement,
  id,
  size = 'md',
  className = '',
  placeholder = '0',
}) => {
  const numVal = typeof value === 'number' ? value : parseFloat(String(value));
  const isMin = !isNaN(numVal) && numVal <= min;
  const isMax = max !== undefined && !isNaN(numVal) && numVal >= max;

  const canDecrement = !disabled && !readOnly && !isMin;
  const canIncrement = !disabled && !readOnly && !isMax;

  const isSmall = size === 'sm';

  return (
    <div
      className={`inline-flex items-stretch rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#202024] shadow-2xs overflow-hidden transition-colors ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Minus Button */}
      <button
        type="button"
        onClick={onDecrement}
        disabled={!canDecrement}
        aria-label={ariaLabelDecrement || 'Decrease value'}
        className={`flex items-center justify-center text-[#172554] dark:text-[#f1f1f3] hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 border-r border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
          isSmall ? 'h-8 w-7 sm:h-8.5 sm:w-8' : 'h-10 w-9 sm:h-11 sm:w-10'
        }`}
      >
        <Minus className={isSmall ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-4 h-4'} />
      </button>

      {/* Value Input */}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value === '' || value === undefined ? '' : value}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={`text-center font-bold font-numeric tabular-nums text-[#172554] dark:text-[#f1f1f3] bg-transparent focus:outline-hidden focus:bg-slate-50 dark:focus:bg-[#2a2a30] transition-colors ${
          readOnly ? 'bg-blue-50/50 dark:bg-blue-950/20 text-[#1e3a8a] dark:text-[#93c5fd]' : ''
        } ${isSmall ? 'h-8 w-10 sm:h-8.5 sm:w-12 text-xs sm:text-sm px-1' : 'h-10 w-12 sm:h-11 sm:w-14 text-sm sm:text-base px-2'}`}
      />

      {/* Plus Button */}
      <button
        type="button"
        onClick={onIncrement}
        disabled={!canIncrement}
        aria-label={ariaLabelIncrement || 'Increase value'}
        className={`flex items-center justify-center text-[#172554] dark:text-[#f1f1f3] hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700 border-l border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
          isSmall ? 'h-8 w-7 sm:h-8.5 sm:w-8' : 'h-10 w-9 sm:h-11 sm:w-10'
        }`}
      >
        <Plus className={isSmall ? 'w-3 h-3 sm:w-3.5 sm:h-3.5' : 'w-4 h-4'} />
      </button>
    </div>
  );
};


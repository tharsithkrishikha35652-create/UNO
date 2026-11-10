import React, { useEffect, useRef, useState } from 'react';

interface MaxMarksInputProps {
  id: string;
  label: string;
  value: number | string;
  onChange: (value: number | string) => void;
  className?: string;
}

export const MaxMarksInput: React.FC<MaxMarksInputProps> = ({
  id,
  label,
  value,
  onChange,
  className = '',
}) => {
  const [draft, setDraft] = useState(String(value));
  const cancelCommitRef = useRef(false);

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commitDraft = () => {
    const parsed = Number(draft);
    if (!draft.trim() || !Number.isFinite(parsed) || parsed < 1) {
      setDraft(String(value));
      return;
    }
    const normalized = Math.max(1, parsed);
    setDraft(String(normalized));
    onChange(normalized);
  };

  return (
    <label className={`inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 ${className}`}>
      <span>Max</span>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        min={1}
        step={0.5}
        value={draft}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={() => {
          if (cancelCommitRef.current) {
            cancelCommitRef.current = false;
            setDraft(String(value));
            return;
          }
          commitDraft();
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') {
            cancelCommitRef.current = true;
            setDraft(String(value));
            event.currentTarget.blur();
          }
        }}
        aria-label={label}
        className="h-8 w-16 rounded-md border border-slate-300 bg-white px-2 text-xs font-bold text-[#172554] tabular-nums dark:border-slate-600 dark:bg-[#161618] dark:text-[#f1f1f3] focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
      />
    </label>
  );
};

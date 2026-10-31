import React, { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'motion/react';
import { motionTiming } from '../motion';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  className?: string;
}

/** A result-only counter; never use this around editable input values. */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, decimals = 2, className }) => {
  const reduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      return;
    }
    const controls = animate(displayValue, value, {
      duration: 0.52,
      ease: motionTiming.ease,
      onUpdate: setDisplayValue,
    });
    return () => controls.stop();
  // Re-run only for a result value change. displayValue is intentionally the animation's start.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduceMotion]);

  return <span className={className}>{displayValue.toFixed(decimals)}</span>;
};

import React, { useEffect, useRef, useState } from 'react';
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
  // Start at 0 on initial appearance when motion is enabled, or target value when motion is reduced
  const [displayValue, setDisplayValue] = useState<number>(() => (reduceMotion ? value : 0));
  const prevValueRef = useRef<number>(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const from = prevValueRef.current;
    const to = value;

    if (from === to) {
      setDisplayValue(to);
      return;
    }

    const controls = animate(from, to, {
      duration: 0.52,
      ease: motionTiming.ease,
      onUpdate: (latest) => {
        setDisplayValue(latest);
        prevValueRef.current = latest;
      },
      onComplete: () => {
        prevValueRef.current = to;
      },
    });

    return () => {
      controls.stop();
    };
  }, [value, reduceMotion]);

  return <span className={className}>{displayValue.toFixed(decimals)}</span>;
};

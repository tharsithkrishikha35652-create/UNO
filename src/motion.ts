import { type Transition, type Variants } from 'motion/react';

// Shared, deliberately restrained motion vocabulary. Keep duration and easing
// here so browser and Capacitor surfaces feel like one product.
export const motionTiming = {
  instant: 0.12,
  feedback: 0.16,
  state: 0.22,
  overlay: 0.3,
  page: 0.36,
  ease: [0.16, 1, 0.3, 1],
  exitEase: [0.4, 0, 1, 1],
} as const;

export const transitions = {
  feedback: { duration: motionTiming.feedback, ease: motionTiming.ease },
  state: { duration: motionTiming.state, ease: motionTiming.ease },
  overlay: { duration: motionTiming.overlay, ease: motionTiming.ease },
  exit: { duration: 0.18, ease: motionTiming.exitEase },
  spring: { type: 'spring', stiffness: 420, damping: 34, mass: 0.7 },
} satisfies Record<string, Transition>;

export const motionVariants = {
  page: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: transitions.overlay },
    exit: { opacity: 0, y: -6, transition: transitions.exit },
  },
  card: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: transitions.state },
    exit: { opacity: 0, y: 4, transition: transitions.exit },
  },
  dialog: {
    initial: { opacity: 0, scale: 0.98, y: 8 },
    animate: { opacity: 1, scale: 1, y: 0, transition: transitions.overlay },
    exit: { opacity: 0, scale: 0.99, y: 4, transition: transitions.exit },
  },
  sheet: {
    initial: { y: '100%' },
    animate: { y: 0, transition: transitions.overlay },
    exit: { y: '100%', transition: transitions.exit },
  },
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: transitions.state },
    exit: { opacity: 0, transition: transitions.exit },
  },
  list: {
    animate: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
  },
  listItem: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: transitions.state },
  },
} satisfies Record<string, Variants>;

import React, { useRef, useEffect } from 'react';
import { motion, useDragControls, useReducedMotion, useMotionValue, animate } from 'motion/react';
import { transitions } from '../motion';
import { acknowledgeNavigation } from '../haptics';

type SwipeTab = 'calculator' | 'gpa' | 'cgpa';
type WorkspaceTab = SwipeTab | 'grades';

interface MobileSwipeNavigatorProps {
  activeTab: WorkspaceTab;
  disabled?: boolean;
  onNavigate: (tab: SwipeTab) => void;
  onSwipeOffsetChange?: (offsetCol: number) => void;
  children: React.ReactNode;
}

const interactiveTarget = [
  'input',
  'textarea',
  'select',
  'button',
  'a',
  '[role="button"]',
  '[role="slider"]',
  '[role="dialog"]',
  '[contenteditable="true"]',
  '[data-no-swipe]',
].join(',');

/**
 * Owns deliberate horizontal workspace swipes between Calculator <-> GPA <-> CGPA.
 * Native controls, vertical scrolling and bottom sheets retain priority because a drag
 * begins only from non-interactive targets, and Motion locks the drag direction.
 */
export const MobileSwipeNavigator: React.FC<MobileSwipeNavigatorProps> = ({
  activeTab,
  disabled = false,
  onNavigate,
  onSwipeOffsetChange,
  children,
}) => {
  const dragControls = useDragControls();
  const reduceMotion = useReducedMotion();
  const mayDragRef = useRef(false);
  const x = useMotionValue(0);

  const tabOrder: SwipeTab[] = ['calculator', 'gpa', 'cgpa'];
  const activeIndex = tabOrder.indexOf(activeTab as SwipeTab);
  const canSwipe = !disabled && activeIndex >= 0;

  // Boundary constraints based on current tab index
  const isFirstTab = activeIndex === 0;
  const isLastTab = activeIndex === tabOrder.length - 1;

  // Reset x and indicator offset whenever activeTab changes
  useEffect(() => {
    x.set(0);
    onSwipeOffsetChange?.(0);
  }, [activeTab, x, onSwipeOffsetChange]);

  // Calculate indicator column offset from swipe drag pixel offset
  const calculateColOffset = (dragX: number): number => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth || 360 : 360;
    // dragX < 0 means dragging left (towards next tab)
    // dragX > 0 means dragging right (towards previous tab)
    const ratio = -dragX / screenWidth;

    if (activeIndex === 0) {
      // Calculator (col 0) -> GPA Hub (col 2): distance is 2 columns
      return Math.max(0, Math.min(2, ratio * 2));
    }
    if (activeIndex === 1) {
      // GPA Hub (col 2):
      // Drag left towards CGPA Hub (col 3): distance is 1 column
      // Drag right towards Calculator (col 0): distance is -2 columns
      return ratio > 0 ? Math.min(1, ratio) : Math.max(-2, ratio * 2);
    }
    if (activeIndex === 2) {
      // CGPA Hub (col 3) -> GPA Hub (col 2): distance is -1 column
      return Math.max(-1, Math.min(0, ratio));
    }
    return 0;
  };

  const snapBack = () => {
    mayDragRef.current = false;
    onSwipeOffsetChange?.(0);
    animate(x, 0, transitions.spring);
  };

  return (
    <motion.div
      className="min-w-0 touch-pan-y"
      style={{ x }}
      drag={canSwipe && !reduceMotion ? 'x' : false}
      dragControls={dragControls}
      dragListener={false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{
        left: isLastTab ? 0 : 0.25,
        right: isFirstTab ? 0 : 0.25,
      }}
      dragMomentum={false}
      onPointerDownCapture={(event) => {
        const target = event.target as Element | null;
        mayDragRef.current = Boolean(
          canSwipe && target && !target.closest(interactiveTarget)
        );
        if (mayDragRef.current) dragControls.start(event);
      }}
      onPointerUpCapture={() => {
        snapBack();
      }}
      onDrag={(_, info) => {
        if (!mayDragRef.current) return;
        const colOffset = calculateColOffset(info.offset.x);
        onSwipeOffsetChange?.(colOffset);
      }}
      onDragEnd={(_, info) => {
        snapBack();
        if (!mayDragRef.current && Math.abs(info.offset.x) < 1) return;

        const distanceThreshold = 72;
        const velocityThreshold = 600;
        const shouldAdvance =
          Math.abs(info.offset.x) > distanceThreshold ||
          Math.abs(info.velocity.x) > velocityThreshold;

        if (!shouldAdvance) return;

        const direction = info.offset.x < 0 || info.velocity.x < -velocityThreshold ? 1 : -1;
        const nextTab = tabOrder[activeIndex + direction];
        if (nextTab) {
          acknowledgeNavigation();
          onNavigate(nextTab);
        }
      }}
    >
      {children}
    </motion.div>
  );
};

import React from 'react';

export const TOUR_STORAGE_KEY = 'calcredit_tour_completed_v1';

let prevBodyOverflow = '';
let prevHtmlOverflow = '';
let prevBodyPaddingRight = '';
let prevBodyOverscroll = '';
let isScrollLocked = false;
let isTourScrollLocked = false;
const overlayScrollLocks = new Set<symbol>();

function syncPageScrollLock() {
  if (typeof document === 'undefined') return;

  const shouldLock = isTourScrollLocked || overlayScrollLocks.size > 0;
  if (shouldLock && !isScrollLocked) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    prevBodyOverflow = document.body.style.overflow;
    prevHtmlOverflow = document.documentElement.style.overflow;
    prevBodyPaddingRight = document.body.style.paddingRight;
    prevBodyOverscroll = document.body.style.overscrollBehavior;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overscrollBehavior = 'none';
    isScrollLocked = true;
  } else if (!shouldLock && isScrollLocked) {
    document.body.style.overflow = prevBodyOverflow;
    document.documentElement.style.overflow = prevHtmlOverflow;
    document.body.style.paddingRight = prevBodyPaddingRight;
    document.body.style.overscrollBehavior = prevBodyOverscroll;
    isScrollLocked = false;
  }
}

/** Acquires an independent scroll-lock lease for an open overlay. */
export function acquireOverlayScrollLock() {
  const lock = Symbol('overlay-scroll-lock');
  overlayScrollLocks.add(lock);
  syncPageScrollLock();
  return () => {
    overlayScrollLocks.delete(lock);
    syncPageScrollLock();
  };
}

/**
 * Locks page scrolling without causing layout shifts by compensating
 * for disappearing scrollbar width with body padding.
 */
export function lockTourScroll() {
  isTourScrollLocked = true;
  syncPageScrollLock();
}

/**
 * Releases the scroll lock and restores previous styles cleanly.
 */
export function unlockTourScroll() {
  isTourScrollLocked = false;
  syncPageScrollLock();
}

export function forceUnlockTourScroll() {
  unlockTourScroll();
}

export class TourErrorBoundary extends React.Component<{
  onClose: () => void;
  children: React.ReactNode;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Tour encountered an issue and was closed safely:', error);
    forceUnlockTourScroll();
    try {
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    } catch {}
    this.props.onClose();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

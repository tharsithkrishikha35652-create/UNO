import React from 'react';

export const TOUR_STORAGE_KEY = 'calcredit_tour_completed_v1';

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


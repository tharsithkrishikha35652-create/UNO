import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Pre-initialize safe-area insets on mobile Android environments
if (typeof window !== 'undefined') {
  try {
    const isAndroid =
      (window as unknown as { Capacitor?: { getPlatform?: () => string } })?.Capacitor?.getPlatform?.() === 'android' ||
      /android/i.test(navigator.userAgent);

    if (isAndroid) {
      const currentTop = document.documentElement.style.getPropertyValue('--safe-area-inset-top');
      if (!currentTop || currentTop === '0px' || currentTop.trim() === '') {
        // Default standard Android status bar height in dp (24px) until exact WindowInsets are reported by MainActivity
        document.documentElement.style.setProperty('--safe-area-inset-top', '24px');
      }
      const currentBottom = document.documentElement.style.getPropertyValue('--safe-area-inset-bottom');
      if (!currentBottom || currentBottom.trim() === '') {
        // Default to 0px so gesture navigation, web, and non-native views remain flush at the bottom.
        // MainActivity dynamically injects the bottom inset only when 3-button navigation is active.
        document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
      }
    }
  } catch {
    // Non-blocking fallback
  }
}

createRoot(document.getElementById('root')!).render(<App />);

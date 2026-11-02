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
    }
  } catch {
    // Non-blocking fallback
  }
}

createRoot(document.getElementById('root')!).render(<App />);

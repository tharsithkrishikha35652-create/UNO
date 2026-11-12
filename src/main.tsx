import {createRoot} from 'react-dom/client';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App.tsx';
import './index.css';

// Immediately dismiss native splash screen so the web launch animation runs seamlessly
SplashScreen.hide().catch(() => {});

// Pre-initialize safe-area insets on mobile Android environments
if (typeof window !== 'undefined') {
  // Prevent context menu (long press callout) on non-editable elements in mobile/webview
  document.addEventListener('contextmenu', (e) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('input, textarea, [contenteditable="true"]')) {
      return;
    }
    e.preventDefault();
  });
  try {
    const androidBridge = (window as unknown as {
      AndroidInsets?: {
        getTopInsetDp: () => number;
        getBottomInsetDp: () => number;
      };
    })?.AndroidInsets;

    if (androidBridge) {
      const top = androidBridge.getTopInsetDp();
      const bottom = androidBridge.getBottomInsetDp();
      if (top > 0) {
        document.documentElement.style.setProperty('--safe-area-inset-top', `${top}px`);
      }
      document.documentElement.style.setProperty('--safe-area-inset-bottom', `${bottom}px`);
    } else {
      const isNativeAndroid =
        (window as unknown as { Capacitor?: { getPlatform?: () => string } })?.Capacitor?.getPlatform?.() === 'android';

      if (isNativeAndroid) {
        const currentTop = document.documentElement.style.getPropertyValue('--safe-area-inset-top');
        if (!currentTop || currentTop === '0px' || currentTop.trim() === '') {
          // Default standard Android status bar height in dp (24px) until exact WindowInsets are reported by MainActivity
          document.documentElement.style.setProperty('--safe-area-inset-top', '24px');
        }
        const currentBottom = document.documentElement.style.getPropertyValue('--safe-area-inset-bottom');
        if (!currentBottom || currentBottom.trim() === '') {
          document.documentElement.style.setProperty('--safe-area-inset-bottom', '0px');
        }
      }
    }
  } catch {
    // Non-blocking fallback
  }
}

createRoot(document.getElementById('root')!).render(<App />);

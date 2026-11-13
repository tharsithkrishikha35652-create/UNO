import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

/**
 * AmbientWallpaper handles runtime performance, GPU lifecycle, and state management
 * for CALCREDIT's V6 Live Ambient Wallpaper:
 * - Unifies browser tab visibility and Capacitor application lifecycle events.
 * - Maintains a single shared state: `isAppActive`.
 * - Pauses wallpaper keyframe animations whenever `document.hidden || !isAppActive`.
 * - Seamlessly resumes animations when the application returns to foreground.
 * - Prevents race conditions and cleans up native listeners cleanly.
 */
export const AmbientWallpaper: React.FC = () => {
  useEffect(() => {
    const bgEl = document.getElementById("calcredit-ambient-bg");
    if (!bgEl) return;

    let isAppActive = true;
    let isMounted = true;
    let listenerHandle: { remove: () => Promise<void> | void } | null = null;

    const updateWallpaperPlayback = () => {
      const shouldPause = document.hidden || !isAppActive;
      if (shouldPause) {
        bgEl.classList.add("paused");
      } else {
        bgEl.classList.remove("paused");
      }
    };

    const handleVisibilityChange = () => {
      updateWallpaperPlayback();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });
    window.addEventListener("pagehide", handleVisibilityChange, { passive: true });
    window.addEventListener("pageshow", handleVisibilityChange, { passive: true });

    // Initial sync based on current state
    updateWallpaperPlayback();

    try {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (!isMounted) return;
        isAppActive = isActive;
        updateWallpaperPlayback();
      })
        .then((handle) => {
          if (!isMounted) {
            handle.remove();
          } else {
            listenerHandle = handle;
          }
        })
        .catch(() => {
          // Non-Capacitor web environment
        });
    } catch {
      // Non-Capacitor web environment
    }

    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handleVisibilityChange);
      window.removeEventListener("pageshow", handleVisibilityChange);
      if (listenerHandle) {
        listenerHandle.remove();
        listenerHandle = null;
      }
    };
  }, []);

  return null;
};

export default AmbientWallpaper;

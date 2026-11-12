import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

/**
 * AmbientWallpaper handles runtime performance and state management
 * for CALCREDIT's V6 Live Ambient Wallpaper:
 * - Detects tab visibility and mobile background/foreground switches
 * - Pauses keyframe animations when backgrounded to preserve mobile battery & GPU
 * - Automatically resumes smooth animation when foregrounded
 */
export const AmbientWallpaper: React.FC = () => {
  useEffect(() => {
    const bgEl = document.getElementById("calcredit-ambient-bg");
    if (!bgEl) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        bgEl.classList.add("paused");
      } else {
        bgEl.classList.remove("paused");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });

    let capacitorListenerRemove: (() => void) | undefined;
    try {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (!isActive) {
          bgEl.classList.add("paused");
        } else {
          bgEl.classList.remove("paused");
        }
      })
        .then((handle) => {
          capacitorListenerRemove = () => handle.remove();
        })
        .catch(() => {
          // Non-Capacitor environment or listener unsupported
        });
    } catch {
      // Non-Capacitor environment
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (capacitorListenerRemove) {
        capacitorListenerRemove();
      }
    };
  }, []);

  return null;
};

export default AmbientWallpaper;

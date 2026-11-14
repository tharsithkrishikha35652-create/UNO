import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

const WALLPAPER_FADE_MS = 560;
const LIGHT_POSTER = "/warm-scholar-bg.png";
const DARK_POSTER = "/dark-scholar-bg.png";

export const AmbientWallpaper: React.FC = React.memo(() => {
  useEffect(() => {
    const background = document.getElementById("calcredit-ambient-bg");
    const firstVideo = background?.querySelector<HTMLVideoElement>(".wallpaper-video");
    if (!background || !firstVideo) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let appActive = true;
    let disposed = false;
    let removeAppListener: (() => void) | undefined;
    let transitionTimer: number | undefined;

    const configureVideo = (video: HTMLVideoElement, poster: string, src: string) => {
      video.className = "wallpaper-video";
      video.setAttribute("aria-hidden", "true");
      video.tabIndex = -1;
      video.controls = false;
      video.removeAttribute("controls");
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.disablePictureInPicture = true;
      video.disableRemotePlayback = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
      video.preload = "auto";
      video.poster = poster;
      if (src && video.getAttribute("src") !== src) {
        video.setAttribute("src", src);
      }
    };

    const lightSrc = firstVideo.dataset.lightSrc ?? "";
    const darkSrc = firstVideo.dataset.darkSrc ?? "";

    // firstVideo is permanently dedicated to light theme
    configureVideo(firstVideo, LIGHT_POSTER, lightSrc);

    // standbyVideo is permanently dedicated to dark theme
    const standbyVideo = document.createElement("video");
    configureVideo(standbyVideo, DARK_POSTER, darkSrc);
    background.append(standbyVideo);

    const isCurrentDark = () =>
      document.documentElement.dataset.theme === "dark" ||
      document.documentElement.classList.contains("dark");

    let lastDark = isCurrentDark();
    let lastLaunchPending = document.documentElement.classList.contains("launch-pending");

    const shouldPlay = () =>
      !disposed &&
      appActive &&
      !document.hidden &&
      !reducedMotion.matches &&
      !document.documentElement.classList.contains("launch-pending");

    const clearTransitionTimer = () => {
      if (transitionTimer !== undefined) {
        window.clearTimeout(transitionTimer);
        transitionTimer = undefined;
      }
    };

    const syncPlayback = () => {
      if (!shouldPlay()) {
        clearTransitionTimer();
        firstVideo.pause();
        standbyVideo.pause();
        return;
      }

      const isDark = isCurrentDark();
      const targetVideo = isDark ? standbyVideo : firstVideo;
      const outgoingVideo = isDark ? firstVideo : standbyVideo;

      clearTransitionTimer();

      // 1. Immediately initiate smooth GPU opacity crossfade
      targetVideo.classList.add("is-visible");
      outgoingVideo.classList.remove("is-visible");

      // 2. Ensure target video is playing smoothly
      if (targetVideo.paused) {
        const playback = targetVideo.play();
        if (playback) {
          playback
            .then(() => {
              background.dataset.playback = "playing";
            })
            .catch(() => {
              background.dataset.playback = "waiting";
              const unlock = () => {
                window.removeEventListener("pointerdown", unlock);
                window.removeEventListener("touchstart", unlock);
                syncPlayback();
              };
              window.addEventListener("pointerdown", unlock, { once: true, passive: true });
              window.addEventListener("touchstart", unlock, { once: true, passive: true });
            });
        }
      } else {
        background.dataset.playback = "playing";
      }

      // 3. Pause outgoing video only AFTER crossfade completes to conserve decoder & GPU memory bandwidth
      transitionTimer = window.setTimeout(() => {
        if (targetVideo.classList.contains("is-visible")) {
          outgoingVideo.pause();
        }
        transitionTimer = undefined;
      }, WALLPAPER_FADE_MS + 40);
    };

    const onVisibilityChange = () => syncPlayback();
    const onReducedMotionChange = () => syncPlayback();
    const launchObserver = new MutationObserver(() => {
      const currentDark = isCurrentDark();
      const currentLaunchPending = document.documentElement.classList.contains("launch-pending");
      if (currentDark !== lastDark || currentLaunchPending !== lastLaunchPending) {
        lastDark = currentDark;
        lastLaunchPending = currentLaunchPending;
        syncPlayback();
      }
    });

    launchObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", syncPlayback);
    window.addEventListener("pagehide", onVisibilityChange);
    reducedMotion.addEventListener("change", onReducedMotionChange);

    void CapacitorApp.addListener("appStateChange", ({ isActive }) => {
      appActive = isActive;
      syncPlayback();
    })
      .then((handle) => {
        if (disposed) {
          void handle.remove();
        } else {
          removeAppListener = () => void handle.remove();
        }
      })
      .catch(() => {
        // The listener is unavailable in a regular browser; page visibility still applies.
      });

    syncPlayback();

    return () => {
      disposed = true;
      clearTransitionTimer();
      firstVideo.pause();
      standbyVideo.pause();
      launchObserver.disconnect();
      standbyVideo.remove();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", syncPlayback);
      window.removeEventListener("pagehide", onVisibilityChange);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
      removeAppListener?.();
    };
  }, []);

  return null;
});

AmbientWallpaper.displayName = "AmbientWallpaper";

export default AmbientWallpaper;

import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";

const WALLPAPER_FADE_MS = 560;
const LIGHT_POSTER = "/warm-scholar-bg.png";
const DARK_POSTER = "/dark-scholar-bg.png";

export const AmbientWallpaper: React.FC = () => {
  useEffect(() => {
    const background = document.getElementById("calcredit-ambient-bg");
    const firstVideo = background?.querySelector<HTMLVideoElement>(".wallpaper-video");
    if (!background || !firstVideo) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let appActive = true;
    let disposed = false;
    let removeAppListener: (() => void) | undefined;
    let activeVideo = firstVideo;
    let standbyVideo = document.createElement("video");
    let activeSource = "";
    let pendingVideo: HTMLVideoElement | null = null;
    let pendingSource = "";
    let requestId = 0;
    let transitionTimer: number | undefined;

    const configureVideo = (video: HTMLVideoElement) => {
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
      video.poster = LIGHT_POSTER;
    };

    configureVideo(firstVideo);
    configureVideo(standbyVideo);
    background.append(standbyVideo);

    const getThemeSource = () => {
      const isDark =
        document.documentElement.dataset.theme === "dark" ||
        document.documentElement.classList.contains("dark");
      return isDark
        ? firstVideo.dataset.darkSrc ?? ""
        : firstVideo.dataset.lightSrc ?? "";
    };

    const posterForSource = (source: string) =>
      source === firstVideo.dataset.darkSrc ? DARK_POSTER : LIGHT_POSTER;

    const prewarmAlternateTheme = () => {
      const alternateSource =
        activeSource === firstVideo.dataset.darkSrc
          ? firstVideo.dataset.lightSrc ?? ""
          : firstVideo.dataset.darkSrc ?? "";
      if (!alternateSource || standbyVideo.getAttribute("src") === alternateSource) return;

      standbyVideo.pause();
      standbyVideo.classList.remove("is-visible");
      standbyVideo.preload = "metadata";
      standbyVideo.poster = posterForSource(alternateSource);
      standbyVideo.setAttribute("src", alternateSource);
      standbyVideo.load();
    };

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

    const revealVideo = (video: HTMLVideoElement, source: string) => {
      if (!shouldPlay() || getThemeSource() !== source) return;

      clearTransitionTimer();
      const previousVideo = activeVideo;
      const hasPreviousVideo = previousVideo !== video && Boolean(previousVideo.getAttribute("src"));
      activeVideo = video;
      activeSource = source;
      standbyVideo = previousVideo === video ? standbyVideo : previousVideo;
      pendingVideo = null;
      pendingSource = "";
      video.classList.add("is-visible");

      if (hasPreviousVideo) {
        requestAnimationFrame(() => previousVideo.classList.remove("is-visible"));
        transitionTimer = window.setTimeout(() => {
          if (standbyVideo !== previousVideo || activeVideo === previousVideo) return;
          previousVideo.pause();
          previousVideo.classList.remove("is-visible");
          transitionTimer = undefined;
          prewarmAlternateTheme();
        }, WALLPAPER_FADE_MS + 80);
      } else {
        if (previousVideo !== video) {
          previousVideo.pause();
          previousVideo.classList.remove("is-visible");
        }
        prewarmAlternateTheme();
      }
    };

    const playVideo = (video: HTMLVideoElement, source: string, id: number) => {
      if (pendingVideo === video && pendingSource === source) return;

      const sourceAlreadySet = video.getAttribute("src") === source;
      const isActiveVideo = video === activeVideo && activeSource === source;
      video.preload = "auto";
      if (!sourceAlreadySet && !isActiveVideo) {
        video.pause();
        video.classList.remove("is-visible");
        video.poster = posterForSource(source);
        video.setAttribute("src", source);
        video.load();
      }
      pendingSource = source;
      pendingVideo = video;

      let listenerRemoved = false;
      let committed = false;
      const removePlayingListener = () => {
        if (listenerRemoved) return;
        listenerRemoved = true;
        video.removeEventListener("playing", onPlaying);
      };
      const onPlaying = () => {
        if (committed) return;
        if (id !== requestId) {
          removePlayingListener();
          return;
        }
        if (source !== getThemeSource() || !shouldPlay()) {
          removePlayingListener();
          video.pause();
          pendingVideo = null;
          pendingSource = "";
          return;
        }
        committed = true;
        removePlayingListener();
        revealVideo(video, source);
        background.dataset.playback = "playing";
      };
      video.addEventListener("playing", onPlaying);

      const playback = video.play();
      if (playback) {
        void playback.then(onPlaying).catch(() => {
          if (id !== requestId) return;
          background.dataset.playback = "waiting";
          removePlayingListener();
          pendingVideo = null;
          pendingSource = "";
          const unlock = () => {
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("touchstart", unlock);
            syncPlayback();
          };
          window.addEventListener("pointerdown", unlock, { once: true, passive: true });
          window.addEventListener("touchstart", unlock, { once: true, passive: true });
        });
      }
    };

    const syncPlayback = () => {
      if (!shouldPlay()) {
        requestId += 1;
        pendingVideo = null;
        pendingSource = "";
        firstVideo.pause();
        standbyVideo.pause();
        return;
      }

      const source = getThemeSource();
      if (!source) {
        firstVideo.pause();
        standbyVideo.pause();
        return;
      }

      if (source === activeSource && activeVideo.getAttribute("src") === source) {
        if (activeVideo.paused) {
          requestId += 1;
          playVideo(activeVideo, source, requestId);
        }
        return;
      }

      if (pendingVideo === standbyVideo && pendingSource === source) return;
      requestId += 1;
      clearTransitionTimer();
      playVideo(standbyVideo, source, requestId);
    };

    const onVisibilityChange = () => syncPlayback();
    const onReducedMotionChange = () => syncPlayback();
    const launchObserver = new MutationObserver(syncPlayback);

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
      requestId += 1;
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
};

export default AmbientWallpaper;

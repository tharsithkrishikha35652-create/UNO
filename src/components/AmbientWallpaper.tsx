import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { AMBIENT_EVENT, type AmbientPing } from "../ambient/ambientBus";

/**
 * CALCREDIT Live Wallpaper: Single Conductor with Android-Optimized Performance
 *
 * Architecture & Lifecycle:
 * - Single source of truth for playback: active ONLY when document is visible,
 *   Capacitor app is active, launch animation has completed, component is mounted,
 *   and prefers-reduced-motion is false.
 * - MutationObserver watches document.documentElement for the removal of "launch-pending".
 *   Zero RAF loops execute during the startup launch animation.
 * - Strictly guarded against duplicate RAF loops; guaranteed single execution thread.
 * - Controlled 30 FPS target on mobile devices to preserve CPU, GPU memory, and battery,
 *   while maintaining delta-based animation timing.
 * - Inactive theme SVG is completely un-animated during normal operation.
 * - Cached element references, pre-calculated geometry, and guarded inline style writes
 *   to avoid layout thrashing and redundant DOM mutations.
 * - Full asynchronous cleanup of Capacitor native listeners, observers, and frame callbacks.
 */

const VBW = 682;
const VBH = 1024;
const TAU = Math.PI * 2;
const PERIOD = 13; // seconds for master wave cycle
const DEPTH = { far: 0.45, mid: 1, near: 1.7 } as const;
const SPARKS: Array<[number, number]> = [
  [0.72, 0.16],
  [0.09, 0.56],
  [0.92, 0.68],
  [0.85, 0.38],
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const phaseAt = (x: number, y: number) => (x / VBW) * 0.35 + (y / VBH) * 0.65;

interface Item {
  el: SVGGraphicsElement;
  cx: number;
  cy: number;
  lastTransform?: string;
  lastOpacity?: string;
}

interface Rig {
  all: SVGGraphicsElement[];
  blob?: Item;
  haze?: Item;
  orbA?: Item;
  orbB?: Item;
  cap?: Item;
  books?: Item;
  shadow?: Item;
  gridLines?: Item;
  drift?: Item;
  tassel?: SVGGraphicsElement;
  rings: Item[];
  left: Item[];
  right: Item[];
  stars: Item[];
  grids: Array<{ group: Item; cy: number; cols: Item[] }>;
}

interface Pulse {
  x: number;
  y: number;
  t0: number;
  s: number;
}

/** Check if the current environment is a mobile screen / Android device */
export const isMobileEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 0)
  );
};

function buildRig(svg: SVGSVGElement): Rig {
  const all: SVGGraphicsElement[] = [];

  const item = (el: Element | null, defaultCx = VBW / 2, defaultCy = VBH / 2, setOrigin = true): Item | undefined => {
    if (!el) return undefined;
    const node = el as SVGGraphicsElement;
    let cx = defaultCx;
    let cy = defaultCy;

    try {
      const b = node.getBBox();
      if (b.width > 0 && b.height > 0) {
        cx = b.x + b.width / 2;
        cy = b.y + b.height / 2;
      }
    } catch {
      // Fallback to default coordinates if not laid out
    }

    if (setOrigin) {
      node.style.transformBox = "view-box";
      node.style.transformOrigin = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    }
    all.push(node);
    return { el: node, cx, cy };
  };

  const many = (sel: string, setOrigin = true): Item[] => {
    return Array.from(svg.querySelectorAll(sel))
      .map((e) => item(e, VBW / 2, VBH / 2, setOrigin))
      .filter((v): v is Item => !!v);
  };

  const tassel = svg.querySelector<SVGGraphicsElement>(".cap-tassel") ?? undefined;
  if (tassel) all.push(tassel);

  return {
    all,
    tassel,
    blob: item(svg.querySelector(".top-left-art"), 90, 80),
    haze: item(svg.querySelector(".haze"), 90, 285),
    orbA: item(svg.querySelector(".orb-a"), 280, 130),
    orbB: item(svg.querySelector(".orb-b"), 245, 759),
    cap: item(svg.querySelector(".cap-rig"), 555, 150),
    books: item(svg.querySelector(".book-stack"), 65, 375),
    shadow: item(svg.querySelector(".shadow-lines"), 95, 463),
    gridLines: item(svg.querySelector(".grid-lines"), 580, 475),
    drift: item(svg.querySelector(".drift-lines"), 450, 764),
    rings: many(".ring"),
    left: many(".left-art-piece"),
    right: many(".right-art-piece"),
    stars: many(".svg-star", false),
    grids: Array.from(svg.querySelectorAll(".dotgrid")).map((g) => {
      const group = item(g, VBW / 2, VBH / 2)!;
      const colClass = (g as SVGElement).classList[1] || "";
      const colSel = colClass ? `.${colClass} .dotcol` : ".dotcol";
      return {
        group,
        cy: group.cy,
        cols: Array.from(svg.querySelectorAll(colSel))
          .map((c) => item(c, VBW / 2, group.cy, false))
          .filter((v): v is Item => !!v),
      };
    }),
  };
}

export const AmbientWallpaper: React.FC = () => {
  useEffect(() => {
    const bgEl = document.getElementById("calcredit-ambient-bg");
    if (!bgEl) return;
    const lightSvg = bgEl.querySelector<SVGSVGElement>("svg.light-svg");
    const darkSvg = bgEl.querySelector<SVGSVGElement>("svg.dark-svg");
    if (!lightSvg || !darkSvg) return;

    const breathLayerEl = bgEl.querySelector<HTMLElement>(".breath-layer");
    const sparkEls = Array.from(bgEl.querySelectorAll<HTMLElement>(".spark"));
    const rigs = { light: buildRig(lightSvg), dark: buildRig(darkSvg) };

    const isDark = () =>
      document.documentElement.dataset.theme === "dark" ||
      document.documentElement.classList.contains("dark");

    // ---- Centralized Lifecycle Controller State ----
    let isMounted = true;
    let isDocumentVisible = !document.hidden;
    let isAppActive = true;
    let isLaunchPending = document.documentElement.classList.contains("launch-pending");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedQuery.matches;

    // Single source of truth evaluation
    const shouldAnimate = (): boolean => {
      return (
        isMounted &&
        isDocumentVisible &&
        isAppActive &&
        !isLaunchPending &&
        !isReducedMotion
      );
    };

    // ---- Mobile frame rate cap (30 FPS on mobile, 60 FPS on desktop) ----
    let isMobile = isMobileEnvironment();
    const getMinFrameInterval = () => (isMobile ? 1000 / 30 - 1.5 : 1000 / 60 - 1.5);

    // ---- Animation State ----
    const S = {
      t: 3,
      clock: 0,
      speed: 1,
      energy: 0,
      calm: 0,
      calmTarget: 0,
      px: 0,
      py: 0,
      ptx: 0,
      pty: 0,
      tabX: 0,
      tabTarget: 0,
      theta: 0,
      omega: 0,
      capX: 0,
      capY: 0,
      lastResult: -9,
      pulses: [] as Pulse[],
    };

    let dark = isDark();
    let prevRig: Rig | null = null;
    let fadeUntil = 0;
    const lastScroll = new WeakMap<object, number>();

    const addPulse = (x: number, y: number, s: number) => {
      S.pulses.push({ x, y, t0: S.clock, s });
      if (S.pulses.length > 5) S.pulses.shift();
    };

    const toViewBox = (cx: number, cy: number): [number, number] => {
      const w = window.innerWidth,
        h = window.innerHeight;
      const k = Math.max(w / VBW, h / VBH);
      return [(cx - (w - VBW * k) / 2) / k, (cy - (h - VBH * k) / 2) / k];
    };

    // Guarded style writing to prevent layout recalculations when values haven't changed
    const put = (
      it: Item | undefined,
      dx: number,
      dy: number,
      rot = 0,
      sx = 1,
      sy = sx
    ) => {
      if (!it) return;
      const str = `translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      if (it.lastTransform !== str) {
        it.lastTransform = str;
        it.el.style.transform = str;
      }
    };

    const setOpacity = (it: Item | undefined, op: number) => {
      if (!it) return;
      const str = clamp(op, 0, 1).toFixed(3);
      if (it.lastOpacity !== str) {
        it.lastOpacity = str;
        it.el.style.opacity = str;
      }
    };

    // Clear styles on rig elements when transitioning or pausing
    const clearRig = (rig: Rig) => {
      rig.all.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
      });
      if (rig.tassel) rig.tassel.style.transform = "";
    };

    const clearAll = () => {
      clearRig(rigs.light);
      clearRig(rigs.dark);
      bgEl.querySelectorAll<SVGElement>(".dotcol").forEach((e) => {
        e.style.transform = "";
        e.style.opacity = "";
      });
      sparkEls.forEach((e) => {
        e.style.transform = "";
        e.style.opacity = "";
      });
      if (breathLayerEl) {
        breathLayerEl.style.removeProperty("--amb-breath");
      }
    };

    // ---- Render one frame of artwork ----
    const draw = (rig: Rig, dt: number, withHtml: boolean) => {
      const A = (1 + 0.8 * S.energy) * (1 - 0.6 * S.calm);
      const par = 1 - 0.5 * S.calm;
      const calmK = 1 - 0.8 * S.calm;
      const off = (d: number) => ({
        x: (S.px * 14 + S.tabX * 20) * d * par,
        y: S.py * 14 * d * par,
      });
      const oF = off(DEPTH.far),
        oM = off(DEPTH.mid),
        oN = off(DEPTH.near);
      const wv = (x: number, y: number) => Math.sin(TAU * (S.t / PERIOD - phaseAt(x, y)));
      const wv2 = (x: number, y: number) => Math.cos(TAU * (S.t / PERIOD - phaseAt(x, y)));

      const ripple = (x: number, y: number) => {
        let sum = 0;
        for (const p of S.pulses) {
          const age = S.clock - p.t0;
          if (age < 0 || age > 3.4) continue;
          const k = (Math.hypot(x - p.x, y - p.y) - age * 560) / 70;
          sum += p.s * Math.exp(-k * k) * Math.exp(-age / 1.5);
        }
        return Math.min(1.4, sum) * calmK;
      };

      // Far layer
      let blobOff = { dx: 0, dy: 0 };
      if (rig.blob) {
        const { cx, cy } = rig.blob;
        const w = wv(cx, cy),
          w2 = wv2(cx, cy),
          rp = ripple(cx, cy);
        blobOff = { dx: oF.x + 6 * w2 * A, dy: oF.y + 8 * w * A };
        put(rig.blob, blobOff.dx, blobOff.dy, 0, 1 + 0.025 * w * A + 0.03 * rp);
      }
      put(rig.haze, blobOff.dx * 0.6, blobOff.dy * 0.6);
      rig.rings.forEach((r) =>
        put(r, oF.x * 1.15 + 4 * wv2(r.cx, r.cy) * A, oF.y * 1.15 + 5 * wv(r.cx, r.cy) * A)
      );

      let leftOff = { dx: 0, dy: 0 };
      rig.left.forEach((p, i) => {
        const w = wv(p.cx, p.cy),
          w2 = wv2(p.cx, p.cy),
          rp = ripple(p.cx, p.cy);
        const o = { dx: oF.x + 10 * w2 * A, dy: oF.y - 16 * w * A - 10 * rp };
        if (i === 0) leftOff = o;
        put(p, o.dx, o.dy, 1.8 * w2 * A, 1 + 0.02 * w * A);
      });

      rig.right.forEach((p) => {
        const w = wv(p.cx, p.cy),
          w2 = wv2(p.cx, p.cy),
          rp = ripple(p.cx, p.cy);
        put(p, oF.x + 10 * w2 * A, oF.y - 16 * w * A - 10 * rp, -1.8 * w2 * A, 1 + 0.02 * w * A);
      });

      if (rig.gridLines) {
        const { cx, cy } = rig.gridLines;
        put(rig.gridLines, oF.x, oF.y);
        setOpacity(rig.gridLines, 0.62 + 0.55 * (0.5 + 0.5 * wv(cx, cy)) + 0.4 * ripple(cx, cy));
      }

      // Mid layer
      if (rig.orbA) {
        put(
          rig.orbA,
          blobOff.dx * 1.5 + oM.x * 0.4,
          blobOff.dy * 1.5 + 4 * wv(rig.orbA.cx, rig.orbA.cy) * A + oM.y * 0.4
        );
      }
      if (rig.orbB) {
        put(rig.orbB, leftOff.dx * 1.4, leftOff.dy * 1.4 + 3 * wv2(rig.orbB.cx, rig.orbB.cy) * A);
      }

      if (rig.cap) {
        const { cx, cy } = rig.cap;
        const w = wv(cx, cy),
          w2 = wv2(cx, cy),
          rp = ripple(cx, cy);
        const dx = oM.x + 5 * w2 * A,
          dy = oM.y - 10 * w * A - 14 * rp;
        put(rig.cap, dx, dy, -1.6 * w2 * A);

        const vx = (dx - S.capX) / dt,
          vy = (dy - S.capY) / dt;
        S.capX = dx;
        S.capY = dy;
        const target =
          clamp(-vx * 7 - vy * 1.5, -30, 30) +
          3 * Math.sin((TAU * S.t) / (PERIOD / 3));
        S.omega += (46 * (target - S.theta) - 6 * S.omega) * dt;
        S.theta = clamp(S.theta + S.omega * dt, -40, 40);
        if (rig.tassel) rig.tassel.style.transform = `rotate(${S.theta.toFixed(3)}deg)`;
      }

      if (rig.books) {
        const { cx, cy } = rig.books;
        const w = wv(cx, cy),
          w2 = wv2(cx, cy);
        const lift = 12 * w * A;
        put(rig.books, oM.x, oM.y - lift - 8 * ripple(cx, cy), -1.2 * w2 * A);
        const liftN = clamp((lift + 12) / 24, 0, 1);
        if (rig.shadow) {
          put(rig.shadow, oM.x * 0.6, oM.y * 0.6 + 3 * liftN, 0, 1 - 0.16 * liftN, 1);
          setOpacity(rig.shadow, 1 - 0.5 * liftN);
        }
      }

      if (rig.drift) {
        const { cx, cy } = rig.drift;
        put(rig.drift, oM.x + 7 * wv2(cx, cy) * A, oM.y);
        setOpacity(rig.drift, 0.8 + 0.2 * (0.5 + 0.5 * wv(cx, cy)));
      }

      rig.grids.forEach((g) => {
        put(g.group, oM.x, oM.y);
        g.cols.forEach((c) => {
          const w = wv(c.cx, g.cy),
            rp = ripple(c.cx, g.cy);
          const ty = (2.4 * w * A - 3 * rp).toFixed(2);
          const op = clamp(0.55 + 0.45 * (0.5 + 0.5 * w) + 0.4 * rp, 0, 1).toFixed(3);
          const str = `translate3d(0,${ty}px,0)`;
          if (c.lastTransform !== str) {
            c.lastTransform = str;
            c.el.style.transform = str;
          }
          if (c.lastOpacity !== op) {
            c.lastOpacity = op;
            c.el.style.opacity = op;
          }
        });
      });

      // Near layer
      rig.stars.forEach((s) => {
        const tw = 0.5 + 0.5 * Math.sin(TAU * ((3 * S.t) / PERIOD - 3 * phaseAt(s.cx, s.cy)));
        const rp = ripple(s.cx, s.cy);
        const scaleVal = ((0.75 + 0.6 * tw) * (1 + 0.9 * rp)).toFixed(4);
        const str = `translate3d(${oN.x.toFixed(2)}px,${oN.y.toFixed(2)}px,0) scale(${scaleVal})`;
        const op = clamp(0.25 + 0.75 * tw + 0.6 * rp, 0, 1).toFixed(3);
        if (s.lastTransform !== str) {
          s.lastTransform = str;
          s.el.style.transform = str;
        }
        if (s.lastOpacity !== op) {
          s.lastOpacity = op;
          s.el.style.opacity = op;
        }
      });

      // Ambient atmosphere & HTML sparks (only mutated on breathLayerEl directly to prevent container recalcs)
      if (withHtml) {
        if (breathLayerEl) {
          const breathVal = (0.5 + 0.5 * Math.sin(TAU * (S.t / PERIOD - 0.5))).toFixed(3);
          breathLayerEl.style.setProperty("--amb-breath", breathVal);
        }
        sparkEls.forEach((el, i) => {
          const [fx, fy] = SPARKS[i] ?? [0.5, 0.5];
          const x = fx * VBW,
            y = fy * VBH;
          const tw = 0.5 + 0.5 * Math.sin(TAU * ((3 * S.t) / PERIOD - 3 * phaseAt(x, y)));
          const rp = ripple(x, y);
          el.style.opacity = clamp(0.15 + 0.85 * tw + 0.5 * rp, 0, 1).toFixed(3);
          el.style.transform = `scale(${(0.65 + 0.75 * tw).toFixed(3)}) rotate(${(45 * tw).toFixed(1)}deg)`;
        });
      }
    };

    const step = (dt: number) => {
      S.clock += dt;
      const k = (r: number) => Math.min(1, dt * r);
      S.speed += ((1 + 0.9 * S.energy) * (1 - 0.35 * S.calm) - S.speed) * k(3);
      S.t += dt * S.speed;
      S.energy *= Math.exp(-dt * 1.6);
      S.calm += (S.calmTarget - S.calm) * k(3);
      S.px += (S.ptx - S.px) * k(4);
      S.py += (S.pty - S.py) * k(4);
      S.tabX += (S.tabTarget - S.tabX) * k(5);
      S.pulses = S.pulses.filter((p) => S.clock - p.t0 < 3.4);

      const dk = isDark();
      if (dk !== dark) {
        prevRig = dark ? rigs.dark : rigs.light;
        fadeUntil = S.clock + 1.5;
        dark = dk;
        addPulse(VBW / 2, 0, 0.8);
      }

      // Always draw the active theme rig
      draw(dark ? rigs.dark : rigs.light, dt, true);

      // Only draw the outgoing rig during the 1.5s theme crossfade window
      if (prevRig) {
        if (S.clock < fadeUntil) {
          draw(prevRig, dt, false);
        } else {
          clearRig(prevRig);
          prevRig = null;
        }
      }
    };

    // ---- Loop Controller: Guaranteed Single RAF ----
    let rafId: number | null = null;
    let running = false;
    let lastRenderTime = 0;

    const tick = (now: number) => {
      if (!running || !shouldAnimate()) {
        running = false;
        rafId = null;
        return;
      }

      // Re-queue next frame immediately
      rafId = requestAnimationFrame(tick);

      // Controlled 30 FPS mobile frame rate cap
      if (lastRenderTime > 0) {
        const elapsed = now - lastRenderTime;
        if (elapsed < getMinFrameInterval()) {
          return; // Skip tick to throttle frame rate
        }
        const dt = clamp(elapsed / 1000, 0.001, 0.08);
        lastRenderTime = now;
        step(dt);
      } else {
        lastRenderTime = now;
        step(isMobile ? 1 / 30 : 1 / 60);
      }
    };

    const start = () => {
      if (running || !shouldAnimate()) return;
      running = true;
      lastRenderTime = 0;
      bgEl.dataset.ambient = "running";
      bgEl.classList.remove("paused");
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      rafId = requestAnimationFrame(tick);
    };

    const stop = (label: string) => {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      bgEl.dataset.ambient = label;
      if (label === "paused" || label === "launch-pending") {
        bgEl.classList.add("paused");
      } else {
        bgEl.classList.remove("paused");
      }
    };

    // Central lifecycle state dispatcher
    const updateLifecycle = (source?: string) => {
      if (!isMounted) {
        stop("stopped");
        return;
      }

      if (shouldAnimate()) {
        start();
      } else {
        if (isReducedMotion) {
          stop("static");
          clearAll();
        } else if (isLaunchPending) {
          stop("launch-pending");
        } else {
          stop("paused");
        }
      }
    };

    // ---- Launch Animation Observer (MutationObserver) ----
    const launchObserver = new MutationObserver(() => {
      const pending = document.documentElement.classList.contains("launch-pending");
      if (pending !== isLaunchPending) {
        isLaunchPending = pending;
        updateLifecycle("launchStateChanged");
      }
    });

    launchObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // ---- Document Visibility & Lifecycle Listeners ----
    const onVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
      updateLifecycle("visibilitychange");
    };

    const onPageHide = () => {
      isDocumentVisible = false;
      updateLifecycle("pagehide");
    };

    const onPageShow = () => {
      isDocumentVisible = !document.hidden;
      updateLifecycle("pageshow");
    };

    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      updateLifecycle("reducedMotionChange");
    };

    const onResize = () => {
      isMobile = isMobileEnvironment();
    };

    // ---- Interactive Inputs (Guarded when suspended) ----
    const onPointerMove = (e: PointerEvent) => {
      if (!running || e.pointerType !== "mouse") return;
      S.ptx = clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      S.pty = clamp((e.clientY / window.innerHeight - 0.5) * 2, -1, 1);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!running) return;
      const [x, y] = toViewBox(e.clientX, e.clientY);
      addPulse(x, y, 0.45);
    };

    const onTilt = (e: DeviceOrientationEvent) => {
      if (!running || e.gamma == null || e.beta == null) return;
      S.ptx = clamp(e.gamma / 25, -1, 1);
      S.pty = clamp((e.beta - 50) / 25, -1, 1);
    };

    const onScroll = (e: Event) => {
      if (!running) return;
      const t = e.target as HTMLElement | Document;
      const pos = t instanceof Document ? window.scrollY : (t as HTMLElement).scrollTop ?? 0;
      const prev = lastScroll.get(t) ?? pos;
      lastScroll.set(t, pos);
      S.energy = Math.min(1, S.energy + Math.abs(pos - prev) / 400);
    };

    const editing = () => {
      const a = document.activeElement as HTMLElement | null;
      return !!a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable);
    };

    const onFocus = () => {
      if (!running) return;
      S.calmTarget = editing() ? 1 : 0;
    };

    const onPing = (e: Event) => {
      if (!running) return;
      const ping = (e as CustomEvent<AmbientPing>).detail;
      if (!ping) return;
      if (ping.kind === "tab") {
        S.tabTarget = (ping.index - 1.5) / 1.5;
        addPulse(((ping.index + 0.5) / 4) * VBW, VBH, 0.55);
      } else if (ping.kind === "result" && S.clock - S.lastResult > 0.7) {
        S.lastResult = S.clock;
        addPulse(VBW / 2, VBH * 0.4, 1);
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
    window.addEventListener("deviceorientation", onTilt, { passive: true });
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("focusin", onFocus);
    document.addEventListener("focusout", onFocus);
    window.addEventListener(AMBIENT_EVENT, onPing);
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });
    window.addEventListener("pagehide", onPageHide, { passive: true });
    window.addEventListener("pageshow", onPageShow, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    reducedQuery.addEventListener("change", onReducedMotionChange);

    // ---- Safe Async Capacitor Registration ----
    let capacitorHandle: { remove: () => Promise<void> | void } | null = null;
    let isCancelled = false;

    try {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => {
        if (isCancelled || !isMounted) return;
        isAppActive = isActive;
        updateLifecycle("capacitorAppStateChange");
      })
        .then((handle) => {
          if (isCancelled || !isMounted) {
            handle.remove();
          } else {
            capacitorHandle = handle;
          }
        })
        .catch(() => {
          // Not running inside native Capacitor environment
        });
    } catch {
      // Not running inside native Capacitor environment
    }

    // Expose test hook for verification
    if (typeof window !== "undefined") {
      (window as unknown as { __calcredit_ambient?: Record<string, unknown> }).__calcredit_ambient = {
        get isRunning() {
          return running;
        },
        get rafCount() {
          return rafId !== null ? 1 : 0;
        },
        get isMobile() {
          return isMobile;
        },
        get isLaunchPending() {
          return isLaunchPending;
        },
        get isAppActive() {
          return isAppActive;
        },
        get isDocumentVisible() {
          return isDocumentVisible;
        },
        triggerTick: (dt: number) => {
          step(dt);
        },
      };
    }

    // Initial lifecycle synchronization
    updateLifecycle("initialMount");

    return () => {
      isCancelled = true;
      isMounted = false;
      stop("stopped");
      launchObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onFocus);
      window.removeEventListener(AMBIENT_EVENT, onPing);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      reducedQuery.removeEventListener("change", onReducedMotionChange);

      if (capacitorHandle) {
        capacitorHandle.remove();
        capacitorHandle = null;
      }

      if (typeof window !== "undefined") {
        delete (window as unknown as { __calcredit_ambient?: unknown }).__calcredit_ambient;
      }
    };
  }, []);

  return null;
};

export default AmbientWallpaper;

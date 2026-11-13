import React, { useEffect } from "react";
import { App as CapacitorApp } from "@capacitor/app";
import { AMBIENT_EVENT, type AmbientPing } from "../ambient/ambientBus";

/**
 * CALCREDIT live wallpaper: one conductor, many connected parts.
 *
 * Instead of every shape looping on its own timer, a single master wave travels
 * across the page (top-left to bottom-right) and every part responds to it, so the
 * scene reads as one organism:
 *  - Depth: far shapes move little, near sparkles move most; input shifts layers
 *    by depth (parallax from mouse, device tilt, and the active tab).
 *  - Cause and effect: the tassel swings because the cap moved, the books' shadow
 *    lines shrink when the books rise, the orbs ride on their neighbouring shapes,
 *    dot grids ripple in step with the wave, stars twinkle as the wave reaches them.
 *  - The app is connected: results, taps, tab changes and theme changes send ripples
 *    through the whole artwork; scrolling adds energy; typing calms it down.
 *
 * Pure transforms/opacity, one requestAnimationFrame loop, paused when backgrounded,
 * and fully static under prefers-reduced-motion.
 */

const VBW = 682;
const VBH = 1024;
const TAU = Math.PI * 2;
const PERIOD = 13; // seconds for the master wave to cross the page
const DEPTH = { far: 0.45, mid: 1, near: 1.7 } as const;
const SPARKS: Array<[number, number]> = [[0.72, 0.16], [0.09, 0.56], [0.92, 0.68], [0.85, 0.38]];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const phaseAt = (x: number, y: number) => (x / VBW) * 0.35 + (y / VBH) * 0.65;

interface Item { el: SVGElement; cx: number; cy: number }
interface Rig {
  all: SVGElement[];
  blob?: Item; haze?: Item; orbA?: Item; orbB?: Item; cap?: Item; books?: Item; shadow?: Item;
  gridLines?: Item; drift?: Item; tassel?: SVGElement;
  rings: Item[]; left: Item[]; right: Item[]; stars: Item[];
  grids: Array<{ group: Item; cy: number; cols: Item[] }>;
}
interface Pulse { x: number; y: number; t0: number; s: number }

function buildRig(svg: SVGSVGElement): Rig {
  const all: SVGElement[] = [];
  const item = (el: Element | null, setOrigin = true): Item | undefined => {
    if (!el) return undefined;
    const node = el as SVGGraphicsElement;
    let b = { x: 0, y: 0, width: 0, height: 0 };
    try { b = node.getBBox(); } catch { /* not laid out yet */ }
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    if (setOrigin) {
      node.style.transformBox = "view-box";
      node.style.transformOrigin = `${cx}px ${cy}px`;
    }
    all.push(node);
    return { el: node, cx, cy };
  };
  const many = (sel: string, setOrigin = true) =>
    Array.from(svg.querySelectorAll(sel)).map((e) => item(e, setOrigin)).filter((v): v is Item => !!v);
  const tassel = svg.querySelector<SVGElement>(".cap-tassel") ?? undefined;
  if (tassel) all.push(tassel);
  return {
    all, tassel,
    blob: item(svg.querySelector(".top-left-art")),
    haze: item(svg.querySelector(".haze")),
    orbA: item(svg.querySelector(".orb-a")),
    orbB: item(svg.querySelector(".orb-b")),
    cap: item(svg.querySelector(".cap-rig")),
    books: item(svg.querySelector(".book-stack")),
    shadow: item(svg.querySelector(".shadow-lines")),
    gridLines: item(svg.querySelector(".grid-lines")),
    drift: item(svg.querySelector(".drift-lines")),
    rings: many(".ring"),
    left: many(".left-art-piece"),
    right: many(".right-art-piece"),
    stars: many(".svg-star", false),
    grids: Array.from(svg.querySelectorAll(".dotgrid")).map((g) => {
      const group = item(g)!;
      return { group, cy: group.cy, cols: many(`.${(g as SVGElement).classList[1]} .dotcol`, false) };
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

    const rigs = { light: buildRig(lightSvg), dark: buildRig(darkSvg) };
    const sparkEls = Array.from(bgEl.querySelectorAll<HTMLElement>(".spark"));
    const isDark = () =>
      document.documentElement.dataset.theme === "dark" || document.documentElement.classList.contains("dark");

    // ---- shared state ----
    const S = {
      t: 3, clock: 0, speed: 1, energy: 0, calm: 0, calmTarget: 0,
      px: 0, py: 0, ptx: 0, pty: 0, tabX: 0, tabTarget: 0,
      theta: 0, omega: 0, capX: 0, capY: 0, lastResult: -9,
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
      const w = window.innerWidth, h = window.innerHeight;
      const k = Math.max(w / VBW, h / VBH);
      return [(cx - (w - VBW * k) / 2) / k, (cy - (h - VBH * k) / 2) / k];
    };

    // ---- one frame of the whole scene ----
    const draw = (rig: Rig, dt: number, withHtml: boolean) => {
      const A = (1 + 0.8 * S.energy) * (1 - 0.6 * S.calm);
      const par = 1 - 0.5 * S.calm;
      const calmK = 1 - 0.8 * S.calm;
      const off = (d: number) => ({ x: (S.px * 14 + S.tabX * 20) * d * par, y: S.py * 14 * d * par });
      const oF = off(DEPTH.far), oM = off(DEPTH.mid), oN = off(DEPTH.near);
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
      const put = (it: Item | undefined, dx: number, dy: number, rot = 0, sx = 1, sy = sx) => {
        if (it) it.el.style.transform = `translate3d(${dx.toFixed(2)}px,${dy.toFixed(2)}px,0) rotate(${rot.toFixed(3)}deg) scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
      };

      // far: big soft shapes, slow and wide
      let blobOff = { dx: 0, dy: 0 };
      if (rig.blob) {
        const { cx, cy } = rig.blob; const w = wv(cx, cy), w2 = wv2(cx, cy), rp = ripple(cx, cy);
        blobOff = { dx: oF.x + 6 * w2 * A, dy: oF.y + 8 * w * A };
        put(rig.blob, blobOff.dx, blobOff.dy, 0, 1 + 0.025 * w * A + 0.03 * rp);
      }
      put(rig.haze, blobOff.dx * 0.6, blobOff.dy * 0.6);
      rig.rings.forEach((r) => put(r, oF.x * 1.15 + 4 * wv2(r.cx, r.cy) * A, oF.y * 1.15 + 5 * wv(r.cx, r.cy) * A));
      let leftOff = { dx: 0, dy: 0 };
      rig.left.forEach((p, i) => {
        const w = wv(p.cx, p.cy), w2 = wv2(p.cx, p.cy), rp = ripple(p.cx, p.cy);
        const o = { dx: oF.x + 10 * w2 * A, dy: oF.y - 16 * w * A - 10 * rp };
        if (i === 0) leftOff = o;
        put(p, o.dx, o.dy, 1.8 * w2 * A, 1 + 0.02 * w * A);
      });
      rig.right.forEach((p) => {
        const w = wv(p.cx, p.cy), w2 = wv2(p.cx, p.cy), rp = ripple(p.cx, p.cy);
        put(p, oF.x + 10 * w2 * A, oF.y - 16 * w * A - 10 * rp, -1.8 * w2 * A, 1 + 0.02 * w * A);
      });
      if (rig.gridLines) {
        const { cx, cy } = rig.gridLines;
        put(rig.gridLines, oF.x, oF.y);
        rig.gridLines.el.style.opacity = clamp(0.62 + 0.55 * (0.5 + 0.5 * wv(cx, cy)) + 0.4 * ripple(cx, cy), 0, 1).toFixed(3);
      }

      // mid: objects ride on their neighbours
      if (rig.orbA) put(rig.orbA, blobOff.dx * 1.5 + oM.x * 0.4, blobOff.dy * 1.5 + 4 * wv(rig.orbA.cx, rig.orbA.cy) * A + oM.y * 0.4);
      if (rig.orbB) put(rig.orbB, leftOff.dx * 1.4, leftOff.dy * 1.4 + 3 * wv2(rig.orbB.cx, rig.orbB.cy) * A);
      if (rig.cap) {
        const { cx, cy } = rig.cap; const w = wv(cx, cy), w2 = wv2(cx, cy), rp = ripple(cx, cy);
        const dx = oM.x + 5 * w2 * A, dy = oM.y - 10 * w * A - 14 * rp;
        put(rig.cap, dx, dy, -1.6 * w2 * A);
        // the tassel is a spring driven by how the cap just moved
        const vx = (dx - S.capX) / dt, vy = (dy - S.capY) / dt;
        S.capX = dx; S.capY = dy;
        const target = clamp(-vx * 7 - vy * 1.5, -30, 30) + 3 * Math.sin((TAU * S.t) / (PERIOD / 3));
        S.omega += (46 * (target - S.theta) - 6 * S.omega) * dt;
        S.theta = clamp(S.theta + S.omega * dt, -40, 40);
        if (rig.tassel) rig.tassel.style.transform = `rotate(${S.theta.toFixed(3)}deg)`;
      }
      if (rig.books) {
        const { cx, cy } = rig.books; const w = wv(cx, cy), w2 = wv2(cx, cy);
        const lift = 12 * w * A;
        put(rig.books, oM.x, oM.y - lift - 8 * ripple(cx, cy), -1.2 * w2 * A);
        const liftN = clamp((lift + 12) / 24, 0, 1);
        if (rig.shadow) { // their shadow lines shrink and fade as the books rise
          put(rig.shadow, oM.x * 0.6, oM.y * 0.6 + 3 * liftN, 0, 1 - 0.16 * liftN, 1);
          rig.shadow.el.style.opacity = (1 - 0.5 * liftN).toFixed(3);
        }
      }
      if (rig.drift) {
        const { cx, cy } = rig.drift;
        put(rig.drift, oM.x + 7 * wv2(cx, cy) * A, oM.y);
        rig.drift.el.style.opacity = (0.8 + 0.2 * (0.5 + 0.5 * wv(cx, cy))).toFixed(3);
      }
      rig.grids.forEach((g) => {
        put(g.group, oM.x, oM.y);
        g.cols.forEach((c) => { // the wave visibly passes through each dot grid
          const w = wv(c.cx, g.cy), rp = ripple(c.cx, g.cy);
          c.el.style.transform = `translate3d(0,${(2.4 * w * A - 3 * rp).toFixed(2)}px,0)`;
          c.el.style.opacity = clamp(0.55 + 0.45 * (0.5 + 0.5 * w) + 0.4 * rp, 0, 1).toFixed(3);
        });
      });

      // near: stars twinkle as the wave front reaches them
      rig.stars.forEach((s) => {
        const tw = 0.5 + 0.5 * Math.sin(TAU * ((3 * S.t) / PERIOD - 3 * phaseAt(s.cx, s.cy)));
        const rp = ripple(s.cx, s.cy);
        s.el.style.opacity = clamp(0.25 + 0.75 * tw + 0.6 * rp, 0, 1).toFixed(3);
        s.el.style.transform = `translate3d(${oN.x.toFixed(2)}px,${oN.y.toFixed(2)}px,0) scale(${((0.75 + 0.6 * tw) * (1 + 0.9 * rp)).toFixed(4)})`;
      });

      if (withHtml) {
        bgEl.style.setProperty("--amb-breath", (0.5 + 0.5 * Math.sin(TAU * (S.t / PERIOD - 0.5))).toFixed(3));
        sparkEls.forEach((el, i) => {
          const [fx, fy] = SPARKS[i] ?? [0.5, 0.5];
          const x = fx * VBW, y = fy * VBH;
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
      if (dk !== dark) { // theme switched: ripple from the top, keep the outgoing art alive during the crossfade
        prevRig = dark ? rigs.dark : rigs.light;
        fadeUntil = S.clock + 1.5;
        dark = dk;
        addPulse(VBW / 2, 0, 0.8);
      }
      draw(dark ? rigs.dark : rigs.light, dt, true);
      if (prevRig) {
        if (S.clock < fadeUntil) draw(prevRig, dt, false);
        else prevRig = null;
      }
    };

    // ---- run loop, paused when hidden/backgrounded, static for reduced motion ----
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0, last = 0, running = false, suspended = false;
    const tick = (now: number) => {
      if (!running) return;
      const dt = clamp(last ? (now - last) / 1000 : 0.016, 0.001, 0.05);
      last = now;
      step(dt);
      raf = requestAnimationFrame(tick);
    };
    const clearAll = () => {
      [rigs.light, rigs.dark].forEach((r) => r.all.forEach((e) => { e.style.transform = ""; e.style.opacity = ""; }));
      r_clearCols();
      sparkEls.forEach((e) => { e.style.transform = ""; e.style.opacity = ""; });
    };
    const r_clearCols = () =>
      bgEl.querySelectorAll<SVGElement>(".dotcol").forEach((e) => { e.style.transform = ""; e.style.opacity = ""; });
    const start = () => {
      if (running || suspended || reduced.matches) return;
      running = true; last = 0;
      bgEl.dataset.ambient = "running";
      raf = requestAnimationFrame(tick);
    };
    const stop = (label: string) => {
      running = false;
      cancelAnimationFrame(raf);
      bgEl.dataset.ambient = label;
    };
    const suspend = () => { suspended = true; bgEl.classList.add("paused"); stop("paused"); };
    const resume = () => { suspended = false; bgEl.classList.remove("paused"); if (reduced.matches) stop("static"); else start(); };
    const onReducedChange = () => { if (reduced.matches) { stop("static"); clearAll(); } else if (!suspended) start(); };

    // ---- inputs ----
    const onVisibility = () => (document.hidden ? suspend() : resume());
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      S.ptx = clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      S.pty = clamp((e.clientY / window.innerHeight - 0.5) * 2, -1, 1);
    };
    const onPointerDown = (e: PointerEvent) => { const [x, y] = toViewBox(e.clientX, e.clientY); addPulse(x, y, 0.45); };
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      S.ptx = clamp(e.gamma / 25, -1, 1);
      S.pty = clamp((e.beta - 50) / 25, -1, 1);
    };
    const onScroll = (e: Event) => {
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
    const onFocus = () => { S.calmTarget = editing() ? 1 : 0; };
    const onPing = (e: Event) => {
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
    document.addEventListener("visibilitychange", onVisibility, { passive: true });
    reduced.addEventListener("change", onReducedChange);

    let capacitorListenerRemove: (() => void) | undefined;
    try {
      CapacitorApp.addListener("appStateChange", ({ isActive }) => (isActive ? resume() : suspend()))
        .then((handle) => { capacitorListenerRemove = () => handle.remove(); })
        .catch(() => { /* not running inside Capacitor */ });
    } catch { /* not running inside Capacitor */ }

    if (reduced.matches) stop("static"); else start();

    return () => {
      stop("stopped");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("deviceorientation", onTilt);
      document.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("focusout", onFocus);
      window.removeEventListener(AMBIENT_EVENT, onPing);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onReducedChange);
      if (capacitorListenerRemove) capacitorListenerRemove();
    };
  }, []);

  return null;
};

export default AmbientWallpaper;

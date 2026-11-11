import React, { useEffect, useState, useId, useRef, useCallback } from 'react';

export type LaunchAnimationProps = {
  /** Called once the animation finishes and the overlay fades out */
  onDone: () => void;
  /** Explicit theme override ('light' | 'dark'). If omitted, auto-detected from HTML / system */
  theme?: 'light' | 'dark';
};

const DATA = {
  WMW: 275.5,
  HOP: 23.2,
  BLOB: {
    ring_d: 'M29.73 -26.77A40 40 0 1 0 29.73 26.77',
    d1: 'M-20.5 -12.2L-12.8 -18.9V18.9',
    d0: 'M20.5 0A9 18.9 0 1 0 2.5 0A9 18.9 0 1 0 20.5 0',
    ex: 29.73,
    ey: 26.77,
    OFF: 10.62,
  },
  LAY: {
    P: { VW: 360, VH: 640, K: 1.9, WS: 1.08, FX: 180, FY: 255.7, WX: 31.2, WY: 428.2, RS: 0.8 },
    L: { VW: 680, VH: 260, K: 1.35, WS: 1.3, FX: 138.9, FY: 130, WX: 257.6, WY: 139.8, RS: 1 },
  },
};

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const S = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const io = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const out = (u: number) => 1 - Math.pow(1 - u, 3);
const back = (u: number) => 1 + 2.7 * Math.pow(u - 1, 3) + 1.7 * Math.pow(u - 1, 2);

const D = 1.15;
const Q = 0.76;
const TS = 0.69;
const T = (D + 4.5 - TS) * Q; // ~3.77s
const PEN = 42;

// Brand sheet v2 tokens
const BRAND = {
  red: '#E23B22',      // CalCredit Red (light)
  redDark: '#FF5440',  // Red on dark
  ink: '#1B1815',
  cream: '#F5EEDC',
  paper: '#F7F1E1',
  // The brand sheet specifies one 8-unit stroke for both the C and the 10.
  markStroke: 8,
};
const FONT_STACK = "'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif";
const OFF = DATA.BLOB.OFF;
const HOP = DATA.HOP;
const WMW = DATA.WMW;

export const LaunchAnimation: React.FC<LaunchAnimationProps> = ({ onDone, theme }) => {
  const uid = useId().replace(/:/g, '');
  const sgId = `sg_${uid}`;
  const cwId = `cw_${uid}`;
  const mskId = `msk_${uid}`;
  const wmId = `wm_${uid}`;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [mountedTheme, setMountedTheme] = useState<'light' | 'dark'>(() => {
    if (theme) return theme;
    if (typeof document !== 'undefined') {
      const datasetTheme = document.documentElement.dataset.theme;
      if (datasetTheme === 'dark' || datasetTheme === 'light') return datasetTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    if (theme) {
      setMountedTheme(theme);
    } else if (typeof document !== 'undefined') {
      const isDark =
        document.documentElement.dataset.theme === 'dark' ||
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMountedTheme(isDark ? 'dark' : 'light');
    }
  }, [theme]);

  const finishAnimation = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      onDoneRef.current();
    }, 180);
  }, []);

  const handleSkip = useCallback(() => {
    finishAnimation();
  }, [finishAnimation]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ring = svg.querySelector<SVGPathElement>('#ring');
    const d1 = svg.querySelector<SVGPathElement>('#d1');
    const d0 = svg.querySelector<SVGPathElement>('#d0');
    const mk = svg.querySelector<SVGGElement>('#mk');
    const cwr = svg.querySelector<SVGRectElement>('#cwr');
    const pen = svg.querySelector<SVGGElement>('#pen');
    const pulse = svg.querySelector<SVGGElement>('#pulse');
    const rip = svg.querySelector<SVGCircleElement>('#rip');
    const dot = svg.querySelector<SVGGElement>('#dot');
    const sh = svg.querySelector<SVGRectElement>('#sh');
    const cam = svg.querySelector<SVGGElement>('#cam');
    const wg = svg.querySelector<SVGGElement>('#wg');
    const wgm = svg.querySelector<SVGGElement>('#wgm');
    const au = svg.querySelector<SVGTextElement>('#au');
    const SW = svg.querySelector<SVGCircleElement>('#sw');
    const SW2 = svg.querySelector<SVGCircleElement>('#sw2');
    const fx = svg.querySelector<SVGGElement>('#fx');
    const fx2 = svg.querySelector<SVGGElement>('#fx2');
    const chs = Array.from(svg.querySelectorAll<SVGGElement>('.ch'));

    if (!ring || !d1 || !d0 || !mk || !cwr || !pen || !pulse || !rip || !dot || !sh || !cam || !wg || !wgm || !au || !SW || !SW2 || !fx || !fx2) {
      finishAnimation();
      return;
    }

    const ringEl: SVGPathElement = ring;
    const d1El: SVGPathElement = d1;
    const d0El: SVGPathElement = d0;
    const mkEl: SVGGElement = mk;
    const cwrEl: SVGRectElement = cwr;
    const penEl: SVGGElement = pen;
    const pulseEl: SVGGElement = pulse;
    const ripEl: SVGCircleElement = rip;
    const dotEl: SVGGElement = dot;
    const shEl: SVGRectElement = sh;
    const camEl: SVGGElement = cam;
    const wgEl: SVGGElement = wg;
    const wgmEl: SVGGElement = wgm;
    const auEl: SVGTextElement = au;
    const SWEl: SVGCircleElement = SW;
    const SW2El: SVGCircleElement = SW2;

    const RL = ringEl.getTotalLength ? ringEl.getTotalLength() : 224.26;
    const L1 = d1El.getTotalLength ? d1El.getTotalLength() : 38.3;
    const L0 = d0El.getTotalLength ? d0El.getTotalLength() : 93.6;

    [[d1El, L1], [d0El, L0], [ringEl, RL]].forEach(([el, l]) => {
      (el as SVGGeometryElement).style.strokeDasharray = `${l} ${l}`;
    });

    const dr = (el: SVGGeometryElement, l: number, p: number) => {
      el.style.strokeDashoffset = `${l * (1 - p)}px`;
      el.style.opacity = p > 0 ? '1' : '0';
    };

    // Pre-generate grade tokens and spark particles
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const NS = 'http://www.w3.org/2000/svg';

    const GR = Array.from({ length: 28 }, () => {
      const g = {
        a: rnd() * 6.283,
        r: 110 + rnd() * 240,
        s: 0.7 + rnd() * 0.9,
        c: rnd(),
        e: document.createElementNS(NS, 'text') as SVGTextElement,
      };
      g.e.setAttribute('text-anchor', 'middle');
      g.e.setAttribute('font-family', FONT_STACK);
      g.e.setAttribute('font-size', '15');
      g.e.setAttribute('font-weight', '600');
      g.e.setAttribute('class', g.c < 0.3 ? 'gr' : 'gk');
      g.e.textContent = (5.5 + rnd() * 4.5).toFixed(1);
      fx.appendChild(g.e);
      return g;
    });

    const SK = Array.from({ length: 34 }, (_, j) => {
      const tb = 1 + (0.8 * j) / 34;
      const q = ringEl.getPointAtLength ? ringEl.getPointAtLength(RL * io(S(tb, 1, 1.8))) : { x: 29.73, y: 26.77 };
      const s = {
        x: q.x - OFF,
        y: q.y,
        a: rnd() * 6.283,
        v: 20 + rnd() * 45,
        tb: tb + D,
        e: document.createElementNS(NS, 'circle') as SVGCircleElement,
      };
      s.e.setAttribute('r', '1.7');
      s.e.setAttribute('class', rnd() < 0.5 ? 'fr' : 'fk');
      fx2.appendChild(s.e);
      return s;
    });

    type LayoutState = {
      P: boolean;
      VW: number;
      VH: number;
      K: number;
      WS: number;
      FX: number;
      FY: number;
      WX: number;
      WY: number;
      RS: number;
      CX: number;
      CY: number;
    };

    const L: LayoutState = {
      P: true,
      VW: 360,
      VH: 640,
      K: 1.9,
      WS: 1.08,
      FX: 180,
      FY: 255.7,
      WX: 31.2,
      WY: 428.2,
      RS: 0.8,
      CX: 180,
      CY: 320,
    };

    const layout = () => {
      const P = svg.clientWidth < svg.clientHeight * 0.9;
      const base = DATA.LAY[P ? 'P' : 'L'];
      Object.assign(L, base, { P });
      L.CX = L.VW / 2;
      L.CY = L.VH / 2;
      svg.setAttribute('viewBox', `0 0 ${L.VW} ${L.VH}`);
      const w = `translate(${L.WX} ${L.WY}) scale(${L.WS})`;
      wgEl.setAttribute('transform', w);
      wgmEl.setAttribute('transform', w);
      [SWEl, SW2El].forEach((e) => {
        e.setAttribute('cx', String(L.CX));
        e.setAttribute('cy', String(L.CY));
      });
    };

    function R0(t: number) {
      const s = (0.55 + 0.45 * back(S(t, 0, 0.5))) * L.K;
      const u0 = io(S(t, 1.85, 2.5));
      const px = L.CX + (L.FX - L.CX) * u0;
      const py = L.CY + (L.FY - L.CY) * u0;
      mkEl.setAttribute('transform', `translate(${px} ${py}) scale(${s})`);
      mkEl.style.opacity = String(out(S(t, 0, 0.25)));
      cwrEl.setAttribute('x', L.P ? '-1000' : String(px + 50 * L.K));
      dr(d1El, L1, io(S(t, 0.35, 0.72)));
      dr(d0El, L0, io(S(t, 0.62, 1)));
      const p = io(S(t, 1, 1.8));
      dr(ringEl, RL, p);
      const a = out(S(t, 0.78, 1));
      const pt = ringEl.getPointAtLength ? ringEl.getPointAtLength(RL * p) : { x: 29.73, y: 26.77 };
      const fu = S(t, 1.8, 2.2);
      const rot =
        PEN +
        22 * (1 - a) +
        (p > 0 && p < 1 ? 2 * Math.sin(p * 14) : 0) +
        (fu > 0 && fu < 1 ? (1 - fu) * Math.sin(fu * Math.PI * 3) * 9 : 0);
      penEl.setAttribute('transform', `translate(${pt.x} ${pt.y - 18 * (1 - a)}) rotate(${rot})`);
      penEl.style.opacity = String(a);
      pulseEl.setAttribute('transform', `scale(${1 + 0.05 * Math.sin(S(t, 1.85, 2.3) * Math.PI)})`);
      const u3 = S(t, 1.8, 2.3);
      ripEl.setAttribute('r', String(4 + 28 * out(u3)));
      ripEl.style.opacity = String(u3 > 0 && u3 < 1 ? (1 - u3) * 0.8 : 0);
      chs.forEach((e, i) => {
        const q = S(t, 1.95 + 0.02 * i, 2.45 + 0.02 * i);
        e.setAttribute('transform', `translate(0 ${8 * (1 - out(q))})`);
        e.style.opacity = String(out(q));
      });
      const qa = out(S(t, 2.45, 2.95));
      auEl.style.opacity = String(0.85 * qa);
      auEl.setAttribute('transform', `translate(0 ${8 * (1 - qa)})`);
      const fu2 = S(t, 3 - TS, 3.3 - TS);
      const lb = S(t, 3.3 - TS, 3.45 - TS);
      const dq = S(t, 3.45 - TS, 4.1 - TS);
      const hp = S(dq, 0, 0.6);
      const bb = S(dq, 0.6, 1);
      const E = out(hp);
      const dx = HOP * (1 - E);
      const dy =
        -7.5 * (1 - E) -
        26 * Math.sin(Math.PI * hp) -
        (bb > 0 ? 8 * Math.abs(Math.sin(bb * Math.PI * 2)) * (1 - bb) : 0) -
        6 * Math.sin(Math.PI * lb) -
        55 * (1 - fu2 * fu2);
      dotEl.setAttribute('transform', `translate(${dx} ${dy})`);
      dotEl.style.opacity = String(out(S(t, 3 - TS, 3.1 - TS)));
      const sq = S(t, 4.05 - TS, 4.5 - TS);
      shEl.setAttribute('x', String(-70 + 0.325 * L.WY + sq * (L.VW + 140)));
      shEl.style.opacity = String(sq > 0 && sq < 1 ? 1 : 0);
    }

    function X(t: number) {
      const e = io(S(t, 0.3, D));
      GR.forEach((g) => {
        const an = g.a + 1.6 * e + 0.12 * t;
        const rd = g.r * (1 - e);
        g.e.setAttribute(
          'transform',
          `translate(${L.CX + L.RS * rd * Math.cos(an)} ${L.CY + L.RS * rd * Math.sin(an)}) scale(${
            g.s * (1 - 0.8 * e)
          })`
        );
        g.e.style.opacity = String(out(S(t, 0, 0.25)) * (1 - S(t, D - 0.3, D)) * (0.25 + 0.4 * g.c));
      });
      const w2 = S(t, D - 0.05, D + 0.6);
      SW2El.setAttribute('r', String(20 + 140 * out(w2)));
      SW2El.style.opacity = String(w2 > 0 && w2 < 1 ? (1 - w2) * 0.8 : 0);
      const tI = D + 1.8;
      const d = t - tI;
      const sy = d > 0 ? Math.exp(-d * 9) * Math.sin(d * 55) * 1.5 : 0;
      camEl.setAttribute(
        'transform',
        `translate(${L.CX} ${L.CY}) scale(${1.12 - 0.12 * out(S(t, 0, D + 1.4))}) translate(${-L.CX} ${
          -L.CY + sy
        })`
      );
      SK.forEach((s) => {
        const ag = t - s.tb;
        const ok = ag > 0 && ag < 0.7;
        s.e.setAttribute('cx', String(L.CX + 0.95 * L.K * s.x + Math.cos(s.a) * s.v * ag));
        s.e.setAttribute('cy', String(L.CY + 0.95 * L.K * s.y + Math.sin(s.a) * s.v * ag + 60 * ag * ag));
        s.e.style.opacity = String(ok ? 1 - ag / 0.7 : 0);
      });
      const q = S(t, tI, tI + 0.9);
      SWEl.setAttribute('r', String(40 + 280 * out(q)));
      SWEl.setAttribute('stroke-width', String(0.5 + 3 * (1 - q)));
      SWEl.style.opacity = String(q > 0 && q < 1 ? (1 - q) * 0.3 : 0);
    }

    const R = (t: number) => {
      const u = t / Q;
      R0(u - D);
      X(u);
    };

    layout();
    window.addEventListener('resize', layout);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      R(T);
      const timer = setTimeout(() => {
        finishAnimation();
      }, 400);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', layout);
      };
    }

    let rafId: number;
    const startTime = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= T) {
        R(T);
        setTimeout(() => {
          finishAnimation();
        }, 180);
        return;
      }
      R(elapsed);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    // Failsafe timer (never stay longer than 4.5s)
    const failsafe = setTimeout(() => {
      finishAnimation();
    }, 4500);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(failsafe);
      window.removeEventListener('resize', layout);
    };
  }, [finishAnimation]);

  const isDark = mountedTheme === 'dark';
  const bgColor = isDark ? BRAND.ink : BRAND.paper;

  return (
    <div
      ref={containerRef}
      role="status"
      tabIndex={0}
      aria-label="CalCredit is loading"
      aria-live="polite"
      onClick={handleSkip}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleSkip();
        }
      }}
      className={`fixed inset-0 z-[99999] flex items-center justify-center select-none cursor-pointer transition-opacity duration-200 outline-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
      style={{
        backgroundColor: bgColor,
        // CSS variables for launch sequence SVG elements
        ['--sbg' as string]: bgColor,
        ['--ink' as string]: isDark ? BRAND.cream : BRAND.ink,
        ['--red' as string]: isDark ? BRAND.redDark : BRAND.red,
        ['--muted' as string]: isDark ? '#A39E90' : '#6B675E',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap');
        .cc-launch-st {
          display: block;
          margin: 0 auto;
          height: min(76vh, 680px);
          max-width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: 28px;
          background: var(--sbg);
        }
        .cc-launch-st .bg { fill: var(--sbg); }
        .cc-launch-st .fr { fill: var(--red); }
        .cc-launch-st .fi, .cc-launch-st .fk, .cc-launch-st .gk { fill: var(--ink); }
        .cc-launch-st .gr { fill: var(--red); }
        .cc-launch-st .ch { fill: none; stroke-width: 6.8; stroke-linecap: round; stroke-linejoin: round; }
        .cc-launch-st .ch.r { stroke: var(--red); }
        .cc-launch-st .ch.k { stroke: var(--ink); }
        .cc-launch-st .tag { fill: var(--muted); font: 500 12.5px 'Inter', -apple-system, 'Helvetica Neue', Arial, sans-serif; }
        .cc-launch-st .sw { fill: none; stroke: var(--ink); }
        .cc-launch-st .sw2 { fill: none; stroke: var(--red); stroke-width: 3; }
        @media (prefers-reduced-motion: reduce) {
          .cc-launch-st #ring,
          .cc-launch-st #d1,
          .cc-launch-st #d0,
          .cc-launch-st .cc-c-arc {
            stroke-dashoffset: 0px !important;
          }
        }
      `}</style>

      <svg
        ref={svgRef}
        className="cc-launch-st"
        viewBox="0 0 360 640"
        role="img"
        aria-label="CalCredit logo animation"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={sgId}>
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={cwId}>
            <rect id="cwr" x="-1000" y="-2000" width="4000" height="6000" />
          </clipPath>
          <mask id={mskId} style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">
            <g id="wgm">
              <use href="#wm" />
            </g>
          </mask>
        </defs>

        <rect className="bg" x="-2000" y="-2000" width="6000" height="6000" />

        <g id="cam">
          <g id="fx" />

          {/* Mark Group */}
          <g id="mk">
            <g transform="translate(-10.62 0)">
              {/* Digit 10 Pulse Group */}
              <g id="pulse">
                <g fill="none" stroke="var(--ink)" strokeWidth={BRAND.markStroke} strokeLinecap="round" strokeLinejoin="round">
                  {/* Brand-sheet numeral: angled cap + straight stem, paired with a broad oval zero. */}
                  <path id="d1" d="M-8.7 -19.2L-19.3 -10.7M-8.7 -19.2V19.2" />
                  <ellipse id="d0" cx="18.95" cy="0" rx="11.7" ry="19.2" />
                </g>
              </g>

              {/* Red C Ring */}
              <path
                id="ring"
                className="cc-c-arc"
                d="M29.73 -26.77A40 40 0 1 0 29.73 26.77"
                fill="none"
                stroke="var(--red)"
                strokeWidth={BRAND.markStroke}
                strokeLinecap="round"
              />

              {/* Ripple Ring */}
              <circle id="rip" cx="29.73" cy="26.77" r="4" fill="none" stroke="var(--red)" strokeWidth="1.6" opacity="0" />

              {/* Drawing Pen */}
              <g id="pen">
                <path className="fi" d="M-5.5 -13V-45Q-5.5 -48.5 -2 -48.5H2Q5.5 -48.5 5.5 -45V-13Z" />
                <path className="fr" d="M0 0L-5.5 -13H5.5Z" stroke="var(--red)" strokeWidth="1.4" strokeLinejoin="round" />
              </g>
            </g>
          </g>

          {/* Wordmark and Subtitle in Clip Group */}
          <g clipPath={`url(#${cwId})`}>
            <g id="wg">
              <g id="wm" className="cc-wordmark">
                {/* 'C' in red */}
                <g className="ch r">
                  <g transform="translate(-0.00 0)">
                    <path d="M33.78 -31.66A17.20 17.20 0 1 0 33.78 -9.54" />
                  </g>
                </g>
                {/* 'a' in red */}
                <g className="ch r">
                  <g transform="translate(40.27 0)">
                    <circle cx="14.6" cy="-14.6" r="11.20" />
                    <path d="M25.80 -3.40V-25.80" />
                  </g>
                </g>
                {/* 'l' in red */}
                <g className="ch r">
                  <g transform="translate(77.47 0)">
                    <path d="M3.40 -3.40V-40.60" />
                  </g>
                </g>
                {/* 'C' in ink */}
                <g className="ch k">
                  <g transform="translate(90.87 0)">
                    <path d="M33.78 -31.66A17.20 17.20 0 1 0 33.78 -9.54" />
                  </g>
                </g>
                {/* 'r' in ink */}
                <g className="ch k">
                  <g transform="translate(132.05 0)">
                    <path d="M3.40 -3.40V-15.30A10.5 10.5 0 0 1 19.92 -23.90" />
                  </g>
                </g>
                {/* 'e' in ink */}
                <g className="ch k">
                  <g transform="translate(158.57 0)">
                    <path d="M3.40 -14.6H25.80A11.20 11.20 0 1 0 22.24 -6.41" />
                  </g>
                </g>
                {/* 'd' in ink */}
                <g className="ch k">
                  <g transform="translate(193.37 0)">
                    <circle cx="14.6" cy="-14.6" r="11.20" />
                    <path d="M25.80 -3.40V-40.60" />
                  </g>
                </g>
                {/* 'i' in ink */}
                <g className="ch k">
                  <g transform="translate(230.57 0)">
                    <path d="M3.40 -3.40V-25.80" />
                  </g>
                </g>
                {/* 't' in ink */}
                <g className="ch k">
                  <g transform="translate(253.77 0)">
                    <path d="M3.40 -34.60V-11.40A8 8 0 0 0 18.33 -7.40M-2.60 -25.80H9.90" />
                  </g>
                </g>
                {/* Dot on 'i' */}
                <g id="dot">
                  <circle cx="233.97" cy="-37.6" r="4.8" className="fr" />
                </g>
              </g>

              {/* Subtitle */}
              <text id="au" x="0" y="27" className="tag cc-subtitle" textLength="275.5" lengthAdjust="spacing">
                ANNA UNIVERSITY
              </text>
            </g>
          </g>

          {/* Shimmer Sheen Mask */}
          <g mask={`url(#${mskId})`}>
            <rect id="sh" y="-100" width="70" height="900" fill={`url(#${sgId})`} transform="skewX(-18)" />
          </g>

          {/* Sparks and Shockwaves */}
          <g id="fx2">
            <circle id="sw" className="sw" />
            <circle id="sw2" className="sw2" />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default LaunchAnimation;

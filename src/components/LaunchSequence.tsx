import { useEffect, useRef } from 'react';
import { LAUNCH_SVG } from './launchMarkup';

type Props = {
  /** Called once the overlay has fully faded out. */
  onDone: () => void;
  /** Set to false while the app is still loading; the finished logo holds until true. */
  ready?: boolean;
  /** Always play the full sequence (useful for a "replay" button). */
  forceFull?: boolean;
  /** Background pictures (import them as URLs): dark-scholar-bg for dark theme, warm-scholar-bg for light. */
  darkBg: string;
  lightBg: string;
};

/** Blur applied to the background picture while the logo plays. It clears to 0 during the hand-off. */
const BG_BLUR = 10;

const SEEN_KEY = 'calcredit.launch.seen';

// Light theme palette: the dark-theme colours used in the drawing are swapped for these.
const LIGHT: Record<string, string> = {
  '#F5EEDC': '#1B1815', // cream -> ink (tile, "Credit", ring of numbers)
  '#1B1815': '#F5EEDC', // ink -> cream (digits and pen sit on the ink tile)
  '#F0482E': '#E23B22', // red
  '#FFD23F': '#E89B00', // turmeric, a little deeper so the i-dot stays visible on light
};
const isDark = () =>
  document.documentElement.dataset.theme === 'dark' || document.documentElement.classList.contains('dark');

// Internal timeline: D = build-up length, Q = speed scale. Full cut = (D + 4.5 - TS) * Q = 3.8 s.
const D = 1.15;
const Q = 0.76; // higher = slower
// The name, i-dot and shine run TS earlier, so the name arrives with the tile instead of after it.
const TS = 0.69;
const T = (D + 4.5 - TS) * Q;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const S = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const io = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
const out = (u: number) => 1 - Math.pow(1 - u, 3);
const back = (u: number) => 1 + 2.7 * Math.pow(u - 1, 3) + 1.7 * Math.pow(u - 1, 2);

async function hideNativeSplash() {
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 150 });
  } catch {
    /* running in a browser, or plugin not installed */
  }
}

export default function LaunchSequence({ onDone, ready = true, forceFull = false, darkBg, lightBg }: Props) {
  const darkNow = isDark();
  const host = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(ready);
  const tryCloseRef = useRef<() => void>(() => {});

  useEffect(() => {
    readyRef.current = ready;
    tryCloseRef.current();
  }, [ready]);

  useEffect(() => {
    const el = host.current!;
    const wrap = wrapRef.current!;
    const bg = bgRef.current!;
    el.innerHTML = LAUNCH_SVG;
    const dark = isDark();
    const C = (c: string) => (dark ? c : LIGHT[c] ?? c);
    if (!dark) {
      el.querySelectorAll<SVGElement>('[fill],[stroke],[stop-color]').forEach((n) => {
        for (const a of ['fill', 'stroke', 'stop-color']) {
          const v = n.getAttribute(a)?.toUpperCase();
          if (v && LIGHT[v]) n.setAttribute(a, LIGHT[v]);
        }
      });
    }
    // Hide the app's own content while the splash plays, so only the app background shows (blurred).
    const appRoot = document.getElementById('root');
    if (appRoot) { appRoot.style.opacity = '0'; appRoot.style.visibility = 'hidden'; }
    const restoreNow = () => {
      if (appRoot) { appRoot.style.visibility = ''; appRoot.style.opacity = ''; appRoot.style.transition = ''; }
    };
    // Fade the app in (opacity only, so fixed-position bars inside the app are never affected).
    const showApp = () => {
      if (!appRoot) return;
      appRoot.style.visibility = '';
      appRoot.style.transition = 'opacity 440ms cubic-bezier(.22,1,.36,1)';
      void appRoot.offsetHeight;
      appRoot.style.opacity = '1';
      timers.push(window.setTimeout(restoreNow, 520));
    };

    const NS = 'http://www.w3.org/2000/svg';
    const $ = (id: string) => el.querySelector<SVGElement>('#' + id)!;
    const $g = (id: string) => el.querySelector<SVGGeometryElement>('#' + id)!;
    const mk = (parent: string, tag: string, attrs: Record<string, string | number>) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      $(parent).appendChild(e);
      return e as SVGElement;
    };
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

    // ---- elements ----
    const ring = $g('ring'), d1 = $g('d1'), d0 = $g('d0');
    const RL = ring.getTotalLength(), L1 = d1.getTotalLength(), L0 = d0.getTotalLength();
    [[d1, L1], [d0, L0], [ring, RL]].forEach(([e, l]) => {
      (e as SVGElement).style.strokeDasharray = `${l} ${l}`;
    });
    const dr = (e: SVGElement, l: number, p: number) => {
      e.style.strokeDashoffset = String(l * (1 - p));
      e.style.opacity = p > 0 ? '1' : '0';
    };
    const tile = $('tile'), cwr = $('cwr'), gw = $('gw'), pen = $('pen'), pulse = $('pulse');
    gw.style.display = 'none'; // no glow gradient: the picture is the background
    const rip = $('rip'), dot = $('dot'), sh = $('sh'), cam = $('cam');
    const chs = Array.from(el.querySelectorAll<SVGElement>('.ch'));

    const GR = Array.from({ length: 28 }, () => {
      const g = { a: rnd() * 6.283, r: 110 + rnd() * 240, s: 0.7 + rnd() * 0.9, c: rnd(), e: null as unknown as SVGElement };
      g.e = mk('fx', 'text', {
        'text-anchor': 'middle', 'font-family': 'system-ui,sans-serif', 'font-size': 15, 'font-weight': 600,
        fill: C(g.c < 0.2 ? '#FFD23F' : g.c < 0.45 ? '#F0482E' : '#F5EEDC'),
      });
      g.e.textContent = (5.5 + rnd() * 4.5).toFixed(1);
      return g;
    });
    const SK = Array.from({ length: 34 }, (_, j) => {
      const tb = 1 + (0.8 * j) / 34;
      const q = ring.getPointAtLength(RL * io(S(tb, 1, 1.8)));
      return {
        x: q.x - 64.5, y: q.y - 60, a: rnd() * 6.283, v: 20 + rnd() * 45, tb: tb + D,
        e: mk('fx2', 'circle', { r: 1.7, fill: C(rnd() < 0.5 ? '#FFD23F' : '#F0482E') }),
      };
    });
    const SW = mk('fx2', 'circle', { fill: 'none', stroke: C('#F5EEDC') });
    const SW2 = mk('fx2', 'circle', { fill: 'none', stroke: C('#F0482E'), 'stroke-width': 3 });
    // "Anna University" tag: sits under the name, inside the same group so it shares its position, reveal and theme colours.
    const au = mk('wg', 'text', {
      y: 30, 'font-family': 'system-ui,sans-serif', 'font-size': 12, 'font-weight': 600,
      'letter-spacing': 3.8, fill: C('#F5EEDC'),
    });
    au.textContent = 'ANNA UNIVERSITY';

    // ---- layout (portrait phones vs landscape) ----
    const L = { P: false, VW: 680, VH: 260, CX: 340, CY: 130, K: 1, FX: 156, FY: 130, WX: 248, WY: 158, WS: 1.3, RS: 1 };
    const layout = () => {
      const P = el.clientWidth < el.clientHeight * 0.9;
      Object.assign(L, P
        ? { P, VW: 360, VH: 640, K: 1.2, FX: 180, FY: 276, WX: 31, WY: 432, WS: 1.15, RS: 0.8 }
        : { P, VW: 680, VH: 260, K: 1, FX: 156, FY: 130, WX: 248, WY: 158, WS: 1.3, RS: 1 });
      L.CX = L.VW / 2; L.CY = L.VH / 2;
      $('launch-svg').setAttribute('viewBox', `0 0 ${L.VW} ${L.VH}`);
      const w = `translate(${L.WX} ${L.WY}) scale(${L.WS})`;
      $('wg').setAttribute('transform', w); $('wgm').setAttribute('transform', w);
      [gw, SW, SW2].forEach((e) => { e.setAttribute('cx', String(L.CX)); e.setAttribute('cy', String(L.CY)); });
      // Centred under the stacked name on phones; left-aligned with the name beside the tile on wide screens.
      au.setAttribute('x', P ? '131.5' : '1');
      au.setAttribute('text-anchor', P ? 'middle' : 'start');
    };

    // ---- frame renderers ----
    const R0 = (t: number) => {
      const s = (0.55 + 0.45 * back(S(t, 0, 0.5))) * L.K;
      const u0 = io(S(t, 1.85, 2.5));
      const px = L.CX + (L.FX - L.CX) * u0, py = L.CY + (L.FY - L.CY) * u0;
      tile.setAttribute('transform', `translate(${px} ${py}) scale(${s}) translate(-60 -60)`);
      tile.style.opacity = String(out(S(t, 0, 0.25)));
      cwr.setAttribute('x', String(L.P ? -1000 : px + 52 * L.K));
      gw.style.opacity = String(0.9 * out(S(t, 0, 0.6)));
      dr(d1, L1, io(S(t, 0.35, 0.72)));
      dr(d0, L0, io(S(t, 0.62, 1)));
      const p = io(S(t, 1, 1.8));
      dr(ring, RL, p);
      const a = out(S(t, 0.78, 1)), pt = ring.getPointAtLength(RL * p), fu = S(t, 1.8, 2.2);
      const rot = 35 + 22 * (1 - a) + (p > 0 && p < 1 ? 2 * Math.sin(p * 14) : 0)
        + (fu > 0 && fu < 1 ? (1 - fu) * Math.sin(fu * Math.PI * 3) * 9 : 0);
      pen.setAttribute('transform', `translate(${pt.x} ${pt.y - 18 * (1 - a)}) rotate(${rot})`);
      pen.style.opacity = String(a);
      const s2 = 1 + 0.05 * Math.sin(S(t, 1.85, 2.3) * Math.PI);
      pulse.setAttribute('transform', `translate(60 62) scale(${s2}) translate(-60 -62)`);
      const u3 = S(t, 1.8, 2.3);
      rip.setAttribute('r', String(4 + 28 * out(u3)));
      rip.style.opacity = String(u3 > 0 && u3 < 1 ? (1 - u3) * 0.8 : 0);
      chs.forEach((e, i) => {
        const q = S(t, 1.95 + 0.02 * i, 2.45 + 0.02 * i);
        e.setAttribute('transform', `translate(0 ${8 * (1 - out(q))})`);
        e.style.opacity = String(out(q));
      });
      // Tag arrives as the name finishes and is in place before the i-dot settles, so the dot still gets the last beat.
      const qa = out(S(t, 2.45, 2.95));
      au.style.opacity = String(0.72 * qa);
      au.setAttribute('transform', `translate(0 ${8 * (1 - qa)})`);
      // i-dot: drops onto the "t", hops across to the "i", bounces and settles
      const fu2 = S(t, 3 - TS, 3.3 - TS), lb = S(t, 3.3 - TS, 3.45 - TS), dq = S(t, 3.45 - TS, 4.1 - TS);
      const hp = S(dq, 0, 0.6), bb = S(dq, 0.6, 1), E = out(hp);
      const dx = 20.5 * (1 - E);
      const dy = -7.5 * (1 - E) - 26 * Math.sin(Math.PI * hp)
        - (bb > 0 ? 8 * Math.abs(Math.sin(bb * Math.PI * 2)) * (1 - bb) : 0)
        - 6 * Math.sin(Math.PI * lb) - 55 * (1 - fu2 * fu2);
      dot.setAttribute('transform', `translate(${dx} ${dy})`);
      dot.style.opacity = String(out(S(t, 3 - TS, 3.1 - TS)));
      const sq = S(t, 4.05 - TS, 4.5 - TS);
      sh.setAttribute('x', String(-80 + sq * (L.VW + 160)));
      sh.style.opacity = String(sq > 0 && sq < 1 ? 1 : 0);
    };
    const X = (t: number) => {
      const e = io(S(t, 0.3, D));
      GR.forEach((g) => {
        const an = g.a + 1.6 * e + 0.12 * t, rd = g.r * (1 - e);
        g.e.setAttribute('transform',
          `translate(${L.CX + L.RS * rd * Math.cos(an)} ${L.CY + L.RS * rd * Math.sin(an)}) scale(${g.s * (1 - 0.8 * e)})`);
        g.e.style.opacity = String(out(S(t, 0, 0.25)) * (1 - S(t, D - 0.3, D)) * (0.25 + 0.4 * g.c));
      });
      gw.setAttribute('r', String(190 + 90 * Math.exp(-Math.pow((t - D) * 4, 2))));
      const w2 = S(t, D - 0.05, D + 0.6);
      SW2.setAttribute('r', String(20 + 140 * out(w2)));
      SW2.style.opacity = String(w2 > 0 && w2 < 1 ? (1 - w2) * 0.8 : 0);
      const tI = D + 1.8, d = t - tI;
      const sy = d > 0 ? Math.exp(-d * 9) * Math.sin(d * 55) * 1.5 : 0;
      cam.setAttribute('transform',
        `translate(${L.CX} ${L.CY}) scale(${1.12 - 0.12 * out(S(t, 0, D + 1.4))}) translate(${-L.CX} ${-L.CY + sy})`);
      SK.forEach((s) => {
        const ag = t - s.tb, ok = ag > 0 && ag < 0.7;
        s.e.setAttribute('cx', String(L.CX + 0.95 * L.K * s.x + Math.cos(s.a) * s.v * ag));
        s.e.setAttribute('cy', String(L.CY + 0.95 * L.K * s.y + Math.sin(s.a) * s.v * ag + 60 * ag * ag));
        s.e.style.opacity = ok ? String(1 - ag / 0.7) : '0';
      });
      const q = S(t, tI, tI + 0.9);
      SW.setAttribute('r', String(40 + 280 * out(q)));
      SW.setAttribute('stroke-width', String(0.5 + 3 * (1 - q)));
      SW.style.opacity = q > 0 && q < 1 ? String((1 - q) * 0.3) : '0';
    };
    const R = (t: number) => { const u = t / Q; R0(u - D); X(u); };

    // ---- lifecycle ----
    let raf = 0, cur = 0, dead = false, animDone = false, closing = false;
    const timers: number[] = [];
    const close = () => {
      if (closing) return;
      closing = true;
      // Focus pull: the logo drifts out while the blur clears, and the app fades in underneath.
      const svg = $('launch-svg');
      svg.style.transition = 'opacity 300ms ease, transform 480ms cubic-bezier(.4,0,.2,1)';
      svg.style.opacity = '0';
      svg.style.transform = 'scale(1.04)';
      bg.style.filter = 'blur(0px)';
      bg.style.transform = 'scale(1)';
      timers.push(window.setTimeout(showApp, 60));
      timers.push(window.setTimeout(() => { wrap.style.opacity = '0'; }, 220));
      timers.push(window.setTimeout(() => { if (!dead) onDone(); }, 540));
    };
    tryCloseRef.current = () => { if (animDone && readyRef.current) close(); };
    const finish = () => {
      if (animDone) return;
      animDone = true;
      try { localStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
      timers.push(window.setTimeout(() => tryCloseRef.current(), 150));
    };
    const play = (speed: number, start: number) => {
      const t0 = performance.now();
      const f = (n: number) => {
        cur = start + ((n - t0) / 1000) * speed;
        if (cur >= T) { R(T); finish(); return; }
        R(cur);
        raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    };
    const skip = () => { cancelAnimationFrame(raf); cur = T; R(T); finish(); };
    const onResize = () => { layout(); R(cur); };

    layout();
    R(0);
    void hideNativeSplash(); // first frame is on screen, so hand over from the native splash
    el.addEventListener('pointerdown', skip);
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seen = false;
    try { seen = !!localStorage.getItem(SEEN_KEY); } catch { /* ignore */ }
    if (reduce) { R(T); finish(); }
    else if (seen && !forceFull) play(1.6, D * Q); // returning user: quick cut (about 1.8 s)
    else play(1, 0);                               // first launch: full cut (3.8 s)

    // A backgrounded WebView can throttle animation frames and leave the app
    // hidden after the logo has finished. Never let the splash block sign-in.
    timers.push(window.setTimeout(() => {
      if (dead || closing) return;
      cancelAnimationFrame(raf);
      cur = T;
      R(T);
      finish();
      close();
    }, 8000));

    return () => {
      dead = true;
      restoreNow();
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      el.removeEventListener('pointerdown', skip);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      el.innerHTML = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden', touchAction: 'manipulation', transition: 'opacity 300ms ease' }}
    >
      <div
        ref={bgRef}
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${darkNow ? darkBg : lightBg})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: `blur(${BG_BLUR}px)`, transform: 'scale(1.06)',
          transition: 'filter 480ms cubic-bezier(.4,0,.2,1), transform 480ms cubic-bezier(.4,0,.2,1)',
        }}
      />
      <div ref={host} role="img" aria-label="CalCredit, Anna University" style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}

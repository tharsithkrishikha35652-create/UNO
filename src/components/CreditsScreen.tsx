import React, { useEffect, useRef, useState } from 'react';
import { Instagram, Linkedin } from 'lucide-react';

const creators = [
  {
    name: 'Tharsith R',
    role: 'App Developer',
    branch: 'CSE – N Batch',
    rollNo: '2026103054',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tharsith-r-b0702a372' },
    ],
  },
  {
    name: 'Raghu Nandan S',
    role: 'UI/UX Designer',
    branch: 'EE – VLSI',
    rollNo: '2026123013',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/the.creato.lab?vrfl=MXhxYWNlcG05bjI3eg==' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raghu-nandan-sudhakar-15b85b381' },
    ],
  },
] as const;

const linkIcons = { LinkedIn: Linkedin, Instagram } as const;

const cssVars = (vars: Record<string, string | number>) => vars as React.CSSProperties;

/* Elevation of the Main Building in a 640 x 280 box, symmetric about x = 320.
   Window bays repeat every 39 units; the right wing mirrors the left (x -> 640 - x). */
const BAYS = [58, 97, 136, 175, 214, 253] as const;
const WING_ROWS = [
  { id: 'u', sill: 210 },
  { id: 'l', sill: 254 },
] as const;
const WING_WINDOWS = WING_ROWS.flatMap(({ id, sill }) =>
  BAYS.flatMap((x, i) => [
    { key: `L-${id}${i}`, x, sill },
    { key: `R-${id}${i}`, x: 640 - x, sill },
  ]),
);
const CENTRE_WINDOWS = [
  { key: 'C-0', x: 290, sill: 206 },
  { key: 'C-1', x: 320, sill: 206 },
  { key: 'C-2', x: 350, sill: 206 },
] as const;
/* Windows appear outward from the centre line, ground floor a beat after the upper floor. */
const WINDOWS = [...WING_WINDOWS, ...CENTRE_WINDOWS].map((w) => ({
  ...w,
  order: Math.round(Math.abs(w.x - 320) / 39) * 2 + (w.sill > 230 ? 1 : 0),
}));
/* Night theme: lights switch on one by one in this order. Uneven on purpose. */
const LIT_ORDER = ['C-1', 'L-u4', 'R-u3', 'R-l4', 'L-l2', 'L-u1', 'R-u0', 'R-u5', 'R-l1', 'L-l0'];
const FLICKER = new Set(['L-u4', 'R-l4', 'L-u1', 'R-u5']);

const STARS = [
  [72, 34, 1.2], [118, 70, 1], [160, 24, 1.3], [196, 58, 1], [232, 30, 1.1], [262, 84, 1],
  [372, 28, 1.2], [404, 66, 1], [436, 22, 1.3], [476, 88, 1], [512, 40, 1.2], [548, 70, 1.1],
  [586, 26, 1], [600, 96, 1.2], [88, 108, 1], [610, 60, 1],
] as const;

const CLOUDS = [
  { y: 40, t: '84s', delay: '-12s', scale: 1 },
  { y: 78, t: '118s', delay: '-70s', scale: 0.8 },
  { y: 120, t: '100s', delay: '-38s', scale: 0.9 },
] as const;

const MainBuilding: React.FC<{ hourAngle: number; minuteAngle: number }> = ({ hourAngle, minuteAngle }) => (
  <svg
    viewBox="0 0 640 280"
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Elevation of the Main Building at the College of Engineering, Guindy: a red-brick façade with pale bands, a central clock tower and a dome."
    className="block h-full w-full"
  >
    <defs>
      <path id="cc-window" d="M-7 0V-19A7 7 0 0 1 7-19V0Z" />
    </defs>

    <rect className="cp-sky cp-fade" width="640" height="280" style={cssVars({ '--d': '0s' })} />

    {/* Night sky: stars twinkle, the moon drifts in */}
    <g className="cp-far cp-night" aria-hidden="true">
      {STARS.map(([x, y, r], i) => (
        <circle key={i} className="cp-star" cx={x} cy={y} r={r} style={cssVars({ '--i': i, '--sd': `${2.6 + (i % 4) * 0.8}s` })} />
      ))}
      <g className="cp-moon">
        <circle className="cp-moon-disc" cx="456" cy="52" r="13" />
        <circle className="cp-sky" cx="462" cy="48" r="11" />
      </g>
    </g>

    {/* Day sky: clouds drift slowly behind the building */}
    <g className="cp-far cp-day" aria-hidden="true">
      {CLOUDS.map(({ y, t, delay, scale }) => (
        <g key={y} transform={`translate(0 ${y}) scale(${scale})`}>
          <g className="cp-cloud" style={cssVars({ '--t': t, '--dl': delay })}>
            <ellipse cx="0" cy="0" rx="28" ry="8" />
            <ellipse cx="15" cy="-6" rx="17" ry="8" />
            <ellipse cx="-13" cy="-4" rx="13" ry="6" />
          </g>
        </g>
      ))}
    </g>

    <g className="cp-near">
      <rect className="cp-ground cp-fade" x="-20" y="260" width="680" height="20" style={cssVars({ '--d': '0.1s' })} />

      {/* Masonry rises from the ground, wings first, then the tower */}
      <g className="cp-brick">
        <rect className="cp-rise" style={cssVars({ '--i': 0 })} x="40" y="168" width="230" height="92" />
        <rect className="cp-rise" style={cssVars({ '--i': 0 })} x="370" y="168" width="230" height="92" />
        <rect className="cp-rise" style={cssVars({ '--i': 1 })} x="40" y="156" width="36" height="104" />
        <rect className="cp-rise" style={cssVars({ '--i': 1 })} x="564" y="156" width="36" height="104" />
        <rect className="cp-rise" style={cssVars({ '--i': 2 })} x="270" y="130" width="100" height="130" />
        <rect className="cp-rise" style={cssVars({ '--i': 3 })} x="282" y="78" width="76" height="52" />
        <rect className="cp-rise" style={cssVars({ '--i': 4 })} x="288" y="60" width="64" height="18" />
      </g>

      {/* Pale bands slide out from their centres */}
      <g className="cp-band">
        <rect className="cp-slide" style={cssVars({ '--i': 0 })} x="40" y="254" width="560" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 1 })} x="40" y="214" width="560" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 2 })} x="76" y="168" width="194" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 2 })} x="370" y="168" width="194" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 3 })} x="76" y="176" width="194" height="2" />
        <rect className="cp-slide" style={cssVars({ '--i': 3 })} x="370" y="176" width="194" height="2" />
        <rect className="cp-slide" style={cssVars({ '--i': 3 })} x="36" y="156" width="44" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 3 })} x="560" y="156" width="44" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 4 })} x="266" y="130" width="108" height="6" />
        <rect className="cp-slide" style={cssVars({ '--i': 4 })} x="270" y="154" width="100" height="4" />
        <rect className="cp-slide" style={cssVars({ '--i': 5 })} x="278" y="78" width="84" height="5" />
      </g>

      {/* Windows and entrance */}
      {WINDOWS.map(({ key, x, sill, order }) => {
        const lit = LIT_ORDER.indexOf(key);
        const cls = ['cp-win', 'cp-pop-in', lit >= 0 ? 'cp-lit' : '', FLICKER.has(key) ? 'cp-flick' : ''].filter(Boolean).join(' ');
        return (
          <use
            key={key}
            href="#cc-window"
            x={x}
            y={sill}
            className={cls}
            style={cssVars({ '--i': order, '--j': Math.max(lit, 0), '--fd': `${7 + (order % 4)}s` })}
          />
        );
      })}
      <path className="cp-void cp-fade" style={cssVars({ '--d': '1.2s' })} d="M300 260V244A20 20 0 0 1 340 244V260Z" />

      {/* Drum, dome, finial and clock */}
      <g className="cp-win cp-fade" style={cssVars({ '--d': '1.3s' })}>
        <rect x="299" y="65" width="6" height="9" />
        <rect x="317" y="65" width="6" height="9" />
        <rect x="335" y="65" width="6" height="9" />
      </g>
      <path className="cp-dome cp-dome-in" style={cssVars({ fill: 'var(--cp-dome)' })} d="M288 60A32 31 0 0 1 352 60Z" />
      <path className="cp-line cp-draw" pathLength={1} d="M320 29V17" />
      <circle className="cp-clock cp-clock-in" cx="320" cy="104" r="15" />
      <path className="cp-hand cp-hand-h" d="M320 104V96" style={cssVars({ '--a': `${hourAngle}deg` })} />
      <path className="cp-hand cp-hand-m" d="M320 104V91" style={cssVars({ '--a': `${minuteAngle}deg` })} />
      <circle className="cp-pin" cx="320" cy="104" r="1.6" />
    </g>
  </svg>
);

/* Roll numbers resolve digit by digit, left to right, the first time they scroll into view. */
const DecodeText: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 900);
        const settled = Math.floor(progress * value.length);
        setText(value.split('').map((c, i) => (i < settled ? c : String(Math.floor(Math.random() * 10)))).join(''));
        if (progress < 1) raf = requestAnimationFrame(tick);
        else setText(value);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        run();
      }
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  );
};

/* The clock on the tower shows the viewer's actual time. */
const useClockAngles = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return { hourAngle: ((now.getHours() % 12) * 60 + now.getMinutes()) * 0.5, minuteAngle: now.getMinutes() * 6 };
};

export const CreditsScreen: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const { hourAngle, minuteAngle } = useClockAngles();

  /* Anything below the fold reveals the first time it scrolls into view. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>('.credits-reveal, .credits-observe'));
    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.setAttribute('data-in', ''));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-in', '');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const onPlateMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--px', String(((e.clientX - r.left) / r.width - 0.5) * 2));
    e.currentTarget.style.setProperty('--py', String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onPlateLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty('--px', '0');
    e.currentTarget.style.setProperty('--py', '0');
  };

  return (
    <section
      ref={rootRef}
      className="mx-auto my-2 w-full max-w-5xl border border-slate-300 bg-white p-5 shadow-sm sm:p-8 lg:p-10"
      aria-labelledby="credits-heading"
    >
      <header className="grid gap-7 lg:grid-cols-12 lg:gap-x-10">
        <div className="flex flex-col justify-between gap-7 lg:col-span-5">
          <div className="flex items-center gap-3">
            <span className="credits-grow h-px w-8 bg-[var(--app-structural-accent)] dark:bg-[var(--app-action-accent)]" aria-hidden="true" />
            <span className="credits-rise text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--app-structural-accent)] dark:text-[var(--app-action-accent)]" style={cssVars({ '--credits-delay': '200ms' })}>
              Credits
            </span>
          </div>
          <h1 id="credits-heading" className="credits-serif text-[2.1rem] font-medium leading-[1.08] tracking-tight text-[var(--app-primary-text)] sm:text-5xl lg:text-[2.5rem]">
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-[0.1em]">
              <span className="credits-line" style={cssVars({ '--i': 0 })}>Built by Students,</span>
            </span>
            <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em] pr-[0.1em]">
              <span className="credits-line italic text-[var(--app-action-accent-strong)]" style={cssVars({ '--i': 1 })}>for Students.</span>
            </span>
          </h1>
        </div>

        <figure className="credits-rise min-w-0 lg:col-span-7" style={cssVars({ '--credits-delay': '90ms' })}>
          <div
            className="credits-plate aspect-[5/4] overflow-hidden rounded-lg border border-[var(--app-divider)] md:aspect-[2/1]"
            onPointerMove={onPlateMove}
            onPointerLeave={onPlateLeave}
          >
            <MainBuilding hourAngle={hourAngle} minuteAngle={minuteAngle} />
          </div>
          <figcaption className="mt-2.5 text-[11px] leading-snug text-[var(--app-muted-text)]">
            Main Building · College of Engineering, Guindy · Anna University
          </figcaption>
        </figure>
      </header>

      <section className="mt-9 sm:mt-12" aria-labelledby="credits-creators-heading">
        <h2 id="credits-creators-heading" className="sr-only">Creators</h2>
        <ol className="grid gap-x-10 gap-y-2 md:grid-cols-2">
          {creators.map(({ name, role, branch, rollNo, links }, index) => (
            <li
              key={name}
              className="credits-reveal relative min-w-0 pb-4 pt-5"
              style={cssVars({ '--credits-delay': `${index * 140}ms` })}
            >
              <span className="credits-rule absolute inset-x-0 -top-px h-px bg-[var(--app-divider)]" aria-hidden="true" />
              <span className="credits-tick absolute -top-px left-0 h-0.5 bg-[var(--app-action-accent-strong)]" aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--app-structural-accent)] dark:text-[var(--app-action-accent)]">{role}</p>
              <h3 className="credits-serif mt-1.5 text-2xl font-medium leading-tight tracking-tight text-[var(--app-primary-text)] sm:text-[1.75rem]">{name}</h3>

              <dl className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--app-muted-text)]">Branch</dt>
                  <dd className="mt-1 text-sm font-semibold text-[var(--app-primary-text)]">{branch}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--app-muted-text)]">Roll No.</dt>
                  <dd className="mt-1 text-sm font-semibold tabular-nums text-[var(--app-primary-text)]"><DecodeText value={rollNo} /></dd>
                </div>
              </dl>

              <ul className="mt-3 flex flex-wrap gap-x-6" aria-label={`${name} on social media`}>
                {links.map(({ label, href }) => {
                  const Icon = linkIcons[label];
                  return (
                    <li key={label}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name} on ${label} (opens in a new tab)`}
                        className="credits-link group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--app-primary-text)] transition-colors duration-150 hover:text-[var(--app-action-accent-strong)]"
                      >
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" aria-hidden="true" />
                        <span className="credits-link-label">{label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <footer className="credits-observe mt-9 sm:mt-12">
        <span className="credits-rule mb-4 block h-px w-8 bg-[var(--app-action-accent-strong)]" aria-hidden="true" />
        <p className="credits-serif text-xl font-medium italic leading-snug text-[var(--app-primary-text)] sm:text-2xl">
          <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]">
            <span className="credits-line-r" style={cssVars({ '--i': 0 })}>Calculating Today</span>
          </span>
          <span className="-mb-[0.12em] block overflow-hidden pb-[0.12em] pr-[0.1em]">
            <span className="credits-line-r" style={cssVars({ '--i': 1 })}>for a Brighter Tomorrow.</span>
          </span>
        </p>
      </footer>
    </section>
  );
};

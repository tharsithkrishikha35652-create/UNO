import React from 'react';
import { Code2, Instagram, Linkedin, PanelsTopLeft, ExternalLink, Braces, Palette, Grid3X3 } from 'lucide-react';

const developers = [
  {
    name: 'Tharsith R',
    role: 'App Developer',
    RoleIcon: Code2,
    department: 'CSE â€“ N Batch',
    registration: '2026103054',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tharsith-r-b0702a372', Icon: Linkedin },
    ],
  },
  {
    name: 'Raghu Nandan S',
    role: 'UI/UX Designer',
    RoleIcon: PanelsTopLeft,
    department: 'EE â€“ VLSI',
    registration: '2026123013',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/the.creato.lab?vrfl=MXhxYWNlcG05bjI3eg==', Icon: Instagram },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/raghu-nandan-sudhakar-15b85b381', Icon: Linkedin },
    ],
  },
] as const;

const warmPalette = ['#F7F5F0', '#FFFFFF', '#3B4D66', '#D97757', '#5B8C5A'];

export const CreditsScreen: React.FC = () => (
  <section className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7" aria-label="Credits">
    <div className="mb-5 border-b border-[#E4DDD2] pb-4 sm:mb-7 sm:pb-5">
      <div className="mb-2 flex items-center gap-3">
        <span className="h-px w-8 bg-[#3B4D66]" aria-hidden="true" />
        <span className="text-[10px] font-extrabold text-[#B95F43]">Credits</span>
      </div>
      <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#2C2C30] sm:text-3xl">People behind CalCredit.</h1>
      <p className="mt-1.5 text-sm text-[#6E6E73]">Designed and developed with care.</p>
    </div>

    <section className="grid min-w-0 gap-4 md:grid-cols-2 md:gap-5" aria-label="Developer profiles">
      {developers.map(({ name, role, RoleIcon, department, registration, links }, index) => {
        const isDeveloper = index === 0;
        return (
          <article
            key={name}
            className={isDeveloper
              ? 'relative min-w-0 overflow-hidden rounded-2xl border border-[#35353B] bg-[#202024] p-4 text-[#F1F1F3] shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg sm:p-5'
              : 'relative min-w-0 overflow-hidden rounded-2xl border border-[#E4DDD2] border-l-4 border-l-[#D97757] bg-white p-4 text-[#2C2C30] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5'}
          >
            <div className={isDeveloper
              ? 'mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#4A4A50] bg-[#26364B] px-3 py-2'
              : 'mb-4 flex items-center justify-between gap-3 rounded-lg border border-[#E9C7B9] bg-[#F3E5DB] px-3 py-2'}>
              <span className={isDeveloper ? 'text-[9px] font-extrabold text-[#D8E4ED]' : 'text-[9px] font-extrabold text-[#B95F43]'}>
                {isDeveloper ? 'Engineering / Build' : 'Design Studio / Interface'}
              </span>
              <span className={isDeveloper ? 'text-[9px] font-bold tabular-nums text-[#B8B8BE]' : 'text-[9px] font-bold tabular-nums text-[#B95F43]'}>
                {isDeveloper ? '01 / Logic' : '02 / Canvas'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-extrabold">
              <RoleIcon className={isDeveloper ? 'h-4 w-4 text-[#93C5FD]' : 'h-4 w-4 text-[#D97757]'} aria-hidden="true" />
              <span className={isDeveloper ? 'text-[#93C5FD]' : 'text-[#B95F43]'}>{role}</span>
            </div>
            <h2 className={isDeveloper ? 'mt-1 text-xl font-extrabold tracking-tight text-[#F1F1F3] sm:text-2xl' : 'mt-1 text-xl font-extrabold tracking-tight text-[#2C2C30] sm:text-2xl'}>{name}</h2>
            <p className={isDeveloper ? 'mt-1 text-xs text-[#B8B8BE]' : 'mt-1 text-xs text-[#6E6E73]'}>{isDeveloper ? 'Logic Â· Data Â· Reliability' : 'Hierarchy Â· Flow Â· Detail'}</p>

            {isDeveloper ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#4A4A50] bg-[#17171B]" aria-label="Developer code and build specialty">
                <div className="flex items-center justify-between border-b border-[#35353B] px-3 py-2">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 rounded-full bg-[#D97757]" />
                    <span className="h-2 w-2 rounded-full bg-[#D9A15B]" />
                    <span className="h-2 w-2 rounded-full bg-[#5B8C5A]" />
                  </div>
                  <span className="text-[9px] font-semibold text-[#B8B8BE]">calculateMarks.ts</span>
                  <Braces className="h-3.5 w-3.5 text-[#93C5FD]" aria-hidden="true" />
                </div>
                <pre className="overflow-hidden px-3 py-3 text-[10px] leading-relaxed text-[#D8E4ED]"><code><span className="text-[#93C5FD]">const</span> result = <span className="text-[#E08564]">calculateMarks</span>(subject);<br /><span className="text-[#5B8C5A]">// weighted marks â†’ grade â†’ grade point</span><br /><span className="text-[#93C5FD]">return</span> result;</code></pre>
              </div>
            ) : (
              <div className="mt-4 overflow-hidden rounded-xl border border-[#E4DDD2] bg-[#FCFAF6] p-3" aria-label="Designer canvas and visual-system specialty">
                <div className="relative grid h-20 grid-cols-6 gap-0 overflow-hidden rounded-lg border border-[#DDD5C9] bg-white" style={{ backgroundImage: 'linear-gradient(#E4DDD2 1px, transparent 1px), linear-gradient(90deg, #E4DDD2 1px, transparent 1px)', backgroundSize: '22px 18px' }}>
                  <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 rounded-lg border border-[#D97757] bg-[#F3E5DB] px-3 py-2 text-center shadow-sm">
                    <span className="block text-[9px] font-extrabold text-[#B95F43]">CA Marks UI</span>
                    <span className="mt-0.5 block text-[8px] font-medium text-[#6E6E73]">Type Â· Spacing Â· State</span>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-[#6E6E73]"><Palette className="h-3.5 w-3.5" aria-hidden="true" /> Palette / foundations</span>
                  <Grid3X3 className="h-3.5 w-3.5 text-[#B95F43]" aria-hidden="true" />
                </div>
                <div className="mt-2 flex items-center gap-2" aria-label="Warm Scholar color palette">
                  {warmPalette.map((color) => <span key={color} title={color} className="h-5 flex-1 rounded-md border border-[#DDD5C9]" style={{ backgroundColor: color }} />)}
                </div>
                <p className="mt-2 text-[10px] font-semibold text-[#6E6E73]">Hierarchy Â· Flow Â· Detail</p>
              </div>
            )}

            <dl className={isDeveloper ? 'mt-4 grid grid-cols-2 gap-3 border-t border-[#4A4A50] pt-3' : 'mt-4 grid grid-cols-2 gap-3 border-t border-[#E4DDD2] pt-3'}>
              <div className="min-w-0">
                <dt className={isDeveloper ? 'text-[9px] font-bold text-[#B8B8BE]' : 'text-[9px] font-bold text-[#6E6E73]'}>Department</dt>
                <dd className={isDeveloper ? 'mt-1 break-words text-xs font-semibold text-[#F1F1F3]' : 'mt-1 break-words text-xs font-semibold text-[#2C2C30]'}>{department}</dd>
              </div>
              <div className="min-w-0">
                <dt className={isDeveloper ? 'text-[9px] font-bold text-[#B8B8BE]' : 'text-[9px] font-bold text-[#6E6E73]'}>Registration No.</dt>
                <dd className={isDeveloper ? 'mt-1 break-words text-xs font-semibold tabular-nums text-[#F1F1F3]' : 'mt-1 break-words text-xs font-semibold tabular-nums text-[#2C2C30]'}>{registration}</dd>
              </div>
            </dl>

            <nav aria-label={`${name} social profiles`} className={isDeveloper ? 'mt-4 flex items-center gap-2 border-t border-[#4A4A50] pt-3' : 'mt-4 flex items-center gap-2 border-t border-[#E4DDD2] pt-3'}>
              {links.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${name} on ${label} (opens in a new tab)`}
                  title={label}
                  className={isDeveloper
                    ? 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#4A4A50] bg-[#29292E] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#35353B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E08564]'
                    : 'inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E4DDD2] bg-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#FCFAF6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B4D66]'}
                >
                  <Icon className={`h-4 w-4 ${label === 'LinkedIn' ? 'text-[#0A66C2]' : 'text-[#E4405F]'}`} aria-hidden="true" />
                </a>
              ))}
              <span className={isDeveloper ? 'ml-1 text-[10px] text-[#B8B8BE]' : 'ml-1 text-[10px] text-[#6E6E73]'}>
                {isDeveloper ? 'Connect on LinkedIn' : 'Explore social profiles'}
              </span>
              <ExternalLink className={isDeveloper ? 'ml-auto h-3.5 w-3.5 text-[#B8B8BE]' : 'ml-auto h-3.5 w-3.5 text-[#6E6E73]'} aria-hidden="true" />
            </nav>
          </article>
        );
      })}
    </section>

    <footer className="mt-5 border-t border-[#E4DDD2] pt-4 text-center text-xs text-[#6E6E73] sm:mt-7">
      Designed and developed with care.
    </footer>
  </section>
);
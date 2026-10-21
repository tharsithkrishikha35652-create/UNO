import React from 'react';
import { Code2, Instagram, Linkedin, PanelsTopLeft } from 'lucide-react';

const developers = [
  {
    name: 'Tharsith R',
    role: 'App Developer',
    RoleIcon: Code2,
    department: 'CSE – N Batch',
    registration: '2026103054',
    links: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/tharsith-r-b0702a372',
        Icon: Linkedin,
      },
    ],
  },
  {
    name: 'Raghu Nandan S',
    role: 'UI/UX Designer',
    RoleIcon: PanelsTopLeft,
    department: 'EE – VLSI',
    registration: '2026123013',
    links: [
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/the.creato.lab?vrfl=MXhxYWNlcG05bjI3eg==',
        Icon: Instagram,
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/raghu-nandan-sudhakar-15b85b381',
        Icon: Linkedin,
      },
    ],
  },
] as const;

export const CreditsScreen: React.FC = () => (
  <section className="mx-auto w-full max-w-4xl px-5 py-4 sm:px-8 sm:py-6" aria-label="Credits">
    <div className="mb-3 flex items-center gap-3 sm:mb-4">
      <span className="h-px w-8 bg-[#172554]" aria-hidden="true" />
      <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#172554]">Credits</span>
    </div>

    <section className="grid md:grid-cols-2" aria-label="Developer profiles">
      {developers.map(({ name, role, RoleIcon, department, registration, links }, index) => (
        <article
          key={name}
          className={`credits-profile-reveal ${index === 1 ? 'credits-profile-reveal-delay' : ''} min-w-0 border-b border-slate-200 border-l-2 border-l-[#172554] py-3 pl-3 last:border-b-0 md:border-b-0 md:py-4 md:first:pr-8 md:last:border-l md:last:border-l-[#172554] md:last:pl-8`}
        >
          <div className="min-w-0">
              <h2 className="break-words text-lg font-semibold leading-snug tracking-[-0.02em] text-[#172554] sm:text-xl">{name}</h2>
              <p className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <RoleIcon className="h-3.5 w-3.5 shrink-0 text-[#1e3a8a]" aria-hidden="true" />
                {role}
              </p>
          </div>

          <dl className="mt-2 grid grid-cols-2 gap-x-3 text-xs">
            <div className="min-w-0">
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-slate-500">Department</dt>
              <dd className="mt-0.5 break-words font-medium leading-4 text-slate-700">{department}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-slate-500">Registration No.</dt>
              <dd className="mt-0.5 break-words font-medium leading-4 tabular-nums text-slate-700">{registration}</dd>
            </div>
          </dl>

          <nav aria-label={`${name} social profiles`} className="mt-1.5 flex items-center gap-1">
            {links.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name} on ${label} (opens in a new tab)`}
                title={label}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors duration-200 ease-out hover:scale-110 hover:bg-slate-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554]"
              >
                <Icon
                  className={`h-4 w-4 ${label === 'LinkedIn' ? 'text-[#0A66C2]' : 'text-[#E4405F]'}`}
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>
        </article>
      ))}
    </section>

    <footer className="mt-4 text-center text-xs text-slate-600 sm:mt-5">
      Designed and developed with care.
    </footer>
  </section>
);

import React from 'react';
import { MessageSquare } from 'lucide-react';

interface FeedbackHubProps {
  user: unknown;
  guestMode: boolean;
}

export const FeedbackHub: React.FC<FeedbackHubProps> = () => (
  <section className="mx-auto w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-7" aria-label="Feedback Hub">
    <div className="mb-5 border-b border-[#E4DDD2] pb-4 sm:mb-7 sm:pb-5">
      <div className="mb-2 flex items-center gap-3">
        <span className="h-px w-8 bg-[#3B4D66]" aria-hidden="true" />
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#B95F43]">Your voice</span>
      </div>
      <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#2C2C30] sm:text-3xl">Feedback Hub</h1>
      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[#6E6E73]">Help us improve CALCREDIT. This space is reserved for feedback and suggestions.</p>
    </div>

    <div className="flex flex-col items-center rounded-2xl border border-[#E4DDD2] bg-white px-5 py-10 text-center shadow-sm sm:px-8">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E9C7B9] bg-[#F3E5DB] text-[#B95F43]">
        <MessageSquare className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-extrabold text-[#2C2C30] sm:text-xl">Feedback submissions are coming soon</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-[#6E6E73]">No feedback is submitted or sent anywhere yet. We will connect the form and its delivery destination in a future update.</p>
      <button type="button" disabled className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg border border-[#E4DDD2] bg-[#EFEAE1] px-5 py-2.5 text-xs font-extrabold uppercase tracking-wide text-[#6E6E73] disabled:cursor-not-allowed">
        Feedback form coming soon
      </button>
    </div>
    <p className="mt-4 text-center text-[11px] leading-relaxed text-[#6E6E73]">Placeholder only â€” no feedback data is collected from this screen.</p>
  </section>
);
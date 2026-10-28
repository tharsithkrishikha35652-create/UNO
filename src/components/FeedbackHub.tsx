import React, { useEffect, useState, type FormEvent } from 'react';
import { getIdTokenResult, type User } from 'firebase/auth';
import {
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import {
  DAILY_FEEDBACK_LIMIT,
  FEEDBACK_CATEGORIES,
  getNextIndiaMidnightMs,
  loadFeedbackInbox,
  loadTodayFeedbackCount,
  submitFeedback,
  type FeedbackCategory,
  type FeedbackRecord,
} from '../firebaseData';

interface FeedbackHubProps {
  user: User | null;
  guestMode: boolean;
}

function feedbackErrorMessage(error: unknown, action: 'submit' | 'load'): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  if (code === 'permission-denied') {
    return 'Firebase denied access. Verify that the current Firebase project has the latest Firestore rules published.';
  }
  if (code === 'unauthenticated') return 'Your sign-in has expired. Sign in again, then retry.';
  if (code === 'unavailable' || code === 'network-request-failed') {
    return 'A network error interrupted the request. Check your connection and retry.';
  }
  return code
    ? `Firebase could not ${action === 'submit' ? 'save feedback' : 'load the inbox'} (${code}). Check the Firebase configuration and Firestore rules.`
    : `Firebase could not ${action === 'submit' ? 'save feedback' : 'load the inbox'}. Check the Firebase configuration and Firestore rules.`;
}

export const FeedbackHub: React.FC<FeedbackHubProps> = ({ user, guestMode }) => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('General');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [dailyCount, setDailyCount] = useState<number | null>(user ? null : 0);
  const [dailyCountError, setDailyCountError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [dailyRefreshToken, setDailyRefreshToken] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    if (!user) {
      setDailyCount(0);
      setDailyCountError('');
      return;
    }
    let cancelled = false;
    setDailyCount(null);
    setDailyCountError('');
    void loadTodayFeedbackCount(user.uid)
      .then((count) => {
        if (!cancelled) setDailyCount(count);
      })
      .catch((error: unknown) => {
        console.error('Unable to load daily feedback count:', error);
        if (!cancelled) {
          setDailyCountError(feedbackErrorMessage(error, 'load'));
          setDailyCount(null);
        }
      });
    return () => { cancelled = true; };
  }, [user?.uid, dailyRefreshToken]);

  useEffect(() => {
    if (!user) return;
    const resetAt = getNextIndiaMidnightMs();
    const refreshAfterReset = () => {
      if (Date.now() >= resetAt) setDailyRefreshToken((value) => value + 1);
    };
    const timer = window.setTimeout(refreshAfterReset, Math.max(0, resetAt - Date.now() + 100));
    document.addEventListener('visibilitychange', refreshAfterReset);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', refreshAfterReset);
    };
  }, [user?.uid, dailyRefreshToken]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = window.setTimeout(() => setSuccessMessage(''), 4500);
    return () => window.clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false);
    if (!user) return;
    void getIdTokenResult(user)
      .then(({ claims }) => {
        const firebaseClaims = claims.firebase as { sign_in_provider?: unknown } | undefined;
        const allowed = user.email === 'projectunocc@gmail.com' &&
          claims.email_verified === true &&
          firebaseClaims?.sign_in_provider === 'google.com';
        if (!cancelled) setIsAdmin(allowed);
      })
      .catch((error: unknown) => {
        console.error('Unable to verify feedback admin access:', error);
        if (!cancelled) setIsAdmin(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    if (!isAdmin) {
      setFeedback([]);
      setInboxLoading(false);
      setInboxError('');
      return;
    }
    let cancelled = false;
    setInboxLoading(true);
    setInboxError('');
    void loadFeedbackInbox()
      .then((records) => {
        if (!cancelled) setFeedback(records);
      })
      .catch((error: unknown) => {
        console.error('Unable to load feedback inbox:', error);
        if (!cancelled) setInboxError(feedbackErrorMessage(error, 'load'));
      })
      .finally(() => {
        if (!cancelled) setInboxLoading(false);
      });
    return () => { cancelled = true; };
  }, [isAdmin, refreshToken]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.email || submitting || dailyCount === null || dailyCount >= DAILY_FEEDBACK_LIMIT) return;
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setSubmitError('Enter feedback before submitting.');
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    setSuccessMessage('');
    try {
      const nextCount = await submitFeedback({ uid: user.uid, email: user.email }, trimmedMessage, category);
      setMessage('');
      setCategory('General');
      setDailyCount(nextCount);
      setDailyCountError('');
      setSuccessMessage('Feedback submitted successfully. Thank you for helping improve the app.');
      if (isAdmin) setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error('Unable to submit feedback:', error);
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
      if (code === 'feedback/daily-limit-exceeded') {
        setDailyCount(DAILY_FEEDBACK_LIMIT);
        setSubmitError('You have reached today’s feedback limit. Please try again tomorrow.');
      } else {
        setSubmitError(feedbackErrorMessage(error, 'submit'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const palette = {
    border: 'border-slate-300',
    heading: 'text-[#172554]',
    accent: 'bg-[#172554]',
    focus: 'focus:border-[#172554] focus:outline-2 focus:outline-[#172554]',
  };

  return (
    <section className="mx-auto my-6 w-full max-w-3xl border border-slate-300 bg-white shadow-sm" aria-labelledby="feedback-hub-heading">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center ${palette.accent} text-white`}>
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h1 id="feedback-hub-heading" className={`text-xl font-black ${palette.heading}`}>Feedback Hub</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-600">Share a suggestion or report a problem to help improve CALCREDIT.</p>
          </div>
        </div>
      </header>

      <div className="space-y-7 px-5 py-5 sm:px-7 sm:py-6">
        {successMessage && (
          <div className="flex items-start gap-3 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950" role="status" aria-live="polite">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>{successMessage}</span>
            <button type="button" onClick={() => setSuccessMessage('')} className="ml-auto shrink-0 font-bold underline underline-offset-2">Dismiss</button>
          </div>
        )}

        {user?.email ? (
          dailyCount !== null && dailyCount >= DAILY_FEEDBACK_LIMIT ? (
            <div className="flex min-h-56 flex-col items-center justify-center border border-emerald-200 bg-emerald-50 px-5 py-10 text-center" role="status" aria-live="polite">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-10 w-10" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-lg font-black text-emerald-950">You’ve reached today’s feedback limit</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-900">Thank you for helping improve the app. You can submit up to {DAILY_FEEDBACK_LIMIT} items each day.</p>
            </div>
          ) : (
            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4" noValidate>
              <p className="text-xs font-semibold text-slate-600" role="status">
                {dailyCount === null ? 'Preparing the feedback form…' : `We appreciate your feedback. ${DAILY_FEEDBACK_LIMIT - dailyCount} submission${DAILY_FEEDBACK_LIMIT - dailyCount === 1 ? '' : 's'} remaining today.`}
              </p>
              {dailyCountError && (
                <p className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{dailyCountError}
                  <button type="button" onClick={() => setDailyRefreshToken((value) => value + 1)} className="ml-auto shrink-0 font-bold underline">Retry</button>
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                <label className="block">
                  <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${palette.heading}`}>Category</span>
                  <select value={category} onChange={(event) => setCategory(event.currentTarget.value as FeedbackCategory)} className={`min-h-11 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 ${palette.focus}`}>
                    {FEEDBACK_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <div>
                  <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${palette.heading}`}>Submitting as</span>
                  <p className="flex min-h-11 items-center break-all border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{user.email}</p>
                </div>
              </div>
              <label className="block">
                <span className={`mb-1.5 block text-xs font-bold uppercase tracking-wide ${palette.heading}`}>Your feedback</span>
                <textarea required rows={5} maxLength={2000} value={message} onChange={(event) => { setMessage(event.currentTarget.value); setSubmitError(''); }} aria-describedby="feedback-message-count" placeholder="Tell us what happened or what would make the app better…" className={`w-full resize-y border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-500 ${palette.focus}`} />
                <span id="feedback-message-count" className="mt-1 block text-right text-xs tabular-nums text-slate-500">{message.length}/2000</span>
              </label>
              {submitError && <p className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{submitError}</p>}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button type="submit" disabled={submitting || !message.trim() || dailyCount === null || Boolean(dailyCountError)} className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-wait disabled:opacity-60 ${palette.accent}`}>
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                  {submitting ? 'Submitting…' : 'Submit feedback'}
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="flex items-start gap-3 border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950" role="status">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>{guestMode ? 'Sign in to submit feedback. Guest sessions are not stored with an account.' : 'Sign in with an account that has an email address to submit feedback.'}</p>
          </div>
        )}

        {isAdmin && (
          <section className="border-t border-slate-200 pt-6" aria-labelledby="feedback-inbox-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className={`h-5 w-5 ${palette.heading}`} aria-hidden="true" />
                <h2 id="feedback-inbox-heading" className={`text-lg font-black ${palette.heading}`}>All submitted feedback</h2>
              </div>
              <button type="button" onClick={() => setRefreshToken((value) => value + 1)} disabled={inboxLoading} className="inline-flex min-h-10 items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554] disabled:opacity-60">
                <RefreshCw className={`h-4 w-4 ${inboxLoading ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh
              </button>
            </div>
            {inboxLoading ? (
              <p className="mt-4 flex items-center gap-2 py-5 text-sm font-semibold text-slate-600" role="status"><LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Loading feedback…</p>
            ) : inboxError ? (
              <p className="mt-4 flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{inboxError}</p>
            ) : feedback.length === 0 ? (
              <p className="mt-4 border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No feedback has been submitted yet.</p>
            ) : (
              <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                {feedback.map((record) => (
                  <li key={record.id} className="py-4 first:pt-4 last:pb-4">
                    <p className={`break-all text-sm font-bold ${palette.heading}`}>{record.senderEmail}</p>
                    <p className="mt-1 text-xs text-slate-600">{record.category} · {record.createdAt ? record.createdAt.toDate().toLocaleString() : 'Time unavailable'}</p>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{record.message}</p>
                  </li>
                ))}
              </ol>
            )}
          </section>
        )}
      </div>
    </section>
  );
};

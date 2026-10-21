import React, { useEffect, useState, type FormEvent } from 'react';
import { getIdTokenResult, type User } from 'firebase/auth';
import { AlertCircle, CheckCircle2, LoaderCircle, MessageSquare, RefreshCw, Send, ShieldCheck } from 'lucide-react';
import {
  DAILY_FEEDBACK_LIMIT,
  FEEDBACK_CATEGORIES,
  getNextIndiaMidnightMs,
  loadTodayFeedbackCount,
  loadFeedbackInbox,
  submitFeedback,
  type FeedbackCategory,
  type FeedbackRecord,
} from '../firebaseData';

interface FeedbackHubProps {
  user: User | null;
  guestMode: boolean;
}

function getFeedbackErrorMessage(error: unknown, action: 'submit' | 'load'): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';

  if (code === 'permission-denied') {
    return 'Firebase denied access (permission-denied). Publish the updated Firestore rules to the Firebase project used by this app, then retry.';
  }
  if (code === 'unauthenticated') {
    return 'Your sign-in has expired. Sign in again, then retry.';
  }
  if (code === 'unavailable' || code === 'network-request-failed') {
    return `A network error interrupted the request. Check your connection and retry${action === 'submit' ? ' submission' : ' loading the inbox'}.`;
  }
  if (code) {
    return `Firebase could not ${action === 'submit' ? 'save this feedback' : 'load the inbox'} (${code}). Check the Firebase configuration and Firestore rules, then retry.`;
  }
  return `Firebase could not ${action === 'submit' ? 'save this feedback' : 'load the inbox'}. Check the Firebase configuration and Firestore rules, then retry.`;
}

export const FeedbackHub: React.FC<FeedbackHubProps> = ({ user, guestMode }) => {
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState<FeedbackCategory>('General');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [dailyCount, setDailyCount] = useState<number | null>(user ? null : 0);
  const [dailyCountError, setDailyCountError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [dailyRefreshToken, setDailyRefreshToken] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [inboxLoading, setInboxLoading] = useState(isAdmin);
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
          setDailyCountError(getFeedbackErrorMessage(error, 'load'));
          setDailyCount(null);
        }
      });

    return () => {
      cancelled = true;
    };
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
    if (!successToast) return;
    const timer = window.setTimeout(() => setSuccessToast(''), 4500);
    return () => window.clearTimeout(timer);
  }, [successToast]);

  useEffect(() => {
    let cancelled = false;
    setIsAdmin(false);
    if (!user) return;

    void getIdTokenResult(user)
      .then(({ claims }) => {
        const firebaseClaims = claims.firebase as { sign_in_provider?: unknown } | undefined;
        const hasAdminAccess = user.email === 'projectunocc@gmail.com' &&
          claims.email_verified === true &&
          firebaseClaims?.sign_in_provider === 'google.com';
        if (!cancelled) setIsAdmin(hasAdminAccess);
      })
      .catch((error: unknown) => {
        console.error('Unable to verify feedback admin access:', error);
        if (!cancelled) setIsAdmin(false);
      });

    return () => {
      cancelled = true;
    };
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
        if (!cancelled) setInboxError(getFeedbackErrorMessage(error, 'load'));
      })
      .finally(() => {
        if (!cancelled) setInboxLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, refreshToken]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !user.email || submitting || dailyCount === null || dailyCount >= DAILY_FEEDBACK_LIMIT) return;

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setSubmitError('Enter feedback before submitting.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSuccessToast('');
    try {
      const nextCount = await submitFeedback({ uid: user.uid, email: user.email }, trimmedMessage, category);
      setMessage('');
      setCategory('General');
      setDailyCount(nextCount);
      setDailyCountError('');
      if (nextCount < DAILY_FEEDBACK_LIMIT) {
        setSuccessToast('Feedback submitted successfully. Thank you for helping improve the app.');
      }
      if (isAdmin) setRefreshToken((value) => value + 1);
    } catch (error) {
      console.error('Unable to submit feedback:', error);
      const code = typeof error === 'object' && error !== null && 'code' in error
        ? String(error.code)
        : '';
      if (code === 'feedback/daily-limit-exceeded') {
        setDailyCount(DAILY_FEEDBACK_LIMIT);
        setSubmitError('Feedback cannot be submitted right now. Please try again later.');
      } else {
        setSubmitError(getFeedbackErrorMessage(error, 'submit'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto my-6 max-w-3xl border border-slate-300 bg-white shadow-sm" aria-labelledby="feedback-hub-heading">
      <header className="border-b border-slate-200 px-5 py-5 sm:px-7">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center bg-[#172554] text-white">
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h1 id="feedback-hub-heading" className="text-xl font-black text-[#172554]">Feedback Hub</h1>
            <p className="mt-1 max-w-prose text-sm text-slate-600">Share a suggestion or report a problem to help improve CALCREDIT.</p>
          </div>
        </div>
      </header>

      <div className="space-y-7 px-5 py-5 sm:px-7 sm:py-6">
        {successToast && (
          <div className="fixed left-1/2 top-4 z-[90] flex w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 items-center gap-3 border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-lg" role="status" aria-live="polite">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
            <span>{successToast}</span>
            <button type="button" onClick={() => setSuccessToast('')} className="ml-auto shrink-0 font-bold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-emerald-800">Dismiss</button>
          </div>
        )}

        {user && user.email ? (
          dailyCount !== null && dailyCount >= DAILY_FEEDBACK_LIMIT ? (
            <div className="flex min-h-64 flex-col items-center justify-center border border-emerald-200 bg-emerald-50 px-5 py-10 text-center" role="status" aria-live="polite">
              <span className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-emerald-50 sm:h-28 sm:w-28">
                <CheckCircle2 className="h-16 w-16 sm:h-20 sm:w-20" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-xl font-black text-emerald-950">Feedback submitted successfully</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-emerald-900">Thank you for helping improve the app.</p>
            </div>
          ) : (
          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4" noValidate>
            <p className="text-xs font-semibold text-slate-600" role="status">
              {dailyCount === null ? 'Preparing the feedback form…' : 'We appreciate your feedback.'}
            </p>
            {dailyCountError && (
              <p className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{dailyCountError}
                <button type="button" onClick={() => setDailyRefreshToken((value) => value + 1)} className="ml-auto shrink-0 font-bold underline">Retry</button>
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Category</span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.currentTarget.value as FeedbackCategory)}
                  className="min-h-11 w-full border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
                >
                  {FEEDBACK_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <div>
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Submitting as</span>
                <p className="flex min-h-11 items-center break-all border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{user.email}</p>
              </div>
            </div>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Your feedback</span>
              <textarea
                required
                rows={5}
                maxLength={2000}
                value={message}
                onChange={(event) => {
                  setMessage(event.currentTarget.value);
                  setSubmitError('');
                }}
                aria-describedby="feedback-message-count"
                placeholder="Tell us what happened or what would make the app better…"
                className="w-full resize-y border border-slate-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-500 focus:border-[#172554] focus:outline-2 focus:outline-[#172554]"
              />
              <span id="feedback-message-count" className="mt-1 block text-right text-xs tabular-nums text-slate-500">{message.length}/2000</span>
            </label>

            {submitError && (
              <p className="flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{submitError}
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={submitting || !message.trim() || dailyCount === null || Boolean(dailyCountError)}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 bg-[#172554] px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#1e3a8a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-wait disabled:opacity-60"
              >
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
                <ShieldCheck className="h-5 w-5 text-[#172554]" aria-hidden="true" />
                <h2 id="feedback-inbox-heading" className="text-lg font-black text-[#172554]">All submitted feedback</h2>
              </div>
              <button
                type="button"
                onClick={() => setRefreshToken((value) => value + 1)}
                disabled={inboxLoading}
                className="inline-flex min-h-10 items-center gap-2 border border-slate-300 px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-[#172554] disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${inboxLoading ? 'animate-spin' : ''}`} aria-hidden="true" />Refresh
              </button>
            </div>

            {inboxLoading ? (
              <p className="mt-4 flex items-center gap-2 py-5 text-sm font-semibold text-slate-600" role="status">
                <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />Loading feedback…
              </p>
            ) : inboxError ? (
              <p className="mt-4 flex items-start gap-2 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{inboxError}
              </p>
            ) : feedback.length === 0 ? (
              <p className="mt-4 border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No feedback has been submitted yet.</p>
            ) : (
              <ol className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                {feedback.map((record) => (
                  <li key={record.id} className="py-4 first:pt-4 last:pb-4">
                    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <div className="min-w-0">
                        <p className="break-all text-sm font-bold text-[#172554]">{record.senderEmail}</p>
                        <p className="mt-1 text-xs text-slate-600">
                          {record.category} · {record.createdAt ? record.createdAt.toDate().toLocaleString() : 'Time unavailable'}
                        </p>
                      </div>
                    </div>
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

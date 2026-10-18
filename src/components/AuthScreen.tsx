import React, { useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { AlertCircle, BookOpen, LoaderCircle, UserCheck } from 'lucide-react';
import { auth } from '../firebase';

interface AuthScreenProps {
  configurationError?: string;
  onGuestLogin?: () => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

function friendlyAuthError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Try logging in.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled. Enable it under Authentication in Firebase Console.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Check your connection and try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ configurationError, onGuestLogin }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth || configurationError) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await sendPasswordResetEmail(auth, email.trim());
        setNotice('Password reset email sent. Check your inbox.');
      }
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center px-4 py-10 font-sans transition-colors">
      <section className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 shadow-xl transition-all">
        {/* Brand Header */}
        <div className="bg-[#172554] dark:bg-slate-950 text-white px-6 py-5 flex items-center justify-between border-b border-blue-950 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-blue-600 text-[#172554] dark:text-white font-mono font-black text-sm shadow-xs">
              CC
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-200">Anna University</p>
              <h1 className="text-lg font-black tracking-tight">CALCREDIT</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-900 dark:bg-slate-800 text-blue-200 uppercase font-semibold">
            R2021/23
          </span>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-black text-[#172554] dark:text-blue-200">
            {mode === 'signup' ? 'Create student account' : mode === 'reset' ? 'Reset password' : 'Login'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'reset'
              ? 'We’ll email you a link to choose a new password.'
              : 'Calculate Continuous Assessment, ESE, and GPA.'}
          </p>

          {(configurationError || error) && (
            <div className="mt-4 flex items-start gap-2.5 border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-900 dark:text-rose-200" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{configurationError || error}</span>
            </div>
          )}
          {notice && (
            <p className="mt-4 border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs font-semibold text-emerald-900 dark:text-emerald-200" role="status">
              {notice}
            </p>
          )}

          {!configurationError && (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address / Roll No:
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm font-semibold focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 shadow-2xs"
                  placeholder="student@annauniv.edu"
                />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Password:
                  </label>
                  <input
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm font-semibold focus:outline-hidden focus:border-[#172554] dark:focus:border-blue-500 shadow-2xs"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !auth}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#172554] dark:bg-blue-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1e3a8a] dark:hover:bg-blue-500 disabled:opacity-60 disabled:cursor-wait transition-colors cursor-pointer shadow-xs"
              >
                {busy ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : <BookOpen className="w-4 h-4" aria-hidden="true" />}
                <span>{busy ? 'Please wait…' : mode === 'signup' ? 'OK · Create Account' : mode === 'reset' ? 'Send Reset Link' : 'OK · Login'}</span>
              </button>
            </form>
          )}

          {/* Guest Login Option */}
          {onGuestLogin && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={onGuestLogin}
                className="w-full inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[#172554] dark:text-blue-400" />
                <span>Continue as Guest</span>
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-col items-start gap-2 text-xs">
            {mode === 'login' && (
              <button type="button" onClick={() => selectMode('reset')} className="font-semibold text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer">
                Forgot password?
              </button>
            )}
            {mode === 'reset' ? (
              <button type="button" onClick={() => selectMode('login')} className="font-semibold text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer">
                Back to log in
              </button>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">
                {mode === 'signup' ? 'Already have an account?' : 'Need an account?'}{' '}
                <button
                  type="button"
                  onClick={() => selectMode(mode === 'signup' ? 'login' : 'signup')}
                  className="font-bold text-[#1e3a8a] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  {mode === 'signup' ? 'Log in' : 'Create account'}
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Institutional Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            ANNA UNIVERSITY · AFFILIATED CURRICULUM
          </p>
        </div>
      </section>
    </main>
  );
};

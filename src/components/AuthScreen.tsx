import React, { useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
} from 'firebase/auth';
import { AlertCircle, BookOpen, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { auth } from '../firebase';
import { ThemeToggle, type AppTheme } from './ThemeToggle';

interface AuthScreenProps {
  configurationError?: string;
  forceGoogleAccountSelection?: boolean;
  onContinueAsGuest: () => void;
  theme: AppTheme;
  onToggleTheme: () => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

function friendlyAuthError(error: unknown, provider: 'email' | 'google' = 'email'): string {
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
      return provider === 'google'
        ? 'Google sign-in is disabled. Enable Google under Authentication → Sign-in method in Firebase Console.'
        : 'Email/password sign-in is disabled. Enable it under Authentication → Sign-in method in Firebase Console.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method. Log in with that method first.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Firebase sign-in. Add it under Authentication → Settings → Authorized domains.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'Google sign-in needs a supported browser window. Open the web app in your browser and try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Check your connection and try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ configurationError, forceGoogleAccountSelection = false, onContinueAsGuest, theme, onToggleTheme }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [googleSlow, setGoogleSlow] = useState(false);
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

  const handleGoogleSignIn = async () => {
    if (!auth || configurationError || busy || googleBusy) return;
    setGoogleBusy(true);
    setGoogleSlow(false);
    setError('');
    setNotice('');
    const slowTimer = window.setTimeout(() => setGoogleSlow(true), 5000);
    try {
      const provider = new GoogleAuthProvider();
      if (forceGoogleAccountSelection) {
        provider.setCustomParameters({ prompt: 'select_account' });
      }
      await signInWithRedirect(auth, provider);
    } catch (authError) {
      const code = typeof authError === 'object' && authError !== null && 'code' in authError
        ? String(authError.code)
        : '';
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setError(friendlyAuthError(authError, 'google'));
      }
    } finally {
      window.clearTimeout(slowTimer);
      setGoogleBusy(false);
      setGoogleSlow(false);
    }
  };

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-900 flex items-center justify-center px-4 py-10 font-sans">
      <section className="w-full max-w-md bg-white border border-slate-300 shadow-sm">
        <div className="bg-[#172554] text-white px-5 py-5 flex items-center justify-between gap-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#172554]">
              <span className="text-base font-black tracking-[-0.12em]" aria-hidden="true">CC</span>
              <span className="absolute bottom-1.5 h-0.5 w-2 rounded-full bg-cyan-500" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.08em] text-blue-100">CalCredit</p>
              <h1 className="text-base font-black sm:text-lg">Academic Marks Calculator</h1>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} className="border-white/30 bg-white/10 text-white hover:bg-white/20" />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-black text-[#172554]">
            {mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Log in'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {mode === 'reset'
              ? 'We’ll email you a link to choose a new password.'
              : 'Sign in to securely access your saved courses and GPA.'}
          </p>

          {(configurationError || error) && (
            <div className="mt-5 flex items-start gap-2.5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{configurationError || error}</span>
            </div>
          )}
          {notice && (
            <p className="mt-5 border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900" role="status">
              {notice}
            </p>
          )}

          {!configurationError && (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wide text-[#172554] mb-1.5">Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#172554]"
                  placeholder="you@example.com"
                />
              </label>

              {mode !== 'reset' && (
                <div className="block">
                  <label htmlFor="auth-password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-[#172554]">Password</label>
                  <div className="relative">
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                      required
                      minLength={mode === 'signup' ? 6 : undefined}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full border border-slate-300 bg-white px-3 py-3 pr-11 text-sm focus:border-[#172554]"
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((visible) => !visible)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 hover:text-[#172554] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#172554]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={busy || !auth}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#172554] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-wait"
              >
                {busy ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : <BookOpen className="w-4 h-4" aria-hidden="true" />}
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Log in'}
              </button>
            </form>
          )}

          {!configurationError && mode !== 'reset' && (
            <div className="mt-5">
              <div className="flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">or</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>
              <button
                type="button"
                onClick={() => void handleGoogleSignIn()}
                disabled={busy || googleBusy || !auth}
                className="mt-4 w-full inline-flex items-center justify-center gap-3 border border-slate-300 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#172554] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#172554] disabled:cursor-wait disabled:opacity-60"
              >
                {googleBusy ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.1 5.1 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.27-4.75 3.27-8.09Z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84A11 11 0 0 0 12 23Z" />
                    <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.15a11 11 0 0 0 0 9.88l3.69-2.84Z" />
                    <path fill="#EA4335" d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.54 10.54 0 0 0 12 1a11 11 0 0 0-9.85 6.06L5.84 9.9C6.71 7.29 9.14 5.36 12 5.36Z" />
                  </svg>
                )}
                {googleBusy ? 'Redirecting to Google…' : 'Continue with Google'}
              </button>
              {googleSlow && (
                <p className="mt-2 text-center text-xs text-slate-500" role="status">
                  Google is taking longer than usual. Keep this page open while sign-in continues.
                </p>
              )}
            </div>
          )}

          <div className={`${configurationError ? 'mt-6' : 'mt-5'} flex flex-col items-start gap-3 text-sm`}>
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full border border-[#172554] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#172554] hover:bg-slate-50"
            >
              Continue as guest
            </button>
            <p className="text-xs text-slate-500">
              Guest work is temporary and will be cleared when you reload or close this page.
            </p>
            {!configurationError && mode === 'login' && (
              <button type="button" onClick={() => selectMode('reset')} className="font-semibold text-[#1e3a8a] hover:underline">
                Forgot password?
              </button>
            )}
            {!configurationError && mode === 'reset' ? (
              <button type="button" onClick={() => selectMode('login')} className="font-semibold text-[#1e3a8a] hover:underline">
                Back to log in
              </button>
            ) : !configurationError ? (
              <p className="text-slate-600">
                {mode === 'signup' ? 'Already have an account?' : 'New to Project UNO?'}{' '}
                <button
                  type="button"
                  onClick={() => selectMode(mode === 'signup' ? 'login' : 'signup')}
                  className="font-bold text-[#1e3a8a] hover:underline"
                >
                  {mode === 'signup' ? 'Log in' : 'Create account'}
                </button>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};

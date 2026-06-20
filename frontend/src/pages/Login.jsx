/**
 * Login Page — Auth gate for CarbonSense.
 * Supports Email/Password and Google OAuth sign-in.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase/auth';

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [mode,     setMode]     = useState('signin'); // 'signin' | 'signup'
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [name,     setName]     = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const clearError = () => setError('');

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, name || email.split('@')[0]);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError(getFriendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cs-bg flex items-center justify-center px-4"
      role="main"
      aria-label="CarbonSense login"
    >
      {/* Background grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <div className="w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-cs bg-cs-primary/10 border border-cs-primary/30 mb-4">
            <Zap size={24} className="text-cs-primary" aria-hidden="true" />
          </div>
          <h1 className="font-geist font-bold text-2xl text-cs-text">CarbonSense</h1>
          <p className="cs-label mt-1">Protocol V4.2 / LOC: EPSG:4326</p>
        </header>

        {/* Card */}
        <div className="cs-card">
          {/* Mode toggle */}
          <div className="flex mb-6 bg-cs-surface-high rounded-cs p-1" role="tablist" aria-label="Authentication mode">
            {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => { setMode(m); clearError(); }}
                className={`flex-1 py-2 text-sm font-mono rounded-cs transition-all duration-150 cursor-pointer
                  ${mode === m ? 'bg-cs-surface text-cs-text shadow-card' : 'text-cs-text-muted hover:text-cs-text'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 rounded-cs bg-red-900/20 border border-red-500/30 text-red-400 text-sm font-mono mb-4"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle size={14} aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleEmailAuth} noValidate className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="cs-label mb-1.5 block">Display Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-text-muted" aria-hidden="true" />
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Alpha_User"
                    className="cs-input pl-9"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="cs-label mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-text-muted" aria-hidden="true" />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="user@domain.com"
                  required
                  className="cs-input pl-9"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="cs-label mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cs-text-muted" aria-hidden="true" />
                <input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="cs-input pl-9"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cs-btn-primary w-full flex items-center justify-center gap-2 mt-2"
              aria-busy={loading}
            >
              {loading ? <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Processing…</> : mode === 'signup' ? 'Initialize Account' : 'Access Protocol'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4" aria-hidden="true">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="cs-label">or</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-cs border border-white/[0.08] bg-cs-surface-high text-sm font-mono text-cs-text hover:border-white/20 hover:bg-cs-surface-top transition-all duration-150 cursor-pointer"
            aria-label="Sign in with Google"
          >
            {GOOGLE_ICON}
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center mt-6">
          <p className="cs-label text-[10px]">
            © 2024 CarbonSense Protocol. Data precision: 99.9%
          </p>
        </footer>
      </div>
    </div>
  );
}

function getFriendlyError(code) {
  const map = {
    'auth/user-not-found':      'No account found with this email.',
    'auth/wrong-password':      'Incorrect password.',
    'auth/email-already-in-use':'Email already registered. Sign in instead.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/popup-closed-by-user':'Google sign-in was cancelled.',
    'auth/network-request-failed': 'Network error. Check your connection.',
  };
  return map[code] ?? 'Authentication failed. Please try again.';
}

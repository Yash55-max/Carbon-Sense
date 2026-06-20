/**
 * Landing Page — Introduction & Authentication Hub.
 * Sleek, futuristic tech styling with embedded login/register panel.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Mail, Lock, User, AlertCircle, Loader2, ArrowRight,
  Shield, BarChart3, Database, Globe, Layers, Cpu, Award
} from 'lucide-react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from '../firebase/auth';

const GOOGLE_ICON = (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.3z"/>
  </svg>
);

export default function Landing({ isLoggedIn = false }) {
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
      // Redirect flow handles navigation after callback, but we trigger the redirect here
    } catch (err) {
      setError(getFriendlyError(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cs-bg text-cs-text relative overflow-x-hidden flex flex-col font-inter">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        aria-hidden="true"
      />

      {/* Decorative top-right green glow */}
      <div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10B981, transparent)' }}
        aria-hidden="true"
      />

      {/* ─── Header Navigation ─────────────────────────────────────────────────── */}
      <header className="w-full border-b border-white/[0.05] bg-cs-bg/85 backdrop-blur-md sticky top-0 z-50 transition-all">
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-cs bg-cs-primary/10 border border-cs-primary/20 flex items-center justify-center">
              <Zap size={16} className="text-cs-primary" aria-hidden="true" />
            </div>
            <span className="font-geist font-bold text-xl text-cs-text tracking-tight">CarbonSense</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-cs-text-muted">
            <a href="#features" className="hover:text-cs-text transition-colors">FEATURES</a>
            <a href="#telemetry" className="hover:text-cs-text transition-colors">TELEMETRY</a>
            <a href="#infrastructure" className="hover:text-cs-text transition-colors">INFRASTRUCTURE</a>
          </nav>

          <div>
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="cs-btn-primary !py-1.5 !px-4 text-xs font-mono flex items-center gap-1.5"
              >
                Access Dashboard <ArrowRight size={13} />
              </button>
            ) : (
              <a
                href="#auth-panel"
                className="cs-btn-ghost !py-1.5 !px-4 text-xs font-mono"
              >
                ACCESS PROTOCOL
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ─── Hero Section ──────────────────────────────────────────────────────── */}
      <section className="relative max-w-screen-xl mx-auto px-6 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-1">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cs-primary/20 bg-cs-primary/5 text-xs font-mono text-cs-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-cs-primary animate-pulse" />
            PROTOCOL V4.2 LIVE
          </div>
          <h1 className="font-geist font-extrabold text-4xl sm:text-6xl text-cs-text leading-none tracking-tight">
            Precision Carbon <span className="text-cs-primary">Telemetry.</span>
          </h1>
          <p className="text-cs-text-muted text-sm sm:text-base max-w-xl leading-relaxed">
            Quantify, track, and mitigate your ecological footprint through our advanced telemetry pipeline. 
            Real-time transit computations, smart energy logs, and verified offset tracking integrated into a single high-fidelity console.
          </p>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] max-w-lg">
            {[
              { label: 'TELEMETRY PRECISION', value: '99.9%' },
              { label: 'CO₂e MITIGATED', value: '42.8 t' },
              { label: 'ACTIVE NODES', value: '1,420' }
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono font-bold text-lg sm:text-2xl text-cs-text">{value}</p>
                <p className="cs-label text-[9px] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth Box / Dashboard Access Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto" id="auth-panel">
          {isLoggedIn ? (
            <div className="cs-card text-center space-y-6 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-cs-primary/10 border border-cs-primary/20 flex items-center justify-center mx-auto">
                <Award size={28} className="text-cs-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-geist font-bold text-xl text-cs-text">Terminal Connected</h3>
                <p className="text-xs text-cs-text-muted max-w-xs mx-auto">
                  Your node session is currently active. Access your control panel to log activities and analyze telemetry.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="cs-btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                Enter Control Panel <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            <div className="cs-card animate-slide-up relative">
              {/* Mode Toggle */}
              <div className="flex mb-6 bg-cs-surface-high rounded-cs p-1" role="tablist" aria-label="Authentication mode">
                {[['signin', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => { setMode(m); clearError(); }}
                    className={`flex-1 py-2 text-xs font-mono rounded-cs transition-all duration-150 cursor-pointer
                      ${mode === m ? 'bg-cs-surface text-cs-text shadow-card' : 'text-cs-text-muted hover:text-cs-text'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Error readout */}
              {error && (
                <div
                  className="flex items-center gap-2 p-3 rounded-cs bg-red-900/20 border border-red-500/30 text-red-400 text-xs font-mono mb-4"
                  role="alert"
                >
                  <AlertCircle size={14} aria-hidden="true" />
                  {error}
                </div>
              )}

              {/* Auth Form */}
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
                >
                  {loading ? (
                    <><Loader2 size={15} className="animate-spin" aria-hidden="true" /> Ingesting Credentials...</>
                  ) : mode === 'signup' ? 'Create Node Profile' : 'Synchronize Terminal'}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4" aria-hidden="true">
                <div className="flex-1 h-px bg-white/[0.06]" />
                <span className="cs-label">OR</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>

              {/* Google OAuth button */}
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-cs border border-white/[0.08] bg-cs-surface-high text-xs font-mono text-cs-text hover:border-white/20 hover:bg-cs-surface-top transition-all duration-150 cursor-pointer"
                aria-label="Sign in with Google"
              >
                {GOOGLE_ICON}
                Ingest Google Credentials
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ─── Features Grid Section ─────────────────────────────────────────────── */}
      <section className="border-t border-white/[0.05] bg-cs-surface/20 py-20" id="features">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <p className="cs-label text-cs-primary">CARBON ARCHITECTURE</p>
            <h2 className="font-geist font-bold text-3xl text-cs-text">High-Fidelity Tracking Features</h2>
            <p className="text-cs-text-muted text-xs sm:text-sm">
              Our telemetry framework decouples complex environmental equations into granular metrics, ensuring full accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: 'Impact Analytics',
                description: 'Granular visualization of monthly carbon expenditure with automatic comparison offsets and trend alerts.'
              },
              {
                icon: Shield,
                title: 'Data Integrity',
                description: 'All emissions logs are cryptographically processed and synchronized dynamically with secure Google Firestore nodes.'
              },
              {
                icon: Globe,
                title: 'Ecological Conversion',
                description: 'We translate complex metric-ton variables into digestible real-world data like tree equivalencies and smartphone energy loads.'
              }
            ].map(({ icon: Icon, title, description }) => (
              <div key={title} className="cs-card flex flex-col gap-4 border border-white/[0.06] hover:border-white/[0.1] transition-all">
                <div className="w-10 h-10 rounded-cs bg-cs-primary/10 border border-cs-primary/20 flex items-center justify-center">
                  <Icon size={18} className="text-cs-primary" />
                </div>
                <h3 className="font-geist font-bold text-lg text-cs-text">{title}</h3>
                <p className="text-xs text-cs-text-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mock Showcase / Telemetry Overview ─────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.05] relative" id="telemetry">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <p className="cs-label text-cs-primary">TELEMETRY PREVIEW</p>
              <h2 className="font-geist font-bold text-3xl text-cs-text leading-tight">Control Panel Interface</h2>
              <p className="text-cs-text-muted text-xs sm:text-sm leading-relaxed">
                Connect your devices or log habits manually to inspect your current carbon credits, leaderboard status, and active operations. Set reduction targets and watch the visual telemetry pipeline respond.
              </p>
              <ul className="space-y-2 pt-2 text-xs font-mono text-cs-text-muted">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cs-primary" /> Live Data Stream Status
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cs-primary" /> Multi-Step Habit Wizard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-cs-primary" /> Network Leaderboard Register
                </li>
              </ul>
            </div>

            {/* Mock interface container */}
            <div className="lg:col-span-7 cs-card border-cs-primary/15 relative overflow-hidden bg-cs-surface shadow-neon-lg flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cs-primary animate-pulse" />
                  <span className="font-mono text-[10px] text-cs-text-muted">CONNECTED // IP: 127.0.0.1</span>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="w-2 h-2 rounded-full bg-white/10" />
                </div>
              </div>

              {/* Showcase Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-cs bg-cs-surface-high border border-white/[0.05]">
                  <p className="cs-label text-[10px] text-cs-primary">CURRENT MONTHLY FOOTPRINT</p>
                  <p className="font-mono font-bold text-2xl text-cs-text mt-2">420 <span className="text-xs text-cs-text-muted">kg CO₂e</span></p>
                  <div className="cs-progress-track mt-3">
                    <div className="cs-progress-fill" style={{ width: '67%' }} />
                  </div>
                </div>

                <div className="p-4 rounded-cs bg-cs-surface-high border border-white/[0.05]">
                  <p className="cs-label text-[10px] text-cs-blue">DAILY HABIT STREAK</p>
                  <p className="font-mono font-bold text-2xl text-cs-text mt-2">14 <span className="text-xs text-cs-text-muted">DAYS</span></p>
                  <p className="cs-label text-[9px] text-cs-text-muted mt-2">OFFSET TARGET REACHED 67%</p>
                </div>
              </div>

              {/* Mini activity log showcase */}
              <div className="p-4 rounded-cs bg-cs-surface-high border border-white/[0.05] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <Cpu size={14} className="text-cs-primary animate-pulse" />
                  <span className="text-cs-text">Transit log update: 42 km on Petrol vehicle.</span>
                </div>
                <span className="text-cs-primary font-bold">+16.4 kg CO₂e</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Infrastructure Integrity Section ──────────────────────────────────── */}
      <section className="py-20 border-t border-white/[0.05] bg-cs-surface/10" id="infrastructure">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="cs-label text-cs-primary">INFRASTRUCTURE INTEGRITY</p>
              <h2 className="font-geist font-bold text-3xl text-cs-text">Reliable Architecture & Security</h2>
              <p className="text-cs-text-muted text-xs sm:text-sm leading-relaxed">
                CarbonSense leverages modern web standards to deliver responsive layout matrices, absolute data containment, and zero rendering waste.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Secure Session Handshakes', desc: 'Firebase Auth integrations offer zero-trust user validation paths.' },
                  { title: 'Input Sanitization Protocols', desc: 'Type compliance and limits enforcement prevent calculation errors.' }
                ].map(item => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-cs-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Database size={10} className="text-cs-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-cs-text">{item.title}</p>
                      <p className="text-[11px] text-cs-text-muted">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech details panel */}
            <div className="cs-card border border-white/[0.06] bg-cs-surface-high/50 p-6 space-y-4">
              <p className="cs-label">INFRASTRUCTURE TELEMETRY LOG</p>
              <div className="font-mono text-[10px] space-y-1.5 text-cs-text-muted">
                <p className="text-cs-primary">[OK] firebase_auth_provider loaded.</p>
                <p className="text-cs-blue">[OK] firestore_sync_pipeline active.</p>
                <p>[OK] vite_hmr_engine active.</p>
                <p>[OK] tailwind_css_compiled successfully.</p>
                <p className="text-cs-error">[WARN] client_offline_fallback initialized.</p>
                <p className="text-cs-primary">[OK] app_contrast_compliance checked (WCAG AAA).</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] bg-cs-bg py-8 mt-auto">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-geist font-bold text-sm text-cs-text">CarbonSense</span>
            <span className="cs-label text-[9px]">EPSG:4326</span>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] font-mono text-cs-text-muted justify-center">
            <a href="#" className="hover:text-cs-text transition-colors">DOCUMENTATION</a>
            <a href="#" className="hover:text-cs-text transition-colors">API STATUS</a>
            <a href="#" className="hover:text-cs-text transition-colors">PRIVACY POLICY</a>
          </div>

          <p className="cs-label text-[9px] text-cs-text-muted text-center md:text-right">
            © 2026 CarbonSense Protocol. Source under MIT License.
          </p>
        </div>
      </footer>
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

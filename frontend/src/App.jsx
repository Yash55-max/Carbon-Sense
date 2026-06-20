/**
 * App.jsx — Route definitions, auth gate, and workspace wrapper.
 * Wraps all protected routes in CarbonProtocolProvider.
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, handleGoogleRedirectResult } from './firebase/auth';
import { getUserProfile } from './firebase/db';
import { CarbonProtocolProvider } from './context/CarbonProtocolContext';
import Sidebar from './components/shared/Sidebar';

// Pages
import Landing     from './pages/Landing';
import Login       from './pages/Login';
import Dashboard   from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Insights    from './pages/Insights';
import Challenges  from './pages/Challenges';

// ─── Auth state hook ──────────────────────────────────────────────────────────

function useAuth() {
  const [authState, setAuthState] = useState({ user: undefined, profile: null });

  useEffect(() => {
    // Capture redirect sign-in result if returning from Google OAuth
    handleGoogleRedirectResult().catch((err) => {
      console.error('Google redirect auth error:', err);
    });

    const unsub = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        let profile = null;
        try { profile = await getUserProfile(firebaseUser.uid); } catch { /* ignore */ }
        setAuthState({ user: firebaseUser, profile });
      } else {
        setAuthState({ user: null, profile: null });
      }
    });
    return unsub;
  }, []);

  return authState;
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cs-bg flex items-center justify-center" role="status" aria-label="Loading CarbonSense">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cs-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-cs-text-muted">INITIALIZING PROTOCOL…</p>
      </div>
    </div>
  );
}

// ─── Protected layout ─────────────────────────────────────────────────────────

function ProtectedLayout({ user, profile }) {
  if (user === undefined) return <LoadingScreen />;
  if (!user)              return <Navigate to="/" replace />;

  return (
    <CarbonProtocolProvider initialUser={user} initialProfile={profile}>
      <div className="flex min-h-screen">
        {/* Accessibility: skip navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-52 focus:z-50 cs-btn-primary text-sm"
        >
          Skip to main content
        </a>
        <Sidebar />
        <Outlet />
      </div>
    </CarbonProtocolProvider>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { user, profile } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public: Landing Page with integrated Auth */}
        <Route
          path="/"
          element={
            user === undefined ? <LoadingScreen /> :
                                 <Landing isLoggedIn={!!user} />
          }
        />

        {/* Public: Login — alias redirect to root landing page */}
        <Route
          path="/login"
          element={
            user === undefined ? <LoadingScreen /> :
            user               ? <Navigate to="/dashboard" replace /> :
                                 <Navigate to="/" replace />
          }
        />

        {/* Protected: all app routes */}
        <Route element={<ProtectedLayout user={user} profile={profile} />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/log-activity" element={<LogActivity />} />
          <Route path="/insights"     element={<Insights />} />
          <Route path="/challenges"   element={<Challenges />} />
          <Route path="/settings"     element={<Dashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

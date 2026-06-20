/**
 * Sidebar — Sticky navigation console with Sync API trigger.
 * Matches the design in screen.png / screen3.png exactly.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, BarChart2, Trophy,
  Settings, LogOut, Zap, Loader2, CheckCircle2,
} from 'lucide-react';
import { useCarbonProtocol } from '../../context/CarbonProtocolContext';
import { signOut } from '../../firebase/auth';

const NAV_ITEMS = [
  { to: '/dashboard',     label: 'Dashboard',    Icon: LayoutDashboard },
  { to: '/log-activity',  label: 'Log Activity', Icon: PlusCircle },
  { to: '/insights',      label: 'Insights',     Icon: BarChart2 },
  { to: '/challenges',    label: 'Challenges',   Icon: Trophy },
];

export default function Sidebar() {
  const { state, syncToFirestore } = useCarbonProtocol();
  const { user, userProfile, isSyncing, syncSuccess } = state;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-48 bg-cs-surface border-r border-white/[0.06] flex flex-col z-40"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <h1 className="font-geist font-bold text-lg text-cs-primary leading-none tracking-tight">
          CarbonSense
        </h1>
        <p className="cs-label mt-1 text-[10px]">Dev Mode Active</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Primary navigation">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `cs-nav-item ${isActive ? 'active' : ''}`
            }
            aria-current={({ isActive }) => isActive ? 'page' : undefined}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile (Challenges page style) */}
      {user && (
        <div className="px-4 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-cs bg-cs-surface-top border border-white/10 flex items-center justify-center text-xs font-mono text-cs-primary font-semibold"
              aria-hidden="true"
            >
              {(user.displayName ?? 'U')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-cs-text truncate">
                {user.displayName ?? 'User'}
              </p>
              <p className="cs-label text-[10px]">
                Rank #{userProfile?.rank ?? '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sync API Button */}
      <div className="px-3 pb-3">
        <button
          onClick={syncToFirestore}
          disabled={isSyncing}
          aria-label="Sync data to Firestore"
          className={`w-full cs-btn-primary text-xs py-2 flex items-center justify-center gap-2
            ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}
            ${syncSuccess ? '!bg-cs-primary-dim' : ''}
          `}
        >
          {isSyncing ? (
            <><Loader2 size={13} className="animate-spin" aria-hidden="true" /> Syncing…</>
          ) : syncSuccess ? (
            <><CheckCircle2 size={13} aria-hidden="true" /> Synced</>
          ) : (
            <><Zap size={13} aria-hidden="true" /> Sync API</>
          )}
        </button>
      </div>

      {/* Bottom actions */}
      <div className="px-3 pb-5 space-y-0.5 border-t border-white/[0.06] pt-3">
        <NavLink to="/settings" className="cs-nav-item">
          <Settings size={15} aria-hidden="true" />
          <span>Settings</span>
        </NavLink>
        <button
          onClick={handleSignOut}
          className="cs-nav-item w-full text-left"
          aria-label="Sign out of CarbonSense"
        >
          <LogOut size={15} aria-hidden="true" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

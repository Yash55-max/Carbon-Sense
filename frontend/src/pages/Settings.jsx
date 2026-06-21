/**
 * Settings Page — User Preferences & Account Management.
 * Stub implementation providing profile, notification and data export controls.
 */

import { useCarbonProtocol } from '../context/CarbonProtocolContext';
import { Settings, User, Bell, Database, Shield, Download } from 'lucide-react';

const SETTINGS_SECTIONS = [
  {
    id: 'profile',
    title: 'User Profile',
    icon: User,
    description: 'Manage your display name and account preferences.',
    items: [
      { label: 'Display Name', type: 'input', placeholder: 'Your display name' },
      { label: 'Email Notifications', type: 'toggle', defaultValue: true },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    description: 'Control alert preferences for streak reminders and sync events.',
    items: [
      { label: 'Daily Streak Reminder', type: 'toggle', defaultValue: true },
      { label: 'Sync Confirmation Alert', type: 'toggle', defaultValue: false },
      { label: 'Weekly Summary Report', type: 'toggle', defaultValue: true },
    ],
  },
  {
    id: 'data',
    title: 'Data & Privacy',
    icon: Database,
    description: 'Control how your carbon data is stored and processed.',
    items: [
      { label: 'Allow Analytics Collection', type: 'toggle', defaultValue: true },
      { label: 'Offline Cache Enabled', type: 'toggle', defaultValue: true },
    ],
  },
];

export default function SettingsPage() {
  const { state } = useCarbonProtocol();
  const { user, userProfile } = state;

  return (
    <main id="main-content" className="min-h-screen pl-48" aria-label="Settings">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-cs bg-cs-primary/10 border border-cs-primary/20 flex items-center justify-center">
              <Settings size={18} className="text-cs-primary" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-geist font-bold text-4xl text-cs-text">Settings</h1>
              <p className="cs-label mt-1">PROTOCOL CONFIG // USER PREFERENCES</p>
            </div>
          </div>
        </header>

        {/* Account summary */}
        <section className="cs-card mb-6" aria-label="Account overview">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-cs bg-cs-surface-top border border-white/10 flex items-center justify-center text-xl font-mono text-cs-primary font-semibold"
              aria-hidden="true"
            >
              {(user?.displayName ?? 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-geist font-bold text-xl text-cs-text">
                {user?.displayName ?? 'Unknown User'}
              </p>
              <p className="text-xs text-cs-text-muted font-mono">{user?.email ?? '—'}</p>
              <div className="flex gap-3 mt-1">
                <span className="cs-badge">Rank #{userProfile?.rank ?? '—'}</span>
                <span className="cs-badge" style={{ color: '#60A5FA', borderColor: 'rgba(96,165,250,0.3)' }}>
                  {(userProfile?.carbonCredits ?? 0).toLocaleString()} Credits
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Settings sections */}
        <div className="space-y-4">
          {SETTINGS_SECTIONS.map(({ id, title, icon: Icon, description, items }) => (
            <section key={id} className="cs-card" aria-labelledby={`settings-${id}-heading`}>
              <div className="flex items-start gap-3 mb-5">
                <div className="w-8 h-8 rounded-cs bg-cs-surface-high border border-white/[0.06] flex items-center justify-center">
                  <Icon size={15} className="text-cs-primary" aria-hidden="true" />
                </div>
                <div>
                  <h2 id={`settings-${id}-heading`} className="font-geist font-bold text-lg text-cs-text">
                    {title}
                  </h2>
                  <p className="text-xs text-cs-text-muted mt-0.5">{description}</p>
                </div>
              </div>

              <div className="space-y-3 pl-11">
                {items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                    <label className="text-sm text-cs-text" htmlFor={`setting-${id}-${item.label.replace(/\s+/g, '-').toLowerCase()}`}>
                      {item.label}
                    </label>
                    {item.type === 'toggle' ? (
                      <button
                        type="button"
                        id={`setting-${id}-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                        role="switch"
                        aria-checked={item.defaultValue}
                        aria-label={`Toggle ${item.label}`}
                        className={`relative w-10 h-5 rounded-sm border-2 transition-all duration-200 cursor-pointer
                          ${item.defaultValue ? 'bg-cs-primary border-cs-primary' : 'bg-cs-surface-top border-cs-surface-top'}`}
                      >
                        <span
                          className={`absolute top-0.5 w-3 h-3 rounded-sm bg-white transition-all duration-200
                            ${item.defaultValue ? 'left-5' : 'left-0.5'}`}
                        />
                      </button>
                    ) : (
                      <input
                        id={`setting-${id}-${item.label.replace(/\s+/g, '-').toLowerCase()}`}
                        type="text"
                        placeholder={item.placeholder ?? ''}
                        defaultValue={user?.displayName ?? ''}
                        className="bg-cs-surface-high border border-white/[0.08] rounded-cs px-3 py-1.5 text-sm text-cs-text font-mono w-48 focus:outline-none focus:border-cs-primary/40"
                        aria-label={item.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Data export */}
          <section className="cs-card" aria-label="Data export">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-cs bg-cs-surface-high border border-white/[0.06] flex items-center justify-center">
                <Download size={15} className="text-cs-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-geist font-bold text-lg text-cs-text">Export Data</h2>
                <p className="text-xs text-cs-text-muted mt-0.5">Download your carbon telemetry history as JSON or CSV.</p>
              </div>
            </div>
            <div className="flex gap-3 pl-11">
              <button type="button" className="cs-btn-ghost text-xs py-2 px-4 flex items-center gap-2">
                <Download size={13} aria-hidden="true" /> Export JSON
              </button>
              <button type="button" className="cs-btn-ghost text-xs py-2 px-4 flex items-center gap-2">
                <Download size={13} aria-hidden="true" /> Export CSV
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="cs-card border-red-500/10" aria-label="Security settings">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-cs bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Shield size={15} className="text-red-400" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-geist font-bold text-lg text-cs-text">Security</h2>
                <p className="text-xs text-cs-text-muted mt-0.5">Authentication and session management.</p>
              </div>
            </div>
            <div className="pl-11">
              <button type="button" className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors">
                Terminate All Sessions
              </button>
            </div>
          </section>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-4 mt-8">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-cs-text-muted">
          <span>© 2026 CarbonSense Protocol. Data precision: 99.9% EPSG:4326.</span>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Documentation</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </main>
  );
}

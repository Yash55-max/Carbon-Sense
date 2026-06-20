/**
 * Challenges Page — Protocol: Challenges
 * Matches screen3.png: active operations, badge grid, live leaderboard.
 */

import { useState, useEffect } from 'react';
import { Car, Zap, Wifi, Trophy, Leaf, Droplets, Recycle, Sun, Wind, Bike, ShieldCheck } from 'lucide-react';
import { useCarbonProtocol } from '../context/CarbonProtocolContext';
import { getLeaderboard } from '../firebase/db';

// ─── Circular Progress SVG ─────────────────────────────────────────────────────
function CircularProgress({ value = 0, size = 100, stroke = 6, color = '#10B981' }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg
      width={size}
      height={size}
      className="circular-progress"
      role="img"
      aria-label={`Progress: ${value}%`}
    >
      {/* Track */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#262a35" strokeWidth={stroke} />
      {/* Fill */}
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
      />
    </svg>
  );
}

// ─── Badge config ─────────────────────────────────────────────────────────────
const BADGES = [
  { id: 'EARLY_ADOPTER', label: 'Early Adopter', Icon: Leaf,       always: true },
  { id: 'CARBON_SINK',   label: 'Carbon Sink',   Icon: Wind,       always: true },
  { id: 'H2O_SAVER',     label: 'H₂O Saver',    Icon: Droplets,   always: false },
  { id: 'ZERO_WASTE',    label: 'Zero Waste',    Icon: Recycle,    always: false },
  { id: 'SOLAR_MAX',     label: 'Solar Max',     Icon: Sun,        always: false },
  { id: 'WIND_WALKER',   label: 'Wind Walker',   Icon: Wind,       always: false },
  { id: 'KINETIC_GEN',   label: 'Kinetic Gen',   Icon: Bike,       always: false },
  { id: 'VERIFIED',      label: 'Verified',      Icon: ShieldCheck,always: false },
];

const CHALLENGE_ICONS = { car: Car, zap: Zap, wifi: Wifi };

// ─── Mock leaderboard fallback ────────────────────────────────────────────────
const MOCK_LEADERBOARD = [
  { rank: 1,  uid: 'u1', displayName: 'Node_X88',       co2Saved: 2450.2, carbonCredits: 54200 },
  { rank: 2,  uid: 'u2', displayName: 'Carbon_Crusher',  co2Saved: 1920.8, carbonCredits: 48150 },
  { rank: 3,  uid: 'u3', displayName: 'EcoWarrior_2024', co2Saved: 1811.5, carbonCredits: 42900 },
  { rank: 4,  uid: 'u4', displayName: 'GreenNode_7',     co2Saved: 1644.2, carbonCredits: 38700 },
];

export default function Challenges() {
  const { state } = useCarbonProtocol();
  const { user, userProfile, challenges, unlockedBadges, monthlyFootprint } = state;

  const [leaderboard, setLeaderboard]   = useState(MOCK_LEADERBOARD);
  const [lbFilter,    setLbFilter]      = useState('WEEKLY');
  const [lbLoading,   setLbLoading]     = useState(false);

  // Fetch live leaderboard on mount
  useEffect(() => {
    const load = async () => {
      setLbLoading(true);
      try {
        const data = await getLeaderboard(10);
        if (data.length > 0) setLeaderboard(data);
      } catch {
        // silently use mock data
      } finally {
        setLbLoading(false);
      }
    };
    load();
  }, []);

  // Find current user's position in leaderboard
  const currentUserRank = leaderboard.find(e => e.uid === user?.uid);

  return (
    <main id="main-content" className="min-h-screen pl-48" aria-label="Protocol Challenges">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="font-geist font-bold text-4xl text-cs-text">Protocol: Challenges</h1>
            <p className="text-cs-text-muted text-sm mt-2 max-w-lg">
              Execute mission-critical reductions. Optimize your lifestyle parameters and earn
              cryptographically verified credentials.
            </p>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Global Tier', value: 'ELITE',   color: '#10B981' },
              { label: 'Carbon Credits', value: (userProfile?.carbonCredits ?? 12450).toLocaleString(), color: '#60A5FA' },
            ].map(({ label, value, color }) => (
              <div key={label} className="cs-card !p-4 text-center min-w-[100px]">
                <p className="cs-label mb-1">{label}</p>
                <p className="font-mono font-bold text-lg" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Active Operations */}
        <section aria-label="Active challenge operations">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cs-primary" aria-hidden="true" />
              <p className="cs-label text-cs-text">Active Operations</p>
            </div>
            <p className="cs-label">STATUS: {challenges.filter(c => c.active).length} IN PROGRESS</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges.map(challenge => {
              const IconComp = CHALLENGE_ICONS[challenge.icon] ?? Car;
              return (
                <article
                  key={challenge.id}
                  className={`cs-card relative ${challenge.priority ? 'border-cs-primary/30' : ''}`}
                  aria-label={`Challenge: ${challenge.title} — ${challenge.progress}% complete`}
                >
                  {challenge.priority && (
                    <span className="absolute top-3 right-3 cs-badge text-[10px]">PRIORITY</span>
                  )}
                  <div className="flex items-start justify-between mb-2">
                    <p className="cs-label">{challenge.duration}</p>
                    <IconComp size={14} className="text-cs-text-muted" aria-hidden="true" />
                  </div>
                  <h2 className="font-geist font-bold text-xl text-cs-text mb-4">{challenge.title}</h2>

                  {/* Circular progress */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <CircularProgress value={challenge.progress} size={90} stroke={5} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono font-bold text-cs-text">{challenge.progress}%</span>
                        {challenge.id === 'no_drive' && (
                          <span className="cs-label text-[9px]">5/7 DAYS</span>
                        )}
                        {challenge.id === 'grid_shift' && (
                          <span className="cs-label text-[9px]">GLOBAL EFFORT</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-cs-text-muted">{challenge.description}</p>

                  {/* Initializing bar (Smart Meter) */}
                  {challenge.id === 'smart_meter' && (
                    <div className="mt-3">
                      <div className="flex justify-between cs-label mb-1">
                        <span>INITIALIZING…</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <div className="cs-progress-track">
                        <div className="cs-progress-fill" style={{ width: `${challenge.progress}%` }} />
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        {/* Badge Grid */}
        <section className="mt-8" aria-label="Achievement badges">
          <p className="cs-label mb-4">Locked Achievements</p>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {BADGES.map(({ id, label, Icon }) => {
              const unlocked = unlockedBadges.includes(id);
              return (
                <div
                  key={id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-cs border transition-all duration-150
                    ${unlocked
                      ? 'border-cs-primary/40 bg-cs-primary/10 text-cs-primary shadow-neon'
                      : 'border-white/[0.06] bg-cs-surface-high text-cs-text-muted'}`}
                  role="img"
                  aria-label={`${label} badge — ${unlocked ? 'unlocked' : 'locked'}`}
                >
                  <Icon size={20} aria-hidden="true" />
                  <p className="cs-label text-[9px] text-center leading-tight uppercase">{label.replace('_', ' ')}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Community Leaderboard */}
        <section className="mt-8" aria-label="Community leaderboard">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy size={14} className="text-cs-primary" aria-hidden="true" />
              <p className="cs-label text-cs-text">Community Leaderboard</p>
            </div>
            <div className="flex gap-1 bg-cs-surface-high rounded-cs p-1" role="group" aria-label="Leaderboard time filter">
              {['WEEKLY', 'ALL-TIME'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setLbFilter(f)}
                  aria-pressed={lbFilter === f}
                  className={`px-3 py-1 rounded-cs text-xs font-mono transition-all duration-150 cursor-pointer
                    ${lbFilter === f
                      ? 'bg-cs-primary text-cs-bg font-semibold'
                      : 'text-cs-text-muted hover:text-cs-text'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="cs-card !p-0 overflow-hidden">
            <table className="w-full" aria-label="Carbon leaderboard table">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Rank', 'User Node', 'CO₂ Savings', 'Credits', 'Milestones'].map(h => (
                    <th key={h} className="cs-label px-4 py-3 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lbLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-cs-text-muted font-mono text-sm">
                      Loading network registry…
                    </td>
                  </tr>
                )}
                {!lbLoading && leaderboard.map((entry, i) => {
                  const isCurrentUser = entry.uid === user?.uid;
                  return (
                    <tr
                      key={entry.uid}
                      className={`border-b border-white/[0.04] transition-colors hover:bg-cs-surface-high
                        ${isCurrentUser ? 'bg-cs-primary/5' : ''}`}
                      aria-label={`${entry.displayName}${isCurrentUser ? ' (you)' : ''}, rank ${entry.rank}, CO₂ saved: ${entry.co2Saved} kg`}
                    >
                      <td className="px-4 py-4">
                        <span className="font-mono font-bold text-cs-primary">
                          #{String(entry.rank ?? i + 1).padStart(2, '0')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-cs bg-cs-surface-top border border-white/10 flex items-center justify-center text-[10px] font-mono text-cs-primary" aria-hidden="true">
                            {(entry.displayName ?? 'U')[0]}
                          </div>
                          <span className="font-mono text-sm text-cs-text">
                            {entry.displayName}
                            {isCurrentUser && (
                              <span className="ml-1 cs-badge text-[9px] py-0">YOU</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono text-sm text-cs-text">
                        {(entry.co2Saved ?? 0).toLocaleString()} kg
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-mono font-bold text-sm text-cs-blue">
                          {(entry.carbonCredits ?? 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1" aria-label={`${Math.min(3, Math.floor((entry.carbonCredits ?? 0) / 10000))} milestones`}>
                          {Array.from({ length: 3 }, (_, j) => (
                            <span
                              key={j}
                              className="w-2 h-2 rounded-full"
                              style={{ background: j < Math.floor((entry.carbonCredits ?? 0) / 15000) ? '#10B981' : '#262a35' }}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              type="button"
              className="w-full py-3 text-xs font-mono text-cs-text-muted hover:text-cs-text transition-colors border-t border-white/[0.04]"
              aria-label="Load full network registry"
            >
              LOAD FULL NETWORK REGISTRY ↓
            </button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-4 mt-8">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-cs-text-muted">
          <span>© 2024 CarbonSense Protocol. Data precision: 99.9% EPSG:4326.</span>
          <a href="#" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Documentation</a>
          <a href="#" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">API Status</a>
          <a href="#" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Privacy Policy</a>
          <a href="#" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Source</a>
        </div>
      </footer>
    </main>
  );
}

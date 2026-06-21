/**
 * Dashboard Page — System Overview
 * Matches screen.png design exactly.
 */

import { useMemo } from 'react';
import { Bus, Zap, UtensilsCrossed, ShoppingCart, ArrowRight, Leaf, Wind } from 'lucide-react';
import { useCarbonProtocol } from '../context/CarbonProtocolContext';
import EmissionChart from '../components/dashboard/EmissionChart';
import StreakTracker from '../components/dashboard/StreakTracker';
import MetricCard from '../components/shared/MetricCard';

const SECTOR_CONFIG = [
  { key: 'transit',  label: 'Transportation',  Icon: Bus,             color: '#10B981' },
  { key: 'energy',   label: 'Home Energy',     Icon: Zap,             color: '#60A5FA' },
  { key: 'food',     label: 'Food Consumption',Icon: UtensilsCrossed, color: '#a78bfa' },
  { key: 'shopping', label: 'Shopping & Waste',Icon: ShoppingCart,    color: '#fb923c' },
];

const CARBON_SINK_ITEMS = [
  { title: 'Mangrove Reforestation', provider: 'Verified by Verra Protocol', offset: '+2.4 kg offset', color: '#10B981' },
  { title: 'Direct Air Capture',     provider: 'Operator: Climeworks',        offset: '+0.8 kg offset', color: '#34D399' },
];

export default function Dashboard() {
  const { state } = useCarbonProtocol();
  const { monthlyFootprint, activities, streakDays, history } = state;

  const maxSector = useMemo(
    () => Math.max(...Object.values(activities), 1),
    [activities]
  );

  return (
    <main id="main-content" className="min-h-screen pl-48" aria-label="Dashboard">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Page header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-geist font-bold text-4xl text-cs-text">System Overview</h1>
              <p className="cs-label mt-1">PROTOCOL: V4.2 / LOC: EPSG:4326</p>
            </div>
          </div>
        </header>

        {/* Emission timeline chart */}
        <EmissionChart data={history} currentFootprint={monthlyFootprint} />

        {/* Metric cards + Streak tracker */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4" aria-label="Sector breakdown">
          {/* Left: 2x2 metric grid */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-4">
            {SECTOR_CONFIG.map(({ key, label, Icon, color }) => (
              <MetricCard
                key={key}
                icon={<Icon size={16} />}
                label={label.toUpperCase()}
                value={activities[key]}
                maxValue={maxSector}
                accentColor={color}
              />
            ))}
          </div>

          {/* Right: Streak tracker */}
          <StreakTracker streakDays={streakDays} />
        </section>

        {/* Bottom row: Regeneration Target + Carbon Sink */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4" aria-label="Insights and carbon sinks">

          {/* Regeneration target — spans 2 cols */}
          <article className="lg:col-span-2 cs-card">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-cs bg-cs-primary/10 border border-cs-primary/20 flex items-center justify-center">
                <Leaf size={16} className="text-cs-primary" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-geist font-bold text-xl text-cs-text">Regeneration Target</h2>
                <p className="text-cs-text-muted text-sm mt-1">
                  Our algorithm suggests focusing on transportation efficiency to hit your
                  year-end target of <span className="text-cs-text font-semibold">-25% CO₂e</span> reduction.
                </p>
              </div>
            </div>
            <button type="button" className="cs-btn-ghost flex items-center gap-2 text-sm" aria-label="View optimization roadmap">
              View Optimization Roadmap <ArrowRight size={14} aria-hidden="true" />
            </button>
          </article>

          {/* Carbon sink activity */}
          <aside className="cs-card" aria-label="Carbon sink activity">
            <h2 className="cs-label mb-4 text-xs font-semibold tracking-wider">Carbon Sink Activity</h2>
            <ul className="space-y-3">
              {CARBON_SINK_ITEMS.map(item => (
                <li key={item.title} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-cs bg-cs-surface-high border border-white/[0.06] flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Wind size={14} className="text-cs-text-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-cs-text font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-cs-text-muted">{item.provider}</p>
                    <p className="text-xs font-mono mt-0.5" style={{ color: item.color }}>
                      {item.offset}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-4 mt-8">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-cs-text-muted">
          <span>CARBON_SENSE_PRTCL // EPSG:4326</span>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Documentation</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">API Status</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Privacy Policy</a>
          <span className="ml-auto">SOURCE© 2024 CarbonSense Protocol. Data precision: 99.9%</span>
        </div>
      </footer>
    </main>
  );
}

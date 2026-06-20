/**
 * Insights Page — Data Analytics Deep Dive
 * Matches screen6.png: emission comparison chart, equivalency grid, smart recs.
 */

import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useCarbonProtocol } from '../context/CarbonProtocolContext';
import EquivalencyGrid from '../components/insights/EquivalencyGrid';
import SmartRecs from '../components/insights/SmartRecs';

const TIME_FILTERS = ['WEEKLY', 'MONTHLY', 'YEARLY'];
const NATIONAL_AVG = 560;
const CITY_AVG     = 4.2;
const LOCAL_TARGET = 2.5;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="cs-card !p-3 !rounded-cs border-cs-primary/20 text-xs font-mono">
      <p className="text-cs-text-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="text-cs-text font-semibold">{p.value} kg</span>
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { state } = useCarbonProtocol();
  const { history, activities, monthlyFootprint } = state;
  const [timeFilter, setTimeFilter] = useState('WEEKLY');

  // Build chart data from history
  const chartData = useMemo(() => {
    const slice = timeFilter === 'WEEKLY' ? history.slice(-7)
                : timeFilter === 'MONTHLY' ? history.slice(-30)
                : history;
    return slice.map(d => ({
      date:    d.date,
      you:     d.kg,
      national:NATIONAL_AVG,
      target:  Math.round(monthlyFootprint * 0.75),
    }));
  }, [history, timeFilter, monthlyFootprint]);

  return (
    <main id="main-content" className="min-h-screen pl-48" aria-label="Data Insights">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="flex items-start justify-between mb-8">
          <div>
            <p className="cs-label">Analytics / Deep Dive</p>
            <h1 className="font-geist font-bold text-4xl text-cs-text mt-1">Data Insights</h1>
          </div>
          {/* Time filter */}
          <div
            className="flex bg-cs-surface-high rounded-cs p-1 border border-white/[0.06]"
            role="group"
            aria-label="Time period filter"
          >
            {TIME_FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setTimeFilter(f)}
                aria-pressed={timeFilter === f}
                className={`px-4 py-1.5 rounded-cs text-xs font-mono transition-all duration-150 cursor-pointer
                  ${timeFilter === f
                    ? 'bg-cs-primary text-cs-bg font-semibold'
                    : 'text-cs-text-muted hover:text-cs-text'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Emission comparison chart */}
          <section
            className="lg:col-span-2 cs-card"
            aria-label="Emission comparison chart"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="cs-label">Emission Comparison (kg CO₂e)</p>
            </div>
            <div className="h-56" role="img" aria-label={`${timeFilter.toLowerCase()} emission comparison line chart`}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#86948a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    axisLine={false} tickLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: '#86948a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#86948a', paddingTop: '12px' }}
                  />
                  <Line type="monotone" dataKey="you"      name="You"          stroke="#10B981" strokeWidth={2} dot={false} activeDot={{ r: 3, fill: '#10B981' }} />
                  <Line type="monotone" dataKey="national" name="National Avg" stroke="#60A5FA" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="target"   name="Target"       stroke="#10B981" strokeWidth={1} strokeDasharray="4 4" dot={false} strokeOpacity={0.4} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Right: Equivalency grid */}
          <div className="cs-card">
            <EquivalencyGrid kgCO2e={monthlyFootprint} />
          </div>
        </div>

        {/* Bottom row: Smart recs + Regional context */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          {/* Smart recommendations */}
          <section className="cs-card" aria-label="Smart recommendations">
            <SmartRecs activities={activities} />
          </section>

          {/* Regional footprint context */}
          <aside className="cs-card" aria-label="Regional footprint context">
            <div className="flex items-center justify-between mb-4">
              <p className="cs-label">Regional Footprint Context</p>
              <span className="cs-badge">
                <span className="w-1.5 h-1.5 rounded-full bg-cs-primary animate-pulse" aria-hidden="true" />
                Live Grid Feed
              </span>
            </div>

            {/* Decorative grid map */}
            <div
              className="h-28 rounded-cs mb-4 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a1215 0%, #0d1a12 100%)',
                border: '1px solid rgba(16,185,129,0.1)',
              }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cs-primary shadow-neon animate-pulse" />
              </div>
            </div>

            {/* City vs target stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'City Avg', value: `${CITY_AVG} t/yr`, color: '#60A5FA' },
                { label: 'Local Target', value: `${LOCAL_TARGET} t/yr`, color: '#10B981' },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="p-3 rounded-cs bg-cs-surface-high border border-white/[0.06]"
                  aria-label={`${label}: ${value}`}
                >
                  <p className="cs-label mb-1">{label}</p>
                  <p className="font-mono font-bold text-lg" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
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

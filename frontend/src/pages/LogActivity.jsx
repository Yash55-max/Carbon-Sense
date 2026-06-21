/**
 * LogActivity Page — Protocol Input
 * Multi-step wizard + real-time impact sidebar. Matches screen4.png.
 */

import { useMemo } from 'react';
import { Info } from 'lucide-react';
import ActivityWizard from '../components/log/ActivityWizard';
import { useCarbonProtocol } from '../context/CarbonProtocolContext';

const ADVICE_TIPS = [
  'Reducing meat consumption by 40% can decrease your annual dietary footprint by approximately 0.8 metric tons of CO₂.',
  'Switching from a petrol car to public transit saves ~0.12 kg CO₂e per km.',
  'Installing LED lighting reduces home energy emissions by up to 75%.',
  'Buying second-hand instead of new can save 80% of a product\'s carbon footprint.',
];

const GLOBAL_AVG = 4.7; // t/yr

export default function LogActivity() {
  const { state } = useCarbonProtocol();
  const { draftActivities } = state;

  // Preview computed from current wizard draft states (matches screen4.png: 1.24 t)
  const preview = useMemo(() => {
    const transit = draftActivities?.transit ?? 0;
    const energy  = draftActivities?.energy ?? 0;
    const food    = draftActivities?.food ?? 0;
    const shopping= draftActivities?.shopping ?? 0;
    const total   = transit + energy + food + shopping;
    return {
      tons:           parseFloat((total / 1000).toFixed(3)),
      transitAccuracy:92,
      energyReliability: 78,
    };
  }, [draftActivities]);

  const tip = useMemo(() => {
    // Select tip deterministically based on day of month to avoid hydration mismatch
    const day = new Date().getDate();
    return ADVICE_TIPS[day % ADVICE_TIPS.length];
  }, []);

  return (
    <main id="main-content" className="min-h-screen pl-48" aria-label="Log Activity">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <header className="mb-8">
          <p className="cs-label">Protocol Input</p>
          <h1 className="font-geist font-bold text-4xl text-cs-text mt-1">Log Activity.</h1>
          <p className="text-cs-text-muted text-sm mt-2 max-w-lg">
            Quantify your environmental impact through our high-precision data ingestion pipeline.
            Ensure all metrics are updated for real-time offset calculations.
          </p>
        </header>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Wizard — spans 2 cols */}
          <div className="lg:col-span-2">
            <ActivityWizard />
          </div>

          {/* Real-time impact sidebar */}
          <aside className="space-y-4" aria-label="Real-time impact preview">

            {/* Impact preview card */}
            <section className="cs-card" aria-label="Current estimated impact">
              <h2 className="cs-label mb-4 text-xs font-semibold tracking-wider">Real-Time Impact</h2>
              <p
                className="font-mono font-bold text-cs-primary leading-none"
                style={{ fontSize: '3rem' }}
                aria-live="polite"
                aria-atomic="true"
              >
                {preview.tons}
              </p>
              <p className="cs-label mt-1">Tons CO₂e Estimated</p>

              {/* Accuracy bars */}
              <div className="mt-5 space-y-3">
                {[
                  { label: 'Transit Accuracy',    value: preview.transitAccuracy },
                  { label: 'Energy Reliability',  value: preview.energyReliability },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between cs-label mb-1.5">
                      <span>{label}</span>
                      <span className="text-cs-text">{value}%</span>
                    </div>
                    <progress
                      className="cs-progress-track w-full"
                      value={value}
                      max={100}
                      aria-label={`${label}: ${value}%`}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Protocol advice */}
            <aside className="cs-card" aria-label="Protocol advice tip">
              <div className="flex items-start gap-2.5">
                <Info size={14} className="text-cs-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-semibold text-cs-text mb-1">Protocol Advice</h2>
                  <p className="text-xs text-cs-text-muted leading-relaxed">{tip}</p>
                </div>
              </div>
            </aside>

            {/* Global average */}
            <aside
              className="cs-card relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #111827 0%, #0a1a12 100%)',
                borderColor: 'rgba(16,185,129,0.15)',
              }}
              aria-label="Global average emissions"
            >
              <div className="relative z-10">
                <h2 className="cs-label text-cs-primary text-xs font-semibold tracking-wider">Global Average</h2>
                <p className="font-mono font-bold text-cs-text mt-1" style={{ fontSize: '2rem' }}>
                  {GLOBAL_AVG} <span className="text-lg text-cs-text-muted">t/y</span>
                </p>
              </div>
              {/* Decorative gradient orb */}
              <div
                className="absolute bottom-0 right-0 w-24 h-24 opacity-20 rounded-full"
                style={{ background: 'radial-gradient(circle, #10B981, transparent)' }}
                aria-hidden="true"
              />
            </aside>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-x-8 gap-y-2 text-xs font-mono text-cs-text-muted">
          <span>© 2026 CarbonSense Protocol. Data precision: 99.9% EPSG:4326.</span>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Documentation</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">API Status</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Privacy Policy</a>
          <a href="https://github.com/yash55-max/Carbon-Sense" rel="noopener noreferrer" className="hover:text-cs-text transition-colors">Source</a>
        </div>
      </footer>
    </main>
  );
}

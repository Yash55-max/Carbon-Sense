/**
 * LogActivity Page — Protocol Input
 * Multi-step wizard + real-time impact sidebar. Matches screen4.png.
 */

import { useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import ActivityWizard from '../components/log/ActivityWizard';
import {
  calcTransitEmissions, calcEnergyEmissions, calcFoodEmissions,
  calcShoppingEmissions, validateDistance,
} from '../utils/carbonEngine';

const ADVICE_TIPS = [
  'Reducing meat consumption by 40% can decrease your annual dietary footprint by approximately 0.8 metric tons of CO₂.',
  'Switching from a petrol car to public transit saves ~0.12 kg CO₂e per km.',
  'Installing LED lighting reduces home energy emissions by up to 75%.',
  'Buying second-hand instead of new can save 80% of a product\'s carbon footprint.',
];

const GLOBAL_AVG = 4.7; // t/yr

export default function LogActivity() {
  // Lift state for real-time preview from wizard defaults
  const [liveVehicle,   ] = useState('petrol');
  const [liveDistance,  ] = useState(42);
  const [liveDietType,  ] = useState('omnivore');

  // Preview computed from current wizard defaults (matches screen4.png: 1.24 t)
  const preview = useMemo(() => {
    const transit = calcTransitEmissions(liveVehicle, validateDistance(liveDistance));
    const energy  = calcEnergyEmissions(12, false);
    const food    = calcFoodEmissions(liveDietType);
    const shopping= calcShoppingEmissions('medium');
    const total   = transit + energy + food + shopping;
    return {
      tons:           parseFloat((total / 1000).toFixed(3)),
      transitAccuracy:92,
      energyReliability: 78,
    };
  }, [liveVehicle, liveDistance, liveDietType]);

  const tip = ADVICE_TIPS[Math.floor(Date.now() / 60000) % ADVICE_TIPS.length];

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
              <p className="cs-label mb-4">Real-Time Impact</p>
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
                    <div
                      className="cs-progress-track"
                      role="progressbar"
                      aria-valuenow={value}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${label}: ${value}%`}
                    >
                      <div className="cs-progress-fill" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Protocol advice */}
            <aside className="cs-card" aria-label="Protocol advice tip">
              <div className="flex items-start gap-2.5">
                <Info size={14} className="text-cs-primary shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-cs-text mb-1">Protocol Advice</p>
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
                <p className="cs-label text-cs-primary">Global Average</p>
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

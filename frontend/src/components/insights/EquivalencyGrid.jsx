/**
 * EquivalencyGrid — Concrete environmental translation blocks.
 * Converts kg CO2e to real-world equivalents (trees, phones, km).
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Trees, Smartphone, Car, Timer } from 'lucide-react';
import { calcEquivalency } from '../../utils/carbonEngine';

const EQUIVALENCY_CONFIG = [
  {
    key:   'treesPlanted',
    label: 'Trees Planted',
    Icon:  Trees,
    unit:  'trees',
    color: '#10B981',
    desc:  'Annual CO₂ absorption equivalent',
  },
  {
    key:   'phonesCharged',
    label: 'Phones Charged',
    Icon:  Smartphone,
    unit:  'charges',
    color: '#60A5FA',
    desc:  'Smartphone full charge cycles',
    format: (v) => v.toLocaleString(),
  },
  {
    key:   'kmNotDriven',
    label: 'KM Not Driven',
    Icon:  Car,
    unit:  'km',
    color: '#a78bfa',
    desc:  'Petrol car distance equivalent',
  },
  {
    key:   'drivingDays',
    label: 'Driving Days',
    Icon:  Timer,
    unit:  'days',
    color: '#fb923c',
    desc:  'Days of average daily commute',
  },
];

/** @param {{ kgCO2e: number }} props */
export default function EquivalencyGrid({ kgCO2e = 420 }) {
  const equiv = useMemo(() => calcEquivalency(kgCO2e), [kgCO2e]);

  return (
    <section aria-label="Environmental equivalency impact">
      <p className="cs-label mb-4">Equivalency Impact</p>
      <div className="space-y-3">
        {EQUIVALENCY_CONFIG.map(({ key, label, Icon, unit, color, format }) => {
          const raw   = equiv[key] ?? 0;
          const value = format ? format(raw) : raw.toLocaleString();
          return (
            <article
              key={key}
              className="flex items-center gap-3 p-3 rounded-cs bg-cs-surface-high border border-white/[0.06] hover:border-white/10 transition-all duration-150"
              aria-label={`${label}: ${value} ${unit}`}
            >
              <div
                className="w-9 h-9 rounded-cs flex items-center justify-center shrink-0"
                style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                aria-hidden="true"
              >
                <Icon size={16} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono font-bold text-lg text-cs-text leading-none">
                  {value}
                </p>
                <p className="cs-label mt-0.5 uppercase">{label}</p>
              </div>
            </article>
          );
        })}
      </div>

      {/* Recalculate action */}
      <button
        type="button"
        className="cs-btn-ghost w-full mt-4 text-xs"
        aria-label="Recalculate carbon equivalency baseline"
      >
        Recalculate Baseline
      </button>
    </section>
  );
}

EquivalencyGrid.propTypes = {
  /** Total monthly footprint in kg CO2e */
  kgCO2e: PropTypes.number,
};

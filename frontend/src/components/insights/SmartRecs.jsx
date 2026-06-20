/**
 * SmartRecs — Impact cards with action vectors.
 * Dynamically generated from carbon activity breakdown.
 */

import { useMemo } from 'react';
import { ChevronRight } from 'lucide-react';
import { calcSmartRecommendations } from '../../utils/carbonEngine';

/** @param {{ activities: Object }} props */
export default function SmartRecs({ activities }) {
  const recs = useMemo(
    () => calcSmartRecommendations(activities),
    [activities]
  );

  return (
    <section aria-label="Smart recommendations">
      <div className="flex items-center justify-between mb-4">
        <p className="cs-label">Smart Recommendations</p>
        <span className="cs-badge">{recs.length} Tasks Ready</span>
      </div>

      <ul className="space-y-2" role="list">
        {recs.map((rec, i) => (
          <li key={i}>
            <button
              type="button"
              className="w-full flex items-center gap-3 p-3.5 rounded-cs bg-cs-surface-high border border-white/[0.06]
                         hover:border-white/12 hover:bg-cs-surface-top transition-all duration-150 text-left group"
              aria-label={`Recommendation: ${rec.title} — ${rec.potentialReduction}% potential impact reduction`}
            >
              {/* Color dot */}
              <span
                className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                style={{ background: rec.color, boxShadow: `0 0 6px ${rec.color}60` }}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cs-text">{rec.title}</p>
                <p className="cs-label mt-0.5">{rec.category}</p>
              </div>

              {/* Impact */}
              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-sm text-cs-primary">
                  -{String(rec.potentialReduction).padStart(2, '0')}%
                </p>
                <p className="cs-label">Potential Impact</p>
              </div>

              <ChevronRight
                size={14}
                className="text-cs-text-muted group-hover:text-cs-text transition-colors shrink-0"
                aria-hidden="true"
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

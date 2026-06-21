/**
 * MetricCard — Reusable tech-styled data readout component.
 * Used across Dashboard and Insights for sector breakdowns.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon    — Lucide icon node
 * @param {string}  props.label          — Category label (CAPS)
 * @param {number}  props.value          — kg CO2e value
 * @param {number}  props.maxValue       — max for sector bar (default 500)
 * @param {string}  props.accentColor    — hex color for the sector bar fill
 * @param {number}  [props.weekData]     — optional 7-point weekly array for mini bar chart
 */
export default function MetricCard({
  icon,
  label,
  value = 0,
  maxValue = 500,
  accentColor = '#10B981',
  weekData,
}) {
  // memoize bar fill percentage
  const fillPct = useMemo(
    () => Math.min(100, (value / maxValue) * 100),
    [value, maxValue]
  );

  // Default 7-bar week data if not provided
  const bars = useMemo(() => {
    if (weekData) return weekData;
    // generate slight variation for visual demo
    return Array.from({ length: 7 }, (_, i) => {
      const base = value / 7;
      return base + (Math.sin(i * 1.2 + value) * base * 0.3);
    });
  }, [weekData, value]);

  const barMax = Math.max(...bars);

  return (
    <article
      className="cs-card flex flex-col gap-3 hover:shadow-card group"
      aria-label={`${label} emissions: ${value} kg CO2e`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-cs bg-cs-surface-high border border-white/[0.06] flex items-center justify-center text-cs-primary"
          aria-hidden="true"
        >
          {icon}
        </div>
        <span className="font-mono font-semibold text-xl text-cs-text">
          {value} <span className="text-sm text-cs-text-muted font-normal">kg</span>
        </span>
      </div>

      {/* Label */}
      <p className="cs-label">{label}</p>

      {/* Mini bar chart */}
      <figure
        className="flex items-end gap-0.5 h-8"
        aria-label={`Weekly ${label} trend chart`}
      >
        {bars.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all duration-300"
            style={{
              height:     `${Math.max(8, (v / barMax) * 100)}%`,
              background: i === bars.length - 1 ? accentColor : '#262a35',
              boxShadow:  i === bars.length - 1 ? `0 0 6px ${accentColor}50` : 'none',
            }}
          />
        ))}
      </figure>

      {/* Progress bar */}
      <div className="cs-progress-track" aria-hidden="true">
        <div
          className="cs-progress-fill"
          style={{ width: `${fillPct}%`, background: accentColor }}
        />
      </div>
    </article>
  );
}

MetricCard.propTypes = {
  /** Lucide icon node */
  icon:        PropTypes.node.isRequired,
  /** Category label (CAPS) */
  label:       PropTypes.string.isRequired,
  /** kg CO2e value */
  value:       PropTypes.number,
  /** Max value for sector bar */
  maxValue:    PropTypes.number,
  /** Hex color for the sector bar fill */
  accentColor: PropTypes.string,
  /** Optional 7-point weekly array for mini bar chart */
  weekData:    PropTypes.arrayOf(PropTypes.number),
};

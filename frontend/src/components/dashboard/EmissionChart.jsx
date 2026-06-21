/**
 * EmissionChart — SVG-based area chart using Recharts.
 * Shows the 30-day emission timeline vs national average.
 */

import { useMemo, lazy, Suspense } from 'react';

const AreaChart = lazy(() => import('recharts').then(m => ({ default: m.AreaChart })));
const Area = lazy(() => import('recharts').then(m => ({ default: m.Area })));
const XAxis = lazy(() => import('recharts').then(m => ({ default: m.XAxis })));
const YAxis = lazy(() => import('recharts').then(m => ({ default: m.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(m => ({ default: m.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(m => ({ default: m.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })));
const ReferenceLine = lazy(() => import('recharts').then(m => ({ default: m.ReferenceLine })));

const NATIONAL_AVG = 560; // kg CO2e/month average
const DEFAULT_DATA = [];
const CHART_TICK_STYLE = { fill: '#86948a', fontSize: 10, fontFamily: 'JetBrains Mono' };

/** Custom tooltip matching the terminal aesthetic */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="cs-card !p-3 !rounded-cs border-cs-primary/30 shadow-neon text-xs font-mono">
      <p className="text-cs-text-muted mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="text-cs-text font-semibold">{p.value} kg</span>
        </p>
      ))}
    </div>
  );
};

/**
 * @param {{ data: Array<{date, kg}>, currentFootprint: number }} props
 */
export default function EmissionChart({ data = DEFAULT_DATA, currentFootprint = 420 }) {
  // Merge user data with national average line
  const chartData = useMemo(() =>
    data.map(d => ({
      ...d,
      national: NATIONAL_AVG,
      target:   Math.round(currentFootprint * 0.75), // -25% target
    })),
    [data, currentFootprint]
  );

  return (
    <section
      className="cs-card"
      aria-label="Monthly emission timeline chart"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <p className="cs-label mb-1">Current Monthly Footprint</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-bold text-5xl text-cs-primary">
              {currentFootprint}
            </span>
            <span className="font-mono text-xl text-cs-text-muted">kg CO₂e</span>
          </div>
          <p className="text-xs text-cs-primary mt-1 font-mono">
            ↘ -12.4% vs last month
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="cs-dot-live" aria-hidden="true" />
          <span className="cs-label text-cs-primary">Live Data Stream</span>
        </div>
      </div>

      {/* Chart */}
      <figure className="h-48" aria-label="30-day carbon emissions area chart">
        <Suspense fallback={<div className="h-full flex items-center justify-center font-mono text-xs text-cs-text-muted">LOADING DATA CHART…</div>}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="emissionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="nationalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60A5FA" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={CHART_TICK_STYLE}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={CHART_TICK_STYLE}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Target line */}
              <ReferenceLine
                y={Math.round(currentFootprint * 0.75)}
                stroke="rgba(16,185,129,0.2)"
                strokeDasharray="4 4"
                label={{ value: 'TARGET', fill: '#86948a', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              />
              {/* National average */}
              <Area
                type="monotone"
                dataKey="national"
                name="National Avg"
                stroke="#60A5FA"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fill="url(#nationalGrad)"
                dot={false}
              />
              {/* User emissions */}
              <Area
                type="monotone"
                dataKey="kg"
                name="You"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#emissionGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#10B981', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Suspense>
      </figure>

      {/* Legend */}
      <div className="flex gap-4 mt-3" aria-label="Chart legend">
        {[
          { color: '#10B981', label: 'You' },
          { color: '#60A5FA', label: 'National Avg', dashed: true },
          { color: '#10B981', label: 'Target', dashed: true, opacity: 0.4 },
        ].map(({ color, label, dashed, opacity = 1 }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div
              className="w-5 h-px"
              style={{
                background:    color,
                opacity,
                borderTop:     dashed ? `1.5px dashed ${color}` : 'none',
                height:        dashed ? 0 : '1.5px',
              }}
            />
            <span className="cs-label text-[10px]">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * StreakTracker — Daily micro-habit checklist module.
 * Shows streak count, offset progress, and habit checkboxes.
 */

import { useState } from 'react';
import { Bus, Leaf, Zap } from 'lucide-react';

const DEFAULT_HABITS = [
  { id: 'public_transit', label: 'Public Transit',    Icon: Bus,  defaultChecked: true  },
  { id: 'meatless_meal',  label: 'Meatless Meal',     Icon: Leaf, defaultChecked: true  },
  { id: 'zero_standby',   label: 'Zero Standby Power',Icon: Zap,  defaultChecked: false },
];

/** @param {{ streakDays: number }} props */
export default function StreakTracker({ streakDays = 14 }) {
  const [habits, setHabits] = useState(DEFAULT_HABITS);

  const checkedCount = habits.filter(h => h.defaultChecked).length;
  const offsetPct    = Math.round((checkedCount / habits.length) * 100);

  const toggle = (id) => {
    setHabits(prev =>
      prev.map(h => h.id === id ? { ...h, defaultChecked: !h.defaultChecked } : h)
    );
  };

  return (
    <aside className="cs-card flex flex-col gap-4" aria-label="Daily habit tracker">
      {/* Streak header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="cs-label">Daily Progress</p>
          <p className="font-geist font-bold text-2xl text-cs-text mt-0.5">
            {streakDays} Day<br />Streak
          </p>
        </div>
      </div>

      {/* Offset progress */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <p className="cs-label">Offset Progress</p>
          <span className="font-mono text-xs text-cs-primary font-semibold">{offsetPct}%</span>
        </div>
        <div
          className="cs-progress-track"
          role="progressbar"
          aria-valuenow={offsetPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Offset progress: ${offsetPct}%`}
        >
          <div className="cs-progress-fill" style={{ width: `${offsetPct}%` }} />
        </div>
      </div>

      {/* Habit list */}
      <section aria-label="Today's habits">
        <p className="cs-label mb-3">Today's Habits</p>
        <ul className="space-y-3" role="list">
          {habits.map(({ id, label, Icon, defaultChecked }) => (
            <li key={id} className="flex items-center gap-3">
              <Icon
                size={16}
                className={defaultChecked ? 'text-cs-primary' : 'text-cs-text-muted'}
                aria-hidden="true"
              />
              <span className={`flex-1 text-sm ${defaultChecked ? 'text-cs-text' : 'text-cs-text-muted'}`}>
                {label}
              </span>
              <input
                type="checkbox"
                id={`habit-${id}`}
                checked={defaultChecked}
                onChange={() => toggle(id)}
                aria-label={`Mark ${label} habit as complete`}
              />
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

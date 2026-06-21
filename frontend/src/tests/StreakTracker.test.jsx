/**
 * Unit Tests — StreakTracker.jsx
 * Verifies habit rendering, toggle interactions, and offset progress calculation.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from '@testing-library/react';
import StreakTracker from '../components/dashboard/StreakTracker';

describe('StreakTracker — Rendering', () => {
  it('renders the streak day count correctly', () => {
    render(<StreakTracker streakDays={14} />);
    // The streak days appear in a paragraph as "14 Day Streak" — split by <br>
    // Use regex to match the number within the surrounding text
    expect(screen.getByText(/14/)).toBeInTheDocument();
    expect(screen.getByText(/Streak/i)).toBeInTheDocument();
  });

  it('renders default streak of 14 when no prop provided', () => {
    render(<StreakTracker />);
    expect(screen.getByText(/14/)).toBeInTheDocument();
  });

  it('renders all three default habits', () => {
    render(<StreakTracker streakDays={7} />);
    expect(screen.getByLabelText(/Public Transit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meatless Meal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Zero Standby Power/i)).toBeInTheDocument();
  });

  it('renders Offset Progress label and progress bar', () => {
    render(<StreakTracker streakDays={5} />);
    expect(screen.getByLabelText(/Offset progress/i)).toBeInTheDocument();
  });

  it('initially shows 67% offset (2 of 3 habits checked)', () => {
    render(<StreakTracker streakDays={10} />);
    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});

describe('StreakTracker — Habit Toggle', () => {
  it('checking unchecked habit increases offset percentage', async () => {
    render(<StreakTracker streakDays={3} />);

    // Initially 2/3 = 67%
    expect(screen.getByText('67%')).toBeInTheDocument();

    const zeroPowerCheck = screen.getByLabelText(/Zero Standby Power/i);

    await act(async () => {
      await userEvent.click(zeroPowerCheck);
    });

    // After checking: 3/3 = 100%
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('unchecking a checked habit decreases offset percentage', async () => {
    render(<StreakTracker streakDays={3} />);

    // Initially 2/3 = 67%
    expect(screen.getByText('67%')).toBeInTheDocument();

    const transitCheck = screen.getByLabelText(/Public Transit/i);

    await act(async () => {
      await userEvent.click(transitCheck);
    });

    // After unchecking: 1/3 = 33%
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('toggling the same habit twice returns to original offset', async () => {
    render(<StreakTracker streakDays={3} />);
    const zeroPowerCheck = screen.getByLabelText(/Zero Standby Power/i);

    await act(async () => {
      await userEvent.click(zeroPowerCheck);
    });
    expect(screen.getByText('100%')).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(zeroPowerCheck);
    });
    expect(screen.getByText('67%')).toBeInTheDocument();
  });
});

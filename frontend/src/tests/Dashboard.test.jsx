import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../pages/Dashboard';
import { CarbonProtocolProvider } from '../context/CarbonProtocolContext';

// Mock Firebase imports
vi.mock('../firebase/firebaseConfig', () => ({
  auth: {},
  db:   {},
  default: {},
}));

vi.mock('../firebase/auth', () => ({
  signOut: vi.fn(),
}));

vi.mock('../firebase/db', () => ({
  getUserState:           vi.fn().mockResolvedValue(null),
  saveUserState:          vi.fn().mockResolvedValue(undefined),
  getCachedState:         vi.fn().mockReturnValue(null),
  updateLeaderboardEntry: vi.fn().mockResolvedValue(undefined),
  getUserProfile:         vi.fn().mockResolvedValue(null),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  NavLink:     ({ children }) => children,
}));

// Mock Recharts responsive container to prevent layout sizing errors in jsdom
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }) => children,
  };
});

function renderDashboard() {
  return render(
    <CarbonProtocolProvider initialUser={{ uid: 'test-uid', displayName: 'Test' }} initialProfile={null} skipLoad={true}>
      <Dashboard />
    </CarbonProtocolProvider>
  );
}

describe('Dashboard Component Integration Tests', () => {
  it('renders system overview page header and active protocol version', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { name: 'System Overview' })).toBeInTheDocument();
    expect(screen.getByText('PROTOCOL: V4.2 / LOC: EPSG:4326')).toBeInTheDocument();
  });

  it('renders all four sector breakdown metric cards with names', () => {
    renderDashboard();
    expect(screen.getByText('TRANSPORTATION')).toBeInTheDocument();
    expect(screen.getByText('HOME ENERGY')).toBeInTheDocument();
    expect(screen.getByText('FOOD CONSUMPTION')).toBeInTheDocument();
    expect(screen.getByText('SHOPPING & WASTE')).toBeInTheDocument();
  });

  it('renders active regeneration targets description and offset', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { name: 'Regeneration Target' })).toBeInTheDocument();
    expect(screen.getByText(/-25% CO₂e/i)).toBeInTheDocument();
  });

  it('renders active carbon sink list items and providers', () => {
    renderDashboard();
    expect(screen.getByRole('heading', { name: 'Carbon Sink Activity' })).toBeInTheDocument();
    expect(screen.getByText('Mangrove Reforestation')).toBeInTheDocument();
    expect(screen.getByText('Direct Air Capture')).toBeInTheDocument();
    expect(screen.getByText('Operator: Climeworks')).toBeInTheDocument();
  });
});

/**
 * Unit & Integration Tests — Landing.jsx
 * Verifies that the Landing page renders correctly, handles login/register toggling,
 * displays active session state, and triggers proper auth hooks.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Landing from '../pages/Landing';

// Mock Firebase config & auth to prevent database network requests during tests
vi.mock('../firebase/firebaseConfig', () => ({
  auth: {},
  db:   {},
  default: {},
}));

const mockSignInWithEmail = vi.fn().mockResolvedValue({});
const mockSignUpWithEmail = vi.fn().mockResolvedValue({});
const mockSignInWithGoogle = vi.fn().mockResolvedValue({});

vi.mock('../firebase/auth', () => ({
  signInWithEmail: (...args) => mockSignInWithEmail(...args),
  signUpWithEmail: (...args) => mockSignUpWithEmail(...args),
  signInWithGoogle: (...args) => mockSignInWithGoogle(...args),
}));

// Mock react-router-dom navigate hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

function renderLanding(isLoggedIn = false) {
  return render(<Landing isLoggedIn={isLoggedIn} />);
}

describe('Landing Page Component', () => {
  it('renders the header logo and main telemetry title', () => {
    renderLanding();
    expect(screen.getAllByText('CarbonSense')[0]).toBeInTheDocument();
    expect(screen.getByText('Precision Carbon')).toBeInTheDocument();
    expect(screen.getByText('Telemetry.')).toBeInTheDocument();
  });

  it('renders key metrics counters', () => {
    renderLanding();
    expect(screen.getByText('TELEMETRY PRECISION')).toBeInTheDocument();
    expect(screen.getByText('99.9%')).toBeInTheDocument();
    expect(screen.getByText('CO₂e MITIGATED')).toBeInTheDocument();
    expect(screen.getByText('42.8 t')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE NODES')).toBeInTheDocument();
    expect(screen.getByText('1,420')).toBeInTheDocument();
  });

  it('defaults to Sign In authentication tab', () => {
    renderLanding();
    const emailInput = screen.getByPlaceholderText('user@domain.com');
    expect(emailInput).toBeInTheDocument();
    
    const submitBtn = screen.getByRole('button', { name: /Synchronize Terminal/i });
    expect(submitBtn).toBeInTheDocument();
    expect(screen.queryByLabelText('Display Name')).not.toBeInTheDocument();
  });

  it('switches to Create Account tab when clicked', async () => {
    renderLanding();
    const createAccountTab = screen.getByRole('tab', { name: 'Create Account' });
    
    await act(async () => {
      await userEvent.click(createAccountTab);
    });

    expect(screen.getByRole('button', { name: /Create Node Profile/i })).toBeInTheDocument();
    expect(screen.getByText('Display Name')).toBeInTheDocument();
  });

  it('triggers signInWithEmail on sign-in form submit', async () => {
    renderLanding();
    const emailInput = screen.getByPlaceholderText('user@domain.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const submitBtn = screen.getByRole('button', { name: /Synchronize Terminal/i });

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@carbonsense.org' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    expect(mockSignInWithEmail).toHaveBeenCalledWith('test@carbonsense.org', 'password123');
  });

  it('renders control panel connect when user is logged in', () => {
    renderLanding(true);
    expect(screen.getByText('Terminal Connected')).toBeInTheDocument();
    expect(screen.getByText(/Your node session is currently active/i)).toBeInTheDocument();
    
    const enterBtn = screen.getByRole('button', { name: /Enter Control Panel/i });
    expect(enterBtn).toBeInTheDocument();
  });

  it('navigates to dashboard when Enter Control Panel is clicked', async () => {
    renderLanding(true);
    const enterBtn = screen.getByRole('button', { name: /Enter Control Panel/i });
    
    await act(async () => {
      await userEvent.click(enterBtn);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

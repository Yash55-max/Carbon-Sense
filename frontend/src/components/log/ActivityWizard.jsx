/**
 * ActivityWizard — Multi-step carbon activity logging wizard.
 * Step 1: Transit | Step 2: Energy | Step 3: Lifestyle
 * Real-time emission preview updates instantly on slider change (useMemo).
 */

import { useReducer, useMemo, useId, useEffect } from 'react';
import { Car, Zap, UtensilsCrossed, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import {
  calcTransitEmissions,
  calcEnergyEmissions,
  calcFoodEmissions,
  calcShoppingEmissions,
  validateDistance,
  validateEnergy,
} from '../../utils/carbonEngine';
import { useCarbonProtocol } from '../../context/CarbonProtocolContext';

// ─── Vehicle type data ────────────────────────────────────────────────────────
const VEHICLE_TYPES = [
  { id: 'ev', label: 'EV', Icon: Zap, factor: 0.053 },
  { id: 'petrol', label: 'Petrol', Icon: Car, factor: 0.210 },
  { id: 'transit', label: 'Transit', Icon: UtensilsCrossed, factor: 0.089 },
  { id: 'flight', label: 'Flight', Icon: ChevronRight, factor: 0.255 },
];

const DIET_TYPES = [
  { id: 'meatHeavy', label: 'Meat-Heavy' },
  { id: 'omnivore', label: 'Omnivore' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
];

const SHOPPING_LEVELS = [
  { id: 'low', label: 'Minimal' },
  { id: 'medium', label: 'Moderate' },
  { id: 'high', label: 'High' },
];

const STEPS = ['Transit Data', 'Home Energy', 'Lifestyle'];

const initialState = {
  step: 0,
  submitted: false,
  vehicleType: 'petrol',
  distance: 42,
  dailyKwh: 12,
  isRenewable: false,
  dietType: 'omnivore',
  shopping: 'medium',
};

function wizardReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.payload };
    case 'SET_SUBMITTED':
      return { ...state, submitted: action.payload };
    case 'SET_VEHICLE_TYPE':
      return { ...state, vehicleType: action.payload };
    case 'SET_DISTANCE':
      return { ...state, distance: action.payload };
    case 'SET_DAILY_KWH':
      return { ...state, dailyKwh: action.payload };
    case 'SET_IS_RENEWABLE':
      return { ...state, isRenewable: action.payload };
    case 'SET_DIET_TYPE':
      return { ...state, dietType: action.payload };
    case 'SET_SHOPPING':
      return { ...state, shopping: action.payload };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

export default function ActivityWizard() {
  const { dispatch, ACTIONS } = useCarbonProtocol();
  const baseId = useId();

  const [state, localDispatch] = useReducer(wizardReducer, initialState);
  const { step, submitted, vehicleType, distance, dailyKwh, isRenewable, dietType, shopping } = state;

  // ── Real-time emission preview (memoized) ──────────────────────────────────
  const preview = useMemo(() => {
    const transit = calcTransitEmissions(vehicleType, distance);
    const energy = calcEnergyEmissions(dailyKwh, isRenewable);
    const food = calcFoodEmissions(dietType);
    const shop = calcShoppingEmissions(shopping);
    const total = transit + energy + food + shop;
    return {
      transit, energy, food, shopping: shop,
      total: parseFloat(total.toFixed(2)),
      tons: parseFloat((total / 1000).toFixed(3)),
    };
  }, [vehicleType, distance, dailyKwh, isRenewable, dietType, shopping]);

  // Sync draft activities to context state dynamically
  useEffect(() => {
    dispatch({
      type: ACTIONS.UPDATE_DRAFT_ACTIVITIES,
      payload: {
        transit: preview.transit,
        energy: preview.energy,
        food: preview.food,
        shopping: preview.shopping,
      },
    });
  }, [preview, dispatch, ACTIONS]);

  // ── Secure input handlers ──────────────────────────────────────────────────
  const handleDistance = (e) => localDispatch({ type: 'SET_DISTANCE', payload: validateDistance(e.target.value) });
  const handleKwh = (e) => localDispatch({ type: 'SET_DAILY_KWH', payload: validateEnergy(e.target.value) });

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    dispatch({
      type: ACTIONS.UPDATE_ACTIVITIES,
      payload: {
        transit: preview.transit,
        energy: preview.energy,
        food: preview.food,
        shopping: preview.shopping,
      },
    });
    localDispatch({ type: 'SET_SUBMITTED', payload: true });
    setTimeout(() => {
      localDispatch({ type: 'RESET' });
    }, 3000);
  };

  if (submitted) {
    return <SubmittedScreen />;
  }

  return (
    <div className="cs-card animate-slide-up">
      <StepIndicator step={step} />

      {/* ── Step 1: Transit ── */}
      {step === 0 && (
        <TransitStep
          vehicleType={vehicleType}
          setVehicleType={(val) => localDispatch({ type: 'SET_VEHICLE_TYPE', payload: val })}
          distance={distance}
          handleDistance={handleDistance}
          baseId={baseId}
        />
      )}

      {/* ── Step 2: Energy ── */}
      {step === 1 && (
        <EnergyStep
          dailyKwh={dailyKwh}
          handleKwh={handleKwh}
          isRenewable={isRenewable}
          setIsRenewable={(val) => localDispatch({ type: 'SET_IS_RENEWABLE', payload: val })}
          baseId={baseId}
        />
      )}

      {/* ── Step 3: Lifestyle ── */}
      {step === 2 && (
        <LifestyleStep
          dietType={dietType}
          setDietType={(val) => localDispatch({ type: 'SET_DIET_TYPE', payload: val })}
          shopping={shopping}
          setShopping={(val) => localDispatch({ type: 'SET_SHOPPING', payload: val })}
          baseId={baseId}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-white/[0.06]">
        {step > 0 ? (
          <button type="button" className="cs-btn-ghost flex items-center gap-2" onClick={() => localDispatch({ type: 'SET_STEP', payload: step - 1 })}>
            <ChevronLeft size={16} aria-hidden="true" /> Back
          </button>
        ) : <div />}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            id="wizard-next-btn"
            className="cs-btn-primary flex items-center gap-2"
            onClick={() => localDispatch({ type: 'SET_STEP', payload: step + 1 })}
          >
            Execute Next Phase <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            id="wizard-submit-btn"
            className="cs-btn-primary flex items-center gap-2"
            onClick={handleSubmit}
          >
            Commit Data <CheckCircle2 size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Subcomponents ──────────────────────────────────────────────────────────

function SubmittedScreen() {
  return (
    <div className="cs-card flex flex-col items-center justify-center gap-4 py-16 animate-fade-in">
      <CheckCircle2 size={48} className="text-cs-primary" aria-hidden="true" />
      <h2 className="font-geist font-bold text-2xl text-cs-text">Data Committed</h2>
      <p className="text-cs-text-muted text-sm font-mono">
        Your carbon state has been updated. Click Sync API to persist.
      </p>
    </div>
  );
}

function StepIndicator({ step }) {
  return (
    <div className="flex items-center gap-2 mb-6" aria-label="Wizard progress">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-6 h-6 rounded-cs flex items-center justify-center text-xs font-mono font-semibold
              ${i === step ? 'bg-cs-primary text-cs-bg' : i < step ? 'bg-cs-primary/20 text-cs-primary' : 'bg-cs-surface-top text-cs-text-muted'}`}
            aria-current={i === step ? 'step' : undefined}
          >
            {i < step ? '✓' : i + 1}
          </div>
          <span className={`text-sm hidden sm:block ${i === step ? 'text-cs-text' : 'text-cs-text-muted'}`}>
            {s}
          </span>
          {i < STEPS.length - 1 && <div className="w-8 h-px bg-cs-surface-top" aria-hidden="true" />}
        </div>
      ))}
      <span className="ml-auto cs-label">Section {step + 1}/{STEPS.length}</span>
    </div>
  );
}

function TransitStep({ vehicleType, setVehicleType, distance, handleDistance, baseId }) {
  return (
    <section aria-labelledby={`${baseId}-transit-heading`} className="space-y-6">
      <h2 id={`${baseId}-transit-heading`} className="font-geist font-bold text-2xl text-cs-text">
        Transit Data
      </h2>

      {/* Vehicle type selector */}
      <fieldset>
        <legend className="cs-label mb-3">Vehicle Classification</legend>
        <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Vehicle type">
          {VEHICLE_TYPES.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={vehicleType === id}
              onClick={() => setVehicleType(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-cs border transition-all duration-150 text-sm font-mono cursor-pointer
                ${vehicleType === id
                  ? 'border-cs-primary bg-cs-primary/10 text-cs-primary shadow-neon'
                  : 'border-white/[0.08] bg-cs-surface-high text-cs-text-muted hover:border-white/20 hover:text-cs-text'
                }`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Distance slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={`${baseId}-distance`} className="cs-label">Travel Distance</label>
          <span className="font-mono font-semibold text-cs-primary">
            {distance} <span className="text-cs-text-muted text-xs">km</span>
          </span>
        </div>
        <input
          id={`${baseId}-distance`}
          type="range"
          min="0"
          max="500"
          step="1"
          value={distance}
          onChange={handleDistance}
          aria-label="Log daily transit distance in kilometers"
          aria-valuemin={0}
          aria-valuemax={500}
          aria-valuenow={distance}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #10B981 ${(distance / 500) * 100}%, #262a35 ${(distance / 500) * 100}%)`,
          }}
        />
        <div className="flex justify-between cs-label mt-1" aria-hidden="true">
          <span>0 KM</span><span>250 KM</span><span>500 KM</span>
        </div>
      </div>
    </section>
  );
}

function EnergyStep({ dailyKwh, handleKwh, isRenewable, setIsRenewable, baseId }) {
  return (
    <section aria-labelledby={`${baseId}-energy-heading`} className="space-y-6">
      <h2 id={`${baseId}-energy-heading`} className="font-geist font-bold text-2xl text-cs-text">
        Home Energy
      </h2>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor={`${baseId}-kwh`} className="cs-label">Daily Energy Usage</label>
          <span className="font-mono font-semibold text-cs-primary">
            {dailyKwh} <span className="text-cs-text-muted text-xs">kWh</span>
          </span>
        </div>
        <input
          id={`${baseId}-kwh`}
          type="range"
          min="0"
          max="100"
          step="1"
          value={dailyKwh}
          onChange={handleKwh}
          aria-label="Log daily home energy usage in kilowatt-hours"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={dailyKwh}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #10B981 ${(dailyKwh / 100) * 100}%, #262a35 ${(dailyKwh / 100) * 100}%)`,
          }}
        />
        <div className="flex justify-between cs-label mt-1" aria-hidden="true">
          <span>0 kWh</span><span>50 kWh</span><span>100 kWh</span>
        </div>
      </div>

      {/* Renewable toggle */}
      <div className="flex items-center justify-between p-3 rounded-cs bg-cs-surface-high border border-white/[0.06]">
        <div>
          <p className="text-sm font-inter text-cs-text">Renewable Energy Source</p>
          <p className="text-xs text-cs-text-muted font-mono">Solar / Wind / Hydro</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={isRenewable}
          aria-label="Toggle renewable energy source"
          onClick={() => setIsRenewable(!isRenewable)}
          className={`relative w-10 h-5 rounded-sm border-2 transition-all duration-200 cursor-pointer
            ${isRenewable ? 'bg-cs-primary border-cs-primary' : 'bg-cs-surface-top border-cs-surface-top'}`}
        >
          <span
            className={`absolute top-0.5 w-3 h-3 rounded-sm bg-white transition-all duration-200
              ${isRenewable ? 'left-5' : 'left-0.5'}`}
          />
        </button>
      </div>
    </section>
  );
}

function LifestyleStep({ dietType, setDietType, shopping, setShopping, baseId }) {
  return (
    <section aria-labelledby={`${baseId}-lifestyle-heading`} className="space-y-6">
      <h2 id={`${baseId}-lifestyle-heading`} className="font-geist font-bold text-2xl text-cs-text">
        Lifestyle Inputs
      </h2>

      {/* Diet */}
      <fieldset>
        <legend className="cs-label mb-3">Dietary Pattern</legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Dietary Pattern">
          {DIET_TYPES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={dietType === id}
              onClick={() => setDietType(id)}
              className={`p-3 rounded-cs border text-sm font-mono transition-all duration-150 cursor-pointer
                ${dietType === id
                  ? 'border-cs-primary bg-cs-primary/10 text-cs-primary'
                  : 'border-white/[0.08] bg-cs-surface-high text-cs-text-muted hover:border-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Shopping */}
      <fieldset>
        <legend className="cs-label mb-3">Shopping & Consumption Level</legend>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Shopping & Consumption Level">
          {SHOPPING_LEVELS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={shopping === id}
              onClick={() => setShopping(id)}
              className={`p-3 rounded-cs border text-sm font-mono transition-all duration-150 cursor-pointer
                ${shopping === id
                  ? 'border-cs-primary bg-cs-primary/10 text-cs-primary'
                  : 'border-white/[0.08] bg-cs-surface-high text-cs-text-muted hover:border-white/20'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </fieldset>
    </section>
  );
}

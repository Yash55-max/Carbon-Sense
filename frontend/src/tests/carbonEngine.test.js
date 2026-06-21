/**
 * Unit Tests — carbonEngine.js
 * Validates the mathematical conversion logic for all emission calculations.
 */

import { describe, it, expect } from 'vitest';
import {
  calcEquivalency,
  calcTransitEmissions,
  calcEnergyEmissions,
  calcFoodEmissions,
  calcShoppingEmissions,
  calcTotalFootprint,
  validateDistance,
  validateNumericInput,
  calcPercentChange,
  calcSmartRecommendations,
  generateMockHistory,
} from '../utils/carbonEngine';

// ─── Input Validation ─────────────────────────────────────────────────────────

describe('validateDistance', () => {
  it('clamps negative values to 0', () => {
    expect(validateDistance(-10)).toBe(0);
  });
  it('clamps values above 500 to 500', () => {
    expect(validateDistance(9999)).toBe(500);
  });
  it('passes valid values through', () => {
    expect(validateDistance(42)).toBe(42);
  });
  it('handles NaN gracefully', () => {
    expect(validateDistance(NaN)).toBe(0);
  });
  it('handles string "42" as numeric 42', () => {
    expect(validateDistance('42')).toBe(42);
  });
});

describe('validateNumericInput', () => {
  it('respects custom min/max bounds', () => {
    expect(validateNumericInput(150, 0, 100)).toBe(100);
    expect(validateNumericInput(-5, 0, 100)).toBe(0);
    expect(validateNumericInput(50, 0, 100)).toBe(50);
  });
});

// ─── Transit Calculations ─────────────────────────────────────────────────────

describe('calcTransitEmissions', () => {
  it('calculates petrol emissions correctly at 42 km/day', () => {
    // 0.210 kg/km × 42 km × 30 days = 264.6 kg
    expect(calcTransitEmissions('petrol', 42)).toBeCloseTo(264.6, 1);
  });

  it('calculates EV emissions (lower than petrol)', () => {
    const ev     = calcTransitEmissions('ev',     42);
    const petrol = calcTransitEmissions('petrol', 42);
    expect(ev).toBeLessThan(petrol);
  });

  it('returns 0 for zero distance', () => {
    expect(calcTransitEmissions('petrol', 0)).toBe(0);
  });

  it('uses petrol factor as default for unknown vehicle type', () => {
    const unknown = calcTransitEmissions('unknown', 10);
    const petrol  = calcTransitEmissions('petrol',  10);
    expect(unknown).toBe(petrol);
  });

  it('clamps distance input via validation', () => {
    const bounded = calcTransitEmissions('petrol', 9999);
    const capped  = calcTransitEmissions('petrol', 500);
    expect(bounded).toBe(capped);
  });
});

// ─── Energy Calculations ──────────────────────────────────────────────────────

describe('calcEnergyEmissions', () => {
  it('uses grid factor by default', () => {
    // 0.475 kg/kWh × 12 kWh × 30 = 171 kg
    expect(calcEnergyEmissions(12, false)).toBeCloseTo(171, 0);
  });
  it('uses renewable factor when flag is true (must be lower)', () => {
    const grid      = calcEnergyEmissions(12, false);
    const renewable = calcEnergyEmissions(12, true);
    expect(renewable).toBeLessThan(grid);
  });
});

// ─── Food Calculations ────────────────────────────────────────────────────────

describe('calcFoodEmissions', () => {
  it('vegan diet has lowest emissions', () => {
    const vegan    = calcFoodEmissions('vegan');
    const meatHeavy= calcFoodEmissions('meatHeavy');
    expect(vegan).toBeLessThan(meatHeavy);
  });
  it('defaults to omnivore for unknown diet', () => {
    const unknown  = calcFoodEmissions('unknown');
    const omnivore = calcFoodEmissions('omnivore');
    expect(unknown).toBe(omnivore);
  });
});

// ─── Total Footprint ──────────────────────────────────────────────────────────

describe('calcTotalFootprint', () => {
  it('sums all activity sectors correctly', () => {
    const activities = { transit: 42, energy: 185, food: 68, shopping: 25 };
    expect(calcTotalFootprint(activities)).toBe(320);
  });
  it('handles missing sectors as 0', () => {
    expect(calcTotalFootprint({ transit: 100 })).toBe(100);
  });
  it('handles all zeros', () => {
    expect(calcTotalFootprint({ transit: 0, energy: 0, food: 0, shopping: 0 })).toBe(0);
  });
});

// ─── Equivalency Engine ───────────────────────────────────────────────────────

describe('calcEquivalency', () => {
  it('correctly converts 420 kg CO2e to trees planted', () => {
    // 420 / 21 = 20 trees
    const { treesPlanted } = calcEquivalency(420);
    expect(treesPlanted).toBeCloseTo(20, 1);
  });
  it('correctly converts 420 kg CO2e to phones charged', () => {
    // 420 / 0.005 = 84,000
    const { phonesCharged } = calcEquivalency(420);
    expect(phonesCharged).toBe(84000);
  });
  it('correctly converts 420 kg CO2e to km not driven', () => {
    // 420 / 0.21 = 2000
    const { kmNotDriven } = calcEquivalency(420);
    expect(kmNotDriven).toBeCloseTo(2000, 0);
  });
  it('returns zeros for 0 kg input', () => {
    const equiv = calcEquivalency(0);
    expect(equiv.treesPlanted).toBe(0);
    expect(equiv.phonesCharged).toBe(0);
  });
  it('clamps extremely large inputs', () => {
    // Should not throw or return Infinity
    const equiv = calcEquivalency(999999999);
    expect(isFinite(equiv.treesPlanted)).toBe(true);
  });
});

// ─── Percent Change ───────────────────────────────────────────────────────────

describe('calcPercentChange', () => {
  it('calculates -12.4% reduction correctly', () => {
    expect(calcPercentChange(368, 420)).toBeCloseTo(-12.4, 0);
  });
  it('handles zero previous value safely', () => {
    expect(calcPercentChange(100, 0)).toBe(0);
  });
  it('calculates positive increase correctly', () => {
    expect(calcPercentChange(500, 400)).toBeCloseTo(25, 0);
  });
});

// ─── Shopping Calculations ─────────────────────────────────────────────────

describe('calcShoppingEmissions', () => {
  it('high shopping has higher emissions than low', () => {
    const high = calcShoppingEmissions('high');
    const low  = calcShoppingEmissions('low');
    expect(high).toBeGreaterThan(low);
  });
  it('medium shopping returns 60 kg/month (2.0 * 30)', () => {
    expect(calcShoppingEmissions('medium')).toBeCloseTo(60, 1);
  });
  it('defaults to medium for unknown spending level', () => {
    const unknown = calcShoppingEmissions('unknown');
    const medium  = calcShoppingEmissions('medium');
    expect(unknown).toBe(medium);
  });
});

// ─── Smart Recommendations ─────────────────────────────────────────────────

describe('calcSmartRecommendations', () => {
  it('returns at least 3 recommendations for any input', () => {
    const activities = { transit: 42, energy: 185, food: 68, shopping: 25 };
    const recs = calcSmartRecommendations(activities);
    expect(recs.length).toBeGreaterThanOrEqual(3);
    expect(recs.length).toBeLessThanOrEqual(3);
  });

  it('each recommendation has required fields', () => {
    const activities = { transit: 200, energy: 200, food: 200, shopping: 100 };
    const recs = calcSmartRecommendations(activities);
    recs.forEach(rec => {
      expect(rec).toHaveProperty('title');
      expect(rec).toHaveProperty('category');
      expect(rec).toHaveProperty('potentialReduction');
      expect(rec).toHaveProperty('color');
    });
  });

  it('recommends transit reduction when transit > 100 kg', () => {
    const activities = { transit: 265, energy: 0, food: 0, shopping: 0 };
    const recs = calcSmartRecommendations(activities);
    const transitRec = recs.find(r => r.category === 'TRANSPORT');
    expect(transitRec).toBeDefined();
  });

  it('recommends food reduction when food > 80 kg', () => {
    const activities = { transit: 0, energy: 0, food: 135, shopping: 0 };
    const recs = calcSmartRecommendations(activities);
    const foodRec = recs.find(r => r.category === 'FOOD & DIET');
    expect(foodRec).toBeDefined();
  });

  it('potential reduction percentage is a finite positive number', () => {
    const activities = { transit: 265, energy: 171, food: 135, shopping: 60 };
    const recs = calcSmartRecommendations(activities);
    recs.forEach(rec => {
      expect(isFinite(rec.potentialReduction)).toBe(true);
      expect(rec.potentialReduction).toBeGreaterThan(0);
    });
  });
});

// ─── Mock History Generator ────────────────────────────────────────────────

describe('generateMockHistory', () => {
  it('returns exactly 30 data points', () => {
    const history = generateMockHistory(320);
    expect(history).toHaveLength(30);
  });

  it('each data point has date and kg properties', () => {
    const history = generateMockHistory(320);
    history.forEach(point => {
      expect(point).toHaveProperty('date');
      expect(point).toHaveProperty('kg');
      expect(typeof point.date).toBe('string');
      expect(typeof point.kg).toBe('number');
    });
  });

  it('all kg values are positive finite numbers', () => {
    const history = generateMockHistory(420);
    history.forEach(point => {
      expect(isFinite(point.kg)).toBe(true);
      expect(point.kg).toBeGreaterThan(0);
    });
  });

  it('kg values cluster near the provided base value', () => {
    const base = 300;
    const history = generateMockHistory(base);
    const avg = history.reduce((sum, p) => sum + p.kg, 0) / history.length;
    // Average should be within 30% of base (allowing for sin variation)
    expect(avg).toBeGreaterThan(base * 0.7);
    expect(avg).toBeLessThan(base * 1.3);
  });

  it('uses default base of 420 when called with no args', () => {
    const history = generateMockHistory();
    expect(history).toHaveLength(30);
    const avg = history.reduce((sum, p) => sum + p.kg, 0) / history.length;
    expect(avg).toBeGreaterThan(300);
    expect(avg).toBeLessThan(550);
  });
});

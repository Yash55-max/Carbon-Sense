/**
 * CarbonSense Calculation Engine
 * Pure functions — no React dependencies — fully unit-testable.
 *
 * Emission factors (kg CO2e per km or per kWh) sourced from:
 *   - IPCC AR6 (transport)
 *   - IEA Global Average Grid (energy)
 *   - FAO (food)
 */

// ─── Emission Factors ────────────────────────────────────────────────────────

export const EMISSION_FACTORS = {
  transit: {
    ev:      0.053,  // kg CO2e / km (global avg grid)
    petrol:  0.210,  // kg CO2e / km (average petrol car)
    transit: 0.089,  // kg CO2e / km (bus/rail average)
    flight:  0.255,  // kg CO2e / km (short-haul avg)
  },
  energy: {
    grid:      0.475, // kg CO2e / kWh (global avg)
    renewable: 0.025, // kg CO2e / kWh (solar/wind lifecycle)
  },
  food: {
    meatHeavy:   7.2,  // kg CO2e / day
    omnivore:    4.5,
    vegetarian:  2.5,
    vegan:       1.5,
  },
  shopping: {
    low:    0.5,   // kg CO2e / day
    medium: 2.0,
    high:   5.0,
  },
};

// ─── Security: Input Validation ──────────────────────────────────────────────

/**
 * Clamps and parses a numeric input to a safe range.
 * @param {any} value — raw user input
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const validateNumericInput = (value, min = 0, max = 500) => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return min;
  return Math.min(Math.max(min, parsed), max);
};

/** Alias for transit distance validation (TRD spec) */
export const validateDistance = (value) => validateNumericInput(value, 0, 500);

/** Validates energy kWh input */
export const validateEnergy = (value) => validateNumericInput(value, 0, 1000);

// ─── Transit Calculations ─────────────────────────────────────────────────────

/**
 * Calculate monthly transit emissions.
 * @param {'ev'|'petrol'|'transit'|'flight'} vehicleType
 * @param {number} dailyDistanceKm
 * @returns {number} kg CO2e per month
 */
export const calcTransitEmissions = (vehicleType, dailyDistanceKm) => {
  const factor = EMISSION_FACTORS.transit[vehicleType] ?? EMISSION_FACTORS.transit.petrol;
  const safeDistance = validateDistance(dailyDistanceKm);
  return parseFloat((factor * safeDistance * 30).toFixed(2));
};

// ─── Energy Calculations ──────────────────────────────────────────────────────

/**
 * Calculate monthly home energy emissions.
 * @param {number} dailyKwh
 * @param {boolean} isRenewable
 * @returns {number} kg CO2e per month
 */
export const calcEnergyEmissions = (dailyKwh, isRenewable = false) => {
  const factor = isRenewable
    ? EMISSION_FACTORS.energy.renewable
    : EMISSION_FACTORS.energy.grid;
  const safeKwh = validateEnergy(dailyKwh);
  return parseFloat((factor * safeKwh * 30).toFixed(2));
};

// ─── Food Calculations ────────────────────────────────────────────────────────

/**
 * @param {'meatHeavy'|'omnivore'|'vegetarian'|'vegan'} dietType
 * @returns {number} kg CO2e per month
 */
export const calcFoodEmissions = (dietType) => {
  const factor = EMISSION_FACTORS.food[dietType] ?? EMISSION_FACTORS.food.omnivore;
  return parseFloat((factor * 30).toFixed(2));
};

// ─── Shopping Calculations ────────────────────────────────────────────────────

/**
 * @param {'low'|'medium'|'high'} spendingLevel
 * @returns {number} kg CO2e per month
 */
export const calcShoppingEmissions = (spendingLevel) => {
  const factor = EMISSION_FACTORS.shopping[spendingLevel] ?? EMISSION_FACTORS.shopping.medium;
  return parseFloat((factor * 30).toFixed(2));
};

// ─── Total Footprint ──────────────────────────────────────────────────────────

/**
 * Sums all activity emissions into a total monthly footprint.
 * @param {{ transit, energy, food, shopping }} activities — kg CO2e per sector
 * @returns {number} total kg CO2e
 */
export const calcTotalFootprint = (activities) => {
  const { transit = 0, energy = 0, food = 0, shopping = 0 } = activities;
  return parseFloat((transit + energy + food + shopping).toFixed(2));
};

// ─── Equivalency Engine ───────────────────────────────────────────────────────

/**
 * Converts kg CO2e to real-world equivalents.
 * @param {number} kgCO2e
 * @returns {{ treesPlanted, phonesCharged, kmNotDriven, drivingDays }}
 */
export const calcEquivalency = (kgCO2e) => {
  const safe = validateNumericInput(kgCO2e, 0, 100000);
  return {
    treesPlanted:  parseFloat((safe / 21).toFixed(1)),        // 1 tree absorbs ~21 kg CO2/yr
    phonesCharged: Math.round(safe / 0.005),                  // 0.005 kWh per charge * grid factor
    kmNotDriven:   parseFloat((safe / 0.21).toFixed(1)),      // petrol car avg
    drivingDays:   parseFloat((safe / (0.21 * 40)).toFixed(1)), // 40 km avg daily drive
  };
};

// ─── Trend & Analytics ────────────────────────────────────────────────────────

/**
 * Generates 30-day mock history array with slight variation around a base value.
 * Used for chart seeding when no Firestore history exists yet.
 * @param {number} baseKg
 * @returns {Array<{date: string, kg: number}>}
 */
export const generateMockHistory = (baseKg = 420) => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - i));
    const variation = (Math.sin(i * 0.4) * 0.15 + (Math.random() - 0.5) * 0.08) * baseKg;
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      kg:   parseFloat((baseKg + variation).toFixed(1)),
    };
  });
};

/**
 * Calculates the percentage change between two values.
 * @param {number} current
 * @param {number} previous
 * @returns {number} percentage change (negative = reduction)
 */
export const calcPercentChange = (current, previous) => {
  if (previous === 0) return 0;
  return parseFloat(((current - previous) / previous * 100).toFixed(1));
};

/**
 * Calculates Smart Recommendations based on activity breakdown.
 * @param {{ transit, energy, food, shopping }} activities
 * @returns {Array<{title, category, potentialReduction, icon}>}
 */
export const calcSmartRecommendations = (activities) => {
  const total = calcTotalFootprint(activities);
  const recs = [];

  if (activities.transit > 100) {
    recs.push({
      title: 'Switch to Public Transit',
      category: 'TRANSPORT',
      potentialReduction: parseFloat(((activities.transit * 0.57) / total * 100).toFixed(0)),
      color: '#60A5FA',
    });
  }
  if (activities.food > 80) {
    recs.push({
      title: 'Reduce Meat Consumption',
      category: 'FOOD & DIET',
      potentialReduction: parseFloat(((activities.food * 0.45) / total * 100).toFixed(0)),
      color: '#f97316',
    });
  }
  if (activities.energy > 100) {
    recs.push({
      title: 'Optimize Heating Schedule',
      category: 'HOME ENERGY',
      potentialReduction: parseFloat(((activities.energy * 0.25) / total * 100).toFixed(0)),
      color: '#a78bfa',
    });
  }
  if (activities.shopping > 40) {
    recs.push({
      title: 'Reduce Single-Use Purchases',
      category: 'SHOPPING',
      potentialReduction: parseFloat(((activities.shopping * 0.4) / total * 100).toFixed(0)),
      color: '#fb923c',
    });
  }

  // Always return at least 3 recs (add defaults if needed)
  const defaults = [
    { title: 'Switch to Public Transit', category: 'TRANSPORT', potentialReduction: 8, color: '#60A5FA' },
    { title: 'Reduce Meat Consumption',  category: 'FOOD & DIET', potentialReduction: 24, color: '#f97316' },
    { title: 'Optimize Heating Schedule',category: 'HOME ENERGY', potentialReduction: 12, color: '#a78bfa' },
  ];

  return recs.length >= 3 ? recs.slice(0, 3) : defaults;
};

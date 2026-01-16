// conversions.js
// Centralized unit conversion logic used by the backend.
// Most categories use a base unit approach for simplicity and extensibility.

const categories = {
  // Length conversions are normalized using meters as the base unit
  length: {
    base: 'm',
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344
    }
  },

  // Mass conversions are normalized using kilograms
  mass: {
    base: 'kg',
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523125,
      ton: 1000
    }
  },

  // Volume conversions are normalized using liters
  volume: {
    base: 'l',
    units: {
      l: 1,
      ml: 0.001,
      m3: 1000,
      cup: 0.2365882365,
      tbsp: 0.0147868,
      tsp: 0.00492892,
      gal: 3.785411784
    }
  },

  // Time conversions are normalized using seconds
  time: {
    base: 's',
    units: {
      s: 1,
      ms: 0.001,
      min: 60,
      h: 3600,
      day: 86400
    }
  },

  // Speed conversions are normalized using meters per second
  speed: {
    base: 'm/s',
    units: {
      'm/s': 1,
      kmh: 1000 / 3600,
      mph: 1609.344 / 3600,
      knot: 1852 / 3600
    }
  },

  // Data size conversions are based on binary units
  data: {
    base: 'B',
    units: {
      B: 1,
      KB: 1024,
      MB: 1024 ** 2,
      GB: 1024 ** 3,
      TB: 1024 ** 4
    }
  },

  // Angle conversions are normalized using radians
  angle: {
    base: 'rad',
    units: {
      rad: 1,
      deg: Math.PI / 180
    }
  }

  // Additional categories can be added here with minimal effort
};

/**
 * Handles temperature conversions.
 * Temperature is treated separately because it is not linear
 * and cannot be converted using a simple multiplication factor.
 */
function convertTemperature(value, from, to) {
  const toC = (v, f) => {
    if (f === 'C') return v;
    if (f === 'F') return (v - 32) * (5 / 9);
    if (f === 'K') return v - 273.15;
    throw new Error('Unsupported temp unit');
  };

  const fromC = (c, t) => {
    if (t === 'C') return c;
    if (t === 'F') return c * 9 / 5 + 32;
    if (t === 'K') return c + 273.15;
    throw new Error('Unsupported temp unit');
  };

  const celsius = toC(value, from);
  return fromC(celsius, to);
}

/**
 * Generic conversion function used by the API.
 * Converts a value from one unit to another within the same category.
 */
function convert(value, from, to, category) {
  // Attempt to infer category if not explicitly provided
  if (!category) {
    for (const cat of Object.keys(categories)) {
      if (categories[cat].units[from] && categories[cat].units[to]) {
        category = cat;
        break;
      }
    }
  }

  // Fallback check for temperature units
  if (!category) {
    const temps = ['C', 'F', 'K'];
    if (temps.includes(from) && temps.includes(to)) {
      return convertTemperature(value, from, to);
    }
    throw new Error('Unknown category or incompatible units');
  }

  // Explicit temperature handling
  if (category === 'temperature') {
    return convertTemperature(value, from, to);
  }

  const cat = categories[category];
  if (!cat) throw new Error('Unsupported category');

  const fromFactor = cat.units[from];
  const toFactor = cat.units[to];

  if (fromFactor == null || toFactor == null) {
    throw new Error('Unsupported unit for category');
  }

  // Convert to base unit first, then to target unit
  const valueInBase = value * fromFactor;
  return valueInBase / toFactor;
}

module.exports = { categories, convert, convertTemperature };

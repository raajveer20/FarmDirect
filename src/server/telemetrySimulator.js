/**
 * FarmDirect — Telemetry Simulator
 *
 * Simulates GPS movement along route waypoints for active shipments.
 * Generates realistic temperature readings for perishable goods.
 * Broadcasts updates via SSE.
 */

/**
 * Simulate GPS coordinates moving between waypoints.
 * @param {number[][]} routePoints - Array of [lat, lng] waypoints
 * @param {number} progress - 0.0 to 1.0
 * @returns {{ lat: number, lng: number }}
 */
export function interpolatePosition(routePoints, progress) {
  if (!routePoints || routePoints.length < 2) {
    return { lat: 23.2505, lng: 77.4490 }; // Default Bhopal
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const totalSegments = routePoints.length - 1;
  const segmentIndex = Math.min(
    Math.floor(clampedProgress * totalSegments),
    totalSegments - 1
  );
  const segmentProgress = (clampedProgress * totalSegments) - segmentIndex;

  const start = routePoints[segmentIndex];
  const end = routePoints[segmentIndex + 1];

  return {
    lat: Number((start[0] + (end[0] - start[0]) * segmentProgress).toFixed(6)),
    lng: Number((start[1] + (end[1] - start[1]) * segmentProgress).toFixed(6)),
  };
}

/**
 * Simulate cold-chain temperature reading.
 * Normal range: 2-8°C for perishables.
 * @param {string} productCategory - e.g., 'Vegetables', 'Fruits', 'Grains'
 * @returns {{ temperature: number, isAlert: boolean, alertType: string|null }}
 */
export function simulateTemperature(productCategory = 'Vegetables') {
  const optimalRanges = {
    Vegetables: { min: 2, max: 6, target: 4 },
    Fruits: { min: 3, max: 8, target: 5 },
    Grains: { min: 15, max: 25, target: 20 },
    Spices: { min: 15, max: 25, target: 20 },
  };

  const range = optimalRanges[productCategory] || optimalRanges.Vegetables;

  // Normal fluctuation with small chance of anomaly
  const isAnomaly = Math.random() < 0.05; // 5% chance of temp spike
  let temperature;
  if (isAnomaly) {
    temperature = range.max + 2 + Math.random() * 3; // Spike 2-5°C above max
  } else {
    temperature = range.target + (Math.random() - 0.5) * (range.max - range.min);
  }

  temperature = Number(temperature.toFixed(1));
  const isAlert = temperature > range.max || temperature < range.min;

  return {
    temperature,
    isAlert,
    alertType: isAlert ? (temperature > range.max ? 'TEMPERATURE_HIGH' : 'TEMPERATURE_LOW') : null,
    optimalRange: `${range.min}-${range.max}°C`,
  };
}

/**
 * Simulate vehicle speed (km/h).
 * @returns {number}
 */
export function simulateSpeed() {
  // Simulate realistic Indian road speeds
  const baseSpeed = 35 + Math.random() * 30; // 35-65 km/h
  const isTrafficJam = Math.random() < 0.1; // 10% chance of traffic
  return Number((isTrafficJam ? 5 + Math.random() * 10 : baseSpeed).toFixed(1));
}

/**
 * Generate a checkpoint name based on position.
 * @param {number} progress - 0.0 to 1.0
 * @param {string} origin - e.g., "Nagpur"
 * @param {string} destination - e.g., "Bhopal"
 * @returns {string}
 */
export function generateCheckpoint(progress, origin = 'Farm', destination = 'Market') {
  if (progress < 0.1) return `Loading at ${origin}`;
  if (progress < 0.25) return `Departed ${origin} Hub`;
  if (progress < 0.40) return `Highway Transit Corridor`;
  if (progress < 0.55) return `Mid-Route Junction`;
  if (progress < 0.70) return `Approaching ${destination} District`;
  if (progress < 0.85) return `${destination} City Limits`;
  if (progress < 0.95) return `Final Mile Delivery Zone`;
  return `Arrived at ${destination}`;
}

/**
 * Build a complete telemetry update for an order.
 * @param {object} order - Order with origin, destination, routePoints, telemetry
 * @param {number} progressIncrement - How much to advance progress (default 0.02)
 * @returns {object} Updated telemetry object
 */
export function generateTelemetryUpdate(order, progressIncrement = 0.02) {
  const currentTelemetry = order.telemetry || order.telemetry_json || {};
  const routePoints = order.routePoints || order.route_points || [];
  const origin = order.origin || order.origin_json || {};
  const destination = order.destination || order.destination_json || {};

  const currentProgress = Number(currentTelemetry.progressPercent || 50) / 100;
  const newProgress = Math.min(0.99, currentProgress + progressIncrement);

  const position = interpolatePosition(
    routePoints.length > 0 ? routePoints : [
      [origin.lat || 23.2715, origin.lng || 77.4690],
      [destination.lat || 23.2329, destination.lng || 77.4327],
    ],
    newProgress
  );

  const category = order.productName?.includes('Orange') ? 'Fruits'
    : order.productName?.includes('Wheat') || order.productName?.includes('Rice') ? 'Grains'
    : order.productName?.includes('Chilli') || order.productName?.includes('Turmeric') ? 'Spices'
    : 'Vegetables';

  const tempSim = simulateTemperature(category);
  const speed = simulateSpeed();
  const distanceTotal = Number(currentTelemetry.distanceTotalKm || 12.5);
  const distanceRemaining = Number((distanceTotal * (1 - newProgress)).toFixed(1));
  const etaMinutes = Math.max(1, Math.round(distanceRemaining / (speed / 60)));

  const originName = origin.name || origin.farmLocation || 'Farm Origin';
  const destName = destination.name || 'Delivery Point';

  return {
    currentLat: position.lat,
    currentLng: position.lng,
    currentCheckpoint: generateCheckpoint(newProgress, originName, destName),
    speed: `${speed} km/h`,
    temp: `${tempSim.temperature}°C ${category === 'Grains' || category === 'Spices' ? 'Dry Storage' : 'Cold Storage'}`,
    temperature: tempSim.temperature,
    temperatureAlert: tempSim.isAlert,
    alertType: tempSim.alertType,
    optimalRange: tempSim.optimalRange,
    distanceTotalKm: distanceTotal,
    distanceRemainingKm: distanceRemaining,
    etaMinutes,
    progressPercent: Math.round(newProgress * 100),
    co2SavedKg: Number((distanceTotal * 0.31 * newProgress).toFixed(1)),
    lastUpdated: new Date().toISOString(),
  };
}

import { describe, expect, it } from 'vitest';
import { calculateRoute } from './calculate-route';

describe('calculateRoute', () => {
  it('orders urgent stops before lower priority stops', () => {
    const result = calculateRoute({
      origin: { latitude: -25.4515, longitude: -49.2525 },
      stops: [
        { latitude: -25.45, longitude: -49.25, priority: 'LOW' },
        { latitude: -25.46, longitude: -49.26, priority: 'URGENT' }
      ]
    });

    expect(result.orderedStops[0].priority).toBe('URGENT');
    expect(result.estimatedDistanceKm).toBeGreaterThan(0);
    expect(result.calculationSource).toBe('local-haversine');
  });
});

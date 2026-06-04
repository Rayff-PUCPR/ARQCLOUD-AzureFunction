import { describe, expect, it } from 'vitest';
import { CalculateRouteUseCase } from './calculate-route.use-case';

describe('CalculateRouteUseCase', () => {
  it('delegates route estimation to the domain calculation', () => {
    const result = new CalculateRouteUseCase().execute({
      origin: { latitude: -25.4515, longitude: -49.2525 },
      stops: [
        { latitude: -25.4386, longitude: -49.2707, priority: 'HIGH' },
        { latitude: -25.48, longitude: -49.3, priority: 'LOW' }
      ]
    });

    expect(result.calculationSource).toBe('local-haversine');
    expect(result.orderedStops).toHaveLength(2);
    expect(result.estimatedDurationMinutes).toBeGreaterThanOrEqual(10);
  });
});

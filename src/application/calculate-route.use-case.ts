import { calculateRoute, CalculateRouteInput } from '../domain/calculate-route';

export class CalculateRouteUseCase {
  execute(input: CalculateRouteInput) {
    return calculateRoute(input);
  }
}

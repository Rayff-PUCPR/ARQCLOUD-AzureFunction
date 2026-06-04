export interface Coordinate {
  latitude: number;
  longitude: number;
}

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface RouteStopInput extends Coordinate {
  priority?: Priority;
}

export interface CalculateRouteInput {
  origin: Coordinate;
  stops: RouteStopInput[];
}

export interface CalculateRouteOutput {
  estimatedDistanceKm: number;
  estimatedDurationMinutes: number;
  score: number;
  orderedStops: Array<RouteStopInput & { sequence: number }>;
  calculationSource: 'local-haversine';
}

const priorityWeight: Record<Priority, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  URGENT: 4
};

export function calculateRoute(input: CalculateRouteInput): CalculateRouteOutput {
  const orderedStops = [...input.stops]
    .sort((a, b) => {
      const priorityDelta =
        priorityWeight[b.priority ?? 'MEDIUM'] - priorityWeight[a.priority ?? 'MEDIUM'];
      if (priorityDelta !== 0) {
        return priorityDelta;
      }

      return distanceKm(input.origin, a) - distanceKm(input.origin, b);
    })
    .map((stop, index) => ({ ...stop, sequence: index + 1 }));

  const points = [input.origin, ...orderedStops];
  let estimatedDistanceKm = 0;

  for (let index = 0; index < points.length - 1; index += 1) {
    estimatedDistanceKm += distanceKm(points[index], points[index + 1]);
  }

  estimatedDistanceKm = round(estimatedDistanceKm * 1.25, 1);
  const estimatedDurationMinutes = Math.max(10, Math.ceil((estimatedDistanceKm / 24) * 60));
  const score = Math.max(1, Math.min(100, Math.round(100 - estimatedDistanceKm * 1.3 + orderedStops.length * 2)));

  return {
    estimatedDistanceKm,
    estimatedDurationMinutes,
    score,
    orderedStops,
    calculationSource: 'local-haversine'
  };
}

function distanceKm(a: Coordinate, b: Coordinate) {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(b.latitude - a.latitude);
  const deltaLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const haversine =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

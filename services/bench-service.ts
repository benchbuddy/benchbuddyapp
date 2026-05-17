import { Bench } from '@/models/bench';
import { Platform } from 'react-native';

export type BenchFilters = {
  hasBackRest?: boolean;
  isPicnic?: boolean;
  isMemorial?: boolean;
};

const benches: Bench[] = [
  {
    id: 'bench-001',
    name: 'Riverside Bench',
    description: 'Bench with a back rest by the river.',
    coordinates: { latitude: 51.5074, longitude: -0.1278 },
    hasBackRest: true,
    isPicnic: false,
    isMemorial: false,
    tags: ['river', 'relax'],
    accessibility: { wheelchairAccessible: true, lighting: true },
    condition: 'good',
  },
  {
    id: 'bench-002',
    name: 'Memorial Bench',
    description: 'Memorial bench under an oak tree.',
    coordinates: { latitude: 51.5107, longitude: -0.1200 },
    hasBackRest: true,
    isPicnic: false,
    isMemorial: true,
    tags: ['memorial'],
    accessibility: { wheelchairAccessible: false, lighting: false },
    condition: 'fair',
  },
  {
    id: 'bench-003',
    name: 'Picnic Bench',
    description: 'Large bench table ideal for picnic groups.',
    coordinates: { latitude: 51.5033, longitude: -0.1195 },
    hasBackRest: false,
    isPicnic: true,
    isMemorial: false,
    tags: ['picnic', 'family'],
    accessibility: { wheelchairAccessible: true, lighting: false },
    condition: 'good',
  },
];

export async function fetchBenches(filters?: BenchFilters): Promise<Bench[]> {
  return new Promise(resolve => {
    const result = filters
      ? benches.filter(bench => {
          if (filters.hasBackRest !== undefined && bench.hasBackRest !== filters.hasBackRest) {
            return false;
          }
          if (filters.isPicnic !== undefined && bench.isPicnic !== filters.isPicnic) {
            return false;
          }
          if (filters.isMemorial !== undefined && bench.isMemorial !== filters.isMemorial) {
            return false;
          }
          return true;
        })
      : benches;

    setTimeout(() => resolve(result), 200);
  });
}

export function getAppleMapsUrl(latitude: number, longitude: number) {
  const query = `${latitude},${longitude}`;
  return `maps://?daddr=${query}`;
}

export function getGoogleMapsUrl(latitude: number, longitude: number) {
  const query = `${latitude},${longitude}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${query}`;
}

export function getNavigationUrl(latitude: number, longitude: number) {
  if (Platform.OS === 'ios') {
    return getAppleMapsUrl(latitude, longitude);
  }

  return getGoogleMapsUrl(latitude, longitude);
}

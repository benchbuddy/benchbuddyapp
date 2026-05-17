export type BenchCondition = 'good' | 'fair' | 'poor';

export type BenchAccessibility = {
  wheelchairAccessible?: boolean;
  lighting?: boolean;
  surfaceType?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Bench = {
  id: string;
  name: string;
  description?: string;
  coordinates: Coordinates;
  hasBackRest?: boolean;
  isPicnic?: boolean;
  isMemorial?: boolean;
  tags?: string[];
  photos?: string[];
  accessibility?: BenchAccessibility;
  condition?: BenchCondition;
};

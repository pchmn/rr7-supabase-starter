import type { MergeDeep } from 'type-fest';
import type {
  Database as DatabaseGenerated,
  Tables as TablesGenerated,
} from './database-generated.types';
export type { Database, Json } from './database-generated.types';

export type Tables<T extends keyof DatabaseGenerated['public']['Tables']> =
  MergeDeep<
    TablesGenerated<T>,
    'location_coordinates' extends keyof TablesGenerated<T>
      ? {
          location_coordinates: {
            lat: number;
            lng: number;
          } | null;
        }
      : // biome-ignore lint/complexity/noBannedTypes: <explanation>
        {}
  >;

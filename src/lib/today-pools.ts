import type { Season } from './season';

export interface PoolReading {
  text: string;
  source: string;
  page: string;
  label?: string;
}

export interface TodayPools {
  seasonGreetings: Record<Season, string>;
  morningInvocations: string[];
  readings: PoolReading[];
  eveningReflections: string[];
}

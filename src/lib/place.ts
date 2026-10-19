import type { JournalStorage } from './journal';

export interface Place {
  lat: number;
  lon: number;
}

export const PLACE_KEY = 'arbora-place';

const inRange = (n: unknown, limit: number): n is number =>
  typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= limit;

export function parsePlace(raw: string | null): Place | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return null;
    const { lat, lon } = value as Record<string, unknown>;
    return inRange(lat, 90) && inRange(lon, 180) ? { lat, lon } : null;
  } catch {
    return null;
  }
}

export const coarsen = ({ lat, lon }: Place): Place => ({
  lat: Math.round(lat * 10) / 10,
  lon: Math.round(lon * 10) / 10,
});

export function loadPlace(storage: JournalStorage): Place | null {
  try {
    return parsePlace(storage.getItem(PLACE_KEY));
  } catch {
    return null;
  }
}

export function storePlace(storage: JournalStorage, place: Place | null): void {
  try {
    storage.setItem(PLACE_KEY, place ? JSON.stringify(coarsen(place)) : '');
  } catch {
    // Storage can be unavailable. The deck falls back to the default sky.
  }
}

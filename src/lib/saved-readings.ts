export interface SavedReading {
  text: string;
  source: string;
  id?: string;
}

export interface SavedStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const STORAGE_KEY = 'arbora-saved-readings';

const isReading = (value: unknown): value is SavedReading =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as SavedReading).text === 'string' &&
  typeof (value as SavedReading).source === 'string';

export function parseSaved(raw: string | null): SavedReading[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isReading) : [];
  } catch {
    return [];
  }
}

const same = (a: SavedReading, b: SavedReading) => a.text === b.text && a.source === b.source;

export const isSaved = (list: SavedReading[], reading: SavedReading) => list.some((r) => same(r, reading));

export function toggleSaved(list: SavedReading[], reading: SavedReading): SavedReading[] {
  return isSaved(list, reading)
    ? list.filter((r) => !same(r, reading))
    : [...list, { text: reading.text, source: reading.source }];
}

export const removeAt = (list: SavedReading[], index: number): SavedReading[] => list.filter((_, i) => i !== index);

export function loadSaved(storage: SavedStorage): SavedReading[] {
  try {
    return parseSaved(storage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function storeSaved(storage: SavedStorage, list: SavedReading[]): void {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // Storage can be unavailable or full. Saving is a convenience, so the page keeps working without it.
  }
}

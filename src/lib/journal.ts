export interface JournalEntry {
  iso: string;
  [field: string]: unknown;
}

export interface Journal {
  entries: JournalEntry[];
}

export interface JournalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const EMPTY_JOURNAL: Journal = { entries: [] };

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isEntry = (value: unknown): value is JournalEntry => isRecord(value) && typeof value.iso === 'string';

export function parseJournal(raw: string | null): Journal {
  if (!raw) return EMPTY_JOURNAL;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_JOURNAL;
    return { entries: Array.isArray(parsed.entries) ? parsed.entries.filter(isEntry) : [] };
  } catch {
    return EMPTY_JOURNAL;
  }
}

export function loadJournal(storage: JournalStorage, key: string): Journal {
  try {
    return parseJournal(storage.getItem(key));
  } catch {
    return EMPTY_JOURNAL;
  }
}

export function storeJournal(storage: JournalStorage, key: string, journal: Journal): void {
  try {
    storage.setItem(key, JSON.stringify(journal));
  } catch {
    // Storage can be unavailable or full. The deck still works for the session without a record.
  }
}

export function withEntry(journal: Journal, entry: JournalEntry): Journal {
  return { ...journal, entries: [...journal.entries, entry] };
}

export function updateEntry(journal: Journal, index: number, patch: Record<string, unknown>): Journal {
  return { ...journal, entries: journal.entries.map((e, i) => (i === index ? { ...e, ...patch } : e)) };
}

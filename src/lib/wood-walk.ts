import type { JournalEntry } from './journal';

export type Circle = 'Elder' | 'Spirit' | 'Passage';

export const WALK_ORDER: Circle[] = ['Elder', 'Spirit', 'Passage'];
export const TABLE_ORDER: Circle[] = ['Passage'];

export const POSITION_LABEL: Record<Circle, string> = {
  Elder: 'Where you stand',
  Spirit: 'What meets you',
  Passage: 'What is happening',
};

export const WOODS = ['coast', 'mountain', 'north'] as const;
export type Wood = (typeof WOODS)[number];

export interface WalkEntry extends JournalEntry {
  cards: Partial<Record<Circle, string>>;
  line: string;
  status: 'kept' | 'branch';
  outcome: string;
}

export const isWalk = (entry: JournalEntry): entry is WalkEntry =>
  typeof entry.cards === 'object' &&
  entry.cards !== null &&
  typeof entry.line === 'string' &&
  (entry.status === 'kept' || entry.status === 'branch');

export function pickFrom<T>(pool: T[], random: () => number): T {
  return pool[Math.floor(random() * pool.length)]!;
}

export function lastKept(entries: JournalEntry[]): { index: number; entry: WalkEntry } | null {
  for (let i = entries.length - 1; i >= 0; i--) {
    const entry = entries[i]!;
    if (isWalk(entry) && entry.status === 'kept' && entry.line) return { index: i, entry };
  }
  return null;
}

export function lastWalk(entries: JournalEntry[]): WalkEntry | null {
  const entry = entries[entries.length - 1];
  return entry && isWalk(entry) ? entry : null;
}

const LIGHT_SPOTS: Array<[number, number]> = [
  [20, 34],
  [36, 70],
  [52, 22],
  [64, 58],
  [80, 36],
  [46, 88],
  [28, 56],
  [72, 80],
  [86, 60],
];

export function lightSpots(step: number, count: number): Array<[number, number]> {
  return Array.from({ length: count }, (_, i) => LIGHT_SPOTS[(step * 3 + i) % LIGHT_SPOTS.length]!);
}

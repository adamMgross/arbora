export interface SolarTerm {
  name: string;
  month: number;
  day: number;
}

export interface YearSeason {
  key: string;
  name: string;
  from: number;
  to: number;
}

export const WINDOWS = 72;
const WINDOWS_PER_TERM = 3;
const DAYS_PER_WINDOW = 5;
const DAY_MS = 86400000;

const localDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function termStart(term: SolarTerm, year: number): Date {
  return new Date(year, term.month - 1, term.day);
}

export function windowFor(date: Date, terms: SolarTerm[]): number {
  const today = localDate(date);
  let best: { start: Date; index: number } | null = null;
  for (const year of [today.getFullYear() - 1, today.getFullYear()]) {
    terms.forEach((term, index) => {
      const start = termStart(term, year);
      if (start <= today && (!best || start > best.start)) best = { start, index };
    });
  }
  if (!best) throw new Error('No solar term starts before the given date');
  const found: { start: Date; index: number } = best;
  const days = Math.round((today.getTime() - found.start.getTime()) / DAY_MS);
  return found.index * WINDOWS_PER_TERM + Math.min(WINDOWS_PER_TERM - 1, Math.floor(days / DAYS_PER_WINDOW));
}

export interface WindowRange {
  start: Date;
  end: Date;
}

export function windowRange(index: number, year: number, terms: SolarTerm[]): WindowRange {
  const termIndex = Math.floor(index / WINDOWS_PER_TERM);
  const k = index % WINDOWS_PER_TERM;
  const start = termStart(terms[termIndex]!, year);
  start.setDate(start.getDate() + k * DAYS_PER_WINDOW);
  let end: Date;
  if (k < WINDOWS_PER_TERM - 1) {
    end = new Date(start);
    end.setDate(end.getDate() + DAYS_PER_WINDOW - 1);
  } else {
    const next = terms[(termIndex + 1) % terms.length]!;
    end = termStart(next, next.month < terms[termIndex]!.month ? year + 1 : year);
    end.setDate(end.getDate() - 1);
  }
  return { start, end };
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatRange({ start, end }: WindowRange): string {
  const sameMonth = end.getMonth() === start.getMonth();
  const endLabel = sameMonth ? `${end.getDate()}` : `${MONTHS[end.getMonth()]} ${end.getDate()}`;
  return `about ${MONTHS[start.getMonth()]} ${start.getDate()}–${endLabel}`;
}

export function seasonOf<T extends YearSeason>(index: number, seasons: T[]): T {
  return seasons.find((s) => index >= s.from && index <= s.to) ?? seasons[seasons.length - 1]!;
}

export function previousSeason<T extends YearSeason>(current: T, seasons: T[]): T {
  const i = seasons.indexOf(current);
  return seasons[(i + seasons.length - 1) % seasons.length]!;
}

export const needleAngle = (index: number): number => ((index - 27 + 0.5) / WINDOWS) * 360;

export const windowArcStart = (index: number): number => ((index - 27) / WINDOWS) * 360;

export function pickOtherWindow(today: number, random: () => number): number {
  const draw = Math.floor(random() * (WINDOWS - 1));
  return draw >= today ? draw + 1 : draw;
}

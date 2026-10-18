export function dayOfYear(now: Date): number {
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
}

export function pickIndex(day: number, length: number): number {
  return day % length;
}

export function shuffledIndex(current: number, length: number, random: () => number): number {
  if (length <= 1) return 0;
  const draw = Math.floor(random() * (length - 1));
  return draw >= current ? draw + 1 : draw;
}

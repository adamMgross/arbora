import { describe, expect, it } from 'vitest';
import { altaz, galacticToEquatorial, moon, moonPhase, planet, separation, signOf, sun } from '../../src/lib/sky-math';

const utc = (y: number, m: number, d: number, h = 0, min = 0) => new Date(Date.UTC(y, m - 1, d, h, min));

describe('sky math against recorded events', () => {
  it('puts Jupiter and Saturn within half a degree at the 2020 great conjunction', () => {
    const at = utc(2020, 12, 21, 18);
    expect(separation(planet('jupiter', at), planet('saturn', at))).toBeLessThan(0.5);
  });

  it('puts Mars opposite the Sun at the 2020 opposition', () => {
    const at = utc(2020, 10, 13, 23);
    expect(separation(planet('mars', at), sun(at))).toBeGreaterThan(175);
  });

  it('puts the Sun at the first point of Aries at the 2026 March equinox', () => {
    const at = utc(2026, 3, 20, 14, 46);
    const s = sun(at);
    expect(Math.abs(s.dec)).toBeLessThan(0.3);
    expect(s.lon < 0.5 || s.lon > 359.5).toBe(true);
    expect(signOf(sun(utc(2026, 3, 19)).lon)).toBe('Pisces');
    expect(signOf(sun(utc(2026, 3, 22)).lon)).toBe('Aries');
  });

  it('puts the Moon beside the Sun at the reference new moon and calls it new', () => {
    const at = utc(2000, 1, 6, 18, 14);
    expect(separation(moon(at), sun(at))).toBeLessThan(2.5);
    expect(moonPhase(at).name).toBe('new moon');
    expect(moonPhase(at).pct).toBe(0);
  });

  it('calls the Moon full about fifteen days after a new moon', () => {
    const phase = moonPhase(utc(2000, 1, 21, 16));
    expect(phase.name).toBe('full moon');
    expect(phase.pct).toBeGreaterThan(97);
    expect(phase.waxing).toBe(false);
  });

  it('never carries Venus more than 48 degrees from the Sun', () => {
    for (let m = 1; m <= 12; m++) {
      for (const d of [1, 15]) {
        const at = utc(2026, m, d);
        expect(separation(planet('venus', at), sun(at))).toBeLessThanOrEqual(48);
      }
    }
  });

  it('shows the pole star at an altitude equal to the latitude from anywhere in the north', () => {
    for (const lat of [36.8, 45, 60]) {
      const aa = altaz(37.95, 89.26, utc(2026, 10, 19, 4), lat, -119.4);
      expect(Math.abs(aa.alt - lat)).toBeLessThan(1);
    }
  });

  it('maps the galactic center to Sagittarius', () => {
    const { ra, dec } = galacticToEquatorial(0, 0);
    expect(Math.abs(ra - 266.4)).toBeLessThan(0.5);
    expect(Math.abs(dec + 28.94)).toBeLessThan(0.5);
  });

  it('names a tropical sign for every longitude including the wrap', () => {
    expect(signOf(0)).toBe('Aries');
    expect(signOf(29.9)).toBe('Aries');
    expect(signOf(30)).toBe('Taurus');
    expect(signOf(359.9)).toBe('Pisces');
    expect(signOf(-10)).toBe('Pisces');
    expect(signOf(370)).toBe('Aries');
  });
});

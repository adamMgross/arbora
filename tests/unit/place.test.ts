import { describe, expect, it } from 'vitest';
import { coarsen, loadPlace, parsePlace, storePlace } from '../../src/lib/place';

const memory = () => {
  const map = new Map<string, string>();
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => void map.set(k, v) };
};

describe('place', () => {
  it('reads a stored place and rejects anything out of range or malformed', () => {
    expect(parsePlace('{"lat":47.6,"lon":-122.3}')).toEqual({ lat: 47.6, lon: -122.3 });
    expect(parsePlace(null)).toBeNull();
    expect(parsePlace('')).toBeNull();
    expect(parsePlace('nope')).toBeNull();
    expect(parsePlace('{"lat":91,"lon":0}')).toBeNull();
    expect(parsePlace('{"lat":10,"lon":-181}')).toBeNull();
    expect(parsePlace('{"lat":"10","lon":0}')).toBeNull();
  });

  it('stores only a tenth of a degree, about ten kilometers, and clears back to the default', () => {
    const storage = memory();
    storePlace(storage, { lat: 47.60621, lon: -122.33207 });
    expect(storage.getItem('arbora-place')).toBe('{"lat":47.6,"lon":-122.3}');
    expect(loadPlace(storage)).toEqual({ lat: 47.6, lon: -122.3 });
    storePlace(storage, null);
    expect(loadPlace(storage)).toBeNull();
    expect(coarsen({ lat: -33.86882, lon: 151.20929 })).toEqual({ lat: -33.9, lon: 151.2 });
  });
});

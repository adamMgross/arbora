import { describe, expect, it } from 'vitest';
import { commonsTitle, cropRegion } from '../../scripts/art-fetch.mjs';

describe('cropRegion', () => {
  it('keeps the whole picture when nothing is trimmed', () => {
    expect(cropRegion(1600, 1000)).toEqual({ left: 0, top: 0, width: 1600, height: 1000 });
  });

  it('trims each edge by its percentage of that dimension, so the crop survives a rescan at another size', () => {
    const trim = { top: 10, right: 5, bottom: 0, left: 20 };
    expect(cropRegion(1000, 800, trim)).toEqual({ left: 200, top: 80, width: 750, height: 720 });
    expect(cropRegion(2000, 1600, trim)).toEqual({ left: 400, top: 160, width: 1500, height: 1440 });
  });

  it('refuses a trim that leaves no picture, rather than writing an empty master', () => {
    expect(() => cropRegion(1000, 800, { left: 60, right: 40 })).toThrow('nothing left');
    expect(() => cropRegion(1000, 800, { top: 100 })).toThrow('nothing left');
  });
});

describe('commonsTitle', () => {
  it('reads the file title from a Commons page URL, decoding escapes and underscores', () => {
    expect(
      commonsTitle('https://commons.wikimedia.org/wiki/File:Thomas_Cole_-_The_Pic-Nic_(1846)_-_Google_Art_Project.jpg'),
    ).toBe('File:Thomas Cole - The Pic-Nic (1846) - Google Art Project.jpg');
    expect(
      commonsTitle('https://commons.wikimedia.org/wiki/File:059.Israelite_Women_Mourn_with_Jephthah%27s_Daughter.jpg'),
    ).toBe("File:059.Israelite Women Mourn with Jephthah's Daughter.jpg");
  });

  it('rejects a source that is not a Commons file page, since the fetch only knows how to read Commons', () => {
    expect(() => commonsTitle('https://www.metmuseum.org/art/collection/search/10101')).toThrow('Commons');
  });
});

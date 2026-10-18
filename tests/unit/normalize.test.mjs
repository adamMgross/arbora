import { describe, expect, it } from 'vitest';
import { multisetDiff, normalizeText } from '../parity/normalize.mjs';

describe('normalizeText', () => {
  it('collapses whitespace runs, trims lines, and drops empty lines', () => {
    expect(normalizeText('  a \t b  \n\n   \n c  d ')).toBe('a b\nc d');
  });

  it('composes to NFC so equivalent Unicode spellings compare equal', () => {
    expect(normalizeText('é')).toBe(normalizeText('é'));
  });
});

describe('multisetDiff', () => {
  it('reports items present on only one side, counting duplicates', () => {
    expect(multisetDiff(['a', 'a', 'b'], ['a', 'c'])).toEqual({ onlyBase: ['a', 'b'], onlyCandidate: ['c'] });
  });

  it('reports nothing for equal multisets in a different order', () => {
    expect(multisetDiff(['a', 'b'], ['b', 'a'])).toEqual({ onlyBase: [], onlyCandidate: [] });
  });
});

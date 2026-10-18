import { describe, expect, it } from 'vitest';
import { inline } from '../../src/lib/inline';

describe('inline', () => {
  it('turns single newlines into br and blank lines into consecutive brs', () => {
    expect(inline('a\nb\n\nc')).toBe('a<br>b<br><br>c');
  });

  it('wraps asterisk spans in em, including spans that cross line breaks', () => {
    expect(inline('x *y* z')).toBe('x <em>y</em> z');
    expect(inline('*a\nb*')).toBe('<em>a<br>b</em>');
  });

  it('renders bracket links as anchors', () => {
    expect(inline('see [the eight](principles.html) now')).toBe('see <a href="principles.html">the eight</a> now');
  });

  it('escapes markup characters so content cannot inject elements', () => {
    expect(inline('Tom & <b>Jerry</b>')).toBe('Tom &amp; &lt;b&gt;Jerry&lt;/b&gt;');
  });
});

import { describe, expect, it } from 'vitest';
import { robotsTxt, sitemapXml } from '../../src/lib/sitemap';

describe('sitemapXml', () => {
  it('lists every href as an absolute URL under the site and base path', () => {
    const xml = sitemapXml('https://adammgross.github.io/arbora/', ['index.html', 'canon-stoics.html']);
    expect(xml).toContain('<loc>https://adammgross.github.io/arbora/index.html</loc>');
    expect(xml).toContain('<loc>https://adammgross.github.io/arbora/canon-stoics.html</loc>');
  });

  it('treats a base without a trailing slash as a directory', () => {
    expect(sitemapXml('https://example.org/arbora', ['today.html'])).toContain(
      '<loc>https://example.org/arbora/today.html</loc>',
    );
  });

  it('escapes characters that are special in XML', () => {
    expect(sitemapXml('https://example.org/', ['a&b.html'])).toContain('<loc>https://example.org/a&amp;b.html</loc>');
  });
});

describe('robotsTxt', () => {
  it('allows everything and points at the sitemap under the same base', () => {
    expect(robotsTxt('https://example.org/arbora/')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://example.org/arbora/sitemap.xml\n',
    );
  });
});

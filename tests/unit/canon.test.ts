import { describe, expect, it } from 'vitest';
import { canonPageProps, type CanonEntry } from '../../src/lib/canon';

const entry = (id: string, data: Partial<CanonEntry['data']> = {}): CanonEntry => ({
  id,
  data: { heading: `Heading ${id}`, subtitle: 's', description: 'd', ogDescription: 'o', ...data },
});

describe('canonPageProps', () => {
  const philosophy = entry('philosophy', { heading: 'Classical Philosophy & Sacred Texts' });
  const stoics = entry('stoics', { parent: { id: 'philosophy' }, next: { id: 'fragments' } });
  const fragments = entry('fragments', { label: 'Fragments', parent: { id: 'philosophy' }, prev: { id: 'stoics' } });
  const all = [philosophy, stoics, fragments];

  it('derives the page title and og title from the heading', () => {
    const props = canonPageProps(stoics, all);
    expect(props.title).toBe('Heading stoics — Arbora');
    expect(props.ogTitle).toBe(props.title);
  });

  it('builds the breadcrumb through the parent and ends on an unlinked heading', () => {
    expect(canonPageProps(stoics, all).trail).toEqual([
      { label: 'Canon', href: 'canon.html' },
      { label: 'Classical Philosophy & Sacred Texts', href: 'canon-philosophy.html' },
      { label: 'Heading stoics' },
    ]);
  });

  it('centers the pager on the parent, or on All Canon for a top-level entry', () => {
    expect(canonPageProps(stoics, all).pager.center).toEqual({
      label: 'Classical Philosophy & Sacred Texts',
      href: 'canon-philosophy.html',
    });
    expect(canonPageProps(philosophy, all).pager.center).toEqual({ label: 'All Canon', href: 'canon.html' });
  });

  it('uses the short label for pager links and leaves absent neighbors undefined', () => {
    const { pager } = canonPageProps(stoics, all);
    expect(pager.prev).toBeUndefined();
    expect(pager.next).toEqual({ label: 'Fragments', href: 'canon-fragments.html' });
  });

  it('throws when a reference points at an entry that does not exist', () => {
    expect(() => canonPageProps(entry('a', { next: { id: 'missing' } }), [])).toThrow('missing');
  });
});

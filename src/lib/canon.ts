import type { Crumb } from '../components/Breadcrumb.astro';
import type { Pager, PagerLink } from '../components/CanonNav.astro';
import { routes } from './routes';
import type { TocItem } from './toc';

export interface CanonData {
  heading: string;
  label?: string;
  subtitle: string;
  description: string;
  ogDescription: string;
  toc?: TocItem[];
  parent?: { id: string };
  prev?: { id: string };
  next?: { id: string };
}

export interface CanonEntry {
  id: string;
  data: CanonData;
}

export const canonHref = (id: string) => `canon-${id}.html`;

const labelOf = (entry: CanonEntry) => entry.data.label ?? entry.data.heading;
const linkTo = (entry: CanonEntry): PagerLink => ({ label: labelOf(entry), href: canonHref(entry.id) });

export function canonPageProps(entry: CanonEntry, all: CanonEntry[]) {
  const byId = new Map(all.map((e) => [e.id, e]));
  const resolve = (ref?: { id: string }) => {
    if (!ref) return undefined;
    const target = byId.get(ref.id);
    if (!target) throw new Error(`Canon entry "${entry.id}" references missing entry "${ref.id}"`);
    return target;
  };
  const { heading, subtitle, description, ogDescription } = entry.data;
  const parent = resolve(entry.data.parent);
  const prev = resolve(entry.data.prev);
  const next = resolve(entry.data.next);
  const trail: Crumb[] = [
    { label: routes.canon.label, href: routes.canon.href },
    ...(parent ? [linkTo(parent)] : []),
    { label: heading },
  ];
  const pager: Pager = {
    prev: prev && linkTo(prev),
    center: parent ? linkTo(parent) : { label: 'All Canon', href: routes.canon.href },
    next: next && linkTo(next),
  };
  const title = `${heading} — Arbora`;
  return { title, ogTitle: title, description, ogDescription, heading, subtitle, trail, pager, toc: entry.data.toc };
}

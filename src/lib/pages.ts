import { getCollection } from 'astro:content';
import { canonHref } from './canon';
import { routes } from './routes';

export async function allPageHrefs(): Promise<string[]> {
  const [canon, pages] = await Promise.all([getCollection('canon'), getCollection('pages')]);
  return [
    routes.home.href,
    routes.today.href,
    ...pages.map((page) => `${page.id}.html`),
    routes.canon.href,
    ...canon.map((entry) => canonHref(entry.id)),
    routes.tree.href,
  ];
}

export function siteBaseUrl(site: URL | undefined, base: string): string {
  if (!site) throw new Error('Set SITE (for example https://adammgross.github.io) to generate absolute URLs');
  return new URL(base.endsWith('/') ? base : `${base}/`, site).href;
}

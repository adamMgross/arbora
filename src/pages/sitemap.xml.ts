import type { APIRoute } from 'astro';
import { allPageHrefs, siteBaseUrl } from '../lib/pages';
import { sitemapXml } from '../lib/sitemap';

export const GET: APIRoute = async ({ site }) =>
  new Response(sitemapXml(siteBaseUrl(site, import.meta.env.BASE_URL), await allPageHrefs()), {
    headers: { 'Content-Type': 'application/xml' },
  });

import type { APIRoute } from 'astro';
import { siteBaseUrl } from '../lib/pages';
import { robotsTxt } from '../lib/sitemap';

export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(siteBaseUrl(site, import.meta.env.BASE_URL)), { headers: { 'Content-Type': 'text/plain' } });

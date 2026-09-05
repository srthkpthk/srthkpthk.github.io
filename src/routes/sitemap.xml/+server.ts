import { getAllSlugs, SITE_URL } from '$lib/data/content';

export const prerender = true;

export function GET() {
	const paths = ['/', ...getAllSlugs().map((slug) => `/projects/${slug}`)];
	const body =
		'<?xml version="1.0" encoding="UTF-8"?>\n' +
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		paths.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n') +
		'\n</urlset>\n';

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}

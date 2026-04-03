import { fetchPublishedArticles } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const revalidate = 300;

export async function GET() {
  const articles = (await fetchPublishedArticles({ revalidate: 300 }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 100)
    .filter((article) => new Date(article.publishedAt) > new Date(Date.now() - 2 * 24 * 60 * 60 * 1000));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${articles
  .map(
    (article) => `  <url>
    <loc>${siteUrl}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>HTC Media</news:name>
        <news:language>ne</news:language>
      </news:publication>
      <news:publication_date>${new Date(article.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.titleEn || article.titleNe)}</news:title>
      <news:keywords>${article.tags.map((t) => t.nameEn || t.nameNe).join(', ')}</news:keywords>
    </news:news>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=300',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

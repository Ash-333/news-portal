import { fetchPublishedArticles } from "@/lib/api";
import { Article } from "@/types";

export const dynamic = 'force-dynamic';
export const revalidate = 604800; // Weekly

function getArticleImageUrl(article: Article): string {
  const img = article.featuredImage;
  if (typeof img === "string") return img;
  if (img && typeof img === "object" && "url" in img) return img.url || "";
  return "";
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
  const allArticles = await fetchPublishedArticles({ revalidate: 604800 });

  const articles = allArticles
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 1000); // Limit to most recent 1000 articles to prevent oversized sitemaps

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${articles
  .filter((article) => article.featuredImage)
  .map(
    (article) => `  <url>
    <loc>${siteUrl}/article/${article.slug}</loc>
    <image:image>
      <image:loc>${getArticleImageUrl(article)}</image:loc>
      <image:title>${escapeXml(article.titleEn || article.titleNe)}</image:title>
      <image:caption>${escapeXml(article.excerptEn || article.excerptNe)}</image:caption>
    </image:image>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=604800, stale-while-revalidate=86400",
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

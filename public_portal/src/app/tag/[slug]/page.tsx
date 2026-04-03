import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { PopularArticles } from '@/components/article/PopularArticles';
import { deriveTagsFromArticles, fetchPublishedArticles } from '@/lib/api';

interface TagPageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const articles = await fetchPublishedArticles({ revalidate: 120 });
    const tags = deriveTagsFromArticles(articles);
    return tags.map((tag) => ({
      slug: tag.slug,
    }));
  } catch (error) {
    // During build, API might not be available, return empty array
    return [];
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const articles = await fetchPublishedArticles({ revalidate: 120 });
  const tags = deriveTagsFromArticles(articles);
  const tag = tags.find((t) => t.slug === params.slug);

  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: tag.name,
    description: `Articles tagged with ${tag.name}`,
    alternates: {
      canonical: `/tag/${tag.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${tag.name} - HTC Media`,
      description: `Articles tagged with ${tag.name}`,
    },
  };
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const allArticles = await fetchPublishedArticles({ revalidate: 120 });
  const tags = deriveTagsFromArticles(allArticles);
  const tag = tags.find((t) => t.slug === params.slug);

  if (!tag) {
    notFound();
  }

  // Determine language from URL parameter
  const requestedLang = searchParams?.lang;
  const isNepali = requestedLang === 'ne' || (!requestedLang && !!tag.nameNe);

  const articles = allArticles.filter((article) => article.tags.some((articleTag) => articleTag.slug === params.slug));
  const popularArticles = [...allArticles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
  const url = `${SITE_URL}/tag/${tag.slug}`;

  const tagName = isNepali ? (tag.nameNe || tag.name) : (tag.name || tag.nameNe);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd
        data={ItemListJsonLd(
          articles.map((a) => ({
            name: isNepali ? a.titleNe : (a.titleEn || a.titleNe || ''),
            url: `${SITE_URL}/article/${a.slug}`,
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: isNepali ? (tag.nameNe || tag.name || '') : (tag.nameEn ?? tag.nameNe ?? tag.name ?? ''), url },
        ])}
      />

      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-news-red">Home</Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">{tagName}</span>
              </nav>

              {/* Tag Header */}
              <div className="mb-8">
                <span className="text-sm text-gray-500">Tag</span>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {tagName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Articles Grid */}
              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-gray-500">No articles found with this tag.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <PopularArticles articles={popularArticles} />
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}


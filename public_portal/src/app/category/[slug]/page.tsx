import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/JsonLd';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { VideoCard } from '@/components/videos/VideoCard';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getVideos } from '@/lib/api/videos';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt } from '@/lib/utils/lang';
import { HoroscopeSection } from '@/components/horoscopes/HoroscopeSection';
import { AudioNewsSection } from '@/components/audio/AudioNewsList';

export const dynamic = 'force-static';
interface CategoryPageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const res = await getCategories();
    const categories = res.success ? res.data : [];
    return categories.map((category) => ({
      slug: category.slug,
    }));
  } catch (error) {
    // During build, API might not be available, return empty array
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const res = await getCategories();
  const categories = res.success ? res.data : [];
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  const categoryName = category.nameNe || category.nameEn || category.slug;

  return {
    title: categoryName,
    description: `Latest ${categoryName} news and updates.`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${categoryName} - HTC Media`,
      description: `Latest ${categoryName} news and updates.`,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [categoriesRes, articlesRes, videosRes] = await Promise.all([
    getCategories(),
    getArticles({ category: params.slug }),
    getVideos({ limit: 6 }),
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  // Determine language from URL parameter
  const requestedLang = searchParams?.lang;
  const isNepali = requestedLang === 'ne' || (!requestedLang && !!category.nameNe);

  const articles = articlesRes.success ? articlesRes.data : [];
  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1);

  const videos = videosRes.success ? videosRes.data : [];

  const categoryName = isNepali
    ? (category.nameNe || category.nameEn || category.slug)
    : (category.nameEn || category.nameNe || category.slug);
  const url = `${SITE_URL}/category/${category.slug}`;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd
        data={ItemListJsonLd(
          articles.map((a) => ({
            name: getTitle(a, isNepali ? 'ne' : 'en'),
            url: `${SITE_URL}/article/${a.slug}`,
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: categoryName, url },
        ])}
      />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-news-red">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
          </nav>

          {/* Category Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {categoryName}
            </h1>
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No articles found in this category.</p>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featuredArticle && (
                <div className="mb-8">
                  <article className="group">
                    <Link href={`/article/${featuredArticle.slug}`} className="block relative aspect-[21/9] rounded-xl overflow-hidden">
                      <Image
                        src={getArticleImage(featuredArticle)}
                        alt={getTitle(featuredArticle, isNepali ? 'ne' : 'en')}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 1200px"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:underline font-heading">
                          {getTitle(featuredArticle, isNepali ? 'ne' : 'en')}
                        </h2>
                        <p className="text-white/80 line-clamp-2 max-w-2xl">
                          {getExcerpt(featuredArticle, isNepali ? 'ne' : 'en')}
                        </p>
                      </div>
                    </Link>
                  </article>
                </div>
              )}

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {gridArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="horizontal"
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

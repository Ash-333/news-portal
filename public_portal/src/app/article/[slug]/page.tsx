import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, User, Eye } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { NewsArticleJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { getArticleImage } from '@/lib/utils/image';
import { ArticleContent } from '@/components/article/ArticleContent';
import { ShareBar } from '@/components/article/ShareBar';
import { AuthorBox } from '@/components/article/AuthorBox';
import { RelatedArticles } from '@/components/article/RelatedArticles';
import { PopularArticles } from '@/components/article/PopularArticles';
import { ArticleTags } from '@/components/article/ArticleTags';
import { CommentSection } from '@/components/article/CommentSection';
import { ArticleNavigation } from '@/components/article/ArticleNavigation';
import { ArticleViewTracker } from '@/components/article/ArticleViewTracker';
import { fetchArticleBySlug, fetchPublishedArticles } from '@/lib/api';
import { getServerLanguage } from '@/lib/utils/language';
import { InArticleAd } from '@/components/ads/AdSlot';

interface ArticlePageProps {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const revalidate = 300;

function resolveArticleLanguage(article: Awaited<ReturnType<typeof fetchArticleBySlug>>, userLang: 'ne' | 'en') {
  if (!article) {
    return true;
  }

  const hasContentEn = !!article.contentEn;
  const hasContentNe = !!article.contentNe;

  if (userLang === 'ne') {
    return hasContentNe || !hasContentEn;
  } else {
    return hasContentEn || !hasContentNe;
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await fetchArticleBySlug(params.slug, { revalidate: 300 });

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const url = `${SITE_URL}/article/${article.slug}`;
  const userLang = await getServerLanguage();
  const isNepali = resolveArticleLanguage(article, userLang);

  return {
    title: isNepali ? article.titleNe : (article.titleEn || article.titleNe || article.title),
    description: isNepali ? article.excerptNe : (article.excerptEn || article.excerptNe || article.excerpt),
    keywords: article.tags.map((tag) => tag.nameEn || tag.nameNe),
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: url,
      languages: {
        'ne-NP': `/article/${article.slug}?lang=ne`,
        'en-US': `/article/${article.slug}?lang=en`,
      },
    },
    openGraph: {
      type: 'article',
      url,
      title: isNepali ? article.titleNe : article.titleEn,
      description: isNepali ? article.excerptNe : article.excerptEn,
      images: (() => {
        const img = article.featuredImage;
        if (typeof img === 'string') return [img];
        if (img && typeof img === 'object' && 'url' in img && img.url) return [img.url];
        return undefined;
      })(),
      publishedTime: article.publishedAt,
      modifiedTime: article.modifiedAt,
      authors: [article.author.name],
      section: article.category.nameEn || article.category.nameNe,
      tags: article.tags.map((tag) => tag.nameEn || tag.nameNe),
    },
    twitter: {
      card: 'summary_large_image',
      title: isNepali ? article.titleNe : article.titleEn,
      description: isNepali ? article.excerptNe : article.excerptEn,
      images: (() => {
        const img = article.featuredImage;
        if (typeof img === 'string') return [img];
        if (img && typeof img === 'object' && 'url' in img && img.url) return [img.url];
        return undefined;
      })(),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const [article, articles] = await Promise.all([
    fetchArticleBySlug(params.slug, { revalidate: 300 }),
    fetchPublishedArticles({ revalidate: 300 }),
  ]);

  if (!article) {
    notFound();
  }

  const userLang = await getServerLanguage();
  const isNepali = resolveArticleLanguage(article, userLang);

  const content = isNepali ? (article.contentNe || article.contentEn || '') : (article.contentEn || article.contentNe || '');
  const lang = isNepali ? 'ne' : 'en';

  const relatedArticles = articles
    .filter(
      (candidate) =>
        candidate.id !== article.id &&
        (candidate.category.slug === article.category.slug ||
          candidate.tags.some((tag) => article.tags.some((currentTag) => currentTag.slug === tag.slug)))
    )
    .slice(0, 4);

  const popularArticles = [...articles]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5);

  const url = `${SITE_URL}/article/${article.slug}`;

  const currentIndex = articles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const nextArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <>
      <JsonLd data={NewsArticleJsonLd({ ...article, url })} />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          {
            name: isNepali ? article.category.nameNe : (article.category.nameEn ?? article.category.nameNe),
            url: `${SITE_URL}/category/${article.category.slug}`
          },
          { name: (isNepali ? article.titleNe : (article.titleEn || article.titleNe || article.title)) || '', url },
        ])}
      />

      <ArticleViewTracker slug={article.slug} />
      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-news-red">Home</Link>
                <span>/</span>
                <Link href={`/category/${article.category.slug}`} className="hover:text-news-red">
                  {isNepali ? article.category.nameNe : article.category.nameEn}
                </Link>
                <span>/</span>
                <span className="text-gray-400 truncate">
                  {isNepali ? article.titleNe : (article.titleEn || article.titleNe || article.title)}
                </span>
              </nav>

              {/* Category Label */}
              <Link href={`/category/${article.category.slug}`}>
                <span className="category-label mb-4 inline-block">
                  {isNepali ? article.category.nameNe : article.category.nameEn}
                </span>
              </Link>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                {isNepali ? article.titleNe : (article.titleEn || article.titleNe || article.title)}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                {isNepali ? article.excerptNe : (article.excerptEn || article.excerptNe || article.excerpt)}
              </p>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-news-border dark:border-news-border-dark">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Link href={`/author/${article.author.slug}`} className="hover:text-news-red">
                    {article.author.name}
                  </Link>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{article.viewCount?.toLocaleString() || 0} views</span>
                </div>
              </div>

              <ShareBar url={url} title={isNepali ? article.titleNe : article.titleEn} />

              {/* Featured Image */}
              {/* Featured Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <Image
                  src={(typeof article.featuredImage === 'object' && article.featuredImage?.url) ? article.featuredImage.url.replace('http://localhost:3000', '') : (typeof article.featuredImage === 'string' ? article.featuredImage.replace('http://localhost:3000', '') : '/images/placeholder.jpg')}
                  alt={isNepali ? article.titleNe : (article.titleEn || article.titleNe || article.title || '')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 800px"
                  priority
                />
              </div>

              {/* Article Content */}
              <ArticleContent content={content} lang={lang} />

              <InArticleAd />

              <ArticleTags tags={article.tags} />

              <AuthorBox author={article.author} />

              <ShareBar url={url} title={isNepali ? article.titleNe : article.titleEn} />

              <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} />

              <CommentSection articleId={article.id} articleSlug={article.slug} />
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              <PopularArticles articles={popularArticles} />
              <RelatedArticles articles={relatedArticles} />

              {/* Newsletter */}
              <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Subscribe to Newsletter
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Get the latest news delivered to your inbox.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-3 bg-white dark:bg-news-bg-dark"
                />
                <button className="w-full px-4 py-2 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors">
                  Subscribe
                </button>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}

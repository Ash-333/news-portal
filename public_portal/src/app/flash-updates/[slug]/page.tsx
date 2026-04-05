import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, User, Eye } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { NewsArticleJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { fetchFlashUpdateBySlug, getFlashUpdates } from '@/lib/api/flash-updates';
import { getServerLanguage } from '@/lib/utils/language';
import { InArticleAd } from '@/components/ads/AdSlot';
import { ShareBar } from '@/components/article/ShareBar';

interface FlashUpdatePageProps {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  try {
    const updates = await getFlashUpdates({ limit: 100 });
    return updates.data.map((update) => ({
      slug: update.slug,
    }));
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: FlashUpdatePageProps): Promise<Metadata> {
  const flashUpdate = await fetchFlashUpdateBySlug(params.slug);

  if (!flashUpdate) {
    return { title: 'Flash Update Not Found' };
  }

  const isNepali = getServerLanguage() === 'ne';
  const title = isNepali ? flashUpdate.titleNe : flashUpdate.titleEn;
  const description = isNepali ? flashUpdate.excerptNe : flashUpdate.excerptEn;

  return {
    title: `${title} | Flash Updates`,
    description: description?.slice(0, 160) || '',
    alternates: {
      canonical: `${SITE_URL}/flash-updates/${flashUpdate.slug}`,
      languages: {
        'ne-NP': `/flash-updates/${flashUpdate.slug}?lang=ne`,
        'en-US': `/flash-updates/${flashUpdate.slug}?lang=en`,
      },
    },
    openGraph: {
      type: 'article',
      url: `${SITE_URL}/flash-updates/${flashUpdate.slug}`,
      title: title,
      description: description || '',
      images: flashUpdate.featuredImage ? [flashUpdate.featuredImage.url] : [],
      publishedTime: flashUpdate.publishedAt,
      authors: [flashUpdate.author?.name || 'Admin'],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description || '',
      images: flashUpdate.featuredImage ? [flashUpdate.featuredImage.url] : [],
    },
  };
}

export default async function FlashUpdatePage({ params }: FlashUpdatePageProps) {
  const [flashUpdate, updates] = await Promise.all([
    fetchFlashUpdateBySlug(params.slug),
    getFlashUpdates({ limit: 20 }),
  ]);

  if (!flashUpdate) {
    notFound();
  }

  const isNepali = getServerLanguage() === 'ne';
  const title = isNepali ? flashUpdate.titleNe : flashUpdate.titleEn;
  const content = isNepali ? flashUpdate.contentNe : flashUpdate.contentEn;
  const excerpt = isNepali ? flashUpdate.excerptNe : flashUpdate.excerptEn;

  const allUpdates = updates.data;
  const currentIndex = allUpdates.findIndex((u) => u.id === flashUpdate.id);
  const prevUpdate = currentIndex > 0 ? allUpdates[currentIndex - 1] : null;
  const nextUpdate = currentIndex < allUpdates.length - 1 ? allUpdates[currentIndex + 1] : null;

  const url = `${SITE_URL}/flash-updates/${flashUpdate.slug}`;

  return (
    <>
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: isNepali ? 'ताजा अपडेट' : 'Flash Updates', url: `${SITE_URL}/flash-updates` },
          { name: title || '', url },
        ])}
      />

      <article className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/" className="hover:text-news-red">Home</Link>
                <span>/</span>
                <Link href="/flash-updates" className="hover:text-news-red">
                  {isNepali ? 'ताजा अपडेट' : 'Flash Updates'}
                </Link>
                <span>/</span>
                <span className="text-gray-400 truncate">{title}</span>
              </nav>

              {/* Category Label */}
              <span className="category-label mb-4 inline-block bg-news-red text-white">
                {isNepali ? 'ताजा अपडेट' : 'BREAKING'}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                {title}
              </h1>

              {/* Excerpt */}
              {excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {excerpt}
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-news-border dark:border-news-border-dark">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{flashUpdate.author?.name || 'Admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(flashUpdate.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>

              <ShareBar url={url} title={title} />

              {/* Featured Image */}
              {flashUpdate.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                  <Image
                    src={flashUpdate.featuredImage.url.replace('http://localhost:3000', '')}
                    alt={title || ''}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 800px"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              {content && (
                <div 
                  className="prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}

              <InArticleAd />

              <ShareBar url={url} title={title} />

              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-news-border dark:border-news-border-dark">
                {prevUpdate ? (
                  <Link 
                    href={`/flash-updates/${prevUpdate.slug}`}
                    className="flex flex-col items-start group"
                  >
                    <span className="text-xs text-gray-500 mb-1">
                      {isNepali ? 'अघिल्लो' : 'Previous'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-news-red transition-colors line-clamp-1">
                      {isNepali ? prevUpdate.titleNe : prevUpdate.titleEn}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextUpdate ? (
                  <Link 
                    href={`/flash-updates/${nextUpdate.slug}`}
                    className="flex flex-col items-end group"
                  >
                    <span className="text-xs text-gray-500 mb-1">
                      {isNepali ? 'अर्को' : 'Next'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-news-red transition-colors line-clamp-1">
                      {isNepali ? nextUpdate.titleNe : nextUpdate.titleEn}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
              {/* Other Flash Updates */}
              <div className="bg-white dark:bg-news-card-dark rounded-xl p-6 border border-news-border dark:border-news-border-dark">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  {isNepali ? 'थप अपडेट' : 'More Updates'}
                </h3>
                <div className="space-y-4">
                  {allUpdates
                    .filter((u) => u.id !== flashUpdate.id)
                    .slice(0, 5)
                    .map((update) => (
                      <Link 
                        key={update.id}
                        href={`/flash-updates/${update.slug}`}
                        className="block group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex h-2 w-2 rounded-full bg-news-red mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-news-red transition-colors line-clamp-2">
                              {isNepali ? update.titleNe : update.titleEn}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(update.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

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
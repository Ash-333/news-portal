'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Zap, Loader2 } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticles } from '@/lib/api/articles';
import { Article, ApiResponse } from '@/types';
import { cn } from '@/lib/utils';
import { getArticleImage, getBlurDataUrl, isCDNImage } from '@/lib/utils/image';
import { ArticleCard } from '@/components/ArticleCard';

export default function FlashUpdatesPage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['articles', 'flash-updates-all'],
    queryFn: ({ pageParam = 1 }) =>
      getArticles({ flashUpdate: true, limit: 10, page: pageParam }),
    getNextPageParam: (lastPage: ApiResponse<Article[]>, pages) => {
      if (lastPage.data.length < 10) {
        return undefined;
      }
      return pages.length + 1;
    },
    initialPageParam: 1,
  });

  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];
  const featuredArticle = allArticles[0] || null;
  const remainingArticles = allArticles.slice(1);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Zap className="h-8 w-8 text-news-red" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-nepali">
              ताजा खबर
            </h1>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-news-red" />
            </div>
          )}

          {!isLoading && (
            <>
              {allArticles.length === 0 ? (
                <div className="bg-white dark:bg-news-card-dark rounded-xl p-12 text-center">
                  <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-nepali">
                    अहिलेसम्म कुनै ताजा खबर प्रकाशित भएको छैन।
                  </p>
                </div>
              ) : (
                <>
                  {featuredArticle && (
                    <div className="mb-10">
                      <Link href={`/article/${featuredArticle.slug}`}>
                        <article className="group">
                          <div className="relative aspect-[21/9] rounded-xl overflow-hidden">
                            <Image
                              src={getArticleImage(featuredArticle)}
                              alt={featuredArticle.title || 'ताजा खबर'}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 1024px) 100vw, 1200px"
                              priority
                              unoptimized={isCDNImage(getArticleImage(featuredArticle))}
                              placeholder="blur"
                              blurDataURL={getBlurDataUrl()}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                              <div className="mb-3">
                                <span className="inline-block px-3 py-1 bg-news-red text-white text-sm font-bold rounded-sm tracking-wide">
                                  {featuredArticle.category.name}
                                </span>
                              </div>
                              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-red-300 transition-colors line-clamp-3 font-nepali leading-tight">
                                {featuredArticle.title}
                              </h2>
                              <p className="text-white/80 line-clamp-2 max-w-4xl font-nepali">
                                {featuredArticle.excerpt}
                              </p>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  )}

                  {remainingArticles.length > 0 && (
                    <>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-nepali">
                        सबै ताजा खबर
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {remainingArticles.map((article) => (
                          <ArticleCard
                            key={article.id}
                            article={article}
                            variant="default"
                          />
                        ))}
                      </div>

                      {!hasNextPage && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 font-nepali">
                            तपाईंले सबै ताजा खबर हेर्नु भएको छ।
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

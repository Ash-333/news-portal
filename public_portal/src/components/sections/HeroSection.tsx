'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { getRelativeTime, toNepaliDigits, cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt, getCategoryName, getAuthorName } from '@/lib/utils/lang';

interface HeroSectionProps {
  featuredArticles: Article[];
  trendingArticles: Article[];
}

export function HeroSection({ featuredArticles, trendingArticles }: HeroSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (featuredArticles.length === 0) return null;

  const mainArticle = featuredArticles[0];
  const sideArticles = featuredArticles.slice(1, 3);
  const mainTitle = getTitle(mainArticle, language);
  const mainExcerpt = getExcerpt(mainArticle, language);

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Featured Article - 60% */}
          <div className="lg:col-span-7">
            <article className="group">
              <Link href={`/${mainArticle.category.slug}/${mainArticle.slug}`} className="block relative aspect-[16/10] rounded-xl overflow-hidden">
                <Image
                  src={getArticleImage(mainArticle)}
                  alt={mainTitle}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="category-label">
                    {getCategoryName(mainArticle.category, language)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h1 className={cn(
                    'font-bold text-white mb-3 group-hover:underline',
                    isNepali ? 'font-nepali text-xl sm:text-2xl lg:text-3xl leading-relaxed' : 'text-xl sm:text-2xl lg:text-3xl font-heading'
                  )}>
                    {mainTitle}
                  </h1>
                  <p className={cn(
                    'text-white/80 text-sm sm:text-base mb-4 line-clamp-2',
                    isNepali ? 'font-nepali' : ''
                  )}>
                    {mainExcerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span className={isNepali ? 'font-nepali' : ''}>
                      {getAuthorName(mainArticle.author, language)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getRelativeTime(mainArticle.publishedAt, language)}
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          </div>

          {/* Side Articles + Trending - 40% */}
          <div className="lg:col-span-5 space-y-6">
            {/* Side Articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {sideArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                  showExcerpt={false}
                />
              ))}
            </div>

            {/* Trending Section */}
            <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-news-red" />
                <h2 className={cn('font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
                  {t('category.trending')}
                </h2>
              </div>
              <div className="space-y-4">
                {trendingArticles.slice(0, 4).map((article, index) => {
                    const title = getTitle(article, language);
                  return (
                    <article key={article.id} className="flex gap-3 group">
                      <span className="shrink-0 w-6 h-6 bg-news-red text-white text-xs font-bold rounded flex items-center justify-center">
                        {isNepali ? toNepaliDigits(index + 1) : index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/article/${article.slug}`}>
                          <h4 className={cn(
                            'text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                            isNepali ? 'font-nepali' : ''
                          )}>
                            {title}
                          </h4>
                        </Link>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {getRelativeTime(article.publishedAt, language)}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

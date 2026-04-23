'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category, Poll } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { AdBox } from '@/components/ads/AdBox';
import { PollCard } from '@/components/polls/PollCard';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt } from '@/lib/utils/lang';

interface NewsSectionProps {
  articles: Article[];
  category: Category;
  poll?: Poll | null;
  mostReadArticles?: Article[];
}

export function NewsSection({ articles, category, poll, mostReadArticles = [] }: NewsSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (!articles.length) return null;

  const featuredArticle = articles[0];
  const gridArticles = articles.slice(1, 7);
  const categoryName = isNepali ? category.nameNe : category.nameEn;
  const featuredTitle = getTitle(featuredArticle, language);
  const featuredExcerpt = getExcerpt(featuredArticle, language);

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-news-red rounded-full" />
            <h2 className={cn(
              'text-xl md:text-2xl font-bold text-gray-900 dark:text-white',
              isNepali ? 'font-nepali' : ''
            )}>
              {categoryName}
            </h2>
          </div>
          <Link
            href={`/category/${category.slug}`}
            className="flex items-center gap-1 text-sm text-news-red hover:underline font-medium"
          >
            <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Featured + Grid */}
          <div className="lg:col-span-8">
            {/* Featured Article with overlay */}
            <Link
              href={`/article/${featuredArticle.slug}`}
              className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-6 group"
            >
              <Image
                src={getArticleImage(featuredArticle)}
                alt={featuredTitle}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 800px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col justify-end">
                <h2 className={cn(
                  'font-bold text-white mb-2 group-hover:text-red-300 transition-colors line-clamp-2',
                  isNepali ? 'font-nepali text-3xl sm:text-4xl lg:text-[2.5rem] leading-[1.2]' : 'text-3xl sm:text-4xl lg:text-5xl font-heading leading-tight'
                )}>
                  {featuredTitle}
                </h2>
                {featuredExcerpt && (
                  <p className={cn(
                    'text-base text-white/80 line-clamp-2 hidden sm:block',
                    isNepali ? 'font-nepali' : ''
                  )}>
                    {featuredExcerpt}
                  </p>
                )}
              </div>
            </Link>

            {/* Other Articles - Two Columns with Image Left, Title + Excerpt Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {gridArticles.map((article) => {
                const title = getTitle(article, language);
                const excerpt = getExcerpt(article, language);
                return (
                  <article key={article.id} className="group flex gap-4 items-start">
                    <Link
                      href={`/article/${article.slug}`}
                      className="shrink-0 w-24 md:w-32 relative aspect-[4/3] rounded-lg overflow-hidden"
                    >
                      <Image
                        src={getArticleImage(article)}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 96px, 128px"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/article/${article.slug}`}>
                        <h3 className={cn(
                          'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                          isNepali ? 'font-nepali text-base md:text-base leading-relaxed' : 'text-sm md:text-base'
                        )}>
                          {title}
                        </h3>
                      </Link>
                      {excerpt && (
                        <p className={cn(
                          'text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 hidden sm:block',
                          isNepali ? 'font-nepali' : ''
                        )}>
                          {excerpt}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right: Sidebar with Ad, Poll, and Most Read */}
          <aside className="lg:col-span-4 space-y-6">
            <AdBox position="SIDEBAR" className="h-[250px] w-full" />
            
            {poll && (
              <PollCard poll={poll} />
            )}

            {mostReadArticles.length > 0 && (
              <div className="bg-white dark:bg-news-card-dark rounded-xl p-4 border border-news-border dark:border-news-border-dark">
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white mb-4">
                  <TrendingUp className="w-5 h-5 text-news-red" />
                  <span className={isNepali ? 'font-nepali' : ''}>
                    {isNepali ? 'धेरै पढिएको' : 'Most Read'}
                  </span>
                </h3>
                <div className="space-y-3">
                  {mostReadArticles.slice(0, 5).map((article, index) => (
                    <article key={article.id} className="group flex gap-3 items-start">
                      <span className="text-2xl font-bold text-news-red/30 dark:text-red-400/30 flex-shrink-0 w-8">
                        {index + 1}
                      </span>
                      <Link href={`/article/${article.slug}`}>
                        <h4 className={cn(
                          'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                          isNepali ? 'font-nepali text-sm leading-relaxed' : 'text-sm'
                        )}>
                          {getTitle(article, language)}
                        </h4>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
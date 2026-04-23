'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt, getCategoryName } from '@/lib/utils/lang';

interface WorldDiasporaSectionProps {
  worldCategory: Category;
  worldArticles: Article[];
  diasporaCategory: Category;
  diasporaArticles: Article[];
}

export function WorldDiasporaSection({
  worldCategory,
  worldArticles,
  diasporaCategory,
  diasporaArticles,
}: WorldDiasporaSectionProps) {
  const { isNepali, t } = useLanguage();

  if (worldArticles.length === 0 && diasporaArticles.length === 0) return null;

  const worldCategoryName = getCategoryName(worldCategory, isNepali ? 'ne' : 'en');
  const diasporaCategoryName = getCategoryName(diasporaCategory, isNepali ? 'ne' : 'en');

  const worldFeatured = worldArticles[0];
  const worldGrid = worldArticles.slice(1, 6);
  const diasporaList = diasporaArticles.slice(0, 11);

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: World (News-style layout) */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-red rounded-full" />
                <h2 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {worldCategoryName}
                </h2>
              </div>
              <Link
                href={`/category/${worldCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured Article */}
            {worldFeatured && (
              <Link
                href={`/article/${worldFeatured.slug}`}
                className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
              >
                <Image
                  src={getArticleImage(worldFeatured)}
                  alt={getTitle(worldFeatured, isNepali ? 'ne' : 'en')}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col justify-end">
                  <h3 className={cn(
                    'font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors',
                    isNepali ? 'font-nepali text-xl sm:text-2xl md:text-3xl leading-[1.2]' : 'text-xl sm:text-2xl md:text-3xl font-heading leading-tight'
                  )}>
                    {getTitle(worldFeatured, isNepali ? 'ne' : 'en')}
                  </h3>
                </div>
              </Link>
            )}

            {/* Grid (Two Columns: Image Left, Title + Excerpt Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {worldGrid.map((article) => {
                const title = getTitle(article, isNepali ? 'ne' : 'en');
                const excerpt = getExcerpt(article, isNepali ? 'ne' : 'en');
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
                        <h4 className={cn(
                          'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                          isNepali ? 'font-nepali text-base md:text-base leading-relaxed' : 'text-sm md:text-base'
                        )}>
                          {title}
                        </h4>
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

          {/* RIGHT: Diaspora (Title + Featured Image) */}
          <aside className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-blue rounded-full" />
                <h2 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {diasporaCategoryName}
                </h2>
              </div>
              <Link
                href={`/category/${diasporaCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {diasporaList.map((article) => (
                <article key={article.id} className="group flex gap-3 items-start">
                  <Link href={`/article/${article.slug}`} className="shrink-0">
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={getArticleImage(article)}
                        alt={getTitle(article, isNepali ? 'ne' : 'en')}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="80px"
                      />
                    </div>
                  </Link>
                  <Link href={`/article/${article.slug}`} className="flex-1 min-w-0">
                    <h4 className={cn(
                      'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-base leading-relaxed' : 'text-base'
                    )}>
                      {getTitle(article, isNepali ? 'ne' : 'en')}
                    </h4>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { getCategoryName } from '@/lib/utils/lang';

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

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Diaspora - Title Only List (5 columns) - LEFT */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-6 bg-news-blue rounded-full" />
              <h2 className={cn('text-xl md:text-2xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
                {diasporaCategoryName}
              </h2>
            </div>

            {/* Diaspora - Title Only List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {diasporaArticles.slice(0, 6).map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="block group"
                >
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-news-card-dark transition-colors">
                    <span className="text-news-red mt-1 flex-shrink-0">•</span>
                    <h4 className={cn(
                      'text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-news-red dark:group-hover:text-red-400 transition-colors line-clamp-2',
                      isNepali ? 'font-nepali' : ''
                    )}>
                      {isNepali ? article.titleNe : article.titleEn}
                    </h4>
                  </div>
                </Link>
              ))}

              {diasporaArticles.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic col-span-2">
                  {isNepali ? 'हालसम्म कुनै समाचार छैन' : 'No articles yet'}
                </p>
              )}
            </div>

            <Link
              href={`/category/${diasporaCategory.slug}`}
              className={cn(
                'flex items-center gap-1 text-sm text-news-red hover:underline font-medium mt-4',
                isNepali ? 'font-nepali' : ''
              )}
            >
              <span>{t('category.viewAll')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* World - Featured + Grid Layout (7 columns) - RIGHT */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 bg-news-red rounded-full" />
              <h3 className={cn('text-lg font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
                {worldCategoryName}
              </h3>
            </div>

            {/* World - Featured Layout */}
            <div className="flex flex-col gap-4">
              {worldArticles[0] && (
                <ArticleCard article={worldArticles[0]} variant="featured" showExcerpt={true} />
              )}

              {worldArticles.slice(1, 4).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="compact"
                  showExcerpt={false}
                />
              ))}

              {worldArticles.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  {isNepali ? 'हालसम्म कुनै समाचार छैन' : 'No articles yet'}
                </p>
              )}
            </div>

            <Link
              href={`/category/${worldCategory.slug}`}
              className={cn(
                'flex items-center gap-1 text-sm text-news-red hover:underline font-medium mt-4',
                isNepali ? 'font-nepali' : ''
              )}
            >
              <span>{t('category.viewAll')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

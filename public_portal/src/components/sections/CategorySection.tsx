'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';
import { cn } from '@/lib/utils';
import { getCategoryName } from '@/lib/utils/lang';
import React from 'react';

type LayoutType = 'grid' | 'featured' | 'horizontal' | 'three-column' | 'compact' | 'list' | 'opinion';

interface CategorySectionProps {
  category: Category;
  articles: Article[];
  layout?: LayoutType;
}

export function CategorySection({ category, articles, layout = 'grid' }: CategorySectionProps) {
  const { isNepali, t } = useLanguage();

  if (articles.length === 0) return null;

  const categoryName = getCategoryName(category, isNepali ? 'ne' : 'en');

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-news-red rounded-full" />
        <h2 className={cn('text-xl md:text-2xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
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
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 flex flex-col gap-6">
        <div className="w-full">
          <ArticleCard article={articles[0]} variant="featured" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
          {articles.slice(1, 3).map((article) => (
            <ArticleCard key={article.id} article={article} variant="default" showExcerpt={false} />
          ))}
        </div>
      </div>
      <div className="lg:col-span-4 flex flex-col gap-6">
        {articles.slice(3, 6).map((article) => (
          <ArticleCard key={article.id} article={article} variant="default" showExcerpt={false} />
        ))}
      </div>
    </div>
  );

  const renderFeaturedLayout = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <ArticleCard article={articles[0]} variant="featured" />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{isNepali ? 'थप समाचार' : 'More News'}</h3>
        </div>
        {articles.slice(1, 5).map((article) => (
          <ArticleCard key={article.id} article={article} variant="compact" showExcerpt={false} />
        ))}
      </div>
    </div>
  );

  const renderHorizontalLayout = () => (
    <div className="space-y-4">
      <div className="flex gap-4 overflow-x-auto pb-4">
        {articles.slice(0, 5).map((article) => (
          <div key={article.id} className="flex-shrink-0 w-72">
            <ArticleCard article={article} variant="default" showExcerpt={false} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderThreeColumnLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.slice(0, 6).map((article) => (
        <ArticleCard key={article.id} article={article} variant="default" />
      ))}
    </div>
  );

  const renderCompactLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} variant="compact" showExcerpt={false} />
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="flex flex-col gap-4">
      {articles.slice(0, 5).map((article) => (
        <div key={article.id} className="flex gap-4">
          <div className="w-32 h-24 flex-shrink-0">
            <ArticleCard article={article} variant="compact" showExcerpt={false} />
          </div>
          <div className="flex-1">
            <ArticleCard article={article} variant="compact" showExcerpt={false} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderOpinionLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.slice(0, 6).map((article) => (
        <div key={article.id} className="bg-gray-50 dark:bg-news-card-dark rounded-lg p-4">
          <ArticleCard article={article} variant="default" showExcerpt={true} />
          {article.author && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-news-red text-white flex items-center justify-center text-xs font-bold">
                {(isNepali ? article.author.nameNe : article.author.name)?.substring(0, 2).toUpperCase() || 'AU'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {isNepali ? article.author.nameNe : article.author.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isNepali ? 'विचार' : 'Opinion'}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case 'featured':
        return renderFeaturedLayout();
      case 'horizontal':
        return renderHorizontalLayout();
      case 'three-column':
        return renderThreeColumnLayout();
      case 'compact':
        return renderCompactLayout();
      case 'list':
        return renderListLayout();
      case 'opinion':
        return renderOpinionLayout();
      case 'grid':
      default:
        return renderGridLayout();
    }
  };

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark w-full overflow-hidden">
      <div className="container mx-auto px-4">
        {renderHeader()}
        {renderLayout()}
      </div>
    </section>
  );
}
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

interface CategorySectionProps {
  category: Category;
  articles: Article[];
}

export function CategorySection({ category, articles }: CategorySectionProps) {
  const { isNepali, t } = useLanguage();

  if (articles.length === 0) return null;

  const categoryName = getCategoryName(category, isNepali ? 'ne' : 'en');

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark w-full overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
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

        {/* Wireframe Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Featured (Top) + 2 Cards (Bottom) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Featured Article */}
            <div className="w-full">
              <ArticleCard article={articles[0]} variant="featured" />
            </div>

            {/* Two Side-by-Side Articles (1 and 2 in wireframe) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
              {articles.slice(1, 3).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="default"
                  showExcerpt={false}
                />
              ))}
            </div>
          </div>

          {/* Right Column: 3 Stacked Cards (1, 2, 3 in wireframe) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {articles.slice(3, 6).map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="default"
                showExcerpt={false}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

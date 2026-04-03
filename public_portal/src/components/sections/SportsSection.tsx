'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { cn } from '@/lib/utils';

interface SportsSectionProps {
  articles: Article[];
}

export function SportsSection({ articles }: SportsSectionProps) {
  const { isNepali, t } = useLanguage();

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-news-red rounded-full" />
            <h2 className={cn('text-xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
              {t('nav.sports')}
            </h2>
          </div>
          <Link
            href="/category/sports"
            className="flex items-center gap-1 text-sm text-news-red hover:underline"
          >
            <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

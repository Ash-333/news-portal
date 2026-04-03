'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { toNepaliDigits, cn } from '@/lib/utils';
import { getTitle } from '@/lib/utils/lang';

interface PopularArticlesProps {
  articles: Article[];
}

export function PopularArticles({ articles }: PopularArticlesProps) {
  const { isNepali, t } = useLanguage();

  if (articles.length === 0) return null;
  

  return (
    <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-news-red" />
        <h3 className={cn('font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
          {t('category.mostRead')}
        </h3>
      </div>
      <div className="space-y-4">
        {articles.slice(0, 5).map((article, index) => {
          const title = getTitle(article, isNepali ? 'ne' : 'en');
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
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

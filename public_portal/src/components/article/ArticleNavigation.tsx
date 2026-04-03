'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getTitle } from '@/lib/utils/lang';

interface ArticleNavigationProps {
  prevArticle: Article | null;
  nextArticle: Article | null;
}

export function ArticleNavigation({ prevArticle, nextArticle }: ArticleNavigationProps) {
  const { isNepali, t } = useLanguage();

  return (
    <div className="flex items-center justify-between py-8 border-t border-b border-news-border dark:border-news-border-dark my-8">
      {/* Previous Article */}
      {prevArticle ? (
        <Link href={`/article/${prevArticle.slug}`} className="flex items-center gap-3 group max-w-[45%]">
          <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-news-red transition-colors shrink-0" />
          <div className="text-left">
            <span className={cn('text-xs text-gray-500 block mb-1', isNepali ? 'font-nepali' : '')}>
              {t('article.prevArticle')}
            </span>
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-news-red transition-colors',
              isNepali ? 'font-nepali' : ''
            )}>
              {getTitle(prevArticle, isNepali ? 'ne' : 'en')}
            </span>
          </div>
        </Link>
      ) : (
        <div />
      )}

      {/* Next Article */}
      {nextArticle ? (
        <Link href={`/article/${nextArticle.slug}`} className="flex items-center gap-3 group max-w-[45%]">
          <div className="text-right">
            <span className={cn('text-xs text-gray-500 block mb-1', isNepali ? 'font-nepali' : '')}>
              {t('article.nextArticle')}
            </span>
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-news-red transition-colors',
              isNepali ? 'font-nepali' : ''
            )}>
              {getTitle(nextArticle, isNepali ? 'ne' : 'en')}
            </span>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-news-red transition-colors shrink-0" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

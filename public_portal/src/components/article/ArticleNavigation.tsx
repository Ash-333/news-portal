'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article } from '@/types';

import { cn } from '@/lib/utils';

interface ArticleNavigationProps {
  prevArticle: Article | null;
  nextArticle: Article | null;
}

export function ArticleNavigation({ prevArticle, nextArticle }: ArticleNavigationProps) {

  return (
    <div className="flex items-center justify-between py-8 border-t border-b border-news-border dark:border-news-border-dark my-8">
      {/* Previous Article */}
      {prevArticle ? (
        <Link href={`/article/${prevArticle.slug}`} className="flex items-center gap-3 group max-w-[45%]">
          <ChevronLeft className="h-5 w-5 text-gray-400 group-hover:text-news-red transition-colors shrink-0" />
          <div className="text-left">
            <span className={cn('text-xs text-gray-500 block mb-1', 'font-nepali')}>
              
            </span>
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-news-red transition-colors',
              'font-nepali'
            )}>
              {prevArticle.title}
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
            <span className={cn('text-xs text-gray-500 block mb-1', 'font-nepali')}>
              
            </span>
            <span className={cn(
              'text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-news-red transition-colors',
              'font-nepali'
            )}>
              {nextArticle.title}
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

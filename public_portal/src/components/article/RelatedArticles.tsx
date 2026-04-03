'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getCategoryName } from '@/lib/utils/lang';

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  const { isNepali, t } = useLanguage();

  if (articles.length === 0) return null;

  return (
    <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6">
      <h3 className={cn('font-bold text-gray-900 dark:text-white mb-4', isNepali ? 'font-nepali' : '')}>
        {t('article.relatedArticles')}
      </h3>
      <div className="space-y-4">
        {articles.map((article) => {
          const title = getTitle(article, isNepali ? 'ne' : 'en');
          return (
            <article key={article.id} className="flex gap-3 group">
              <Link href={`/article/${article.slug}`} className="shrink-0">
                <div className="relative w-20 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={getArticleImage(article)}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="80px"
                  />
                </div>
              </Link>
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
                  {getCategoryName(article.category, isNepali ? 'ne' : 'en')}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

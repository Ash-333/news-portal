'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useBreakingArticles, useLatestArticles } from '@/hooks/useArticles';
import { getTitle } from '@/lib/utils/lang';

export function BreakingNewsTicker() {
  const { isNepali, language, t } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  
  const { data: flashUpdateArticles = [] } = useBreakingArticles();
  const { data: latestArticles = [] } = useLatestArticles(5);
  
  const articles = flashUpdateArticles.length > 0 ? flashUpdateArticles : latestArticles;
  
  const breakingNews = articles.slice(0, 6).map((article) => ({
    id: article.id,
    title: getTitle(article, language),
    slug: article.slug,
    categorySlug: article.category.slug,
  }));

  if (breakingNews.length === 0) return null;

  const duplicatedNews = [...breakingNews, ...breakingNews];

  return (
    <div className="bg-news-red text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full shrink-0">
            <AlertCircle className="h-4 w-4 animate-pulse" />
            <span className={cn('text-sm font-bold uppercase', isNepali ? 'font-nepali' : '')}>
              {t('breakingNews')}
            </span>
          </div>

          <div
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className={cn(
                'flex gap-8 whitespace-nowrap',
                !isPaused && 'animate-ticker-scroll'
              )}
              style={{
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {duplicatedNews.map((news, index) => (
                <Link
                  key={`${news.id}-${index}`}
                  href={`/article/${news.slug}`}
                  className="text-sm hover:underline flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full shrink-0" />
                  <span className={isNepali ? 'font-nepali' : ''}>{news.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
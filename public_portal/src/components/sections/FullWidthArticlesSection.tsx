'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { getRelativeTime, cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt, getCategoryName, getAuthorName, getSubheading } from '@/lib/utils/lang';
import { Featured1Ad, Featured2Ad, Featured3Ad } from '@/components/ads/AdSlot';

interface FullWidthArticlesSectionProps {
  articles: Article[];
}

export function FullWidthArticlesSection({ articles }: FullWidthArticlesSectionProps) {
  const { isNepali, language } = useLanguage();

  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 pb-8 border-b border-news-border dark:border-news-border-dark">
      {articles.map((article, index) => {
        const title = getTitle(article, language);
        const subheading = getSubheading(article, language);
        const excerpt = getExcerpt(article, language);

        return (
          <div key={article.id}>
            <article className="group flex flex-col items-center text-center">
              {/* Subheading Badge */}
              {subheading && (
                <Link href={`/article/${article.slug}`}>
                  <span className={cn(
                    'inline-block px-4 py-1.5 mb-3 bg-news-blue dark:bg-blue-600 text-white text-sm font-bold rounded-sm',
                    isNepali ? 'font-nepali' : ''
                  )}>
                    {subheading}
                  </span>
                </Link>
              )}

              {/* Massive Title */}
              <Link href={`/article/${article.slug}`}>
                <h1 className={cn(
                  'font-bold text-news-blue dark:text-blue-400 hover:text-news-red dark:hover:text-red-400 transition-colors mb-4',
                  isNepali ? 'font-nepali text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] leading-[1.3]' : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading leading-tight'
                )}>
                  {title}
                </h1>
              </Link>

              {/* Meta Information (Author + Time) */}
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                {/* Avatar / Initials as author icon */}
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-news-blue dark:text-blue-400 font-bold text-xs select-none">
                    {getAuthorName(article.author, language).substring(0, 2).toUpperCase()}
                  </span>
                  <span className={cn(isNepali ? 'font-nepali' : '')}>
                    {getAuthorName(article.author, language)}
                  </span>
                </div>

                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="h-4 w-4" />
                  {getRelativeTime(article.publishedAt, language)}
                </span>
              </div>

              {/* Full Width Image container */}
              <Link href={`/article/${article.slug}`} className="block relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={getArticleImage(article)}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1200px) 100vw, 1024px"
                  priority={index < 2}
                />
              </Link>

              {/* Excerpt Below Image */}
              <p className={cn(
                'mt-6 text-gray-700 dark:text-gray-300 text-base md:text-lg md:leading-relaxed max-w-4xl mx-auto',
                isNepali ? 'font-nepali' : ''
              )}>
                {excerpt}
              </p>
            </article>

            {/* Ads after 1st, 3rd, and 6th article */}
            {(index === 0 || index === 2 || index === 5) && (
              <div className="mt-8">
                {index === 0 && <Featured1Ad />}
                {index === 2 && <Featured2Ad />}
                {index === 5 && <Featured3Ad />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

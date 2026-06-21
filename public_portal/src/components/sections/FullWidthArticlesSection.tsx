'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types';

import { getRelativeTime, cn } from '@/lib/utils';
import { getArticleImage, getBlurDataUrl, isCDNImage } from '@/lib/utils/image';

import { Featured1Ad, Featured2Ad, Featured3Ad } from '@/components/ads/AdSlot';

interface FullWidthArticlesSectionProps {
  articles: Article[];
}

export function FullWidthArticlesSection({ articles }: FullWidthArticlesSectionProps) {

  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col gap-12 pb-8 border-b border-news-border dark:border-news-border-dark">
      {articles.map((article, index) => {
        const title = article.title;
        const subheading = article.subheading;
        const excerpt = article.excerpt;
        const isTitleOnlyFeatured = article.isFeatured && article.isTitleOnly;

        return (
          <div key={article.id}>
            <article className="group flex flex-col items-center text-center">
              
              {/* Subheading Badge - Now shows even if isTitleOnlyFeatured is true */}
              {subheading && (
                <Link href={`/article/${article.slug}`}>
                  <span className={cn(
                    'inline-block px-8 py-3 mb-3 bg-news-red dark:bg-blue-600 text-white text-md font-bold rounded-lg',
                    'font-nepali'
                  )}>
                    {subheading}
                  </span>
                </Link>
              )}

              {/* Massive Title */}
              <Link href={`/article/${article.slug}`}>
                <h1 className={cn(
                  'font-bold text-news-blue dark:text-blue-400 hover:text-news-red dark:hover:text-red-400 transition-colors mb-4',
                  'font-nepali text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] leading-[1.3]'
                )}>
                  {title}
                </h1>
              </Link>

              {/* Meta Information (Author + Time) - Always Visible */}
              <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
                 <div className="flex items-center gap-2">
                    {article.author.image ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <Image
                          src={article.author.image}
                          alt={article.author.name || ''}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-news-blue dark:text-blue-400 font-bold text-xs select-none">
                        {(article.author.name || '??').substring(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className={cn('font-nepali')}>
                      {article.author.name || ''}
                    </span>
                  </div>

                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <Clock className="h-4 w-4" />
                  {getRelativeTime(article.publishedAt)}
                </span>
              </div>

              {/* Full Width Image container - Hidden if isTitleOnlyFeatured is true */}
              {!isTitleOnlyFeatured && (
                <Link href={`/article/${article.slug}`} className="block relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-md group-hover:shadow-lg transition-shadow duration-300">
                   <Image
                     src={getArticleImage(article)}
                     alt={title || ''}
                     fill
                     className="object-cover transition-transform duration-700 group-hover:scale-105"
                     sizes="(max-width: 1200px) 100vw"
                     placeholder="blur"
                     blurDataURL={getBlurDataUrl()}
                     priority={index === 0}
                     unoptimized={isCDNImage(getArticleImage(article))}
                   />
                 </Link>
              )}
              
              {/* Excerpt - Hidden if isTitleOnlyFeatured is true */}
              {!isTitleOnlyFeatured && excerpt && (
                <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  {excerpt || ''}
                </p>
              )}
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
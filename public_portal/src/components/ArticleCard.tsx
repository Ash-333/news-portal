'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { getRelativeTime, toNepaliDigits, cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt, getCategoryName, getAuthorName } from '@/lib/utils/lang';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'horizontal' | 'compact' | 'featured' | 'province';
  showCategory?: boolean;
  showExcerpt?: boolean;
  showMeta?: boolean;
  className?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showExcerpt = true,
  showMeta = true,
  className,
}: ArticleCardProps) {
  const { isNepali, language } = useLanguage();

  const title = getTitle(article, language);
  const excerpt = getExcerpt(article, language);
  const categoryName = getCategoryName(article.category, language);

  if (variant === 'horizontal') {
    return (
      <article className={cn('flex gap-4 group', className)}>
        <Link href={`/article/${article.slug}`} className="shrink-0">
          <div className="relative w-32 h-24 sm:w-40 sm:h-28 rounded-lg overflow-hidden">
            <Image
              src={getArticleImage(article)}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 128px, 160px"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          {showCategory && (
            <Link
              href={`/category/${article.category.slug}`}
              className="category-label text-xs mb-2 inline-block"
            >
              {categoryName}
            </Link>
          )}
          <Link href={`/article/${article.slug}`}>
            <h3 className={cn(
              'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
              isNepali ? 'font-nepali text-base' : 'text-sm'
            )}>
              {title}
            </h3>
          </Link>
          {showMeta && (
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {getRelativeTime(article.publishedAt, language)}
              </span>
            </div>
          )}
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/article/${article.slug}`}>
          <h3 className={cn(
            'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
            isNepali ? 'font-nepali text-sm leading-relaxed' : 'text-sm'
          )}>
            {title}
          </h3>
        </Link>
        {showMeta && (
          <span className="text-xs text-gray-500 mt-1 block">
            {getRelativeTime(article.publishedAt, language)}
          </span>
        )}
      </article>
    );
  }

  if (variant === 'province') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/article/${article.slug}`} className="block relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
          <Image
            src={getArticleImage(article)}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        </Link>
        <Link href={`/article/${article.slug}`}>
          <h3 className={cn(
            'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
            isNepali ? 'font-nepali text-sm' : 'text-sm'
          )}>
            {title}
          </h3>
        </Link>
        {showMeta && (
          <span className="text-xs text-gray-500 mt-1 block">
            {getRelativeTime(article.publishedAt, language)}
          </span>
        )}
      </article>
    );
  }

  if (variant === 'featured') {
    return (
      <article className={cn('group', className)}>
        <Link href={`/article/${article.slug}`} className="block relative aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
          <Image
            src={getArticleImage(article)}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
          {/* Much stronger and taller gradient to make text super legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 flex flex-col justify-end">
            {showCategory && (
              <div className="mb-3">
                <span className="inline-block px-2.5 py-1 bg-news-red text-white text-xs sm:text-sm font-bold rounded-sm tracking-wide">
                  {categoryName}
                </span>
              </div>
            )}
            
            <h2 className={cn(
              'font-bold text-white mb-3 group-hover:text-red-300 transition-colors line-clamp-3',
              isNepali ? 'font-nepali text-2xl sm:text-3xl lg:text-[2.25rem] leading-[1.3]' : 'text-2xl sm:text-3xl lg:text-4xl font-heading leading-tight'
            )}>
              {title}
            </h2>
            
            {showMeta && (
              <div className="flex items-center gap-4 text-xs sm:text-sm text-white/80 font-medium">
                <span className={cn(isNepali ? 'font-nepali' : '')}>{getAuthorName(article.author, language)}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {getRelativeTime(article.publishedAt, language)}
                </span>
              </div>
            )}
          </div>
        </Link>
      </article>
    );
  }

  // Default variant
  return (
    <article className={cn('group', className)}>
      <Link href={`/article/${article.slug}`} className="block relative aspect-[16/10] rounded-lg overflow-hidden mb-3">
        <Image
          src={getArticleImage(article)}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </Link>
      {showCategory && (
        <div className="mb-2">
          <Link
            href={`/category/${article.category.slug}`}
            className="inline-block px-1.5 py-0.5 bg-news-red text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-sm"
          >
            {categoryName}
          </Link>
        </div>
      )}
      <Link href={`/article/${article.slug}`}>
        <h3 className={cn(
          'font-bold text-gray-900 dark:text-gray-100 line-clamp-3 group-hover:text-news-red transition-colors',
          isNepali ? 'font-nepali text-base leading-relaxed' : 'text-base lg:text-lg leading-snug'
        )}>
          {title}
        </h3>
      </Link>
      {showExcerpt && excerpt && (
        <p className={cn(
          'text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2',
          isNepali ? 'font-nepali' : ''
        )}>
          {excerpt}
        </p>
      )}
      {showMeta && (
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getRelativeTime(article.publishedAt, language)}
          </span>
        </div>
      )}
    </article>
  );
}

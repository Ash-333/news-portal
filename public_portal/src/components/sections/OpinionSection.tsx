'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getAuthorName } from '@/lib/utils/lang';

interface OpinionSectionProps {
  opinionArticles: Article[];
  category: Category;
}

export function OpinionSection({ opinionArticles, category }: OpinionSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (!opinionArticles.length) return null;

  const categoryName = isNepali ? category.nameNe : category.nameEn;
  const featuredArticle = opinionArticles[0];
  const subArticles = opinionArticles.slice(1, 3);
  const listArticles = opinionArticles.slice(3, 8);

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-news-red rounded-full" />
            <h2 className={cn(
              'text-xl md:text-2xl font-bold text-gray-900 dark:text-white',
              isNepali ? 'font-nepali' : ''
            )}>
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

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Featured + Sub Articles */}
          <div className="lg:col-span-8">
            {/* Featured Article */}
            <Link
              href={`/article/${featuredArticle.slug}`}
              className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
            >
              <Image
                src={getArticleImage(featuredArticle)}
                alt={getTitle(featuredArticle, language)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-end">
                <h2 className={cn(
                  'font-bold text-white mb-2 group-hover:text-red-300 transition-colors line-clamp-2',
                  isNepali ? 'font-nepali text-xl sm:text-2xl leading-[1.3]' : 'text-xl sm:text-2xl font-heading leading-tight'
                )}>
                  {getTitle(featuredArticle, language)}
                </h2>
              </div>
            </Link>

            {/* Sub Articles (2 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subArticles.map((article) => (
                <article key={article.id} className="group flex gap-3">
                  <Link
                    href={`/article/${article.slug}`}
                    className="shrink-0 w-24 h-20 rounded-lg overflow-hidden"
                  >
                    <Image
                      src={getArticleImage(article)}
                      alt={getTitle(article, language)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="96px"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${article.slug}`}>
                      <h3 className={cn(
                        'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                        isNepali ? 'font-nepali text-sm' : 'text-sm'
                      )}>
                        {getTitle(article, language)}
                      </h3>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Opinion List with Author Images */}
          <aside className="lg:col-span-4 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {isNepali ? 'विचार' : 'Opinions'}
            </h3>
            {listArticles.map((article) => {
              const authorName = getAuthorName(article.author, language);
              const authorInitial = authorName?.substring(0, 2).toUpperCase() || 'AU';
              
              return (
                <article key={article.id} className="group flex gap-3 items-start pb-4 border-b border-news-border dark:border-news-border-dark last:border-0">
                  <Link href={`/article/${article.slug}`} className="shrink-0">
                    <div className="w-12 h-12 rounded-full bg-news-red text-white flex items-center justify-center text-sm font-bold">
                      {authorInitial}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${article.slug}`}>
                      <h4 className={cn(
                        'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                        isNepali ? 'font-nepali text-sm' : 'text-sm'
                      )}>
                        {getTitle(article, language)}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">{authorName}</p>
                  </div>
                </article>
              );
            })}
          </aside>
        </div>
      </div>
    </section>
  );
}
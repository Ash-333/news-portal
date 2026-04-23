'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { AdBox } from '@/components/ads/AdBox';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';

interface SportsHomeSectionProps {
  articles: Article[];
  category: Category;
}

export function SportsHomeSection({ articles, category }: SportsHomeSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (!articles.length) return null;

  const categoryName = isNepali ? category.nameNe : category.nameEn;
  const featuredArticle = articles[0];
  const listArticles = articles.slice(1, 7);

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
          {/* Left: Featured Article + Ad */}
          <div className="lg:col-span-8">
            {/* Featured Article */}
            <Link
              href={`/article/${featuredArticle.slug}`}
              className="block relative aspect-[16/10] rounded-xl overflow-hidden mb-4 group"
            >
              <Image
                src={getArticleImage(featuredArticle)}
                alt={getTitle(featuredArticle, language)}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 flex flex-col justify-end">
                <h2 className={cn(
                  'font-bold text-white mb-2 group-hover:text-red-300 transition-colors line-clamp-2',
                  isNepali ? 'font-nepali text-xl sm:text-2xl leading-[1.3]' : 'text-xl sm:text-2xl font-heading leading-tight'
                )}>
                  {getTitle(featuredArticle, language)}
                </h2>
              </div>
            </Link>

            {/* Ad below featured */}
            <div className="mb-4">
              <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
            </div>

            {/* Article Grid (2x3) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {listArticles.slice(0, 6).map((article) => (
                <article key={article.id} className="group">
                  <Link
                    href={`/article/${article.slug}`}
                    className="block relative aspect-[16/10] rounded-lg overflow-hidden mb-2"
                  >
                    <Image
                      src={getArticleImage(article)}
                      alt={getTitle(article, language)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 250px"
                    />
                  </Link>
                  <Link href={`/article/${article.slug}`}>
                    <h3 className={cn(
                      'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-sm' : 'text-sm'
                    )}>
                      {getTitle(article, language)}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* Right: Title List */}
          <aside className="lg:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-news-red rounded-full" />
              {isNepali ? 'थप समाचार' : 'More News'}
            </h3>
            <div className="space-y-3">
              {listArticles.map((article) => (
                <article key={article.id} className="group pb-3 border-b border-news-border dark:border-news-border-dark last:border-0">
                  <Link href={`/article/${article.slug}`}>
                    <h4 className={cn(
                      'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-sm leading-relaxed' : 'text-sm'
                    )}>
                      {getTitle(article, language)}
                    </h4>
                  </Link>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
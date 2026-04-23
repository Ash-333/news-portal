'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt } from '@/lib/utils/lang';

interface EconomySectionProps {
  articles: Article[];
  category: Category;
}

export function EconomySection({ articles, category }: EconomySectionProps) {
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Featured - Title below image */}
          <div className="lg:col-span-7">
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
            </Link>
            <Link href={`/article/${featuredArticle.slug}`}>
              <h3 className={cn(
                'font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                isNepali ? 'font-nepali text-2xl sm:text-3xl leading-[1.2]' : 'text-2xl sm:text-3xl font-heading leading-tight'
              )}>
                {getTitle(featuredArticle, language)}
              </h3>
            </Link>
          </div>

          {/* List with images */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-1 gap-4">
              {listArticles.map((article) => (
                <article key={article.id} className="group flex gap-4 items-start">
                  <Link href={`/article/${article.slug}`} className="shrink-0">
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={getArticleImage(article)}
                        alt={getTitle(article, language)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 112px, 120px"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${article.slug}`}>
                      <h4 className={cn(
                        'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                        isNepali ? 'font-nepali text-sm md:text-base leading-relaxed' : 'text-sm md:text-base'
                      )}>
                        {getTitle(article, language)}
                      </h4>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
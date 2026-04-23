'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';

interface LifestyleHealthSectionProps {
  lifestyleCategory: Category;
  lifestyleArticles: Article[];
  healthCategory: Category;
  healthArticles: Article[];
}

export function LifestyleHealthSection({
  lifestyleCategory,
  lifestyleArticles,
  healthCategory,
  healthArticles,
}: LifestyleHealthSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (lifestyleArticles.length === 0 && healthArticles.length === 0) return null;

  const lifestyleName = isNepali ? lifestyleCategory.nameNe : lifestyleCategory.nameEn;
  const healthName = isNepali ? healthCategory.nameNe : healthCategory.nameEn;

  const lifestyleList = lifestyleArticles.slice(0, 4);
  const healthFeatured = healthArticles[0];
  const healthList = healthArticles.slice(1, 7);

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
              {isNepali ? 'जीवनशैली र स्वास्थ्य' : 'Lifestyle & Health'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LIFESTYLE - Left Side - 30% */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-red rounded-full" />
                <h3 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {lifestyleName}
                </h3>
              </div>
              <Link
                href={`/category/${lifestyleCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* List - Image left, title right */}
            <div className="grid grid-cols-1 gap-3">
              {lifestyleList.map((article) => (
                <article key={article.id} className="group flex gap-3 items-start">
                  <Link href={`/article/${article.slug}`} className="shrink-0">
                    <div className="relative w-24 h-20 rounded-lg overflow-hidden">
                      <Image
                        src={getArticleImage(article)}
                        alt={getTitle(article, language)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="96px"
                      />
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${article.slug}`}>
                      <h5 className={cn(
                        'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                        isNepali ? 'font-nepali text-sm leading-relaxed' : 'text-sm'
                      )}>
                        {getTitle(article, language)}
                      </h5>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* HEALTH - Right Side - 70% */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-green-600 rounded-full" />
                <h3 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {healthName}
                </h3>
              </div>
              <Link
                href={`/category/${healthCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured - Title below image */}
            {healthFeatured && (
              <Link
                href={`/article/${healthFeatured.slug}`}
                className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
              >
                <Image
                  src={getArticleImage(healthFeatured)}
                  alt={getTitle(healthFeatured, language)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
              </Link>
            )}
            {healthFeatured && (
              <Link href={`/article/${healthFeatured.slug}`} className="mb-4 block">
                <h4 className={cn(
                  'font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                  isNepali ? 'font-nepali text-lg leading-[1.2]' : 'text-lg font-heading leading-tight'
                )}>
                  {getTitle(healthFeatured, language)}
                </h4>
              </Link>
            )}

            {/* List - 2 columns x 3 rows */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {healthList.map((article) => (
                <article key={article.id} className="group">
                  <Link href={`/article/${article.slug}`} className="block">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={getArticleImage(article)}
                        alt={getTitle(article, language)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                      />
                    </div>
                    <h5 className={cn(
                      'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-sm leading-relaxed' : 'text-sm'
                    )}>
                      {getTitle(article, language)}
                    </h5>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
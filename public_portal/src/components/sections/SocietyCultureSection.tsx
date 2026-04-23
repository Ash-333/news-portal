'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';

interface SocietyCultureSectionProps {
  societyCategory: Category;
  societyArticles: Article[];
  cultureCategory: Category;
  cultureArticles: Article[];
}

export function SocietyCultureSection({
  societyCategory,
  societyArticles,
  cultureCategory,
  cultureArticles,
}: SocietyCultureSectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (societyArticles.length === 0 && cultureArticles.length === 0) return null;

  const societyName = isNepali ? societyCategory.nameNe : societyCategory.nameEn;
  const cultureName = isNepali ? cultureCategory.nameNe : cultureCategory.nameEn;

  const societyFeatured = societyArticles[0];
  const societyGrid = societyArticles.slice(1, 4);
  const cultureFeatured = cultureArticles[0];
  const cultureGrid = cultureArticles.slice(1, 7);

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
              {isNepali ? 'समाज र संस्कृति' : 'Society & Culture'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Society - 60% */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-red rounded-full" />
                <h3 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {societyName}
                </h3>
              </div>
              <Link
                href={`/category/${societyCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured */}
            {societyFeatured && (
              <Link
                href={`/article/${societyFeatured.slug}`}
                className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
              >
                <Image
                  src={getArticleImage(societyFeatured)}
                  alt={getTitle(societyFeatured, language)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                  <h4 className={cn(
                    'font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors',
                    isNepali ? 'font-nepali text-lg leading-[1.2]' : 'text-lg font-heading leading-tight'
                  )}>
                    {getTitle(societyFeatured, language)}
                  </h4>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {societyGrid.map((article) => (
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
                      sizes="(max-width: 768px) 100vw, 150px"
                    />
                  </Link>
                  <Link href={`/article/${article.slug}`}>
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

          {/* Right: Culture (Dharam) - 40% */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-yellow-600 rounded-full" />
                <h3 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {cultureName}
                </h3>
              </div>
              <Link
                href={`/category/${cultureCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured */}
            {cultureFeatured && (
              <Link
                href={`/article/${cultureFeatured.slug}`}
                className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
              >
                <Image
                  src={getArticleImage(cultureFeatured)}
                  alt={getTitle(cultureFeatured, language)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 500px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                  <h4 className={cn(
                    'font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors',
                    isNepali ? 'font-nepali text-lg leading-[1.2]' : 'text-lg font-heading leading-tight'
                  )}>
                    {getTitle(cultureFeatured, language)}
                  </h4>
                </div>
              </Link>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cultureGrid.map((article) => (
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
                      sizes="(max-width: 768px) 100vw, 150px"
                    />
                  </Link>
                  <Link href={`/article/${article.slug}`}>
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
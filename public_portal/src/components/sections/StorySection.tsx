'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';

interface StorySectionProps {
  articles: Article[];
  category: Category;
}

export function StorySection({ articles, category }: StorySectionProps) {
  const { isNepali, language, t } = useLanguage();

  if (!articles.length) return null;

  const categoryName = isNepali ? category.nameNe : category.nameEn;
  const displayArticles = articles.slice(0, 3);

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

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {displayArticles.map((article) => {
            const title = getTitle(article, language);
            return (
              <article key={article.id} className="group">
                <Link
                  href={`/article/${article.slug}`}
                  className="block relative aspect-[4/3] rounded-lg overflow-hidden mb-3"
                >
                  <Image
                    src={getArticleImage(article)}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </Link>
                <Link href={`/article/${article.slug}`}>
                  <h3 className={cn(
                    'font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                    isNepali ? 'font-nepali text-base leading-relaxed' : 'text-base lg:text-lg leading-snug'
                  )}>
                    {title}
                  </h3>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
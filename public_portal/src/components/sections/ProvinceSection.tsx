'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';

interface ProvinceData {
  slug: string;
  nameNe: string;
  nameEn: string;
}

interface ProvinceSectionProps {
  provinces: { data: Article[]; info: ProvinceData }[];
}

export function ProvinceSection({ provinces }: ProvinceSectionProps) {
  const { isNepali, language } = useLanguage();

  const validProvinces = provinces.filter(p => p.data.length > 0);
  if (validProvinces.length === 0) return null;

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-news-red rounded-full" />
            <h2 className={cn(
              'text-xl md:text-2xl font-bold text-gray-900 dark:text-white',
              isNepali ? 'font-nepali' : ''
            )}>
              {isNepali ? 'प्रदेशहरु' : 'Provincial News'}
            </h2>
          </div>
          <Link
            href="/provinces"
            className="flex items-center gap-1 text-sm text-news-red hover:underline font-medium"
          >
            <span className={isNepali ? 'font-nepali' : ''}>{isNepali ? 'सबै हेर्नुहोस्' : 'View All'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {validProvinces.map(({ data: articles, info }) => {
            const featuredArticle = articles[0];
            const listArticles = articles.slice(1, 4);

            return (
              <div key={info.slug} className="space-y-3">
                {/* Featured Article */}
                {featuredArticle && (
                  <article className="group">
                    <Link
                      href={`/article/${featuredArticle.slug}`}
                      className="block relative aspect-[16/10] rounded-lg overflow-hidden mb-2"
                    >
                      <Image
                        src={getArticleImage(featuredArticle)}
                        alt={getTitle(featuredArticle, language)}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </Link>
                    <Link href={`/article/${featuredArticle.slug}`}>
                      <h3 className={cn(
                        'font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                        isNepali ? 'font-nepali text-sm md:text-base leading-relaxed' : 'text-sm md:text-base'
                      )}>
                        {getTitle(featuredArticle, language)}
                      </h3>
                    </Link>
                  </article>
                )}

                {/* List Articles */}
                <div className="space-y-2">
                  {listArticles.map((article) => (
                    <article key={article.id} className="group">
                      <Link href={`/article/${article.slug}`}>
                        <h4 className={cn(
                          'text-sm text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-news-red transition-colors',
                          isNepali ? 'font-nepali text-xs' : 'text-xs'
                        )}>
                          {getTitle(article, language)}
                        </h4>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
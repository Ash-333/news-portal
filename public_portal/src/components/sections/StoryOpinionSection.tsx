'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Article } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { getTitle } from '@/lib/utils/lang';
import { getAuthorAvatar } from '@/lib/utils/image';
import { cn } from '@/lib/utils';

interface StoryOpinionSectionProps {
  opinionArticles: Article[];
  storyArticles: Article[];
}

export function StoryOpinionSection({ opinionArticles, storyArticles }: StoryOpinionSectionProps) {
  const { isNepali, t } = useLanguage();
  const { language } = useLanguage();

  if (opinionArticles.length === 0 && storyArticles.length === 0) {
    return null;
  }

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-news-red rounded-full" />
              <h2 className={cn('text-xl md:text-2xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
                {isNepali ? 'विचार' : 'Opinion'}
              </h2>
              <Link
                href="/category/opinion"
                className="flex items-center gap-1 text-sm text-news-red hover:underline font-medium ml-auto"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {opinionArticles.slice(0, 5).map((article) => {
                const title = getTitle(article, language);
                const authorName = isNepali ? article.author.nameNe : article.author.name;
                const authorImage = getAuthorAvatar(
                  article.author.profilePhoto || null,
                  authorName
                );
                
                return (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                      <Image
                        src={authorImage}
                        alt={authorName || 'Author'}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className={cn(
                      'font-medium text-gray-900 dark:text-gray-100 line-clamp-2',
                      isNepali ? 'font-nepali text-sm' : 'text-sm'
                    )}>
                      {title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-news-red rounded-full" />
              <h2 className={cn('text-xl md:text-2xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
                {isNepali ? 'कथा' : 'Story'}
              </h2>
              <Link
                href="/category/story"
                className="flex items-center gap-1 text-sm text-news-red hover:underline font-medium ml-auto"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {storyArticles.slice(0, 4).map((article) => {
                const title = getTitle(article, language);
                
                return (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group block rounded-lg overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] bg-gray-200">
                      {article.featuredImage && (
                        <Image
                          src={typeof article.featuredImage === 'string' ? article.featuredImage : article.featuredImage?.url || '/images/placeholder.jpg'}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                        />
                      )}
                    </div>
                    <h3 className={cn(
                      'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 mt-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-sm' : 'text-sm'
                    )}>
                      {title}
                    </h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
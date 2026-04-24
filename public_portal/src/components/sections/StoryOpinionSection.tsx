'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getArticleImage, getAuthorAvatar } from '@/lib/utils/image';
import { getTitle, getAuthorName } from '@/lib/utils/lang';

interface StoryOpinionSectionProps {
  storyArticles: Article[];
  storyCategory: Category;
  opinionArticles: Article[];
  opinionCategory: Category;
}

export function StoryOpinionSection({
  storyArticles,
  storyCategory,
  opinionArticles,
  opinionCategory,
}: StoryOpinionSectionProps) {
  const { isNepali, language, t } = useLanguage();

  const storyName = isNepali ? storyCategory.nameNe : storyCategory.nameEn;
  const opinionName = isNepali ? opinionCategory.nameNe : opinionCategory.nameEn;

  const displayStory = storyArticles.slice(0, 7);
  const displayOpinion = opinionArticles.slice(0, 7);

  if (!storyArticles.length && !opinionArticles.length) return null;

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Story - 70% - Featured + Grid */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-red rounded-full" />
                <h2 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {storyName}
                </h2>
              </div>
              <Link
                href={`/category/${storyCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Featured Story */}
            {displayStory[0] && (
              <Link
                href={`/article/${displayStory[0].slug}`}
                className="block relative aspect-[16/9] rounded-xl overflow-hidden mb-4 group"
              >
                <Image
                  src={getArticleImage(displayStory[0])}
                  alt={getTitle(displayStory[0], language)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                  <h3 className={cn(
                    'font-bold text-white line-clamp-2 group-hover:text-red-300 transition-colors',
                    isNepali ? 'font-nepali text-xl sm:text-2xl leading-[1.2]' : 'text-xl sm:text-2xl font-heading leading-tight'
                  )}>
                    {getTitle(displayStory[0], language)}
                  </h3>
                </div>
              </Link>
            )}

            {/* Grid of Stories */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {displayStory.slice(1, 7).map((article) => (
                <article key={article.id} className="group">
                  <Link
                    href={`/article/${article.slug}`}
                    className="block relative aspect-[4/3] rounded-lg overflow-hidden mb-2"
                  >
                    <Image
                      src={getArticleImage(article)}
                      alt={getTitle(article, language)}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 150px"
                    />
                  </Link>
                  <Link href={`/article/${article.slug}`}>
                    <h3 className={cn(
                      'font-bold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                      isNepali ? 'font-nepali text-xs sm:text-sm leading-relaxed' : 'text-xs sm:text-sm font-semibold'
                    )}>
                      {getTitle(article, language)}
                    </h3>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT: Opinion - 30% - List Only */}
          <div className="lg:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-news-blue rounded-full" />
                <h2 className={cn(
                  'text-lg font-bold text-gray-900 dark:text-white',
                  isNepali ? 'font-nepali' : ''
                )}>
                  {opinionName}
                </h2>
              </div>
              <Link
                href={`/category/${opinionCategory.slug}`}
                className="flex items-center gap-1 text-xs text-news-red hover:underline font-medium"
              >
                <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-5">
              {displayOpinion.map((article) => {
                const authorName = getAuthorName(article.author, language);
                const authorInitial = authorName?.substring(0, 2).toUpperCase() || 'AO';

                return (
                  <article key={article.id} className="group flex gap-3 items-start">
                    <Link href={`/article/${article.slug}`} className="shrink-0 relative w-24 h-24 rounded-full overflow-hidden bg-news-red">
                      {article.author?.profilePhoto ? (
                        <Image
                          src={getAuthorAvatar(article.author.profilePhoto, authorName)}
                          alt={authorName || 'Author'}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold">
                          {authorInitial}
                        </div>
                      )}
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/article/${article.slug}`}>
                        <h4 className={cn(
                          'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                          isNepali ? 'font-nepali text-base leading-relaxed' : 'text-base'
                        )}>
                          {getTitle(article, language)}
                        </h4>
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{authorName}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
'use client';

import Link from 'next/link';
import { Tag } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getTagName } from '@/lib/utils/lang';

interface ArticleTagsProps {
  tags: Tag[];
}

export function ArticleTags({ tags }: ArticleTagsProps) {
  const { isNepali, t } = useLanguage();

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className={cn('text-sm text-gray-500 mr-2', isNepali ? 'font-nepali' : '')}>
        {t('article.tags')}:
      </span>
      {tags.map((tag) => (
        <Link
          key={tag.id}
          href={`/tag/${tag.slug}`}
          className="px-3 py-1 bg-gray-100 dark:bg-news-card-dark text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-news-red hover:text-white transition-colors"
        >
          {getTagName(tag, isNepali ? 'ne' : 'en')}
        </Link>
      ))}
    </div>
  );
}

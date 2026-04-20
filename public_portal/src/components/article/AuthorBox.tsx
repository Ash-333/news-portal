'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArticleAuthor } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface AuthorBoxProps {
  author: ArticleAuthor;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  const { isNepali, language } = useLanguage();
  const authorName = isNepali ? (author.nameNe || author.name) : author.name;

  return (
    <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6 my-8">
      <div className="flex items-start gap-4">
        <Link href={`/author/${author.slug}`}>
          <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
            <Image
              src={author.profilePhoto || '/images/default-avatar.png'}
              alt={authorName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
        </Link>
        <div className="flex-1">
          <Link href={`/author/${author.slug}`}>
            <h3 className={cn(
              'font-bold text-lg text-gray-900 dark:text-white hover:text-news-red transition-colors',
              isNepali ? 'font-nepali' : ''
            )}>
              {authorName}
            </h3>
          </Link>
          <p className={cn('text-sm text-gray-600 dark:text-gray-400 mt-1', isNepali ? 'font-nepali leading-relaxed' : '')}>
            {isNepali && author.bioNe ? author.bioNe : author.bio}
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArticleAuthor } from '@/types';

import { cn } from '@/lib/utils';
import { isCDNImage } from '@/lib/utils/image';

interface AuthorBoxProps {
  author: ArticleAuthor;
}

export function AuthorBox({ author }: AuthorBoxProps) {
  console.log('AuthorBox author:', author); // Debugging line

  const authorName = author.name || '';

  return (
    <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6 my-8">
      <div className="flex items-start gap-4">
        <Link href={`/author/${author.slug}`}>
          {author.avatar ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0">
              <Image
                src={author.avatar}
                alt={authorName}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={isCDNImage(author.avatar)}
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-news-blue dark:text-blue-400 font-bold text-xl select-none shrink-0">
              {(authorName || '??').substring(0, 2).toUpperCase()}
            </div>
          )}
        </Link>
        <div className="flex-1">
          <Link href={`/author/${author.slug}`}>
            <h3 className={cn(
              'font-bold text-lg text-gray-900 dark:text-white hover:text-news-red transition-colors',
            )}>
              {authorName}
            </h3>
          </Link>
          <p className={'text-sm text-gray-600 dark:text-gray-400 mt-1'}>
            {author.bio || ''}
          </p>
        </div>
      </div>
    </div>
  );
}

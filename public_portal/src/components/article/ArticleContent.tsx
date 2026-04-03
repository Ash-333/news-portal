'use client';

import DOMPurify from 'isomorphic-dompurify';
import { cn } from '@/lib/utils';
import { processContent } from '@/lib/utils/content';

interface ArticleContentProps {
  content: string;
  lang: 'ne' | 'en';
}

export function ArticleContent({ content, lang }: ArticleContentProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const processed = processContent(content, apiUrl);
  const clean = DOMPurify.sanitize(processed);

  return (
    <div
      className={cn(
        'prose prose-lg max-w-none',
        'prose-headings:text-gray-900 dark:prose-headings:text-white',
        'prose-a:text-news-red hover:prose-a:underline',
        'prose-strong:text-gray-900 dark:prose-strong:text-white',
        'prose-ul:text-gray-700 dark:prose-ul:text-gray-300',
        'prose-ol:text-gray-700 dark:prose-ol:text-gray-300',
        'prose-blockquote:border-l-news-red',
        'prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400',
        'article-body',
        lang === 'ne'
          ? 'font-nepali text-[17px] leading-[1.9]'
          : 'text-[17px] leading-[1.8]'
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}


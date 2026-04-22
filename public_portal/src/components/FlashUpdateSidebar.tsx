'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { fetchPublishedArticles } from '@/lib/api';
import { cn } from '@/lib/utils';

export function FlashUpdateSidebar() {
  const { isNepali } = useLanguage();
  
  const { data: articlesResponse } = useQuery({
    queryKey: ['articles', 'sidebar-flash-updates'],
    queryFn: () => fetchPublishedArticles({ isFlashUpdate: true, limit: 5 }),
  });
  
  const flashUpdates = articlesResponse || [];

  if (flashUpdates.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-news-card-dark rounded-lg border border-news-border dark:border-gray-700 overflow-hidden">
      <div className="bg-news-red text-white px-4 py-2 flex items-center gap-2">
        <Zap className="w-4 h-4" />
        <span className="font-semibold text-sm">
          {isNepali ? 'ताजा अपडेट' : 'Flash Updates'}
        </span>
      </div>
      <ul className="divide-y divide-news-border dark:divide-gray-700">
        {flashUpdates.map((article) => (
          <li key={article.id}>
            <Link
              href={`/articles/${article.slug}`}
              className="block p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <span className={cn(
                'text-sm font-medium text-gray-900 dark:text-white line-clamp-2',
                isNepali ? 'font-nepali' : ''
              )}>
                {isNepali ? article.titleNe : article.titleEn}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-3 border-t border-news-border dark:border-gray-700">
        <Link
          href={`/articles?flash=true`}
          className="text-news-red text-xs font-semibold hover:underline flex items-center gap-1"
        >
          {isNepali ? 'सबै हेर्नुहोस्' : 'View All'}
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
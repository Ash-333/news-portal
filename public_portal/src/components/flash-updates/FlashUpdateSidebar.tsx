'use client';

import Link from 'next/link';
import { useFlashUpdatesQuery } from '@/hooks/useNewsQueries';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';

export function FlashUpdateSidebar() {
  const { isNepali, t } = useLanguage();
  const { data, isLoading } = useFlashUpdatesQuery({ limit: 5 });
  const updates = data?.data || [];

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-news-card-dark rounded-xl p-6 border border-news-border dark:border-news-border-dark animate-pulse">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-4 space-y-2">
            <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (updates.length === 0) return null;

  return (
    <div className="bg-white dark:bg-news-card-dark rounded-xl p-6 border border-news-border dark:border-news-border-dark">
      <div className="flex items-center justify-between mb-6">
        <h3 className={cn(
          "font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2",
          isNepali ? "font-nepali" : ""
        )}>
          <span className="flex h-2 w-2 rounded-full bg-news-red animate-pulse" />
          {isNepali ? '२४ घण्टा अपडेट' : '24 Hours Update'}
        </h3>
        <Link href="/flash-updates" className="text-news-red text-xs font-semibold hover:underline flex items-center gap-1">
          {isNepali ? 'सबै' : 'View All'}
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div key={update.id} className="group border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
            <Link href={`/flash-updates#${update.slug}`} className="block">
              <h4 className={cn(
                "text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-news-red transition-colors line-clamp-2",
                isNepali ? "font-nepali" : ""
              )}>
                {isNepali ? update.titleNe : update.titleEn}
              </h4>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase">
                {formatDistanceToNow(new Date(update.publishedAt), { addSuffix: true })}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

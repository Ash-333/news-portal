'use client';

import { FlashUpdate } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, User } from 'lucide-react';

interface FlashUpdateCardProps {
  update: FlashUpdate;
}

export function FlashUpdateCard({ update }: FlashUpdateCardProps) {
  const { isNepali, t } = useLanguage();
  const title = isNepali ? update.titleNe : update.titleEn;
  const content = isNepali ? update.contentNe : update.contentEn;
  const authorName = update.author?.name || 'Admin';

  return (
    <div className="bg-white dark:bg-news-card-dark rounded-xl border border-news-border dark:border-news-border-dark overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-news-red animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-wider text-news-red">
            {isNepali ? 'ताजा अपडेट' : 'Flash Update'}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 ml-auto flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(update.publishedAt), { addSuffix: true })}
          </span>
        </div>
        
        <h3 className={cn(
          "text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-news-red transition-colors",
          isNepali ? "font-nepali" : ""
        )}>
          {title}
        </h3>
        
        <div className={cn(
          "text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4",
          isNepali ? "font-nepali" : ""
        )}>
          {content}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3.5 w-3.5" />
            <span>{authorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

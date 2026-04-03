'use client';

import { useAudioNewsList } from '@/hooks/useAudioNews';
import { useLanguage } from '@/context/LanguageContext';
import { AudioNewsPlayer, AudioNewsPlayerSkeleton } from './AudioNewsPlayer';
import { cn } from '@/lib/utils';
import { Headphones } from 'lucide-react';

interface AudioNewsListProps {
  limit?: number;
  className?: string;
}

export function AudioNewsList({ limit = 10, className }: AudioNewsListProps) {
  const { isNepali } = useLanguage();
  const { data: audioNews, isLoading, error } = useAudioNewsList({ limit });

  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {[...Array(3)].map((_, i) => (
          <AudioNewsPlayerSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Headphones className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 text-sm">
          {isNepali ? 'अडियो समाचार लोड गर्न असमर्थ' : 'Unable to load audio news'}
        </p>
      </div>
    );
  }

  if (!audioNews || audioNews.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Headphones className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 text-sm">
          {isNepali ? 'कुनै अडियो समाचार उपलब्ध छैन' : 'No audio news available'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {audioNews.map((item) => (
        <AudioNewsPlayer
          key={item.id}
          audioUrl={item.audioUrl}
          title={isNepali ? item.titleNe : item.titleEn}
          titleNe={item.titleNe}
          thumbnailUrl={item.thumbnailUrl || undefined}
        />
      ))}
    </div>
  );
}

// Audio news section with header
interface AudioNewsSectionProps {
  limit?: number;
  className?: string;
  showHeader?: boolean;
}

export function AudioNewsSection({
  limit = 10,
  className,
  showHeader = true,
}: AudioNewsSectionProps) {
  const { isNepali } = useLanguage();

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-news-red" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {isNepali ? 'अडियो समाचार' : 'Audio News'}
          </h3>
        </div>
      )}
      <AudioNewsList limit={limit} />
    </div>
  );
}

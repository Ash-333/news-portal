'use client';

import { useAudioNewsList } from '@/hooks/useAudioNews';

import { AudioNewsPlayer, AudioNewsPlayerSkeleton } from './AudioNewsPlayer';
import { cn } from '@/lib/utils';
import { Headphones } from 'lucide-react';

interface AudioNewsListProps {
  limit?: number;
  className?: string;
}

export function AudioNewsList({ className }: AudioNewsListProps) {
  
  const { data: audioNews, isLoading, error } = useAudioNewsList();

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
          {'अडियो समाचार लोड गर्न असमर्थ'}
        </p>
      </div>
    );
  }

  if (!audioNews || audioNews.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <Headphones className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-gray-500 text-sm">
          {'कुनै अडियो समाचार उपलब्ध छैन'}
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
          title={item.title || ''}
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

  return (
    <div className={className}>
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Headphones className="w-5 h-5 text-news-red" />
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
            {'अडियो समाचार'}
          </h3>
        </div>
      )}
      <AudioNewsList limit={limit} />
    </div>
  );
}

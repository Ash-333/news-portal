'use client';

import { getVideos } from '@/lib/api/videos';
import { VideoCard } from '@/components/videos/VideoCard';
import { VideoUpdate } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/context/LanguageContext';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';

export function VideoSection() {
  const { isNepali } = useLanguage();
  
  const { data: videosData, isLoading } = useQuery({
    queryKey: ['videos', 'home'],
    queryFn: async () => {
      const res = await getVideos({ limit: 6 });
      return res.data as VideoUpdate[];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Video className="w-6 h-6 text-news-red" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isNepali ? 'भिडियो समाचार' : 'Video News'}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 mt-4 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!videosData || videosData.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Video className="w-6 h-6 text-news-red" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isNepali ? 'भिडियो समाचार' : 'Video News'}
        </h2>
      </div>
      
      <div className={cn(
        "grid gap-6",
        videosData.length === 1 ? "grid-cols-1" :
        videosData.length === 2 ? "grid-cols-1 md:grid-cols-2" :
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      )}>
        {videosData.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
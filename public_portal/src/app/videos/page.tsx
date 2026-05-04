'use client';

import { useVideosQuery } from '@/hooks/useNewsQueries';
import { VideoCard } from '@/components/videos/VideoCard';
import { AdBox } from '@/components/ads/AdBox';
import { cn } from '@/lib/utils';

export default function VideosPage() {

  const { data, isLoading } = useVideosQuery();
  const videos = data?.data || [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className={cn(
            "text-4xl font-extrabold text-gray-900 dark:text-white",
          )}>
            Video Updates
          </h1>
          <div className="h-1 w-20 bg-news-red rounded-full mb-4" />
          <p className={cn(
            "text-lg text-gray-600 dark:text-gray-400",
          )}>
            Watch the latest news updates and stories
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Featured Ad */}
          <div className="mb-10 hidden md:block">
            <AdBox position="HOME_TOP" className="h-[90px] w-full max-w-[728px] mx-auto" />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No videos available yet.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

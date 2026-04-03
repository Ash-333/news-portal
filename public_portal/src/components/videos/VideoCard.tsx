'use client';

import { VideoUpdate } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { Play, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
  video: VideoUpdate;
}

export function VideoCard({ video }: VideoCardProps) {
  const { isNepali } = useLanguage();
  
  return (
    <div className="bg-white dark:bg-news-card-dark rounded-xl border border-news-border dark:border-news-border-dark overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={video.thumbnailUrl}
          alt={isNepali ? video.titleNe : video.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-news-red text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 fill-current ml-1" />
          </div>
        </div>
        <a 
          href={video.youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0 z-10"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className={cn(
          "text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-news-red transition-colors",
          isNepali ? "font-nepali" : ""
        )}>
          {isNepali ? video.titleNe : video.titleEn}
        </h3>
        
        <div className="flex items-center justify-between mt-4 text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span>{video.author?.name || 'Staff'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

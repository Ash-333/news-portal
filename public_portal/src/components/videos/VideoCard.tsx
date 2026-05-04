'use client';

import { VideoUpdate } from '@/types';

import { cn } from '@/lib/utils';
import { Play, Calendar, User } from 'lucide-react';
import Image from 'next/image';

interface VideoCardProps {
  video: VideoUpdate;
}

export function VideoCard({ video }: VideoCardProps) {

  return (
    <div className="bg-white dark:bg-news-card-dark rounded-xl border border-news-border dark:border-news-border-dark overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={video.thumbnailUrl}
          alt={video.title || ''}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 text-news-red flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className={cn(
          "font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-news-red transition-colors",
          "text-base"
        )}>
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3" />
            <span className="font-nepali">{video.author?.name || 'Staff'}</span>
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

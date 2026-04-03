'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioNewsPlayerProps {
  audioUrl: string;
  title: string;
  titleNe?: string;
  thumbnailUrl?: string;
  className?: string;
  autoPlay?: boolean;
}

export function AudioNewsPlayer({
  audioUrl,
  title,
  titleNe,
  thumbnailUrl,
  className,
  autoPlay = false,
}: AudioNewsPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Construct full audio URL (prepend hostname only, not the full API URL)
  const getAudioSourceUrl = (url: string): string => {
    if (url.startsWith('http')) return url;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api').replace('/api', '');
    return `${baseUrl}${url}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented
      });
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Play was prevented
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('bg-white dark:bg-news-card-dark rounded-lg shadow-sm border border-news-border dark:border-news-border-dark p-4', className)}>
      <audio ref={audioRef} src={getAudioSourceUrl(audioUrl)} preload="metadata" />

      <div className="flex items-center gap-4">
        {/* Thumbnail / Play button */}
        <button
          onClick={togglePlay}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-news-red text-white hover:bg-news-red-dark transition-colors shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        {/* Title and progress */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate">
            {titleNe || title}
          </h4>

          {/* Progress bar */}
          <div
            className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-news-red rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-news-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Time display */}
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

// Loading skeleton
export function AudioNewsPlayerSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white dark:bg-news-card-dark rounded-lg shadow-sm border border-news-border dark:border-news-border-dark p-4 animate-pulse', className)}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700" />
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

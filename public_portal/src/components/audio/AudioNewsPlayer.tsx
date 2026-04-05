'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';

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
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
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
    const percentage = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percentage * duration;
    setCurrentTime(percentage * duration);
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
        <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-200">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={titleNe || title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-news-red text-white">
              <Headphones className="w-5 h-5" />
            </div>
          )}
        </div>

        <button
          onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-news-red text-white hover:bg-news-red-dark transition-colors shrink-0"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
            {titleNe || title}
          </h4>

          <div
            className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="h-full bg-news-red rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-news-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>
        </div>

        <button
          onClick={toggleMute}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

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
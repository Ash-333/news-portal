'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdPosition, AdWithPosition } from '@/types';
import { getAdsByPosition, trackAdClick } from '@/lib/api/ads';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  position: AdPosition;
  className?: string;
}

export function AdSlot({ position, className }: AdSlotProps) {
  const { isNepali } = useLanguage();
  const [ad, setAd] = useState<AdWithPosition | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['ads', position],
    queryFn: async () => {
      const response = await getAdsByPosition(position);
      return response.data as AdWithPosition[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Randomly select an ad from the list
      const randomIndex = Math.floor(Math.random() * data.length);
      setAd(data[randomIndex]);
    }
  }, [data]);

  const handleAdClick = async () => {
    if (!ad) return;
    
    try {
      await trackAdClick(ad.id);
      // Open the ad link in a new tab
      window.open(ad.linkUrl, '_blank');
    } catch (error) {
      console.error('Failed to track ad click:', error);
      // Still open the link even if tracking fails
      window.open(ad.linkUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={cn('bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md', className)}>
        <div className="h-48 flex items-center justify-center text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return null;
  }

  return (
    <div 
      className={cn(
        'cursor-pointer hover:opacity-90 transition-opacity overflow-hidden',
        className
      )}
      onClick={handleAdClick}
    >
      {ad.mediaType === 'image' ? (
        <img
          src={ad.mediaUrl}
          alt={isNepali ? ad.titleNe : ad.titleEn}
          className="w-full h-auto object-cover"
        />
      ) : ad.mediaType === 'video' ? (
        <video
          src={ad.mediaUrl}
          className="w-full h-auto"
          autoPlay
          muted
          loop
        />
      ) : (
        // Script-based ad (e.g., Google Adsense)
        <div 
          dangerouslySetInnerHTML={{ __html: ad.mediaUrl }}
          className="w-full"
        />
      )}
    </div>
  );
}

// Pre-defined ad positions for easy reuse
export function SidebarAd({ className }: { className?: string }) {
  return <AdSlot position="SIDEBAR" className={cn('min-h-[250px]', className)} />;
}

export function BannerAd({ className }: { className?: string }) {
  return <AdSlot position="BANNER" className={cn('min-h-[90px]', className)} />;
}

export function InArticleAd({ className }: { className?: string }) {
  return <AdSlot position="IN_ARTICLE" className={cn('min-h-[250px] my-4', className)} />;
}
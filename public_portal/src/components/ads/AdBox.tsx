'use client';

import { useAdsQuery } from '@/hooks/useNewsQueries';

import { cn } from '@/lib/utils';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';


interface AdBoxProps {
  position: 'SIDEBAR_TOP' | 'SIDEBAR_BOTTOM' | 'HOME_MIDDLE' | 'HOME_TOP' | 'TOP_BAR' | 'ARTICLE_DETAIL' | 'LATEST_NEWS' | 'CATEGORY_SECTION' | 'SECTION_SIDEBAR' | string;
  className?: string;
}

export function AdBox({ position, className }: AdBoxProps) {

  const { data, isLoading } = useAdsQuery();
  const ads = data?.data || [];
  
  // Find active ad for this position
  const activeAd = ads.find(ad => ad.isActive && ad.position === position);

  if (isLoading) {
    return <AdPlaceholder className={className} />;
  }

  if (!activeAd) {
    return null;
  }

  const mediaType = activeAd.mediaType?.toLowerCase();

  return (
    <div className={cn("relative group overflow-hidden rounded-lg shadow-sm w-full h-full", className)}>
      <a
        href={activeAd.linkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        {mediaType === 'video' ? (
          <video
            src={activeAd.mediaUrl}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            autoPlay
            muted
            loop
          />
        ) : (
          <img
            src={activeAd.mediaUrl}
            alt={activeAd.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          Ad
        </div>
      </a>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Calendar, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';

import { toNepaliDigits, formatDate } from '@/lib/utils';
import { AdBox } from '@/components/ads/AdBox';
import { NepaliDate } from "nepali-date-library";
import { useQuery } from '@tanstack/react-query';
import { getSocialLinks, SocialLinks } from '@/lib/api/settings';

export function TopBar() {

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const bsDate = new NepaliDate();

  const { data: socialLinksResponse } = useQuery({
    queryKey: ['social-links'],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 60,
  });

  const socialLinks = socialLinksResponse?.data;

  const facebookUrl = socialLinks?.facebookUrl || 'https://facebook.com';
  const twitterUrl = socialLinks?.twitterUrl || 'https://twitter.com';
  const youtubeUrl = socialLinks?.youtubeUrl || 'https://youtube.com';
  const instagramUrl = socialLinks?.instagramUrl || 'https://instagram.com';

  return (
    <div className="bg-news-red text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Date */}
           <div className="flex items-center gap-4 text-sm">
             <div className="flex items-center gap-2">
               <Calendar className="h-4 w-4" />
               <span className='font-nepali'>
                 <span className="font-medium">{String(bsDate)}</span>
               </span>
             </div>
           </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              {socialLinks?.facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                   aria-label="फेसबुक"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                   aria-label="ट्विटर"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                   aria-label="युट्युब"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                   aria-label="इन्स्टाग्राम"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Banner Ad */}
      <div className="bg-white dark:bg-news-bg-dark py-4 border-b border-news-border dark:border-news-border-dark hidden md:block">
        <div className="container mx-auto px-4 flex justify-center">
          <AdBox position="TOP_BAR" className="h-[90px] w-full max-w-[728px]" />
        </div>
      </div>
    </div>
  );
}

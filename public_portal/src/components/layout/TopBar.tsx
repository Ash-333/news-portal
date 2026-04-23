'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toNepaliDigits, formatDate } from '@/lib/utils';
import { AdBox } from '@/components/ads/AdBox';
import { NepaliDate } from "nepali-date-library";
import { useQuery } from '@tanstack/react-query';
import { getSocialLinks, SocialLinks } from '@/lib/api/settings';

export function TopBar() {
  const { language, toggleLanguage, isNepali, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const bsDate = new NepaliDate();

  const { data: socialLinksResponse } = useQuery({
    queryKey: ['social-links'],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 60,
  });

  const socialLinks = socialLinksResponse?.data;

  const handleLanguageToggle = () => {
    const newLang = isNepali ? 'en' : 'ne';

    // Set cookie for server components - with proper attributes for reliability
    document.cookie = `language=${newLang};path=/;max-age=31536000;SameSite=Lax`;

    // Get current lang param and update it
    const currentLang = searchParams.get('lang');
    const params = new URLSearchParams(searchParams.toString());

    params.set('lang', newLang);

    // Navigate to the same path with the new language parameter
    router.push(`${pathname}?${params.toString()}`);

    // Also toggle the internal language state
    toggleLanguage();
  };

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
              <span className={isNepali ? 'font-nepali' : ''}>
                {isNepali ? (
                  <>
                    <span className="font-medium">{toNepaliDigits(String(bsDate))}</span>
                    <span className="mx-2">|</span>
                    <span>{toNepaliDigits(formatDate(currentDate, 'ne'))}</span>
                  </>
                ) : (
                  formatDate(currentDate, 'en')
                )}
              </span>
            </div>
          </div>

          {/* Social Icons and Language Toggle */}
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-3">
              {socialLinks?.facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors"
                  aria-label="Facebook"
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
                  aria-label="Twitter"
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
                  aria-label="YouTube"
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
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
              aria-label={t('language.toggle') as string}
            >
              <span className={isNepali ? 'font-nepali' : ''}>
                {isNepali ? t('language.english') : t('language.nepali')}
              </span>
            </button>
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

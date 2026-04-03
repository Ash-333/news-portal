'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, Cloud, Sun, CloudRain, Facebook, Twitter, Youtube, Instagram } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { toNepaliDigits, formatDate } from '@/lib/utils';
import { weatherData } from '@/data/sampleData';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';
import { NepaliDate } from "nepali-date-library";

export function TopBar() {
  const { language, toggleLanguage, isNepali, t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const bsDate = new NepaliDate();

  const handleLanguageToggle = () => {
    const newLang = isNepali ? 'en' : 'ne';

    // Get current lang param and update it
    const currentLang = searchParams.get('lang');
    const params = new URLSearchParams(searchParams.toString());

    if (currentLang) {
      params.set('lang', newLang);
    } else {
      params.set('lang', newLang);
    }

    // Navigate to the same path with the new language parameter
    router.push(`${pathname}?${params.toString()}`);

    // Also toggle the internal language state
    toggleLanguage();
  };


  const getWeatherIcon = () => {
    switch (weatherData.condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-4 w-4 text-yellow-500" />;
      case 'rainy':
        return <CloudRain className="h-4 w-4 text-blue-500" />;
      default:
        return <Cloud className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-news-red text-white py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Date and Weather */}
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
            <div className="hidden sm:flex items-center gap-2">
              {getWeatherIcon()}
              <span>{weatherData.temperature}°C</span>
              <span className="text-white/70">{weatherData.location}</span>
            </div>
          </div>

          {/* Social Icons and Language Toggle */}
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
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

      {/* Top Banner Ad Placeholder */}
      <div className="bg-white dark:bg-news-bg-dark py-4 border-b border-news-border dark:border-news-border-dark hidden md:block">
        <div className="container mx-auto px-4 flex justify-center">
          <AdPlaceholder format="leaderboard" />
        </div>
      </div>
    </div>
  );
}

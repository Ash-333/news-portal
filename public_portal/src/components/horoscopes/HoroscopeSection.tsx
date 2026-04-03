'use client';

import { useState, useMemo } from 'react';
import { useHoroscopes } from '@/hooks/useHoroscopes';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flame,
  Moon,
  MountainSnow,
  Cloud,
  Sun,
  Scale,
  Fish,
  Target,
  Bug,
  Mountain,
  Wheat,
  Star,
  LucideIcon,
} from 'lucide-react';

// Mapping of icon names to Lucide icon components
const ICON_MAP: Record<string, LucideIcon> = {
  Droplets,
  Flame,
  Moon,
  MountainSnow,
  Cloud,
  Sun,
  Scale,
  Fish,
  Target,
  Bug,
  Mountain,
  Wheat,
  Star,
};

// Helper function to get icon component by name
function getIconByName(iconName: string | undefined): LucideIcon {
  if (!iconName) return Star;
  return ICON_MAP[iconName] || Star;
}

interface HoroscopeSectionProps {
  className?: string;
}

export function HoroscopeSection({ className }: HoroscopeSectionProps) {
  const { isNepali, t } = useLanguage();
  const [selectedSign, setSelectedSign] = useState('aries');
  const { data: horoscopes, isLoading } = useHoroscopes();

  const selectedHoroscope = horoscopes?.find(h => h.zodiacSign === selectedSign);

  // Get the icon component for the selected horoscope
  const IconComponent = useMemo(
    () => getIconByName(selectedHoroscope?.icon),
    [selectedHoroscope?.icon]
  );

  const handlePrevSign = () => {
    if (!horoscopes || horoscopes.length === 0) return;
    const currentIndex = horoscopes.findIndex(h => h.zodiacSign === selectedSign);
    const prevIndex = currentIndex === 0 ? horoscopes.length - 1 : currentIndex - 1;
    setSelectedSign(horoscopes[prevIndex].zodiacSign);
  };

  const handleNextSign = () => {
    if (!horoscopes || horoscopes.length === 0) return;
    const currentIndex = horoscopes.findIndex(h => h.zodiacSign === selectedSign);
    const nextIndex = currentIndex === horoscopes.length - 1 ? 0 : currentIndex + 1;
    setSelectedSign(horoscopes[nextIndex].zodiacSign);
  };

  if (isLoading) {
    return (
      <div className={cn('bg-white dark:bg-news-card-dark rounded-lg border border-news-border dark:border-news-border-dark p-6 animate-pulse', className)}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={cn('py-8 border-t border-news-border dark:border-news-border-dark w-full overflow-hidden', className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-news-red rounded-full" />
            <h2 className={cn('text-xl md:text-2xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
              {isNepali ? 'दैनिक राशिफल' : 'Daily Horoscope'}
            </h2>
          </div>
        </div>

        {/* Featured Horoscope */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-12 bg-white dark:bg-news-card-dark rounded-xl shadow-sm border border-news-border dark:border-news-border-dark overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Zodiac Icon & Navigation */}
              <div className="bg-gradient-to-br from-news-red to-news-red-dark p-6 md:p-8 flex flex-col items-center justify-center">
                <button
                  onClick={handlePrevSign}
                  className="p-2 rounded-full hover:bg-white/20 mb-4 text-white"
                  aria-label="Previous sign"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <IconComponent className="w-20 h-20 text-white mb-4" />
                
                <button
                  onClick={handleNextSign}
                  className="p-2 rounded-full hover:bg-white/20 mt-4 text-white"
                  aria-label="Next sign"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                  {isNepali ? selectedHoroscope?.titleNe : selectedHoroscope?.titleEn}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {selectedHoroscope?.date && new Date(selectedHoroscope.date).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US')}
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {isNepali ? selectedHoroscope?.contentNe : selectedHoroscope?.contentEn}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All Zodiac Signs Grid */}
        <div className="bg-white dark:bg-news-card-dark rounded-xl shadow-sm border border-news-border dark:border-news-border-dark p-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {horoscopes?.map((horoscope) => {
              const SignIcon = getIconByName(horoscope.icon);
              const isSelected = selectedSign === horoscope.zodiacSign;
              
              return (
                <button
                  key={horoscope.zodiacSign}
                  onClick={() => setSelectedSign(horoscope.zodiacSign)}
                  className={cn(
                    'flex flex-col items-center p-3 rounded-lg transition-all',
                    isSelected
                      ? 'bg-news-red text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  )}
                >
                  <SignIcon className="w-6 h-6 mb-1" />
                  <span className={cn('text-xs font-medium', isNepali ? 'font-nepali' : '')}>
                    {horoscope.zodiacSign.charAt(0).toUpperCase() + horoscope.zodiacSign.slice(1, 3)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

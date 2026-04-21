'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, X, Clock, Flame } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useFlashUpdatesQuery } from '@/hooks/useNewsQueries';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export function FlashNewsSheet() {
  const { isNepali } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { data: flashUpdatesResponse } = useFlashUpdatesQuery({ limit: 20 });
  const flashUpdates = flashUpdatesResponse?.data || [];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed z-40 right-3 top-32 md:top-36 flex items-center gap-2 px-3 py-2.5 bg-news-red text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:bg-news-red-dark transition-all duration-300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
        aria-label={isNepali ? 'ताजा खबर' : 'Flash News'}
      >
        <Flame className="w-5 h-5 fill-current" />
        <span className="text-sm">
          {isNepali ? 'ताजा खबर' : 'Flash'}
        </span>
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full sm:w-[400px] h-full rounded-l-2xl overflow-hidden p-0">
          <div className="flex items-center justify-between p-4 border-b border-news-border">
            <h2 className={cn('text-lg font-bold', isNepali ? 'font-nepali' : '')}>
              {isNepali ? 'ताजा खबर' : 'Flash News'}
            </h2>
            <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-65px)] pb-20 dark:bg-news-bg-dark">
            {flashUpdates.length === 0 ? (
              <p className="p-4 text-center text-gray-500">
                {isNepali ? 'कुनै ताजा खबर छैन' : 'No flash news available'}
              </p>
            ) : (
              <ul className="divide-y divide-news-border">
                {flashUpdates.map((update) => (
                  <li key={update.id}>
                    <Link
                      href={`/flash-updates/${update.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-news-card-dark"
                    >
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-news-red shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h3 className={cn(
                            'font-medium text-gray-900 dark:text-white line-clamp-2',
                            isNepali ? 'font-nepali' : ''
                          )}>
                            {isNepali ? update.titleNe : update.titleEn}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <time>
                              {new Date(update.createdAt).toLocaleString(isNepali ? 'ne-NP' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </time>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
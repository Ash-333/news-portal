'use client';

import { useFlashUpdatesQuery } from '@/hooks/useNewsQueries';
import { useLanguage } from '@/context/LanguageContext';
import { FlashUpdateCard } from '@/components/flash-updates/FlashUpdateCard';
import { AdBox } from '@/components/ads/AdBox';
import { cn } from '@/lib/utils';

export default function FlashUpdatesPage() {
  const { isNepali, t } = useLanguage();
  const { data, isLoading } = useFlashUpdatesQuery();
  const updates = data?.data || [];

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className={cn(
            "text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4",
            isNepali ? "font-nepali" : ""
          )}>
            {isNepali ? '२४ घण्टा ताजा अपडेट' : '24 Hours Flash Updates'}
          </h1>
          <p className={cn(
            "text-lg text-gray-600 dark:text-gray-400",
            isNepali ? "font-nepali" : ""
          )}>
            {isNepali ? 'जल तथा मौसम, घटना र अन्य महत्वपूर्ण जानकारी' : 'Keep up with the latest events and important announcements.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : updates.length > 0 ? (
              <div className="grid gap-6">
                {updates.map((update) => (
                  <div key={update.id} id={update.slug}>
                    <FlashUpdateCard update={update} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-news-card-dark rounded-xl">
                <p className="text-gray-500">{isNepali ? 'कुनै अपडेट फेला परेन' : 'No updates found.'}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <AdBox position="SIDEBAR_TOP" className="h-[250px]" />
            <div className="bg-news-red text-white p-6 rounded-xl shadow-lg shadow-news-red/20">
              <h3 className="font-bold text-lg mb-2">Join our WhatsApp</h3>
              <p className="text-sm opacity-90 mb-4">Get instant updates on your phone.</p>
              <button className="w-full bg-white text-news-red font-bold py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Connect Now
              </button>
            </div>
            <AdBox position="SIDEBAR_BOTTOM" className="h-[250px]" />
          </aside>
        </div>
      </div>
    </main>
  );
}

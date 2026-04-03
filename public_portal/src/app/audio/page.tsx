import { AudioNewsSection } from '@/components/audio/AudioNewsList';
import { AdBox } from '@/components/ads/AdBox';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audio News',
  description: 'Listen to the latest audio news and stories from Nepal and around the world.',
};

export default function AudioPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-10">
          <h1 className={cn(
            "text-4xl font-extrabold text-gray-900 dark:text-white mb-2"
          )}>
            Audio News
          </h1>
          <div className="h-1 w-20 bg-news-red rounded-full mb-4" />
          <p className={cn(
            "text-lg text-gray-600 dark:text-gray-400"
          )}>
            Listen to the latest audio news and stories.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Featured Ad */}
          <AdBox position="HOME_MIDDLE" className="h-32 mb-10 hidden md:block" />

          {/* Audio News Section */}
          <AudioNewsSection limit={20} showHeader={false} />
        </div>
      </div>
    </main>
  );
}
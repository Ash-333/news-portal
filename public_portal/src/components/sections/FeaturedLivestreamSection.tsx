import { getFeaturedLivestream } from '@/lib/api/videos';
import { VideoUpdate } from '@/types';

async function fetchFeaturedLivestream(): Promise<VideoUpdate | null> {
  try {
    const res = await getFeaturedLivestream();
    return res.data || null;
  } catch {
    return null;
  }
}

export async function FeaturedLivestreamSection() {
  const livestream = await fetchFeaturedLivestream();

  if (!livestream) return null;

  return (
    <div className="pb-8 mb-8 border-b border-news-border dark:border-news-border-dark">
      <article className="flex flex-col items-center text-center">

        {/* LIVE Badge */}
        <span className="inline-flex items-center gap-1.5 px-6 py-2 mb-3 bg-red-600 text-white text-md font-bold rounded-lg font-nepali">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          LIVE
        </span>

        {/* Title */}
        <h1 className="font-bold text-news-blue dark:text-blue-400 font-nepali text-2xl sm:text-3xl md:text-4xl lg:text-[2.25rem] leading-[1.3] mb-4">
          {livestream.title}
        </h1>

        {/* Author */}
        {/* {livestream.author?.name && (
          <div className="flex items-center gap-4 text-sm font-medium text-gray-700 dark:text-gray-300 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-news-red dark:text-blue-400 font-bold text-xs select-none">
                {livestream.author.name.substring(0, 2).toUpperCase()}
              </span>
              <span className="font-nepali">{livestream.author.name}</span>
            </div>
          </div>
        )} */}

        {/* Embedded Video */}
        <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-md">
          <iframe
            src={`${livestream.iframeUrl}?autoplay=1&mute=1&rel=0`}
            title={livestream.title || ''}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

      </article>
    </div>
  );
}

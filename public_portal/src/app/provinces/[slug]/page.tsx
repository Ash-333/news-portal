import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { VideoCard } from '@/components/videos/VideoCard';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { getArticles } from '@/lib/api/articles';
import { getVideos } from '@/lib/api/videos';

interface ProvincePageProps {
  params: { slug: string };
}

const provinceNames: Record<string, string> = {
  koshi: 'Koshi',
  madhesh: 'Madhesh',
  bagmati: 'Bagmati',
  gandaki: 'Gandaki',
  lumbini: 'Lumbini',
  karnali: 'Karnali',
  sudurpashchim: 'Sudurpashchim',
};

export const revalidate = 120;

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const provinceName = provinceNames[params.slug.toLowerCase()];
  
  if (!provinceName) {
    return {
      title: 'Province Not Found',
    };
  }

  return {
    title: `${provinceName} Province - HTC Media`,
    description: `Latest news and updates from ${provinceName} Province`,
  };
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const provinceName = provinceNames[params.slug.toLowerCase()];
  
  if (!provinceName) {
    notFound();
  }

  const articlesRes = await getArticles({ category: `${params.slug}-province`, limit: 20 });
  const articles = articlesRes.success ? articlesRes.data : [];
  const videosRes = await getVideos({ limit: 6 });
  const videos = videosRes.success ? videosRes.data : [];

  return (
    <>
      <JsonLd
        data={ItemListJsonLd(
          articles.map((article) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`,
            name: article.title || '',
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'गृह', url: `${process.env.NEXT_PUBLIC_SITE_URL}` },
          { name: 'प्रदेशहरू', url: `${process.env.NEXT_PUBLIC_SITE_URL}/provinces` },
          { name: `${provinceName} Province`, url: `${process.env.NEXT_PUBLIC_SITE_URL}/provinces/${params.slug}` },
        ])}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{provinceName} प्रदेश</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {provinceName} प्रदेशबाट ताजा समाचार र अपडेट
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">समाचार</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, 6).map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            {articles.length > 6 && (
              <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.slice(6).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <p className="text-gray-500 text-center py-12">
            No news available in this province yet.
          </p>
        )}

        {videos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Video Updates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 6).map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

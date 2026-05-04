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

const slugToProvince: Record<string, string> = {
  'koshi': 'PROVINCE_1',
  'madhesh': 'PROVINCE_2',
  'bagmati': 'PROVINCE_3',
  'gandaki': 'PROVINCE_4',
  'lumbini': 'PROVINCE_5',
  'karnali': 'PROVINCE_6',
  'sudurpashchim': 'PROVINCE_7',
};

const provinceData: Record<string, { name: string }> = {
  PROVINCE_1: { name: 'Koshi' },
  PROVINCE_2: { name: 'Madhesh' },
  PROVINCE_3: { name: 'Bagmati' },
  PROVINCE_4: { name: 'Gandaki' },
  PROVINCE_5: { name: 'Lumbini' },
  PROVINCE_6: { name: 'Karnali' },
  PROVINCE_7: { name: 'Sudurpashchim' },
};

export const revalidate = 120;

export async function generateMetadata({ params }: ProvincePageProps): Promise<Metadata> {
  const provinceKey = slugToProvince[params.slug.toLowerCase()];
  const province = provinceData[provinceKey];
  
  if (!province) {
    return {
      title: 'Province Not Found',
    };
  }

  return {
    title: `${province.name} Province - HTC Media`,
    description: `Latest news and updates from ${province.name} Province`,
  };
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const provinceKey = slugToProvince[params.slug.toLowerCase()];
  const province = provinceData[provinceKey];
  
  if (!province) {
    notFound();
  }

  const articlesRes = await getArticles({ province: provinceKey, limit: 20 });
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
          { name: `${province.name} Province`, url: `${process.env.NEXT_PUBLIC_SITE_URL}/provinces/${params.slug}` },
        ])}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{province.name} प्रदेश</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {province.name} प्रदेशबाट ताजा समाचार र अपडेट
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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { VideoCard } from '@/components/videos/VideoCard';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { getArticles } from '@/lib/api/articles';
import { getVideos } from '@/lib/api/videos';
import { getServerLanguage } from '@/lib/utils/language';

interface ProvincePageProps {
  params: { slug: string };
  searchParams?: { lang?: string };
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

const provinceData: Record<string, { name: string; nameNe: string }> = {
  PROVINCE_1: { name: 'Koshi', nameNe: 'कोशी प्रदेश' },
  PROVINCE_2: { name: 'Madhesh', nameNe: 'मधेश प्रदेश' },
  PROVINCE_3: { name: 'Bagmati', nameNe: 'बागमती प्रदेश' },
  PROVINCE_4: { name: 'Gandaki', nameNe: 'गण्डकी प्रदेश' },
  PROVINCE_5: { name: 'Lumbini', nameNe: 'लुम्बिनी प्रदेश' },
  PROVINCE_6: { name: 'Karnali', nameNe: 'कर्णाली प्रदेश' },
  PROVINCE_7: { name: 'Sudurpashchim', nameNe: 'सुदूरपश्चिम प्रदेश' },
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
    title: `${province.nameNe} - HTC Media`,
    description: `Latest news and updates from ${province.name}`,
  };
}

export default async function ProvincePage({ params, searchParams }: ProvincePageProps) {
  const provinceKey = slugToProvince[params.slug.toLowerCase()];
  const province = provinceData[provinceKey];
  
  if (!province) {
    notFound();
  }

  const lang = getServerLanguage();

  const articlesRes = await getArticles({ province: provinceKey, limit: 20 });
  const articles = articlesRes.success ? articlesRes.data : [];
  const videosRes = await getVideos({ limit: 6 });
  const videos = videosRes.success ? videosRes.data : [];

  const pageTitle = lang === 'ne' ? province.nameNe : `${province.name} Province`;
  const pageDesc = lang === 'ne' 
    ? `नेपालको ${province.name} बाट ताजा समाचार र अपडेटहरु`
    : `Latest news and updates from ${province.name} Province`;
  const newsTitle = lang === 'ne' ? 'समाचार' : 'News';
  const noNews = lang === 'ne' ? 'यस प्रदेशमा हालसम्म कुनै समाचार छैन।' : 'No news available in this province yet.';
  const videoTitle = lang === 'ne' ? 'भिडियो अपडेट' : 'Video Updates';

  return (
    <>
      <JsonLd
        data={ItemListJsonLd(
          articles.map((article) => ({
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${article.slug}`,
            name: (lang === 'ne' ? article.titleNe : article.titleEn) || '',
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${process.env.NEXT_PUBLIC_SITE_URL}` },
          { name: 'Provinces', url: `${process.env.NEXT_PUBLIC_SITE_URL}/provinces` },
          { name: province.name, url: `${process.env.NEXT_PUBLIC_SITE_URL}/provinces/${params.slug}` },
        ])}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {pageDesc}
          </p>
        </div>

        {articles.length > 0 ? (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">{newsTitle}</h2>
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
            {noNews}
          </p>
        )}

        {videos.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{videoTitle}</h2>
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
import { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticles } from '@/lib/api/articles';

import { Article } from '@/types';

interface ProvincePageProps {
}

const provinceInfo: Record<string, { slug: string; name: string; image: string }> = {
  PROVINCE_1: { slug: 'koshi', name: 'Koshi', image: '/images/koshi.jpg' },
  PROVINCE_2: { slug: 'madhesh', name: 'Madhesh', image: '/images/madhesh.jpg' },
  PROVINCE_3: { slug: 'bagmati', name: 'Bagmati', image: '/images/bagmati.jpg' },
  PROVINCE_4: { slug: 'gandaki', name: 'Gandaki', image: '/images/gandaki.jpg' },
  PROVINCE_5: { slug: 'lumbini', name: 'Lumbini', image: '/images/lumbini.jpg' },
  PROVINCE_6: { slug: 'karnali', name: 'Karnali', image: '/images/karnali.jpg' },
  PROVINCE_7: { slug: 'sudurpashchim', name: 'Sudurpashchim', image: '/images/sudurpashchim.JPG' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function generateMetadata({}: ProvincePageProps): Promise<Metadata> {
  return {
    title: 'प्रदेशहरू - HTC Media',
    description: 'नेपालका सबै प्रदेशहरूबाट ताजा समाचार',
  };
}

export default async function ProvincesPage() {

  // Fetch articles from all provinces
  let allArticles: Article[] = [];
  try {
    const articlesRes = await getArticles({ limit: 50 });
    if (articlesRes.success) {
      allArticles = articlesRes.data;
    }
  } catch (error) {
    console.error('Failed to fetch articles:', error);
  }

  // Filter articles that have province set
  const provinceArticles = allArticles.filter((article) => article.province);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">प्रदेशहरू</h1>

      {/* Province Badges with Images */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {Object.entries(provinceInfo).map(([key, info]) => (
          <Link
            key={key}
            href={`/provinces/${info.slug}`}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-40 h-24"
          >
            <img
              src={info.image}
              alt={info.name}
              className="w-full h-full object-cover rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="text-lg font-bold text-white">{info.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Province News Grid */}
      {provinceArticles.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-news-red rounded-full" />
            Province News
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {provinceArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          No province news available yet.
        </p>
      )}
    </div>
  );
}
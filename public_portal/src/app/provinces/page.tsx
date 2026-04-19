import { Metadata } from 'next';
import Link from 'next/link';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticles } from '@/lib/api/articles';
import { getServerLanguage } from '@/lib/utils/language';
import { Article } from '@/types';

interface ProvincePageProps {
  searchParams?: { lang?: string };
}

const provinceInfo: Record<string, { slug: string; name: string; nameNe: string; image: string }> = {
  PROVINCE_1: { slug: 'koshi', name: 'Koshi', nameNe: 'कोशी', image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80' },
  PROVINCE_2: { slug: 'madhesh', name: 'Madhesh', nameNe: 'मधेश', image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&q=80' },
  PROVINCE_3: { slug: 'bagmati', name: 'Bagmati', nameNe: 'बागमती', image: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=400&q=80' },
  PROVINCE_4: { slug: 'gandaki', name: 'Gandaki', nameNe: 'गण्डकी', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80' },
  PROVINCE_5: { slug: 'lumbini', name: 'Lumbini', nameNe: 'लुम्बिनी', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80' },
  PROVINCE_6: { slug: 'karnali', name: 'Karnali', nameNe: 'कर्णाली', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  PROVINCE_7: { slug: 'sudurpashchim', name: 'Sudurpashchim', nameNe: 'सुदूरपश्चिम', image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80' },
};

export const dynamic = 'force-dynamic';
export const revalidate = 120;

export async function generateMetadata({}: ProvincePageProps): Promise<Metadata> {
  return {
    title: 'Provinces - HTC Media',
    description: 'Latest news from all provinces of Nepal',
  };
}

export default async function ProvincesPage({ searchParams }: ProvincePageProps) {
  const lang = getServerLanguage();

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

  const pageTitle = lang === 'ne' ? 'प्रदेशहरु' : 'Provinces';
  const newsTitle = lang === 'ne' ? 'प्रदेश समाचार' : 'Province News';
  const noNews = lang === 'ne' ? 'हालसम्म कुनै प्रदेश समाचार छैन।' : 'No province news available yet.';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{pageTitle}</h1>

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
              <h3 className="text-lg font-bold text-white">{lang === 'ne' ? info.nameNe : info.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Province News Grid */}
      {provinceArticles.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-1 h-8 bg-news-red rounded-full" />
            {newsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {provinceArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          {noNews}
        </p>
      )}
    </div>
  );
}
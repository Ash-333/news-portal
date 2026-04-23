import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getServerLanguage } from '@/lib/utils/language';
import { JsonLd } from '@/components/JsonLd';
import { BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ProvincesClient } from './ProvincesClient';

interface ProvincesPageProps {
  searchParams?: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

interface ProvinceData {
  slug: string;
  nameEn: string;
  nameNe: string;
  image: string;
  color: string;
}

const PROVINCES: ProvinceData[] = [
  { 
    slug: 'koshi-province', 
    nameEn: 'Koshi Province', 
    nameNe: 'कोशी प्रदेश',
    image: 'https://images.unsplash.com/photo-1596436894076-a9335bb0ce11?w=400&h=250&fit=crop',
    color: '#1E40AF'
  },
  { 
    slug: 'madhesh-province', 
    nameEn: 'Madhesh Province', 
    nameNe: 'मधेश प्रदेश',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=250&fit=crop',
    color: '#059669'
  },
  { 
    slug: 'bagmati-province', 
    nameEn: 'Bagmati Province', 
    nameNe: 'बागमती प्रदेश',
    image: 'https://images.unsplash.com/photo-1568630348244-29697bc2d9e3?w=400&h=250&fit=crop',
    color: '#DC2626'
  },
  { 
    slug: 'gandaki-province', 
    nameEn: 'Gandaki Province', 
    nameNe: 'गण्डकी प्रदेश',
    image: 'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=400&h=250&fit=crop',
    color: '#7C3AED'
  },
  { 
    slug: 'lumbini-province', 
    nameEn: 'Lumbini Province', 
    nameNe: 'लुम्बिनी प्रदेश',
    image: 'https://images.unsplash.com/photo-1569060716907-60f95c7ede8e?w=400&h=250&fit=crop',
    color: '#EA580C'
  },
  { 
    slug: 'karnali-province', 
    nameEn: 'Karnali Province', 
    nameNe: 'कर्णाली प्रदेश',
    image: 'https://images.unsplash.com/photo-1506905925346-20b42c1e2a3c?w=400&h=250&fit=crop',
    color: '#0891B2'
  },
  { 
    slug: 'sudurpashchim-province', 
    nameEn: 'Sudurpashchim Province', 
    nameNe: 'सुदूरपश्चिम प्रदेश',
    image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&h=250&fit=crop',
    color: '#DB2777'
  },
];

export async function generateMetadata({ searchParams }: ProvincesPageProps): Promise<Metadata> {
  const urlLang = searchParams?.lang;
  const serverLang = getServerLanguage();
  const lang = urlLang === 'en' || urlLang === 'ne' ? urlLang : serverLang;
  const name = lang === 'ne' ? 'प्रदेशहरु' : 'Provinces';

  return {
    title: `${name} - News Portal`,
    description: lang === 'ne' 
      ? 'नेपालका सात प्रदेशहरुको समाचार र अपडेट' 
      : 'News and updates from all seven provinces of Nepal',
    alternates: {
      canonical: `${SITE_URL}/category/provinces`,
      languages: {
        'ne-NP': `${SITE_URL}/category/provinces?lang=ne`,
        'en-US': `${SITE_URL}/category/provinces?lang=en`,
      },
    },
  };
}

export default async function ProvincesPage({ searchParams }: ProvincesPageProps) {
  const urlLang = searchParams?.lang;
  const serverLang = getServerLanguage();
  const isNepali = urlLang === 'ne' || (!urlLang && serverLang === 'ne');
  const pageName = isNepali ? 'प्रदेशहरु' : 'Provinces';

  const [articlesRes, categoriesRes] = await Promise.all([
    getArticles({ category: 'provinces', page: 1, limit: 12 }),
    getCategories(),
  ]);

  const allArticles = articlesRes.success ? articlesRes.data : [];
  const pagination = articlesRes.pagination;

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const provincesCategory = categories.find((c: any) => c.slug === 'provinces');
  const provinceCategories = provincesCategory?.children || [];

  if (provinceCategories.length === 0 || !provincesCategory) {
    notFound();
  }

  const url = `${SITE_URL}/category/provinces`;

  return (
    <>
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: SITE_URL },
          { name: pageName, url },
        ])}
      />

      <div className="py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-news-red">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{pageName}</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {pageName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isNepali 
                ? 'नेपालका सात प्रदेशहरुको समाचार र अपडेट' 
                : 'News and updates from all seven provinces of Nepal'}
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {isNepali ? 'प्रदेशहरु छनोट्नुहोस्' : 'Select a Province'}
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {PROVINCES.map((province) => {
                const provinceName = isNepali ? province.nameNe : province.nameEn;
                return (
                  <Link
                    key={province.slug}
                    href={`/category/${province.slug}`}
                    className="flex-shrink-0 w-36 sm:w-40 group"
                  >
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={province.image}
                        alt={provinceName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white font-semibold text-sm">
                          {provinceName}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isNepali ? 'सबै प्रदेश समाचार' : 'All Provinces News'}
            </h2>
          </div>

          <ProvincesClient
            initialArticles={allArticles}
            initialPagination={pagination}
            isNepali={isNepali}
          />
        </div>
      </div>
    </>
  );
}
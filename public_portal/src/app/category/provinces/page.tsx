import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';

import { JsonLd } from '@/components/JsonLd';
import { BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ProvincesClient } from './ProvincesClient';

export const dynamic = 'force-dynamic';

interface ProvinceData {
  slug: string;
  name: string;
  image: string;
  color: string;
}

const PROVINCES: ProvinceData[] = [
  { 
    slug: 'koshi-province', 
    name: 'कोशी प्रदेश',
    image: '/provinces/koshi.jpg',
    color: '#1E40AF'
  },
  { 
    slug: 'madhesh-province', 
    name: 'मधेश प्रदेश',
    image: '/provinces/madhesh.jpg',
    color: '#059669'
  },
  { 
    slug: 'bagmati-province', 
    name: 'बागमती प्रदेश',
    image: '/provinces/bagmati.jpg',
    color: '#DC2626'
  },
  { 
    slug: 'gandaki-province', 
    name: 'गण्डकी प्रदेश',
    image: '/provinces/gandaki.jpg',
    color: '#7C3AED'
  },
  { 
    slug: 'lumbini-province', 
    name: 'लुम्बिनी प्रदेश',
    image: '/provinces/lumbini.jpg',
    color: '#EA580C'
  },
  { 
    slug: 'karnali-province', 
    name: 'कर्णाली प्रदेश',
    image: '/provinces/karnali.jpg',
    color: '#0891B2'
  },
  { 
    slug: 'sudurpashchim-province', 
    name: 'सुदूरपश्चिम प्रदेश',
    image: '/provinces/sudurpashchim.JPG',
    color: '#DB2777'
  },
];

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'प्रदेशहरू - समाचार पोर्टल',
    description: 'नेपालका सबै सात प्रदेशहरूका समाचार र अपडेट',
  };
}

export default async function ProvincesPage() {
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
          { name: 'गृह', url: SITE_URL },
          { name: 'प्रदेशहरू', url },
        ])}
      />

      <div className="py-8">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-news-red">गृह</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">प्रदेशहरू</span>
          </nav>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              प्रदेशहरू
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              नेपालका सबै सात प्रदेशहरूका समाचार र अपडेट
            </p>
          </div>

          <div className="mb-10">
            {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              सबै प्रदेशहरू
            </h2> */}
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
              {PROVINCES.map((province) => {
                return (
                  <Link
                    key={province.slug}
                    href={`/category/${province.slug}`}
                    className="flex-shrink-0 w-36 sm:w-40 group"
                  >
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={province.image}
                        alt={province.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="200px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="text-white font-semibold text-sm">
                          {province.name}
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
              Province News
            </h2>
          </div>

          <ProvincesClient
            initialArticles={allArticles}
            initialPagination={pagination}
          />
        </div>
      </div>
    </>
  );
}

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { JsonLd } from '@/components/JsonLd';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt, getCategoryName } from '@/lib/utils/lang';
import { getServerLanguage } from '@/lib/utils/language';
import { CategoryClient } from './CategoryClient';

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoriesRes = await getCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const lang = getServerLanguage();
  const name = lang === 'ne' ? (category.nameNe || category.nameEn) : (category.nameEn || category.nameNe);

  return {
    title: `${name} - News Portal`,
    description: `Browse latest ${name} news and articles`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const urlLang = searchParams?.lang;
  const serverLang = getServerLanguage();
  const isNepali = urlLang === 'ne' || (!urlLang && serverLang === 'ne');

  const [categoriesRes, articlesRes] = await Promise.all([
    getCategories(),
    getArticles({ category: params.slug }),
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const category = categories.find((c) => c.slug === params.slug);

  if (!category) {
    notFound();
  }

  const allArticles = articlesRes.success ? articlesRes.data : [];
  const categoryName = isNepali
    ? (category.nameNe || category.nameEn || category.slug)
    : (category.nameEn || category.nameNe || category.slug);

  const url = `${SITE_URL}/category/${category.slug}`;
  const subcategories = category.children || [];

  return (
    <>
      <JsonLd
        data={ItemListJsonLd(
          allArticles.map((a) => ({
            name: getTitle(a, isNepali ? 'ne' : 'en'),
            url: `${SITE_URL}/article/${a.slug}`,
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: categoryName, url },
        ])}
      />

      <CategoryClient
        category={category}
        subcategories={subcategories}
        articles={allArticles}
        isNepali={isNepali}
      />
    </>
  );
}
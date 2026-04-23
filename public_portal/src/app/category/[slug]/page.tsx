import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getTitle } from '@/lib/utils/lang';
import { getServerLanguage } from '@/lib/utils/language';
import { CategoryClient } from './CategoryClient';

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

function findCategoryRecursive(categories: any[], slug: string): any | null {
  for (const cat of categories) {
    if (cat.slug === slug) return cat;
    if (cat.children && cat.children.length > 0) {
      const found = findCategoryRecursive(cat.children, slug);
      if (found) return found;
    }
  }
  return null;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoriesRes = await getCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];
  const category = findCategoryRecursive(categories, params.slug);

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
    getArticles({ category: params.slug, page: 1, limit: 20 }),
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const category = findCategoryRecursive(categories, params.slug);

  if (!category) {
    notFound();
  }

  const allArticles = articlesRes.success ? articlesRes.data : [];
  const pagination = articlesRes.pagination;
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
        initialArticles={allArticles}
        initialPagination={pagination}
        isNepali={isNepali}
      />
    </>
  );
}
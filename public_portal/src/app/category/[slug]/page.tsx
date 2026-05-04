import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/JsonLd';
import { ItemListJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';

import { CategoryClient } from './CategoryClient';

interface CategoryPageProps {
  params: { slug: string };
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

  return {
    title: `${category.name || category.slug} - News Portal`,
    description: `Browse latest ${(category.name || category.slug)} news and articles`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
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
  const subcategories = category.children || [];
  const url = `${SITE_URL}/category/${category.slug}`;

  return (
    <>
      <JsonLd
        data={ItemListJsonLd(
          allArticles.map((a) => ({
            name: a.title || '',
            url: `${SITE_URL}/article/${a.slug}`,
          }))
        )}
      />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: category.name || category.slug, url },
        ])}
      />

      <CategoryClient
        category={category}
        subcategories={subcategories}
        initialArticles={allArticles}
        initialPagination={pagination}
      />
    </>
  );
}

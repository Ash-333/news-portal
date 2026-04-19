'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArticleCard } from '@/components/ArticleCard';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle, getExcerpt } from '@/lib/utils/lang';
import { Category } from '@/types';

interface CategoryClientProps {
  category: Category;
  subcategories: Category[];
  articles: any[];
  isNepali: boolean;
}

function getAllSubcategoryIds(subcategories: Category[]): string[] {
  const ids: string[] = [];
  const getIds = (cats: Category[]) => {
    for (const cat of cats) {
      ids.push(cat.id);
      if (cat.children && cat.children.length > 0) {
        getIds(cat.children);
      }
    }
  };
  getIds(subcategories);
  return ids;
}

export function CategoryClient({ category, subcategories, articles, isNepali }: CategoryClientProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    const allSubcategoryIds = getAllSubcategoryIds(subcategories);
    
    if (selectedSubcategory === 'all') {
      const parentAndSubIds = [category.id, ...allSubcategoryIds];
      return articles.filter((article) => parentAndSubIds.includes(article.category.id));
    }
    
    const selectedSubIds = [selectedSubcategory];
    const subcat = subcategories.find((s) => s.id === selectedSubcategory);
    if (subcat?.children && subcat.children.length > 0) {
      selectedSubIds.push(...getAllSubcategoryIds([subcat]));
    }
    
    return articles.filter((article) => selectedSubIds.includes(article.category.id));
  }, [articles, subcategories, selectedSubcategory, category.id]);

  const featuredArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  const categoryName = isNepali
    ? (category.nameNe || category.nameEn || category.slug)
    : (category.nameEn || category.nameNe || category.slug);

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-news-red">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{categoryName}</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {categoryName}
          </h1>
        </div>

        {subcategories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setSelectedSubcategory('all')}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                  selectedSubcategory === 'all'
                    ? 'bg-news-red text-white border-b-2 border-news-red'
                    : 'text-gray-600 dark:text-gray-400 hover:text-news-red hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                All {categoryName}
              </button>
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                    selectedSubcategory === subcategory.id
                      ? 'bg-news-red text-white border-b-2 border-news-red'
                      : 'text-gray-600 dark:text-gray-400 hover:text-news-red hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {isNepali ? (subcategory.nameNe || subcategory.nameEn) : (subcategory.nameEn || subcategory.nameNe)}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        ) : (
          <>
            {featuredArticle && (
              <div className="mb-8">
                <article className="group">
                  <Link href={`/article/${featuredArticle.slug}`} className="block relative aspect-[21/9] rounded-xl overflow-hidden">
                    <Image
                      src={getArticleImage(featuredArticle)}
                      alt={getTitle(featuredArticle, isNepali ? 'ne' : 'en')}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:underline font-heading">
                        {getTitle(featuredArticle, isNepali ? 'ne' : 'en')}
                      </h2>
                      <p className="text-white/80 line-clamp-2 max-w-2xl">
                        {getExcerpt(featuredArticle, isNepali ? 'ne' : 'en')}
                      </p>
                    </div>
                  </Link>
                </article>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {gridArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  variant="horizontal"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
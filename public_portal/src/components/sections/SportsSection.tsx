'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Article, Category } from '@/types';
import { useLanguage } from '@/context/LanguageContext';
import { ArticleCard } from '@/components/ArticleCard';
import { cn } from '@/lib/utils';
import { useState, useMemo } from 'react';

interface SportsSectionProps {
  articles: Article[];
  subcategories?: Category[];
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

export function SportsSection({ articles, subcategories = [] }: SportsSectionProps) {
  const { isNepali, t } = useLanguage();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    if (subcategories.length === 0) {
      return articles;
    }

    const allSubcategoryIds = getAllSubcategoryIds(subcategories);
    
    if (selectedSubcategory === 'all') {
      return articles;
    }
    
    const selectedSubIds = [selectedSubcategory];
    const subcat = subcategories.find((s) => s.id === selectedSubcategory);
    if (subcat?.children && subcat.children.length > 0) {
      selectedSubIds.push(...getAllSubcategoryIds([subcat]));
    }
    
    return articles.filter((article) => selectedSubIds.includes(article.category.id));
  }, [articles, subcategories, selectedSubcategory]);

  const hasSubcategories = subcategories.length > 0;

  return (
    <section className="py-8 border-t border-news-border dark:border-news-border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-news-red rounded-full" />
            <h2 className={cn('text-xl font-bold text-gray-900 dark:text-white', isNepali ? 'font-nepali' : '')}>
              {t('nav.sports')}
            </h2>
          </div>
          <Link
            href="/category/sports"
            className="flex items-center gap-1 text-sm text-news-red hover:underline"
          >
            <span className={isNepali ? 'font-nepali' : ''}>{t('category.viewAll')}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {hasSubcategories && (
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
                {isNepali ? 'सबै' : 'All'}
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
          <div className="text-center py-8 text-gray-500">
            {isNepali ? 'कुनै समाचार छैन' : 'No articles found'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
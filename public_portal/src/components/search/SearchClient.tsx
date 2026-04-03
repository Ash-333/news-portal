'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getArticleImage } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import { useCategoriesQuery, usePublishedArticlesQuery } from '@/hooks/useNewsQueries';

interface SearchResult {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
  };
  featuredImage?: string;
}

export function SearchClient() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');

  const { data: categories = [] } = useCategoriesQuery();
  const { data: articles = [] } = usePublishedArticlesQuery();

  // Filter and search logic
  const filteredArticles = articles.filter((article) => {
    const matchesQuery = !searchQuery ||
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !selectedCategory || article.category.slug === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  // Sort articles
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default: // relevance
        return 0; // Keep original order for relevance
    }
  });

  const searchResults: SearchResult[] = sortedArticles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title || '',
    excerpt: article.excerpt || '',
    publishedAt: article.publishedAt,
    category: {
      name: article.category.name || '',
      slug: article.category.slug,
    },
    author: {
      name: article.author.name,
      slug: article.author.slug || '',
    },
    featuredImage: getArticleImage(article),
  }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    if (sortBy !== 'relevance') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }

    // Update URL without causing a navigation
    window.history.replaceState({}, '', `?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('relevance');
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('search.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('search.description')}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-news-red focus:border-transparent bg-white dark:bg-news-card-dark text-gray-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-news-red text-white rounded-lg hover:bg-news-red/90 transition-colors font-medium"
            >
              {t('search.button')}
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 dark:bg-news-card-dark rounded-lg">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('search.filters')}:
              </span>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">{t('search.allCategories')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="relevance">{t('search.sortRelevance')}</option>
              <option value="date">{t('search.sortDate')}</option>
              <option value="title">{t('search.sortTitle')}</option>
            </select>

            {/* Clear Filters */}
            {(searchQuery || selectedCategory || sortBy !== 'relevance') && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 px-3 py-1 text-sm text-news-red hover:text-news-red/80 transition-colors"
              >
                <X className="h-4 w-4" />
                {t('search.clearFilters')}
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {searchResults.length === 0 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('search.noResults')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {t('search.tryDifferent')}
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchResults.length} results
                </p>
              </div>

              <div className="space-y-6">
                {searchResults.map((result) => (
                  <article
                    key={result.id}
                    className="flex gap-4 p-4 bg-white dark:bg-news-card-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    {result.featuredImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={result.featuredImage}
                          alt={result.title}
                          width={120}
                          height={80}
                          className="rounded object-cover"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/category/${result.category.slug}`}
                          className="text-xs font-medium text-news-red hover:text-news-red/80"
                        >
                          {result.category.name}
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link
                          href={`/author/${result.author.slug}`}
                          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                          {result.author.name}
                        </Link>
                        <span className="text-gray-400">•</span>
                        <time className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(result.publishedAt).toLocaleDateString()}
                        </time>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        <Link
                          href={`/article/${result.slug}`}
                          className="hover:text-news-red transition-colors"
                        >
                          {result.title}
                        </Link>
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                        {result.excerpt}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
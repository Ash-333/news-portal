'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, X } from 'lucide-react';

import { getArticleImage } from '@/lib/utils/image';
import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/hooks/useNewsQueries';
import { useArticles } from '@/hooks/useArticles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');

  const { data: categories = [] } = useCategoriesQuery();

  const { data: articles = [], isLoading } = useArticles({
    search: debouncedSearch || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sortedArticles = [...articles].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      default:
        return 0;
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
      name: article.author.name || '',
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
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    if (sortBy !== 'relevance') {
      params.set('sort', sortBy);
    } else {
      params.delete('sort');
    }
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Search News
            </h1>

            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="लेखहरू खोज्नुहोस्..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-news-card-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-news-red"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      const params = new URLSearchParams(searchParams.toString());
                      params.delete('q');
                      window.history.pushState(null, '', `?${params.toString()}`);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                {/* Category Filter */}
                <div className="flex-1 min-w-[200px]">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="सबै श्रेणीहरू" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                       <SelectItem value="all">सबै श्रेणीहरू</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.slug}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="flex-1 min-w-[200px]">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                       <SelectValue placeholder="क्रमबद्ध गर्नुहोस्..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="date">Date (Newest)</SelectItem>
                      <SelectItem value="title">Title (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
              </p>
              {searchResults.map((result) => (
                <article key={result.id} className="flex gap-4 group">
                  {result.featuredImage && (
                    <Link href={`/article/${result.slug}`} className="shrink-0">
                      <div className="w-32 h-24 relative rounded-lg overflow-hidden">
                        <Image
                          src={result.featuredImage}
                          alt={result.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="128px"
                        />
                      </div>
                    </Link>
                  )}
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
          ) : searchQuery ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">No results found for "{searchQuery}"</p>
              <p className="text-sm text-gray-400">Try different keywords or remove filters</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Start typing to search for articles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

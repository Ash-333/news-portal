'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { getArticles } from '@/lib/api/articles';
import { getArticleImage } from '@/lib/utils/image';
import { getTitle } from '@/lib/utils/lang';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

interface ProvincesClientProps {
  initialArticles: Article[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isNepali: boolean;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ProvincesClient({ initialArticles, initialPagination, isNepali }: ProvincesClientProps) {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [pagination, setPagination] = useState<PaginationMeta | undefined>(initialPagination);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPagination ? initialPagination.page < initialPagination.totalPages : false);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const currentPageRef = useRef(initialPagination?.page ?? 1);

  const fetchMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    const nextPage = currentPageRef.current + 1;
    
    try {
      const res = await getArticles({ category: 'provinces', page: nextPage, limit: 12 });
      if (res.success && res.data.length > 0) {
        setArticles((prev) => [...prev, ...res.data]);
        currentPageRef.current = nextPage;
        if (res.pagination) {
          setPagination(res.pagination);
          setHasMore(nextPage < res.pagination.totalPages);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more articles:', error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading]);

  useEffect(() => {
    setArticles(initialArticles);
    setPagination(initialPagination);
    currentPageRef.current = initialPagination?.page ?? 1;
    setHasMore(initialPagination ? initialPagination.page < initialPagination.totalPages : false);
  }, [initialArticles, initialPagination]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <article key={article.id} className="group">
            <Link href={`/article/${article.slug}`}>
              <div className="block relative aspect-[16/10] rounded-lg overflow-hidden mb-2">
                <Image
                  src={getArticleImage(article)}
                  alt={getTitle(article, language)}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className={cn(
                'font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-news-red transition-colors',
                isNepali ? 'font-nepali text-sm' : 'text-sm'
              )}>
                {getTitle(article, language)}
              </h3>
            </Link>
          </article>
        ))}
      </div>

      <div ref={loadMoreRef} className="flex justify-center py-8">
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-6 h-6 border-2 border-news-red border-t-transparent rounded-full animate-spin" />
            <span>Loading more articles...</span>
          </div>
        )}
        {!hasMore && articles.length > 0 && (
          <p className="text-gray-500">You've reached the end</p>
        )}
      </div>
    </>
  );
}
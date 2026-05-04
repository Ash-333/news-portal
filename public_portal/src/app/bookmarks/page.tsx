'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBookmarkQuery, useRemoveBookmarkMutation } from '@/hooks/useBookmarks';

import Link from 'next/link';
import Image from 'next/image';
import { Bookmark, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BookmarksPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const { data, isLoading } = useBookmarkQuery();
  const removeBookmark = useRemoveBookmarkMutation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-news-red" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const bookmarks = data?.data || [];

  const handleRemove = async (articleId: string) => {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      await removeBookmark.mutateAsync(articleId);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg-dark py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Bookmark className="h-8 w-8 text-news-red" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Bookmarks
            </h1>
          </div>

          {bookmarks.length === 0 ? (
            <div className="bg-white dark:bg-news-card-dark rounded-xl p-12 text-center">
              <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                You haven't bookmarked any articles yet
              </p>
              <Link 
                href="/"
                className="inline-block px-6 py-2 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors"
              >
                Browse News
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarks.map((bookmark) => (
                <div 
                  key={bookmark.id}
                  className="bg-white dark:bg-news-card-dark rounded-xl p-4 border border-news-border dark:border-news-border-dark flex gap-4"
                >
                  {bookmark.article?.featuredImage && (
                    <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={typeof bookmark.article.featuredImage === 'object' 
                          ? bookmark.article.featuredImage.url 
                          : bookmark.article.featuredImage}
                        alt={bookmark.article?.title || ''}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link href={`/article/${bookmark.article?.slug}`}>
                      <h3 className="font-semibold text-gray-900 dark:text-white hover:text-news-red transition-colors line-clamp-2">
                        {bookmark.article?.title || ''}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {bookmark.article?.category && (
                        <span>{bookmark.article.category.name}</span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(bookmark.articleId)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

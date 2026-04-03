import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-9xl font-bold text-news-red/20">404</div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-news-red text-white rounded-lg hover:bg-news-red-dark transition-colors"
            >
              <Home className="h-5 w-5" />
              Go to Home
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
            >
              <Search className="h-5 w-5" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

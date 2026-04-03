'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Bookmark, Share2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

export function MobileBottomBar() {
  const pathname = usePathname();
  const { isNepali, t } = useLanguage();

  const navItems = [
    { href: '/', icon: Home, label: t('nav.home') },
    { href: '/search', icon: Search, label: t('search.searchButton') },
    { href: '/bookmarks', icon: Bookmark, label: t('user.bookmarks') },
    { href: '#share', icon: Share2, label: t('article.share') },
    { href: '#comments', icon: MessageCircle, label: t('article.comments') },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleComments = () => {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-news-card-dark border-t border-news-border dark:border-news-border-dark z-50 pb-safe">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.href === '#share') {
            return (
              <button
                key={item.href}
                onClick={handleShare}
                className="flex flex-col items-center gap-1 py-3 px-4 text-gray-500 hover:text-news-red transition-colors"
                aria-label={item.label as string}
              >
                <Icon className="h-5 w-5" />
                <span className={cn('text-xs', isNepali ? 'font-nepali' : '')}>
                  {item.label}
                </span>
              </button>
            );
          }

          if (item.href === '#comments') {
            return (
              <button
                key={item.href}
                onClick={handleComments}
                className="flex flex-col items-center gap-1 py-3 px-4 text-gray-500 hover:text-news-red transition-colors"
                aria-label={item.label as string}
              >
                <Icon className="h-5 w-5" />
                <span className={cn('text-xs', isNepali ? 'font-nepali' : '')}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-3 px-4 transition-colors',
                isActive
                  ? 'text-news-red'
                  : 'text-gray-500 hover:text-news-red'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className={cn('text-xs', isNepali ? 'font-nepali' : '')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

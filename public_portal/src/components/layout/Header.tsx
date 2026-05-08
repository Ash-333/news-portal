'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronDown, Sun, Moon, Headphones, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api/categories';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { NavItem, Category } from '@/types';

export function Header() {

  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then((res) => {
      if (res.success && res.data) {
        setCategories(res.data);
      }
    }).catch(() => { });
  }, []);

  const provincesCategory = categories.find(cat => cat.slug === 'provinces');
  const visibleCategories = categories.filter(cat => cat.slug !== 'provinces').slice(0, 8);
  const remainingCategories = categories.filter(cat => cat.slug !== 'provinces').slice(8);

  const navItems: NavItem[] = [
    { label: 'गृह', href: '/' },
    ...(provincesCategory?.children?.length ? [{
      label: 'प्रदेशहरू',
      href: '/category/provinces',
      hasDropdown: true,
      children: provincesCategory.children.map((child: any) => ({
        label: child.name || '',
        href: `/category/${child.slug}`,
      })),
    }] : []),
    { label: 'भिडियो अपडेट', href: '/videos' },
    ...visibleCategories.map((category) => ({
      label: category.name || '',
      href: `/category/${category.slug}`,
    })),
  ];

  const moreNavItem: NavItem = {
    label: 'थप',
    href: '#',
    hasDropdown: true,
    children: remainingCategories.map((category) => ({
      label: category.name || '',
      href: `/category/${category.slug}`,
    })),
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.set('q', searchValue.trim());
    }
    router.push(`/search${params.toString() ? `?${params.toString()}` : ''}`);
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          'bg-white dark:bg-news-bg-dark border-b border-news-border dark:border-news-border-dark transition-all duration-300',
          isScrolled && 'sticky top-0 z-40 shadow-md'
        )}
      >
        <div className="container mx-auto px-4">
          {/* Logo Section */}
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/htcmedia.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-auto w-auto max-h-[48px] sm:hidden"
                priority
              />
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={180}
                height={60}
                className="hidden h-auto w-auto max-h-[60px] sm:block"
                priority
              />
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Audio News */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/audio"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                    aria-label="अडियो समाचार"
                  >
                    <Headphones className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{'अडियो समाचार'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                 aria-label="थिम परिवर्तन"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                 aria-label="खोज"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                 aria-label="मेनु खोल्नुहोस्"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:block border-t border-news-border dark:border-news-border-dark">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-3 text-base font-bold transition-colors',
                      'text-gray-800 dark:text-gray-200 hover:text-news-red dark:hover:text-news-red',
                      'border-b-2 border-transparent hover:border-news-red'
                    )}
                  >
                      <span className={cn('text-lg font-bold')}>
                       {item.label}
                     </span>
                    {item.children && <ChevronDown className="h-4 w-4" />}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {item.children && activeDropdown === item.href && (
                    <div className="absolute top-full left-0 w-64 bg-white dark:bg-news-card-dark shadow-lg rounded-b-lg border border-t-0 border-news-border dark:border-news-border-dark z-50">
                      <ul className="py-2">
                        {item.children.map((child: NavItem) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-news-bg-dark hover:text-news-red"
                            >
                      <span className={'text-lg font-bold'}>
                        {child.label}
                      </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
              <li
                className="relative"
                onMouseEnter={() => moreNavItem.children && setActiveDropdown(moreNavItem.href)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={moreNavItem.href}
                  className="flex items-center gap-1 px-4 py-3 text-base font-bold transition-colors text-gray-800 dark:text-gray-200 hover:text-news-red dark:hover:text-news-red border-b-2 border-transparent hover:border-news-red"
                >
                  <span className={cn('text-lg font-bold')}>
                    {moreNavItem.label}
                  </span>
                  {moreNavItem.children && <ChevronDown className="h-4 w-4" />}
                </Link>

                {moreNavItem.children && activeDropdown === moreNavItem.href && (
                  <div className="absolute top-full left-0 w-64 bg-white dark:bg-news-card-dark shadow-lg rounded-b-lg border border-t-0 border-news-border dark:border-news-border-dark z-50">
                    <ul className="py-2">
                      {moreNavItem.children.map((child: NavItem) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-news-bg-dark hover:text-news-red"
                          >
                              <span className={'text-lg font-bold'}>
                                {child.label}
                              </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-news-bg-dark">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={'text-xl font-bold'}>
                मेनु
              </h2>
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark"
                 aria-label="मेनु बन्द गर्नुहोस्"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    onClick={() => setIsOverlayOpen(false)}
                    className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-news-card-dark rounded-lg"
                  >
                   <span>
                       {'गृह'}
                     </span>
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => setIsOverlayOpen(false)}
                      className="block px-4 py-3 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-news-card-dark rounded-lg"
                    >
                      <span>
                        {category.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-news-card-dark w-full max-w-2xl mx-4 rounded-lg shadow-xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4 p-4 border-b border-news-border dark:border-news-border-dark">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={'खोज्नुहोस्...'}
                className={cn(
                  'flex-1 text-lg outline-none bg-transparent',
                  'text-gray-900 dark:text-gray-100',
                  'placeholder:text-gray-400',
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-bg-dark"
                 aria-label="खोज बन्द गर्नुहोस्"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="p-4">
              <p className={'text-sm text-gray-500'}>
                खोज्न यहाँ टाइप गर्नुहोस्...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

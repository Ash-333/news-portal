'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, ChevronDown, Sun, Moon, Headphones, Menu } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { getCategories } from '@/lib/api/categories';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import type { NavItem, Category } from '@/types';

export function Header() {
  const { isNepali, t } = useLanguage();
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
    { label: 'Home', labelNe: 'होमपेज', href: '/' },
    ...(provincesCategory?.children?.length ? [{
      label: 'Provinces',
      labelNe: 'प्रदेशहरु',
      href: '/category/provinces',
      hasDropdown: true,
      children: provincesCategory.children.map((child: any) => ({
        label: child.nameEn || '',
        labelNe: child.nameNe || '',
        href: `/category/${child.slug}`,
      })),
    }] : []),
    { label: 'Video updates', labelNe: 'भिडियो अपडेट', href: '/videos' },
    ...visibleCategories.map((category) => ({
      label: category.nameEn || category.name || '',
      labelNe: category.nameNe || category.name || '',
      href: `/category/${category.slug}`,
    })),
  ];

  const moreNavItem: NavItem = {
    label: 'More',
    labelNe: 'अन्य',
    href: '#',
    hasDropdown: true,
    children: remainingCategories.map((category) => ({
      label: category.nameEn || category.name || '',
      labelNe: category.nameNe || category.name || '',
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
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/htcmedia.png"
                alt="HTC Media"
                width={48}
                height={48}
                className="rounded-lg"
                priority
              />
              <div className={cn('hidden sm:block', isNepali ? 'font-nepali' : '')}>
                <h1 className="text-2xl font-bold text-news-red dark:text-white">
                  {t('site.name')}
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('site.tagline')}
                </p>
              </div>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Audio News */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/audio"
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                    aria-label="Audio news"
                  >
                    <Headphones className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isNepali ? 'अडियो समाचार' : 'Audio news'}</p>
                </TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                aria-label="Toggle theme"
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
                aria-label="Search"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOverlayOpen(true)}
                className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark transition-colors"
                aria-label="Open menu"
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
                    <span className={cn(isNepali ? 'font-nepali text-lg font-bold' : '')}>
                      {isNepali ? item.labelNe : item.label}
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
                              <span className={isNepali ? 'font-nepali text-lg font-bold' : ''}>
                                {isNepali ? child.labelNe : child.label}
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
                  <span className={cn(isNepali ? 'font-nepali text-lg font-bold' : '')}>
                    {isNepali ? moreNavItem.labelNe : moreNavItem.label}
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
                            <span className={isNepali ? 'font-nepali text-lg font-bold' : ''}>
                              {isNepali ? child.labelNe : child.label}
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
              <h2 className={cn('text-xl font-bold', isNepali ? 'font-nepali' : '')}>
                {t('nav.menu')}
              </h2>
              <button
                onClick={() => setIsOverlayOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-card-dark"
                aria-label="Close menu"
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
                    <span className={isNepali ? 'font-nepali' : ''}>
                      {isNepali ? 'होमपेज' : 'Home'}
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
                      <span className={isNepali ? 'font-nepali' : ''}>
                        {isNepali ? (category.nameNe || category.nameEn) : (category.nameEn || category.nameNe)}
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
                placeholder={t('search.placeholder') as string}
                className={cn(
                  'flex-1 text-lg outline-none bg-transparent',
                  'text-gray-900 dark:text-gray-100',
                  'placeholder:text-gray-400',
                  isNepali ? 'font-nepali' : ''
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-news-bg-dark"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </form>
            <div className="p-4">
              <p className={cn('text-sm text-gray-500', isNepali ? 'font-nepali' : '')}>
                {t('search.results')}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/hooks/useNewsQueries';
import { getSocialLinks } from '@/lib/api/settings';
import { useQuery } from '@tanstack/react-query';

export function Footer() {
  const { isNepali, t } = useLanguage();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: socialLinksResponse } = useQuery({
    queryKey: ['social-links'],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 60,
  });
  const socialLinks = socialLinksResponse?.data;

  const quickLinks = [
    { label: 'About Us', labelNe: 'हाम्रोबारे', href: '/about' },
    { label: 'Contact', labelNe: 'सम्पर्क', href: '/contact' },
    { label: 'Privacy Policy', labelNe: 'गोपनीयता नीति', href: '/privacy' },
    { label: 'Terms of Use', labelNe: 'प्रयोगका सर्तहरू', href: '/terms' },
  ];

  const facebookUrl = socialLinks?.facebookUrl || 'https://facebook.com';
  const twitterUrl = socialLinks?.twitterUrl || 'https://twitter.com';
  const youtubeUrl = socialLinks?.youtubeUrl || 'https://youtube.com';
  const instagramUrl = socialLinks?.instagramUrl || 'https://instagram.com';

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <h3 className={cn('text-white text-lg font-bold mb-4', isNepali ? 'font-nepali' : '')}>
              {t('footer.about')}
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/htcmedia.png"
                alt="HTC Media"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className={cn('text-white font-bold text-lg', isNepali ? 'font-nepali' : '')}>
                {t('site.name')}
              </span>
            </div>
            <p className={cn('text-sm text-gray-400 mb-4', isNepali ? 'font-nepali leading-relaxed' : '')}>
              {t('site.description')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks?.facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-news-red transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.twitterUrl && (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-news-red transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-news-red transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-news-red transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className={cn('text-white text-lg font-bold mb-4', isNepali ? 'font-nepali' : '')}>
              {t('footer.categories')}
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className={cn(
                      'text-sm text-gray-400 hover:text-white transition-colors',
                      isNepali ? 'font-nepali' : ''
                    )}
                  >
                    {isNepali ? category.nameNe : category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className={cn('text-white text-lg font-bold mb-4', isNepali ? 'font-nepali' : '')}>
              {t('footer.quickLinks')}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'text-sm text-gray-400 hover:text-white transition-colors',
                      isNepali ? 'font-nepali' : ''
                    )}
                  >
                    {isNepali ? link.labelNe : link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h3 className={cn('text-white text-lg font-bold mb-4', isNepali ? 'font-nepali' : '')}>
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-news-red shrink-0 mt-0.5" />
                <span className={cn('text-sm text-gray-400', isNepali ? 'font-nepali' : '')}>
                  Kathmandu, Nepal
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-news-red shrink-0" />
                <span className="text-sm text-gray-400">+977 1 4XXXXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-news-red shrink-0" />
                <span className="text-sm text-gray-400">info@yoursite.com</span>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className={cn('text-white text-sm font-bold mb-2', isNepali ? 'font-nepali' : '')}>
                {t('footer.newsletter')}
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder') as string}
                  className={cn(
                    'flex-1 px-3 py-2 bg-gray-800 rounded-lg text-sm',
                    'text-white placeholder:text-gray-500',
                    'focus:outline-none focus:ring-2 focus:ring-news-red',
                    isNepali ? 'font-nepali' : ''
                  )}
                />
                <button className="px-4 py-2 bg-news-red text-white text-sm font-medium rounded-lg hover:bg-news-red-dark transition-colors">
                  {t('footer.subscribe')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={cn('text-sm text-gray-500', isNepali ? 'font-nepali' : '')}>
              © {new Date().getFullYear()} {t('site.name')}. {t('footer.rights')}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className={cn('text-sm text-gray-500 hover:text-white transition-colors', isNepali ? 'font-nepali' : '')}
              >
                {t('footer.privacy')}
              </Link>
              <Link
                href="/terms"
                className={cn('text-sm text-gray-500 hover:text-white transition-colors', isNepali ? 'font-nepali' : '')}
              >
                {t('footer.terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

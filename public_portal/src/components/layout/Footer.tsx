'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useCategoriesQuery } from '@/hooks/useNewsQueries';
import { getSocialLinks, getContactInfo } from '@/lib/api/settings';
import { useQuery } from '@tanstack/react-query';

export function Footer() {

  const { data: categories = [] } = useCategoriesQuery();
  const { data: socialLinksResponse } = useQuery({
    queryKey: ['social-links'],
    queryFn: getSocialLinks,
    staleTime: 1000 * 60 * 60,
  });
  const socialLinks = socialLinksResponse?.data;

  const { data: contactResponse } = useQuery({
    queryKey: ['contact-info'],
    queryFn: getContactInfo,
    staleTime: 1000 * 60 * 60,
  });
  const contactInfo = contactResponse?.data;

  const quickLinks = [
    { label: 'हाम्रो बारेमा', href: '/about' },
    { label: 'हाम्रो टोली', href: '/our-team' },
    { label: 'फोटो ग्यालरी', href: '/photos' },
    { label: 'सम्पर्क', href: '/contact' },
    { label: 'गोपनीयता नीति', href: '/privacy' },
    { label: 'प्रयोगका शर्तहरू', href: '/terms' },
  ];

  const facebookUrl = socialLinks?.facebookUrl || 'https://facebook.com';
  const twitterUrl = socialLinks?.twitterUrl || 'https://twitter.com';
  const youtubeUrl = socialLinks?.youtubeUrl || 'https://youtube.com';
  const instagramUrl = socialLinks?.instagramUrl || 'https://instagram.com';

  return (
    <footer className="bg-gray-900 text-gray-300 border-t-4 border-news-red">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Column */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/htcmedia.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-auto w-auto max-h-[48px] sm:hidden"
              />
              <Image
                src="/images/logo.png"
                alt="Logo"
                width={180}
                height={60}
                className="hidden h-auto w-auto max-h-[60px] sm:block"
              />
            </div>
            <p className='text-sm text-gray-400 mb-4'>
              सञ्चार क्षेत्रमा नयाँ आयाम।
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks?.facebookUrl && (
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-news-red transition-colors"
                  aria-label="फेसबुक"
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
                  aria-label="ट्विटर"
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
                  aria-label="युट्युब"
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
                  aria-label="इन्स्टाग्राम"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className='text-news-red text-lg font-bold mb-4'>
              श्रेणीहरू
            </h3>
            <ul className="space-y-2">
              {categories.slice(0, 8).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className='text-sm text-gray-400 hover:text-news-red transition-colors'
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className='text-news-red text-lg font-bold mb-4'>
              द्रुत लिङ्कहरू
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className='text-sm text-gray-400 hover:text-news-red transition-colors'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter Column */}
          <div>
            <h3 className='text-news-red text-lg font-bold mb-4'>
              सम्पर्क
            </h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-news-red shrink-0 mt-0.5" />
                <span className='text-sm text-gray-400'>
                  {contactInfo?.contactAddress || 'काठमाडौं, नेपाल'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-news-red shrink-0" />
                <a href={`tel:${contactInfo?.contactPhone || '+977-1-4XXXXXX'}`} className="text-sm text-gray-400 hover:text-news-red transition-colors">
                  {contactInfo?.contactPhone || '+977 1 4XXXXXX'}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-news-red shrink-0" />
                <a href={`mailto:${contactInfo?.contactEmail || 'info@yoursite.com'}`} className="text-sm text-gray-400 hover:text-news-red transition-colors">
                  {contactInfo?.contactEmail || 'info@yoursite.com'}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className='text-news-red text-sm font-bold mb-2'>
                न्युजलेटर
              </h4>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="तपाईंको इमेल"
                  className='flex-1 px-3 py-2 bg-gray-800 rounded-lg text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-news-red'
                />
                <button className="px-4 py-2 bg-news-red text-white text-sm font-medium rounded-lg hover:bg-news-red-dark transition-colors">
                  सदस्यता लिनुहोस्
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
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} HTC Media. सर्वाधिकार सुरक्षित।
            </p>
            <p className="text-sm text-gray-400">
              Designed and developed by{' '}
              <a
                href="https://maurisys.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-news-red hover:underline transition-colors"
              >
                Maurisys
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

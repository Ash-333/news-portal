'use client';

import { useState } from 'react';
import { Facebook, Twitter, Link2, Printer, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getShareUrls, copyToClipboard, cn } from '@/lib/utils';

interface ShareBarProps {
  url?: string;
  title?: string;
}

export function ShareBar({ url = '', title = '' }: ShareBarProps) {
  const { isNepali, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareUrls = getShareUrls(url, title);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const shareButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: shareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      href: shareUrls.twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      name: 'WhatsApp',
      icon: () => (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      ),
      href: shareUrls.whatsapp,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      name: 'Viber',
      icon: () => (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.032 0C5.752 0 .647 4.958.647 11.074c0 2.965 1.19 5.68 3.172 7.772l-.91 3.333 3.764-1.51c1.166.503 2.45.785 3.802.813-.13-.433-.197-.887-.197-1.354 0-3.744 3.393-6.779 7.58-6.779.446 0 .883.036 1.31.103C18.85 6.13 14.88 0 12.032 0zm-2.98 5.5c.39 0 .706.316.706.706v3.117c0 .39-.316.706-.706.706-.39 0-.706-.316-.706-.706V6.206c0-.39.316-.706.706-.706zm5.96 0c.39 0 .706.316.706.706v3.117c0 .39-.316.706-.706.706-.39 0-.706-.316-.706-.706V6.206c0-.39.316-.706.706-.706zm-2.98 1.47c.39 0 .706.316.706.706v3.117c0 .39-.316.706-.706.706-.39 0-.706-.316-.706-.706V7.676c0-.39.316-.706.706-.706z" />
        </svg>
      ),
      href: shareUrls.viber,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className={cn('text-sm text-gray-500 mr-2', isNepali ? 'font-nepali' : '')}>
        {t('article.share')}:
      </span>

      {shareButtons.map((button) => (
        <a
          key={button.name}
          href={button.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-white text-sm transition-colors',
            button.color
          )}
          aria-label={`Share on ${button.name}`}
        >
          <button.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{button.name}</span>
        </a>
      ))}

      <button
        onClick={handleCopyLink}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
          copied
            ? 'bg-green-600 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        )}
        aria-label="Copy link"
      >
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {copied ? 'Copied!' : t('article.copyLink')}
        </span>
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        aria-label="Print"
      >
        <Printer className="h-4 w-4" />
        <span className="hidden sm:inline">{t('article.print')}</span>
      </button>
    </div>
  );
}

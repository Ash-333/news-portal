import { Article, JsonLdData } from '@/types';
import { getArticleImage } from '@/lib/utils/image';
import { getCategoryName, getTitle } from '@/lib/utils/lang';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';
const siteName = 'HTC Media';

// WebSite JSON-LD
export function WebSiteJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// NewsArticle JSON-LD
export function NewsArticleJsonLd(article: Article & { url: string }): JsonLdData {
  const title = getTitle(article, 'ne');
  const description = article.excerptNe;
  const image = getArticleImage(article);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
    },
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
    articleSection: getCategoryName(article.category, 'ne'),
    keywords: article.tags.map((tag) => tag.nameNe).join(', '),
    inLanguage: 'ne-NP',
  };
}

// BreadcrumbList JSON-LD
export function BreadcrumbListJsonLd(
  items: { name: string; url: string }[]
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// NewsMediaOrganization JSON-LD
export function NewsMediaOrganizationJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: siteName,
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/images/logo.png`,
      width: 600,
      height: 60,
    },
    sameAs: [
      'https://facebook.com/nepalinews',
      'https://twitter.com/nepalinews',
      'https://youtube.com/nepalinews',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Kathmandu',
      addressCountry: 'NP',
    },
  };
}

// Person (Author) JSON-LD
export function PersonJsonLd(author: {
  id: string;
  name: string;
  bio?: string | null;
  profilePhoto?: string | null;
  slug?: string;
}): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: author.profilePhoto || undefined,
    url: author.slug ? `${siteUrl}/author/${author.slug}` : undefined,
    jobTitle: 'Journalist',
    worksFor: {
      '@type': 'NewsMediaOrganization',
      name: siteName,
    },
  };
}

// ItemList (Category/Tag pages) JSON-LD
export function ItemListJsonLd(
  items: { name: string; url: string }[],
  listType: 'ItemList' | 'CollectionPage' = 'ItemList'
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': listType,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

// SearchResultsPage JSON-LD
export function SearchResultsPageJsonLd(
  query: string,
  resultsCount: number
): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Search results for "${query}"`,
    url: `${siteUrl}/search?q=${encodeURIComponent(query)}`,
    about: {
      '@type': 'Thing',
      name: query,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: resultsCount,
    },
  };
}

// ContactPage JSON-LD
export function ContactPageJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us',
    url: `${siteUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteName,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+977-1-4XXXXXX',
        contactType: 'customer service',
        availableLanguage: ['English', 'Nepali'],
      },
    },
  };
}

// AboutPage JSON-LD
export function AboutPageJsonLd(): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Us',
    url: `${siteUrl}/about`,
    mainEntity: {
      '@type': 'NewsMediaOrganization',
      name: siteName,
      description: 'Your trusted source for news from Nepal and around the world.',
    },
  };
}

// VideoObject JSON-LD
export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  duration,
  contentUrl,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl: string;
}): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description,
    thumbnailUrl,
    uploadDate,
    duration,
    contentUrl,
    publisher: {
      '@type': 'NewsMediaOrganization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/logo.png`,
      },
    },
  };
}

// ImageObject JSON-LD
export function ImageObjectJsonLd({
  url,
  caption,
  width,
  height,
}: {
  url: string;
  caption?: string;
  width?: number;
  height?: number;
}): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: url,
    url,
    caption,
    width,
    height,
  };
}

// Combine multiple JSON-LD objects
export function combineJsonLd(...items: JsonLdData[]): JsonLdData[] {
  return items;
}

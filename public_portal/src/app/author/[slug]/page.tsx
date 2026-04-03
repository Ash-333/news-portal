import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Twitter, Facebook, Linkedin, Mail, FileText } from 'lucide-react';
import { JsonLd } from '@/components/JsonLd';
import { PersonJsonLd, BreadcrumbListJsonLd } from '@/lib/jsonLd';
import { ArticleCard } from '@/components/ArticleCard';
import { deriveAuthorsFromArticles, fetchPublishedArticles } from '@/lib/api';

interface AuthorPageProps {
  params: { slug: string };
  searchParams: { lang?: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const authors = deriveAuthorsFromArticles(await fetchPublishedArticles({ revalidate: 300 }));
    return authors.map((author) => ({
      slug: author.slug,
    }));
  } catch (error) {
    // During build, API might not be available, return empty array
    return [];
  }
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const authors = deriveAuthorsFromArticles(await fetchPublishedArticles({ revalidate: 300 }));
  const author = authors.find((a) => a.slug === params.slug);

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: author.name,
    description: author.bio,
    alternates: {
      canonical: `/author/${author.slug}`,
    },
    openGraph: {
      type: 'profile',
      title: `${author.name} - HTC Media`,
      description: author.bio,
      images: author.avatar ? [author.avatar] : undefined,
    },
  };
}

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const allArticles = await fetchPublishedArticles({ revalidate: 300 });
  const authors = deriveAuthorsFromArticles(allArticles);
  const author = authors.find((a) => a.slug === params.slug);

  if (!author) {
    notFound();
  }

  // Determine language from URL parameter
  const requestedLang = searchParams?.lang;
  const isNepali = requestedLang === 'ne' || (!requestedLang && !!author.nameNe);

  const articles = allArticles.filter((article) => article.author.slug === params.slug);
  const url = `${SITE_URL}/author/${author.slug}`;

  const authorName = isNepali ? (author.nameNe || author.name) : (author.name || author.nameNe);
  const authorBio = isNepali ? (author.bioNe || author.bio) : (author.bio || author.bioNe);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={PersonJsonLd(author)} />
      <JsonLd
        data={BreadcrumbListJsonLd([
          { name: 'Home', url: `${SITE_URL}/` },
          { name: author.name, url },
        ])}
      />

      <div className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-news-red">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white font-medium">{authorName}</span>
          </nav>

          {/* Author Profile */}
          <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0">
                <Image
                  src={author.avatar || '/images/default-avatar.png'}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {authorName}
                </h1>
                {authorBio && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                    {authorBio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-news-red" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {author.articleCount} articles
                    </span>
                  </div>
                </div>

                {/* Social Links */}
                {author.socialLinks && (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    {author.socialLinks.twitter && (
                      <a
                        href={author.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-news-red hover:text-white transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks.facebook && (
                      <a
                        href={author.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-news-red hover:text-white transition-colors"
                        aria-label="Facebook"
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                    )}
                    {author.socialLinks.linkedin && (
                      <a
                        href={author.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-news-red hover:text-white transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {author.email && (
                      <a
                        href={`mailto:${author.email}`}
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-news-red hover:text-white transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Articles */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Articles by {authorName}
            </h2>

            {articles.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">No articles found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


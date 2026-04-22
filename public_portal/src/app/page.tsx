import Link from 'next/link';
import { Metadata } from 'next';
import { ArticleCard } from '@/components/ArticleCard';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { CategorySection } from '@/components/sections/CategorySection';
import { LatestNewsSection } from '@/components/sections/LatestNewsSection';

import { SportsSection } from '@/components/sections/SportsSection';
import { FullWidthArticlesSection } from '@/components/sections/FullWidthArticlesSection';
import { AdBox } from '@/components/ads/AdBox';
import { FlashUpdateSidebar } from '@/components/FlashUpdateSidebar';
import { AdPlaceholder } from '@/components/ui/AdPlaceholder';
import { JsonLd } from '@/components/JsonLd';
import { NewsArticleJsonLd, WebSiteJsonLd } from '@/lib/jsonLd';
import { getFeaturedArticles, getLatestArticles, getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getPolls } from '@/lib/api/polls';
import { HoroscopeSection } from '@/components/horoscopes/HoroscopeSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { PhotoGallerySection } from '@/components/sections/PhotoGallerySection';
import { WorldDiasporaSection } from '@/components/sections/WorldDiasporaSection';
import { StoryOpinionSection } from '@/components/sections/StoryOpinionSection';
import { Article, Poll, Category } from '@/types';
import { getServerLanguage } from '@/lib/utils/language';

export const revalidate = 60;

export async function generateMetadata({ searchParams }: { searchParams?: { lang?: string } }): Promise<Metadata> {
  const urlLang = searchParams?.lang as string | undefined;
  const serverLang = getServerLanguage();
  const isNepali = urlLang === 'ne' || (!urlLang && serverLang === 'ne');

  return {
    title: isNepali ? 'होम - HTC मिडिया' : 'Home - HTC Media',
    description: isNepali
      ? 'नेपाल र विश्वबाट ताजा समाचार, ब्रेकिङ न्यूज र गहन विश्लेषण।'
      : 'Latest news, breaking news, and in-depth analysis from Nepal and around the world.',
    openGraph: {
      type: 'website',
      title: isNepali ? 'HTC मिडिया - तपाईंको विश्वसनीय समाचार स्रोत' : 'HTC Media - Your Trusted Source for News',
      description: isNepali
        ? 'नेपाल र विश्वबाट ताजा समाचार र अपडेटहरू।'
        : 'Latest news and updates from Nepal and around the world.',
    },
  };
}

const PROVINCES = [
  { key: 'PROVINCE_1', name: 'Province 1', nameNe: 'प्रदेश १', altName: 'कोशी' },
  { key: 'PROVINCE_2', name: 'Province 2', nameNe: 'प्रदेश २', altName: 'मधेश' },
  { key: 'PROVINCE_3', name: 'Province 3', nameNe: 'प्रदेश ३', altName: 'बागमती' },
  { key: 'PROVINCE_4', name: 'Province 4', nameNe: 'प्रदेश ४', altName: 'गण्डकी' },
  { key: 'PROVINCE_5', name: 'Province 5', nameNe: 'प्रदेश ५', altName: 'लुम्बिनी' },
  { key: 'PROVINCE_6', name: 'Province 6', nameNe: 'प्रदेश ६', altName: 'कर्णाली' },
  { key: 'PROVINCE_7', name: 'Province 7', nameNe: 'प्रदेश ७', altName: 'सुदूरपश्चिम' },
];

export default async function HomePage({ searchParams }: { searchParams?: { lang?: string } }) {
  const urlLang = searchParams?.lang as string | undefined;
  const serverLang = getServerLanguage();
  const isNepali = urlLang === 'ne' || (!urlLang && serverLang === 'ne');
  const [
    featuredResult,
    latestResult,
    categoriesResult,
    newsResult,
    politicsResult,
    economyResult,
    storyResult,
    opinionResult,
    entertainmentResult,
    technologyResult,
    sportsResult,
    worldResult,
    diasporaResult,
    pollsResult,
    province1Result,
    province2Result,
    province3Result,
    province4Result,
    province5Result,
    province6Result,
    province7Result,
    societyResult,
    healthResult,
    lifestyleResult,
    cultureResult,
  ] = await Promise.allSettled([
    getFeaturedArticles(),
    getLatestArticles(60),
    getCategories(),
    getArticles({ category: 'news', limit: 6 }),
    getArticles({ category: 'politics', limit: 7 }),
    getArticles({ category: 'economy', limit: 6 }),
    getArticles({ category: 'story', limit: 5 }),
    getArticles({ category: 'opinion', limit: 5 }),
    getArticles({ category: 'entertainment', limit: 7 }),
    getArticles({ category: 'technology', limit: 6 }),
    getArticles({ category: 'sports', limit: 6 }),
    getArticles({ category: 'world', limit: 6 }),
    getArticles({ category: 'diaspora', limit: 8 }),
    getPolls(),
    getArticles({ province: 'PROVINCE_1', limit: 5 }),
    getArticles({ province: 'PROVINCE_2', limit: 5 }),
    getArticles({ province: 'PROVINCE_3', limit: 5 }),
    getArticles({ province: 'PROVINCE_4', limit: 5 }),
    getArticles({ province: 'PROVINCE_5', limit: 5 }),
    getArticles({ province: 'PROVINCE_6', limit: 5 }),
    getArticles({ province: 'PROVINCE_7', limit: 5 }),
    getArticles({ category: 'society', limit: 6 }),
    getArticles({ category: 'swasthya', limit: 4 }),
    getArticles({ category: 'jeevan-shaili', limit: 4 }),
    getArticles({ category: 'dharma-sanskriti', limit: 4 }),
  ]);

  const featuredArticles =
    featuredResult.status === 'fulfilled' && featuredResult.value.success
      ? featuredResult.value.data
      : [];

  const articles =
    latestResult.status === 'fulfilled' && latestResult.value.success
      ? latestResult.value.data
      : [];

  const categories: Category[] =
    categoriesResult.status === 'fulfilled' && categoriesResult.value.success
      ? categoriesResult.value.data
      : [];

  const sortedByNewest = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  let fullWidthArticles = featuredArticles.length > 0
    ? featuredArticles
    : sortedByNewest.slice(0, 5);
  const latestArticles = sortedByNewest.slice(5, 14);
  const trendingArticles = [...articles].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 8);

  const getArticlesFromResult = (result: PromiseSettledResult<any>) =>
    result.status === 'fulfilled' && result.value.success ? result.value.data : [];

  const newsArticles = getArticlesFromResult(newsResult);
  const politicsArticles = getArticlesFromResult(politicsResult);
  const economyArticles = getArticlesFromResult(economyResult);
  const storyArticles = getArticlesFromResult(storyResult);
  const opinionArticles = getArticlesFromResult(opinionResult);
  const entertainmentArticles = getArticlesFromResult(entertainmentResult);
  const technologyArticles = getArticlesFromResult(technologyResult);
  const sportsArticles = getArticlesFromResult(sportsResult);
  const worldArticles = getArticlesFromResult(worldResult);
  const diasporaArticles = getArticlesFromResult(diasporaResult);
  const societyArticles = getArticlesFromResult(societyResult);
  const healthArticles = getArticlesFromResult(healthResult);
  const lifestyleArticles = getArticlesFromResult(lifestyleResult);
  const cultureArticles = getArticlesFromResult(cultureResult);

  let activePoll = null;
  const pollsData = pollsResult.status === 'fulfilled' && pollsResult.value.success ? pollsResult.value.data : [];
  if (pollsData.length > 0) {
    activePoll = pollsData.find((p: Poll) => !p.expiresAt || new Date(p.expiresAt) > new Date()) || pollsData[0];
  }

  const newsCategory = categories.find((c) => c.slug === 'news');
  const politicsCategory = categories.find((c) => c.slug === 'politics');
  const economyCategory = categories.find((c) => c.slug === 'economy');
  const storyCategory = categories.find((c) => c.slug === 'story');
  const opinionCategory = categories.find((c) => c.slug === 'opinion');
  const entertainmentCategory = categories.find((c) => c.slug === 'entertainment');
  const technologyCategory = categories.find((c) => c.slug === 'technology');
  const worldCategory = categories.find((c) => c.slug === 'world');
  const diasporaCategory = categories.find((c) => c.slug === 'diaspora');
  const sportsCategory = categories.find((c) => c.slug === 'sports');
  const sportsSubcategories = sportsCategory?.children || [];
  const societyCategory = categories.find((c) => c.slug === 'society');
  const healthCategory = categories.find((c) => c.slug === 'swasthya');
  const lifestyleCategory = categories.find((c) => c.slug === 'jeevan-shaili');
  const cultureCategory = categories.find((c) => c.slug === 'dharma-sanskriti');

  const getProvinceArticles = (result: PromiseSettledResult<any>) =>
    result.status === 'fulfilled' && result.value.success ? result.value.data : [];

  const province1Articles = getProvinceArticles(province1Result);
  const province2Articles = getProvinceArticles(province2Result);
  const province3Articles = getProvinceArticles(province3Result);
  const province4Articles = getProvinceArticles(province4Result);
  const province5Articles = getProvinceArticles(province5Result);
  const province6Articles = getProvinceArticles(province6Result);
  const province7Articles = getProvinceArticles(province7Result);

  const hasProvinceNews = [province1Articles, province2Articles, province3Articles, province4Articles, province5Articles, province6Articles, province7Articles].some(arr => arr.length > 0);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

  const primaryArticleForSchema: Article | undefined =
    featuredArticles[0] ?? articles[0];

  return (
    <>
      <JsonLd data={WebSiteJsonLd()} />
      {primaryArticleForSchema && (
        <JsonLd
          data={NewsArticleJsonLd({
            ...primaryArticleForSchema,
            url: `${siteUrl}/${primaryArticleForSchema.category.slug}/${primaryArticleForSchema.slug}`,
          })}
        />
      )}

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <FullWidthArticlesSection articles={fullWidthArticles} />
          <div className="mt-8 flex justify-center">
            <AdBox position="HOME_TOP" className="h-[90px] w-full max-w-[728px]" />
          </div>
        </div>

        <section className="border-t border-news-border dark:border-news-border-dark py-6">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-8">
              <LatestNewsSection articles={newsArticles} poll={activePoll} category={newsCategory} />
            </div>

            <aside className="lg:col-span-4 space-y-6">
              {trendingArticles.length > 0 && (
                (() => {
                  const { PopularArticles } = require('@/components/article/PopularArticles');
                  return <PopularArticles articles={trendingArticles} />;
                })()
              )}

              <div className="space-y-6">
                <div className="my-6">
                  <AdBox position="SIDEBAR_TOP" className="h-[250px]" />
                </div>
                <FlashUpdateSidebar />
              </div>
            </aside>
          </div>
        </section>

        <div className="space-y-8">
          {newsCategory && newsArticles.length > 0 && (
            <CategorySection
              category={newsCategory}
              articles={newsArticles}
              layout="featured"
            />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdPlaceholder format="leaderboard" />
          </div>

          {politicsCategory ? (
            <CategorySection
              category={politicsCategory}
              articles={politicsArticles}
              layout="grid"
            />
          ) : null}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdPlaceholder format="leaderboard" />
          </div>

          <StoryOpinionSection
            opinionArticles={opinionArticles}
            storyArticles={storyArticles}
          />

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdPlaceholder format="leaderboard" />
          </div>

          {entertainmentCategory ? (
            <CategorySection
              category={entertainmentCategory}
              articles={entertainmentArticles}
              layout="three-column"
            />
          ) : null}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdPlaceholder format="leaderboard" />
          </div>

          <SportsSection articles={sportsArticles} subcategories={sportsSubcategories} />

          {worldCategory && diasporaCategory ? (
            <WorldDiasporaSection
              worldCategory={worldCategory}
              worldArticles={worldArticles}
              diasporaCategory={diasporaCategory}
              diasporaArticles={diasporaArticles}
            />
          ) : worldCategory ? (
            <CategorySection
              category={worldCategory}
              articles={worldArticles}
              layout="grid"
            />
          ) : null}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdPlaceholder format="leaderboard" />
          </div>

{economyCategory && economyArticles.length > 0 ? (
            <CategorySection
              category={economyCategory}
              articles={economyArticles}
              layout="featured"
            />
          ) : null}

          {societyCategory && societyArticles.length > 0 ? (
            <CategorySection
              category={societyCategory}
              articles={societyArticles}
              layout="grid"
            />
          ) : null}

          {technologyCategory && technologyArticles.length > 0 ? (
            <CategorySection
              category={technologyCategory}
              articles={technologyArticles}
              layout="list"
            />
          ) : null}

          {healthCategory && healthArticles.length > 0 ? (
            <CategorySection
              category={healthCategory}
              articles={healthArticles}
              layout="three-column"
            />
          ) : null}

          {lifestyleCategory && lifestyleArticles.length > 0 ? (
            <CategorySection
              category={lifestyleCategory}
              articles={lifestyleArticles}
              layout="horizontal"
            />
          ) : null}

          {cultureCategory && cultureArticles.length > 0 ? (
            <CategorySection
              category={cultureCategory}
              articles={cultureArticles}
              layout="featured"
            />
          ) : null}

          {hasProvinceNews && (
            <div className="py-8 border-t border-news-border dark:border-news-border-dark">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-news-red rounded-full" />
                    <h2 className="text-2xl font-bold">{isNepali ? 'प्रदेशहरु' : 'Provincial News'}</h2>
                  </div>
                  <Link
                    href="/provinces"
                    className="flex items-center gap-1 text-sm text-news-red hover:underline"
                  >
                    <span>{isNepali ? 'सबै हेर्नुहोस्' : 'View All'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {province1Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश १ - कोशी' : 'Province 1 - Koshi'}</h3>
                      <div className="space-y-4">
                        {province1Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province2Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश २ - मधेश' : 'Province 2 - Madhesh'}</h3>
                      <div className="space-y-4">
                        {province2Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province3Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश ३ - बागमती' : 'Province 3 - Bagmati'}</h3>
                      <div className="space-y-4">
                        {province3Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province4Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश ४ - गण्डकी' : 'Province 4 - Gandaki'}</h3>
                      <div className="space-y-4">
                        {province4Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province5Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश ५ - लुम्बिनी' : 'Province 5 - Lumbini'}</h3>
                      <div className="space-y-4">
                        {province5Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province6Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश ६ - कर्णाली' : 'Province 6 - Karnali'}</h3>
                      <div className="space-y-4">
                        {province6Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                  {province7Articles.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-news-primary">{isNepali ? 'प्रदेश ७ - सुदूरपश्चिम' : 'Province 7 - Sudurpashchim'}</h3>
                      <div className="space-y-4">
                        {province7Articles.slice(0, 3).map((article: Article) => (
                          <ArticleCard key={article.id} article={article} variant="province" showCategory={false} showExcerpt={false} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <HoroscopeSection />
        <VideoSection />
        <PhotoGallerySection />
      </div>
    </>
  );
}

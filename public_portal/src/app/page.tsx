import Link from 'next/link';
import { Metadata } from 'next';
import { CategorySection } from '@/components/sections/CategorySection';
import { LatestNewsSection } from '@/components/sections/LatestNewsSection';

import { AdBox } from '@/components/ads/AdBox';
import { FlashUpdateSidebar } from '@/components/FlashUpdateSidebar';
import { JsonLd } from '@/components/JsonLd';
import { NewsArticleJsonLd, WebSiteJsonLd } from '@/lib/jsonLd';
import { getFeaturedArticles, getLatestArticles, getArticles } from '@/lib/api/articles';
import { getCategories } from '@/lib/api/categories';
import { getPolls } from '@/lib/api/polls';
import { HoroscopeSection } from '@/components/horoscopes/HoroscopeSection';
import { VideoSection } from '@/components/sections/VideoSection';
import { PhotoGallerySection } from '@/components/sections/PhotoGallerySection';
import { FullWidthArticlesSection } from '@/components/sections/FullWidthArticlesSection';
import { WorldDiasporaSection } from '@/components/sections/WorldDiasporaSection';
import { Article, Poll, Category } from '@/types';
import { getServerLanguage } from '@/lib/utils/language';

// Custom Category Sections
import { NewsSection } from '@/components/sections/NewsSection';
import { StoryOpinionSection } from '@/components/sections/StoryOpinionSection';
import { SportsHomeSection } from '@/components/sections/SportsHomeSection';
import { ProvinceSection } from '@/components/sections/ProvinceSection';
import { LifestyleHealthSection } from '@/components/sections/LifestyleHealthSection';
import { SocietyCultureSection } from '@/components/sections/SocietyCultureSection';
import { EconomySection } from '@/components/sections/EconomySection';
import { TechnologySection } from '@/components/sections/TechnologySection';

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
    getArticles({ category: 'news', limit: 9 }),
    getArticles({ category: 'politics', limit: 7 }),
    getArticles({ category: 'economy', limit: 6 }),
    getArticles({ category: 'story', limit: 4 }),
    getArticles({ category: 'opinion', limit: 10 }),
    getArticles({ category: 'entertainment', limit: 7 }),
    getArticles({ category: 'technology', limit: 9 }),
    getArticles({ category: 'sports', limit: 6 }),
    getArticles({ category: 'world', limit: 5 }),
    getArticles({ category: 'diaspora', limit: 9 }),
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
    getArticles({ category: 'jeevan-shaili', limit: 10 }),
    getArticles({ category: 'dharma-sanskriti', limit: 7 }),
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

        {/* <section className="border-t border-news-border dark:border-news-border-dark py-6">
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
        </section> */}

        <div className="space-y-8">
          {/* News Section */}
          {newsCategory && newsArticles.length > 0 && (
            <NewsSection
              articles={newsArticles}
              category={newsCategory}
              poll={activePoll}
              mostReadArticles={trendingArticles}
            />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* Politics Section - Keep existing CategorySection */}
          {politicsCategory && politicsArticles.length > 0 ? (
            <CategorySection
              category={politicsCategory}
              articles={politicsArticles}
              layout="grid"
            />
          ) : null}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* Story & Opinion Combined Section */}
          {storyCategory && opinionCategory && (storyArticles.length > 0 || opinionArticles.length > 0) && (
            <StoryOpinionSection
              storyArticles={storyArticles}
              storyCategory={storyCategory}
              opinionArticles={opinionArticles}
              opinionCategory={opinionCategory}
            />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* Entertainment Section */}
          {entertainmentCategory && entertainmentArticles.length > 0 ? (
            <CategorySection
              category={entertainmentCategory}
              articles={entertainmentArticles}
              layout="entertainment"
            />
          ) : null}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* Sports Section */}
          {sportsCategory && sportsArticles.length > 0 && (
            <SportsHomeSection articles={sportsArticles} category={sportsCategory} />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* World & Diaspora Section */}
          {worldCategory && diasporaCategory && (
            <WorldDiasporaSection
              worldCategory={worldCategory}
              worldArticles={worldArticles}
              diasporaCategory={diasporaCategory}
              diasporaArticles={diasporaArticles}
            />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>

          {/* Economy Section */}
          {economyCategory && economyArticles.length > 0 && (
            <EconomySection articles={economyArticles} category={economyCategory} />
          )}

          {/* Society & Culture Combined Section */}
          {societyCategory && cultureCategory && (societyArticles.length > 0 || cultureArticles.length > 0) && (
            <SocietyCultureSection
              societyCategory={societyCategory}
              societyArticles={societyArticles}
              cultureCategory={cultureCategory}
              cultureArticles={cultureArticles}
            />
          )}

          {/* Technology Section */}
          {technologyCategory && technologyArticles.length > 0 && (
            <TechnologySection articles={technologyArticles} category={technologyCategory} />
          )}

          {/* Lifestyle & Health Combined Section */}
          {lifestyleCategory && healthCategory && (lifestyleArticles.length > 0 || healthArticles.length > 0) && (
            <LifestyleHealthSection
              lifestyleCategory={lifestyleCategory}
              lifestyleArticles={lifestyleArticles}
              healthCategory={healthCategory}
              healthArticles={healthArticles}
            />
          )}

          {/* Province Section */}
          {hasProvinceNews && (
            <ProvinceSection
              provinces={[
                { data: province1Articles, info: { slug: 'PROVINCE_1', nameNe: 'प्रदेश १', nameEn: 'Province 1' } },
                { data: province2Articles, info: { slug: 'PROVINCE_2', nameNe: 'प्रदेश २', nameEn: 'Province 2' } },
                { data: province3Articles, info: { slug: 'PROVINCE_3', nameNe: 'प्रदेश ३', nameEn: 'Province 3' } },
                { data: province4Articles, info: { slug: 'PROVINCE_4', nameNe: 'प्रदेश ४', nameEn: 'Province 4' } },
                { data: province5Articles, info: { slug: 'PROVINCE_5', nameNe: 'प्रदेश ५', nameEn: 'Province 5' } },
                { data: province6Articles, info: { slug: 'PROVINCE_6', nameNe: 'प्रदेश ६', nameEn: 'Province 6' } },
                { data: province7Articles, info: { slug: 'PROVINCE_7', nameNe: 'प्रदेश ७', nameEn: 'Province 7' } },
              ]}
            />
          )}

          <div className="py-4 container mx-auto px-4 flex justify-center">
            <AdBox position="HOME_MIDDLE" className="h-[90px] w-full max-w-[728px]" />
          </div>
        </div>

        <HoroscopeSection />
        <VideoSection />
        <PhotoGallerySection />
      </div>
    </>
  );
}

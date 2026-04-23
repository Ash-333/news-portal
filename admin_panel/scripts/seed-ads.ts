import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📢 Seeding advertisements...\n");

  const admin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" },
  });

  if (!admin) {
    console.error("❌ No admin user found. Please run seed first.");
    process.exit(1);
  }

  const adminId = admin.id;

  const advertisements = [
    {
      id: "seed-ad-sidebar-1",
      titleNe: "विशेष अफर - २०% छुट",
      titleEn: "Special Offer - 20% Off",
      mediaUrl:
        "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80",
      linkUrl: "https://example.com/shop",
      position: "SIDEBAR",
      mediaType: "image",
    },
    {
      id: "seed-ad-sidebar-2",
      titleNe: "नयाँ स्मार्टफोन खरिद गर्नुहोस्",
      titleEn: "Buy New Smartphones",
      mediaUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      linkUrl: "https://example.com/phones",
      position: "SIDEBAR",
      mediaType: "image",
    },
    {
      id: "seed-ad-sidebar-top",
      titleNe: "शीर्ष विज्ञापन - नयाँ उत्पादन",
      titleEn: "Top Ad - New Products",
      mediaUrl:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&q=80",
      linkUrl: "https://example.com/products",
      position: "SIDEBAR_TOP",
      mediaType: "image",
    },
    {
      id: "seed-ad-sidebar-bottom",
      titleNe: "तल विज्ञापन - होटल बुकिङ",
      titleEn: "Bottom Ad - Hotel Booking",
      mediaUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      linkUrl: "https://example.com/hotels",
      position: "SIDEBAR_BOTTOM",
      mediaType: "image",
    },
    {
      id: "seed-ad-banner",
      titleNe: "ब्यानर विज्ञापन - शैक्षिक कार्यक्रम",
      titleEn: "Banner Ad - Educational Program",
      mediaUrl:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      linkUrl: "https://example.com/education",
      position: "BANNER",
      mediaType: "image",
    },
    {
      id: "seed-ad-home-middle",
      titleNe: "होम पेज मध्य विज्ञापन",
      titleEn: "Home Page Middle Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1557838923-2985c3186aec?w=800&q=80",
      linkUrl: "https://example.com/services",
      position: "HOME_MIDDLE",
      mediaType: "image",
    },
    {
      id: "seed-ad-in-article",
      titleNe: "लेख मध्य विज्ञापन",
      titleEn: "In-Article Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      linkUrl: "https://example.com/finance",
      position: "IN_ARTICLE",
      mediaType: "image",
    },
    {
      id: "seed-ad-article-title",
      titleNe: "लेख शीर्षक विज्ञापन",
      titleEn: "Article Title Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      linkUrl: "https://example.com/marketing",
      position: "ARTICLE_TITLE",
      mediaType: "image",
    },
    {
      id: "seed-ad-article-excerpt",
      titleNe: "लेख सारांश विज्ञापन",
      titleEn: "Article Excerpt Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1551135048-8b5e3bf6a5da?w=800&q=80",
      linkUrl: "https://example.com/consulting",
      position: "ARTICLE_EXCERPT",
      mediaType: "image",
    },
    {
      id: "seed-ad-article-end",
      titleNe: "लेख अंत विज्ञापन",
      titleEn: "Article End Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
      linkUrl: "https://example.com/tech",
      position: "ARTICLE_END",
      mediaType: "image",
    },
    {
      id: "seed-ad-featured-1",
      titleNe: "फिचर्ड १ - विशेष अफर",
      titleEn: "Featured 1 - Special Offer",
      mediaUrl:
        "https://images.unsplash.com/photo-1607082348824-259a7c2d639b?w=800&q=80",
      linkUrl: "https://example.com/deals",
      position: "FEATURED_1",
      mediaType: "image",
    },
    {
      id: "seed-ad-featured-2",
      titleNe: "फिचर्ड २ - नयाँ उत्पादन",
      titleEn: "Featured 2 - New Products",
      mediaUrl:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a6a?w=800&q=80",
      linkUrl: "https://example.com/new-arrivals",
      position: "FEATURED_2",
      mediaType: "image",
    },
    {
      id: "seed-ad-featured-3",
      titleNe: "फिचर्ड ३ - लोकप्रिय",
      titleEn: "Featured 3 - Popular",
      mediaUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      linkUrl: "https://example.com/popular",
      position: "FEATURED_3",
      mediaType: "image",
    },
    {
      id: "seed-ad-top-bar",
      titleNe: "टप बार विज्ञापन",
      titleEn: "Top Bar Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80",
      linkUrl: "https://example.com/top-bar",
      position: "TOP_BAR",
      mediaType: "image",
    },
    {
      id: "seed-ad-latest-news",
      titleNe: "ताजा समाचार विज्ञापन",
      titleEn: "Latest News Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
      linkUrl: "https://example.com/latest-news",
      position: "LATEST_NEWS",
      mediaType: "image",
    },
    {
      id: "seed-ad-category-section",
      titleNe: "श्रेणी खंड विज्ञापन",
      titleEn: "Category Section Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      linkUrl: "https://example.com/category",
      position: "CATEGORY_SECTION",
      mediaType: "image",
    },
    {
      id: "seed-ad-section-sidebar",
      titleNe: "खंड साइडबार विज्ञापन",
      titleEn: "Section Sidebar Ad",
      mediaUrl:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      linkUrl: "https://example.com/section-sidebar",
      position: "SECTION_SIDEBAR",
      mediaType: "image",
    },
  ];

  for (const ad of advertisements) {
    await prisma.advertisement.upsert({
      where: { id: ad.id },
      update: {},
      create: {
        id: ad.id,
        titleNe: ad.titleNe,
        titleEn: ad.titleEn,
        mediaUrl: ad.mediaUrl,
        linkUrl: ad.linkUrl,
        position: ad.position,
        mediaType: ad.mediaType,
        isActive: true,
        createdBy: adminId,
      },
    });
  }

  console.log(`✅ Advertisements: ${advertisements.length} created/updated`);
  console.log("\n📍 Ad positions created:");
  console.log("  - SIDEBAR (2 ads for rotation)");
  console.log("  - SIDEBAR_TOP");
  console.log("  - SIDEBAR_BOTTOM");
  console.log("  - BANNER");
  console.log("  - HOME_MIDDLE");
  console.log("  - HOME_TOP");
  console.log("  - TOP_BAR");
  console.log("  - IN_ARTICLE");
  console.log("  - ARTICLE_TITLE");
  console.log("  - ARTICLE_EXCERPT");
  console.log("  - ARTICLE_END");
  console.log("  - FEATURED_1");
  console.log("  - FEATURED_2");
  console.log("  - FEATURED_3");
  console.log("  - LATEST_NEWS");
  console.log("  - CATEGORY_SECTION");
  console.log("  - SECTION_SIDEBAR");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
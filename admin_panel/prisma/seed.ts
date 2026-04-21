import {
  PrismaClient,
  Role,
  ArticleStatus,
  MediaType,
  CommentStatus,
  Poll,
  Province,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════
// UNSPLASH IMAGES
// ═══════════════════════════════════════════════════════

const images = {
  // Featured / cover images
  politics1:
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80",
  politics2:
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=80",
  politics3:
    "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&q=80",
  politics4:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=80",
  sports1:
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
  sports2:
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80",
  sports3:
    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
  sports4:
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&q=80",
  tech1:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  tech2:
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80",
  tech3:
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
  economy1:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
  economy2:
    "https://images.unsplash.com/photo-1559526324-593bc073d938?w=1200&q=80",
  economy3:
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  entertain1:
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=80",
  entertain2:
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
  entertain3:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
  world1:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
  world2:
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80",
  society1:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  society2:
    "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&q=80",

  // Inline content images (smaller, different angles)
  inline_parliament:
    "https://images.unsplash.com/photo-1575320181282-9afab399332c?w=800&q=80",
  inline_budget:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  inline_election:
    "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=800&q=80",
  inline_diplomacy:
    "https://images.unsplash.com/photo-1521791055366-0d553872952f?w=800&q=80",
  inline_cricket1:
    "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&q=80",
  inline_cricket2:
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80",
  inline_football:
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80",
  inline_marathon:
    "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
  inline_tech_office:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  inline_mobile:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
  inline_coding:
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  inline_market:
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  inline_gold:
    "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
  inline_bank:
    "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&q=80",
  inline_movie:
    "https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&q=80",
  inline_concert:
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
  inline_globe:
    "https://images.unsplash.com/photo-1457282367193-e3b79e38f207?w=800&q=80",
  inline_climate:
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
  inline_school:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",
  inline_hospital:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
};

// ═══════════════════════════════════════════════════════
// HELPER — build image HTML tag for inline content
// ═══════════════════════════════════════════════════════

function img(url: string, caption: string): string {
  return `
<figure style="margin: 24px 0;">
  <img src="${url}" alt="${caption}" style="width:100%; border-radius:8px;" />
  <figcaption style="text-align:center; color:#666; font-size:13px; margin-top:8px;">${caption}</figcaption>
</figure>`;
}

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ═══════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════

  const superAdminPassword = await bcrypt.hash("admin123", 12);
  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Super Admin",
      nameNe: "सुपर एडमिन",
      passwordHash: superAdminPassword,
      role: Role.SUPERADMIN,
      status: "ACTIVE",
      bio: "Super Administrator of the News Portal.",
    },
  });

  const authorPassword = await bcrypt.hash("author123", 12);

  const author1 = await prisma.user.upsert({
    where: { email: "rajesh@example.com" },
    update: {},
    create: {
      email: "rajesh@example.com",
      name: "Rajesh Sharma",
      nameNe: "राजेश शर्मा",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      status: "ACTIVE",
      bio: "Senior political correspondent with over 10 years covering Nepal politics.",
    },
  });

  const author2 = await prisma.user.upsert({
    where: { email: "sita@example.com" },
    update: {},
    create: {
      email: "sita@example.com",
      name: "Sita Thapa",
      nameNe: "सीता थापा",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      status: "ACTIVE",
      bio: "Sports journalist covering cricket, football and athletics across South Asia.",
    },
  });

  const author3 = await prisma.user.upsert({
    where: { email: "bikash@example.com" },
    update: {},
    create: {
      email: "bikash@example.com",
      name: "Bikash Karki",
      nameNe: "विकाश कार्की",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      status: "ACTIVE",
      bio: "Technology and startup writer based in Kathmandu.",
    },
  });

  const author4 = await prisma.user.upsert({
    where: { email: "priya@example.com" },
    update: {},
    create: {
      email: "priya@example.com",
      name: "Priya Rai",
      nameNe: "प्रिया राई",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      status: "ACTIVE",
      bio: "Economy and business journalist tracking Nepal financial markets.",
    },
  });

  const author5 = await prisma.user.upsert({
    where: { email: "amit@example.com" },
    update: {},
    create: {
      email: "amit@example.com",
      name: "Amit Gurung",
      nameNe: "अमित गुरुङ",
      passwordHash: authorPassword,
      role: Role.AUTHOR,
      status: "ACTIVE",
      bio: "Entertainment and culture writer covering Nepali cinema and music.",
    },
  });

  console.log("✅ Users: 6 created");

  // ═══════════════════════════════════════════
  // PUBLIC USERS (for comments)
  // ═══════════════════════════════════════════

  const publicUserPassword = await bcrypt.hash("user123", 12);

  const publicUser1 = await prisma.user.upsert({
    where: { email: "ram@example.com" },
    update: {},
    create: {
      email: "ram@example.com",
      name: "Ram Kumar",
      nameNe: "राम कुमार",
      passwordHash: publicUserPassword,
      role: Role.PUBLIC_USER,
      status: "ACTIVE",
    },
  });

  const publicUser2 = await prisma.user.upsert({
    where: { email: "sita2@example.com" },
    update: {},
    create: {
      email: "sita2@example.com",
      name: "Sita Devi",
      nameNe: "सीता देवी",
      passwordHash: publicUserPassword,
      role: Role.PUBLIC_USER,
      status: "ACTIVE",
    },
  });

  const publicUser3 = await prisma.user.upsert({
    where: { email: "hari@example.com" },
    update: {},
    create: {
      email: "hari@example.com",
      name: "Hari Bahadur",
      nameNe: "हरि बहादुर",
      passwordHash: publicUserPassword,
      role: Role.PUBLIC_USER,
      status: "ACTIVE",
    },
  });

  const publicUser4 = await prisma.user.upsert({
    where: { email: "gita@example.com" },
    update: {},
    create: {
      email: "gita@example.com",
      name: "Gita Sharma",
      nameNe: "गीता शर्मा",
      passwordHash: publicUserPassword,
      role: Role.PUBLIC_USER,
      status: "ACTIVE",
    },
  });

  console.log("✅ Public Users: 4 created");

  // ═══════════════════════════════════════════
  // CATEGORIES
  // ═══════════════════════════════════════════

  const politics = await prisma.category.upsert({
    where: { slug: "politics" },
    update: {},
    create: { nameNe: "राजनीति", nameEn: "Politics", slug: "politics" },
  });
  const sports = await prisma.category.upsert({
    where: { slug: "sports" },
    update: {},
    create: { nameNe: "खेलकुद", nameEn: "Sports", slug: "sports" },
  });
  const technology = await prisma.category.upsert({
    where: { slug: "technology" },
    update: {},
    create: { nameNe: "प्रविधि", nameEn: "Technology", slug: "technology" },
  });
  const entertainment = await prisma.category.upsert({
    where: { slug: "entertainment" },
    update: {},
    create: {
      nameNe: "मनोरञ्जन",
      nameEn: "Entertainment",
      slug: "entertainment",
    },
  });
  const economy = await prisma.category.upsert({
    where: { slug: "economy" },
    update: {},
    create: { nameNe: "अर्थतन्त्र", nameEn: "Economy", slug: "economy" },
  });
  const world = await prisma.category.upsert({
    where: { slug: "world" },
    update: {},
    create: { nameNe: "विश्व", nameEn: "World", slug: "world" },
  });
  const society = await prisma.category.upsert({
    where: { slug: "society" },
    update: {},
    create: { nameNe: "समाज", nameEn: "Society", slug: "society" },
  });

  // New categories
  const news = await prisma.category.upsert({
    where: { slug: "news" },
    update: {},
    create: { nameNe: "समाचार", nameEn: "News", slug: "news" },
  });
  const dharmaSanskriti = await prisma.category.upsert({
    where: { slug: "dharma-sanskriti" },
    update: {},
    create: {
      nameNe: "धर्मसंस्कृति",
      nameEn: "Dharma & Culture",
      slug: "dharma-sanskriti",
    },
  });
  const swasthya = await prisma.category.upsert({
    where: { slug: "swasthya" },
    update: {},
    create: { nameNe: "स्वास्थ्य", nameEn: "Health", slug: "swasthya" },
  });
  const jeevanShaili = await prisma.category.upsert({
    where: { slug: "jeevan-shaili" },
    update: {},
    create: { nameNe: "जीवनशैली", nameEn: "Lifestyle", slug: "jeevan-shaili" },
  });
  const antarvarta = await prisma.category.upsert({
    where: { slug: "antarvarta" },
    update: {},
    create: { nameNe: "अन्तर्वार्ता", nameEn: "Interview", slug: "antarvarta" },
  });

  // Provinces category (parent)
  const provincesCategory = await prisma.category.upsert({
    where: { slug: "provinces" },
    update: {},
    create: { nameNe: "प्रदेशहरु", nameEn: "Provinces", slug: "provinces" },
  });

  // Province subcategories (children of provinces)
  const provinceSubcategories = [
    { slug: "koshi-province", nameEn: "Koshi Province", nameNe: "कोशी प्रदेश" },
    {
      slug: "madhesh-province",
      nameEn: "Madhesh Province",
      nameNe: "मधेश प्रदेश",
    },
    {
      slug: "bagmati-province",
      nameEn: "Bagmati Province",
      nameNe: "बागमती प्रदेश",
    },
    {
      slug: "gandaki-province",
      nameEn: "Gandaki Province",
      nameNe: "गण्डकी प्रदेश",
    },
    {
      slug: "lumbini-province",
      nameEn: "Lumbini Province",
      nameNe: "लुम्बिनी प्रदेश",
    },
    {
      slug: "karnali-province",
      nameEn: "Karnali Province",
      nameNe: "कर्णाली प्रदेश",
    },
    {
      slug: "sudurpashchim-province",
      nameEn: "Sudurpashchim Province",
      nameNe: "सुदूरपश्चिम प्रदेश",
    },
  ];

  for (const province of provinceSubcategories) {
    await prisma.category.upsert({
      where: { slug: province.slug },
      update: {},
      create: {
        nameNe: province.nameNe,
        nameEn: province.nameEn,
        slug: province.slug,
        parentId: provincesCategory.id,
      },
    });
  }

  console.log(
    "✅ Categories: 21 created (13 + provinces with 7 subcategories)",
  );

  // ═══════════════════════════════════════════
  // TAGS
  // ═══════════════════════════════════════════

  const tagBreaking = await prisma.tag.upsert({
    where: { slug: "breaking-news" },
    update: {},
    create: {
      nameNe: "ब्रेकिङ न्युज",
      nameEn: "Breaking News",
      slug: "breaking-news",
    },
  });
  const tagNepal = await prisma.tag.upsert({
    where: { slug: "nepal" },
    update: {},
    create: { nameNe: "नेपाल", nameEn: "Nepal", slug: "nepal" },
  });
  const tagKtm = await prisma.tag.upsert({
    where: { slug: "kathmandu" },
    update: {},
    create: { nameNe: "काठमाडौं", nameEn: "Kathmandu", slug: "kathmandu" },
  });
  const tagGovt = await prisma.tag.upsert({
    where: { slug: "government" },
    update: {},
    create: { nameNe: "सरकार", nameEn: "Government", slug: "government" },
  });
  const tagCricket = await prisma.tag.upsert({
    where: { slug: "cricket" },
    update: {},
    create: { nameNe: "क्रिकेट", nameEn: "Cricket", slug: "cricket" },
  });
  const tagFootball = await prisma.tag.upsert({
    where: { slug: "football" },
    update: {},
    create: { nameNe: "फुटबल", nameEn: "Football", slug: "football" },
  });
  const tagStartup = await prisma.tag.upsert({
    where: { slug: "startup" },
    update: {},
    create: { nameNe: "स्टार्टअप", nameEn: "Startup", slug: "startup" },
  });
  const tagFintech = await prisma.tag.upsert({
    where: { slug: "fintech" },
    update: {},
    create: { nameNe: "फिनटेक", nameEn: "Fintech", slug: "fintech" },
  });
  const tagBudget = await prisma.tag.upsert({
    where: { slug: "budget" },
    update: {},
    create: { nameNe: "बजेट", nameEn: "Budget", slug: "budget" },
  });
  const tagFilm = await prisma.tag.upsert({
    where: { slug: "nepali-film" },
    update: {},
    create: {
      nameNe: "नेपाली चलचित्र",
      nameEn: "Nepali Film",
      slug: "nepali-film",
    },
  });
  const tagMusic = await prisma.tag.upsert({
    where: { slug: "music" },
    update: {},
    create: { nameNe: "सङ्गीत", nameEn: "Music", slug: "music" },
  });
  const tagClimate = await prisma.tag.upsert({
    where: { slug: "climate" },
    update: {},
    create: { nameNe: "जलवायु", nameEn: "Climate", slug: "climate" },
  });
  const tagEducation = await prisma.tag.upsert({
    where: { slug: "education" },
    update: {},
    create: { nameNe: "शिक्षा", nameEn: "Education", slug: "education" },
  });
  const tagHealth = await prisma.tag.upsert({
    where: { slug: "health" },
    update: {},
    create: { nameNe: "स्वास्थ्य", nameEn: "Health", slug: "health" },
  });
  const tagTourism = await prisma.tag.upsert({
    where: { slug: "tourism" },
    update: {},
    create: { nameNe: "पर्यटन", nameEn: "Tourism", slug: "tourism" },
  });

  console.log("✅ Tags: 15 created\n");

  // ═══════════════════════════════════════════
  // PHOTO GALLERIES
  // ═══════════════════════════════════════════

  console.log("📸 Seeding photo galleries...\n");

  async function createPhotoGallery({
    slug,
    titleNe,
    titleEn,
    excerptNe,
    excerptEn,
    authorId,
    coverImageUrl,
    coverImageFilename,
    photos,
    isPublished = true,
  }: {
    slug: string;
    titleNe: string;
    titleEn: string;
    excerptNe?: string;
    excerptEn?: string;
    authorId: string;
    coverImageUrl: string;
    coverImageFilename: string;
    photos: Array<{
      url: string;
      filename: string;
      captionNe?: string;
      captionEn?: string;
    }>;
    isPublished?: boolean;
  }) {
    // Create cover image media
    let coverMedia = await prisma.media.findFirst({
      where: { filename: coverImageFilename },
    });

    if (!coverMedia) {
      coverMedia = await prisma.media.create({
        data: {
          filename: coverImageFilename,
          url: coverImageUrl,
          type: MediaType.IMAGE,
          altText: titleEn,
          size: 250000,
          uploadedBy: authorId,
        },
      });
    }

    // Create photo media entries
    const photoMediaRecords = await Promise.all(
      photos.map(async (photo, index) => {
        const filename = `${slug}-photo-${index}.jpg`;
        let media = await prisma.media.findFirst({
          where: { filename },
        });

        if (!media) {
          media = await prisma.media.create({
            data: {
              filename,
              url: photo.url,
              type: MediaType.IMAGE,
              altText: photo.captionEn || titleEn,
              size: 180000,
              uploadedBy: authorId,
            },
          });
        }
        return {
          media,
          captionNe: photo.captionNe,
          captionEn: photo.captionEn,
        };
      }),
    );

    // Create photo gallery
    const gallery = await prisma.photoGallery.upsert({
      where: { slug },
      update: {
        titleNe,
        titleEn,
        excerptNe,
        excerptEn,
        coverImageId: coverMedia.id,
        isPublished,
      },
      create: {
        titleNe,
        titleEn,
        excerptNe,
        excerptEn,
        slug,
        isPublished,
        authorId,
        coverImageId: coverMedia.id,
      },
    });

    // Add photos to gallery
    await prisma.photoGalleryPhoto.deleteMany({
      where: { photoGalleryId: gallery.id },
    });

    await prisma.photoGalleryPhoto.createMany({
      data: photoMediaRecords.map((record, index) => ({
        photoGalleryId: gallery.id,
        mediaId: record.media.id,
        order: index,
        captionNe: record.captionNe,
        captionEn: record.captionEn,
      })),
    });

    return gallery;
  }

  // Gallery 1: Kathmandu City Views
  await createPhotoGallery({
    slug: "kathmandu-city-views-2082",
    titleNe: "काठमाडौंको सुन्दर दृश्यहरू",
    titleEn: "Beautiful Views of Kathmandu City",
    excerptNe:
      "काठमाडौं उपत्यकाका विभिन्न स्थानहरूबाट लिइएको मनमोहक दृश्य सङ्कलन।",
    excerptEn:
      "A collection of breathtaking views from various locations across Kathmandu Valley.",
    authorId: author2.id,
    coverImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    coverImageFilename: "kathmandu-gallery-cover.jpg",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        filename: "kathmandu-photo-1.jpg",
        captionNe: "स्वयम्भूनाथ दृश्य",
        captionEn: "Swayambhunath Stupa View",
      },
      {
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
        filename: "kathmandu-photo-2.jpg",
        captionNe: "पाटन दरबार स्क्वायर",
        captionEn: "Patan Durbar Square",
      },
      {
        url: "https://images.unsplash.com/photo-1598091383021-15ddea1448c8?w=800&q=80",
        filename: "kathmandu-photo-3.jpg",
        captionNe: "सुन्दर हवेली पुरानो नगर",
        captionEn: "Traditional Architecture in Old City",
      },
      {
        url: "https://images.unsplash.com/photo-1582108336632-062975a1e855?w=800&q=80",
        filename: "kathmandu-photo-4.jpg",
        captionNe: "बौद्धनाथ स्तूप",
        captionEn: "Boudhanath Stupa",
      },
      {
        url: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80",
        filename: "kathmandu-photo-5.jpg",
        captionNe: "काठमाडौंको रात्री दृश्य",
        captionEn: "Kathmandu Night Skyline",
      },
    ],
  });
  console.log("  ✓ Gallery 1: Kathmandu City Views");

  // Gallery 2: Himalayan Landscapes
  await createPhotoGallery({
    slug: "himalayan-landscapes-nepal",
    titleNe: "हिमालयको रमाइलो दृश्यहरू",
    titleEn: "Majestic Himalayan Landscapes",
    excerptNe: "नेपालको हिमाल क्षेत्रका मनमोहक प्रकृतिक दृश्यहरूको सङ्कलन।",
    excerptEn:
      "A stunning collection of natural landscapes from Nepal's Himalayan region.",
    authorId: author2.id,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
    coverImageFilename: "himalayan-gallery-cover.jpg",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",
        filename: "himalaya-photo-1.jpg",
        captionNe: "माउण्ट एवरेस्ट दृश्य",
        captionEn: "Mount Everest View",
      },
      {
        url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80",
        filename: "himalaya-photo-2.jpg",
        captionNe: "अन्नपूर्ण रेन्ज",
        captionEn: "Annapurna Mountain Range",
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        filename: "himalaya-photo-3.jpg",
        captionNe: "घर्तकुण्ड झील",
        captionEn: "Gokyo Lakes",
      },
      {
        url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
        filename: "himalaya-photo-4.jpg",
        captionNe: "माचापुच्छ्रे हिमाल",
        captionEn: "Machapuchare (Fish Tail) Peak",
      },
      {
        url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
        filename: "himalaya-photo-5.jpg",
        captionNe: "गोसाइँकुण्ड",
        captionEn: "Gosainkunda Lake",
      },
    ],
  });
  console.log("  ✓ Gallery 2: Himalayan Landscapes");

  // Gallery 3: Cultural Festivals
  await createPhotoGallery({
    slug: "nepal-cultural-festivals-2082",
    titleNe: "नेपालको सांस्कृतिक पर्वहरू",
    titleEn: "Cultural Festivals of Nepal",
    excerptNe: "नेपालको विभिन्न सांस्कृतिक पर्वहरूबाट लिइएको दृश्य सङ्कलन।",
    excerptEn:
      "A vibrant collection capturing Nepal's rich cultural festivals.",
    authorId: author5.id,
    coverImageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&q=80",
    coverImageFilename: "festivals-gallery-cover.jpg",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800&q=80",
        filename: "festival-photo-1.jpg",
        captionNe: "दशैं पर्वको दृश्य",
        captionEn: "Dashain Festival Celebration",
      },
      {
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
        filename: "festival-photo-2.jpg",
        captionNe: "स्वयम्भूनाथलोक फेस्टिभल",
        captionEn: "Swayambhunath Annual Festival",
      },
      {
        url: "https://images.unsplash.com/photo-1582108336632-062975a1e855?w=800&q=80",
        filename: "festival-photo-3.jpg",
        captionNe: "बौद्धनाथ चैते दसैं",
        captionEn: "Boudhanath Chaite Dashain",
      },
      {
        url: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80",
        filename: "festival-photo-4.jpg",
        captionNe: "इन्द्रजात्रा पर्व",
        captionEn: "Indra Jatra Festival",
      },
      {
        url: "https://images.unsplash.com/photo-1598091383021-15ddea1448c8?w=800&q=80",
        filename: "festival-photo-5.jpg",
        captionNe: "तिहार दीपावली",
        captionEn: "Tihar Diwali Lights",
      },
    ],
  });
  console.log("  ✓ Gallery 3: Cultural Festivals");

  // Gallery 4: Wildlife of Nepal
  await createPhotoGallery({
    slug: "nepal-wildlife-photography",
    titleNe: "नेपालको वन्यजन्तु संग्रह",
    titleEn: "Wildlife Photography Collection",
    excerptNe:
      "चितवन र बार्दिया राष्ट्रिय निकुञ्जबाट लिइएको वन्यजन्तुका दृश्यहरू।",
    excerptEn:
      "Wildlife photos captured from Chitwan and Bardia National Parks.",
    authorId: author2.id,
    coverImageUrl:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=1200&q=80",
    coverImageFilename: "wildlife-gallery-cover.jpg",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80",
        filename: "wildlife-photo-1.jpg",
        captionNe: "एक-सिङ्गे गैँडा",
        captionEn: "One-Horned Rhinoceros",
      },
      {
        url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80",
        filename: "wildlife-photo-2.jpg",
        captionNe: "बाघ चितवन",
        captionEn: "Bengal Tiger in Chitwan",
      },
      {
        url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80",
        filename: "wildlife-photo-3.jpg",
        captionNe: "हाती सफारी",
        captionEn: "Elephant Safari",
      },
      {
        url: "https://images.unsplash.com/photo-1569678834646-437873507316?w=800&q=80",
        filename: "wildlife-photo-4.jpg",
        captionNe: "घाडियाल कृमि",
        captionEn: "Gharial Crocodile",
      },
      {
        url: "https://images.unsplash.com/photo-1570470867345-25e578504c89?w=800&q=80",
        filename: "wildlife-photo-5.jpg",
        captionNe: "डाफे मुनाल पक्षी",
        captionEn: "Himalayan Monal Pheasant",
      },
    ],
  });
  console.log("  ✓ Gallery 4: Nepal Wildlife");

  // Gallery 5: Traditional Architecture
  await createPhotoGallery({
    slug: "nepal-traditional-architecture",
    titleNe: "नेपालको परम्परागत वास्तुकला",
    titleEn: "Traditional Architecture of Nepal",
    excerptNe:
      "दरबार स्क्वायर र विभिन्न मन्दिरहरूको वास्तुकलाको सुन्दर दृश्यहरू।",
    excerptEn:
      "Beautiful architectural details from Durbar Squares and ancient temples.",
    authorId: author1.id,
    coverImageUrl:
      "https://images.unsplash.com/photo-1574169208507-84376144848b?w=1200&q=80",
    coverImageFilename: "architecture-gallery-cover.jpg",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",
        filename: "arch-photo-1.jpg",
        captionNe: "नयाँ मन्दिर पाटन",
        captionEn: "Krishna Mandir Patan",
      },
      {
        url: "https://images.unsplash.com/photo-1582108336632-062975a1e855?w=800&q=80",
        filename: "arch-photo-2.jpg",
        captionNe: "स्वयम्भूनाथ स्तूप विवरण",
        captionEn: "Swayambhunath Stupa Details",
      },
      {
        url: "https://images.unsplash.com/photo-1591017403286-fd8493524e1e?w=800&q=80",
        filename: "arch-photo-3.jpg",
        captionNe: "दरबार स्क्वायर खण्डहर",
        captionEn: "Durbar Square Woodcarvings",
      },
      {
        url: "https://images.unsplash.com/photo-1598091383021-15ddea1448c8?w=800&q=80",
        filename: "arch-photo-4.jpg",
        captionNe: "भक्तपुर दरबार स्क्वायर",
        captionEn: "Bhaktapur Durbar Square",
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
        filename: "arch-photo-5.jpg",
        captionNe: "पशुपतिनाथ मन्दिर",
        captionEn: "Pashupatinath Temple",
      },
    ],
  });
  console.log("  ✓ Gallery 5: Traditional Architecture");

  console.log("✅ Photo Galleries: 5 created\n");

  // ═══════════════════════════════════════════
  // HELPER FUNCTION
  // ═══════════════════════════════════════════

  async function createArticle({
    slug,
    coverImageUrl,
    coverImageFilename,
    uploadedById,
    titleNe,
    titleEn,
    subheadingNe,
    subheadingEn,
    excerptNe,
    excerptEn,
    contentNe,
    contentEn,
    categoryId,
    authorId,
    status = ArticleStatus.PUBLISHED,
    isFeatured = false,
    isBreaking = false,
    tagIds = [],
    metaTitle,
    metaDescription,
    publishedAt,
    province,
  }: {
    slug: string;
    coverImageUrl: string;
    coverImageFilename: string;
    uploadedById: string;
    titleNe: string;
    titleEn: string;
    subheadingNe?: string;
    subheadingEn?: string;
    excerptNe: string;
    excerptEn: string;
    contentNe: string;
    contentEn: string;
    categoryId: string;
    authorId: string;
    status?: ArticleStatus;
    isFeatured?: boolean;
    province?: Province;
    isBreaking?: boolean;
    tagIds?: string[];
    metaTitle?: string;
    metaDescription?: string;
    publishedAt?: Date;
  }) {
    // First delete existing article tags to avoid conflicts on re-seed
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (existing) {
      await prisma.articleTag.deleteMany({ where: { articleId: existing.id } });
    }

    // Create media record for cover image
    let media = await prisma.media.findFirst({
      where: { filename: coverImageFilename },
    });

    if (!media) {
      media = await prisma.media.create({
        data: {
          filename: coverImageFilename,
          url: coverImageUrl,
          type: MediaType.IMAGE,
          altText: titleEn,
          size: 350000,
          uploadedBy: uploadedById,
        },
      });
    }

    // Upsert article
    const article = await prisma.article.upsert({
      where: { slug },
      update: {
        titleNe,
        titleEn,
        subheadingNe,
        subheadingEn,
        contentNe,
        contentEn,
        excerptNe,
        excerptEn,
        status,
        isFeatured,
        isBreaking,
        province,
        categoryId,
        authorId,
        featuredImageId: media.id,
        metaTitle: metaTitle ?? titleEn,
        metaDescription: metaDescription ?? excerptEn,
        publishedAt: publishedAt ?? new Date(),
      },
      create: {
        titleNe,
        titleEn,
        subheadingNe,
        subheadingEn,
        contentNe,
        contentEn,
        excerptNe,
        excerptEn,
        slug,
        status,
        isFeatured,
        isBreaking,
        province,
        categoryId,
        authorId,
        featuredImageId: media.id,
        metaTitle: metaTitle ?? titleEn,
        metaDescription: metaDescription ?? excerptEn,
        publishedAt: publishedAt ?? new Date(),
      },
    });

    // Create tags
    if (tagIds.length > 0) {
      await prisma.articleTag.createMany({
        data: tagIds.map((tagId) => ({
          articleId: article.id,
          tagId,
        })),
        skipDuplicates: true,
      });
    }

    // Store article reference for later use (comments, etc.)
    articlesBySlug[slug] = { id: article.id, titleEn: article.titleEn };

    return article;
  }

  // Helper function to get article by slug
  function getArticle(slug: string) {
    return articlesBySlug[slug];
  }

  // ═══════════════════════════════════════════
  // ARTICLES
  // ═══════════════════════════════════════════

  console.log("📰 Seeding articles...\n");

  // Store articles by slug for later reference (comments, etc.)
  const articlesBySlug: Record<string, { id: string; titleEn: string }> = {};

  // ─────────────────────────────────────────
  // POLITICS — 4 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepal-government-new-budget-2082",
    coverImageUrl: images.politics1,
    coverImageFilename: "budget-announcement-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "सरकारले १८ खर्बको बजेट घोषणा गर्यो, कृषि र पूर्वाधारमा जोड",
    titleEn:
      "Government Announces Rs 18 Trillion Budget Focusing on Agriculture and Infrastructure",
    excerptNe:
      "अर्थमन्त्रीले आगामी आर्थिक वर्षको लागि ठूलो बजेट प्रस्तुत गर्दै कृषि र पूर्वाधार विकासमा ठूलो लगानीको घोषणा गरेका छन्।",
    excerptEn:
      "The Finance Minister presented a massive budget for the upcoming fiscal year, announcing major investments in agriculture and infrastructure development.",
    contentNe: `<p>काठमाडौं, चैत्र ८ । अर्थमन्त्रीले आगामी आर्थिक वर्ष २०८२/८३ को लागि १८ खर्ब रुपैयाँभन्दा बढीको बजेट संसदमा प्रस्तुत गरेका छन्।</p>

<p>यो बजेटमा कृषि क्षेत्रको लागि ३ खर्ब रुपैयाँ, पूर्वाधार विकासको लागि ५ खर्ब रुपैयाँ र शिक्षा तथा स्वास्थ्यको लागि उल्लेख्य रकम विनियोजन गरिएको छ।</p>

${img(images.inline_budget, "अर्थमन्त्रीले संसदमा बजेट प्रस्तुत गर्दै — Finance Minister presenting the budget in parliament")}

<p>अर्थमन्त्रीले भने, "हाम्रो सरकार आर्थिक समृद्धिको लागि प्रतिबद्ध छ। यो बजेटले नेपाली जनताको जीवनस्तर उकास्न मद्दत गर्नेछ।"</p>

<p>विपक्षी दलहरूले भने यो बजेटलाई अव्यावहारिक भन्दै आलोचना गरेका छन्। नेकपा एमालेका नेता केपी शर्मा ओलीले बजेट कार्यान्वयनमा गम्भीर प्रश्न उठाएका छन्।</p>

<p>बजेटमा विद्युत् आयोजनाहरूको लागि छुट्टै रकम विनियोजन गरिएको छ। बुढीगण्डकी जलविद्युत् परियोजनाको काम अब तीव्र गतिमा अघि बढ्ने सरकारको दाबी छ।</p>

${img(images.inline_parliament, "संसद् बैठकको दृश्य — Parliament session in progress")}

<p>युवा रोजगारका लागि विशेष कार्यक्रम ल्याइने र विदेशबाट फर्केका युवाहरूलाई स्वदेशमै व्यवसाय गर्न प्रोत्साहन दिइने बजेटमा उल्लेख छ।</p>

<p>आगामी वर्ष देशभरि सडक पूर्वाधार विस्तारका लागि ठूलो रकम छुट्याइएको छ। यसले ग्रामीण क्षेत्रका बासिन्दाहरूको जीवनमा सकारात्मक परिवर्तन ल्याउने अपेक्षा गरिएको छ।</p>`,

    contentEn: `<p>Kathmandu, March 22. The Finance Minister presented a budget of over Rs 18 trillion for the upcoming fiscal year 2082/83 in parliament.</p>

<p>The budget allocates Rs 3 trillion for the agriculture sector, Rs 5 trillion for infrastructure development, and significant funds for education and health.</p>

${img(images.inline_budget, "Finance Minister presenting the annual budget in parliament")}

<p>The Finance Minister said, "Our government is committed to economic prosperity. This budget will help improve the living standards of Nepali people."</p>

<p>Opposition parties have criticized the budget as impractical. CPN-UML leader KP Sharma Oli raised serious questions about budget implementation feasibility.</p>

<p>Separate funds have been allocated for hydropower projects. The government claims work on the Budhi Gandaki Hydropower Project will now accelerate significantly.</p>

${img(images.inline_parliament, "Parliament session in progress during budget presentation")}

<p>Special programs for youth employment will be launched and returnee migrants will be encouraged to start businesses at home rather than seeking work abroad.</p>

<p>A large sum has been set aside for road infrastructure expansion across the country next year. This is expected to bring positive changes to the lives of rural residents.</p>`,

    categoryId: politics.id,
    authorId: author1.id,
    isFeatured: true,
    isBreaking: false,
    tagIds: [tagNepal.id, tagGovt.id, tagBudget.id],
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  });
  console.log("  ✓ Politics 1: Budget announcement");

  await createArticle({
    slug: "parliament-session-citizenship-bill-debate",
    coverImageUrl: images.politics2,
    coverImageFilename: "parliament-session-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "संसद् अधिवेशन सुरु, नागरिकता विधेयकमा तीव्र बहस",
    titleEn: "Parliament Session Begins, Heated Debate on Citizenship Bill",
    excerptNe:
      "प्रतिनिधिसभाको नयाँ अधिवेशन आजदेखि सुरु भएको छ। नागरिकता विधेयकमा सत्तापक्ष र प्रतिपक्षबीच तीव्र बहस हुने अपेक्षा गरिएको छ।",
    excerptEn:
      "The new session of the House of Representatives has begun today. A heated debate between the ruling party and opposition on the citizenship bill is expected.",
    contentNe: `<p>काठमाडौं । प्रतिनिधिसभाको नयाँ अधिवेशन आजदेखि सुरु भएको छ। सभामुख देवराज घिमिरेले अधिवेशनको उद्घाटन गर्नुभयो।</p>

<p>यस अधिवेशनमा लामो समयदेखि विवादित नागरिकता विधेयकमा छलफल हुने अपेक्षा गरिएको छ। विधेयकका विवादित प्रावधानहरूमा सहमति जुटाउन दलहरूबीच भित्री वार्ता भइरहेको छ।</p>

${img(images.inline_parliament, "प्रतिनिधिसभाको बैठक — House of Representatives session")}

<p>सत्तापक्षका सांसदहरूले दुवै विधेयक यही अधिवेशनमा पारित गर्ने प्रतिबद्धता जनाएका छन् भने विपक्षी दलहरूले कडा विरोध जनाउने चेतावनी दिएका छन्।</p>

<p>नागरिकता विधेयकमा वैवाहिक नागरिकता र वंशीय नागरिकताका प्रावधानहरूमा दलहरूबीच मतभेद कायम छ। महिला अधिकारकर्मीहरूले विधेयकका केही प्रावधान भेदभावपूर्ण भएको भन्दै आन्दोलन गर्ने चेतावनी दिएका छन्।</p>

${img(images.inline_election, "नागरिकता विधेयकविरुद्ध सडकमा प्रदर्शन — Protest against citizenship bill provisions")}

<p>संसदको सुरक्षा व्यवस्था कडा बनाइएको छ। संसद् भवन परिसरमा आज विशेष सुरक्षा तैनाथ गरिएको प्रहरीले जनाएको छ।</p>

<p>सभामुखले सबै दलका नेताहरूलाई संसदीय परम्परा र मर्यादाको पालना गर्दै बहसमा भाग लिन आग्रह गर्नुभएको छ।</p>`,

    contentEn: `<p>Kathmandu. The new session of the House of Representatives has begun today. Speaker Devraj Ghimire inaugurated the session.</p>

<p>The long-disputed citizenship bill is expected to be discussed in this session. Parties are in behind-the-scenes talks to build consensus on controversial provisions of the bill.</p>

${img(images.inline_parliament, "House of Representatives in session — lawmakers debate key legislation")}

<p>Ruling party MPs have pledged to pass both bills in this session while opposition parties have warned of strong resistance and potential disruption.</p>

<p>Disagreements between parties persist on marital citizenship and ancestral citizenship provisions. Women rights activists have warned of protests saying some provisions of the bill are discriminatory.</p>

${img(images.inline_election, "Citizens rally outside parliament demanding fair citizenship provisions")}

<p>Security arrangements around parliament have been tightened. Police have announced special security deployment in the parliament building premises today.</p>

<p>The Speaker has requested leaders of all parties to participate in the debate while following parliamentary traditions and dignity.</p>`,

    categoryId: politics.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: true,
    tagIds: [tagNepal.id, tagGovt.id, tagBreaking.id],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  });
  console.log("  ✓ Politics 2: Parliament citizenship bill");

  await createArticle({
    slug: "local-election-preparations-nepal-2082",
    coverImageUrl: images.politics3,
    coverImageFilename: "election-preparations-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "स्थानीय निर्वाचनको तयारी सुरु, मतदाता नामावली अद्यावधिक अभियान जारी",
    titleEn:
      "Local Election Preparations Begin, Voter List Update Campaign Underway",
    excerptNe:
      "आगामी स्थानीय तहको निर्वाचनका लागि निर्वाचन आयोगले तयारी सुरु गरेको छ। देशभरि मतदाता नामावली अद्यावधिक गर्ने काम अघि बढेको छ।",
    excerptEn:
      "The Election Commission has begun preparations for the upcoming local level elections. Voter list update work has progressed across the country.",
    contentNe: `<p>काठमाडौं । निर्वाचन आयोगले आगामी स्थानीय तहको निर्वाचनका लागि तयारी सुरु गरेको छ।</p>

<p>मतदाता नामावली अद्यावधिक गर्ने अभियान देशभरि सञ्चालन भइरहेको छ। आयोगका अनुसार यस पटक अनलाइन दर्ता प्रणाली थप सहज बनाइएको छ।</p>

${img(images.inline_election, "मतदाता नामावली अद्यावधिक गर्दै कर्मचारीहरू — Election officials updating voter lists")}

<p>निर्वाचन आयोगका प्रमुख आयुक्तले भने, "हामी स्वतन्त्र, निष्पक्ष र शान्तिपूर्ण निर्वाचन सञ्चालन गर्न प्रतिबद्ध छौं।"</p>

<p>राजनीतिक दलहरूले उम्मेदवार छनोटको प्रक्रिया सुरु गरिसकेका छन्। युवा उम्मेदवारहरूलाई प्राथमिकता दिने घोषणा धेरै दलहरूले गरेका छन्।</p>

${img(images.inline_parliament, "राजनीतिक दलहरूको बैठक — Political parties meeting on election strategy")}

<p>निर्वाचन सुरक्षाका लागि सुरक्षा निकायहरूले विशेष योजना तयार गरिरहेका छन्। देशभरि शान्तिपूर्ण वातावरणमा निर्वाचन सम्पन्न गराउने लक्ष्य राखिएको छ।</p>

<p>पहिलो पटक मतदान गर्ने मतदाताहरूलाई प्रक्रियाबारे जानकारी दिन विशेष शिक्षाका कार्यक्रम सञ्चालन गरिने आयोगले जनाएको छ।</p>`,

    contentEn: `<p>Kathmandu. The Election Commission has begun preparations for the upcoming local level elections.</p>

<p>A voter list update campaign is being conducted nationwide. The commission says the online registration system has been made more convenient this time.</p>

${img(images.inline_election, "Election officials updating voter registration lists across the country")}

<p>The Chief Election Commissioner said, "We are committed to conducting free, fair and peaceful elections."</p>

<p>Political parties have already started the process of candidate selection. Many parties have announced giving priority to young candidates for local positions.</p>

${img(images.inline_parliament, "Political parties meeting to finalize their election strategies")}

<p>Security agencies are preparing special plans for election security. The goal is to complete elections in a peaceful environment across the country.</p>

<p>Special awareness programs will be conducted to inform first-time voters about the voting process and their civic responsibilities.</p>`,

    categoryId: politics.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagGovt.id],
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  });
  console.log("  ✓ Politics 3: Local election preparations");

  await createArticle({
    slug: "nepal-india-trade-agreement-signed",
    coverImageUrl: images.politics4,
    coverImageFilename: "nepal-india-agreement-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपाल–भारतबीच व्यापार सम्झौतामा हस्ताक्षर, निर्यातमा सहजीकरण",
    titleEn: "Nepal-India Trade Agreement Signed, Export Facilitation Improved",
    excerptNe:
      "नेपाल र भारतबीच व्यापार सहजीकरणसम्बन्धी महत्वपूर्ण सम्झौतामा हस्ताक्षर भएको छ। यसले नेपाली उत्पादनको भारतीय बजारमा पहुँच बढाउनेछ।",
    excerptEn:
      "Nepal and India have signed an important trade facilitation agreement. This will increase access of Nepali products to the Indian market.",
    contentNe: `<p>काठमाडौं । नेपाल र भारतबीच व्यापार र पारवहन सहजीकरणसम्बन्धी महत्वपूर्ण सम्झौतामा हस्ताक्षर भएको छ।</p>

<p>परराष्ट्र मन्त्रालयका अनुसार यो सम्झौताले नेपाली उत्पादनहरूको भारतीय बजारमा पहुँच सहज बनाउनेछ।</p>

${img(images.inline_diplomacy, "नेपाल–भारत व्यापार सम्झौतामा हस्ताक्षर समारोह — Nepal-India trade agreement signing ceremony")}

<p>प्रधानमन्त्रीले भने, "यो सम्झौता नेपालको आर्थिक विकासका लागि महत्वपूर्ण कदम हो। दुवै देशका व्यापारीहरूले यसको फाइदा उठाउन सक्नेछन्।"</p>

<p>सम्झौताअनुसार नेपाली वस्तुहरूको भन्सार शुल्कमा उल्लेख्य कमी आउनेछ र पारवहन प्रक्रिया सरलीकरण हुनेछ।</p>

${img(images.inline_market, "नेपाली उत्पादनहरू भारतीय बजारमा — Nepali products in Indian market")}

<p>व्यवसायी समुदायले यो सम्झौतालाई स्वागत गरेको छ। नेपाल उद्योग वाणिज्य महासंघका अध्यक्षले यसलाई ऐतिहासिक कदम भनेका छन्।</p>

<p>यो सम्झौता कार्यान्वयनमा आएपछि नेपालको व्यापार घाटा कम हुन मद्दत पुग्ने विज्ञहरूको अपेक्षा छ।</p>`,

    contentEn: `<p>Kathmandu. Nepal and India have signed an important agreement on trade and transit facilitation.</p>

<p>According to the Ministry of Foreign Affairs, this agreement will make it easier for Nepali products to access the Indian market.</p>

${img(images.inline_diplomacy, "Nepal-India trade agreement signing ceremony attended by senior officials")}

<p>The Prime Minister said, "This agreement is an important step for Nepal's economic development. Traders from both countries will be able to benefit from this."</p>

<p>Under the agreement, customs duties on Nepali goods will be significantly reduced and transit procedures will be simplified to reduce delays.</p>

${img(images.inline_market, "Nepali products displayed at an Indian trade fair showcasing bilateral commerce")}

<p>The business community has welcomed this agreement. The President of the Federation of Nepalese Chambers of Commerce and Industry called it a historic step.</p>

<p>Experts expect this agreement will help reduce Nepal's trade deficit once it comes into implementation next quarter.</p>`,

    categoryId: politics.id,
    authorId: author1.id,
    isFeatured: true,
    isBreaking: false,
    tagIds: [tagNepal.id, tagGovt.id],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  });
  console.log("  ✓ Politics 4: Nepal-India trade agreement");

  // ─────────────────────────────────────────
  // SPORTS — 4 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepal-cricket-defeats-uae-t20-2082",
    coverImageUrl: images.sports1,
    coverImageFilename: "nepal-cricket-uae-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपाली क्रिकेट टिमले युएईलाई हरायो, रोहितको ५६ रनको शानदार पारी",
    titleEn: "Nepal Cricket Team Defeats UAE, Rohit Paudel Scores Brilliant 56",
    excerptNe:
      "नेपाली राष्ट्रिय क्रिकेट टिमले युएईविरुद्धको टी-२० खेलमा ७ विकेटले जित हासिल गर्यो। रोहित पौडेलको शानदार पारीले नेपाललाई जिताउन मद्दत गर्यो।",
    excerptEn:
      "The Nepal national cricket team achieved a 7-wicket victory against UAE in the T20 match. Rohit Paudel's brilliant innings helped Nepal win.",
    contentNe: `<p>दुबई । नेपाली राष्ट्रिय क्रिकेट टिमले युएईविरुद्धको टी-२० खेलमा ७ विकेटले जित हासिल गरेको छ।</p>

<p>युएईले पहिले ब्याटिङ गर्दै २० ओभरमा ७ विकेटमा १४५ रन बनायो। नेपालले १७ ओभर ३ बलमा ३ विकेट गुमाएर लक्ष्य हासिल गर्यो।</p>

${img(images.inline_cricket1, "रोहित पौडेलले ब्याटिङ गर्दै — Captain Rohit Paudel batting during the T20 match")}

<p>कप्तान रोहित पौडेलले ४२ बलमा ५६ रनको शानदार पारी खेले। उनले ४ चौका र ३ छक्का हाने। यो उनको अन्तर्राष्ट्रिय क्रिकेटमा सर्वोत्तम प्रदर्शनमध्ये एक हो।</p>

<p>कुशल मल्लले ३० रन र दीपेन्द्र सिंह ऐरीले महत्वपूर्ण ब्याटिङ गरे। गेन्दबाजीमा सन्दीप लामिछानेले २४ रनमा ३ विकेट लिए।</p>

${img(images.inline_cricket2, "सन्दीप लामिछानेले विकेट लिएपछि टोलीको उत्सव — Team celebrates Sandeep Lamichhane wicket")}

<p>"यो जित हाम्रो टोलीको कडा मेहनतको नतिजा हो। हामी आगामी खेलहरूमा पनि यसरी नै खेल्ने छौं," कप्तान पौडेलले म्याच पछि भने।</p>

<p>यो जितले नेपाल अन्तर्राष्ट्रिय क्रिकेटमा आफ्नो स्थान सुदृढ गर्न सफल भएको छ। अर्को खेल आउँदो शनिबार हुनेछ।</p>`,

    contentEn: `<p>Dubai. The Nepal national cricket team has achieved a 7-wicket victory against UAE in the T20 match.</p>

<p>UAE batted first and scored 145 runs for 7 wickets in 20 overs. Nepal achieved the target losing only 3 wickets in 17.3 overs.</p>

${img(images.inline_cricket1, "Captain Rohit Paudel plays an attacking shot during the dominant chase")}

<p>Captain Rohit Paudel played a brilliant innings of 56 runs off 42 balls, hitting 4 fours and 3 sixes. This is one of his best performances in international cricket.</p>

<p>Kushal Malla scored 30 runs and Dipendra Singh Airee played an important knock. In bowling, Sandeep Lamichhane took 3 wickets for just 24 runs.</p>

${img(images.inline_cricket2, "Nepal players celebrate after Sandeep Lamichhane takes a crucial wicket")}

<p>"This victory is the result of our team's hard work. We will continue to play like this in upcoming matches," Captain Paudel said after the match.</p>

<p>This win has helped Nepal consolidate its position in international cricket. The next match is scheduled for this Saturday.</p>`,

    categoryId: sports.id,
    authorId: author2.id,
    isFeatured: true,
    isBreaking: false,
    tagIds: [tagCricket.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  });
  console.log("  ✓ Sports 1: Cricket vs UAE");

  await createArticle({
    slug: "saff-championship-nepal-football-camp-2082",
    coverImageUrl: images.sports2,
    coverImageFilename: "nepal-football-saff-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "साफ च्याम्पियनसिपको तयारी तीव्र, नेपाली फुटबल टोलीको क्याम्प दशरथमा सुरु",
    titleEn:
      "SAFF Championship Preparation Intensifies, Nepal Football Camp Begins at Dashrath",
    excerptNe:
      "आगामी साफ च्याम्पियनसिपका लागि नेपाली फुटबल टोलीको प्रशिक्षण शिविर दशरथ रङ्गशालामा सुरु भएको छ। ३० खेलाडी छनोट गरिएका छन्।",
    excerptEn:
      "The Nepal football team training camp for the upcoming SAFF Championship has begun at Dashrath Stadium with 30 players selected.",
    contentNe: `<p>काठमाडौं । आगामी साफ च्याम्पियनसिपका लागि नेपाली राष्ट्रिय फुटबल टोलीको प्रशिक्षण शिविर दशरथ रङ्गशालामा आजदेखि सुरु भएको छ।</p>

<p>प्रशिक्षक विनोद थापाले ३० जना खेलाडी छनोट गरेका छन् जसमा केही नयाँ अनुहार पनि छन्।</p>

${img(images.inline_football, "दशरथ रङ्गशालामा नेपाली फुटबल टोलीको अभ्यास — Nepal football team training at Dashrath Stadium")}

<p>यस पटकको साफ च्याम्पियनसिप भारतमा हुने भएकोले नेपालका लागि यो एक महत्वपूर्ण अवसर हो। गत संस्करणमा नेपाल सेमिफाइनलसम्म पुगेको थियो।</p>

<p>"हाम्रो लक्ष्य फाइनलमा पुग्नु हो। खेलाडीहरू पूरा उत्साहमा छन् र राम्रो प्रदर्शन गर्ने आशा छ," प्रशिक्षक थापाले भने।</p>

${img(images.sports2, "नेपाली फुटबलका उदाउँदा खेलाडीहरू — Rising stars of Nepal football")}

<p>छनोट भएका खेलाडीहरूमा विदेशी लिगमा खेल्ने अनुभवी खेलाडीहरू पनि छन्। अन्तर्राष्ट्रिय प्रतियोगितामा नेपालको प्रदर्शन हालका वर्षहरूमा उल्लेख्य रूपमा सुधार भएको छ।</p>

<p>प्रशिक्षण शिविर ३ हप्ता चल्नेछ र त्यसपछि मैत्री खेलहरू खेलेर साफका लागि तयार हुइनेछ।</p>`,

    contentEn: `<p>Kathmandu. The Nepal national football team training camp for the upcoming SAFF Championship has begun at Dashrath Stadium today.</p>

<p>Coach Vinod Thapa has selected 30 players including some new and exciting faces in the squad.</p>

${img(images.inline_football, "Nepal football team training session at Dashrath Rangasala stadium")}

<p>Since this SAFF Championship will be held in India, this is an important opportunity for Nepal. The team reached the semi-finals in the last edition.</p>

<p>"Our goal is to reach the final. The players are fully enthusiastic and we hope to perform well," Coach Thapa said at the opening day press conference.</p>

${img(images.sports2, "Rising stars of Nepal football who have been selected for the squad")}

<p>Among the selected players are experienced ones who play in foreign leagues. Nepal's performance in international competitions has improved remarkably in recent years.</p>

<p>The training camp will run for 3 weeks followed by friendly matches to prepare for the SAFF Championship.</p>`,

    categoryId: sports.id,
    authorId: author2.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagFootball.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  });
  console.log("  ✓ Sports 2: SAFF football camp");

  await createArticle({
    slug: "kathmandu-marathon-national-record-broken",
    coverImageUrl: images.sports3,
    coverImageFilename: "kathmandu-marathon-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "काठमाडौं म्याराथनमा राष्ट्रिय रेकर्ड, युवा धाविकाको ऐतिहासिक उपलब्धि",
    titleEn:
      "National Record Broken at Kathmandu Marathon, Historic Achievement by Young Athlete",
    excerptNe:
      "काठमाडौं म्याराथनमा २३ वर्षीया धाविका रेखा पुनले राष्ट्रिय रेकर्ड तोड्दै इतिहास रचेकी छिन्। उनले पूर्ण म्याराथन दूरी २ घण्टा ४५ मिनेटमा पार गरिन्।",
    excerptEn:
      "23-year-old runner Rekha Pun made history by breaking the national record at the Kathmandu Marathon, completing the full marathon in 2 hours 45 minutes.",
    contentNe: `<p>काठमाडौं । काठमाडौं म्याराथनमा २३ वर्षीया धाविका रेखा पुनले राष्ट्रिय रेकर्ड तोड्दै इतिहास रचेकी छिन्।</p>

<p>उनले पूर्ण म्याराथन दूरी (४२.१९५ किलोमिटर) जम्मा २ घण्टा ४५ मिनेट ३२ सेकेन्डमा पार गरिन् जुन अघिल्लो राष्ट्रिय रेकर्डभन्दा ८ मिनेट कम हो।</p>

${img(images.inline_marathon, "रेखा पुन म्याराथनको फिनिस लाइन पार गर्दै — Rekha Pun crossing the finish line at Kathmandu Marathon")}

<p>"मैले यो सपना देखेकी थिएँ। आज त्यो सपना पूरा भयो। नेपालका लागि यो उपलब्धि हासिल गर्न पाउँदा अत्यन्त खुसी लागेको छ," रेखाले भनिन्।</p>

<p>खेलकुद मन्त्री र राष्ट्रिय खेलकुद परिषद्का पदाधिकारीहरूले उनलाई बधाई दिएका छन्। उनलाई विशेष पुरस्कार दिने घोषणा पनि भएको छ।</p>

${img(images.sports3, "म्याराथन सकिएपछि रेखा पुनलाई बधाई दिँदै — Rekha Pun receiving congratulations after her record run")}

<p>रेखाले आगामी एसियाली खेलकुदमा पनि नेपालको प्रतिनिधित्व गर्ने तयारी गरिरहेकी छिन्। उनको यो उपलब्धिले नेपाली युवा एथलेटहरूलाई प्रेरणा दिनेछ।</p>

<p>यस म्याराथनमा देशविदेशका ५ हजारभन्दा बढी धाविकाहरूले भाग लिएका थिए।</p>`,

    contentEn: `<p>Kathmandu. 23-year-old runner Rekha Pun made history at the Kathmandu Marathon by breaking the national record.</p>

<p>She completed the full marathon distance (42.195 km) in just 2 hours 45 minutes 32 seconds, which is 8 minutes less than the previous national record.</p>

${img(images.inline_marathon, "Rekha Pun crosses the finish line at the Kathmandu Marathon setting a new national record")}

<p>"I had dreamed of this. Today that dream came true. I am extremely happy to achieve this milestone for Nepal," Rekha said after crossing the line.</p>

<p>The Sports Minister and National Sports Council officials congratulated her. A special award has also been announced in her honour.</p>

${img(images.sports3, "Rekha Pun receives congratulations from coaches and officials after her historic run")}

<p>Rekha is also preparing to represent Nepal at the upcoming Asian Games. Her achievement will inspire young Nepali athletes to push their limits.</p>

<p>More than 5,000 runners from Nepal and abroad participated in this marathon edition held in the Kathmandu valley.</p>`,

    categoryId: sports.id,
    authorId: author2.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagKtm.id],
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  });
  console.log("  ✓ Sports 3: Marathon record");

  await createArticle({
    slug: "nepal-chess-olympiad-team-selected",
    coverImageUrl: images.sports4,
    coverImageFilename: "nepal-chess-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "शतरञ्ज ओलम्पियाडका लागि नेपाली टोली घोषणा, पहिलो पटक महिला टोली पनि",
    titleEn:
      "Nepal Team Announced for Chess Olympiad, Women's Team Included for First Time",
    excerptNe:
      "आगामी शतरञ्ज ओलम्पियाडका लागि नेपाली टोलीको घोषणा गरिएको छ। यस पटक पहिलो पटक पूर्ण महिला टोली पनि पठाइनेछ।",
    excerptEn:
      "The Nepali team for the upcoming Chess Olympiad has been announced. For the first time, a full women's team will also be sent.",
    contentNe: `<p>काठमाडौं । आगामी शतरञ्ज ओलम्पियाडका लागि नेपाली टोलीको घोषणा गरिएको छ।</p>

<p>नेपाल शतरञ्ज संघका अध्यक्षले बताए अनुसार यस पटक पहिलो पटक पूर्ण महिला टोली पनि पठाइनेछ जुन नेपाली शतरञ्जको इतिहासमा एक महत्वपूर्ण कदम हो।</p>

${img(images.sports4, "नेपाली शतरञ्ज खेलाडीहरू अभ्यासमा — Nepali chess players during practice session")}

<p>पुरुष टोलीमा अनुभवी खेलाडीहरू र केही उदाउँदा प्रतिभाहरू छन्। टोलीका कप्तान दिपक लामाले यस पटक पदक जित्ने आशा व्यक्त गरेका छन्।</p>

${img(images.inline_marathon, "शतरञ्ज खेलको तयारीमा जुटेका नेपाली खेलाडीहरू — Nepal players preparing intensively for the Olympiad")}

<p>"यस पटक हाम्रो टोली पहिलेभन्दा बलियो छ। हामीले धेरै मेहनत गरेका छौं र राम्रो नतिजाको आशा छ," कप्तान लामाले भने।</p>

<p>नेपाल शतरञ्ज संघले खेलाडीहरूको तयारीका लागि विशेष प्रशिक्षण शिविर आयोजना गरेको छ।</p>`,

    contentEn: `<p>Kathmandu. The Nepali team for the upcoming Chess Olympiad has been announced by the Nepal Chess Association.</p>

<p>According to the Chess Association president, for the first time a full women's team will also be sent, which is an important milestone in the history of Nepali chess.</p>

${img(images.sports4, "Nepali chess players during an intensive training session ahead of the Olympiad")}

<p>The men's team includes experienced players and some emerging talents. Team captain Deepak Lama expressed hope of winning medals this time.</p>

${img(images.inline_marathon, "Nepal players studying match strategies as they prepare for international competition")}

<p>"Our team is stronger than before this time. We have worked very hard and hope for good results," Captain Lama said at the announcement ceremony.</p>

<p>The Nepal Chess Association has organized a special training camp to prepare the players for the high-level international competition.</p>`,

    categoryId: sports.id,
    authorId: author2.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id],
    publishedAt: new Date(Date.now() - 14 * 60 * 60 * 1000),
  });
  console.log("  ✓ Sports 4: Chess olympiad team");

  // ─────────────────────────────────────────
  // TECHNOLOGY — 3 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepal-fintech-startup-raises-50-million",
    coverImageUrl: images.tech1,
    coverImageFilename: "fintech-startup-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपाली फिनटेक स्टार्टअपले ५ करोड रुपैयाँ लगानी जुटाउन सफल",
    titleEn:
      "Nepali Fintech Startup Successfully Raises Rs 50 Million in Series A Funding",
    excerptNe:
      "काठमाडौं स्थित फिनटेक कम्पनी पेसेवाले आफ्नो सिरिज-ए फण्डिङमा ५ करोड रुपैयाँ जुटाउन सफल भएको छ। यो नेपालको स्टार्टअप क्षेत्रको लागि ठूलो उपलब्धि हो।",
    excerptEn:
      "Kathmandu-based fintech company PaySewa has successfully raised Rs 50 million in Series A funding, marking a major achievement for Nepal's startup sector.",
    contentNe: `<p>काठमाडौं । काठमाडौंमा स्थापित फिनटेक स्टार्टअप पेसेवाले सिरिज-ए फण्डिङ राउन्डमा ५ करोड रुपैयाँ जुटाउन सफल भएको छ।</p>

<p>यो लगानी स्थानीय र अन्तर्राष्ट्रिय लगानीकर्ताहरूबाट प्राप्त भएको हो। कम्पनीका संस्थापक र सीईओ आयुष श्रेष्ठले यो लगानी नेपालको फिनटेक क्षेत्रको लागि ऐतिहासिक भएको बताए।</p>

${img(images.inline_tech_office, "पेसेवाको काठमाडौं कार्यालय — PaySewa headquarters in Kathmandu")}

<p>"हामीले यो पैसाको प्रयोग प्रणाली विस्तार र नयाँ सेवाहरू ल्याउनका लागि गर्नेछौं। हाम्रो लक्ष्य नेपालका ग्रामीण क्षेत्रहरूमा पनि डिजिटल वित्तीय सेवा पुर्‍याउनु हो," सीईओले भने।</p>

<p>पेसेवाले हाल काठमाडौं उपत्यकामा ५ लाखभन्दा बढी प्रयोगकर्ताहरूलाई सेवा दिइरहेको छ। कम्पनीले आगामी वर्ष देशव्यापी विस्तार गर्ने योजना बनाएको छ।</p>

${img(images.inline_mobile, "पेसेवा मोबाइल एप — PaySewa mobile application interface")}

<p>नेपालको स्टार्टअप इकोसिस्टम दिनानुदिन बलियो भइरहेको छ। यो वर्ष मात्रै ३ वटा नेपाली स्टार्टअपले महत्वपूर्ण विदेशी लगानी आकर्षित गर्न सफल भएका छन्।</p>

<p>सरकारले पनि डिजिटल अर्थतन्त्र प्रवर्द्धनका लागि विशेष नीति ल्याउने तयारी गरिरहेको छ।</p>`,

    contentEn: `<p>Kathmandu. Kathmandu-based fintech startup PaySewa has successfully raised Rs 50 million in a Series A funding round.</p>

<p>The investment came from local and international investors. The company's founder and CEO Aayush Shrestha said this investment is historic for Nepal's fintech sector.</p>

${img(images.inline_tech_office, "PaySewa headquarters office in Kathmandu where the growing team is based")}

<p>"We will use this money to expand our systems and bring new services. Our goal is to bring digital financial services to rural areas of Nepal as well," the CEO said.</p>

<p>PaySewa is currently serving more than 500,000 users in the Kathmandu valley. The company plans to expand nationwide in the coming year.</p>

${img(images.inline_mobile, "PaySewa mobile app interface showing their digital payment features")}

<p>Nepal's startup ecosystem is growing stronger day by day. This year alone, 3 Nepali startups have successfully attracted significant foreign investment.</p>

<p>The government is also preparing to bring special policies to promote the digital economy and support emerging startups.</p>`,

    categoryId: technology.id,
    authorId: author3.id,
    isFeatured: true,
    isBreaking: false,
    tagIds: [tagStartup.id, tagFintech.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  });
  console.log("  ✓ Technology 1: Fintech startup funding");

  await createArticle({
    slug: "nepal-broadband-expansion-rural-areas",
    coverImageUrl: images.tech2,
    coverImageFilename: "broadband-rural-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "सरकारले ग्रामीण क्षेत्रमा ब्रोडब्यान्ड विस्तार गर्ने, ५ हजार गाउँमा इन्टरनेट",
    titleEn:
      "Government to Expand Broadband to Rural Areas, Internet for 5,000 Villages",
    excerptNe:
      "सरकारले आगामी २ वर्षभित्र ५ हजार ग्रामीण गाउँहरूमा ब्रोडब्यान्ड इन्टरनेट पुर्‍याउने महत्वाकांक्षी योजना सार्वजनिक गरेको छ।",
    excerptEn:
      "The government has announced an ambitious plan to bring broadband internet to 5,000 rural villages within the next 2 years.",
    contentNe: `<p>काठमाडौं । सरकारले आगामी २ वर्षभित्र ५ हजार ग्रामीण गाउँहरूमा ब्रोडब्यान्ड इन्टरनेट पुर्‍याउने महत्वाकांक्षी योजना सार्वजनिक गरेको छ।</p>

<p>सञ्चार तथा सूचना प्रविधि मन्त्रालयले यो योजनाको लागि ३ अर्ब रुपैयाँको बजेट छुट्याएको छ। यो कार्यक्रम सरकारको डिजिटल नेपाल अभियानको हिस्सा हो।</p>

${img(images.inline_coding, "ग्रामीण क्षेत्रमा इन्टरनेट सेवा — Internet connectivity reaching rural Nepal")}

<p>मन्त्रीले भने, "डिजिटल विभाजन घटाउनु हाम्रो प्राथमिकता हो। इन्टरनेट अहिले आधारभूत आवश्यकता बनिसकेको छ।"</p>

<p>यो योजनाले विशेष गरी पहाडी र दुर्गम क्षेत्रका विद्यार्थीहरूलाई अनलाइन शिक्षामा पहुँच दिनेछ।</p>

${img(images.tech2, "प्रविधि क्षेत्रमा काम गर्दै युवा उद्यमीहरू — Young entrepreneurs working in Nepal's growing tech sector")}

<p>टेलिकम कम्पनीहरूले पनि सरकारको यो योजनामा सहकार्य गर्न तयार भएका छन्। फाइबर अप्टिक्स र स्याटेलाइट इन्टरनेटको संयोजनबाट यो लक्ष्य हासिल गर्ने योजना छ।</p>`,

    contentEn: `<p>Kathmandu. The government has announced an ambitious plan to bring broadband internet to 5,000 rural villages within the next 2 years.</p>

<p>The Ministry of Communication and Information Technology has allocated a budget of Rs 3 billion for this plan. This program is part of the government's Digital Nepal campaign.</p>

${img(images.inline_coding, "Internet connectivity infrastructure being expanded to reach rural Nepal")}

<p>The Minister said, "Reducing the digital divide is our priority. Internet has now become a basic necessity for education and economic opportunity."</p>

<p>This plan will particularly provide access to online education for students in hilly and remote areas who currently have no connectivity.</p>

${img(images.tech2, "Young entrepreneurs thriving in Nepal's growing technology and startup sector")}

<p>Telecom companies have also agreed to cooperate with the government's plan. A combination of fiber optics and satellite internet will be used to achieve this ambitious target.</p>`,

    categoryId: technology.id,
    authorId: author3.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagEducation.id],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  });
  console.log("  ✓ Technology 2: Rural broadband expansion");

  await createArticle({
    slug: "nepal-ai-education-program-launch",
    coverImageUrl: images.tech3,
    coverImageFilename: "ai-education-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "विद्यालयहरूमा आर्टिफिसियल इन्टेलिजेन्स पाठ्यक्रम, नेपाल दक्षिण एसियामा अग्रणी",
    titleEn:
      "Artificial Intelligence Curriculum in Schools, Nepal Leads in South Asia",
    excerptNe:
      "नेपालले माध्यमिक विद्यालयहरूमा आर्टिफिसियल इन्टेलिजेन्स पाठ्यक्रम लागू गर्ने घोषणा गरेको छ। यो कदमले नेपाललाई दक्षिण एसियामा अग्रणी बनाउनेछ।",
    excerptEn:
      "Nepal has announced the implementation of an Artificial Intelligence curriculum in secondary schools, making it a leader in South Asia for tech education.",
    contentNe: `<p>काठमाडौं । शिक्षा मन्त्रालयले माध्यमिक विद्यालयहरूमा आर्टिफिसियल इन्टेलिजेन्स (AI) पाठ्यक्रम लागू गर्ने घोषणा गरेको छ।</p>

<p>यो कार्यक्रम आगामी शैक्षिक वर्षदेखि पाइलट आधारमा काठमाडौं उपत्यकाका १०० विद्यालयमा सुरु हुनेछ।</p>

${img(images.inline_coding, "विद्यार्थीहरू कम्प्युटर विज्ञान अध्ययन गर्दै — Students learning computer science and AI basics")}

<p>शिक्षा मन्त्रीले भने, "भविष्यको दुनियाँ प्रविधिको हो। हाम्रा विद्यार्थीहरूलाई यसका लागि तयार पार्नु हाम्रो दायित्व हो।"</p>

<p>यो पाठ्यक्रममा AI का आधारभूत अवधारणाहरू, मेसिन लर्निङ, र डेटा विश्लेषणका विषयहरू समावेश हुनेछन्।</p>

${img(images.tech3, "प्रविधि कक्षामा अध्ययनरत नेपाली विद्यार्थीहरू — Nepali students engaged in technology classroom learning")}

<p>दक्षिण एसियाका अन्य देशहरूमा अझ यस्तो कार्यक्रम सुरु भएको छैन। त्यसैले यो कदमले नेपाललाई क्षेत्रमा अग्रणी बनाउनेछ।</p>

<p>शिक्षकहरूलाई यो नयाँ पाठ्यक्रम पढाउन तयार पार्न विशेष तालिम कार्यक्रम सञ्चालन गरिनेछ।</p>`,

    contentEn: `<p>Kathmandu. The Ministry of Education has announced the implementation of an Artificial Intelligence (AI) curriculum in secondary schools starting next year.</p>

<p>This program will begin on a pilot basis in 100 schools in the Kathmandu valley from the next academic year before expanding nationwide.</p>

${img(images.inline_coding, "Students learning computer science fundamentals and AI concepts in their classroom")}

<p>The Education Minister said, "The world of the future belongs to technology. It is our responsibility to prepare our students for it."</p>

<p>This curriculum will include basic concepts of AI, machine learning, and data analysis topics appropriate for secondary school students.</p>

${img(images.tech3, "Nepali students engaged in hands-on technology learning in a modern classroom")}

<p>Other countries in South Asia have not yet started such a program. Therefore, this step will make Nepal a leader in the region for technology education.</p>

<p>Special training programs will be conducted to prepare teachers to teach this new curriculum effectively in their classrooms.</p>`,

    categoryId: technology.id,
    authorId: author3.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagEducation.id, tagNepal.id, tagStartup.id],
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  });
  console.log("  ✓ Technology 3: AI education curriculum");

  // ─────────────────────────────────────────
  // ECONOMY — 3 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepse-index-record-high-bull-market",
    coverImageUrl: images.economy1,
    coverImageFilename: "nepse-record-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेप्सेले नयाँ रेकर्ड बनायो, शेयर बजार ३ हजार बिन्दुमाथि",
    titleEn: "NEPSE Sets New Record, Stock Market Crosses 3000 Points",
    excerptNe:
      "नेपाल शेयर बजार (नेप्से) ले नयाँ उचाइ छुँदै ३ हजार बिन्दु पार गरेको छ। लगानीकर्ताहरूमा उत्साह देखिएको छ।",
    excerptEn:
      "Nepal Stock Exchange (NEPSE) has touched a new high, crossing 3,000 points. Investors are showing enthusiasm in the bull market.",
    contentNe: `<p>काठमाडौं । नेपाल शेयर बजार (नेप्से) ले आज नयाँ उचाइ छुँदै ३ हजार बिन्दु पार गरेको छ। यो नेप्सेको इतिहासमा पहिलो पटक भएको हो।</p>

<p>आजको कारोबारमा नेप्से सूचकाङ्क ४५ बिन्दुले बढेर ३०२३ मा पुगेको छ। यस क्रममा कुल कारोबार रकम ८ अर्ब रुपैयाँभन्दा बढी रहेको छ।</p>

${img(images.inline_market, "नेप्से कारोबार कक्षमा व्यस्त लगानीकर्ताहरू — Investors busy at NEPSE trading floor")}

<p>बैंकिङ, जलविद्युत् र बिमा क्षेत्रका शेयरहरू सबैभन्दा बढी बढेका छन्। विश्लेषकहरूले यो वृद्धि दिगो रहने अपेक्षा गरेका छन्।</p>

<p>"नेपालको अर्थतन्त्र सकारात्मक दिशामा गइरहेको छ। विदेशी लगानी पनि बढिरहेको छ जसले बजारलाई थप बल दिएको छ," एक वरिष्ठ विश्लेषकले भने।</p>

${img(images.inline_gold, "सुन र शेयर बजारमा लगानी — Investment trends in gold and stock market")}

<p>नयाँ लगानीकर्ताहरूको संख्या पनि बढिरहेको छ। यस वर्ष मात्रै २ लाख नयाँ डिम्याट खाता खोलिएका छन्।</p>

<p>तर बजार विश्लेषकहरूले लगानीकर्ताहरूलाई सतर्कतासाथ लगानी गर्न सुझाव दिएका छन्।</p>`,

    contentEn: `<p>Kathmandu. Nepal Stock Exchange (NEPSE) has touched a new high today, crossing 3,000 points for the first time in its history.</p>

<p>In today's trading, the NEPSE index rose 45 points to reach 3,023. Total trading volume exceeded Rs 8 billion during the session.</p>

${img(images.inline_market, "Investors busy at the NEPSE trading floor as the market hits new records")}

<p>Shares in banking, hydropower and insurance sectors rose the most. Analysts expect this growth to be sustainable given improving economic fundamentals.</p>

<p>"Nepal's economy is moving in a positive direction. Foreign investment is also increasing which has given additional strength to the market," a senior analyst said.</p>

${img(images.inline_gold, "Trends in gold and stock market investment as Nepali investors diversify portfolios")}

<p>The number of new investors is also increasing. This year alone, 200,000 new demat accounts have been opened by first-time investors.</p>

<p>However, market analysts have advised investors to invest cautiously and not to follow herd mentality during the current bull run.</p>`,

    categoryId: economy.id,
    authorId: author4.id,
    isFeatured: true,
    isBreaking: true,
    tagIds: [tagNepal.id, tagBreaking.id],
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  });
  console.log("  ✓ Economy 1: NEPSE record high");

  await createArticle({
    slug: "nepal-remittance-record-2082",
    coverImageUrl: images.economy2,
    coverImageFilename: "remittance-record-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "रेमिट्यान्स रेकर्ड उचाइमा, विप्रेषण १२ खर्ब रुपैयाँ नाघ्यो",
    titleEn: "Remittance Reaches Record High, Crosses Rs 12 Trillion",
    excerptNe:
      "नेपालमा आउने विप्रेषण (रेमिट्यान्स) रकम रेकर्ड उचाइमा पुगेको छ। यस आर्थिक वर्षमा १२ खर्ब रुपैयाँभन्दा बढी रेमिट्यान्स भित्रिएको तथ्याङ्क सार्वजनिक भएको छ।",
    excerptEn:
      "Remittances coming to Nepal have reached a record high. Data released shows more than Rs 12 trillion in remittances received this fiscal year.",
    contentNe: `<p>काठमाडौं । नेपाल राष्ट्र बैंकले सार्वजनिक गरेको तथ्याङ्क अनुसार यस आर्थिक वर्षमा नेपालमा भित्रिएको विप्रेषण (रेमिट्यान्स) रकम १२ खर्ब रुपैयाँ नाघेको छ।</p>

<p>यो अघिल्लो वर्षको तुलनामा १५ प्रतिशत बढी हो। मलेसिया, खाडी मुलुकहरू र दक्षिण कोरियाबाट सबैभन्दा बढी रेमिट्यान्स आएको छ।</p>

${img(images.inline_bank, "बैंकमा रेमिट्यान्स लिन आएका नागरिकहरू — Citizens collecting remittances at a bank branch")}

<p>राष्ट्र बैंकका गभर्नरले भने, "रेमिट्यान्स नेपालको अर्थतन्त्रको मेरुदण्ड बनिसकेको छ। यो वृद्धि उत्साहजनक छ।"</p>

<p>तर विज्ञहरूले रेमिट्यान्समा अत्यधिक निर्भरता हुनु स्वस्थ अर्थतन्त्रको लक्षण नभएको चेतावनी दिएका छन्।</p>

${img(images.economy2, "नेपालको वित्तीय क्षेत्र — Nepal's growing financial sector infrastructure")}

<p>सरकारले रेमिट्यान्सको सही उपयोग गर्न र त्यसलाई उत्पादनशील क्षेत्रमा लगानी गराउन विशेष नीति ल्याउने तयारी गरिरहेको छ।</p>`,

    contentEn: `<p>Kathmandu. According to data released by Nepal Rastra Bank, remittances received in Nepal this fiscal year have exceeded Rs 12 trillion.</p>

<p>This is 15 percent more than the previous year. The most remittances came from Malaysia, Gulf countries, and South Korea where Nepali migrants work.</p>

${img(images.inline_bank, "Citizens collecting remittances at bank branches across Nepal")}

<p>The Governor of Nepal Rastra Bank said, "Remittances have become the backbone of Nepal's economy. This growth is encouraging."</p>

<p>However, experts have warned that excessive dependence on remittances is not a sign of a healthy and self-sustaining economy.</p>

${img(images.economy2, "Nepal's growing financial sector and banking infrastructure across the country")}

<p>The government is preparing special policies to ensure proper utilization of remittances and direct them to productive investment sectors.</p>`,

    categoryId: economy.id,
    authorId: author4.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagBudget.id],
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
  });
  console.log("  ✓ Economy 2: Remittance record");

  await createArticle({
    slug: "nepal-tourism-recovery-post-covid",
    coverImageUrl: images.economy3,
    coverImageFilename: "tourism-recovery-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपालको पर्यटन क्षेत्र पुनरुत्थानमा, १० लाख पर्यटक आउने अनुमान",
    titleEn:
      "Nepal Tourism Sector in Recovery, 1 Million Tourists Expected This Year",
    excerptNe:
      "नेपालको पर्यटन क्षेत्रले गति लिएको छ। यस वर्ष १० लाखभन्दा बढी पर्यटक नेपाल आउने पर्यटन बोर्डले अनुमान गरेको छ।",
    excerptEn:
      "Nepal's tourism sector is gaining momentum. The Tourism Board has estimated that more than 1 million tourists will visit Nepal this year.",
    contentNe: `<p>काठमाडौं । कोभिड महामारीपछि सुस्ताएको नेपालको पर्यटन क्षेत्रले पुनः गति लिएको छ।</p>

<p>नेपाल पर्यटन बोर्डका अनुसार यस वर्ष जनवरीदेखि मार्चसम्म मात्रै ३ लाख पर्यटक नेपाल आइसकेका छन् र वर्षभरमा १० लाख पुग्ने अनुमान छ।</p>

${img(images.world2, "पर्यटकहरू नेपाल भ्रमणमा — Tourists exploring the natural wonders of Nepal")}

<p>एभरेस्ट आरोहण, पोखरा र लुम्बिनी भ्रमण गर्ने पर्यटकहरूको संख्यामा उल्लेख्य वृद्धि भएको छ।</p>

<p>पर्यटन मन्त्रीले भने, "हामीले पर्यटन पूर्वाधार सुधार गर्न ठूलो लगानी गरेका छौं। अब त्यसको फल देखिन थालेको छ।"</p>

${img(images.economy3, "नेपालका पर्यटकीय स्थलहरूमा बढ्दो भीड — Growing number of visitors at Nepal's tourist destinations")}

<p>होटल तथा रेस्टुरेन्ट व्यवसाय पनि चलायमान भएको छ। यस क्षेत्रमा नयाँ रोजगारीको अवसर सिर्जना भइरहेको छ।</p>

<p>नेपाल भ्रमण वर्ष कार्यक्रमलाई थप प्रभावकारी बनाउन सरकारले अन्तर्राष्ट्रिय बजारमा प्रवर्द्धन अभियान चलाउने योजना बनाएको छ।</p>`,

    contentEn: `<p>Kathmandu. Nepal's tourism sector, which had slowed down after the COVID-19 pandemic, has regained momentum.</p>

<p>According to the Nepal Tourism Board, 300,000 tourists have already visited Nepal from January to March this year and an estimated 1 million are expected by year end.</p>

${img(images.world2, "Tourists exploring the breathtaking natural wonders and landscapes of Nepal")}

<p>The number of tourists visiting Everest climbing, Pokhara and Lumbini has increased significantly compared to previous years.</p>

<p>The Tourism Minister said, "We have made huge investments to improve tourism infrastructure. Now we are starting to see the results of that investment."</p>

${img(images.economy3, "Growing crowds at Nepal's popular tourist destinations signal strong recovery")}

<p>The hotel and restaurant business has also picked up significantly. New employment opportunities are being created in the tourism sector across the country.</p>

<p>The government plans to launch a promotion campaign in international markets to make the Visit Nepal program more effective and attract diverse travelers.</p>`,

    categoryId: economy.id,
    authorId: author4.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagTourism.id],
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
  });
  console.log("  ✓ Economy 3: Tourism recovery");

  // ─────────────────────────────────────────
  // ENTERTAINMENT — 2 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepali-film-loot-3-release-date",
    coverImageUrl: images.entertain1,
    coverImageFilename: "loot3-film-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "लुट ३ को रिलिज मिति घोषणा, नेपाली चलचित्र जगतमा उत्साह",
    titleEn:
      "Loot 3 Release Date Announced, Excitement in Nepali Film Industry",
    excerptNe:
      'नेपाली चलचित्र इतिहासको सबैभन्दा सफल श्रृङ्खलामध्ये एक "लुट" को तेस्रो भागको रिलिज मिति घोषणा भएको छ। दर्शकहरूमा ठूलो उत्साह देखिएको छ।',
    excerptEn:
      'The release date of the third installment of "Loot", one of the most successful series in Nepali cinema history, has been announced.',
    contentNe: `<p>काठमाडौं । नेपाली चलचित्र "लुट ३" को रिलिज मिति आगामी बैशाख १ गते तोकिएको छ। यो घोषणापछि दर्शकहरूमा ठूलो उत्साह देखिएको छ।</p>

<p>निर्देशक नीराज बेगले यो फिल्मको विशेष स्क्रिनिङको आयोजना गरेका थिए जसमा मिडियाकर्मी र उद्योगका व्यक्तित्वहरू उपस्थित थिए।</p>

${img(images.inline_movie, "लुट ३ को विशेष स्क्रिनिङमा कलाकारहरू — Loot 3 cast at special screening event")}

<p>"यो फिल्म दर्शकहरूलाई निराश गर्दैन। हामीले यसमा धेरै मेहनत गरेका छौं," निर्देशकले भने।</p>

<p>फिल्ममा सौगात मल्ल, सुशील क्षेत्री र दया हाङ राई मुख्य भूमिकामा छन्। फिल्मको सङ्गीत पहिले नै सामाजिक सञ्जालमा हिट भइसकेको छ।</p>

${img(images.entertain1, "नेपाली चलचित्र उद्योगको बढ्दो प्रभाव — Growing influence of Nepali film industry")}

<p>लुट फिल्म श्रृङ्खलाले नेपाली चलचित्र उद्योगमा एक नयाँ युगको शुरुवात गरेको थियो। लुट १ र लुट २ ले मिलाएर नेपाली इतिहासमा सर्वाधिक कमाउने फिल्महरूमा स्थान पाएका छन्।</p>`,

    contentEn: `<p>Kathmandu. The release date of Nepali film "Loot 3" has been set for Baisakh 1 (mid-April). This announcement has generated huge excitement among fans nationwide.</p>

<p>Director Neeraj Beg organized a special screening of the film which was attended by media personnel and industry personalities.</p>

${img(images.inline_movie, "Loot 3 cast members at the special screening event held in Kathmandu")}

<p>"This film will not disappoint the audience. We have worked very hard on this," the director said at the screening event.</p>

<p>The film stars Saugat Malla, Sushil Shrestha and Daya Hang Rai in lead roles. The film's music has already become a hit on social media platforms.</p>

${img(images.entertain1, "The growing influence and reach of the Nepali film industry beyond its borders")}

<p>The Loot film franchise had ushered in a new era in the Nepali film industry. Loot 1 and Loot 2 combined are among the highest-grossing films in Nepali cinema history.</p>`,

    categoryId: entertainment.id,
    authorId: author5.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagFilm.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
  });
  console.log("  ✓ Entertainment 1: Loot 3 film");

  await createArticle({
    slug: "nepali-music-festival-global-reach",
    coverImageUrl: images.entertain2,
    coverImageFilename: "music-festival-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपाली सङ्गीत अन्तर्राष्ट्रिय मञ्चमा, युट्युबमा करोड भ्यूज",
    titleEn:
      "Nepali Music Reaches International Stage, Crosses 10 Million Views on YouTube",
    excerptNe:
      "नेपाली लोक र आधुनिक सङ्गीतले अन्तर्राष्ट्रिय मञ्चमा आफ्नो पहिचान बनाएको छ। एक नेपाली गायकको गीतले युट्युबमा १ करोड भ्यूज पार गरेको छ।",
    excerptEn:
      "Nepali folk and modern music has made its mark on the international stage. A Nepali singer's song has crossed 10 million views on YouTube.",
    contentNe: `<p>काठमाडौं । नेपाली सङ्गीतले अन्तर्राष्ट्रिय स्तरमा आफ्नो पहिचान बनाउन थालेको छ।</p>

<p>युवा गायक प्रकाश सपुतको "ए मेरी लुगा" गीतले युट्युबमा १ करोड भ्यूज पार गरेको छ। यो नेपाली सङ्गीत इतिहासमा उल्लेख्य उपलब्धि हो।</p>

${img(images.inline_concert, "काठमाडौंमा आयोजित सङ्गीत महोत्सव — Music festival held in Kathmandu draws huge crowd")}

<p>"नेपाली सङ्गीत अब विश्वभरका श्रोताहरूसम्म पुग्न थालेको छ। यो हाम्रो संस्कृतिको विजय हो," गायकले भने।</p>

<p>नेपाली सङ्गीतकारहरूले स्पोटिफाई, एप्पल म्युजिक र युट्युबमार्फत विश्वभरि आफ्नो सङ्गीत पुर्‍याउन थालेका छन्।</p>

${img(images.entertain2, "नेपाली सङ्गीत कलाकारहरू — Nepali music artists performing at a major event")}

<p>आगामी महिना काठमाडौंमा एक ठूलो अन्तर्राष्ट्रिय सङ्गीत महोत्सव आयोजना हुँदैछ जसमा नेपाली र विदेशी कलाकारहरू एकैसाथ प्रस्तुति दिनेछन्।</p>`,

    contentEn: `<p>Kathmandu. Nepali music has started to make its mark on the international stage reaching global audiences.</p>

<p>Young singer Prakash Saput's song "Ae Meri Luga" has crossed 10 million views on YouTube. This is a notable achievement in Nepali music history.</p>

${img(images.inline_concert, "Music festival held in Kathmandu draws a massive and enthusiastic crowd")}

<p>"Nepali music has now started reaching listeners around the world. This is the victory of our culture," the singer said in a statement.</p>

<p>Nepali musicians have started distributing their music worldwide through platforms like Spotify, Apple Music and YouTube reaching diaspora communities.</p>

${img(images.entertain2, "Nepali music artists delivering a powerful performance at a major concert event")}

<p>Next month, a large international music festival will be held in Kathmandu where Nepali and foreign artists will perform together on the same stage.</p>`,

    categoryId: entertainment.id,
    authorId: author5.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagMusic.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
  });
  console.log("  ✓ Entertainment 2: Music YouTube milestone");

  // ─────────────────────────────────────────
  // WORLD — 2 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "climate-change-himalaya-glaciers-melting",
    coverImageUrl: images.world1,
    coverImageFilename: "himalaya-climate-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "हिमालयका हिमनदी पग्लिने दर बढ्दो, नेपालमा खतराको चेतावनी",
    titleEn:
      "Himalayan Glaciers Melting at Increasing Rate, Warning of Danger for Nepal",
    excerptNe:
      "अन्तर्राष्ट्रिय अध्ययनले हिमालयका हिमनदीहरू अपेक्षाभन्दा छिटो पग्लिरहेको देखाएको छ। यसले नेपाल र दक्षिण एसियाका अन्य देशहरूमा गम्भीर खतरा निम्त्याउन सक्छ।",
    excerptEn:
      "International studies show Himalayan glaciers are melting faster than expected. This could pose a serious threat to Nepal and other South Asian countries.",
    contentNe: `<p>काठमाडौं/जेनेभा । अन्तर्राष्ट्रिय अध्ययनले हिमालयका हिमनदीहरू अपेक्षाभन्दा छिटो पग्लिरहेको देखाएको छ।</p>

<p>विश्व हिमनदी निगरानी सेवाको प्रतिवेदन अनुसार हिमालयका हिमनदीहरू प्रतिवर्ष औसतमा ४५ सेन्टिमिटर पातलिँदैछन्।</p>

${img(images.inline_climate, "पग्लिँदो हिमनदी — Himalayan glaciers showing visible signs of melting and retreat")}

<p>यसले नेपालमा हिमताल विस्फोट (GLOF) को जोखिम बढाएको छ। विशेषज्ञहरूले यसबाट हुन सक्ने विपद्बारे तयारी गर्न सरकारलाई आग्रह गरेका छन्।</p>

<p>नेपाल सरकारले जलवायु परिवर्तन अनुकूलन कार्यक्रम सञ्चालन गरिरहेको छ तर थप प्रयासको आवश्यकता रहेको विज्ञहरूको मत छ।</p>

${img(images.world1, "हिमालयको भव्यता — The majestic Himalayas face unprecedented climate threats")}

<p>आगामी जलवायु सम्मेलनमा नेपालले यो विषयलाई प्राथमिकताका साथ उठाउने सरकारले जनाएको छ। नेपाल जस्ता साना देशहरू जलवायु परिवर्तनका सबैभन्दा बढी पीडितमध्ये पर्छन्।</p>`,

    contentEn: `<p>Kathmandu/Geneva. International studies have shown that Himalayan glaciers are melting faster than expected, raising serious concerns.</p>

<p>According to a World Glacier Monitoring Service report, Himalayan glaciers are thinning by an average of 45 centimeters per year, accelerating over recent decades.</p>

${img(images.inline_climate, "Himalayan glaciers showing clear and visible signs of melting and dramatic retreat")}

<p>This has increased the risk of Glacial Lake Outburst Floods (GLOF) in Nepal. Experts have urged the government to prepare for potential disasters caused by glacial melting.</p>

<p>The Nepal government is running a climate change adaptation program but experts say more efforts are needed to protect vulnerable communities.</p>

${img(images.world1, "The majestic Himalayas now face unprecedented and accelerating climate threats")}

<p>The government has said Nepal will raise this issue as a priority at the upcoming climate conference. Countries like Nepal that contribute least to emissions suffer the most consequences.</p>`,

    categoryId: world.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagClimate.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
  });
  console.log("  ✓ World 1: Climate change glaciers");

  await createArticle({
    slug: "united-nations-nepal-development-aid",
    coverImageUrl: images.world2,
    coverImageFilename: "un-aid-nepal-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "संयुक्त राष्ट्रसंघले नेपाललाई थप विकास सहायता दिने, सहकार्य सम्झौतामा हस्ताक्षर",
    titleEn:
      "United Nations to Provide Additional Development Aid to Nepal, Cooperation Agreement Signed",
    excerptNe:
      "संयुक्त राष्ट्रसंघले नेपाललाई थप विकास सहायता प्रदान गर्ने घोषणा गरेको छ। नेपाल सरकार र संयुक्त राष्ट्रसंघबीच नयाँ सहकार्य सम्झौतामा हस्ताक्षर भएको छ।",
    excerptEn:
      "The United Nations has announced additional development aid for Nepal. A new cooperation agreement has been signed between the Nepal government and the United Nations.",
    contentNe: `<p>काठमाडौं । संयुक्त राष्ट्रसंघले नेपाललाई आगामी ५ वर्षका लागि थप विकास सहायता प्रदान गर्ने घोषणा गरेको छ।</p>

<p>नेपाल सरकार र संयुक्त राष्ट्रसंघका विभिन्न निकायहरूबीच काठमाडौंमा एक नयाँ सहकार्य सम्झौतामा हस्ताक्षर भयो।</p>

${img(images.inline_diplomacy, "संयुक्त राष्ट्रसंघ र नेपाल सरकारबीच सम्झौतामा हस्ताक्षर — UN and Nepal government sign cooperation agreement")}

<p>यो सहायता शिक्षा, स्वास्थ्य, जलवायु परिवर्तन अनुकूलन र लैंगिक समानताका क्षेत्रहरूमा प्रदान गरिनेछ।</p>

<p>"नेपालसँगको हाम्रो साझेदारी अझ बलियो भएको छ। हामी नेपालको दिगो विकासका लागि प्रतिबद्ध छौं," संयुक्त राष्ट्रसंघका नेपाल प्रतिनिधिले भने।</p>

${img(images.world2, "अन्तर्राष्ट्रिय सहकार्यको प्रतीक — International cooperation and diplomacy for Nepal's development")}

<p>यो सहायताको महत्वपूर्ण हिस्सा जलवायु परिवर्तनका प्रभाव न्यूनीकरण र हिमाली क्षेत्रका समुदायहरूको संरक्षणमा खर्च गरिनेछ।</p>`,

    contentEn: `<p>Kathmandu. The United Nations has announced additional development aid for Nepal for the next 5 years under a new partnership framework.</p>

<p>A new cooperation agreement was signed in Kathmandu between the Nepal government and various UN agencies including UNDP, UNICEF and WHO.</p>

${img(images.inline_diplomacy, "Signing ceremony of the cooperation agreement between the UN and Nepal government")}

<p>This aid will be provided in the areas of education, health, climate change adaptation and gender equality to accelerate sustainable development.</p>

<p>"Our partnership with Nepal has become stronger. We are committed to Nepal's sustainable development," said the UN Resident Representative for Nepal.</p>

${img(images.world2, "International cooperation and multilateral diplomacy supporting Nepal's development goals")}

<p>An important part of this aid will be spent on mitigating the effects of climate change and protecting mountain communities from increasing natural disaster risks.</p>`,

    categoryId: world.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagClimate.id],
    publishedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
  });
  console.log("  ✓ World 2: UN development aid");

  // ─────────────────────────────────────────
  // SOCIETY — 2 articles
  // ─────────────────────────────────────────

  await createArticle({
    slug: "nepal-education-reform-new-curriculum",
    coverImageUrl: images.society1,
    coverImageFilename: "education-reform-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "नेपालको शिक्षा प्रणालीमा सुधार, नयाँ पाठ्यक्रम लागू हुने",
    titleEn:
      "Reform in Nepal's Education System, New Curriculum to be Implemented",
    excerptNe:
      "शिक्षा मन्त्रालयले प्राथमिक र माध्यमिक विद्यालयहरूका लागि नयाँ पाठ्यक्रम तयार गरेको छ। यसले विद्यार्थीहरूलाई व्यावहारिक ज्ञान र सीपमा जोड दिनेछ।",
    excerptEn:
      "The Ministry of Education has prepared a new curriculum for primary and secondary schools focusing on practical knowledge and skills.",
    contentNe: `<p>काठमाडौं । शिक्षा मन्त्रालयले प्राथमिक र माध्यमिक विद्यालयहरूका लागि नयाँ पाठ्यक्रम तयार गरेको छ।</p>

<p>यो पाठ्यक्रमले पुस्तकीय ज्ञानभन्दा व्यावहारिक सीप र जीवनोपयोगी शिक्षामा जोड दिनेछ।</p>

${img(images.inline_school, "नेपाली विद्यालयका विद्यार्थीहरू — Students at a Nepali school learning under the new curriculum")}

<p>शिक्षा मन्त्रीले भने, "हामीले विद्यार्थीहरूलाई भविष्यको चुनौतीहरूका लागि तयार पार्ने शिक्षा दिन चाहन्छौं।"</p>

<p>नयाँ पाठ्यक्रममा व्यावसायिक तालिम, उद्यमशीलता र डिजिटल साक्षरताका विषयहरू समावेश गरिएका छन्।</p>

${img(images.society1, "शिक्षा सुधारमा नेपालको प्रयास — Nepal's efforts in comprehensive education reform")}

<p>शिक्षाविद्हरूले यो सुधारलाई सकारात्मक रूपमा लिएका छन् तर कार्यान्वयनमा चुनौती हुन सक्ने चेतावनी पनि दिएका छन्।</p>

<p>यो नयाँ पाठ्यक्रम आगामी शैक्षिक वर्षदेखि सरकारी विद्यालयहरूमा लागू हुनेछ।</p>`,

    contentEn: `<p>Kathmandu. The Ministry of Education has prepared a new curriculum for primary and secondary schools that focuses on practical and life-relevant education.</p>

<p>This curriculum will emphasize practical skills and life-relevant education rather than just rote learning from textbooks.</p>

${img(images.inline_school, "Students at a Nepali school engaging with practical learning activities")}

<p>The Education Minister said, "We want to give students an education that prepares them for the challenges of the future economy and society."</p>

<p>The new curriculum includes subjects on vocational training, entrepreneurship and digital literacy relevant to modern Nepal.</p>

${img(images.society1, "Nepal's comprehensive efforts in reforming and modernizing its education system")}

<p>Educationists have taken this reform positively but have also warned that there may be implementation challenges especially in remote areas with limited resources.</p>

<p>This new curriculum will be implemented in government schools from the next academic year across the country.</p>`,

    categoryId: society.id,
    authorId: author3.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagEducation.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });
  console.log("  ✓ Society 1: Education reform");

  await createArticle({
    slug: "nepal-health-insurance-expansion-2082",
    coverImageUrl: images.society2,
    coverImageFilename: "health-insurance-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe:
      "स्वास्थ्य बिमा कार्यक्रम विस्तार, ७० लाख नागरिक लाभान्वित हुनेछन्",
    titleEn: "Health Insurance Program Expanded, 7 Million Citizens to Benefit",
    excerptNe:
      "सरकारले राष्ट्रिय स्वास्थ्य बिमा कार्यक्रमको दायरा विस्तार गर्ने घोषणा गरेको छ। यसले थप ७० लाख नागरिकहरूलाई स्वास्थ्य सेवामा सहज पहुँच दिनेछ।",
    excerptEn:
      "The government has announced the expansion of the national health insurance program. This will give 7 million additional citizens easy access to health services.",
    contentNe: `<p>काठमाडौं । सरकारले राष्ट्रिय स्वास्थ्य बिमा कार्यक्रमको दायरा विस्तार गर्ने घोषणा गरेको छ।</p>

<p>यस कार्यक्रम अन्तर्गत अब थप ७० लाख नागरिकहरूले वार्षिक ५ लाख रुपैयाँसम्मको स्वास्थ्य उपचार निःशुल्क पाउन सक्नेछन्।</p>

${img(images.inline_hospital, "नेपाली अस्पतालमा उपचार पाइरहेका बिरामीहरू — Patients receiving treatment at a Nepali hospital")}

<p>स्वास्थ्य मन्त्रीले भने, "हाम्रो लक्ष्य सन् २०३० सम्म सबै नेपाली नागरिकलाई स्वास्थ्य बिमाको दायरामा ल्याउनु हो।"</p>

<p>यो विस्तारले विशेष गरी गरिब र सीमान्तकृत वर्गका नागरिकहरूलाई लाभ पुर्‍याउनेछ जो आर्थिक कारणले महँगो उपचार गर्न सक्दैनन्।</p>

${img(images.society2, "सामुदायिक स्वास्थ्य सेवा — Community health services reaching remote areas of Nepal")}

<p>विज्ञहरूले यो कदमलाई नेपालको स्वास्थ्य प्रणालीको सुदृढीकरणमा महत्वपूर्ण कदम भनेका छन्।</p>

<p>बिमा कार्यक्रमको दायरा विस्तारसँगै सरकारले ग्रामीण क्षेत्रमा थप स्वास्थ्य संस्था खोल्ने योजना पनि बनाएको छ।</p>`,

    contentEn: `<p>Kathmandu. The government has announced the expansion of the national health insurance program to cover more citizens.</p>

<p>Under this program, an additional 7 million citizens will be able to receive free medical treatment of up to Rs 500,000 per year covering major illnesses.</p>

${img(images.inline_hospital, "Patients receiving quality medical treatment at a Nepali government hospital")}

<p>The Health Minister said, "Our goal is to bring all Nepali citizens under health insurance coverage by 2030."</p>

<p>This expansion will particularly benefit poor and marginalized citizens who cannot afford expensive medical treatment due to financial constraints.</p>

${img(images.society2, "Community health services being expanded to reach the most remote areas of Nepal")}

<p>Experts have called this an important step in strengthening Nepal's health system towards universal health coverage.</p>

<p>Along with expanding the insurance program, the government has also planned to open additional health institutions in rural areas to improve access.</p>`,

    categoryId: society.id,
    authorId: author4.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagHealth.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
  });
  console.log("  ✓ Society 2: Health insurance expansion");

  // ═══════════════════════════════════════════
  // ARTICLES FOR NEW CATEGORIES
  // ═══════════════════════════════════════════

  console.log("📰 Seeding articles for new categories...\n");

  // News category
  await createArticle({
    slug: "daily-news-update-nepal-april-18",
    coverImageUrl: images.politics1,
    coverImageFilename: "daily-news-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "दैनिक समाचार: नेपालमा आजका प्रमुख घटनाहरू",
    titleEn: "Daily News: Major Events in Nepal Today",
    excerptNe:
      "आजका प्रमुख समाचारहरूको सारांश: राजनीति, अर्थतन्त्र र सामाजिक क्षेत्रका महत्वपूर्ण घटनाहरू।",
    excerptEn:
      "Summary of today's major news: Important events in politics, economy and social sectors.",
    contentNe: `<p>काठमाडौं, वैशाख १ गते। आजको दिनमा नेपालमा विभिन्न क्षेत्रहरूमा महत्वपूर्ण घटनाहरू भएका छन्।</p>
    <p>राजनीतिक क्षेत्रमा संसदको कार्यक्रम जारी छ भने अर्थतन्त्रमा बजेट कार्यान्वयनको समीक्षा भइरहेको छ।</p>`,
    contentEn: `<p>Kathmandu, May 1st. Various important events have taken place in Nepal today across different sectors.</p>
    <p>In politics, parliament's program is ongoing while budget implementation review is underway in the economy sector.</p>`,
    categoryId: news.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagBreaking.id],
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  });
  console.log("  ✓ News 1: Daily news update");

  // Dharma & Culture category
  await createArticle({
    slug: "mahashivratri-celebration-nepal-2082",
    coverImageUrl: images.entertain1,
    coverImageFilename: "mahashivratri-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "महाशिवरात्रि उत्सव सम्पन्न, लाखौं भक्तजनको सहभागिता",
    titleEn: "Mahashivratri Festival Concludes, Lakhs of Devotees Participate",
    excerptNe:
      "पशुपतिनाथको मन्दिरमा महाशिवरात्रि उत्सव सम्पन्न भएको छ। लाखौं भक्तजनहरूले दर्शन गरे।",
    excerptEn:
      "Mahashivratri festival at Pashupatinath Temple has concluded. Lakhs of devotees took darshan.",
    contentNe: `<p>काठमाडौं। वैशाख १ गते महाशिवरात्रि पर्व सम्पन्न भयो।</p>
    <p>पशुपतिनाथ मन्दिरमा लाखौं भक्तजनहरू आएका थिए।</p>`,
    contentEn: `<p>Kathmandu. Mahashivratri festival concluded on May 1st.</p>
    <p>Lakhs of devotees visited Pashupatinath Temple.</p>`,
    categoryId: dharmaSanskriti.id,
    authorId: author5.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  });
  console.log("  ✓ Dharma & Culture 1: Mahashivratri");

  // Health category
  await createArticle({
    slug: "dengue-outbreak-nepal-prevention",
    coverImageUrl: images.society2,
    coverImageFilename: "dengue-prevention-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "डेंगु रोग बिरुद्ध सतर्कता, स्वास्थ्य मन्त्रालयको अभियान",
    titleEn: "Alert Against Dengue Disease, Health Ministry Campaign",
    excerptNe:
      "डेंगु रोगको जोखिम बढेपछि स्वास्थ्य मन्त्रालयले सतर्कता अभियान सुरु गरेको छ।",
    excerptEn:
      "After the risk of dengue disease has increased, the health ministry has launched an awareness campaign.",
    contentNe: `<p>काठमाडौं। स्वास्थ्य मन्त्रालयले डेंगु रोग बिरुद्ध सतर्कता अभियान सुरु गरेको छ।</p>
    <p>मच्छर नियन्त्रण र स्वच्छता कार्यक्रम जारी छ।</p>`,
    contentEn: `<p>Kathmandu. The health ministry has launched an awareness campaign against dengue disease.</p>
    <p>Mosquito control and cleanliness programs are ongoing.</p>`,
    categoryId: swasthya.id,
    authorId: author4.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagHealth.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  });
  console.log("  ✓ Health 1: Dengue prevention");

  // Lifestyle category
  await createArticle({
    slug: "yoga-day-celebration-nepal-2082",
    coverImageUrl: images.sports3,
    coverImageFilename: "yoga-day-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "अन्तर्राष्ट्रिय योग दिवस: स्वस्थ जीवनको मार्ग",
    titleEn: "International Day of Yoga: Path to Healthy Life",
    excerptNe:
      "अन्तर्राष्ट्रिय योग दिवसको अवसरमा विभिन्न कार्यक्रमहरू आयोजना गरिए।",
    excerptEn:
      "Various programs were organized on the occasion of International Day of Yoga.",
    contentNe: `<p>काठमाडौं। अन्तर्राष्ट्रिय योग दिवसको अवसरमा योग शिविर आयोजना गरियो।</p>
    <p>हजारौं मानिसहरूले योग अभ्यासमा भाग लिए।</p>`,
    contentEn: `<p>Kathmandu. Yoga camp was organized on the occasion of International Day of Yoga.</p>
    <p>Thousands of people participated in yoga practice.</p>`,
    categoryId: jeevanShaili.id,
    authorId: author4.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagHealth.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  });
  console.log("  ✓ Lifestyle 1: Yoga Day");

  // Interview category
  await createArticle({
    slug: "interview-cm-karnali-province",
    coverImageUrl: images.politics2,
    coverImageFilename: "cm-interview-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "अन्तर्वार्ता: मुख्यमन्त्रीसँग विकास योजनाबारे कुराकानी",
    titleEn: "Interview: Talk with Chief Minister about Development Plans",
    excerptNe:
      "कर्णाली प्रदेशका मुख्यमन्त्रीसँग विकास योजना र भविष्यका योजनाबारे कुराकानी।",
    excerptEn:
      "Conversation with the Chief Minister of Karnali Province about development plans and future initiatives.",
    contentNe: `<p>प्रश्न: आगामी वर्षको प्राथमिकता के हो?</p>
    <p>मुख्यमन्त्री: पूर्वाधार विकास र स्वास्थ्य क्षेत्रमा लगानी बढाउने योजना छ।</p>`,
    contentEn: `<p>Q: What is the priority for the next year?</p>
    <p>CM: We plan to increase investment in infrastructure development and health sector.</p>`,
    categoryId: antarvarta.id,
    authorId: author1.id,
    isFeatured: false,
    isBreaking: false,
    tagIds: [tagNepal.id, tagGovt.id],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  });
  console.log("  ✓ Interview 1: CM Karnali");

  // ═══════════════════════════════════════════
  // PROVINCE ARTICLES
  // ═══════════════════════════════════════════

  console.log("📰 Seeding province articles...\n");

  // Province 1 - Koshi
  await createArticle({
    slug: "province-1-new-road-infrastructure",
    coverImageUrl: images.politics1,
    coverImageFilename: "province1-road.jpg",
    uploadedById: superAdmin.id,
    titleNe: "प्रदेश १ मा नयाँ सडक पूर्वाधार निर्माण शुरु",
    titleEn: "New Road Infrastructure Construction Begins in Province 1",
    excerptNe: "कोशी प्रदेशमा नयाँ सडक निर्माणका लागि काम शुरु भएको छ।",
    excerptEn: "New road construction has begun in Koshi Province.",
    contentNe: `<p>कोशी प्रदेशमा नयाँ सडक पूर्वाधार निर्माण शुरु भएको छ।</p>
    <p>इलामबाट बझङ्गा सम्मको सडक स्तरोन्नति हुनेछ।</p>`,
    contentEn: `<p>New road infrastructure construction has begun in Koshi Province.</p>
    <p>The road from Ilam to Bajhang will be upgraded.</p>`,
    categoryId: politics.id,
    authorId: author1.id,
    province: Province.PROVINCE_1,
  });

  await createArticle({
    slug: "province-1-tea-gardens-tourism",
    coverImageUrl: images.entertain1,
    coverImageFilename: "province1-tea.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशको चिया बगानमा पर्यटकीय गतिविधि बढ्यो",
    titleEn: "Tourist Activities Increase in Koshi Province Tea Gardens",
    excerptNe: "इलामको चिया बगानहरूमा पर्यटकहरूको आगमन बढेको छ।",
    excerptEn: "Tourist arrivals have increased in Ilam tea gardens.",
    contentNe: `<p>इलामको चिया बगान क्षेत्रमा पर्यटकहरूको आगमन बढेको छ।</p>`,
    contentEn: `<p>Tourist arrivals have increased in Ilam tea garden area.</p>`,
    categoryId: society.id,
    authorId: author2.id,
    province: Province.PROVINCE_1,
  });

  // Province 2 - Madhesh
  await createArticle({
    slug: "province-2-industrial-zone-development",
    coverImageUrl: images.economy1,
    coverImageFilename: "province2-industrial.jpg",
    uploadedById: superAdmin.id,
    titleNe: "प्रदेश २ मा औद्योगिक क्षेत्र विकास योजना",
    titleEn: "Industrial Zone Development Plan in Province 2",
    excerptNe:
      "मधेश प्रदेशमा नयाँ औद्योगिक क्षेत्र विकास योजना घोषणा गरिएको छ।",
    excerptEn:
      "New industrial zone development plan announced in Madhesh Province.",
    contentNe: `<p>मधेश प्रदेशमा नयाँ औद्योगिक क्षेत्र विकास योजना घोषणा गरिएको छ।</p>
    <p>बिरगञ्जमा नयाँ औद्योगिक पार्क स्थापना हुनेछ।</p>`,
    contentEn: `<p>New industrial zone development plan announced in Madhesh Province.</p>
    <p>A new industrial park will be established in Birgunj.</p>`,
    categoryId: economy.id,
    authorId: author1.id,
    province: Province.PROVINCE_2,
  });

  await createArticle({
    slug: "province-2-agriculture-rice-production",
    coverImageUrl: images.politics1,
    coverImageFilename: "province2-rice.jpg",
    uploadedById: superAdmin.id,
    titleNe: "प्रदेश २ मा धान उत्पादनमा वृद्धि",
    titleEn: "Rice Production Increases in Province 2",
    excerptNe: "मधेश प्रदेशमा यस वर्ष धान उत्पादनमा वृद्धि भएको छ।",
    excerptEn: "Rice production has increased in Province 2 this year.",
    contentNe: `<p>मधेश प्रदेशमा धान उत्पादन बढेको छ।</p>`,
    contentEn: `<p>Rice production has increased in Province 2.</p>`,
    categoryId: society.id,
    authorId: author3.id,
    province: Province.PROVINCE_2,
  });

  // Province 3 - Bagmati
  await createArticle({
    slug: "province-3-kathmandu-metro-rail-study",
    coverImageUrl: images.politics1,
    coverImageFilename: "province3-metro.jpg",
    uploadedById: superAdmin.id,
    titleNe: "काठमाडौंमा मेट्रो रेल सम्भाव्यता अध्ययन शुरु",
    titleEn: "Metro Rail Feasibility Study Begins in Kathmandu",
    excerptNe: "बागमती प्रदेशमा मेट्रो रेलको सम्भाव्यता अध्ययन शुरु भएको छ।",
    excerptEn: "Metro rail feasibility study has begun in Bagmati Province.",
    contentNe: `<p>काठमाडौंमा मेट्रो रेलको सम्भाव्यता अध्ययन शुरु भएको छ।</p>
    <p>तीन वर्षभित्र अध्ययन पूरा हुनेछ।</p>`,
    contentEn: `<p>Metro rail feasibility study has begun in Kathmandu.</p>
    <p>The study will be completed within three years.</p>`,
    categoryId: politics.id,
    authorId: author1.id,
    province: Province.PROVINCE_3,
  });

  await createArticle({
    slug: "province-3-education-reform",
    coverImageUrl: images.sports1,
    coverImageFilename: "province3-education.jpg",
    uploadedById: superAdmin.id,
    titleNe: "बागमती प्रदेशमा शिक्षा सुधार योजना",
    titleEn: "Education Reform Plan in Bagmati Province",
    excerptNe: "बागमती प्रदेशमा नयाँ शिक्षा सुधार योजना लागू हुनेछ।",
    excerptEn:
      "New education reform plan will be implemented in Bagmati Province.",
    contentNe: `<p>बागमती प्रदेशमा शिक्षा सुधार योजना लागू हुनेछ।</p>`,
    contentEn: `<p>New education reform plan will be implemented in Bagmati Province.</p>`,
    categoryId: society.id,
    authorId: author2.id,
    province: Province.PROVINCE_3,
  });

  // Province 4 - Gandaki
  await createArticle({
    slug: "province-4- hydropower-tourism",
    coverImageUrl: images.economy1,
    coverImageFilename: "province4-hydro.jpg",
    uploadedById: superAdmin.id,
    titleNe: "���ण्डकी प्रदेशमा जलविद्युत् र पर्यटन परियोजना",
    titleEn: "Hydropower and Tourism Projects in Gandaki Province",
    excerptNe:
      "गण्डकी प्रदेशमा जलविद्युत् र पर्यटन परियोजनाहरू अघि बढिरहेका छन्।",
    excerptEn:
      "Hydropower and tourism projects are progressing in Gandaki Province.",
    contentNe: `<p>गण्डकी प्रदेशमा जलविद्युत् परियोजनाहरू अघि बढिरहेका छन्।</p>
    <p>पोखरा क्षेत्रमा पर्यटन विस्तार भइरहेको छ।</p>`,
    contentEn: `<p>Hydropower projects are progressing in Gandaki Province.</p>
    <p>Tourism expansion is underway in Pokhara area.</p>`,
    categoryId: economy.id,
    authorId: author1.id,
    province: Province.PROVINCE_4,
  });

  // Province 5 - Lumbini
  await createArticle({
    slug: "province-5-tourism-lumbini",
    coverImageUrl: images.entertain1,
    coverImageFilename: "province5-lumbini.jpg",
    uploadedById: superAdmin.id,
    titleNe: "लुम्बिनी प्रदेशमा पर्यटन विकास",
    titleEn: "Tourism Development in Lumbini Province",
    excerptNe:
      "लुम्बिनी प्रदेशमा पर्यटन विकासका नयाँ योजनाहरू घोषणा गरिएका छन्।",
    excerptEn: "New tourism development plans announced in Lumbini Province.",
    contentNe: `<p>लुम्बिनी प्रदेशमा पर्यटन विकासका नयाँ योजनाहरू घोषणा गरिएका छन्।</p>
    <p>कपिलवस्तुमा होटल निर्माण हुनेछ।</p>`,
    contentEn: `<p>New tourism development plans announced in Lumbini Province.</p>
    <p>Hotels will be built in Kapilvastu.</p>`,
    categoryId: economy.id,
    authorId: author2.id,
    province: Province.PROVINCE_5,
  });

  // Province 6 - Karnali
  await createArticle({
    slug: "province-6-mining-exploration",
    coverImageUrl: images.economy1,
    coverImageFilename: "province6-mining.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण",
    titleEn: "Mineral Exploration in Karnali Province",
    excerptNe: "कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण कार्य शुरु भएको छ।",
    excerptEn: "Mineral exploration work has begun in Karnali Province.",
    contentNe: `<p>कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण कार्य शुरु भएको छ।</p>
    <p>छोरला क्षेत्रमा तामा र सुनको खोजी भइरहेको छ।</p>`,
    contentEn: `<p>Mineral exploration work has begun in Karnali Province.</p>
    <p>Exploration for copper and gold is underway in Chhetra area.</p>`,
    categoryId: economy.id,
    authorId: author1.id,
    province: Province.PROVINCE_6,
  });

  // Province 7 - Sudurpashchim
  await createArticle({
    slug: "province-7-border-trade",
    coverImageUrl: images.economy1,
    coverImageFilename: "province7-trade.jpg",
    uploadedById: superAdmin.id,
    titleNe: "सुदूरपश्चिम प्रदेशमा सीमा व्यापार वृद्धि",
    titleEn: "Border Trade Increases in Sudurpashchim Province",
    excerptNe: "सुदूरपश्चिम प्रदेशमा ��ा��तसँगको सीमा व्यापार बढेको छ।",
    excerptEn:
      "Border trade with India has increased in Sudurpashchim Province.",
    contentNe: `<p>सुदूरपश्चिम प्रदेशमा भारतसँगको सीमा व्यापार बढेको छ।</p>
    <p>दार्चुला नाकाबाट आयात निर्यात बढेको छ।</p>`,
    contentEn: `<p>Border trade with India has increased in Sudurpashchim Province.</p>
    <p>Import-export has increased through Darcula border point.</p>`,
    categoryId: economy.id,
    authorId: author1.id,
    province: Province.PROVINCE_7,
  });

  console.log("  ✓ Province articles seeded");

  // ═══════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════

  console.log("💬 Seeding comments...\n");

  const comments = [
    // Comments on politics article 1 (budget)
    {
      articleSlug: "nepal-government-new-budget-2082",
      userId: publicUser1.id,
      content:
        "यो बजेट किसानहरूको लागि राम्रो छ। कृषिमा लगानी बढाउनु राम्रो कदम हो।",
      contentEn:
        "This budget is good for farmers. Increasing investment in agriculture is a good step.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-government-new-budget-2082",
      userId: publicUser2.id,
      content: "बजेट राम्रो छ तर कार्यान्वयन कसरी होला?",
      contentEn: "The budget looks good, but how will the implementation work?",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-government-new-budget-2082",
      userId: publicUser3.id,
      content: "स्वास्थ्य र शिक्षामा थप बजेट हुनुप्थ्यो।",
      contentEn: "There should be more budget for health and education.",
      status: CommentStatus.PENDING,
    },
    // Comments on politics article 2 (parliament)
    {
      articleSlug: "parliament-session-citizenship-bill-debate",
      userId: publicUser4.id,
      content: "नागरिकता विधेयक छिटो पास होस्।",
      contentEn: "The citizenship bill should be passed quickly.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "parliament-session-citizenship-bill-debate",
      userId: publicUser1.id,
      content: "महिलाहरूको हकमा केही कडा प्रावधान हुनुपर्छ।",
      contentEn: "There should be stricter provisions for women's rights.",
      status: CommentStatus.APPROVED,
    },
    // Comments on sports article (cricket)
    {
      articleSlug: "nepal-cricket-defeats-uae-t20-2082",
      userId: publicUser2.id,
      content: "शानदार जित! नेपाली क्रिकेटले अब अर्को स्तरमा जानेछ।",
      contentEn: "Great win! Nepali cricket will now reach another level.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-cricket-defeats-uae-t20-2082",
      userId: publicUser3.id,
      content: "सन्डी र सुबेदारले राम्रो खेले।",
      contentEn: "Sandeep and Subed played well.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-cricket-defeats-uae-t20-2082",
      userId: publicUser4.id,
      content: "यो खेलाडीलाई राष्ट्रिय टिममा लिनुपर्छ।",
      contentEn: "This player should be taken to the national team.",
      status: CommentStatus.PENDING,
    },
    // Comments on technology article (fintech)
    {
      articleSlug: "nepal-fintech-startup-raises-50-million",
      userId: publicUser1.id,
      content: "नेपाली स्टार्टअपहरूले देशको नाम उच्च राखे।",
      contentEn: "Nepali startups have kept the country's name high.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-fintech-startup-raises-50-million",
      userId: publicUser2.id,
      content: "फिनटेक क्षेत्रमा रोजगारी बढ्नेछ।",
      contentEn: "Employment will increase in the fintech sector.",
      status: CommentStatus.APPROVED,
    },
    // Comments on economy article (NEPSE)
    {
      articleSlug: "nepse-index-record-high-bull-market",
      userId: publicUser3.id,
      content: "बजार राम्रो छ। लगानीकर्ताहरू खुशी छन्।",
      contentEn: "The market is good. Investors are happy.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepse-index-record-high-bull-market",
      userId: publicUser4.id,
      content: "सावधान! बुल मार्केटपछि बेयर मार्केट आउन सक्छ।",
      contentEn: "Be careful! Bear market can come after bull market.",
      status: CommentStatus.APPROVED,
    },
    // Comments on entertainment article (film)
    {
      articleSlug: "nepali-film-loot-3-release-date",
      userId: publicUser1.id,
      content: "लुट 3 को प्रतीक्षामा छु।",
      contentEn: "Waiting for Loot 3.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepali-film-loot-3-release-date",
      userId: publicUser2.id,
      content: "निर्मातालाई धन्यवाद।",
      contentEn: "Thanks to the producer.",
      status: CommentStatus.PENDING,
    },
    // Comments on world article (UN aid)
    {
      articleSlug: "united-nations-nepal-development-aid",
      userId: publicUser3.id,
      content: "संयुक्त राष्ट्र संघले नेपाललाई सहायता गर्नु राम्रो हो।",
      contentEn: "It's good that the UN is providing aid to Nepal.",
      status: CommentStatus.APPROVED,
    },
    // Comments on society article (education)
    {
      articleSlug: "nepal-education-reform-new-curriculum",
      userId: publicUser4.id,
      content: "पाठ्यक्रम सुधार राम्रो कदम हो।",
      contentEn: "Curriculum reform is a good step.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-education-reform-new-curriculum",
      userId: publicUser1.id,
      content: "शिक्षकहरूलाई तालिम चाहिन्छ।",
      contentEn: "Teachers need training.",
      status: CommentStatus.REJECTED,
    },
    // Comments on sports article (football)
    {
      articleSlug: "saff-championship-nepal-football-camp-2082",
      userId: publicUser2.id,
      content: "नेपाली फुटबलको भविष्य उज्ज्वल छ।",
      contentEn: "The future of Nepali football is bright.",
      status: CommentStatus.APPROVED,
    },
    // Comments on society article (health insurance)
    {
      articleSlug: "nepal-health-insurance-expansion-2082",
      userId: publicUser3.id,
      content: "स्वास्थ्य बिमा सबैका लागि पहुँचयोग्य हुनुपर्छ।",
      contentEn: "Health insurance should be accessible to all.",
      status: CommentStatus.APPROVED,
    },
    {
      articleSlug: "nepal-health-insurance-expansion-2082",
      userId: publicUser4.id,
      content: "गरिबहरूलाई निःशुल्क बिमा चाहिन्छ।",
      contentEn: "Poor people need free insurance.",
      status: CommentStatus.PENDING,
    },
  ];

  for (const comment of comments) {
    const article = getArticle(comment.articleSlug);
    if (article) {
      await prisma.comment.upsert({
        where: { id: `seed-comment-${comments.indexOf(comment)}` },
        update: {},
        create: {
          id: `seed-comment-${comments.indexOf(comment)}`,
          content: `${comment.contentEn} | ${comment.content}`,
          status: comment.status,
          articleId: article.id,
          userId: comment.userId,
        },
      });
    }
  }

  console.log(`✅ Comments: ${comments.length} created`);

  // ═══════════════════════════════════════════
  // SITE SETTINGS
  // ═══════════════════════════════════════════

  await Promise.all([
    prisma.siteSetting.upsert({
      where: { key: "siteName" },
      update: {},
      create: { key: "siteName", value: "Nepal News Portal" },
    }),
    prisma.siteSetting.upsert({
      where: { key: "siteNameNe" },
      update: {},
      create: { key: "siteNameNe", value: "नेपाल न्युज पोर्टल" },
    }),
    prisma.siteSetting.upsert({
      where: { key: "autoApproveComments" },
      update: {},
      create: { key: "autoApproveComments", value: "false" },
    }),
    prisma.siteSetting.upsert({
      where: { key: "maxReportsBeforeHide" },
      update: {},
      create: { key: "maxReportsBeforeHide", value: "5" },
    }),
    prisma.siteSetting.upsert({
      where: { key: "defaultLanguage" },
      update: {},
      create: { key: "defaultLanguage", value: "NEPALI" },
    }),
    prisma.siteSetting.upsert({
      where: { key: "facebookUrl" },
      update: {},
      create: {
        key: "facebookUrl",
        value: "https://facebook.com/nepalnewsportal",
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: "twitterUrl" },
      update: {},
      create: {
        key: "twitterUrl",
        value: "https://twitter.com/nepalnewsportal",
      },
    }),
  ]);

  console.log("\n✅ Site settings: created");

  // ═══════════════════════════════════════════
  // VIDEOS
  // ═══════════════════════════════════════════

  console.log("🎥 Seeding videos...\n");

  const videos = [
    {
      id: "seed-video-1",
      titleNe: "नेपालको सुन्दरता: एक वृत्तान्त",
      titleEn: "Beauty of Nepal: A Documentary",
      youtubeId: "dQw4w9WgXcQ",
    },
    {
      id: "seed-video-2",
      titleNe: "नेपाली क्रिकेट टिमको सफलता",
      titleEn: "Nepal Cricket Team Success Story",
      youtubeId: "JGwWNGJdvx8",
    },
    {
      id: "seed-video-3",
      titleNe: "काठमाडौंको भिडियो टुर",
      titleEn: "Kathmandu City Tour",
      youtubeId: "9bZkp7q19f0",
    },
    {
      id: "seed-video-4",
      titleNe: "नेपालको पर्वतीय चार्टर पाइलट",
      titleEn: "Himalayan Mountain Flight Experience",
      youtubeId: "3tmd-ClpJxA",
    },
    {
      id: "seed-video-5",
      titleNe: "पोखरा भिडियो गाइड",
      titleEn: "Pokhara Travel Guide",
      youtubeId: "6mT_-P4Pj3w",
    },
    {
      id: "seed-video-6",
      titleNe: "नेपाली खाना: स्वादिष्ट परम्परा",
      titleEn: "Nepali Cuisine: Delicious Traditions",
      youtubeId: "hVKsG6p3e9w",
    },
    {
      id: "seed-video-7",
      titleNe: "मनमोहन हाइड्रोपावर परियोजना",
      titleEn: "Manmohan Hydropower Project",
      youtubeId: "kJQP7kiw7Fk",
    },
    {
      id: "seed-video-8",
      titleNe: "सगरमाथा चढाई कथा",
      titleEn: "Mount Everest Climbing Story",
      youtubeId: "2vjPBrBU-TM",
    },
    {
      id: "seed-video-9",
      titleNe: "लुम्बिनी: बुद्धको जन्मस्थल",
      titleEn: "Lumbini: Birthplace of Buddha",
      youtubeId: "Cd_2B-t1g5g",
    },
    {
      id: "seed-video-10",
      titleNe: "नेपाली संगीत र संस्कृति",
      titleEn: "Nepali Music and Culture",
      youtubeId: "fJ9rUzIMcZQ",
    },
  ];

  for (const video of videos) {
    await prisma.video.upsert({
      where: { id: video.id },
      update: {},
      create: {
        id: video.id,
        titleNe: video.titleNe,
        titleEn: video.titleEn,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
        thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
        iframeUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
        authorId: author1.id,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }

  console.log(`✅ Videos: ${videos.length} created`);

  // ═══════════════════════════════════════════
  // HOROSCOPES
  // ═══════════════════════════════════════════

  console.log("🔮 Seeding horoscopes...\n");

  const zodiacSigns = [
    { sign: "aries", symbol: "♈", element: "Fire", icon: "Flame" },
    { sign: "taurus", symbol: "♉", element: "Earth", icon: "Mountain" },
    { sign: "gemini", symbol: "♊", element: "Air", icon: "Cloud" },
    { sign: "cancer", symbol: "♋", element: "Water", icon: "Moon" },
    { sign: "leo", symbol: "♌", element: "Fire", icon: "Sun" },
    { sign: "virgo", symbol: "♍", element: "Earth", icon: "Wheat" },
    { sign: "libra", symbol: "♎", element: "Air", icon: "Scale" },
    { sign: "scorpio", symbol: "♏", element: "Water", icon: "Bug" },
    { sign: "sagittarius", symbol: "♐", element: "Fire", icon: "Target" },
    { sign: "capricorn", symbol: "♑", element: "Earth", icon: "MountainSnow" },
    { sign: "aquarius", symbol: "♒", element: "Air", icon: "Droplets" },
    { sign: "pisces", symbol: "♓", element: "Water", icon: "Fish" },
  ];

  const horoscopeTitles: Record<string, { ne: string; en: string }> = {
    aries: { ne: "मेष राशि", en: "Aries" },
    taurus: { ne: "वृष राशि", en: "Taurus" },
    gemini: { ne: "मिथुन राशि", en: "Gemini" },
    cancer: { ne: "कर्क राशि", en: "Cancer" },
    leo: { ne: "सिंह राशि", en: "Leo" },
    virgo: { ne: "कन्या राशि", en: "Virgo" },
    libra: { ne: "तुला राशि", en: "Libra" },
    scorpio: { ne: "वृश्चिक राशि", en: "Scorpio" },
    sagittarius: { ne: "धनु राशि", en: "Sagittarius" },
    capricorn: { ne: "मकर राशि", en: "Capricorn" },
    aquarius: { ne: "कुम्भ राशि", en: "Aquarius" },
    pisces: { ne: "मीन राशि", en: "Pisces" },
  };

  const horoscopeContents: Record<string, { ne: string; en: string }> = {
    aries: {
      ne: "आज तपाईंले आफ्नो करियरमा नयाँ अवसर पाउन सक्नुहुन्छ। व्यापारिक क्षेत्रमा सकारात्मक परिणाम आउने छ। प्रेम जीवनमा मधुर क्षणहरू छन्।",
      en: "Today you may receive new opportunities in your career. Positive results are expected in business. Sweet moments await in your love life.",
    },
    taurus: {
      ne: "आज तपाईंको वित्तीय स्थिति बलियो हुनेछ। नयाँ लगानी राम्रो प्रतिफल दिनेछ। परिवारसँगको समय मूल्यवान हो।",
      en: "Today your financial position will be strong. New investments will yield good returns. Time with family is precious.",
    },
    gemini: {
      ne: "आज तपाईंको सञ्चार कौशल चम्किनेछ। व्यापारिक वार्तालाप सफल हुनेछ। शैक्षिक क्षेत्रमा सफलता मिल्नेछ।",
      en: "Today your communication skills will shine. Business negotiations will be successful. Success in education is expected.",
    },
    cancer: {
      ne: "आज तपाईंको भावनात्मक स्थिति स्थिर रहनेछ। परिवार र मित्रहरूबाट सहयोग मिल्नेछ। स्वास्थ्य राम्रो रहनेछ।",
      en: "Today your emotional state will be stable. Support from family and friends is expected. Health will be good.",
    },
    leo: {
      ne: "आज तपाईंको नेतृत्व क्षमता चम्किनेछ। काममा मान्यता मिल्नेछ। प्रेम जीवनमा रोमान्टिक क्षणहरू छन्।",
      en: "Today your leadership abilities will shine. Recognition at work is expected. Romantic moments await in love.",
    },
    virgo: {
      ne: "आज तपाईंको विश्लेषणात्मक सोचाइले काममा सफलता दिनेछ। स्वास्थ्यमा ध्यान दिनुहोस्। आर्थिक बचत बढ्नेछ।",
      en: "Today your analytical thinking will bring success at work. Pay attention to health. Savings will increase.",
    },
    libra: {
      ne: "आज तपाईंको सामाजिक जीवन सक्रिय हुनेछ। व्यापारिक साझेदारी लाभदायक हुनेछ। मानसिक शांति मिल्नेछ।",
      en: "Today your social life will be active. Business partnerships will be beneficial. Mental peace is expected.",
    },
    scorpio: {
      ne: "आज तपाईंको गहिरो भावनाहरूले तपाईंलाई शक्ति दिनेछ। रहस्यमय अवसरहरू आउन सक्नुहुन्छ। आर्थिक लाभ हुनेछ।",
      en: "Today your deep emotions will give you strength. Mysterious opportunities may arise. Financial gain is expected.",
    },
    sagittarius: {
      ne: "आज तपाईंको साहसिक भावना तपाईंलाई नयाँ ठाउँमा लैजानेछ। यात्रा राम्रो हुनेछ। शैक्षिक सफलता मिल्नेछ।",
      en: "Today your adventurous spirit will take you to new places. Travel will be rewarding. Educational success is expected.",
    },
    capricorn: {
      ne: "आज तपाईंको कठोर परिश्रमको फल मिल्नेछ। पदोन्नति र आर्थिक वृद्धि हुनेछ। परिवारमा खुशी।",
      en: "Today your hard work will pay off. Promotion and financial growth are expected. Happiness in family.",
    },
    aquarius: {
      ne: "आज तपाईंको अद्वितीय विचारहरूले तपाईंलाई अलग बनाउनेछ। नवीन परियोजनाहरू सफल हुनेछ। सामाजिक कार्यमा सहभागिता।",
      en: "Today your unique ideas will set you apart. Innovative projects will be successful. Participation in social causes.",
    },
    pisces: {
      ne: "आज तपाईंको कल्पनाशील प्रवृत्ति तपाईंलाई सिर्जनात्मक कार्यमा मार्गदर्शन गर्नेछ। आध्यात्मिक विकास हुनेछ।",
      en: "Today your imaginative nature will guide you in creative work. Spiritual development is expected.",
    },
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const { sign, symbol, element, icon } of zodiacSigns) {
    const id = `seed-horoscope-${sign}`;
    await prisma.horoscope.upsert({
      where: { id },
      update: { icon }, // Update icon if it has changed
      create: {
        id,
        zodiacSign: sign,
        icon,
        titleNe: horoscopeTitles[sign].ne,
        titleEn: horoscopeTitles[sign].en,
        contentNe: horoscopeContents[sign].ne,
        contentEn: horoscopeContents[sign].en,
        date: today,
        isPublished: true,
        authorId: author1.id,
      },
    });
  }

  console.log(`✅ Horoscopes: ${zodiacSigns.length} zodiac signs seeded`);

  // ═══════════════════════════════════════════
  // ADVERTISEMENTS
  // ═══════════════════════════════════════════

  console.log("📢 Seeding ads...\n");

  const advertisements = [
    {
      id: "seed-ad-1",
      titleNe: "विशेष अफर - २०% छुट",
      titleEn: "Special Offer - 20% Off",
      mediaUrl:
        "https://images.unsplash.com/photo-1593642532400-2682810df593?w=800&q=80",
      linkUrl: "https://example.com/shop",
      position: "SIDEBAR_TOP",
    },
    {
      id: "seed-ad-2",
      titleNe: "नयाँ स्मार्टफोन खरिद गर्नुहोस्",
      titleEn: "Buy New Smartphones",
      mediaUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
      linkUrl: "https://example.com/phones",
      position: "SIDEBAR_BOTTOM",
    },
    {
      id: "seed-ad-3",
      titleNe: "शैक्षिक कार्यक्रम - निःशुल्क कोर्स",
      titleEn: "Educational Program - Free Courses",
      mediaUrl:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&q=80",
      linkUrl: "https://example.com/education",
      position: "HEADER",
    },
    {
      id: "seed-ad-4",
      titleNe: "स्वास्थ्य बीमा योजना",
      titleEn: "Health Insurance Plan",
      mediaUrl:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
      linkUrl: "https://example.com/insurance",
      position: "FOOTER",
    },
    {
      id: "seed-ad-5",
      titleNe: "होटल बुकिङ अफर",
      titleEn: "Hotel Booking Offer",
      mediaUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      linkUrl: "https://example.com/hotels",
      position: "ARTICLE_BOTTOM",
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
        mediaType: "image/jpeg",
        linkUrl: ad.linkUrl,
        position: ad.position,
        isActive: true,
        createdBy: superAdmin.id,
      },
    });
  }

  console.log(`✅ Advertisements: ${advertisements.length} created`);

  // ═══════════════════════════════════════════
  // FLASH UPDATES
  // ═══════════════════════════════════════════

  console.log("⚡ Seeding flash updates...\n");

  const flashUpdates = [
    {
      id: "seed-flash-1",
      titleNe: "ताजा अपडेट: पहाडी भेगमा वर्षाको सम्भावना",
      titleEn: "Flash Update: Rain Expected in Hilly Regions",
      contentNe:
        "जल तथा मौसम विज्ञान विभागका अनुसार आगामी २४ घण्टामा पहाडी भू-भागमा हल्का वर्षा हुने सम्भावना छ।",
      contentEn:
        "According to the Department of Hydrology and Meteorology, light rain is expected in hilly regions in the next 24 hours.",
      slug: "rain-expected-hilly-regions",
    },
    {
      id: "seed-flash-2",
      titleNe: "काठमाडौंमा सवारी जाम",
      titleEn: "Traffic Jam in Kathmandu",
      contentNe:
        "काठमाडौंको बुद्धनगर क्षेत्रमा सवारी जाम भएको छ। यातायात प्राधिकरणले मंगलबारसम्म समस्या समाधान हुने बताएको छ।",
      contentEn:
        "Traffic jam reported in Kathmandu's Budhanagar area. Traffic Department says the issue will be resolved by Tuesday.",
      slug: "traffic-jam-kathmandu",
    },
    {
      id: "seed-flash-3",
      titleNe: "विद्युत् आपूर्ति सामान्य",
      titleEn: "Electricity Supply Normal",
      contentNe:
        "नेपाल विद्युत् प्राधिकरणले आजदेखि देशभरि विद्युत् आपूर्ति सामान्य हुने जानकारी दिएको छ।",
      contentEn:
        "Nepal Electricity Authority has informed that electricity supply will be normal across the country from today.",
      slug: "electricity-supply-normal",
    },
    {
      id: "seed-flash-4",
      titleNe: "मौसम पूर्वानुमान: देशभरि साँझमा वर्षा",
      titleEn: "Weather Forecast: Rain Expected Nationwide Tonight",
      contentNe:
        "मौसम पूर्वानुमान केन्द्रका अनुसार आज साँझदेखि देशभरि हल्कादेखि मध्यम वर्षा हुने सम्भावना छ।",
      contentEn:
        "According to the Meteorological Forecasting Center, light to moderate rain is expected across the country from tonight.",
      slug: "weather-forecast-rain-tonight",
    },
    {
      id: "seed-flash-5",
      titleNe: "काठमाडौं–पोखरा हवाई उडान सामान्य",
      titleEn: "Kathmandu-Pokhara Flights Normal",
      contentNe:
        "हिमानी हवाई कम्पनीले काठमाडौं–पोखरा उडानहरू सामान्य रूपमा सञ्चालन भइरहेको जनाएको छ।",
      contentEn:
        "Himali Airlines has stated that Kathmandu-Pokhara flights are operating normally.",
      slug: "kathmandu-pokhara-flights-normal",
    },
    {
      id: "seed-flash-6",
      titleNe: "भिसा सेवा सामान्य",
      titleEn: "Visa Services Normal",
      contentNe:
        "नेपाल भिसा आवेदन केन्द्रले सबै भिसा सेवा सामान्य रूपमा सञ्चालन भइरहेको जानकारी दिएको छ।",
      contentEn:
        "Nepal Visa Application Center has informed that all visa services are operating normally.",
      slug: "visa-services-normal",
    },
    {
      id: "seed-flash-7",
      titleNe: "सिनामंगलमा खुलाे बजार",
      titleEn: "Open Market in Sinamangal",
      contentNe: "काठमाडौंको सिनामंगलमा आज विशेष खुला बजार लागिएको छ।",
      contentEn:
        "A special open market has been set up in Kathmandu's Sinamangal today.",
      slug: "open-market-sinamangal",
    },
    {
      id: "seed-flash-8",
      titleNe: "ट्राफिक जाम: थापाथली क्षेत्र",
      titleEn: "Traffic Jam: Thapathali Area",
      contentNe:
        "थापाथली क्रसरोडमा सवारी जाम भएको छ। प्रहरीले वैकल्पिक मार्ग प्रयोग गर्न अनुरोध गरेको छ।",
      contentEn:
        "Traffic jam reported at Thapathali crossroads. Police has requested commuters to use alternative routes.",
      slug: "traffic-jam-thapathali",
    },
    {
      id: "seed-flash-9",
      titleNe: "शेयर बजार उत्साहजनक",
      titleEn: "Stock Market Enthusiastic",
      contentNe: "आजको शेयर बजार उत्साहजनक छ। नेप्से सूचकांक २० अंकले बढेको छ।",
      contentEn:
        "Today's stock market is enthusiastic. NEPSE index has increased by 20 points.",
      slug: "stock-market-up",
    },
    {
      id: "seed-flash-10",
      titleNe: "सोलुखम्बुकाे पर्यटक प्रवर्धन",
      titleEn: "Solukhumbu Tourism Promotion",
      contentNe: "सोलुखम्बु जिल्लामा पर्यटक प्रवर्धन अभियान सुरु भएको छ।",
      contentEn:
        "Tourism promotion campaign has started in Solukhumbu district.",
      slug: "solukhumbu-tourism-campaign",
    },
  ];

  for (const flash of flashUpdates) {
    await prisma.flashUpdate.upsert({
      where: { id: flash.id },
      update: {},
      create: {
        id: flash.id,
        titleNe: flash.titleNe,
        titleEn: flash.titleEn,
        contentNe: flash.contentNe,
        contentEn: flash.contentEn,
        slug: flash.slug,
        isPublished: true,
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        authorId: author1.id,
      },
    });
  }

  console.log(`✅ Flash Updates: ${flashUpdates.length} created`);

  // ═══════════════════════════════════════════
  // POLLS
  // ═══════════════════════════════════════════

  console.log("📊 Seeding polls...\n");

  // Create an active poll
  const poll = await prisma.poll.upsert({
    where: { id: "seed-poll-1" },
    update: {},
    create: {
      id: "seed-poll-1",
      questionNe: "आगामी निर्वाचनमा कुन दलले बहुमत प्राप्त गर्ला?",
      questionEn: "Which party will get majority in the upcoming election?",
      description: "यस पोलमा आफ्नो राय दिनुहोस्।",
      isActive: true,
      isMultiple: false,
      startsAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  // Create poll options
  const pollOptions = [
    { textNe: "नेपाली कांग्रेस", textEn: " Nepali Congress", order: 1 },
    { textNe: "नेकपा एमाले", textEn: "CPN-UML", order: 2 },
    { textNe: "नेकपा माओवादी केन्द्र", textEn: "CPN-Maoist Centre", order: 3 },
    {
      textNe: "राष्ट्रिय स्वतन्त्र पार्टी",
      textEn: "Rastriya Swatantra Party",
      order: 4,
    },
    { textNe: "अन्य", textEn: "Others", order: 5 },
  ];

  const createdOptions = [];
  for (const option of pollOptions) {
    const createdOption = await prisma.pollOption.upsert({
      where: { id: `seed-poll-option-${option.order}` },
      update: {},
      create: {
        id: `seed-poll-option-${option.order}`,
        textNe: option.textNe,
        textEn: option.textEn,
        order: option.order,
        pollId: poll.id,
      },
    });
    createdOptions.push(createdOption);
  }

  // Add some initial votes
  const initialVotes = [
    { optionIndex: 0, userId: publicUser1.id }, // Nepali Congress
    { optionIndex: 1, userId: publicUser2.id }, // CPN-UML
    { optionIndex: 1, userId: publicUser3.id }, // CPN-UML
    { optionIndex: 2, userId: publicUser4.id }, // CPN-Maoist Centre
    { optionIndex: 0, userId: author1.id }, // Nepali Congress
  ];

  for (const vote of initialVotes) {
    const option = createdOptions[vote.optionIndex];
    await prisma.pollVote.upsert({
      where: { id: `seed-poll-vote-${initialVotes.indexOf(vote)}` },
      update: {},
      create: {
        id: `seed-poll-vote-${initialVotes.indexOf(vote)}`,
        pollId: poll.id,
        optionId: option.id,
        userId: vote.userId,
      },
    });
  }

  console.log(
    `✅ Poll: 1 active poll with ${pollOptions.length} options and ${initialVotes.length} initial votes`,
  );

  // ═══════════════════════════════════════════
  // SPORTS SUBCATEGORIES
  // ═══════════════════════════════════════════

  const cricket = await prisma.category.upsert({
    where: { slug: "cricket" },
    update: { parentId: sports.id },
    create: {
      nameNe: "क्रिकेट",
      nameEn: "Cricket",
      slug: "cricket",
      parentId: sports.id,
    },
  });
  const football = await prisma.category.upsert({
    where: { slug: "football" },
    update: { parentId: sports.id },
    create: {
      nameNe: "फुटबल",
      nameEn: "Football",
      slug: "football",
      parentId: sports.id,
    },
  });
  const volleyball = await prisma.category.upsert({
    where: { slug: "volleyball" },
    update: { parentId: sports.id },
    create: {
      nameNe: "भलिवल",
      nameEn: "Volleyball",
      slug: "volleyball",
      parentId: sports.id,
    },
  });
  const basketball = await prisma.category.upsert({
    where: { slug: "basketball" },
    update: { parentId: sports.id },
    create: {
      nameNe: "बास्केटबल",
      nameEn: "Basketball",
      slug: "basketball",
      parentId: sports.id,
    },
  });
  const hockey = await prisma.category.upsert({
    where: { slug: "hockey" },
    update: { parentId: sports.id },
    create: {
      nameNe: "हक्की",
      nameEn: "Hockey",
      slug: "hockey",
      parentId: sports.id,
    },
  });

  console.log("✅ Sports Subcategories: 5 created");

  // Sports images
  const sportsImages = {
    cricket1:
      "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=1200&q=80",
    cricket2:
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&q=80",
    cricket3:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&q=80",
    football1:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80",
    football2:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
    football3:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
    volleyball1:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=1200&q=80",
    volleyball2:
      "https://images.unsplash.com/photo-1592655596760-0f3d3270e2e1?w=1200&q=80",
    basketball1:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
    hockey1:
      "https://images.unsplash.com/photo-1515703403366-26c933a60058?w=1200&q=80",
  };

  // Helper for sports articles
  async function createSportsArticle({
    slug,
    titleNe,
    titleEn,
    excerptNe,
    excerptEn,
    contentNe,
    contentEn,
    categoryId,
    imageUrl,
    imageFilename,
    isFeatured = false,
  }: any) {
    let media = await prisma.media.findFirst({
      where: { filename: imageFilename },
    });
    if (!media) {
      media = await prisma.media.create({
        data: {
          filename: imageFilename,
          url: imageUrl,
          type: MediaType.IMAGE,
          altText: titleEn,
          size: 350000,
          uploadedBy: superAdmin.id,
        },
      });
    }
    await prisma.article.upsert({
      where: { slug },
      update: {
        titleNe,
        titleEn,
        contentNe,
        contentEn,
        excerptNe,
        excerptEn,
        status: ArticleStatus.PUBLISHED,
        isFeatured,
        categoryId,
        authorId: author2.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
      create: {
        titleNe,
        titleEn,
        contentNe,
        contentEn,
        excerptNe,
        excerptEn,
        slug,
        status: ArticleStatus.PUBLISHED,
        isFeatured,
        categoryId,
        authorId: author2.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
    });
  }

  // Cricket articles
  await createSportsArticle({
    slug: "nepal-cricket-team-qualifies-asia-cup-2082",
    titleNe: "नेपाली क्रिकेट टोली एसिया कपमा छानिए, ऐतिहासिक उपलब्धि",
    titleEn: "Nepal Cricket Team Qualifies for Asia Cup, Historic Achievement",
    excerptNe: "नेपाली क्रिकेट टोली पहिलो पटक एसिया कपमा छानिएको छ।",
    excerptEn:
      "The Nepal cricket team has qualified for the Asia Cup for the first time.",
    contentNe:
      "<p>काठमाडौं। नेपाली राष्ट्रिय क्रिकेट टोली पहिलो पटक एसिया कपमा छानिएको छ।</p><p>यो नेपाली क्रिकेटको इतिहासमा सबैभन्दा ठूलो उपलब्धि हो।</p>",
    contentEn:
      "<p>Kathmandu. The Nepal national cricket team has qualified for the Asia Cup for the first time.</p><p>This is the biggest achievement in Nepal cricket history.</p>",
    categoryId: cricket.id,
    imageUrl: sportsImages.cricket1,
    imageFilename: "asia-cup-qualification.jpg",
    isFeatured: true,
  });
  await createSportsArticle({
    slug: "sandeep-lamichhane-wpl-draft-2082",
    titleNe: "सन्दीप लामिछानेले डब्ल्यूपिएल ड्राफ्टमा छनोट भए",
    titleEn: "Sandeep Lamichhane Selected in WPL Draft",
    excerptNe:
      "नेपालका प्रसिद्ध लेग स्पिनर सन्दीप लामिछाने डब्ल्यूपिएल ड्राफ्टमा छानिएका छन्।",
    excerptEn: "Nepal's leg-spinner Sandeep Lamichhane selected in WPL draft.",
    contentNe: "<p>सन्दीप लामिछाने डब्ल्यूपिएलमा छानिएका छन्।</p>",
    contentEn: "<p>Sandeep Lamichhane has been selected in the WPL.</p>",
    categoryId: cricket.id,
    imageUrl: sportsImages.cricket2,
    imageFilename: "lamichhane-wpl.jpg",
  });
  await createSportsArticle({
    slug: "nepal-u19-cricket-team-wins-tournament",
    titleNe: "नेपाल यु-१९ क्रिकेट टोलीले टूर्नामेंट जित्यो",
    titleEn: "Nepal U19 Cricket Team Wins Tournament",
    excerptNe: "नेपालको यु-१९ क्रिकेट टोलीले टूर्नामेंट जितेको छ।",
    excerptEn: "Nepal's U19 cricket team has won the tournament.",
    contentNe: "<p>नेपालको यु-१९ क्रिकेट टोलीले टूर्नामेंट जितेको छ।</p>",
    contentEn: "<p>Nepal's U19 cricket team has won the tournament.</p>",
    categoryId: cricket.id,
    imageUrl: sportsImages.cricket3,
    imageFilename: "u19-cricket-win.jpg",
  });

  // Football articles
  await createSportsArticle({
    slug: "nepal-national-football-team-fifa-rankings",
    titleNe: "नेपाली फुटबल टोलीको फिफा र्याङ्किङ सुधार",
    titleEn: "Nepal National Football Team FIFA Rankings Improve",
    excerptNe: "नेपाली फुटबल टोलीको फिफा र्याङ्किङमा सुधार भएको छ।",
    excerptEn: "Nepal football team's FIFA rankings have improved.",
    contentNe: "<p>नेपाली फुटबल टोलीको फिफा र्याङ्किङ सुधार भएको छ।</p>",
    contentEn: "<p>Nepal football team's FIFA rankings have improved.</p>",
    categoryId: football.id,
    imageUrl: sportsImages.football1,
    imageFilename: "football-rankings.jpg",
    isFeatured: true,
  });
  await createSportsArticle({
    slug: "dashrath-stadium-renovation-complete",
    titleNe: "दशरथ रङ्गशालाको सुधार कार्य पूरा",
    titleEn: "Dashrath Stadium Renovation Complete",
    excerptNe: "दशरथ रङ्गशालाको सुधार कार्य पूरा भएको छ।",
    excerptEn: "Dashrath Stadium renovation is complete.",
    contentNe: "<p>दशरथ रङ्गशालाको सुधार कार्य पूरा भएको छ।</p>",
    contentEn: "<p>Dashrath Stadium renovation is complete.</p>",
    categoryId: football.id,
    imageUrl: sportsImages.football2,
    imageFilename: "dashrath-renovation.jpg",
  });
  await createSportsArticle({
    slug: "nepal-youth-football-academy-opens",
    titleNe: "नेपालमा नयाँ युवा फुटबल एकेडेमी खुला",
    titleEn: "New Youth Football Academy Opens in Nepal",
    excerptNe: "काठमाडौंमा नयाँ युवा फुटबल एकेडेमी खुला भएको छ।",
    excerptEn: "A new youth football academy has opened in Kathmandu.",
    contentNe: "<p>नयाँ युवा फुटबल एकेडेमी खुला भएको छ।</p>",
    contentEn: "<p>A new youth football academy has opened.</p>",
    categoryId: football.id,
    imageUrl: sportsImages.football3,
    imageFilename: "football-academy.jpg",
  });

  // Volleyball articles
  await createSportsArticle({
    slug: "nepal-volleyball-team-south-asian-games",
    titleNe: "नेपाली भलिवल टोली दक्षिण एशियाली खेलहरूमा",
    titleEn: "Nepal Volleyball Team at South Asian Games",
    excerptNe: "नेपाली भलिवल टोली दक्षिण एशियाली खेलहरूमा भाग लिन तयार छ।",
    excerptEn: "Nepal volleyball team ready for South Asian Games.",
    contentNe: "<p>नेपाली भलिवल टोली तयारीमा छ।</p>",
    contentEn: "<p>Nepal volleyball team is preparing.</p>",
    categoryId: volleyball.id,
    imageUrl: sportsImages.volleyball1,
    imageFilename: "volleyball-sag.jpg",
  });
  await createSportsArticle({
    slug: "nepal-womens-volleyball-championship",
    titleNe: "नेपाल महिला भलिवल च्याम्पियनसिप आयोजना",
    titleEn: "Nepal Women's Volleyball Championship Organized",
    excerptNe: "नेपाल महिला भलिवल च्याम्पियनसिप काठमाडौंमा हुनेछ।",
    excerptEn: "Nepal Women's Volleyball Championship in Kathmandu.",
    contentNe: "<p>महिला भलिवल च्याम्पियनसिप आयोजना हुनेछ।</p>",
    contentEn: "<p>Women's volleyball championship to be organized.</p>",
    categoryId: volleyball.id,
    imageUrl: sportsImages.volleyball2,
    imageFilename: "womens-volleyball.jpg",
  });

  // Basketball articles
  await createSportsArticle({
    slug: "nepal-basketball-league-starts-2082",
    titleNe: "नेपाल बास्केटबल लिग सुरु",
    titleEn: "Nepal Basketball League Starts",
    excerptNe: "नेपाल बास्केटबल लिग सुरु भएको छ।",
    excerptEn: "The Nepal Basketball League has started.",
    contentNe: "<p>नेपाल बास्केटबल लिग सुरु भएको छ।</p>",
    contentEn: "<p>The Nepal Basketball League has started.</p>",
    categoryId: basketball.id,
    imageUrl: sportsImages.basketball1,
    imageFilename: "basketball-league.jpg",
  });

  // Hockey articles
  await createSportsArticle({
    slug: "nepal-field-hockey-team-training",
    titleNe: "नेपाल हक्की टोलीको अभ्यास शिविर सुरु",
    titleEn: "Nepal Hockey Team Training Camp Begins",
    excerptNe: "नेपाली हक्की टोलीको अभ्यास शिविर सुरु भएको छ।",
    excerptEn: "Nepal hockey team training camp has begun.",
    contentNe: "<p>हक्की टोलीको अभ्यास शिविर सुरु भएको छ।</p>",
    contentEn: "<p>Hockey team training camp has begun.</p>",
    categoryId: hockey.id,
    imageUrl: sportsImages.hockey1,
    imageFilename: "hockey-training.jpg",
  });

  console.log("✅ Sports Articles: 10 created");

  // ═══════════════════════════════════════════
  // TEAM MEMBERS
  // ═══════════════════════════════════════════

  const teamMembers = [
    {
      name: "Rajesh Sharma",
      nameNe: "राजेश शर्मा",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Head Coach - Cricket",
      designationNe: "प्रमुख प्रशिक्षक - क्रिकेट",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
      bio: "Former national cricket team captain with 15 years of coaching experience.",
      bioNe: "पूर्व राष्ट्रिय क्रिकेट कप्तान।",
      email: "rajesh.sharma@newsportal.com",
      phone: "+977-9851000001",
      order: 1,
    },
    {
      name: "Priya Rai",
      nameNe: "प्रिया राई",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Football Analyst",
      designationNe: "फुटबल विश्लेषक",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "UEFA certified football analyst.",
      bioNe: "यूईएफए प्रमाणित फुटबल विश्लेषक।",
      email: "priya.rai@newsportal.com",
      phone: "+977-9851000002",
      order: 2,
    },
    {
      name: "Amit Gurung",
      nameNe: "अमित गुरुङ",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Volleyball Correspondent",
      designationNe: "भलिवल संवाददाता",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      bio: "Covering volleyball for over 8 years.",
      bioNe: "भलिवल कवरेज विशेषज्ञ।",
      email: "amit.gurung@newsportal.com",
      phone: "+977-9851000003",
      order: 3,
    },
    {
      name: "Bikash Karki",
      nameNe: "विकाश कार्की",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Basketball Reporter",
      designationNe: "बास्केटबल रिपोर्टर",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
      bio: "Former college basketball player.",
      bioNe: "पूर्व कलेज बास्केटबल खेलाडी।",
      email: "bikash.karki@newsportal.com",
      phone: "+977-9851000004",
      order: 4,
    },
    {
      name: "Sita Thapa",
      nameNe: "सीता थापा",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Senior Sports Editor",
      designationNe: "वरिष्ठ खेलकुद सम्पादक",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Leading sports coverage.",
      bioNe: "प्रमुख खेलकुद कवरेज।",
      email: "sita.thapa@newsportal.com",
      phone: "+977-9851000005",
      order: 5,
    },
    {
      name: "Deepak Lama",
      nameNe: "दीपक लामा",
      department: "Sports",
      departmentNe: "खेलकुद",
      designation: "Hockey Expert",
      designationNe: "हक्की विशेषज्ञ",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
      bio: "Former national hockey player.",
      bioNe: "पूर्व राष्ट्रिय हक्की खेलाडी।",
      email: "deepak.lama@newsportal.com",
      phone: "+977-9851000006",
      order: 6,
    },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { email: member.email },
    });
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: member,
      });
    } else {
      await prisma.teamMember.create({ data: member });
    }
  }

  console.log("✅ Team Members: 6 created");

  // ═══════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════

  console.log("\n" + "═".repeat(50));
  console.log("🎉 Database seed completed successfully!");
  console.log("═".repeat(50));
  console.log("📊 Summary:");
  console.log(
    "   Users:         10  (1 superadmin + 5 authors + 4 public users)",
  );
  console.log("   Categories:    7 + 5 sports subcategories");
  console.log("   Tags:          15");
  console.log("   Articles:      20 + 10 sports articles");
  console.log("   Comments:      20  (with various statuses)");
  console.log("   Flash Updates: 10  (published with expiration)");
  console.log("   Videos:        10  (published)");
  console.log("   Horoscopes:    12  (all zodiac signs)");
  console.log("   Ads:           5");
  console.log("   Poll:          1   (active with 5 options)");
  console.log("   Team Members:  6");
  console.log("   Settings:      7");
  console.log("");
  console.log("🔑 Login credentials:");
  console.log("   SuperAdmin:    admin@example.com   / admin123");
  console.log(
    "   Authors:       rajesh@example.com, sita@example.com, bikash@example.com, priya@example.com, amit@example.com / author123",
  );
  console.log(
    "   Public Users:  ram@example.com, sita@example.com, hari@example.com, gita@example.com / user123",
  );
  console.log("═".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import {
  PrismaClient,
  Role,
  ArticleStatus,
  MediaType,
  CommentStatus,
  Poll,
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
  const diaspora = await prisma.category.upsert({
    where: { slug: "diaspora" },
    update: {},
    create: { nameNe: "प्रवास", nameEn: "Diaspora", slug: "diaspora" },
  });
  const story = await prisma.category.upsert({
    where: { slug: "story" },
    update: {},
    create: { nameNe: "कथा", nameEn: "Story", slug: "story" },
  });
  const opinion = await prisma.category.upsert({
    where: { slug: "opinion" },
    update: {},
    create: { nameNe: "विचार", nameEn: "Opinion", slug: "opinion" },
  });

  // ═══════════════════════════════════════════
  // SUBCATEGORIES FOR EACH MAIN CATEGORY
  // ═══════════════════════════════════════════

  // Politics subcategories
  const politicsSubcategories = [
    { slug: "federal-politics", nameEn: "Federal Politics", nameNe: "संघीय राजनीति" },
    { slug: "provincial-politics", nameEn: "Provincial Politics", nameNe: "प्रादेशिक राजनीति" },
    { slug: "local-politics", nameEn: "Local Politics", nameNe: "स्थानीय राजनीति" },
    { slug: "elections", nameEn: "Elections", nameNe: "निर्वाचन" },
    { slug: "political-parties", nameEn: "Political Parties", nameNe: "राजनीतिक दल" },
    { slug: "parliament", nameEn: "Parliament", nameNe: "संसद" },
    { slug: "government", nameEn: "Government", nameNe: "सरकार" },
    { slug: "opposition", nameEn: "Opposition", nameNe: "विपक्ष" },
    { slug: "political-analysis", nameEn: "Political Analysis", nameNe: "राजनीतिक विश्लेषण" },
    { slug: "political-news", nameEn: "Political News", nameNe: "राजनीतिक समाचार" },
  ];
  for (const sub of politicsSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: politics.id },
    });
  }

  // Sports subcategories
  const sportsSubcategories = [
    { slug: "cricket", nameEn: "Cricket", nameNe: "क्रिकेट" },
    { slug: "football", nameEn: "Football", nameNe: "फुटबल" },
    { slug: "volleyball", nameEn: "Volleyball", nameNe: "भलिवल" },
    { slug: "basketball", nameEn: "Basketball", nameNe: "बास्केटबल" },
    { slug: "hockey", nameEn: "Hockey", nameNe: "हक्की" },
    { slug: "athletics", nameEn: "Athletics", nameNe: "एथलेटिक्स" },
    { slug: "swimming", nameEn: "Swimming", nameNe: "स्विमिङ" },
    { slug: "boxing", nameEn: "Boxing", nameNe: "बक्सिङ" },
    { slug: "martial-arts", nameEn: "Martial Arts", nameNe: "मार्सल आर्ट्स" },
    { slug: "sports-news", nameEn: "Sports News", nameNe: "खेल समाचार" },
  ];
  for (const sub of sportsSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: sports.id },
    });
  }

  // Technology subcategories
  const technologySubcategories = [
    { slug: "gadgets", nameEn: "Gadgets", nameNe: "ग्याजेट्स" },
    { slug: "ai-artificial-intelligence", nameEn: "AI & Artificial Intelligence", nameNe: "एआई र कृत्रिम बुद्धिमत्ता" },
    { slug: "startups", nameEn: "Startups", nameNe: "स्टार्टअप" },
    { slug: "cybersecurity", nameEn: "Cybersecurity", nameNe: "साइबर सुरक्षा" },
    { slug: "mobile-phones", nameEn: "Mobile Phones", nameNe: "मोबाइल फोन" },
    { slug: "computers", nameEn: "Computers", nameNe: "कम्प्युटर" },
    { slug: "internet", nameEn: "Internet", nameNe: "इन्टरनेट" },
    { slug: "social-media", nameEn: "Social Media", nameNe: "सामाजिक मिडिया" },
    { slug: "tech-news", nameEn: "Tech News", nameNe: "प्रविधि समाचार" },
    { slug: "software-apps", nameEn: "Software & Apps", nameNe: "सफ्टवेयर र एप्स" },
  ];
  for (const sub of technologySubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: technology.id },
    });
  }

  // Entertainment subcategories
  const entertainmentSubcategories = [
    { slug: "bollywood", nameEn: "Bollywood", nameNe: "बलिउड" },
    { slug: "hollywood", nameEn: "Hollywood", nameNe: "हलिउड" },
    { slug: "nepali-cinema", nameEn: "Nepali Cinema", nameNe: "नेपाली सिनेमा" },
    { slug: "music", nameEn: "Music", nameNe: "संगीत" },
    { slug: "television", nameEn: "Television", nameNe: "टेलिभिजन" },
    { slug: "movies", nameEn: "Movies", nameNe: "चलचित्र" },
    { slug: "celebrity", nameEn: "Celebrity", nameNe: "सेलिब्रिटी" },
    { slug: "fashion", nameEn: "Fashion", nameNe: "फेसन" },
    { slug: "gossip", nameEn: "Gossip", nameNe: "गपशप" },
    { slug: "entertainment-news", nameEn: "Entertainment News", nameNe: "मनोरञ्जन समाचार" },
  ];
  for (const sub of entertainmentSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: entertainment.id },
    });
  }

  // Economy subcategories
  const economySubcategories = [
    { slug: "stock-market", nameEn: "Stock Market", nameNe: "शेयर बजार" },
    { slug: "banking", nameEn: "Banking", nameNe: "बैंकिङ" },
    { slug: "investment", nameEn: "Investment", nameNe: "लगानी" },
    { slug: "business", nameEn: "Business", nameNe: "व्यापार" },
    { slug: "trade", nameEn: "Trade", nameNe: "व्यापार" },
    { slug: "tourism", nameEn: "Tourism", nameNe: "पर्यटन" },
    { slug: "agriculture", nameEn: "Agriculture", nameNe: "कृषि" },
    { slug: "real-estate", nameEn: "Real Estate", nameNe: "घर जग्गा" },
    { slug: "jobs", nameEn: "Jobs", nameNe: "रोजगार" },
    { slug: "economy-news", nameEn: "Economy News", nameNe: "अर्थ समाचार" },
  ];
  for (const sub of economySubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: economy.id },
    });
  }

  // World subcategories
  const worldSubcategories = [
    { slug: "asia", nameEn: "Asia", nameNe: "एशिया" },
    { slug: "europe", nameEn: "Europe", nameNe: "युरोप" },
    { slug: "americas", nameEn: "Americas", nameNe: "अमेरिका" },
    { slug: "africa", nameEn: "Africa", nameNe: "अफ्रिका" },
    { slug: "middle-east", nameEn: "Middle East", nameNe: "मध्य पूर्व" },
    { slug: "un", nameEn: "United Nations", nameNe: "संयुक्त राष्ट्र" },
    { slug: "diplomacy", nameEn: "Diplomacy", nameNe: "कूटनीति" },
    { slug: "global-economy", nameEn: "Global Economy", nameNe: "विश्व अर्थतन्त्र" },
    { slug: "climate-change", nameEn: "Climate Change", nameNe: "जलवायु परिवर्तन" },
    { slug: "world-news", nameEn: "World News", nameNe: "विश्व समाचार" },
  ];
  for (const sub of worldSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: world.id },
    });
  }

  // Society subcategories
  const societySubcategories = [
    { slug: "education", nameEn: "Education", nameNe: "शिक्षा" },
    { slug: "health", nameEn: "Health", nameNe: "स्वास्थ्य" },
    { slug: "women-empowerment", nameEn: "Women Empowerment", nameNe: "महिला सशक्तिकरण" },
    { slug: "children", nameEn: "Children", nameNe: "बालबालिका" },
    { slug: "senior-citizens", nameEn: "Senior Citizens", nameNe: "ज्येष्ठ नागरिक" },
    { slug: "social-issues", nameEn: "Social Issues", nameNe: "सामाजिक मुद्दा" },
    { slug: "community", nameEn: "Community", nameNe: "समुदाय" },
    { slug: "volunteer", nameEn: "Volunteer", nameNe: "स्वयंसेवक" },
    { slug: "ngos", nameEn: "NGOs", nameNe: "गैरसरकारी संगठन" },
    { slug: "society-news", nameEn: "Society News", nameNe: "समाज समाचार" },
  ];
  for (const sub of societySubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: society.id },
    });
  }

  // Health subcategories (under swasthya)
  const healthSubcategories = [
    { slug: "mental-health", nameEn: "Mental Health", nameNe: "मानसिक स्वास्थ्य" },
    { slug: "nutrition", nameEn: "Nutrition", nameNe: "पोषण" },
    { slug: "fitness", nameEn: "Fitness", nameNe: "फिटनेस" },
    { slug: "diseases", nameEn: "Diseases", nameNe: "रोगहरु" },
    { slug: "hospitals", nameEn: "Hospitals", nameNe: "अस्पताल" },
    { slug: "doctors", nameEn: "Doctors", nameNe: "डाक्टर" },
    { slug: "medicine", nameEn: "Medicine", nameNe: "औषधि" },
    { slug: "ayurveda", nameEn: "Ayurveda", nameNe: "आयुर्वेद" },
    { slug: "covid19", nameEn: "COVID-19", nameNe: "कोभिड-19" },
    { slug: "health-tips", nameEn: "Health Tips", nameNe: "स्वास्थ्य सुझाव" },
  ];
  for (const sub of healthSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: swasthya.id },
    });
  }

  // Lifestyle subcategories (under jeevanShaili)
  const lifestyleSubcategories = [
    { slug: "food-recipes", nameEn: "Food & Recipes", nameNe: "खाना र रेसिपी" },
    { slug: "travel", nameEn: "Travel", nameNe: "यात्रा" },
    { slug: "fashion-style", nameEn: "Fashion & Style", nameNe: "फेसन र स्टाइल" },
    { slug: "home-living", nameEn: "Home & Living", nameNe: "घर र बसोबास" },
    { slug: "relationships", nameEn: "Relationships", nameNe: "सम्बन्ध" },
    { slug: "parenting", nameEn: "Parenting", nameNe: "पालनपोषण" },
    { slug: "pets", nameEn: "Pets", nameNe: "पाल्तु जनावर" },
    { slug: "beauty-skincare", nameEn: "Beauty & Skincare", nameNe: "सौन्दर्य र हेरचाह" },
    { slug: "fitness-yoga", nameEn: "Fitness & Yoga", nameNe: "फिटनेस र योग" },
    { slug: "lifestyle-news", nameEn: "Lifestyle News", nameNe: "जीवनशैली समाचार" },
  ];
  for (const sub of lifestyleSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: jeevanShaili.id },
    });
  }

  // Dharma & Culture subcategories
  const dharmaSubcategories = [
    { slug: "festivals", nameEn: "Festivals", nameNe: "चाडपर्व" },
    { slug: "temples", nameEn: "Temples", nameNe: "मन्दिर" },
    { slug: "rituals", nameEn: "Rituals", nameNe: "धार्मिक अनुष्ठान" },
    { slug: "astrology", nameEn: "Astrology", nameNe: "ज्योतिष" },
    { slug: "spiritual", nameEn: "Spiritual", nameNe: "आध्यात्मिक" },
    { slug: "puja-path", nameEn: "Puja & Path", nameNe: "पूजा र पाठ" },
    { slug: "religious-places", nameEn: "Religious Places", nameNe: "धार्मिक स्थल" },
    { slug: "culture-heritage", nameEn: "Culture & Heritage", nameNe: "संस्कृति र विरासत" },
    { slug: "traditions", nameEn: "Traditions", nameNe: "परम्परा" },
    { slug: "dharma-news", nameEn: "Dharma News", nameNe: "धर्म समाचार" },
  ];
  for (const sub of dharmaSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: dharmaSanskriti.id },
    });
  }

  // Diaspora subcategories
  const diasporaSubcategories = [
    { slug: "nri-news", nameEn: "NRI News", nameNe: "एनआरआई समाचार" },
    { slug: "remittance", nameEn: "Remittance", nameNe: "रेमिट्यान्स" },
    { slug: "overseas-jobs", nameEn: "Overseas Jobs", nameNe: "विदेशी रोजगार" },
    { slug: "diaspora-community", nameEn: "Diaspora Community", nameNe: "प्रवासी समुदाय" },
    { slug: "cultural-association", nameEn: "Cultural Association", nameNe: "सांस्कृतिक संघ" },
    { slug: "diaspora-events", nameEn: "Diaspora Events", nameNe: "प्रवासी कार्यक्रम" },
    { slug: "nepal-embassy", nameEn: "Nepal Embassy", nameNe: "नेपाली दूतावास" },
    { slug: "citizenship-abroad", nameEn: "Citizenship Abroad", nameNe: "विदेशमा नागरिकता" },
    { slug: "diaspora-investment", nameEn: "Diaspora Investment", nameNe: "प्रवासी लगानी" },
    { slug: "diaspora-news", nameEn: "Diaspora News", nameNe: "प्रवास समाचार" },
  ];
  for (const sub of diasporaSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: diaspora.id },
    });
  }

  // Story subcategories
  const storySubcategories = [
    { slug: "news-story", nameEn: "News Story", nameNe: "समाचार कथा" },
    { slug: "feature-story", nameEn: "Feature Story", nameNe: "फिचर कथा" },
    { slug: " investigative-story", nameEn: "Investigative Story", nameNe: "अनुसन्धानात्मक कथा" },
    { slug: "human-interest", nameEn: "Human Interest", nameNe: "मानवीय चासो" },
    { slug: "success-story", nameEn: "Success Story", nameNe: "सफलता कथा" },
    { slug: "frontline", nameEn: "Frontline", nameNe: "अग्रपंक्ति" },
    { slug: "profile", nameEn: "Profile", nameNe: "प्रोफाइल" },
    { slug: "opinion-piece", nameEn: "Opinion Piece", nameNe: "विचार लेख" },
    { slug: "analysis-piece", nameEn: "Analysis Piece", nameNe: "विश्लेषण लेख" },
    { slug: "special-report", nameEn: "Special Report", nameNe: "विशेष रिपोर्ट" },
  ];
  for (const sub of storySubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: story.id },
    });
  }

  // Opinion subcategories
  const opinionSubcategories = [
    { slug: "editorial", nameEn: "Editorial", nameNe: "प्रमुख सम्पादकीय" },
    { slug: "opinion-column", nameEn: "Opinion Column", nameNe: "विचार स्तम्भ" },
    { slug: "guest-article", nameEn: "Guest Article", nameNe: "अतिथि लेख" },
    { slug: "letter-to-editor", nameEn: "Letter to Editor", nameNe: "सम्पादकको चिठ्ठी" },
    { slug: "political-opinion", nameEn: "Political Opinion", nameNe: "राजनीतिक विचार" },
    { slug: "social-commentary", nameEn: "Social Commentary", nameNe: "सामाजिक टिप्पणी" },
    { slug: "economic-analysis", nameEn: "Economic Analysis", nameNe: "आर्थिक विश्लेषण" },
    { slug: "cultural-review", nameEn: "Cultural Review", nameNe: "सांस्कृतिक समीक्षा" },
    { slug: "sports-view", nameEn: "Sports View", nameNe: "खेल दृष्टिकोण" },
    { slug: "opinion-news", nameEn: "Opinion News", nameNe: "विचार समाचार" },
  ];
  for (const sub of opinionSubcategories) {
    await prisma.category.upsert({
      where: { slug: sub.slug },
      update: {},
      create: { nameNe: sub.nameNe, nameEn: sub.nameEn, slug: sub.slug, parentId: opinion.id },
    });
  }

  console.log("✅ Categories: 15 main + 130 subcategories created");

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

  // Get province subcategory IDs for article assignment
  const koshiProvince = await prisma.category.findUnique({ where: { slug: "koshi-province" } });
  const madheshProvince = await prisma.category.findUnique({ where: { slug: "madhesh-province" } });
  const bagmatiProvince = await prisma.category.findUnique({ where: { slug: "bagmati-province" } });
  const gandakiProvince = await prisma.category.findUnique({ where: { slug: "gandaki-province" } });
  const lumbiniProvince = await prisma.category.findUnique({ where: { slug: "lumbini-province" } });
  const karnaliProvince = await prisma.category.findUnique({ where: { slug: "karnali-province" } });
  const sudurpashchimProvince = await prisma.category.findUnique({ where: { slug: "sudurpashchim-province" } });

  console.log(
    "✅ Categories: 24 created (16 + provinces with 7 subcategories)",
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
    tagIds = [],
    metaTitle,
    metaDescription,
    publishedAt,
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
    slug: "nepal-daily-news-bulletin-april-22-2026",
    coverImageUrl: images.politics1,
    coverImageFilename: "daily-news-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "दैनिक समाचार बुलेटिन: वैशाख ९, २०८३",
    titleEn: "Daily News Bulletin: April 22, 2026",
    excerptNe:
      "आजका प्रमुख समाचारहरू: संसदमा नागरिकता विधेयक बहस, नेप्से नयाँ उचाइमा र देशभरि मौसम सतर्कता जारी।",
    excerptEn:
      "Today's top stories: Citizenship bill debate in parliament, NEPSE hits new high, and weather advisory issued nationwide.",
    contentNe: `<p>काठमाडौं, वैशाख ९ । आजको प्रमुख समाचारहरूमा संसदमा नागरिकता विधेयकको तीव्र बहस, नेपाल शेयर बजारको नयाँ रेकर्ड र देशभरि भारी वर्षाको सतर्कता समावेश छ।</p>

<p>संसद्मा आज नागरिकता विधेयकमा छलफल जारी रहेको छ। विपक्षी दलहरूले विधेयकका केही प्रावधानहरू विरोध गरिरहेका छन् जबकि सत्तापक्षले विधेयक छिट्टै पारित गर्ने प्रयास गरिरहेको छ।</p>

${img(images.inline_parliament, "संसद् बैठकमा नागरिकता विधेयकमा बहस — Parliament debates citizenship bill")}

<p>आर्थिक क्षेत्रमा नेप्से सूचकाङ्क आज फेरि नयाँ उचाइ छोएको छ। बैंकिङ र जलविद्युत् क्षेत्रका शेयरहरूमा उल्लेख्य वृद्धि देखिएको छ।</p>

<p>मौसम विभागले देशका पहाडी र हिमाली क्षेत्रमा आगामी तीन दिनसम्म भारी वर्षा हुने सम्भावना जनाएको छ। यात्राहरूले सावधानी अपनाउन आग्रह गरिएको छ।</p>

${img(images.inline_budget, "आर्थिक समाचार: नेप्से नयाँ उचाइमा — Economic news: NEPSE hits record high")}

<p>स्वास्थ्य क्षेत्रमा चितवनमा डेंगु रोगको एक नयाँ कase पुष्टि भएको छ। स्वास्थ्य मन्त्रालयले विगत महिनामा देशभरि १२० भन्दा बढी डेंगु मरीजहरू पत्ता लागेको जनाएको छ।</p>`,

    contentEn: `<p>Kathmandu, April 22. Today's top stories include heated debate on the citizenship bill in parliament, Nepal Stock Exchange hitting new records, and heavy rainfall warnings issued across the country.</p>

<p>Discussion on the citizenship bill continues in parliament today. Opposition parties are opposing certain provisions of the bill while the ruling side is attempting to pass it as soon as possible.</p>

${img(images.inline_parliament, "Parliament session continues debate on the controversial citizenship bill")}

<p>In the economic sector, the NEPSE index touched another new high today. Significant growth was seen in banking and hydropower sector shares during trading hours.</p>

<p>The Meteorological Department has forecast heavy rainfall in hilly and mountainous regions for the next three days. Travelers have been urged to exercise caution and monitor weather updates.</p>

${img(images.inline_budget, "Economic update: NEPSE index continues bullish trend reaching record levels")}

<p>In health sector, one new case of dengue has been confirmed in Chitwan. The Health Ministry reported that over 120 dengue patients have been identified nationwide in the past month with numbers rising steadily.</p>`,

    categoryId: news.id,
    authorId: author1.id,
    isFeatured: true,
    tagIds: [tagNepal.id, tagBreaking.id, tagGovt.id],
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  });
  console.log("  ✓ News 1: Daily news bulletin");

  // Dharma & Culture category
  await createArticle({
    slug: "pashupatinath-temple-annual-festival-2026",
    coverImageUrl: images.entertain1,
    coverImageFilename: "pashupatinath-festival-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "पशुपतिनाथ मन्दिरमा वार्षिक महोत्सव सुरु, लाखौं भक्तजनको आगमन",
    titleEn: "Pashupatinath Temple Annual Festival Begins, Lakhs of Devotees Arrive",
    excerptNe:
      "विश्व धरोहर पशुपतिनाथ मन्दिरमा आजबाट वार्षिक महोत्सव सुरु भएको छ। देशविदेशबाट लाखौं भक्तजनहरू यस महोत्सवमा सहभागी हुन आएका छन्।",
    excerptEn:
      "The annual festival has begun today at the World Heritage Pashupatinath Temple. Lakhs of devotees from home and abroad have arrived to participate in this grand celebration.",
    contentNe: `<p>काठमाडौं, वैशाख ८ । विश्व धरोहर पशुपतिनाथ मन्दिरमा आजबाट वार्षिक महोत्सव सुरु भएको छ। देशविदेशबाट लाखौं भक्तजनहरू यस महोत्सवमा सहभागी हुन आएका छन्।</p>

<p>यो चार दिने महोत्सवमा विशेष पूजा अर्चना, धार्मिक कीर्तन र प्रसाद वितरण गरिने योजना छ। मन्दिर क्षेत्रको सुरक्षा व्यवस्था अत्यन्त कडा बनाइएको छ।</p>

${img(images.inline_movie, "पशुपतिनाथ मन्दिरमा भक्तजनहरूको भीड — Devotees crowd at Pashupatinath Temple")}

<p>मन्दिर प्रशासनका अनुसार आज मात्रै ५ लाखभन्दा बढी भक्तजनहरूले मन्दिर दर्शन गरेका छन्। विभिन्न देशबाट आएका धार्मिक पर्यटकहरूले पनि यस महोत्सवमा सहभागी भएका छन्।</p>

<p>विभिन्न जिल्लाबाट आएका सन्त महात्माहरूले धार्मिक प्रवचन पनि दिइरहेका छन्। यस अवसरमा गरीबहरूलाई खाना र कपडा वितरण गर्ने सामाजिक कार्यक्रम पनि आयोजना गरिएको छ।</p>

${img(images.entertain1, "पशुपतिनाथ महोत्सवको बिशेष पूजा — Special worship during Pashupatinath festival")}

<p>पशुपतिनाथ क्षेत्र विकास कोषले यस वर्षको महोत्सवलाई 'स्वच्छ महोत्सव' को नारामा आयोजना गरेको छ जसमा पर्यावरण संरक्षणलाई प्राथमिकता दिइएको छ।</p>`,

    contentEn: `<p>Kathmandu, April 21. The annual festival has begun today at the World Heritage Pashupatinath Temple. Lakhs of devotees from home and abroad have arrived to participate in this grand celebration.</p>

<p>This four-day festival features special worship ceremonies, religious kirtans, and prasad distribution. Security arrangements in the temple premises have been tightened significantly for the event.</p>

${img(images.inline_movie, "Devotees throng Pashupatinath Temple premises during the annual festival")}

<p>According to temple administration, over 500,000 devotees have visited the temple today alone. Religious tourists from various countries have also participated in this festival.</p>

<p>Saints and religious leaders from different districts are also delivering spiritual discourses. Social programs including food and clothing distribution to the poor have also been organized on this occasion.</p>

${img(images.entertain1, "Special religious ceremonies being performed at Pashupatinath Temple")}

<p>The Pashupatinath Area Development Fund has organized this year's festival under the theme "Clean Festival" giving priority to environmental protection and waste management throughout the event period.</p>`,

    categoryId: dharmaSanskriti.id,
    authorId: author5.id,
    isFeatured: true,
    tagIds: [tagNepal.id, tagTourism.id],
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  });
  console.log("  ✓ Dharma & Culture 1: Pashupatinath festival");

  // Health category
  await createArticle({
    slug: "nepal-dengue-prevention-campaign-2026",
    coverImageUrl: images.society2,
    coverImageFilename: "dengue-prevention-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "डेंगु रोग बिरुद्ध राष्ट्रव्यापी सतर्कता अभियान सुरु",
    titleEn: "Nationwide Dengue Prevention Awareness Campaign Launched",
    excerptNe:
      "स्वास्थ्य मन्त्रालयले डेंगु रोगको बढ्दो खतराको बीचमा राष्ट्रव्यापी सतर्कता अभियान सुरु गरेको छ। यस वर्ष देशभरि १५० भन्दा बढी डेंगु मरीजहरू पत्ता लागिसकेका छन्।",
    excerptEn:
      "The Ministry of Health has launched a nationwide awareness campaign amid growing dengue risk. Over 150 dengue patients have been identified across the country this year so far.",
    contentNe: `<p>काठमाडौं, वैशाख ७ । स्वास्थ्य मन्त्रालयले डेंगु रोगको बढ्दो खतराको बीचमा राष्ट्रव्यापी सतर्कता अभियान सुरु गरेको छ। यस वर्ष देशभरि १५० भन्दा बढी डेंगु मरीजहरू पत्ता लागिसकेका छन्।</p>

<p>स्वास्थ्य सचिव डा. राजेश ढकालले बताउनुभयो, "हामी सम्पूर्ण स्वास्थ्य संस्थाहरूलाई डेंगु रोग पत्ता लगाउने क्षमता सुदृढ गरिरहेका छौं। यस अभियान अन्तर्गत मच्छर नियन्त्रणका कार्यक्रम समेत सञ्चालन गरिनेछ।"</p>

${img(images.inline_hospital, "स्वास्थ्य कार्यकर्ताहरूले सतर्कता जानकारी प्रदान गर्दै — Health workers conducting dengue awareness")}

<p>डेंगु रोगको मुख्य लक्षणहरू उच्च ज्वरो, शरीरमा दुखाइ, जोर्नी खान नमिल्नु र त्वचामा दागहरू देखिनु हुन्। यस्ता लक्षण देखिंदा तुरुन्तै नजिकको स्वास्थ्य संस्थामा पहुँच्न आग्रह गरिएको छ।</p>

<p>यस अभियान अन्तर्गत १० हजार स्वास्थ्य कार्यकर्ताहरू देशभरि विभिन्न समुदायमा जाने योजना छ। त्यसैले घरको वरिपरि पानी जम्न नदिनु, मच्छर मार्ने दवाको प्रयोग गर्नु र शारीरिक सुरक्षा प्रयोग गर्न सार्वजनिकलाई सुझाव दिइएको छ।</p>

${img(images.society2, "डेंगु रोकथामका लागि मच्छर नियन्त्रण कार्यक्रम — Mosquito control program for dengue prevention")}

<p>गत वर्ष देशभरि २५०० भन्दा बढी डेंगु मरीजहरू थिए जसमा १२ जनाको मृत्यु भएको थियो। स्वास्थ्य मन्त्रालयले यस वर्ष यो संख्या घटाउन दृढ प्रयास गरिरहेको छ।</p>`,

    contentEn: `<p>Kathmandu, April 20. The Ministry of Health has launched a nationwide awareness campaign amid growing dengue risk across the country. Over 150 dengue patients have been identified so far this year.</p>

<p>Health Secretary Dr. Rajesh Dhakal informed, "We are strengthening dengue detection capacity across all health facilities. This campaign will also include targeted mosquito control programs in high-risk areas."</p>

${img(images.inline_hospital, "Health workers conducting door-to-door dengue awareness in communities")}

<p>Main symptoms of dengue include high fever, body aches, loss of appetite and skin rashes. People are urged to immediately visit the nearest health facility if they experience these symptoms.</p>

<p>Under this campaign, 10,000 health workers will be deployed to communities across the country. The public is advised not to allow water accumulation around homes, use mosquito repellents and practice physical protection measures.</p>

${img(images.society2, "Vector control program being implemented for dengue prevention in urban areas")}

<p>Last year there were over 2,500 dengue patients nationwide with 12 fatalities recorded. The Health Ministry is making concerted efforts to reduce these numbers significantly this year through proactive measures.</p>`,

    categoryId: swasthya.id,
    authorId: author4.id,
    isFeatured: false,
    tagIds: [tagHealth.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  });
  console.log("  ✓ Health 1: Dengue prevention campaign");

  // Lifestyle category
  await createArticle({
    slug: "international-yoga-day-nepal-celebrations-2026",
    coverImageUrl: images.sports3,
    coverImageFilename: "yoga-day-cover.jpg",
    uploadedById: superAdmin.id,
    titleNe: "अन्तर्राष्ट्रिय योग दिवस: देशभरि हजारौंले योग अभ्यास गरे",
    titleEn: "International Yoga Day: Thousands Practice Yoga Across Nepal",
    excerptNe:
      "अन्तर्राष्ट्रिय योग दिवसको अवसरमा देशभरि विभिन्न कार्यक्रमहरू आयोजना गरिएका छन्। काठमाडौंको तुढिखेलमा ५ हजारभन्दा बढी मानिसहरूले संयुक्त रूपमा योग अभ्यास गरेका थिए।",
    excerptEn:
      "Various programs were organized across the country on the occasion of International Yoga Day. More than 5,000 people collectively practiced yoga at Kathmandu's Tundikhel.",
    contentNe: `<p>काठमाडौं, वैशाख ५ । अन्तर्राष्ट्रिय योग दिवसको अवसरमा देशभरि विभिन्न कार्यक्रमहरू आयोजना गरिएका छन्। काठमाडौंको तुढिखेलमा ५ हजारभन्दा बढी मानिसहरूले संयुक्त रूपमा योग अभ्यास गरेका थिए।</p>

<p>यस कार्यक्रममा स्वास्थ्य मन्त्री, खेलकुद मन्त्री सहित विभिन्न मन्त्रीहरू, दिप्लोम्याट, खेलाडी र सामान्य नागरिकहरू सहभागी भएका थिए। कार्यक्रमलाई विश्व योग सम्मेलनले सञ्चालन गरेको थियो।</p>

${img(images.inline_marathon, "तुढिखेलमा संयुक्त योग अभ्यास — Collective yoga practice at Tundikhel")}

<p>मुख्य अतिथि प्रधानमन्त्रीले योगको महत्त्वबारे सम्बोधन गर्दै भन्नुभयो, "योग नेपालको प्राचीन संस्कृतिको अमूल्य धरोहर हो। यसले शारीरिक र मानसिक स्वास्थ्य दुवै सुधार गर्न मद्दत गर्छ।"</p>

<p>पोखरा, चितवन, विराटनगर, नेपालगञ्ज लगायत देशका प्रमुख सहरहरूमा पनि यस दिवसको अवसरमा विशेष योग शिविरहरू आयोजना गरिएका थिए। विभिन्न स्कूल र कार्यालयहरूमा पनि योग दिवस मनाइएको छ।</p>

${img(images.sports3, "योग अभ्यासमा सहभागी बालबालिकाहरू — Children participating in yoga practice")}

<p>यस वर्षको योग दिवसको विषय थियो "योग मानवताको लागि" जसले योगको लाभ सबैलाई प्रविधान गर्ने उद्देश्य राखेको थियो।</p>`,

    contentEn: `<p>Kathmandu, April 18. Various programs were organized across the country on the occasion of International Yoga Day. More than 5,000 people collectively practiced yoga at Kathmandu's Tundikhel in the main event.</p>

<p>Ministers, diplomats, athletes and ordinary citizens participated in this program organized by the World Yoga Federation. The massive demonstration created a spectacular view at the historic grounds.</p>

${img(images.inline_marathon, "Collective yoga demonstration at Tundikhel drawing thousands of participants")}

<p>The Prime Minister, who was the chief guest, addressed the gathering saying, "Yoga is an invaluable heritage of Nepal's ancient culture. It helps improve both physical and mental health while bringing peace to individuals and communities."</p>

<p>Special yoga camps were also organized in major cities including Pokhara, Chitwan, Biratnagar and Nepalgunj. Various schools and offices across the nation also observed Yoga Day with special activities.</p>

${img(images.sports3, "School children actively participating in yoga practice on International Yoga Day")}

<p>This year's Yoga Day theme was "Yoga for Humanity" aiming to make the benefits of yoga accessible to everyone regardless of age, ability or background.</p>`,

    categoryId: jeevanShaili.id,
    authorId: author4.id,
    isFeatured: false,
    tagIds: [tagHealth.id, tagNepal.id],
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  });
  console.log("  ✓ Lifestyle 1: Yoga Day");

  // ─────────────────────────────────────────
  // DIASPORA — 5 articles
  // ─────────────────────────────────────────

  console.log("📰 Seeding Diaspora articles...\n");

  await createArticle({
    slug: "nepali-diaspora-uk-cultural-event-2026",
    coverImageUrl: images.entertain2,
    coverImageFilename: "diaspora-uk-cultural-event.jpg",
    uploadedById: superAdmin.id,
    titleNe: "यूकेमा नेपाली समुदायले सांस्कृतिक महोत्सव सफलतापूर्वक सम्पन्न",
    titleEn: "Nepali Community in UK Successfully Organizes Cultural Festival",
    excerptNe:
      "लन्डनमा आयोजित महानेपाली सांस्कृतिक महोत्सवमा ५ हजारभन्दा बढी नेपाली विदेशीहरू सहभागी भएका छन्। यस कार्यक्रममा परम्परागत नृत्य, संगीत र खानेकुराको प्रदर्शन गरिएको थियो।",
    excerptEn:
      "Over 5,000 Nepali diaspora members participated in the Great Nepali Cultural Festival held in London. The event featured traditional dances, music and food exhibitions.",
    contentNe: `<p>लन्डन, एप्रिल २१ । युनाइटेड किङ्डममा बसोबास गर्ने नेपाली समुदायले आयोजना गरेको महानेपाली सांस्कृतिक महोत्सव हालै सफलतापूर्वक सम्पन्न भएको छ।</p>

<p>लन्डनको ब्रिक्सटन एक्सपो सेन्टरमा आयोजित यो दुई दिने कार्यक्रममा ५ हजारभन्दा बढी नेपाली विदेशीहरू सहभागी भएका छन्। कार्यक्रममा परम्परागत नेपाली नृत्य, संगीत प्रस्तुति, कला प्रदर्शन र विभिन्न खानेकुराको स्टलहरू राखिएको थियो।</p>

${img(images.inline_concert, "यूकेमा आयोजित नेपाली सांस्कृतिक कार्यक्रम — Nepali cultural program held in UK")}

<p>कार्यक्रमको आयोजक संस्था नेपाली कम्युनिटी यूकेका अध्यक्ष डा. राम कार्कीले भने, "यस कार्यक्रमको मुख्य उद्देश्य विदेशमा बसोबास गर्ने नेपालीहरूलाई आफ्नो संस्कृतिसँग जोडनु र सङ्घर्ष गर्नु हो।"</p>

<p>यस कार्यक्रममा बेलायती संसदका विभिन्न सांसदहरू पनि पहुँचेका थिए र नेपाली समुदायको योगदानबारे प्रशंसा गरेका थिए।</p>

${img(images.entertain2, "नेपाली समुदायको सांस्कृतिक प्रस्तुति — Cultural performance by Nepali community")}

<p>कार्यक्रममा बालबालिकाहरूको लागि विशेष कार्यक्रमहरू पनि आयोजना गरिएको थियो जहाँ उनीहरूले नेपाली परम्परा र संस्कृति बारे सिक्न पाएका थिए।</p>`,

    contentEn: `<p>London, April 21. The Great Nepali Cultural Festival organized by the Nepali community residing in the United Kingdom has been successfully concluded recently.</p>

<p>More than 5,000 Nepali diaspora members participated in this two-day event held at Brixton Expo Center in London. The program featured traditional Nepali dances, musical performances, art exhibitions and various food stalls.</p>

${img(images.inline_concert, "Nepali cultural program held in London gathering diaspora community")}

<p>Dr. Ram Karki, President of the organizing body Nepali Community UK said, "The main objective of this event is to connect Nepalis living abroad with their culture and foster unity."</p>

<p>Various British Parliament members also attended the event and praised the contribution of the Nepali community to British society.</p>

${img(images.entertain2, "Cultural performance showcasing Nepali traditions to the diaspora audience")}

<p>Special programs were also organized for children in the event where they could learn about Nepali traditions and culture through interactive activities.</p>`,

    categoryId: diaspora.id,
    authorId: author1.id,
    isFeatured: true,
    tagIds: [tagNepal.id],
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  });
  console.log("  ✓ Diaspora 1: UK cultural festival");

  await createArticle({
    slug: "nepali-diaspora-qatar-labor-rights-improvement",
    coverImageUrl: images.society1,
    coverImageFilename: "diaspora-qatar-labor.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कतारमा नेपाली श्रमिकहरूको अधिकारमा सुधार, नयाँ नियम लागू",
    titleEn: "Improvement in Nepali Workers' Rights in Qatar, New Regulations Implemented",
    excerptNe:
      "कतार सरकारले विदेशी श्रमिकहरूको अधिकार संरक्षण गर्न नयाँ कानुन लागू गरेको छ। यसले त्यहाँ काम गर्ने ४ लाखभन्दा बढी नेपाली श्रमिकहरूलाई सिधा लाभ पुर्‍याउनेछ।",
    excerptEn:
      "The Qatari government has implemented new laws to protect foreign workers' rights. This will directly benefit more than 400,000 Nepali workers employed there.",
    contentNe: `<p>दोहा, एप्रिल २० । कतार सरकारले विदेशी श्रमिकहरूको अधिकार संरक्षण गर्न नयाँ कानुन लागू गरेको छ जसले त्यहाँ काम गर्ने ४ लाखभन्दा बढी नेपाली श्रमिकहरूलाई सिधा लाभ पुर्‍याउनेछ।</p>

<p>नयाँ नियमअनुसार अब श्रमिकहरूलाई काममा स्वच्छ वातावरण, पर्याप्त आराम, समयमा तलब प्राप्त गर्ने अधिकार सुनिश्चित गरिएको छ। साथै कुनै पनि कारणले श्रमिकलाई कामबाट निकाल्न सक्ने कानुनी प्रावधान पनि संशोधन गरिएको छ।</p>

${img(images.inline_bank, "कतारमा काम गर्ने नेपाली श्रमिकहरू — Nepali workers employed in Qatar")}

<p>नेपाली एम्बेसी कतारका प्रथम सचिव शेर बहादुर राईले बताउनुभयो, "हामी कतार सरकारसँग निरन्तर वार्ता गरिरहेका छौं र नयाँ नियमहरूले नेपाली श्रमिकहरूको जीवनमा सकारात्मक परिवर्तन ल्याउनेछ।"</p>

<p>यो नियम लागू भएपछि श्रमिकहरूले आफ्नो पासपोर्ट आफ्नै कब्जामा राख्न सक्नेछन् र कुनै पनि समयमा देश फर्कन इच्छा गरेमा अवरोध नहुने व्यवस्था गरिएको छ।</p>

${img(images.society1, "नेपाली श्रमिक सङ्गठनको बैठक — Nepali labor organization meeting")}

<p>गत वर्ष कतारमा ४ लाख २० हजार नेपाली श्रमिकहरू काम गरिरहेका थिए जसले प्रतिवर्ष करोडौं रुपैयाँ रेमिट्यान्सको रूपमा नेपालमा पठाउँछन्।</p>`,

    contentEn: `<p>Doha, April 20. The Qatari government has implemented new laws to protect foreign workers' rights which will directly benefit more than 400,000 Nepali workers employed there.</p>

<p>According to the new regulations, workers are now guaranteed clean working conditions, adequate rest, and timely salary payments. The legal provisions for terminating workers without cause have also been revised.</p>

${img(images.inline_bank, "Nepali workers at their workplace in Qatar benefiting from new labor laws")}

<p>Sher Bahadur Rai, First Secretary at the Nepali Embassy in Qatar informed, "We have been in continuous dialogue with the Qatari government and these new regulations will bring positive changes in the lives of Nepali workers."</p>

<p>With this implementation, workers can keep their passports in their own possession and face no obstacles if they wish to return home at any time.</p>

${img(images.society1, "Nepali labor association representatives meeting to discuss workers' rights")}

<p>Last year, 420,000 Nepali workers were employed in Qatar who send billions of rupees annually to Nepal in the form of remittances, constituting a major portion of the country's foreign currency earnings.</p>`,

    categoryId: diaspora.id,
    authorId: author4.id,
    isFeatured: false,
    tagIds: [tagNepal.id],
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  });
  console.log("  ✓ Diaspora 2: Qatar labor rights");

  await createArticle({
    slug: "nepali-diaspora-us-education-scholarship-program",
    coverImageUrl: images.society2,
    coverImageFilename: "diaspora-us-scholarship.jpg",
    uploadedById: superAdmin.id,
    titleNe: "अमेरिकामा नेपाली विद्यार्थीहरूको लागि नवीन छात्रवृत्ति कार्यक्रम सुरु",
    titleEn: "New Scholarship Program Launched for Nepali Students in USA",
    excerptNe:
      "अमेरिकामा बसोबास गर्ने नेपाली समुदायले आफ्नो देशका विद्यार्थीहरूको लागि १० करोड रुपैयाँको छात्रवृत्ति कार्यक्रम सुरु गरेको छ। यस कार्यक्रम अन्तर्गत प्रतिवर्ष ५० विद्यार्थीहरूलाई लाभ पुर्‍याइनेछ।",
    excerptEn:
      "The Nepali community residing in the USA has launched a Rs 100 million scholarship program for students from Nepal. Under this program, 50 students will benefit annually.",
    contentNe: `<p>वाशिंगटन डिसी, एप्रिल १९ । अमेरिकामा बसोबास गर्ने नेपाली समुदायले आफ्नो देशका योग्य तर आर्थिक रूपमा कमजोर विद्यार्थीहरूको लागि १० करोड रुपैयाँको छात्रवृत्ति कार्यक्रम सुरु गरेको छ।</p>

<p>नेपाली अमेरिकन फाउन्डेसनले सञ्चालन गर्ने यस कार्यक्रम अन्तर्गत प्रतिवर्ष ५० वटा स्नातक स्तरको छात्रवृत्ति प्रदान गरिनेछ जसले पूर्ण शैक्षिक शुल्क, पुस्तक खर्च र जीवन व्यय समेट्नेछ।</p>

${img(images.inline_school, "अमेरिकामा अध्ययनरत नेपाली विद्यार्थीहरू — Nepali students studying in USA")}

<p>फाउन्डेसनका अध्यक्ष डा. स्मृती श्रेष्ठले भने, "हामी युनाइटेड स्टेट्समा अध्ययन गर्न चाहने नेपाली विद्यार्थीहरूको आर्थिक बाधा हटाउन चाहन्छौं। यो छात्रवृत्ति तिनीहरूको सपना साकार गर्न मद्दत गर्नेछ।"</p>

<p>यस छात्रवृत्तिको लागि आवेदन प्रक्रिया आजदेखि सुरु भएको छ र जून सम्म आवेदन गर्न सकिनेछ। योग्यता कसोटी, लिखित परीक्षा र अन्तर्वार्ता मार्फत विद्यार्थीहरूको छनोट गरिनेछ।</p>

${img(images.society2, "छात्रवृत्ति कार्यक्रमको उद्घाटन समारोह — Scholarship program inauguration ceremony")}

<p>गत पाँच वर्षमा अमेरिकामा नेपाली विद्यार्थीहरूको संख्या तीन गुणा बढेको छ जसले गर्दा यस्तो छात्रवृत्ति कार्यक्रमको आवश्यकता महसुस भएको फाउन्डेसनले जनाएको छ।</p>`,

    contentEn: `<p>Washington DC, April 19. The Nepali community residing in the United States has launched a Rs 100 million scholarship program for meritorious yet financially disadvantaged students from Nepal.</p>

<p>To be administered by the Nepali American Foundation, this program will provide 50 undergraduate scholarships annually covering full tuition fees, book expenses and living costs for deserving students.</p>

${img(images.inline_school, "Nepali students currently studying at American universities")}

<p>Dr. Smriti Shrestha, President of the Foundation said, "We want to remove financial barriers for Nepali students who wish to study in the United States. This scholarship will help turn their dreams into reality."</p>

<p>The application process for this scholarship has begun today and will remain open until June. Students will be selected through eligibility screening, written examination and personal interview rounds.</p>

${img(images.society2, "Inauguration ceremony of the new scholarship program for Nepali students")}

<p>The Foundation noted that the number of Nepali students in America has tripled over the past five years, creating the need for such scholarship programs to support growing aspirations.</p>`,

    categoryId: diaspora.id,
    authorId: author3.id,
    isFeatured: false,
    tagIds: [tagNepal.id, tagEducation.id],
    publishedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  });
  console.log("  ✓ Diaspora 3: USA scholarship program");

  await createArticle({
    slug: "nepali-diaspora-australia-business-summit-2026",
    coverImageUrl: images.economy3,
    coverImageFilename: "diaspora-australia-summit.jpg",
    uploadedById: superAdmin.id,
    titleNe: "अष्ट्रेलियामा नेपाली व्यवसायी समिट आयोजना, लगानीको अवसरहरू चर्चा",
    titleEn: "Nepali Business Summit Organized in Australia, Investment Opportunities Discussed",
    excerptNe:
      "सिड्नीमा आयोजित प्रथम नेपाली व्यवसायी समिटमा २०० भन्दा बढी नेपाली उद्यमीहरू सहभागी भएका छन्। कार्यक्रममा नेपालमा लगानी गर्ने अवसरहरूबारे विस्तृत चर्चा भएको थियो।",
    excerptEn:
      "More than 200 Nepali entrepreneurs participated in the first Nepali Business Summit held in Sydney. The program extensively discussed investment opportunities in Nepal.",
    contentNe: `<p>सिड्नी, एप्रिल १८ । अष्ट्रेलियाको सिड्नीमा आयोजित प्रथम नेपाली व्यवसायी समिटमा २०० भन्दा बढी नेपाली उद्यमीहरू सहभागी भएका छन्।</p>

<p>यो तीन दिने समिटमा अष्ट्रेलिया, न्यूजिल्याण्ड र फिजी सहित प्रशान्त महासागर क्षेत्रका नेपाली व्यवसायीहरू एकसाथ जम्मा भएका थिए। कार्यक्रमको मुख्य उद्देश्य नेपालमा लगानी गर्ने अवसरहरू पहिचान गर्नु र समुदाय बीच व्यावसायिक सहकार्य सुदृढ गर्नु थियो।</p>

${img(images.inline_market, "सिड्नीमा आयोजित नेपाली व्यवसायी समिट — Nepali Business Summit in Sydney")}

<p>समिटमा नेपालका विभिन्न उद्योग संघका प्रतिनिधिहरू पनि उपस्थित थिए र हाइड्रोपावर, पर्यटन, कृषि र प्रविधि क्षेत्रमा लगानीका सम्भावनाहरू प्रस्तुत गरेका थिए।</p>

<p>कार्यक्रमको अवसरमा १२ वटा व्यवसाय सम्झौतामा हस्ताक्षर गरिएको छ जसमा नेपालका स्थानीय उत्पादनहरूको अष्ट्रेलियाली बजारमा पहुँच विस्तार समेत रहेको छ।</p>

${img(images.economy3, "व्यवसाय समिटमा सम्झौतामा हस्ताक्षर — Agreement signing at business summit")}

<p>अष्ट्रेलियामा हाल लगभग ६० हजार नेपालीहरू बसोबास गरिरहेका छन् जसमा धेरै जसो सफल उद्यमीहरू बनिसकेका छन्।</p>`,

    contentEn: `<p>Sydney, April 18. More than 200 Nepali entrepreneurs participated in the first Nepali Business Summit held in Sydney, Australia.</p>

<p>Nepali business people from across Australia, New Zealand and Fiji gathered at this three-day summit. The main objective was to identify investment opportunities in Nepal and strengthen business cooperation within the community.</p>

${img(images.inline_market, "First Nepali Business Summit held in Sydney gathering regional entrepreneurs")}

<p>Representatives from various Nepali industry associations were also present at the summit and presented investment possibilities in hydropower, tourism, agriculture and technology sectors.</p>

<p>Twelve business memoranda of understanding were signed during the event, including agreements to expand market access for Nepali local products in Australia.</p>

${img(images.economy3, "Business representatives signing cooperative agreements at the summit")}

<p>Approximately 60,000 Nepalis currently reside in Australia, many of whom have become successful entrepreneurs contributing to both economies.</p>`,

    categoryId: diaspora.id,
    authorId: author4.id,
    isFeatured: true,
    tagIds: [tagNepal.id],
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  });
  console.log("  ✓ Diaspora 4: Australia business summit");

  await createArticle({
    slug: "nepali-diaspora-japan-language-training-program",
    coverImageUrl: images.tech2,
    coverImageFilename: "diaspora-japan-training.jpg",
    uploadedById: superAdmin.id,
    titleNe: "जापानमा नेपाली श्रमिकहरूको लागि भाषा तथा सांस्कृतिक तालिम कार्यक्रम सुरु",
    titleEn: "Language and Cultural Training Program Launched for Nepali Workers in Japan",
    excerptNe:
      "जापान सरकार र नेपाली एम्बेसीको संयुक्त पहलमा त्यहाँ काम गर्ने नेपाली श्रमिकहरूको लागि विशेष भाषा तथा सांस्कृतिक तालिम कार्यक्रम सुरु गरिएको छ। यसले श्रमिकहरूलाई त्यहाँको वातावरणमा सजिलै समायोजन हुन मद्दत गर्नेछ।",
    excerptEn:
      "A special language and cultural training program has been launched for Nepali workers in Japan through a joint initiative by the Japanese government and Nepali Embassy. This will help workers adapt more easily to the environment there.",
    contentNe: `<p>टोक्यो, एप्रिल १७ । जापान सरकार र नेपाली एम्बेसी टोक्योको संयुक्त पहलमा त्यहाँ काम गर्ने नेपाली श्रमिकहरूको लागि विशेष भाषा तथा सांस्कृतिक तालिम कार्यक्रम सुरु गरिएको छ।</p>

<p>यस तालिम कार्यक्रमको मुख्य उद्देश्य नेपाली श्रमिकहरूलाई जापानी भाषा सिकाउनु र त्यहाँको सांस्कृतिक मूल्य र कामको वातावरणसँग परिचित गराउनु हो। प्रत्येक महिना ५०० नयाँ श्रमिकहरूलाई यो तालिम प्रदान गरिने योजना छ।</p>

${img(images.inline_coding, "जापानमा भाषा तालिम प्राप्त गर्दै नेपाली श्रमिकहरू — Nepali workers receiving language training in Japan")}

<p>नेपाली एम्बेसडर डा. गंगा प्रसाद लामाले भने, "हाम्रा श्रमिकहरू जापानमा जहिले पनि उत्कृष्ट काम गर्छन् तर भाषा र सांस्कृतिक बाधाले तिनीहरूलाई थप कष्ट दिन्छ। यो तालिम कार्यक्रमले त्यो समस्या समाधान गर्न मद्दत गर्नेछ।"</p>

<p>तालिम अन्त्यमा सफलतापूर्वक पूरा गर्नेहरूलाई सरकारले प्रमाणपत्र प्रदान गर्नेछ जसले तिनीहरूको जापानमा कामको अवसरहरू पनि बढाउनेछ।</p>

${img(images.tech2, "जापानमा काम गर्ने नेपाली टेक्निशियनहरू — Nepali technicians working in Japan")}

<p>हाल जापानमा लगभग १ लाख २० हजार नेपाली श्रमिकहरू विभिन्न क्षेत्रमा काम गरिरहेका छन् जसमा प्रायः भन्दा बढी विशेषज्ञ टेक्निशियनहरू हुन्।</p>`,

    contentEn: `<p>Tokyo, April 17. A special language and cultural training program has been launched for Nepali workers in Japan through a joint initiative by the Japanese government and Nepali Embassy in Tokyo.</p>

<p>The main objective of this training program is to teach the Japanese language to Nepali workers and familiarize them with the cultural values and work environment there. The plan is to provide this training to 500 new workers every month.</p>

${img(images.inline_coding, "Nepali workers participating in Japanese language training classes")}

<p>Nepali Ambassador Dr. Ganga Prasad Lama said, "Our workers always do excellent work in Japan but language and cultural barriers cause them additional difficulties. This training program will help solve that problem."</p>

<p>Workers who successfully complete the training will receive a government certificate that will also enhance their employment opportunities in Japan.</p>

${img(images.tech2, "Nepali technicians contributing to various industries across Japan")}

<p>Currently, approximately 120,000 Nepali workers are employed in various sectors in Japan, the majority being skilled technical professionals.</p>`,

    categoryId: diaspora.id,
    authorId: author1.id,
    isFeatured: false,
    tagIds: [tagNepal.id, tagEducation.id],
    publishedAt: new Date(Date.now() - 36 * 60 * 60 * 1000),
  });
  console.log("  ✓ Diaspora 5: Japan training program");

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
  });

  // Koshi Province Articles
  await createArticle({
    slug: "koshi-province-tea-tourism",
    coverImageUrl: images.society1,
    coverImageFilename: "koshi-tea-tourism.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशको चिया बगानमा पर्यटकीय गतिविधि बढ्यो",
    titleEn: "Tourist Activities Increase in Koshi Province Tea Gardens",
    subheadingNe: "इलामको चिया बगान क्षेत्रमा पर्यटकहरूको आगमन बढेको छ",
    subheadingEn: "Tourist arrivals have increased in Ilam tea garden area",
    excerptNe: "इलामको चिया बगानहरूमा पर्यटकहरूको आगमन बढेको छ। यस वर्ष लगभग ५० हजार पर्यटकहरूले इलामको चिया बगान भ्रमण गरेका छन्।",
    excerptEn: "Tourist arrivals have increased in Ilam tea gardens. About 50,000 tourists visited Ilam tea gardens this year.",
    contentNe: `<p>इलामको चिया बगान क्षेत्रमा पर्यटकहरूको आगमन बढेको छ। यस वर्ष लगभग ५० हजार पर्यटकहरूले इलामको चिया बगान भ्रमण गरेका छन्।</p>

<p>इलाम जिल्लाका चिया बगानहरू नेपालको सबैभन्दा ठूलो चिया उत्पादन क्षेत्र हो। यहाँको हरियो भर्पय्यानले पर्यटकहरूलाई आकर्षित गर्दै आएको छ।</p>

<p>स्थानीय व्यवसायीहरूले पर्यटन पूर्वाधारमा लगानी बढाएका छन्। नयाँ होटल र रेस्टुरेन्टहरू खोलिएका छन्।</p>

${img(images.society1, "इलामको चिया बगान — Ilam tea gardens")}

<p>चिया पर्यटन बढाउन स्थानीय सरकारले विभिन्न कार्यक्रम सञ्चालन गरेको छ।</p>`,
    contentEn: `<p>Tourist arrivals have increased in Ilam tea garden area. About 50,000 tourists visited Ilam tea gardens this year.</p>

<p>Ilam district is the largest tea production area in Nepal. The lush green plantations have attracted tourists.</p>

<p>Local entrepreneurs have increased investment in tourism infrastructure. New hotels and restaurants have opened.</p>

${img(images.society1, "Ilam tea gardens attract tourists")}

<p>Local government has launched various programs to boost tea tourism.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "koshi-province-flood-relief",
    coverImageUrl: images.society2,
    coverImageFilename: "koshi-flood-relief.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत वितरण",
    titleEn: "Relief Distribution for Flood Victims in Koshi Province",
    excerptNe: "कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत सामग्री वितरण गरिएको छ।",
    excerptEn: "Relief materials are being distributed to flood victims in Koshi Province.",
    contentNe: `<p>कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत सामग्री वितरण गरिएको छ।</p>

<p>जिल्ला प्रशासन कार्यालय इलामको नेतृत्वमा राहत वितरण अभियान सञ्चालन गरिएको छ।</p>`,
    contentEn: `<p>Relief materials are being distributed to flood victims in Koshi Province.</p>

<p>The relief distribution campaign is being conducted under the leadership of the Ilam District Administration Office.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "koshi-province-infrastructure",
    coverImageUrl: images.economy2,
    coverImageFilename: "koshi-infrastructure.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशमा सडक पूर्वाधार विकास",
    titleEn: "Road Infrastructure Development in Koshi Province",
    excerptNe: "कोशी प्रदेशमा सडक पूर्वाधार विकासका काम तीव्र गतिमा अघि बढेका छन्।",
    excerptEn: "Road infrastructure development works are proceeding rapidly in Koshi Province.",
    contentNe: `<p>कोशी प्रदेशमा सडक पूर्वाधार विकासका काम तीव्र गतिमा अघि बढेका छन्।</p>

<p>इलाम-काठमाडौं सडकलाई चौडा बनाउने काम भइरहेको छ।</p>`,
    contentEn: `<p>Road infrastructure development works are proceeding rapidly in Koshi Province.</p>

<p>Work is underway to widen the Ilam-Kathmandu road.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author3.id,
  });

  // Madhesh Province Articles
  await createArticle({
    slug: "koshi-province-tea-tourism",
    coverImageUrl: images.society1,
    coverImageFilename: "koshi-tea-tourism.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशको चिया बगानमा पर्यटकीय गतिविधि बढ्यो",
    titleEn: "Tourist Activities Increase in Koshi Province Tea Gardens",
    subheadingNe: "इलामको चिया बगान क्षेत्रमा पर्यटकहरूको आगमन बढेको छ",
    subheadingEn: "Tourist arrivals have increased in Ilam tea garden area",
    excerptNe: "इलामको चिया बगानहरूमा पर्यटकहरूको आगमन बढेको छ। यस वर्ष लगभग ५० हजार पर्यटकहरूले इलामको चिया बगान भ्रमण गरेका छन्।",
    excerptEn: "Tourist arrivals have increased in Ilam tea gardens. About 50,000 tourists visited Ilam tea gardens this year.",
    contentNe: `<p>इलामको चिया बगान क्षेत्रमा पर्यटकहरूको आगमन बढेको छ। यस वर्ष लगभग ५० हजार पर्यटकहरूले इलामको चिया बगान भ्रमण गरेका छन्।</p>

<p>इलाम जिल्लाका चिया बगानहरू नेपालको सबैभन्दा ठूलो चिया उत्पादन क्षेत्र हो। यहाँको हरियो भर्पय्यानले पर्यटकहरूलाई आकर्षित गर्दै आएको छ।</p>

<p>स्थानीय व्यवसायीहरूले पर्यटन पूर्वाधारमा लगानी बढाएका छन्। नयाँ होटल र रेस्टुरेन्टहरू खोलिएका छन्।</p>

${img(images.society1, "इलामको चिया बगान — Ilam tea gardens")}

<p>चिया पर्यटन बढाउन स्थानीय सरकारले विभिन्न कार्यक्रम सञ्चालन गरेको छ।</p>`,
    contentEn: `<p>Tourist arrivals have increased in Ilam tea garden area. About 50,000 tourists visited Ilam tea gardens this year.</p>

<p>Ilam district is the largest tea production area in Nepal. The lush green plantations have attracted tourists.</p>

<p>Local entrepreneurs have increased investment in tourism infrastructure. New hotels and restaurants have opened.</p>

${img(images.society1, "Ilam tea gardens attract tourists")}

<p>Local government has launched various programs to boost tea tourism.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "koshi-province-flood-relief",
    coverImageUrl: images.society2,
    coverImageFilename: "koshi-flood-relief.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत वितरण",
    titleEn: "Relief Distribution for Flood Victims in Koshi Province",
    excerptNe: "कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत सामग्री वितरण गरिएको छ।",
    excerptEn: "Relief materials are being distributed to flood victims in Koshi Province.",
    contentNe: `<p>कोशी प्रदेशमा बाढी पीडितहरूका लागि राहत सामग्री वितरण गरिएको छ।</p>

<p>जिल्ला प्रशासन कार्यालय इलामको नेतृत्वमा राहत वितरण अभियान सञ्चालन गरिएको छ।</p>`,
    contentEn: `<p>Relief materials are being distributed to flood victims in Koshi Province.</p>

<p>The relief distribution campaign is being conducted under the leadership of the Ilam District Administration Office.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "koshi-province-infrastructure",
    coverImageUrl: images.economy2,
    coverImageFilename: "koshi-infrastructure.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कोशी प्रदेशमा सडक पूर्वाधार विकास",
    titleEn: "Road Infrastructure Development in Koshi Province",
    excerptNe: "कोशी प्रदेशमा सडक पूर्वाधार विकासका काम तीव्र गतिमा अघि बढेका छन्।",
    excerptEn: "Road infrastructure development works are proceeding rapidly in Koshi Province.",
    contentNe: `<p>कोशी प्रदेशमा सडक पूर्वाधार विकासका काम तीव्र गतिमा अघि बढेका छन्।</p>

<p>इलाम-काठमाडौं सडकलाई चौडा बनाउने काम भइरहेको छ।</p>`,
    contentEn: `<p>Road infrastructure development works are proceeding rapidly in Koshi Province.</p>

<p>Work is underway to widen the Ilam-Kathmandu road.</p>`,
    categoryId: koshiProvince!.id,
    authorId: author3.id,
  });

  // Madhesh Province Articles
  await createArticle({
    slug: "madhesh-province-industrial-zone-development",
    coverImageUrl: images.economy1,
    coverImageFilename: "province2-industrial.jpg",
    uploadedById: superAdmin.id,
    titleNe: "मधेश प्रदेशमा औद्योगिक क्षेत्र विकास योजना",
    titleEn: "Industrial Zone Development Plan in Madhesh Province",
    excerptNe:
      "मधेश प्रदेशमा नयाँ औद्योगिक क्षेत्र विकास योजना घोषणा गरिएको छ।",
    excerptEn:
      "New industrial zone development plan announced in Madhesh Province.",
    contentNe: `<p>मधेश प्रदेशमा नयाँ औद्योगिक क्षेत्र विकास योजना घोषणा गरिएको छ।</p>
    <p>बिरगञ्जमा नयाँ औद्योगिक पार्क स्थापना हुनेछ।</p>`,
    contentEn: `<p>New industrial zone development plan announced in Madhesh Province.</p>
    <p>A new industrial park will be established in Birgunj.</p>`,
    categoryId: madheshProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "madhesh-province-agriculture-rice-production",
    coverImageUrl: images.politics1,
    coverImageFilename: "province2-rice.jpg",
    uploadedById: superAdmin.id,
    titleNe: "प्रदेश २ मा धान उत्पादनमा वृद्धि",
    titleEn: "Rice Production Increases in Province 2",
    excerptNe: "मधेश प्रदेशमा यस वर्ष धान उत्पादनमा वृद्धि भएको छ।",
    excerptEn: "Rice production has increased in Province 2 this year.",
    contentNe: `<p>मधेश प्रदेशमा धान उत्पादन बढेको छ।</p>`,
    contentEn: `<p>Rice production has increased in Province 2.</p>`,
    categoryId: madheshProvince!.id,
    authorId: author3.id,
  });

  await createArticle({
    slug: "madhesh-province-industrial-rice-festival",
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
    categoryId: bagmatiProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "bagmati-province-education-reform",
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
    categoryId: bagmatiProvince!.id,
    authorId: author2.id,
  });

await createArticle({
    slug: "bagmati-province-kathmandu-transport",
    coverImageUrl: images.economy1,
    coverImageFilename: "province4-hydro.jpg",
    uploadedById: superAdmin.id,
    titleNe: "काठमाडौंमा यातायात सुधार योजना",
    titleEn: "Kathmandu Transport Improvement Plan",
    excerptNe: "काठमाडौंमा यातायात सुधारका नयाँ योजनाहरू घोषणा गरिएका छन्।",
    excerptEn: "New transport improvement plans announced for Kathmandu.",
    contentNe: `<p>काठमाडौंमा यातायात सुधारका नयाँ योजनाहरू घोषणा गरिएका छन्।</p>
    <p>बस लेन र पार्किङ सुविधाहरू विस्तार गर्ने योजना छ।</p>`,
    contentEn: `<p>New transport improvement plans announced for Kathmandu.</p>
    <p>Plans include bus lanes and expanded parking facilities.</p>`,
    categoryId: bagmatiProvince!.id,
    authorId: author3.id,
  });

  // Gandaki Province Articles
  await createArticle({
    slug: "gandaki-province-hydropower-tourism",
    coverImageUrl: images.economy1,
    coverImageFilename: "province4-hydro.jpg",
    uploadedById: superAdmin.id,
    titleNe: "गण्डकी प्रदेशमा जलविद्युत् र पर्यटन परियोजना",
    titleEn: "Hydropower and Tourism Projects in Gandaki Province",
    excerptNe: "गण्डकी प्रदेशमा जलविद्युत् र पर्यटन परियोजनाहरू अघि बढिरहेका छन्।",
    excerptEn: "Hydropower and tourism projects are progressing in Gandaki Province.",
    contentNe: `<p>गण्डकी प्रदेशमा जलविद्युत् परियोजनाहरू अघि बढिरहेका छन्।</p>
    <p>पोखरा क्षेत्रमा पर्यटन विस्तार भइरहेको छ।</p>`,
    contentEn: `<p>Hydropower projects are progressing in Gandaki Province.</p>
    <p>Tourism expansion is underway in Pokhara area.</p>`,
    categoryId: gandakiProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "gandaki-province-pokhara-airport",
    coverImageUrl: images.society2,
    coverImageFilename: "gandaki-airport.jpg",
    uploadedById: superAdmin.id,
    titleNe: "पोखरा विमानस्थलको स्तरोन्नति शुरु",
    titleEn: "Pokhara Airport Upgrade Begins",
    excerptNe: "पोखरा विमानस्थलको स्तरोन्नति कार्य शुरु भएको छ।",
    excerptEn: "Pokhara airport upgrade work has begun.",
    contentNe: `<p>पोखरा विमानस्थलको स्तरोन्नति कार्य शुरु भएको छ।</p>`,
    contentEn: `<p>Pokhara airport upgrade work has begun.</p>`,
    categoryId: gandakiProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "gandaki-province-lake-conservation",
    coverImageUrl: images.entertain2,
    coverImageFilename: "gandaki-lake.jpg",
    uploadedById: superAdmin.id,
    titleNe: "फेवाताल संरक्षण अभियान सञ्चालन",
    titleEn: "Phewa Lake Conservation Campaign Launched",
    excerptNe: "फेवाताल संरक्षणका लागि नयाँ अभियान सञ्चालन गरिएको छ।",
    excerptEn: "New campaign launched for Phewa Lake conservation.",
    contentNe: `<p>फेवाताल संरक्षणका लागि नयाँ अभियान सञ्चालन गरिएको छ।</p>`,
    contentEn: `<p>New campaign launched for Phewa Lake conservation.</p>`,
    categoryId: gandakiProvince!.id,
    authorId: author3.id,
  });

  // Lumbini Province Articles
  await createArticle({
    slug: "lumbini-province-tourism-development",
    coverImageUrl: images.entertain1,
    coverImageFilename: "province5-lumbini.jpg",
    uploadedById: superAdmin.id,
    titleNe: "लुम्बिनी प्रदेशमा पर्यटन विकास",
    titleEn: "Tourism Development in Lumbini Province",
    subheadingNe: "कपिलवस्तुमा नयाँ पर्यटन पूर्वाधार विकास",
    subheadingEn: "New tourism infrastructure development in Kapilvastu",
    excerptNe: "लुम्बिनी प्रदेशमा पर्यटन विकासका नयाँ योजनाहरू घोषणा गरिएका छन्।",
    excerptEn: "New tourism development plans announced in Lumbini Province.",
    contentNe: `<p>लुम्बिनी प्रदेशमा पर्यटन विकासका नयाँ योजनाहरू घोषणा गरिएका छन्।</p>
    <p>कपिलवस्तुमा होटल निर्माण हुनेछ।</p>`,
    contentEn: `<p>New tourism development plans announced in Lumbini Province.</p>
    <p>Hotels will be built in Kapilvastu.</p>`,
    categoryId: lumbiniProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "lumbini-province-agriculture",
    coverImageUrl: images.economy2,
    coverImageFilename: "lumbini-agriculture.jpg",
    uploadedById: superAdmin.id,
    titleNe: "लुम्बिनी प्रदेशमा कृषि विकास",
    titleEn: "Agriculture Development in Lumbini Province",
    excerptNe: "लुम्बिनी प्रदेशमा कृषि विकासका कार्यक्रम सञ्चालन गरिएका छन्।",
    excerptEn: "Agriculture development programs are being conducted in Lumbini Province.",
    contentNe: `<p>लुम्बिनी प्रदेशमा कृषि विकासका कार्यक्रम सञ्चालन गरिएका छन्।</p>`,
    contentEn: `<p>Agriculture development programs are being conducted in Lumbini Province.</p>`,
    categoryId: lumbiniProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "lumbini-province-buddhist-circuit",
    coverImageUrl: images.entertain2,
    coverImageFilename: "lumbini-buddhist.jpg",
    uploadedById: superAdmin.id,
    titleNe: "बुद्ध धर्म पर्यटन क्षेत्र विकास",
    titleEn: "Buddhist Circuit Tourism Development",
    excerptNe: "कपिलवस्तुमा बुद्ध धर्म पर्यटन क्षेत्र विकासका योजनाहरू अघि बढेका छन्।",
    excerptEn: "Buddhist circuit tourism area development plans are progressing in Kapilvastu.",
    contentNe: `<p>कपिलवस्तुमा बुद्ध धर्म पर्यटन क्षेत्र विकासका योजनाहरू अघि बढेका छन्।</p>`,
    contentEn: `<p>Buddhist circuit tourism area development plans are progressing in Kapilvastu.</p>`,
    categoryId: lumbiniProvince!.id,
    authorId: author3.id,
  });

// Karnali Province Articles
  await createArticle({
    slug: "karnali-province-mining-exploration",
    coverImageUrl: images.economy1,
    coverImageFilename: "province6-mining.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण",
    titleEn: "Mineral Exploration in Karnali Province",
    subheadingNe: "छोरला क्षेत्रमा खानी खोजी कार्य शुरु",
    subheadingEn: "Mining exploration begins in Chhetra area",
    excerptNe: "कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण कार्य शुरु भएको छ।",
    excerptEn: "Mineral exploration work has begun in Karnali Province.",
    contentNe: `<p>कर्णाली प्रदेशमा खानी पदार्थ अन्वेषण कार्य शुरु भएको छ।</p>
    <p>छोरला क्षेत्रमा तामा र सुनको खोजी भइरहेको छ।</p>`,
    contentEn: `<p>Mineral exploration work has begun in Karnali Province.</p>
    <p>Exploration for copper and gold is underway in Chhetra area.</p>`,
    categoryId: karnaliProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "karnali-province-tourism-rafting",
    coverImageUrl: images.society2,
    coverImageFilename: "karnali-rafting.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कर्णाली नदीमा राफ्टिङ पर्यटन",
    titleEn: "Karnali River Rafting Tourism",
    excerptNe: "कर्णाली नदीमा राफ्टिङ पर्यटन लोकप्रिय हुँदै गएको छ।",
    excerptEn: "Karnali River rafting tourism is becoming popular.",
    contentNe: `<p>कर्णाली नदीमा राफ्टिङ पर्यटन लोकप्रिय हुँदै गएको छ।</p>`,
    contentEn: `<p>Karnali River rafting tourism is becoming popular.</p>`,
    categoryId: karnaliProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "karnali-province-mountain-conservation",
    coverImageUrl: images.entertain2,
    coverImageFilename: "karnali-mountain.jpg",
    uploadedById: superAdmin.id,
    titleNe: "कर्णाली हिमाल संरक्षण अभियान",
    titleEn: "Karnali Mountain Conservation Campaign",
    excerptNe: "कर्णाली हिमाल संरक्षणका लागि नयाँ अभियान सञ्चालन गरिएको छ।",
    excerptEn: "New campaign launched for Karnali mountain conservation.",
    contentNe: `<p>कर्णाली हिमाल संरक्षणका लागि नयाँ अभियान सञ्चालन गरिएको छ।</p>`,
    contentEn: `<p>New campaign launched for Karnali mountain conservation.</p>`,
    categoryId: karnaliProvince!.id,
    authorId: author3.id,
  });

  // Sudurpashchim Province Articles
  await createArticle({
    slug: "sudurpashchim-province-border-trade",
    coverImageUrl: images.economy1,
    coverImageFilename: "province7-trade.jpg",
    uploadedById: superAdmin.id,
    titleNe: "सुदूरपश्चिम प्रदेशमा सीमा व्यापार वृद्धि",
    titleEn: "Border Trade Increases in Sudurpashchim Province",
    excerptNe: "सुदूरपश्चिम प्रदेशमा भारतसँगको सीमा व्यापार बढेको छ।",
    excerptEn: "Border trade with India has increased in Sudurpashchim Province.",
    contentNe: `<p>सुदूरपश्चिम प्रदेशमा भारतसँगको सीमा व्यापार बढेको छ।</p>
    <p>दार्चुला नाकाबाट आयात निर्यात बढेको छ।</p>`,
    contentEn: `<p>Border trade with India has increased in Sudurpashchim Province.</p>
    <p>Import-export has increased through Darcula border point.</p>`,
    categoryId: sudurpashchimProvince!.id,
    authorId: author1.id,
  });

  await createArticle({
    slug: "sudurpashchim-province-apple-farming",
    coverImageUrl: images.economy2,
    coverImageFilename: "sudurpashchim-apple.jpg",
    uploadedById: superAdmin.id,
    titleNe: "सुदूरपश्चिममा स्याउ खेती विस्तार",
    titleEn: "Apple Farming Expansion in Sudurpashchim",
    excerptNe: "सुदूरपश्चिम प्रदेशमा स्याउ खेती विस्तार भइरहेको छ।",
    excerptEn: "Apple farming is expanding in Sudurpashchim Province.",
    contentNe: `<p>सुदूरपश्चिम प्रदेशमा स्याउ खेती विस्तार भइरहेको छ।</p>`,
    contentEn: `<p>Apple farming is expanding in Sudurpashchim Province.</p>`,
    categoryId: sudurpashchimProvince!.id,
    authorId: author2.id,
  });

  await createArticle({
    slug: "sudurpashchim-province-darchula-tourism",
    coverImageUrl: images.society1,
    coverImageFilename: "sudurpashchim-tourism.jpg",
    uploadedById: superAdmin.id,
    titleNe: "दार्चुला पर्यटन क्षेत्र विकास",
    titleEn: "Darchula Tourism Area Development",
    excerptNe: "दार्चुलामा पर्यटन क्षेत्र विकासका कार्यहरू अघि बढेका छन्।",
    excerptEn: "Tourism area development works are progressing in Darchula.",
    contentNe: `<p>दार्चुलामा पर्यटन क्षेत्र विकासका कार्यहरू अघि बढेका छन्।</p>`,
    contentEn: `<p>Tourism area development works are progressing in Darchula.</p>`,
    categoryId: sudurpashchimProvince!.id,
    authorId: author3.id,
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
  // ARTICLES FOR SUBCATEGORIES
  // ═══════════════════════════════════════════

  // Get subcategory IDs
  const subcategoryMap: Record<string, string> = {};
  const subcategorySlugs = [
    "federal-politics", "provincial-politics", "local-politics", "elections", "political-parties",
    "parliament", "government", "opposition", "political-analysis", "political-news",
    "cricket", "football", "volleyball", "basketball", "hockey", "athletics", "swimming", "boxing", "martial-arts", "sports-news",
    "gadgets", "ai-artificial-intelligence", "startups", "cybersecurity", "mobile-phones", "computers", "internet", "social-media", "tech-news", "software-apps",
    "bollywood", "hollywood", "nepali-cinema", "music", "television", "movies", "celebrity", "fashion", "gossip", "entertainment-news",
    "stock-market", "banking", "investment", "business", "trade", "tourism", "agriculture", "real-estate", "jobs", "economy-news",
    "asia", "europe", "americas", "africa", "middle-east", "un", "diplomacy", "global-economy", "climate-change", "world-news",
    "education", "health", "women-empowerment", "children", "senior-citizens", "social-issues", "community", "volunteer", "ngos", "society-news",
    "mental-health", "nutrition", "fitness", "diseases", "hospitals", "doctors", "medicine", "ayurveda", "covid19", "health-tips",
    "food-recipes", "travel", "fashion-style", "home-living", "relationships", "parenting", "pets", "beauty-skincare", "fitness-yoga", "lifestyle-news",
    "festivals", "temples", "rituals", "astrology", "spiritual", "puja-path", "religious-places", "culture-heritage", "traditions", "dharma-news",
    "nri-news", "remittance", "overseas-jobs", "diaspora-community", "cultural-association", "diaspora-events", "nepal-embassy", "citizenship-abroad", "diaspora-investment", "diaspora-news",
    "news-story", "feature-story", " investigative-story", "human-interest", "success-story", "frontline", "profile", "opinion-piece", "analysis-piece", "special-report",
    "editorial", "opinion-column", "guest-article", "letter-to-editor", "political-opinion", "social-commentary", "economic-analysis", "cultural-review", "sports-view", "opinion-news",
  ];
  
  for (const slug of subcategorySlugs) {
    const cat = await prisma.category.findUnique({ where: { slug } });
    if (cat) subcategoryMap[slug] = cat.id;
  }

  // Generic article images
  const articleImages = [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80",
    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&q=80",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
  ];

  // Create 5 articles for each subcategory (all 100 subcategories = 500 articles)
  const targetSubcategories = Object.keys(subcategoryMap);

  let articleCount = 0;
  for (const subSlug of targetSubcategories) {
    const categoryId = subcategoryMap[subSlug];
    if (!categoryId) continue;

    for (let i = 1; i <= 5; i++) {
      const slug = `${subSlug}-article-${i}`;
      const imgUrl = articleImages[(articleCount + i - 1) % articleImages.length];
      const imgFilename = `subcat-${subSlug}-${i}.jpg`;

      let media = await prisma.media.findFirst({ where: { filename: imgFilename } });
      if (!media) {
        media = await prisma.media.create({
          data: {
            filename: imgFilename,
            url: imgUrl,
            type: MediaType.IMAGE,
            altText: `Image for ${slug}`,
            size: 350000,
            uploadedBy: author1.id,
          }
        });
      }

      await prisma.article.upsert({
        where: { slug },
        update: {},
        create: {
          titleNe: `${subSlug.replace(/-/g, ' ')} सम्बन्धी समाचार ${i}`,
          titleEn: `News about ${subSlug.replace(/-/g, ' ')} ${i}`,
          contentNe: `<p>यो ${subSlug} सम्बन्धी लेख ${i} हो।</p><p>नेपालमा यस विषयमा धेरै चासो छ।</p>`,
          contentEn: `<p>This is article ${i} about ${subSlug}.</p><p>There is great interest in this topic in Nepal.</p>`,
          excerptNe: `${subSlug} सम्बन्धी छोटो समाचार ${i}`,
          excerptEn: `Short news about ${subSlug} ${i}`,
          slug,
          status: ArticleStatus.PUBLISHED,
          isFeatured: i === 1,
          isFlashUpdate: i === 1 && articleCount < 3,
          categoryId,
          authorId: author1.id,
          publishedAt: new Date(Date.now() - (articleCount * 60 * 60 * 1000)),
          featuredImageId: media.id,
        }
      });
    }
    articleCount += 5;
  }

console.log(`✅ Subcategory Articles: ${articleCount} articles created for ${targetSubcategories.length} subcategories`);

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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/rajeshsharma",
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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/priyarai",
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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/amitgurung",
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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/bikashkarki",
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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/sitathapa",
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
      newsEmail: "sports@newsportal.com",
      facebook: "https://facebook.com/deeplama",
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
  console.log("   Categories:   15 main + 130 subcategories (145 total)");
  console.log("   Tags:         15");
  console.log("   Articles:     20 main + 650 subcategory articles (670 total)");
  console.log("   Comments:     20  (with various statuses)");
  console.log("   Videos:       10  (published)");
  console.log("   Horoscopes:   12  (all zodiac signs)");
  console.log("   Ads:          5");
  console.log("   Poll:         1   (active with 5 options)");
  console.log("   Team Members: 6");
  console.log("   Settings:     7");
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

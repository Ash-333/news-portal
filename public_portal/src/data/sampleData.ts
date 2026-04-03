import {
  Article,
  Category,
  Author,
  Tag,
  NavItem,
  Province,
  Match,
  MarketData,
  WeatherData,
} from "@/types";

// Categories
export const categories: Category[] = [
  {
    id: "1",
    slug: "politics",
    name: "Politics",
    nameNe: "राजनीति",
    color: "#cc0000",
  },
  {
    id: "2",
    slug: "business",
    name: "Business",
    nameNe: "व्यापार",
    color: "#0066cc",
  },
  {
    id: "3",
    slug: "sports",
    name: "Sports",
    nameNe: "खेलकुद",
    color: "#009900",
  },
  {
    id: "4",
    slug: "entertainment",
    name: "Entertainment",
    nameNe: "मनोरञ्जन",
    color: "#9900cc",
  },
  {
    id: "5",
    slug: "technology",
    name: "Technology",
    nameNe: "प्रविधि",
    color: "#ff6600",
  },
  {
    id: "6",
    slug: "health",
    name: "Health",
    nameNe: "स्वास्थ्य",
    color: "#00cccc",
  },
  {
    id: "7",
    slug: "education",
    name: "Education",
    nameNe: "शिक्षा",
    color: "#663399",
  },
  { id: "8", slug: "world", name: "World", nameNe: "विश्व", color: "#cc6600" },
  {
    id: "9",
    slug: "national",
    name: "National",
    nameNe: "राष्ट्रिय",
    color: "#cc0000",
  },
  {
    id: "10",
    slug: "opinion",
    name: "Opinion",
    nameNe: "विचार",
    color: "#666666",
  },
];

// Authors
export const authors: Author[] = [
  {
    id: "1",
    slug: "ram-sharma",
    name: "Ram Sharma",
    nameNe: "राम शर्मा",
    email: "ram@yoursite.com",
    bio: "Senior political correspondent with 10 years of experience.",
    bioNe: "१० वर्षको अनुभव भएका वरिष्ठ राजनीतिक संवाददाता।",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    articleCount: 156,
  },
  {
    id: "2",
    slug: "sita-gurung",
    name: "Sita Gurung",
    nameNe: "सीता गुरुङ",
    email: "sita@yoursite.com",
    bio: "Business and economy expert.",
    bioNe: "व्यापार र अर्थतन्त्र विज्ञ।",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    articleCount: 89,
  },
  {
    id: "3",
    slug: "hari-prasad",
    name: "Hari Prasad",
    nameNe: "हरि प्रसाद",
    email: "hari@yoursite.com",
    bio: "Sports journalist covering cricket and football.",
    bioNe: "क्रिकेट र फुटबल कभर गर्ने खेल पत्रकार।",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    articleCount: 234,
  },
];

// Tags
export const tags: Tag[] = [
  { id: "1", slug: "government", name: "Government", nameNe: "सरकार" },
  { id: "2", slug: "election", name: "Election", nameNe: "निर्वाचन" },
  { id: "3", slug: "economy", name: "Economy", nameNe: "अर्थतन्त्र" },
  { id: "4", slug: "cricket", name: "Cricket", nameNe: "क्रिकेट" },
  { id: "5", slug: "football", name: "Football", nameNe: "फुटबल" },
  { id: "6", slug: "bollywood", name: "Bollywood", nameNe: "बलिउड" },
  { id: "7", slug: "technology", name: "Technology", nameNe: "प्रविधि" },
  { id: "8", slug: "health", name: "Health", nameNe: "स्वास्थ्य" },
];

// Sample Articles
export const articles: Article[] = [
  {
    id: "1",
    slug: "government-announces-new-economic-policy",
    title: "Government Announces New Economic Policy for Fiscal Year 2024/25",
    titleNe: "सरकारले आर्थिक वर्ष २०८१/८२ को नयाँ आर्थिक नीति घोषणा गर्यो",
    excerpt:
      "The government has unveiled a comprehensive economic policy focusing on digital transformation and sustainable development.",
    excerptNe:
      "सरकारले डिजिटल रूपान्तरण र दिगो विकासमा केन्द्रित व्यापक आर्थिक नीति अनावरण गरेको छ।",
    content: `<p>The government has announced a new economic policy for the fiscal year 2024/25, focusing on digital transformation, sustainable development, and inclusive growth. The policy aims to boost the country's GDP growth rate to 6.5% while maintaining inflation below 6%.</p>
    <p>Key highlights of the policy include:</p>
    <ul>
      <li>Investment in digital infrastructure</li>
      <li>Promotion of renewable energy</li>
      <li>Support for small and medium enterprises</li>
      <li>Expansion of social security programs</li>
    </ul>
    <p>Finance Minister stated that this policy will create more job opportunities and improve the living standards of citizens.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=500&fit=crop",
    category: categories[1],
    author: authors[1],
    tags: [tags[0], tags[2]],
    publishedAt: "2024-03-18T10:30:00Z",
    modifiedAt: "2024-03-18T14:00:00Z",
    readTime: 5,
    views: 12500,
    isBreaking: true,
    isFeatured: true,
  },
  {
    id: "2",
    slug: "nepal-cricket-team-wins-thriller",
    title: "Nepal Cricket Team Wins Thriller Against UAE",
    titleNe: "नेपाली क्रिकेट टोलीले युएईविरुद्ध रोमाञ्चक जित हासिल गर्यो",
    excerpt:
      "In a nail-biting finish, Nepal secured a 3-run victory over UAE in the ICC Cricket World Cup League 2.",
    excerptNe:
      "रोमाञ्चक अन्त्यमा नेपालले आईसीसी क्रिकेट विश्वकप लिग २ मा युएईमाथि ३ रनको जित सुरक्षित गर्यो।",
    content: `<p>Nepal's cricket team delivered a stunning performance yesterday, defeating UAE by 3 runs in a thrilling encounter at the Tribhuvan University International Cricket Ground.</p>
    <p>Chasing 245, UAE were restricted to 241/9 in their 50 overs, thanks to some exceptional bowling by Nepal's spinners in the death overs.</p>
    <p>Player of the Match Rohit Paudel praised the team's fighting spirit and credited the home crowd for their tremendous support.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=500&fit=crop",
    category: categories[2],
    author: authors[2],
    tags: [tags[3]],
    publishedAt: "2024-03-18T08:00:00Z",
    readTime: 4,
    views: 18700,
    isBreaking: true,
    isFeatured: true,
  },
  {
    id: "3",
    slug: "new-ai-technology-transforming-healthcare",
    title: "New AI Technology Transforming Healthcare in Nepal",
    titleNe: "नेपालमा स्वास्थ्य सेवा रूपान्तरण गरिरहेको नयाँ एआई प्रविधि",
    excerpt:
      "Artificial Intelligence is revolutionizing healthcare delivery across the country, from diagnosis to treatment.",
    excerptNe:
      "कृत्रिम बुद्धिमत्ताले देशभर स्वास्थ्य सेवा प्रवाहमा क्रान्ति ल्याइरहेको छ, निदानदेखि उपचारसम्म।",
    content: `<p>Artificial Intelligence is making significant inroads into Nepal's healthcare sector, with hospitals and clinics adopting AI-powered diagnostic tools and treatment planning systems.</p>
    <p>Major hospitals in Kathmandu have reported a 30% improvement in diagnostic accuracy since implementing AI-assisted imaging analysis.</p>
    <p>Health experts believe this technology will help address the shortage of specialist doctors in rural areas.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop",
    category: categories[5],
    author: authors[0],
    tags: [tags[6], tags[7]],
    publishedAt: "2024-03-17T15:00:00Z",
    readTime: 6,
    views: 8900,
    isFeatured: true,
  },
  {
    id: "4",
    slug: "monsoon-predictions-for-this-year",
    title: "Monsoon Predictions: Above Average Rainfall Expected This Year",
    titleNe: "मनसुन पूर्वानुमान: यस वर्ष औसतभन्दा बढी वर्षा हुने अपेक्षा",
    excerpt:
      "Meteorological Department forecasts above-average monsoon rainfall, raising hopes for agricultural production.",
    excerptNe:
      "मौसम विज्ञान विभागले औसतभन्दा बढी मनसुन वर्षाको पूर्वानुमान गरेको छ, कृषि उत्पादनको लागि आशा बढाएको छ।",
    content: `<p>The Department of Hydrology and Meteorology has predicted above-average monsoon rainfall for the year 2024, bringing relief to farmers who suffered from drought last year.</p>
    <p>According to the forecast, the monsoon is expected to arrive on time and bring 15-20% more rainfall than the long-term average.</p>
    <p>Agricultural experts say this could lead to a bumper crop production if the distribution is uniform across the country.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&h=500&fit=crop",
    category: categories[8],
    author: authors[0],
    tags: [tags[0]],
    publishedAt: "2024-03-17T12:00:00Z",
    readTime: 4,
    views: 11200,
  },
  {
    id: "5",
    slug: "bollywood-star-visits-kathmandu",
    title: "Bollywood Superstar Visits Kathmandu for Film Promotion",
    titleNe: "बलिउड सुपरस्टार चलचित्र प्रवर्द्धनका लागि काठमाडौं आए",
    excerpt:
      "Famous Bollywood actor visited the capital city to promote his upcoming movie.",
    excerptNe:
      "प्रसिद्ध बलिउड अभिनेताले आफ्नो आगामी चलचित्रको प्रवर्द्धनका लागि राजधानी शहरको भ्रमण गरे।",
    content: `<p>A famous Bollywood superstar visited Kathmandu yesterday to promote his upcoming action thriller movie. The actor was welcomed by thousands of fans at Tribhuvan International Airport.</p>
    <p>During his visit, he met with local filmmakers and discussed potential collaboration opportunities between Bollywood and Nepali cinema.</p>
    <p>The actor also visited Pashupatinath Temple and expressed his love for Nepali culture and hospitality.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=500&fit=crop",
    category: categories[3],
    author: authors[1],
    tags: [tags[5]],
    publishedAt: "2024-03-16T18:30:00Z",
    readTime: 3,
    views: 25600,
  },
  {
    id: "6",
    slug: "education-reform-bill-passed",
    title: "Education Reform Bill Passed by Parliament",
    titleNe: "संसदद्वारा शिक्षा सुधार विधेयक पारित",
    excerpt:
      "The new bill aims to overhaul the education system and improve quality of learning.",
    excerptNe:
      "नयाँ विधेयकले शिक्षा प्रणालीको पूर्ण पुनर्गठन र सिकाइको गुणस्तर सुधार गर्ने लक्ष्य राखेको छ।",
    content: `<p>Parliament has passed the much-awaited Education Reform Bill with an overwhelming majority, paving the way for comprehensive changes in the country's education system.</p>
    <p>The bill introduces several key reforms including:</p>
    <ul>
      <li>Technology-integrated learning from primary level</li>
      <li>Vocational training programs in secondary schools</li>
      <li>Teacher quality improvement initiatives</li>
      <li>Increased budget allocation for education</li>
    </ul>
    <p>Education Minister called it a historic day for Nepal's education sector.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=500&fit=crop",
    category: categories[6],
    author: authors[0],
    tags: [tags[0], tags[1]],
    publishedAt: "2024-03-16T14:00:00Z",
    readTime: 5,
    views: 9800,
  },
  {
    id: "7",
    slug: "tourism-industry-recovery",
    title: "Tourism Industry Shows Strong Signs of Recovery",
    titleNe: "पर्यटन उद्योगले सुधारका बलिया संकेत देखायो",
    excerpt:
      "Tourist arrivals have increased by 25% compared to last year, indicating a robust recovery.",
    excerptNe:
      "पर्यटक आगमन गत वर्षको तुलनामा २५% ले बढेको छ, बलियो पुनर्प्राप्तिको संकेत दिँदै।",
    content: `<p>Nepal's tourism industry is showing strong signs of recovery with tourist arrivals increasing by 25% compared to the same period last year.</p>
    <p>The Nepal Tourism Board reported that over 150,000 tourists visited the country in the first two months of 2024, marking a significant rebound from the pandemic-induced slump.</p>
    <p>Popular destinations include Everest Base Camp, Pokhara, and Lumbini, with adventure tourism seeing the highest growth.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&h=500&fit=crop",
    category: categories[1],
    author: authors[1],
    tags: [tags[2]],
    publishedAt: "2024-03-15T10:00:00Z",
    readTime: 4,
    views: 13400,
  },
  {
    id: "8",
    slug: "world-cup-qualifiers-update",
    title: "World Cup Qualifiers: Nepal Faces Tough Challenge Ahead",
    titleNe: "विश्वकप छनोट: नेपाल सामु कडा चुनौती",
    excerpt:
      "The national team prepares for crucial matches in the FIFA World Cup 2026 qualifiers.",
    excerptNe:
      "राष्ट्रिय टोली फिफा विश्वकप २०२६ छनोटका महत्वपूर्ण खेलहरूको तयारी गरिरहेको छ।",
    content: `<p>The Nepali national football team is gearing up for crucial matches in the FIFA World Cup 2026 qualifiers, facing tough opponents in the upcoming fixtures.</p>
    <p>Head coach expressed confidence in the team's preparation, highlighting the improved fitness levels and tactical understanding among players.</p>
    <p>The All Nepal Football Association has announced special training camps and friendly matches to help the team prepare better.</p>`,
    featuredImage:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
    category: categories[2],
    author: authors[2],
    tags: [tags[4]],
    publishedAt: "2024-03-15T08:00:00Z",
    readTime: 4,
    views: 15600,
  },
];

// Navigation items
export const navItems: NavItem[] = [
  { label: "Home", labelNe: "गृहपृष्ठ", href: "/" },
  { label: "National", labelNe: "राष्ट्रिय", href: "/category/national" },
  { label: "Politics", labelNe: "राजनीति", href: "/category/politics" },
  { label: "Business", labelNe: "व्यापार", href: "/category/business" },
  { label: "Sports", labelNe: "खेलकुद", href: "/category/sports" },
  {
    label: "Entertainment",
    labelNe: "मनोरञ्जन",
    href: "/category/entertainment",
  },
  { label: "Technology", labelNe: "प्रविधि", href: "/category/technology" },
  { label: "Health", labelNe: "स्वास्थ्य", href: "/category/health" },
  { label: "World", labelNe: "विश्व", href: "/category/world" },
  { label: "Opinion", labelNe: "विचार", href: "/category/opinion" },
];

// Provinces
export const provinces: Province[] = [
  {
    id: "1",
    name: "Koshi",
    nameNe: "कोशी",
    capital: "Biratnagar",
    capitalNe: "बिराटनगर",
  },
  {
    id: "2",
    name: "Madhesh",
    nameNe: "मधेश",
    capital: "Janakpur",
    capitalNe: "जनकपुर",
  },
  {
    id: "3",
    name: "Bagmati",
    nameNe: "बागमती",
    capital: "Hetauda",
    capitalNe: "हेटौडा",
  },
  {
    id: "4",
    name: "Gandaki",
    nameNe: "गण्डकी",
    capital: "Pokhara",
    capitalNe: "पोखरा",
  },
  {
    id: "5",
    name: "Lumbini",
    nameNe: "लुम्बिनी",
    capital: "Deukhuri",
    capitalNe: "देउखुरी",
  },
  {
    id: "6",
    name: "Karnali",
    nameNe: "कर्णाली",
    capital: "Birendranagar",
    capitalNe: "बिरेन्द्रनगर",
  },
  {
    id: "7",
    name: "Sudurpashchim",
    nameNe: "सुदूरपश्चिम",
    capital: "Godawari",
    capitalNe: "गोदावरी",
  },
];

// Weather data
export const weatherData: WeatherData = {
  temperature: 24,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  location: "Kathmandu",
};

// Market data
export const marketData: MarketData = {
  gold: {
    perTola: 118500,
    per10g: 101600,
    change: 500,
  },
  silver: {
    perTola: 1420,
    change: -10,
  },
  forex: {
    usd: 133.45,
    eur: 145.2,
    gbp: 168.5,
    change: 0.25,
  },
  nepse: {
    index: 2056.78,
    change: 15.32,
    changePercent: 0.75,
    volume: 125000000,
  },
};

// Sports matches
export const matches: Match[] = [
  {
    id: "1",
    tournament: "ICC Cricket World Cup League 2",
    team1: {
      name: "Nepal",
      nameNe: "नेपाल",
      score: 245,
      logo: "/images/teams/nepal.png",
    },
    team2: {
      name: "UAE",
      nameNe: "युएई",
      score: 241,
      logo: "/images/teams/uae.png",
    },
    status: "finished",
    startTime: "2024-03-18T06:00:00Z",
    venue: "TU Cricket Ground",
  },
  {
    id: "2",
    tournament: "FIFA World Cup Qualifiers",
    team1: {
      name: "Nepal",
      nameNe: "नेपाल",
      logo: "/images/teams/nepal-football.png",
    },
    team2: {
      name: "Bahrain",
      nameNe: "बहराइन",
      logo: "/images/teams/bahrain.png",
    },
    status: "upcoming",
    startTime: "2024-03-25T12:00:00Z",
    venue: "Dasharath Stadium",
  },
  {
    id: "3",
    tournament: "IPL 2024",
    team1: {
      name: "Mumbai Indians",
      nameNe: "मुम्बई इन्डियन्स",
      score: 185,
      logo: "/images/teams/mi.png",
    },
    team2: {
      name: "Chennai Super Kings",
      nameNe: "चेन्नई सुपर किङ्स",
      score: 180,
      logo: "/images/teams/csk.png",
    },
    status: "live",
    startTime: "2024-03-18T14:00:00Z",
    venue: "Wankhede Stadium",
  },
];

// Breaking news
export const breakingNews = [
  {
    id: "1",
    title: "Government Announces New Economic Policy for Fiscal Year 2024/25",
    titleNe: "सरकारले आर्थिक वर्ष २०८१/८२ को नयाँ आर्थिक नीति घोषणा गर्यो",
    slug: "government-announces-new-economic-policy",
  },
  {
    id: "2",
    title: "Nepal Cricket Team Wins Thriller Against UAE",
    titleNe: "नेपाली क्रिकेट टोलीले युएईविरुद्ध रोमाञ्चक जित हासिल गर्यो",
    slug: "nepal-cricket-team-wins-thriller",
  },
  {
    id: "3",
    title: "Heavy Rainfall Expected in Eastern Nepal",
    titleNe: "पूर्वी नेपालमा भारी वर्षाको सम्भावना",
    slug: "heavy-rainfall-expected",
  },
  {
    id: "4",
    title: "New Direct Flight Route Between Kathmandu and Tokyo",
    titleNe: "काठमाडौं र टोकियोबीच नयाँ सीधा उडान मार्ग",
    slug: "new-flight-route-kathmandu-tokyo",
  },
];

// Helper functions
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return articles.filter((article) => article.category.slug === categorySlug);
}

export function getArticlesByAuthor(authorSlug: string): Article[] {
  return articles.filter((article) => article.author.slug === authorSlug);
}

export function getArticlesByTag(tagSlug: string): Article[] {
  return articles.filter((article) =>
    article.tags.some((tag) => tag.slug === tagSlug),
  );
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((article) => article.isFeatured);
}

export function getBreakingNews(): Article[] {
  return articles.filter((article) => article.isBreaking);
}

export function getLatestArticles(limit: number = 10): Article[] {
  return [...articles]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit);
}

export function getMostReadArticles(limit: number = 5): Article[] {
  return [...articles]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, limit);
}

export function getRelatedArticles(
  articleId: string,
  limit: number = 4,
): Article[] {
  const currentArticle = articles.find((a) => a.id === articleId);
  if (!currentArticle) return [];

  return articles
    .filter(
      (a) =>
        a.id !== articleId &&
        (a.category.id === currentArticle.category.id ||
          a.tags.some((t) => currentArticle.tags.some((ct) => ct.id === t.id))),
    )
    .slice(0, limit);
}

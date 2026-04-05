// Core API response types (match backend contract exactly)

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FeaturedImage {
  id: string;
  url: string;
}

export interface ArticleAuthor {
  id: string;
  name: string;
  profilePhoto?: string | null;
  bio?: string | null;
  // Additional fields from API
  slug?: string;
  nameNe?: string;
  bioNe?: string;
  email?: string;
  // Backward compatibility
  avatar?: string;
}

export interface Author {
  id: string;
  slug: string;
  name: string;
  nameNe: string;
  email: string;
  bio: string;
  bioNe: string;
  avatar: string;
  articleCount: number;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

export interface Province {
  id: string;
  name: string;
  nameNe: string;
  capital: string;
  capitalNe: string;
}

export interface ArticleCategory {
  id: string;
  nameNe: string;
  nameEn?: string;
  slug: string;
  // Backward compatibility
  name?: string;
}

export interface Tag {
  id: string;
  nameNe: string;
  nameEn?: string;
  slug: string;
  // Backward compatibility
  name?: string;
}

export interface Article {
  id: string;
  titleNe: string;
  titleEn?: string;
  excerptNe: string;
  excerptEn?: string;
  contentNe?: string;
  contentEn?: string;
  slug: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isOpinion?: boolean;
  publishedAt: string;
  viewCount?: number;
  ogImage?: string | null;
  featuredImage?: FeaturedImage | string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  author: ArticleAuthor;
  category: ArticleCategory;
  tags: Tag[];
  _count?: { comments: number };
  // Backward compatibility fields (defaults)
  title?: string;
  content?: string;
  excerpt?: string;
  views?: number;
  readTime?: number;
  modifiedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameNe: string;
  nameEn?: string;
  slug: string;
  parentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  children?: Category[];
  _count?: { articles: number };
  color?: string;
}

export interface NavItem {
  label: string;
  labelNe: string;
  href: string;
  children?: NavItem[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  editedAt?: string | null;
  likesCount?: number;
  liked?: boolean;
  user?: {
    id: string;
    name: string;
    profilePhoto: string | null;
  };
  replies?: Comment[];
  // Backward compatibility
  articleId?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  bio: string | null;
  role: string;
  language: "NEPALI" | "ENGLISH";
  createdAt: string;
}

export interface FlashUpdate {
  id: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  excerptNe: string | null;
  excerptEn: string | null;
  slug: string;
  featuredImageId: string | null;
  featuredImage: {
    id: string;
    url: string;
  } | null;
  isPublished: boolean;
  publishedAt: string;
  expiresAt: string | null;
  authorId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    profilePhoto: string | null;
  };
}

export interface VideoUpdate {
  id: string;
  titleNe: string;
  titleEn: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  iframeUrl: string;
  authorId: string;
  isPublished: boolean;
  publishedAt: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    profilePhoto: string | null;
  };
}

export interface Ad {
  id: string;
  titleNe: string;
  titleEn: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl: string;
  position:
    | "SIDEBAR_TOP"
    | "SIDEBAR_BOTTOM"
    | "HOME_MIDDLE"
    | "ARTICLE_DETAIL"
    | string;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdBy: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  tournament: string;
  team1: { name: string; nameNe?: string; score?: number; logo: string };
  team2: { name: string; nameNe?: string; score?: number; logo: string };
  status: "live" | "upcoming" | "finished";
  startTime: string;
  venue?: string;
}

export interface MarketData {
  gold: { perTola: number; per10g: number; change: number };
  silver: { perTola: number; change: number };
  forex: { usd: number; eur: number; gbp: number; change: number };
  nepse: {
    index: number;
    change: number;
    changePercent: number;
    volume: number;
  };
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

// UI language type used in the frontend
export type Language = "ne" | "en";

// Simple JSON-LD type used by existing helpers
export interface JsonLdData {
  "@context": string;
  "@type": string;
  [key: string]: any;
}

// Poll types
export interface PollOption {
  id: string;
  textEn: string;
  textNe: string;
  voteCount: number;
  percentage?: number;
}

export interface Poll {
  id: string;
  questionNe: string;
  questionEn: string;
  description?: string;
  isMultiple: boolean;
  startsAt?: string;
  expiresAt: string | null;
  options: PollOption[];
  totalVotes: number;
  hasVoted: boolean;
  votedOptionId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// Ad position types
export type AdPosition =
  | "SIDEBAR"
  | "BANNER"
  | "IN_ARTICLE"
  | "SIDEBAR_TOP"
  | "SIDEBAR_BOTTOM"
  | "HOME_MIDDLE"
  | "ARTICLE_DETAIL";

export interface AdWithPosition {
  id: string;
  titleNe: string;
  titleEn: string;
  mediaUrl: string;
  mediaType: "image" | "video" | "script";
  linkUrl: string;
  position: AdPosition;
  isActive: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// Session type for anonymous users
export interface UserSession {
  sessionId: string;
  hasVoted: boolean;
}

// Horoscope types
export interface Horoscope {
  id: string;
  zodiacSign: string;
  icon: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  date: string;
  isPublished: boolean;
  author?: {
    name: string;
  };
}

// Audio News types
export interface AudioNewsCategory {
  id: string;
  nameNe: string;
  nameEn: string;
}

export interface AudioNews {
  id: string;
  titleNe: string;
  titleEn: string;
  descriptionNe: string | null;
  descriptionEn: string | null;
  audioUrl: string;
  thumbnailUrl: string | null;
  categoryId: string | null;
  category: AudioNewsCategory | null;
  isPublished: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

import {
  Role,
  UserStatus,
  ArticleStatus,
  MediaType,
  CommentStatus,
  Language,
  Province,
} from "@prisma/client";

export type {
  Role,
  UserStatus,
  ArticleStatus,
  MediaType,
  CommentStatus,
  Language,
  Province,
};

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  profilePhoto?: string;
  bio?: string;
  role: Role;
  status: UserStatus;
  language: Language;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithStats extends User {
  articleCount: number;
  commentCount: number;
}

// Article Types
export interface Article {
  id: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  excerptNe?: string;
  excerptEn?: string;
  slug: string;
  status: ArticleStatus;
  isBreaking: boolean;
  isFeatured: boolean;
  province?: Province;
  scheduledAt?: Date;
  publishedAt?: Date;
  viewCount: number;
  authorId: string;
  categoryId: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  featuredImageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleWithRelations extends Article {
  author: Pick<User, "id" | "name" | "profilePhoto">;
  category: Category;
  tags: Tag[];
  featuredImage?: Media;
}

// Category Types
export interface Category {
  id: string;
  nameNe: string;
  nameEn: string;
  slug: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithChildren extends Category {
  children: Category[];
  articleCount: number;
  _count?: {
    articles: number;
  };
}

// Tag Types
export interface Tag {
  id: string;
  nameNe: string;
  nameEn: string;
  slug: string;
}

// Media Types
export interface Media {
  id: string;
  filename: string;
  url: string;
  type: MediaType;
  altText?: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
  uploader?: Pick<User, "id" | "name">;
}

// Video Types
export interface Video {
  id: string;
  titleNe: string;
  titleEn: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  iframeUrl: string;
  authorId: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author?: Pick<User, "id" | "name">;
}

// Advertisement Types
export interface Advertisement {
  id: string;
  titleNe: string;
  titleEn: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl?: string;
  position: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  creator?: Pick<User, "id" | "name">;
}

// FlashUpdate Types
export interface FlashUpdate {
  id: string;
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  excerptNe?: string;
  excerptEn?: string;
  slug: string;
  featuredImageId?: string;
  isPublished: boolean;
  publishedAt?: Date;
  expiresAt?: Date;
  authorId: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
  author?: Pick<User, "id" | "name" | "profilePhoto">;
  featuredImage?: Media;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  articleId: string;
  userId: string;
  parentId?: string;
  likesCount: number;
  reportCount: number;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentWithRelations extends Comment {
  user: Pick<User, "id" | "name" | "profilePhoto">;
  article: Pick<Article, "id" | "titleNe" | "titleEn" | "slug">;
  replies?: CommentWithRelations[];
}

// Bookmark Types
export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: Date;
  article?: ArticleWithRelations;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  targetType: string;
  targetId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updatedAt: Date;
}

// Analytics Types
export interface AnalyticsOverview {
  totalArticles: number;
  publishedToday: number;
  pendingReview: number;
  totalUsers: number;
  commentsToday: number;
  pageViewsToday: number;
  totalVideos: number;
  totalFlashUpdates: number;
  totalAds: number;
}

export interface DailyView {
  date: string;
  views: number;
}

export interface TopArticle {
  id: string;
  titleNe: string;
  titleEn: string;
  slug: string;
  views: number;
  authorName: string;
  categoryName: string;
  publishedAt: Date;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface AuthorStats {
  id: string;
  name: string;
  articleCount: number;
  totalViews: number;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ArticleFormData {
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  excerptNe?: string;
  excerptEn?: string;
  categoryId: string;
  tagIds: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isBreaking: boolean;
  isFeatured: boolean;
  scheduledAt?: Date;
  featuredImageId?: string;
}

export interface CategoryFormData {
  nameNe: string;
  nameEn: string;
  slug: string;
  parentId?: string;
}

export interface TagFormData {
  nameNe: string;
  nameEn: string;
  slug: string;
}

export interface UserInviteFormData {
  email: string;
  name: string;
  role: Role;
}

export interface SiteSettingsFormData {
  siteName: string;
  siteLogo?: string;
  favicon?: string;
  defaultLanguage: Language;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPassword: string;
  smtpFrom: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  autoApproveComments: boolean;
  bannedWords: string;
  maxReportsBeforeHide: number;
  force2FA: boolean;
  ipWhitelist: string;
  sessionTimeout: number;
}

export interface VideoFormData {
  titleNe: string;
  titleEn: string;
  youtubeUrl: string;
}

export interface AdvertisementFormData {
  titleNe: string;
  titleEn: string;
  mediaUrl: string;
  mediaType: string;
  linkUrl?: string;
  position: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

export interface FlashUpdateFormData {
  titleNe: string;
  titleEn: string;
  contentNe: string;
  contentEn: string;
  excerptNe?: string;
  excerptEn?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  featuredImageId?: string;
}

// Photo Gallery Types
export interface PhotoGallery {
  id: string;
  titleNe: string;
  titleEn: string;
  excerptNe?: string;
  excerptEn?: string;
  slug: string;
  isPublished: boolean;
  authorId: string;
  coverImageId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhotoGalleryWithRelations extends PhotoGallery {
  author: Pick<User, "id" | "name" | "profilePhoto">;
  coverImage?: Media;
  photos: PhotoGalleryPhotoWithMedia[];
  _count?: {
    photos: number;
  };
}

export interface PhotoGalleryPhoto {
  id: string;
  photoGalleryId: string;
  mediaId: string;
  order: number;
  captionNe?: string;
  captionEn?: string;
  createdAt: Date;
}

export interface PhotoGalleryPhotoWithMedia extends PhotoGalleryPhoto {
  media: Media;
}

export interface PhotoGalleryFormData {
  titleNe: string;
  titleEn: string;
  excerptNe?: string;
  excerptEn?: string;
  coverImageId?: string;
  isPublished?: boolean;
  photos: Array<{
    mediaId: string;
    captionNe?: string;
    captionEn?: string;
    order: number;
  }>;
}

// Filter Types
export interface ArticleFilter {
  status?: ArticleStatus;
  search?: string;
  categoryId?: string;
  authorId?: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UserFilter {
  role?: Role;
  status?: UserStatus;
  search?: string;
}

export interface CommentFilter {
  status?: CommentStatus;
  articleId?: string;
  search?: string;
}

export interface VideoFilter {
  search?: string;
  isPublished?: boolean;
}

export interface FlashUpdateFilter {
  search?: string;
  isPublished?: boolean;
  activeOnly?: boolean;
}

// Permission Matrix
export interface Permission {
  action: string;
  category: string;
  author: boolean;
  admin: boolean;
  superAdmin: boolean;
}

// Poll Types
export interface Poll {
  id: string;
  questionNe: string;
  questionEn: string;
  description?: string;
  isActive: boolean;
  isMultiple: boolean;
  startsAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
  totalVotes: number;
}

export interface PollOption {
  id: string;
  textNe: string;
  textEn: string;
  order: number;
  voteCount: number;
  percentage: number;
}

export interface PollFormData {
  questionNe: string;
  questionEn: string;
  description?: string;
  isActive: boolean;
  isMultiple: boolean;
  startsAt?: string;
  expiresAt?: string;
  options: Array<{
    textNe: string;
    textEn: string;
  }>;
}

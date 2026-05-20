import {
  Role,
  UserStatus,
  ArticleStatus,
  MediaType,
  CommentStatus,
} from "@prisma/client";

export type {
  Role,
  UserStatus,
  ArticleStatus,
  MediaType,
  CommentStatus,
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
  title: string;
  subheading?: string;
  content: string;
  excerpt?: string;
  summary?: string;
  slug: string;
  status: ArticleStatus;
  isFlashUpdate: boolean;
  isFeatured: boolean;
  isTitleOnly: boolean;
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
  author: Pick<Author, "id" | "name" | "image">;
  category: Category;
  tags: Tag[];
  featuredImage?: Media;
}

// Category Types
export interface Category {
  id: string;
  name: string;
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
  name: string;
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
  title: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  iframeUrl: string;
  authorId: string;
  isPublished: boolean;
  isLivestream: boolean;
  isFeaturedLivestream: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  author?: Pick<User, "id" | "name">;
}

// Advertisement Types
export interface Advertisement {
  id: string;
  title: string;
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
  title: string;
  content: string;
  excerpt?: string;
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
  article: Pick<Article, "id" | "title" | "slug">;
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
  title: string;
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
  title: string;
  subheading?: string;
  content: string;
  excerpt?: string;
  categoryId: string;
  subcategoryId?: string;
  tagIds: string[];
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isFlashUpdate: boolean;
  isFeatured: boolean;
  isTitleOnly: boolean;
  scheduledAt?: Date;
  featuredImageId?: string;
  authorId?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  parentId?: string;
}

export interface TagFormData {
  name: string;
  slug: string;
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
  question: string;
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
  text: string;
  order: number;
  voteCount: number;
  percentage: number;
}

export interface PollFormData {
  question: string;
  description?: string;
  isActive: boolean;
  isMultiple: boolean;
  startsAt?: string;
  expiresAt?: string;
  options: Array<{
    text: string;
  }>;
}

// Photo Gallery Types
export interface PhotoGallery {
  id: string;
  title: string;
  excerpt?: string;
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
  photos: PhotoGalleryPhoto[];
  _count?: {
    photos: number;
  };
}

export interface PhotoGalleryPhoto {
  id: string;
  photoGalleryId: string;
  mediaId: string;
  order: number;
  caption?: string;
  createdAt: Date;
  media?: Media;
}

// Author Types (for article authorship, separate from User accounts)
export interface Author {
  id: string;
  name: string;
  bio?: string;
  image?: string;
  email?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthorFormData {
  name: string;
  bio?: string;
  image?: string;
  email?: string;
  isActive?: boolean;
}

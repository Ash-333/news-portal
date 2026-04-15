import { z } from "zod";
import {
  Role,
  UserStatus,
  ArticleStatus,
  MediaType,
  CommentStatus,
  Language,
} from "@prisma/client";

const booleanFromInput = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}, z.boolean());

// Auth Validations
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// User Validations
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN]),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profilePhoto: z.string().url("Invalid URL").optional().or(z.literal("")),
  language: z.enum([Language.NEPALI, Language.ENGLISH]).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum([Role.PUBLIC_USER, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN]),
});

export const updateUserStatusSchema = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.BANNED]),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Article Validations
export const articleSchema = z.object({
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  contentNe: z.string().min(1, "Nepali content is required"),
  contentEn: z.string().min(1, "English content is required"),
  excerptNe: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  excerptEn: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  categoryId: z.string().uuid("Invalid category"),
  tagIds: z.array(z.string().uuid()).default([]),
  metaTitle: z
    .string()
    .max(70, "Meta title should be less than 70 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should be less than 160 characters")
    .optional(),
  ogImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  isBreaking: booleanFromInput.default(false),
  isFeatured: booleanFromInput.default(false),
  scheduledAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?$/,
      "Invalid datetime format. Use format like: YYYY-MM-DDTHH:MM",
    )
    .optional()
    .or(z.literal("")),
  featuredImageId: z
    .string()
    .uuid("Invalid featured image")
    .optional()
    .or(z.literal("")),
});

export const articleStatusSchema = z.object({
  status: z.enum([
    ArticleStatus.DRAFT,
    ArticleStatus.REVIEW,
    ArticleStatus.APPROVED,
    ArticleStatus.PUBLISHED,
    ArticleStatus.ARCHIVED,
  ]),
});

export const scheduleArticleSchema = z.object({
  scheduledAt: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:[+-]\d{2}:?\d{2}|Z)?$/,
      "Invalid datetime format. Use format like: YYYY-MM-DDTHH:MM",
    ),
});

// Category Validations
export const categorySchema = z.object({
  nameNe: z.string().min(1, "Nepali name is required"),
  nameEn: z.string().min(1, "English name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
  parentId: z
    .string()
    .uuid("Invalid parent category")
    .optional()
    .or(z.literal("")),
});

// Tag Validations
export const tagSchema = z.object({
  nameNe: z.string().min(1, "Nepali name is required"),
  nameEn: z.string().min(1, "English name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must contain only lowercase letters, numbers, and hyphens",
    ),
});

// Media Validations
export const mediaUpdateSchema = z.object({
  altText: z
    .string()
    .max(200, "Alt text must be less than 200 characters")
    .optional(),
});

// Comment Validations
export const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(2000, "Comment must be less than 2000 characters"),
  articleId: z.string().uuid("Invalid article"),
  parentId: z.string().uuid("Invalid parent comment").optional(),
});

export const commentStatusSchema = z.object({
  status: z.enum([
    CommentStatus.PENDING,
    CommentStatus.APPROVED,
    CommentStatus.REJECTED,
    CommentStatus.SPAM,
  ]),
});

export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment is required")
    .max(2000, "Comment must be less than 2000 characters"),
});

// Bookmark Validations
export const bookmarkSchema = z.object({
  articleId: z.string().uuid("Invalid article"),
});

// Site Settings Validations
export const siteSettingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteLogo: z.string().url("Invalid URL").optional().or(z.literal("")),
  favicon: z.string().url("Invalid URL").optional().or(z.literal("")),
  defaultLanguage: z.enum([Language.NEPALI, Language.ENGLISH]),
  smtpHost: z.string().min(1, "SMTP host is required"),
  smtpPort: z.number().int().min(1).max(65535),
  smtpUser: z.string().min(1, "SMTP user is required"),
  smtpPassword: z.string().min(1, "SMTP password is required"),
  smtpFrom: z.string().email("Invalid from email"),
  facebookUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtubeUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagramUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  autoApproveComments: z.boolean(),
  bannedWords: z.string(),
  maxReportsBeforeHide: z.number().int().min(1),
  force2FA: z.boolean(),
  ipWhitelist: z.string(),
  sessionTimeout: z.number().int().min(5).max(1440),
});

// Pagination Validations
export const paginationSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce
    .number()
    .default(20)
    .transform((val) => Math.min(val, 100)),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Filter Validations
export const articleFilterSchema = z.object({
  status: z
    .enum([
      ArticleStatus.DRAFT,
      ArticleStatus.REVIEW,
      ArticleStatus.APPROVED,
      ArticleStatus.PUBLISHED,
      ArticleStatus.ARCHIVED,
    ])
    .optional(),
  search: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  isBreaking: z
    .preprocess(
      (val) => (val === undefined ? undefined : val === "true" || val === true),
      z.boolean().optional(),
    )
    .optional(),
  isFeatured: z
    .preprocess(
      (val) => (val === undefined ? undefined : val === "true" || val === true),
      z.boolean().optional(),
    )
    .optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export const userFilterSchema = z.object({
  role: z
    .enum([Role.PUBLIC_USER, Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN])
    .optional(),
  status: z
    .enum([UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.BANNED])
    .optional(),
  search: z.string().optional(),
});

export const commentFilterSchema = z.object({
  status: z
    .enum([
      CommentStatus.PENDING,
      CommentStatus.APPROVED,
      CommentStatus.REJECTED,
      CommentStatus.SPAM,
    ])
    .optional(),
  articleId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// Analytics Validations
export const analyticsDateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  period: z
    .enum(["today", "7days", "30days", "custom"])
    .optional()
    .default("7days"),
});

// Video Validations
export const videoSchema = z.object({
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  youtubeUrl: z
    .string()
    .url("Invalid YouTube URL")
    .min(1, "YouTube URL is required"),
});

// Advertisement Validations
export const advertisementSchema = z.object({
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  mediaUrl: z.string().min(1, "Media URL is required"),
  mediaType: z.enum(["IMAGE", "GIF"]).default("IMAGE"),
  linkUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  position: z.enum(["SIDEBAR", "BANNER", "POPUP", "INLINE"]).default("SIDEBAR"),
  isActive: booleanFromInput.default(true),
  startDate: z.string().datetime().optional().or(z.literal("")),
  endDate: z.string().datetime().optional().or(z.literal("")),
});

// Flash Update Validations
export const flashUpdateSchema = z.object({
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  contentNe: z.string().min(1, "Nepali content is required"),
  contentEn: z.string().min(1, "English content is required"),
  excerptNe: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  excerptEn: z
    .string()
    .max(500, "Excerpt must be less than 500 characters")
    .optional(),
  metaTitle: z
    .string()
    .max(70, "Meta title should be less than 70 characters")
    .optional(),
  metaDescription: z
    .string()
    .max(160, "Meta description should be less than 160 characters")
    .optional(),
  ogImage: z.string().url("Invalid URL").optional().or(z.literal("")),
  featuredImageId: z
    .string()
    .uuid("Invalid featured image")
    .optional()
    .or(z.literal("")),
});

export const videoFilterSchema = z.object({
  search: z.string().optional(),
  isPublished: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

export const flashUpdateFilterSchema = z.object({
  search: z.string().optional(),
  isPublished: z.preprocess((val) => val === "true", z.boolean()).optional(),
  activeOnly: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

// Horoscope Validations
export const horoscopeSchema = z.object({
  zodiacSign: z.string().min(1, "Zodiac sign is required"),
  icon: z.string().optional().default("Sparkles"),
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  contentNe: z.string().min(1, "Nepali content is required"),
  contentEn: z.string().min(1, "English content is required"),
  date: z.string().datetime().optional().or(z.literal("")),
  isPublished: booleanFromInput.default(false),
});

export const horoscopeFilterSchema = z.object({
  search: z.string().optional(),
  zodiacSign: z.string().optional(),
  isPublished: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

// Audio News Validations
export const audioNewsSchema = z.object({
  titleNe: z.string().min(1, "Nepali title is required"),
  titleEn: z.string().min(1, "English title is required"),
  descriptionNe: z.string().optional(),
  descriptionEn: z.string().optional(),
  audioUrl: z.string().min(1, "Audio URL is required"),
  thumbnailUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  categoryId: z.string().uuid("Invalid category").optional().or(z.literal("")),
  isPublished: booleanFromInput.default(false),
});

export const audioNewsFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  isPublished: z.preprocess((val) => val === "true", z.boolean()).optional(),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type TagFormData = z.infer<typeof tagSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type BookmarkFormData = z.infer<typeof bookmarkSchema>;
export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
export type VideoFormData = z.infer<typeof videoSchema>;
export type AdvertisementFormData = z.infer<typeof advertisementSchema>;
export type HoroscopeFormData = z.infer<typeof horoscopeSchema>;
export type AudioNewsFormData = z.infer<typeof audioNewsSchema>;
export type FlashUpdateFormData = z.infer<typeof flashUpdateSchema>;

/*
  Warnings:

  - You are about to drop the column `is_breaking` on the `articles` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `invitedBy` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profilePhoto` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `users` table. All the data in the column will be lost.
  - Added the required column `name_en` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SCHEDULED');

-- AlterEnum
ALTER TYPE "ArticleStatus" ADD VALUE 'SCHEDULED';

-- AlterEnum
ALTER TYPE "UserStatus" ADD VALUE 'PENDING';

-- AlterTable
ALTER TABLE "articles" DROP COLUMN "is_breaking",
ADD COLUMN     "is_flash_update" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subheading_en" TEXT,
ADD COLUMN     "subheading_ne" TEXT,
ADD COLUMN     "summary_en" TEXT,
ADD COLUMN     "summary_ne" TEXT;

-- AlterTable
ALTER TABLE "media" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified",
DROP COLUMN "invitedBy",
DROP COLUMN "name",
DROP COLUMN "profilePhoto",
DROP COLUMN "twoFactorEnabled",
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_ne" TEXT,
ADD COLUMN     "profile_photo" TEXT;

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title_ne" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "youtube_url" TEXT NOT NULL,
    "thumbnail_url" TEXT NOT NULL,
    "iframe_url" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advertisements" (
    "id" TEXT NOT NULL,
    "title_ne" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'IMAGE',
    "link_url" TEXT,
    "position" TEXT NOT NULL DEFAULT 'SIDEBAR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "polls" (
    "id" TEXT NOT NULL,
    "question_ne" TEXT NOT NULL,
    "question_en" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_multiple" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "polls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_options" (
    "id" TEXT NOT NULL,
    "text_ne" TEXT NOT NULL,
    "text_en" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "poll_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "poll_votes" (
    "id" TEXT NOT NULL,
    "poll_id" TEXT NOT NULL,
    "option_id" TEXT NOT NULL,
    "user_id" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "poll_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horoscopes" (
    "id" TEXT NOT NULL,
    "zodiac_sign" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'Sparkles',
    "title_ne" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "content_ne" TEXT NOT NULL,
    "content_en" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "horoscopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audio_news" (
    "id" TEXT NOT NULL,
    "title_ne" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "description_ne" TEXT,
    "description_en" TEXT,
    "audio_url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "category_id" TEXT,
    "author_id" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audio_news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ne" TEXT,
    "department" TEXT NOT NULL,
    "department_ne" TEXT,
    "designation" TEXT NOT NULL,
    "designation_ne" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "bio_ne" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "news_email" TEXT,
    "facebook" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_galleries" (
    "id" TEXT NOT NULL,
    "title_ne" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "excerpt_ne" TEXT,
    "excerpt_en" TEXT,
    "slug" TEXT NOT NULL,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "author_id" TEXT NOT NULL,
    "cover_image_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "photo_galleries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photo_gallery_photos" (
    "id" TEXT NOT NULL,
    "photo_gallery_id" TEXT NOT NULL,
    "media_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "caption_ne" TEXT,
    "caption_en" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "photo_gallery_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "videos_author_id_idx" ON "videos"("author_id");

-- CreateIndex
CREATE INDEX "videos_is_published_idx" ON "videos"("is_published");

-- CreateIndex
CREATE INDEX "videos_deleted_at_idx" ON "videos"("deleted_at");

-- CreateIndex
CREATE INDEX "advertisements_is_active_idx" ON "advertisements"("is_active");

-- CreateIndex
CREATE INDEX "advertisements_position_idx" ON "advertisements"("position");

-- CreateIndex
CREATE INDEX "advertisements_deleted_at_idx" ON "advertisements"("deleted_at");

-- CreateIndex
CREATE INDEX "advertisements_created_by_idx" ON "advertisements"("created_by");

-- CreateIndex
CREATE INDEX "polls_is_active_idx" ON "polls"("is_active");

-- CreateIndex
CREATE INDEX "polls_deleted_at_idx" ON "polls"("deleted_at");

-- CreateIndex
CREATE INDEX "poll_options_poll_id_idx" ON "poll_options"("poll_id");

-- CreateIndex
CREATE INDEX "poll_votes_poll_id_idx" ON "poll_votes"("poll_id");

-- CreateIndex
CREATE INDEX "poll_votes_option_id_idx" ON "poll_votes"("option_id");

-- CreateIndex
CREATE INDEX "poll_votes_user_id_idx" ON "poll_votes"("user_id");

-- CreateIndex
CREATE INDEX "poll_votes_ip_address_idx" ON "poll_votes"("ip_address");

-- CreateIndex
CREATE UNIQUE INDEX "poll_votes_poll_id_user_id_key" ON "poll_votes"("poll_id", "user_id");

-- CreateIndex
CREATE INDEX "horoscopes_zodiac_sign_idx" ON "horoscopes"("zodiac_sign");

-- CreateIndex
CREATE INDEX "horoscopes_date_idx" ON "horoscopes"("date");

-- CreateIndex
CREATE INDEX "horoscopes_is_published_idx" ON "horoscopes"("is_published");

-- CreateIndex
CREATE INDEX "horoscopes_author_id_idx" ON "horoscopes"("author_id");

-- CreateIndex
CREATE INDEX "audio_news_author_id_idx" ON "audio_news"("author_id");

-- CreateIndex
CREATE INDEX "audio_news_category_id_idx" ON "audio_news"("category_id");

-- CreateIndex
CREATE INDEX "audio_news_is_published_idx" ON "audio_news"("is_published");

-- CreateIndex
CREATE INDEX "audio_news_published_at_idx" ON "audio_news"("published_at");

-- CreateIndex
CREATE INDEX "page_views_article_id_idx" ON "page_views"("article_id");

-- CreateIndex
CREATE INDEX "page_views_created_at_idx" ON "page_views"("created_at");

-- CreateIndex
CREATE INDEX "page_views_slug_idx" ON "page_views"("slug");

-- CreateIndex
CREATE INDEX "team_members_order_idx" ON "team_members"("order");

-- CreateIndex
CREATE INDEX "team_members_is_active_idx" ON "team_members"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "photo_galleries_slug_key" ON "photo_galleries"("slug");

-- CreateIndex
CREATE INDEX "photo_galleries_slug_idx" ON "photo_galleries"("slug");

-- CreateIndex
CREATE INDEX "photo_galleries_is_published_idx" ON "photo_galleries"("is_published");

-- CreateIndex
CREATE INDEX "photo_galleries_author_id_idx" ON "photo_galleries"("author_id");

-- CreateIndex
CREATE INDEX "photo_gallery_photos_photo_gallery_id_idx" ON "photo_gallery_photos"("photo_gallery_id");

-- CreateIndex
CREATE UNIQUE INDEX "photo_gallery_photos_photo_gallery_id_media_id_key" ON "photo_gallery_photos"("photo_gallery_id", "media_id");

-- CreateIndex
CREATE INDEX "article_tags_article_id_idx" ON "article_tags"("article_id");

-- CreateIndex
CREATE INDEX "article_tags_tag_id_idx" ON "article_tags"("tag_id");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "articles"("published_at");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "articles"("author_id");

-- CreateIndex
CREATE INDEX "articles_category_id_idx" ON "articles"("category_id");

-- CreateIndex
CREATE INDEX "articles_is_flash_update_idx" ON "articles"("is_flash_update");

-- CreateIndex
CREATE INDEX "articles_is_featured_idx" ON "articles"("is_featured");

-- CreateIndex
CREATE INDEX "articles_deleted_at_idx" ON "articles"("deleted_at");

-- CreateIndex
CREATE INDEX "articles_status_deleted_at_published_at_idx" ON "articles"("status", "deleted_at", "published_at");

-- CreateIndex
CREATE INDEX "articles_status_deleted_at_author_id_idx" ON "articles"("status", "deleted_at", "author_id");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_target_type_target_id_idx" ON "audit_logs"("target_type", "target_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "bookmarks_article_id_idx" ON "bookmarks"("article_id");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_deleted_at_idx" ON "categories"("deleted_at");

-- CreateIndex
CREATE INDEX "comments_article_id_idx" ON "comments"("article_id");

-- CreateIndex
CREATE INDEX "comments_status_idx" ON "comments"("status");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "comments"("user_id");

-- CreateIndex
CREATE INDEX "comments_deleted_at_idx" ON "comments"("deleted_at");

-- CreateIndex
CREATE INDEX "media_uploaded_by_idx" ON "media"("uploaded_by");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "notifications"("is_read");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_options" ADD CONSTRAINT "poll_options_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "polls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "poll_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "poll_votes" ADD CONSTRAINT "poll_votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horoscopes" ADD CONSTRAINT "horoscopes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_news" ADD CONSTRAINT "audio_news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audio_news" ADD CONSTRAINT "audio_news_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_galleries" ADD CONSTRAINT "photo_galleries_cover_image_id_fkey" FOREIGN KEY ("cover_image_id") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_gallery_photos" ADD CONSTRAINT "photo_gallery_photos_photo_gallery_id_fkey" FOREIGN KEY ("photo_gallery_id") REFERENCES "photo_galleries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photo_gallery_photos" ADD CONSTRAINT "photo_gallery_photos_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

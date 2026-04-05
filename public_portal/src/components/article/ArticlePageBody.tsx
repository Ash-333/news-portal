"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, User } from "lucide-react";
import { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn, toNepaliDigits } from "@/lib/utils";
import { getArticleImage } from "@/lib/utils/image";
import { getTitle, getExcerpt, getCategoryName, getContent } from "@/lib/utils/lang";
import { ArticleContent } from "@/components/article/ArticleContent";
import { ShareBar } from "@/components/article/ShareBar";
import { ArticleTags } from "@/components/article/ArticleTags";
import { AuthorBox } from "@/components/article/AuthorBox";
import { ArticleNavigation } from "@/components/article/ArticleNavigation";
import { CommentSection } from "@/components/article/CommentSection";
import { ArticleViewTracker } from "@/components/article/ArticleViewTracker";
import { InArticleAd } from "@/components/ads/AdSlot";

interface ArticlePageBodyProps {
  article: Article;
  url: string;
  prevArticle: Article | null;
  nextArticle: Article | null;
}

export function ArticlePageBody({ article, url, prevArticle, nextArticle }: ArticlePageBodyProps) {
  const { isNepali } = useLanguage();
  const lang = isNepali ? "ne" : "en";

  const title = getTitle(article, lang);
  const description = getExcerpt(article, lang);
  const categoryName = getCategoryName(article.category, lang);
  const image = getArticleImage(article);

  const publishedDate = new Date(article.publishedAt).toLocaleDateString(
    isNepali ? "ne-NP" : "en-US"
  );

  const content = getContent(article, lang);

  return (
    <ArticleViewTracker slug={article.slug}>
    <div className="lg:col-span-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-news-red">
          Home
        </Link>
        <span>/</span>
        <Link href={`/${article.category.slug}`} className="hover:text-news-red">
          <span className={cn(isNepali ? "font-nepali" : "")}>{categoryName}</span>
        </Link>
        <span>/</span>
        <span className={cn("text-gray-400 truncate", isNepali ? "font-nepali" : "")}>
          {title}
        </span>
      </nav>

      {/* Category Label */}
      <Link href={`/${article.category.slug}`}>
        <span className={cn("category-label mb-4 inline-block", isNepali ? "font-nepali" : "")}>
          {categoryName}
        </span>
      </Link>

      {/* Title */}
      <h1
        className={cn(
          "text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 font-heading",
          isNepali ? "font-nepali" : ""
        )}
      >
        {title}
      </h1>

      {/* Excerpt */}
      <p
        className={cn(
          "text-lg text-gray-600 dark:text-gray-400 mb-6",
          isNepali ? "font-nepali" : ""
        )}
      >
        {description}
      </p>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-news-border dark:border-news-border-dark">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>{article.author.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{publishedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{/* read time can be derived if needed */}</span>
        </div>
      </div>

      {/* Share Bar */}
      <ShareBar url={url} title={title} />

      {/* Featured Image */}
      {image && (
        <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <ArticleContent content={content} lang={lang} />

      {/* Mid-article Ad */}
      <InArticleAd />

      {/* Tags */}
      <ArticleTags tags={article.tags} />

      {/* Author Box */}
      <AuthorBox author={article.author} />

      {/* Share Bar (Bottom) */}
      <ShareBar url={url} title={title} />

      {/* Article Navigation */}
      <ArticleNavigation prevArticle={prevArticle} nextArticle={nextArticle} />

      {/* Comments Section */}
      <CommentSection articleId={article.id} articleSlug={article.slug} />
    </div>
    </ArticleViewTracker>
  );
}

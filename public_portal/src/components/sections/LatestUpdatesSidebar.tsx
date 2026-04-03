"use client";

import Link from "next/link";
import { Article } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { getTitle } from "@/lib/utils/lang";

interface LatestUpdatesSidebarProps {
  articles: Article[];
}

export function LatestUpdatesSidebar({ articles }: LatestUpdatesSidebarProps) {
  const { isNepali, language, t } = useLanguage();

  if (!articles.length) return null;

  return (
    <div className="bg-gray-50 dark:bg-news-card-dark rounded-xl p-6">
      <h3
        className={cn(
          "font-bold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wide",
          isNepali ? "font-nepali" : ""
        )}
      >
        {t("category.latest")}
      </h3>
      <div className="space-y-3">
        {articles.slice(0, 10).map((article) => {
          const title = getTitle(article, language);
          return (
            <div key={article.id} className="group">
              <Link
                href={`/article/${article.slug}`}
                className={cn(
                  "text-sm text-gray-800 dark:text-gray-100 group-hover:text-news-red line-clamp-2",
                  isNepali ? "font-nepali" : ""
                )}
              >
                {title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

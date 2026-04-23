"use client";

import { Article, Poll, Category } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";
import { AdBox } from "@/components/ads/AdBox";
import { PollCard } from "@/components/polls/PollCard";
import { getCategoryName } from "@/lib/utils/lang";
import React from "react";

interface LatestNewsSectionProps {
  articles: Article[];
  poll?: Poll | null;
  category?: Category;
}

export function LatestNewsSection({ articles, poll, category }: LatestNewsSectionProps) {
  const { isNepali, t } = useLanguage();

  if (!articles.length) return null;

  const sectionTitle = category ? getCategoryName(category, isNepali ? 'ne' : 'en') : t("category.latest");

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-news-red rounded-full" />
        <h2
          className={cn(
            "text-xl font-bold text-gray-900 dark:text-white",
            isNepali ? "font-nepali" : ""
          )}
        >
          {sectionTitle}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <React.Fragment key={article.id}>
            <ArticleCard article={article} />
            {index === 3 && !poll && (
              <div className="col-span-1 md:col-span-2">
                <AdBox position="LATEST_NEWS" className="h-[90px] w-full max-w-[728px]" />
              </div>
            )}
          </React.Fragment>
        ))}
        {poll && (
          <div className="col-span-1 md:col-span-2">
            <PollCard poll={poll} />
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { Article, Poll } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { ArticleCard } from "@/components/ArticleCard";
import { AdPlaceholder } from "@/components/ui/AdPlaceholder";
import { PollCard } from "@/components/polls/PollCard";
import React from "react";

interface LatestNewsSectionProps {
  articles: Article[];
  poll?: Poll | null;
}

export function LatestNewsSection({ articles, poll }: LatestNewsSectionProps) {
  const { isNepali, t } = useLanguage();

  if (!articles.length) return null;

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
          {t("category.latest")}
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article, index) => (
          <React.Fragment key={article.id}>
            <ArticleCard article={article} />
            {index === 3 && !poll && (
              <div className="col-span-1 md:col-span-2">
                <AdPlaceholder format="leaderboard" />
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

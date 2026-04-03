"use client";

import { useEffect, useRef } from "react";
import { apiFetch } from "@/lib/api/client";

const VIEWED_ARTICLES_KEY = "viewed_articles";

function getViewedArticles(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const stored = localStorage.getItem(VIEWED_ARTICLES_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

function markArticleAsViewed(slug: string): void {
  if (typeof window === "undefined") return;

  const viewed = getViewedArticles();
  viewed.add(slug);
  localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(Array.from(viewed)));
}

export function useArticleView(slug: string | undefined) {
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    console.log(`[VIEW TRACK] useArticleView hook called with slug: ${slug}`);
    if (!slug || hasTrackedRef.current) return;

    const viewedArticles = getViewedArticles();

    // Skip if already viewed in this session
    if (viewedArticles.has(slug)) {
      return;
    }

    // Track the view
    const trackView = async () => {
      console.log(
        `[VIEW TRACK] Triggering view count request for article: ${slug}`,
      );
      console.log(
        `[VIEW TRACK] Full URL would be: http://localhost:3000/api/articles/${slug}/view`,
      );

      try {
        console.log(`[VIEW TRACK] Making POST request now...`);
        const response = await apiFetch(`/api/articles/${slug}/view`, {
          method: "POST",
        });
        console.log(`[VIEW TRACK] Response for ${slug}:`, response);
        markArticleAsViewed(slug);
        hasTrackedRef.current = true;
      } catch (error: any) {
        console.error(
          `[VIEW TRACK] Failed to track article view for ${slug}:`,
          error,
        );
        console.error(`[VIEW TRACK] Error message:`, error?.message);
        console.error(`[VIEW TRACK] Error stack:`, error?.stack);
      }
    };

    trackView();
  }, [slug]);
}

// Helper to check if article was viewed
export function hasArticleBeenViewed(slug: string): boolean {
  return getViewedArticles().has(slug);
}

// Clear viewed articles (for testing)
export function clearViewedArticles(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(VIEWED_ARTICLES_KEY);
}

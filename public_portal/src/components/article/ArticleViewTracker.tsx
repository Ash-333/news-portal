'use client';

import { useArticleView } from '@/hooks/useArticleView';
import { ReactNode, useEffect } from 'react';

interface ArticleViewTrackerProps {
  slug: string;
  children?: ReactNode;
}

export function ArticleViewTracker({ slug, children }: ArticleViewTrackerProps) {
  console.log(`[VIEW TRACKER] Rendering ArticleViewTracker for slug: ${slug}`);
  useArticleView(slug);
  console.log(`[VIEW TRACKER] After useArticleView call for slug: ${slug}`);
  return <>{children}</>;
}
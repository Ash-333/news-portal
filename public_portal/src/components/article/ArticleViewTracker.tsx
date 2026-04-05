'use client';

import { useArticleView } from '@/hooks/useArticleView';
import { ReactNode, useEffect } from 'react';

interface ArticleViewTrackerProps {
  slug: string;
  children?: ReactNode;
}

export function ArticleViewTracker({ slug, children }: ArticleViewTrackerProps) {
  useArticleView(slug);
  return <>{children}</>;
}
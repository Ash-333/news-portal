'use client'

import { useQuery } from '@tanstack/react-query'
import { getApi } from '@/lib/api/client'
import { AnalyticsOverview, TopArticle, AuthorStats } from '@/types'

interface ChartDataPoint {
  date: string
  articles: number
  views: number
  comments: number
}

export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: () => getApi<AnalyticsOverview>('/api/admin/analytics?type=overview'),
  })
}

export function useTopArticles() {
  return useQuery({
    queryKey: ['analytics', 'articles'],
    queryFn: () => getApi<TopArticle[]>('/api/admin/analytics?type=articles'),
  })
}

export function useAuthorStats() {
  return useQuery({
    queryKey: ['analytics', 'authors'],
    queryFn: () => getApi<AuthorStats[]>('/api/admin/analytics?type=authors'),
  })
}

export function useChartData(days: number = 7) {
  return useQuery({
    queryKey: ['analytics', 'chart', days],
    queryFn: () => getApi<ChartDataPoint[]>(`/api/admin/analytics?type=chart&days=${days}`),
  })
}
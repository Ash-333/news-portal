'use client'

import { useQuery } from '@tanstack/react-query'
import { AnalyticsOverview, TopArticle, AuthorStats, ApiResponse } from '@/types'

const fetchAnalyticsOverview = async (): Promise<AnalyticsOverview> => {
  const response = await fetch('/api/admin/analytics?type=overview')
  const result: ApiResponse<AnalyticsOverview> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const fetchTopArticles = async (): Promise<TopArticle[]> => {
  const response = await fetch('/api/admin/analytics?type=articles')
  const result: ApiResponse<TopArticle[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

const fetchAuthorStats = async (): Promise<AuthorStats[]> => {
  const response = await fetch('/api/admin/analytics?type=authors')
  const result: ApiResponse<AuthorStats[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

// Hooks
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: fetchAnalyticsOverview,
  })
}

export function useTopArticles() {
  return useQuery({
    queryKey: ['analytics', 'articles'],
    queryFn: fetchTopArticles,
  })
}

export function useAuthorStats() {
  return useQuery({
    queryKey: ['analytics', 'authors'],
    queryFn: fetchAuthorStats,
  })
}

interface ChartDataPoint {
  date: string
  articles: number
  views: number
  comments: number
}

const fetchChartData = async (days: number = 7): Promise<ChartDataPoint[]> => {
  const response = await fetch(`/api/admin/analytics?type=chart&days=${days}`)
  const result: ApiResponse<ChartDataPoint[]> = await response.json()
  
  if (!result.success) {
    throw new Error(result.message)
  }
  
  return result.data
}

export function useChartData(days: number = 7) {
  return useQuery({
    queryKey: ['analytics', 'chart', days],
    queryFn: () => fetchChartData(days),
  })
}

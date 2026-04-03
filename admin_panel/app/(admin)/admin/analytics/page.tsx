'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { useAnalyticsOverview, useTopArticles, useAuthorStats } from '@/hooks/use-analytics'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('7days')
  const { data: overview, isLoading: overviewLoading } = useAnalyticsOverview()
  const { data: topArticles, isLoading: articlesLoading } = useTopArticles()
  const { data: authorStats, isLoading: authorsLoading } = useAuthorStats()

  const trafficData = [
    { name: 'Direct', value: 400 },
    { name: 'Google', value: 300 },
    { name: 'Facebook', value: 200 },
    { name: 'WhatsApp', value: 100 },
    { name: 'Other', value: 50 },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="View site performance and statistics"
        actions={
          <div className="flex gap-2">
            <Button
              variant={period === '7days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('7days')}
            >
              7 Days
            </Button>
            <Button
              variant={period === '30days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('30days')}
            >
              30 Days
            </Button>
            <Button
              variant={period === '90days' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod('90days')}
            >
              90 Days
            </Button>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{(overview?.pageViewsToday || 0).toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Articles</CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{(overview?.totalArticles || 0).toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{(overview?.totalUsers || 0).toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Comments Today</CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="text-2xl font-bold">{(overview?.commentsToday || 0).toLocaleString()}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Articles by Views</CardTitle>
          </CardHeader>
          <CardContent>
            {articlesLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={topArticles?.slice(0, 5) || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="titleEn" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="viewCount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={256}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {trafficData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Author Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Author Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {authorsLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-2 font-medium">Author</th>
                    <th className="text-right py-2 font-medium">Articles</th>
                    <th className="text-right py-2 font-medium">Total Views</th>
                    <th className="text-right py-2 font-medium">Avg Views</th>
                  </tr>
                </thead>
                <tbody>
                  {authorStats?.map((author) => (
                    <tr
                      key={author.id}
                      className="border-b border-slate-100 dark:border-slate-900"
                    >
                      <td className="py-3">{author.name}</td>
                      <td className="py-3 text-right">{author.articleCount}</td>
                      <td className="py-3 text-right">{author.totalViews.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        {author.articleCount > 0
                          ? Math.round(author.totalViews / author.articleCount).toLocaleString()
                          : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Eye, 
  Plus, 
  UserPlus, 
  BarChart3,
  CheckCircle,
  XCircle,
  Video,
  Megaphone,
  Zap,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { useAnalyticsOverview, useTopArticles, useChartData } from '@/hooks/use-analytics'
import { useArticles } from '@/hooks/use-articles'
import { usePermissions } from '@/hooks/use-permissions'
import { permissions } from '@/lib/permissions'
import { ArticleStatus } from '@prisma/client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description 
}: { 
  title: string
  value: number
  icon: React.ElementType
  description?: string 
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const { role, hasPermission } = usePermissions()
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsOverview()
  const { data: topArticles } = useTopArticles()
  const { data: pendingArticles } = useArticles({ status: ArticleStatus.REVIEW, limit: 5 })
  const [timeRange, setTimeRange] = useState(7)
  const { data: chartData } = useChartData(timeRange)

  const isAuthor = role === 'AUTHOR'
  const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your news portal."
        actions={
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/articles/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
            {hasPermission(permissions.usersCreate) && (
            <Button variant="outline" onClick={() => router.push('/admin/users/create')}>
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
            )}
          </div>
        }
      />

      {/* Stats Grid - Different for Authors vs Admins */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Articles"
          value={analytics?.totalArticles || 0}
          icon={FileText}
        />
        <StatCard
          title="Published Today"
          value={analytics?.publishedToday || 0}
          icon={FileText}
          description="Articles published today"
        />
        <StatCard
          title="Pending Review"
          value={analytics?.pendingReview || 0}
          icon={Eye}
        />
        {!isAuthor && (
          <>
            <StatCard
              title="Total Users"
              value={analytics?.totalUsers || 0}
              icon={Users}
            />
            <StatCard
              title="Comments Today"
              value={analytics?.commentsToday || 0}
              icon={MessageSquare}
            />
            <StatCard
              title="Page Views Today"
              value={analytics?.pageViewsToday || 0}
              icon={BarChart3}
            />
            <StatCard
              title="Videos"
              value={analytics?.totalVideos || 0}
              icon={Video}
            />
            <StatCard
              title="Active Ads"
              value={analytics?.totalAds || 0}
              icon={Megaphone}
            />
            <StatCard
              title="Flash Updates"
              value={analytics?.totalFlashUpdates || 0}
              icon={Zap}
            />
          </>
        )}
      </div>

      {/* Charts - Only show for Admins */}
      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Content Activity</CardTitle>
            <div className="flex gap-2">
              <Button variant={timeRange === 7 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(7)}>7 Days</Button>
              <Button variant={timeRange === 14 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(14)}>14 Days</Button>
              <Button variant={timeRange === 30 ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(30)}>30 Days</Button>
            </div>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="articles" stroke="#3b82f6" fillOpacity={1} fill="url(#colorArticles)" name="Articles" strokeWidth={2} />
                    <Area type="monotone" dataKey="comments" stroke="#10b981" fillOpacity={1} fill="url(#colorComments)" name="Comments" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    />
                    <Bar dataKey="views" fill="#8b5cf6" name="Views" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      )}

      {/* Recent Content */}
      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-1">
        {/* Pending Review */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingArticles?.data.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">
                No articles pending review
              </p>
            ) : (
              <div className="space-y-3">
                {pendingArticles?.data.map((article) => (
                  <div
                    key={article.id}
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-sm">{article.titleEn}</p>
                      <p className="text-xs text-slate-500">by {article.author?.name}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => router.push(`/api/admin/articles/${article.id}/approve`)}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => router.push(`/api/admin/articles/${article.id}/reject`)}
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      )}

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Articles by Views</CardTitle>
        </CardHeader>
        <CardContent>
          {topArticles?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              No articles yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-2 font-medium">Title</th>
                    <th className="text-left py-2 font-medium">Author</th>
                    <th className="text-left py-2 font-medium">Category</th>
                    <th className="text-right py-2 font-medium">Views</th>
                  </tr>
                </thead>
                <tbody>
                  {topArticles?.slice(0, 5).map((article) => (
                    <tr 
                      key={article.id}
                      className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/50"
                    >
                      <td className="py-3">{article.titleEn}</td>
                      <td className="py-3">{article.authorName}</td>
                      <td className="py-3">{article.categoryName}</td>
                      <td className="py-3 text-right">{article.views.toLocaleString()}</td>
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

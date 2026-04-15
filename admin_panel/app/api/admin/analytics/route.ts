import { NextRequest, NextResponse } from 'next/server'
import { Role, ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { authMiddleware, roleMiddleware, errorHandler, AuthenticatedRequest } from '@/lib/middleware'

// GET /api/admin/analytics/overview - Get analytics overview (Admin+)
export async function GET(req: NextRequest) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) return authResult
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN, Role.AUTHOR])(authenticatedReq)
    if (roleResult instanceof NextResponse) return roleResult

    // For authors, only return their own data
    const isAuthor = authenticatedReq.user?.role === Role.AUTHOR
    const authorId = isAuthor ? authenticatedReq.user?.id : undefined

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'overview'

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    switch (type) {
      case 'overview': {
        // Build where clause for author's own articles
        const articleWhere = isAuthor ? { authorId, deletedAt: null } : { deletedAt: null }
        
        const [
          totalArticles,
          publishedToday,
          pendingReview,
        ] = isAuthor ? await Promise.all([
          prisma.article.count({ where: articleWhere }),
          prisma.article.count({
            where: {
              ...articleWhere,
              status: ArticleStatus.PUBLISHED,
              publishedAt: { gte: today },
            },
          }),
          prisma.article.count({
            where: { ...articleWhere, status: ArticleStatus.REVIEW },
          }),
        ]) : await Promise.all([
          prisma.article.count({ where: { deletedAt: null } }),
          prisma.article.count({
            where: {
              status: ArticleStatus.PUBLISHED,
              publishedAt: { gte: today },
            },
          }),
          prisma.article.count({
            where: { status: ArticleStatus.REVIEW, deletedAt: null },
          }),
        ])

        // Only return full stats for admins, limited for authors
        const responseData: Record<string, number> = {
          totalArticles,
          publishedToday,
          pendingReview,
        }

        if (!isAuthor) {
          const [totalUsers, commentsToday, totalVideos, totalAds, totalFlashUpdates, pageViewsToday] = await Promise.all([
            prisma.user.count({ where: { deletedAt: null } }),
            prisma.comment.count({
              where: {
                createdAt: { gte: today },
                deletedAt: null,
              },
            }),
            prisma.video.count({ where: { deletedAt: null } }),
            prisma.advertisement.count({ where: { deletedAt: null } }),
            prisma.flashUpdate.count({ where: { deletedAt: null } }),
            prisma.pageView.count({
              where: {
                createdAt: { gte: today },
              },
            }),
          ])
          responseData.totalUsers = totalUsers
          responseData.commentsToday = commentsToday
          responseData.totalVideos = totalVideos
          responseData.totalAds = totalAds
          responseData.totalFlashUpdates = totalFlashUpdates
          responseData.pageViewsToday = pageViewsToday
        }

        return NextResponse.json({
          success: true,
          data: responseData,
          message: 'Analytics overview retrieved successfully',
        })
      }

      case 'articles': {
        // Build where clause for author's own articles
        const articleWhere = isAuthor 
          ? { authorId, status: ArticleStatus.PUBLISHED, deletedAt: null }
          : { status: ArticleStatus.PUBLISHED, deletedAt: null }

        const topArticles = await prisma.article.findMany({
          where: articleWhere,
          orderBy: { viewCount: 'desc' },
          take: 10,
          select: {
            id: true,
            titleNe: true,
            titleEn: true,
            slug: true,
            viewCount: true,
            publishedAt: true,
            author: {
              select: { name: true },
            },
            category: {
              select: { nameNe: true, nameEn: true },
            },
          },
        })

        const formattedTopArticles = topArticles.map(a => ({
          id: a.id,
          titleNe: a.titleNe,
          titleEn: a.titleEn,
          slug: a.slug,
          views: a.viewCount,
          authorName: a.author.name,
          categoryName: a.category.nameEn,
          publishedAt: a.publishedAt,
        }))

        return NextResponse.json({
          success: true,
          data: formattedTopArticles,
          message: 'Top articles retrieved successfully',
        })
}

      case 'chart': {
        const days = parseInt(searchParams.get('days') || '7')
        
        // Build where clause for author's own articles
        const articleWhere = isAuthor ? { authorId, deletedAt: null } : { deletedAt: null }
        const commentWhere = isAuthor ? { article: { authorId }, deletedAt: null } : { deletedAt: null }
        
        const now = new Date()
        const startDate = new Date(now)
        startDate.setDate(startDate.getDate() - days)
        startDate.setHours(0, 0, 0, 0)
        
        // Fetch all data in parallel using groupBy (3 queries instead of 3*days)
        const [articlesByDay, commentsByDay, pageViewsByDay] = await Promise.all([
          prisma.article.groupBy({
            by: ['createdAt'],
            where: {
              ...articleWhere,
              createdAt: { gte: startDate },
            },
            _count: true,
          }),
          prisma.comment.groupBy({
            by: ['createdAt'],
            where: {
              ...commentWhere,
              createdAt: { gte: startDate },
            },
            _count: true,
          }),
          prisma.pageView.groupBy({
            by: ['createdAt'],
            where: {
              createdAt: { gte: startDate },
            },
            _count: true,
          }),
        ])
        
        // Helper to get date key from datetime
        const getDateKey = (date: Date | null) => {
          if (!date) return startDate.toISOString().split('T')[0]
          return date.toISOString().split('T')[0]
        }
        
        // Aggregate counts by day using Maps for O(1) lookups
        const articlesMap = new Map<string, number>()
        const commentsMap = new Map<string, number>()
        const viewsMap = new Map<string, number>()
        
        articlesByDay.forEach(item => {
          const key = getDateKey(item.createdAt)
          articlesMap.set(key, (articlesMap.get(key) || 0) + item._count)
        })
        
        commentsByDay.forEach(item => {
          const key = getDateKey(item.createdAt)
          commentsMap.set(key, (commentsMap.get(key) || 0) + item._count)
        })
        
        pageViewsByDay.forEach(item => {
          const key = getDateKey(item.createdAt)
          viewsMap.set(key, (viewsMap.get(key) || 0) + item._count)
        })
        
        // Build chart data for each day in range
        const chartData = []
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          const dateKey = date.toISOString().split('T')[0]
          
          chartData.push({
            date: dateKey,
            articles: articlesMap.get(dateKey) || 0,
            views: viewsMap.get(dateKey) || 0,
            comments: commentsMap.get(dateKey) || 0,
          })
        }
        
        return NextResponse.json({
          success: true,
          data: chartData,
          message: 'Chart data retrieved successfully',
        })
      }

      default:
        return NextResponse.json(
          { success: false, data: null, message: 'Invalid analytics type' },
          { status: 400 }
        )
    }
  } catch (error) {
    return errorHandler(error)
  }
}

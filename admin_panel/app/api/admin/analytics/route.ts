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
          const [totalUsers, commentsToday, totalVideos, totalAds, totalFlashUpdates] = await Promise.all([
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
          ])
          responseData.totalUsers = totalUsers
          responseData.commentsToday = commentsToday
          responseData.totalVideos = totalVideos
          responseData.totalAds = totalAds
          responseData.totalFlashUpdates = totalFlashUpdates
          responseData.pageViewsToday = 0
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

      case 'authors': {
        const authors = await prisma.user.findMany({
          where: {
            role: { in: [Role.AUTHOR, Role.ADMIN, Role.SUPERADMIN] },
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            _count: {
              select: { articles: true },
            },
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
              select: { viewCount: true },
            },
          },
        })

        const authorStats = authors.map(author => ({
          id: author.id,
          name: author.name,
          articleCount: author._count.articles,
          totalViews: author.articles.reduce((sum, a) => sum + a.viewCount, 0),
        }))

        return NextResponse.json({
          success: true,
          data: authorStats,
          message: 'Author stats retrieved successfully',
        })
      }

      case 'chart': {
        const days = parseInt(searchParams.get('days') || '7')
        const chartData = []
        
        // Build where clause for author's own articles
        const articleWhere = isAuthor ? { authorId, deletedAt: null } : { deletedAt: null }
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          date.setHours(0, 0, 0, 0)
          const nextDate = new Date(date)
          nextDate.setDate(nextDate.getDate() + 1)
          
          const [articles, comments] = await Promise.all([
            prisma.article.count({
              where: {
                ...articleWhere,
                createdAt: { gte: date, lt: nextDate },
              },
            }),
            prisma.comment.count({
              where: isAuthor ? {
                article: { authorId },
                createdAt: { gte: date, lt: nextDate },
                deletedAt: null,
              } : {
                createdAt: { gte: date, lt: nextDate },
                deletedAt: null,
              },
            }),
          ])
          
          chartData.push({
            date: date.toISOString().split('T')[0],
            articles,
            views: Math.floor(Math.random() * 500) + 100, // Placeholder - would come from analytics
            comments,
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

import { NextRequest, NextResponse } from 'next/server'
import { ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

/**
 * Cron Job API Route - Publish Scheduled Articles
 * 
 * This endpoint should be called periodically (e.g., every 5-10 minutes)
 * to automatically publish articles that have reached their scheduled time.
 * 
 * Can be triggered by:
 * - Vercel Cron (vercel.json)
 * - External cron service (cron-job.org, etc.)
 * - Manual HTTP request
 * 
 * Route: GET /api/cron/publish-scheduled
 * 
 * Security: In production, add a secret token parameter or header to prevent unauthorized access
 */
export async function GET(req: NextRequest) {
  try {
    // Optional: Verify cron secret token for security
    const cronSecret = req.nextUrl.searchParams.get('secret')
    const expectedSecret = process.env.CRON_SECRET
    
    if (expectedSecret && cronSecret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find articles that are scheduled to be published
    // - scheduledAt is not null
    // - scheduledAt <= now()
    // - status is not already PUBLISHED
    const now = new Date()
    
    const scheduledArticles = await prisma.article.findMany({
      where: {
        scheduledAt: {
          lte: now,
        },
        status: {
          not: ArticleStatus.PUBLISHED,
        },
        deletedAt: null,
      },
      select: {
        id: true,
        titleEn: true,
        titleNe: true,
        scheduledAt: true,
        status: true,
      },
    })

    if (scheduledArticles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No articles to publish',
        published: 0,
      })
    }

    // Update all scheduled articles to PUBLISHED status
    const publishResult = await prisma.article.updateMany({
      where: {
        scheduledAt: {
          lte: now,
        },
        status: {
          not: ArticleStatus.PUBLISHED,
        },
        deletedAt: null,
      },
      data: {
        status: ArticleStatus.PUBLISHED,
        publishedAt: now,
        scheduledAt: null, // Clear the scheduled time after publishing
      },
    })

    // Create audit logs for each published article
    const auditLogPromises = scheduledArticles.map((article) =>
      prisma.auditLog.create({
        data: {
          userId: 'SYSTEM', // System action
          action: 'ARTICLE_PUBLISH_SCHEDULED',
          targetType: 'ARTICLE',
          targetId: article.id,
          ipAddress: req.headers.get('x-forwarded-for') || null,
          userAgent: req.headers.get('user-agent') || null,
        },
      })
    )

    await Promise.all(auditLogPromises)

    return NextResponse.json({
      success: true,
      message: `Published ${publishResult.count} scheduled article(s)`,
      published: publishResult.count,
      articles: scheduledArticles.map((a) => ({
        id: a.id,
        titleEn: a.titleEn,
        titleNe: a.titleNe,
      })),
    })
  } catch (error) {
    console.error('Error publishing scheduled articles:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
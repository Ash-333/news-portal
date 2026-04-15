import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'

// POST /api/articles/:slug/view - Increment view count
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Get article ID first
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, data: null, message: 'Article not found' },
        { status: 404 }
      )
    }

    // Get client info for tracking
    const ipAddress = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || null
    const userAgent = req.headers.get('user-agent') || null
    const referer = req.headers.get('referer') || null

    // Create page view record and increment view count in parallel
    const [updatedArticle] = await Promise.all([
      prisma.article.update({
        where: { slug },
        data: { viewCount: { increment: 1 } },
        select: {
          id: true,
          viewCount: true,
        },
      }),
      prisma.pageView.create({
        data: {
          articleId: article.id,
          slug,
          ipAddress,
          userAgent,
          referrer: referer,
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: { viewCount: updatedArticle.viewCount },
      message: 'View count incremented',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

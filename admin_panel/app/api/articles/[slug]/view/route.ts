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

    // Increment view count
    const article = await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
      select: {
        id: true,
        viewCount: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: { viewCount: article.viewCount },
      message: 'View count incremented',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

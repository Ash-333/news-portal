import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedApi } from '@/lib/redis'

const CACHE_TTL = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const isLivestream = searchParams.get('isLivestream')
    const isFeaturedLivestream = searchParams.get('isFeaturedLivestream')

    // Featured livestream endpoint: return single matching livestream
    if (isFeaturedLivestream === 'true') {
      const video = await prisma.video.findFirst({
        where: {
          isPublished: true,
          deletedAt: null,
          isFeaturedLivestream: true,
          isLivestream: true,
        },
        include: {
          author: { select: { id: true, name: true, image: true } }
        },
        orderBy: { publishedAt: 'desc' },
      })

      return NextResponse.json({
        success: true,
        data: video || null,
        message: video ? 'Featured livestream found' : 'No featured livestream',
      })
    }

    const cacheKey = isLivestream ? 'videos:livestream' : 'videos:list'

    const result = await cachedApi(
      cacheKey,
      { limit, page, search, isLivestream },
      async () => {
        const where: Record<string, unknown> = {
          isPublished: true,
          deletedAt: null,
        }

        if (isLivestream === 'true') {
          where.isLivestream = true
        }

        if (search) {
          where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
          ]
        }

        const [videos, total] = await Promise.all([
          prisma.video.findMany({
            where: where as any,
            orderBy: { publishedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
              author: { select: { id: true, name: true, image: true } }
            }
          }),
          prisma.video.count({ where: where as any })
        ])

        return { videos, total }
      },
      CACHE_TTL
    )

    return NextResponse.json({
      success: true,
      data: result.videos,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    console.error('Public Videos API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

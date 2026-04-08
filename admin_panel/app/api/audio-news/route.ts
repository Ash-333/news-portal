import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedApi } from '@/lib/redis'

const CACHE_TTL = 300 // 5 minutes

// GET /api/audio-news
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const categoryId = searchParams.get('categoryId') || ''
    const search = searchParams.get('search') || ''

    const result = await cachedApi(
      'audio-news:list',
      { limit, page, categoryId, search },
      async () => {
        const where: Record<string, unknown> = { isPublished: true }

        if (categoryId) {
          where.categoryId = categoryId
        }

        if (search) {
          where.OR = [
            { titleNe: { contains: search, mode: 'insensitive' } },
            { titleEn: { contains: search, mode: 'insensitive' } },
            { descriptionNe: { contains: search, mode: 'insensitive' } },
            { descriptionEn: { contains: search, mode: 'insensitive' } },
          ]
        }

        const [audioNewsList, total] = await Promise.all([
          prisma.audioNews.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
              author: { select: { name: true } },
              category: { select: { nameEn: true, nameNe: true } }
            }
          }),
          prisma.audioNews.count({ where })
        ])

        return { audioNewsList, total }
      },
      CACHE_TTL
    )

    return NextResponse.json({
      success: true,
      data: result.audioNewsList,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    console.error('Public Audio News API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedApi } from '@/lib/redis'

const CACHE_TTL = 120 // 2 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    const result = await cachedApi(
      'flash-updates:list',
      { limit, page, search },
      async () => {
        const where = {
          isPublished: true,
          deletedAt: null,
          OR: search ? [
            { titleNe: { contains: search, mode: 'insensitive' } },
            { titleEn: { contains: search, mode: 'insensitive' } },
          ] : undefined
        }

        const [updates, total] = await Promise.all([
          prisma.flashUpdate.findMany({
            where: where as any,
            orderBy: { publishedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
            include: {
              author: { select: { name: true, profilePhoto: true } },
              featuredImage: true
            }
          }),
          prisma.flashUpdate.count({ where: where as any })
        ])

        return { updates, total }
      },
      CACHE_TTL
    )

    return NextResponse.json({
      success: true,
      data: result.updates,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit)
      }
    })
  } catch (error) {
    console.error('Public Flash Updates API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

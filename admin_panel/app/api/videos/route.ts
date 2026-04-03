import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''

    const where = {
      isPublished: true,
      deletedAt: null,
      OR: search ? [
        { titleNe: { contains: search, mode: 'insensitive' } },
        { titleEn: { contains: search, mode: 'insensitive' } },
      ] : undefined
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where: where as any,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          author: {
            select: { name: true, profilePhoto: true }
          }
        }
      }),
      prisma.video.count({ where: where as any })
    ])

    return NextResponse.json({
      success: true,
      data: videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Public Videos API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

import { ArticleStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'
import { cachedApi } from '@/lib/redis'

const CACHE_TTL = 3600 // 1 hour

// GET /api/categories - List public categories
export async function GET() {
  try {
    const result = await cachedApi(
      'categories:list',
      {},
      async () => {
        const categories = await prisma.category.findMany({
          where: { deletedAt: null, parentId: null },
          include: {
            children: {
              where: { deletedAt: null },
              orderBy: { nameEn: 'asc' },
            },
            _count: {
              select: {
                articles: {
                  where: {
                    deletedAt: null,
                    status: ArticleStatus.PUBLISHED,
                    publishedAt: { lte: new Date() },
                  },
                },
              },
            },
          },
          orderBy: { nameEn: 'asc' },
        })
        return categories
      },
      CACHE_TTL
    )

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Categories retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

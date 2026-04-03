import { ArticleStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'

// GET /api/categories - List public categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: {
        deletedAt: null,
        parentId: null,
      },
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

    return NextResponse.json(
      {
        success: true,
        data: categories,
        message: 'Categories retrieved successfully',
      }
    )
  } catch (error) {
    return errorHandler(error)
  }
}

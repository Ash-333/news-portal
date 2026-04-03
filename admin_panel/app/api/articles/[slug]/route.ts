import { NextRequest, NextResponse } from 'next/server'
import { ArticleStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'

// GET /api/articles/:slug - Get single published article (public)
// This route handles both slug (string) and id (UUID) lookups
// Next.js will match both /api/articles/my-article-slug and /api/articles/uuid-here/comments
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Determine if slug is actually a UUID (article ID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    const where: Record<string, unknown> = {
      status: ArticleStatus.PUBLISHED,
      deletedAt: null,
    }

    // Query by slug or id depending on the parameter format
    if (isUuid) {
      where.id = slug
    } else {
      where.slug = slug
    }

    const article = await prisma.article.findFirst({
      where: { 
        slug,
        status: ArticleStatus.PUBLISHED,
        deletedAt: null,
      },
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        contentNe: true,
        contentEn: true,
        excerptNe: true,
        excerptEn: true,
        slug: true,
        isBreaking: true,
        isFeatured: true,
        publishedAt: true,
        viewCount: true,
        metaTitle: true,
        metaDescription: true,
        ogImage: true,
        featuredImage: {
          select: {
            id: true,
            url: true,
          },
        },
        author: {
          select: {
            id: true,
            name: true,
            profilePhoto: true,
            bio: true,
          },
        },
        category: {
          select: {
            id: true,
            nameNe: true,
            nameEn: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                nameNe: true,
                nameEn: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    })

    if (!article) {
      return NextResponse.json(
        { success: false, data: null, message: 'Article not found' },
        { status: 404 }
      )
    }

    const origin = req.nextUrl.origin

    // Flatten tags and convert image URLs inside content and featured image URL to absolute URLs
    const absoluteContentNe = article.contentNe
      ? article.contentNe.replace(/src="\//g, `src="${origin}/`)
      : article.contentNe

    const absoluteContentEn = article.contentEn
      ? article.contentEn.replace(/src="\//g, `src="${origin}/`)
      : article.contentEn

    const formattedArticle = {
      ...article,
      contentNe: absoluteContentNe,
      contentEn: absoluteContentEn,
      tags: article.tags.map(t => t.tag),
      featuredImage: article.featuredImage
        ? {
            ...article.featuredImage,
            url: `${origin}${article.featuredImage.url}`,
          }
        : null,
    }

    return NextResponse.json({
      success: true,
      data: formattedArticle,
      message: 'Article retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/flash-updates/:slug - Get single published flash update by slug (public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Determine if slug is actually a UUID (flash update ID)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)

    // Query by slug or id depending on the parameter format
    const where: Record<string, unknown> = {
      isPublished: true,
      deletedAt: null,
    }

    if (isUuid) {
      where.id = slug
    } else {
      where.slug = slug
    }

    const flashUpdate = await prisma.flashUpdate.findFirst({
      where,
      select: {
        id: true,
        titleNe: true,
        titleEn: true,
        contentNe: true,
        contentEn: true,
        excerptNe: true,
        excerptEn: true,
        slug: true,
        publishedAt: true,
        expiresAt: true,
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
          },
        },
      },
    })

    if (!flashUpdate) {
      return NextResponse.json(
        { success: false, data: null, message: 'Flash update not found' },
        { status: 404 }
      )
    }

    const origin = process.env.APP_URL || req.nextUrl.origin

    // Convert image URLs to absolute URLs
    const absoluteContentNe = flashUpdate.contentNe
      ? flashUpdate.contentNe.replace(/src="\//g, `src="${origin}/`)
      : flashUpdate.contentNe

    const absoluteContentEn = flashUpdate.contentEn
      ? flashUpdate.contentEn.replace(/src="\//g, `src="${origin}/`)
      : flashUpdate.contentEn

    const formattedFlashUpdate = {
      ...flashUpdate,
      contentNe: absoluteContentNe,
      contentEn: absoluteContentEn,
      featuredImage: flashUpdate.featuredImage
        ? {
            ...flashUpdate.featuredImage,
            url: `${origin}${flashUpdate.featuredImage.url}`,
          }
        : null,
    }

    return NextResponse.json({
      success: true,
      data: formattedFlashUpdate,
      message: 'Flash update retrieved successfully',
    })
  } catch (error) {
    console.error('Flash Update API Error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'

const SOCIAL_MEDIA_KEYS = [
  'facebookUrl',
  'twitterUrl',
  'youtubeUrl',
  'instagramUrl',
]

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: SOCIAL_MEDIA_KEYS,
        },
      },
    })

    const socialLinks = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: socialLinks,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
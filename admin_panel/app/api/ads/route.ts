import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cachedApi } from '@/lib/redis'

const CACHE_TTL = 300 // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    const result = await cachedApi(
      'ads:list',
      { position: position || '' },
      async () => {
        const where = {
          isActive: true,
          deletedAt: null,
          position: position || undefined
        }

        const ads = await prisma.advertisement.findMany({
          where: where as any,
          orderBy: { createdAt: 'desc' }
        })

        return ads
      },
      CACHE_TTL
    )

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('Public Ads API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

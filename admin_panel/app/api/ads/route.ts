import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')

    const where = {
      isActive: true,
      deletedAt: null,
      position: position || undefined
    }

    const ads = await prisma.advertisement.findMany({
      where: where as any,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: ads
    })
  } catch (error) {
    console.error('Public Ads API Error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}

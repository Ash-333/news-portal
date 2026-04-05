import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorHandler } from '@/lib/middleware'

const CONTACT_KEYS = [
  'contactEmail',
  'contactPhone',
  'contactAddress',
  'contactAddressNe',
]

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: CONTACT_KEYS,
        },
      },
    })

    const contactInfo = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json({
      success: true,
      data: contactInfo,
    })
  } catch (error) {
    return errorHandler(error)
  }
}
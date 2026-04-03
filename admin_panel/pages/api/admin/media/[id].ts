import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'
import { Role, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { mediaUpdateSchema } from '@/lib/validations'
import { deleteFile } from '@/lib/storage'

type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
}

type AuthedRequest = NextApiRequest & {
  user: {
    id: string
    email: string
    name: string
    role: Role
  }
}

function sendJson<T>(
  res: NextApiResponse<ApiResponse<T>>,
  status: number,
  payload: ApiResponse<T>
): void {
  res.status(status).json(payload)
}

async function authenticate(req: NextApiRequest): Promise<AuthedRequest | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return null
  }

  const authedReq = req as AuthedRequest
  authedReq.user = {
    id: token.id as string,
    email: token.email as string,
    name: token.name as string,
    role: token.role as Role,
  }

  return authedReq
}

function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return userRole === Role.SUPERADMIN || allowedRoles.includes(userRole)
}

function getRequestIp(req: NextApiRequest): string | null {
  const forwarded = req.headers['x-forwarded-for']

  if (Array.isArray(forwarded)) {
    return forwarded[0] ?? null
  }

  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() ?? null
  }

  return req.socket.remoteAddress ?? null
}

async function handlePatch(
  req: AuthedRequest,
  res: NextApiResponse<ApiResponse<unknown>>
): Promise<void> {
  if (!hasRole(req.user.role, [Role.ADMIN, Role.SUPERADMIN])) {
    sendJson(res, 403, {
      success: false,
      data: null,
      message: 'Forbidden: Insufficient permissions',
    })
    return
  }

  const id = typeof req.query.id === 'string' ? req.query.id : null
  if (!id) {
    sendJson(res, 400, {
      success: false,
      data: null,
      message: 'Invalid media id',
    })
    return
  }

  const validation = mediaUpdateSchema.safeParse(req.body)
  if (!validation.success) {
    sendJson(res, 400, {
      success: false,
      data: { errors: validation.error.flatten() },
      message: 'Invalid request body',
    })
    return
  }

  const media = await prisma.media.update({
    where: { id },
    data: validation.data,
  })

  sendJson(res, 200, {
    success: true,
    data: media,
    message: 'Media updated successfully',
  })
}

async function handleDelete(
  req: AuthedRequest,
  res: NextApiResponse<ApiResponse<unknown>>
): Promise<void> {
  if (!hasRole(req.user.role, [Role.ADMIN, Role.SUPERADMIN])) {
    sendJson(res, 403, {
      success: false,
      data: null,
      message: 'Forbidden: Insufficient permissions',
    })
    return
  }

  const id = typeof req.query.id === 'string' ? req.query.id : null
  if (!id) {
    sendJson(res, 400, {
      success: false,
      data: null,
      message: 'Invalid media id',
    })
    return
  }

  const media = await prisma.media.findUnique({
    where: { id },
  })

  if (!media) {
    sendJson(res, 404, {
      success: false,
      data: null,
      message: 'Media not found',
    })
    return
  }

  try {
    const relativePath = media.url.startsWith('/') ? media.url.slice(1) : media.url
    await deleteFile(relativePath)
  } catch (error) {
    console.error('Failed to delete file from storage:', error)
  }

  await prisma.media.delete({
    where: { id },
  })

  await prisma.auditLog.create({
    data: {
      userId: req.user.id,
      action: 'MEDIA_DELETE',
      targetType: 'MEDIA',
      targetId: id,
      ipAddress: getRequestIp(req),
      userAgent: req.headers['user-agent'] || null,
    },
  })

  sendJson(res, 200, {
    success: true,
    data: null,
    message: 'Media deleted successfully',
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<unknown>>
): Promise<void> {
  try {
    const authedReq = await authenticate(req)

    if (!authedReq) {
      sendJson(res, 401, {
        success: false,
        data: null,
        message: 'Unauthorized',
      })
      return
    }

    if (req.method === 'PATCH') {
      await handlePatch(authedReq, res)
      return
    }

    if (req.method === 'DELETE') {
      await handleDelete(authedReq, res)
      return
    }

    res.setHeader('Allow', 'PATCH, DELETE')
    sendJson(res, 405, {
      success: false,
      data: null,
      message: 'Method not allowed',
    })
  } catch (error) {
    console.error('API Error:', error)

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      sendJson(res, 404, {
        success: false,
        data: null,
        message: 'Record not found',
      })
      return
    }

    if (error instanceof Error) {
      sendJson(res, 500, {
        success: false,
        data: null,
        message: error.message,
      })
      return
    }

    sendJson(res, 500, {
      success: false,
      data: null,
      message: 'An unexpected error occurred',
    })
  }
}

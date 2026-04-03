import { NextRequest, NextResponse } from 'next/server'
import { Role, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { 
  authMiddleware, 
  roleMiddleware, 
  validationMiddleware,
  errorHandler,
  AuthenticatedRequest 
} from '@/lib/middleware'
import { z } from 'zod'

const updatePollSchema = z.object({
  questionNe: z.string().min(1).optional(),
  questionEn: z.string().min(1).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isMultiple: z.boolean().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  options: z.array(z.object({
    id: z.string().optional(),
    textNe: z.string().min(1),
    textEn: z.string().min(1),
  })).optional(),
})

// GET /api/admin/polls/:id - Get single poll (Admin+)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) {
      return roleResult
    }

    const { id } = await params

    const poll = await prisma.poll.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        questionNe: true,
        questionEn: true,
        description: true,
        isActive: true,
        isMultiple: true,
        startsAt: true,
        expiresAt: true,
        createdAt: true,
        updatedAt: true,
        options: {
          select: {
            id: true,
            textNe: true,
            textEn: true,
            order: true,
            _count: {
              select: { votes: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            votes: true,
          },
        },
      },
    })

    if (!poll) {
      return NextResponse.json(
        { success: false, message: 'Poll not found' },
        { status: 404 }
      )
    }

    // Calculate total votes and percentages
    const totalVotes = poll._count.votes
    const formattedOptions = poll.options.map(opt => ({
      id: opt.id,
      textNe: opt.textNe,
      textEn: opt.textEn,
      order: opt.order,
      voteCount: opt._count.votes,
      percentage: totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0,
    }))

    return NextResponse.json({
      success: true,
      data: {
        ...poll,
        options: formattedOptions,
        totalVotes,
      },
      message: 'Poll retrieved successfully',
    })
  } catch (error) {
    return errorHandler(error)
  }
}

// PATCH /api/admin/polls/:id - Update poll (Admin+)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) {
      return roleResult
    }

    const { id } = await params

    const validation = await validationMiddleware(updatePollSchema)(req)
    if (validation instanceof NextResponse) {
      return validation
    }

    const { startsAt, expiresAt, options, ...updateData } = validation

    // Handle options update if provided
    let optionsUpdate = undefined
    if (options) {
      // Get existing options
      const existingOptions = await prisma.pollOption.findMany({
        where: { pollId: id },
        select: { id: true },
      })
      const existingIds = new Set(existingOptions.map(o => o.id))
      const newIds = new Set(options.filter(o => o.id).map(o => o.id))

      // Delete options that were removed
      const toDelete = [...existingIds].filter(id => !newIds.has(id))
      if (toDelete.length > 0) {
        await prisma.pollOption.deleteMany({
          where: { id: { in: toDelete } },
        })
      }

      // Update or create options
      for (let i = 0; i < options.length; i++) {
        const opt = options[i]
        if (opt.id && existingIds.has(opt.id)) {
          // Update existing option
          await prisma.pollOption.update({
            where: { id: opt.id },
            data: { textNe: opt.textNe, textEn: opt.textEn, order: i },
          })
        } else {
          // Create new option
          await prisma.pollOption.create({
            data: {
              pollId: id,
              textNe: opt.textNe,
              textEn: opt.textEn,
              order: i,
            },
          })
        }
      }
    }

    const poll = await prisma.poll.update({
      where: { id, deletedAt: null },
      data: {
        ...updateData,
        startsAt: startsAt ? new Date(startsAt as string) : startsAt === null ? null : undefined,
        expiresAt: expiresAt ? new Date(expiresAt as string) : expiresAt === null ? null : undefined,
      },
      select: {
        id: true,
        questionNe: true,
        questionEn: true,
        isActive: true,
        updatedAt: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'POLL_UPDATE',
        targetType: 'POLL',
        targetId: poll.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      data: poll,
      message: 'Poll updated successfully',
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Poll not found' },
        { status: 404 }
      )
    }
    return errorHandler(error)
  }
}

// DELETE /api/admin/polls/:id - Delete poll (Admin+)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authMiddleware(req)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const authenticatedReq = authResult as AuthenticatedRequest

    const roleResult = await roleMiddleware([Role.ADMIN, Role.SUPERADMIN])(authenticatedReq)
    if (roleResult instanceof NextResponse) {
      return roleResult
    }

    const { id } = await params

    // Soft delete
    const poll = await prisma.poll.update({
      where: { id, deletedAt: null },
      data: { deletedAt: new Date() },
      select: {
        id: true,
      },
    })

    await prisma.auditLog.create({
      data: {
        userId: authenticatedReq.user!.id,
        action: 'POLL_DELETE',
        targetType: 'POLL',
        targetId: poll.id,
        ipAddress: req.headers.get('x-forwarded-for') || null,
        userAgent: req.headers.get('user-agent') || null,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Poll deleted successfully',
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Poll not found' },
        { status: 404 }
      )
    }
    return errorHandler(error)
  }
}
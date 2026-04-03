import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authMiddleware, AuthenticatedRequest } from "@/lib/middleware";
import { z } from "zod";

const voteSchema = z.object({
  optionId: z.string().min(1, "Option ID is required"),
});

// GET /api/polls/:id - Get poll with results (Public)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const poll = await prisma.poll.findFirst({
      where: {
        id,
        deletedAt: null,
        isActive: true,
      },
      select: {
        id: true,
        questionNe: true,
        questionEn: true,
        description: true,
        isMultiple: true,
        startsAt: true,
        expiresAt: true,
        options: {
          select: {
            id: true,
            textNe: true,
            textEn: true,
            _count: {
              select: {
                votes: true,
              },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(
        { success: false, message: "Poll not found or not active" },
        { status: 404 },
      );
    }

    // Check if poll has started
    if (poll.startsAt && new Date(poll.startsAt) > new Date()) {
      return NextResponse.json(
        { success: false, message: "Poll has not started yet" },
        { status: 400 },
      );
    }

    // Check if poll has expired
    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Poll has expired" },
        { status: 400 },
      );
    }

    // Calculate total votes and percentages
    const totalVotes = poll.options.reduce(
      (sum, opt) => sum + opt._count.votes,
      0,
    );

    const formattedOptions = poll.options.map((opt) => ({
      id: opt.id,
      textNe: opt.textNe,
      textEn: opt.textEn,
      voteCount: opt._count.votes,
      percentage:
        totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        ...poll,
        options: formattedOptions,
        totalVotes,
      },
      message: "Poll retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting poll:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/polls/:id/vote - Vote on a poll (Public, optional auth)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try to authenticate (optional)
    let userId: string | null = null;
    const authResult = await authMiddleware(req);
    if (!(authResult instanceof NextResponse)) {
      const authenticatedReq = authResult as AuthenticatedRequest;
      userId = authenticatedReq.user?.id || null;
    }

    // Validate request body
    const body = await req.json();
    const validation = voteSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          data: { errors: validation.error.flatten().fieldErrors },
          message: "Invalid data",
        },
        { status: 400 },
      );
    }

    const { optionId } = validation.data;

    // Get poll and check conditions
    const poll = await prisma.poll.findFirst({
      where: {
        id,
        deletedAt: null,
        isActive: true,
      },
      include: {
        options: {
          where: { id: optionId },
          select: { id: true },
        },
      },
    });

    if (!poll) {
      return NextResponse.json(
        { success: false, message: "Poll not found or not active" },
        { status: 404 },
      );
    }

    if (poll.options.length === 0) {
      return NextResponse.json(
        { success: false, message: "Invalid option" },
        { status: 400 },
      );
    }

    // Check if poll has started
    if (poll.startsAt && new Date(poll.startsAt) > new Date()) {
      return NextResponse.json(
        { success: false, message: "Poll has not started yet" },
        { status: 400 },
      );
    }

    // Check if poll has expired
    if (poll.expiresAt && new Date(poll.expiresAt) < new Date()) {
      return NextResponse.json(
        { success: false, message: "Poll has expired" },
        { status: 400 },
      );
    }

    // Get client IP for anonymous voting tracking
    const ipAddress = req.headers.get('x-forwarded-for') || null;

    // Check if user already voted (if authenticated)
    if (userId) {
      const existingVote = await prisma.pollVote.findFirst({
        where: {
          pollId: id,
          userId: userId,
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { success: false, message: "You have already voted on this poll" },
          { status: 400 },
        );
      }
    } else {
      // For anonymous users, check by IP (optional - can be removed for more permissive voting)
      const existingVote = await prisma.pollVote.findFirst({
        where: {
          pollId: id,
          ipAddress: ipAddress,
        },
      });

      if (existingVote) {
        return NextResponse.json(
          { success: false, message: "This IP has already voted on this poll" },
          { status: 400 },
        );
      }
    }

    // Create the vote
    await prisma.pollVote.create({
      data: {
        pollId: id,
        optionId: optionId,
        userId: userId,
        ipAddress: ipAddress,
      },
    });

    // Get updated vote counts
    const options = await prisma.pollOption.findMany({
      where: { pollId: id },
      select: {
        id: true,
        _count: {
          select: { votes: true },
        },
      },
    });

    const totalVotes = options.reduce((sum, opt) => sum + opt._count.votes, 0);

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
      data: {
        totalVotes,
        results: options.map((opt) => ({
          optionId: opt.id,
          voteCount: opt._count.votes,
          percentage:
            totalVotes > 0
              ? Math.round((opt._count.votes / totalVotes) * 100)
              : 0,
        })),
      },
    });
  } catch (error) {
    console.error("Error voting on poll:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

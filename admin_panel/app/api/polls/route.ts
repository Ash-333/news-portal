import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cachedApi } from "@/lib/redis";

const CACHE_TTL = 300 // 5 minutes

// GET /api/polls - List all active polls (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const result = await cachedApi(
      'polls:list',
      { page, limit, activeOnly },
      async () => {
        const where: Record<string, unknown> = { deletedAt: null };

        if (activeOnly) {
          where.isActive = true;
        }

        const [polls, total] = await Promise.all([
          prisma.poll.findMany({
            where,
            include: {
              options: {
                orderBy: { order: "asc" },
                include: {
                  _count: { select: { votes: true } },
                },
              },
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
          }),
          prisma.poll.count({ where }),
        ]);

        const formattedPolls = polls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt._count.votes, 0);
          return {
            ...poll,
            totalVotes,
            options: poll.options.map((opt) => ({
              ...opt,
              voteCount: opt._count.votes,
              percentage: totalVotes > 0 ? Math.round((opt._count.votes / totalVotes) * 100) : 0,
            })),
          };
        });

        return { polls: formattedPolls, total }
      },
      CACHE_TTL
    );

    return NextResponse.json({
      success: true,
      data: result.polls,
      message: "Polls retrieved successfully",
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error) {
    console.error("Error getting polls:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

import { NextRequest } from "next/server";
import { prisma } from "../prisma";
import { AuthenticatedRequest } from "./auth";

export async function auditMiddleware(
  req: AuthenticatedRequest,
  action: string,
  targetType: string,
  targetId?: string,
): Promise<void> {
  try {
    // Only audit POST, PATCH, DELETE methods
    if (!["POST", "PATCH", "DELETE"].includes(req.method)) {
      return;
    }

    const userId = req.user?.id;
    if (!userId) {
      return;
    }

    const ipAddress = req.headers.get("x-forwarded-for") || null;
    const userAgent = req.headers.get("user-agent") || null;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Log error but don't fail the request
    console.error("Audit log error:", error);
  }
}

// Helper to create audit log manually
export async function createAuditLog(
  userId: string,
  action: string,
  targetType: string,
  targetId?: string,
  ipAddress?: string | null,
  userAgent?: string | null,
): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        targetType,
        targetId,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
      },
    });
  } catch (error) {
    console.error("Audit log error:", error);
  }
}

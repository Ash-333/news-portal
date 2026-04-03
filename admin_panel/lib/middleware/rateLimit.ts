import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "../redis";

interface RateLimitConfig {
  limit: number;
  windowSeconds: number;
}

const defaultConfigs: Record<string, RateLimitConfig> = {
  login: {
    limit: parseInt(process.env.RATE_LIMIT_LOGIN || "5"),
    windowSeconds: parseInt(process.env.RATE_LIMIT_LOGIN_WINDOW || "900"), // 15 minutes
  },
  comments: {
    limit: parseInt(process.env.RATE_LIMIT_COMMENTS || "5"),
    windowSeconds: parseInt(process.env.RATE_LIMIT_COMMENTS_WINDOW || "3600"), // 1 hour
  },
  api: {
    limit: parseInt(process.env.RATE_LIMIT_API || "100"),
    windowSeconds: parseInt(process.env.RATE_LIMIT_API_WINDOW || "60"), // 1 minute
  },
};

export function rateLimitMiddleware(
  type: "login" | "comments" | "api" = "api",
  customConfig?: Partial<RateLimitConfig>,
) {
  return async (req: NextRequest): Promise<NextResponse | NextRequest> => {
    const config = { ...defaultConfigs[type], ...customConfig };

    // Get identifier (user ID for authenticated, IP for anonymous)
    let identifier: string;

    // Try to get user ID from session (simplified - in production use proper session)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      identifier = authHeader.substring(7);
    } else {
      // Use IP address
      identifier = req.headers.get("x-forwarded-for") || "unknown";
    }

    const key = `${type}:${identifier}`;
    const result = await checkRateLimit(
      key,
      config.limit,
      config.windowSeconds,
    );

    if (!result.allowed) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.resetTime.toString(),
          },
        },
      );
    }

    return req;
  };
}

// Simpler rate limit check for use in route handlers
export async function checkRateLimitForRequest(
  req: NextRequest,
  type: "login" | "comments" | "api" = "api",
): Promise<{ allowed: boolean; response?: NextResponse }> {
  const config = defaultConfigs[type];

  let identifier: string;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    identifier = authHeader.substring(7);
  } else {
    identifier = req.headers.get("x-forwarded-for") || "unknown";
  }

  const key = `${type}:${identifier}`;
  const result = await checkRateLimit(key, config.limit, config.windowSeconds);

  if (!result.allowed) {
    return {
      allowed: false,
      response: NextResponse.json(
        {
          success: false,
          data: null,
          message: "Rate limit exceeded. Please try again later.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": config.limit.toString(),
            "X-RateLimit-Remaining": result.remaining.toString(),
            "X-RateLimit-Reset": result.resetTime.toString(),
          },
        },
      ),
    };
  }

  return { allowed: true };
}

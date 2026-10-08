import { LRUCache } from "lru-cache";
import { NextRequest } from "next/server";

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number; // ms
  limit?: number;
};

/**
 * In-memory rate limiter using LRU cache.
 * Tracks requests per IP per rolling window.
 *
 * Note: On Vercel each serverless instance has its own store.
 * For a low-traffic corporate site this is fine.
 * For high-traffic production, swap to Upstash Redis.
 */
function rateLimit(options: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options.uniqueTokenPerInterval ?? 1000,
    ttl: options.interval ?? 60_000,
  });

  return {
    check(limit: number, token: string) {
      const tokenCount = tokenCache.get(token) ?? [];
      const now = Date.now();
      const windowStart = now - (options.interval ?? 60_000);

      // Keep only timestamps within the current window
      const recentRequests = tokenCount.filter((ts) => ts > windowStart);
      recentRequests.push(now);
      tokenCache.set(token, recentRequests);

      const currentUsage = recentRequests.length;
      const isRateLimited = currentUsage > limit;

      return {
        isRateLimited,
        remaining: Math.max(0, limit - currentUsage),
        limit,
      };
    },
  };
}

// 20 submissions per IP per hour in production (increased from 5)
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 2000,
  limit: 20,
});

/**
 * Check rate limit for a given request.
 * Returns the IP address and whether the request is allowed.
 *
 * Automatically bypasses rate limiting in local development (localhost / 127.0.0.1 / NODE_ENV=development)
 * to allow unobstructed testing, while maintaining a relaxed 20/hr limit in production.
 */
export function checkRateLimit(req: NextRequest, identifier?: string, customLimit = 20) {
  const host = req.headers.get("host") ?? "";
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1";

  // Relax/skip rate limiting completely in local development
  const isLocalDev =
    process.env.NODE_ENV === "development" ||
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    ip === "127.0.0.1" ||
    ip === "::1";

  if (isLocalDev) {
    return {
      isRateLimited: false,
      remaining: 999,
      ip,
    };
  }

  const token = identifier ? `${ip}:${identifier}` : ip;
  const { isRateLimited, remaining } = limiter.check(customLimit, token);

  return { isRateLimited, remaining, ip };
}

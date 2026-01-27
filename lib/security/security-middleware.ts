import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/queue/message-queue';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret');

export type SecurityContext = {
  userId?: string;
  sessionId?: string;
  isAuthenticated: boolean;
  tier: 'free' | 'pro' | 'enterprise';
  permissions: string[];
};

/**
 * Security and rate limiting middleware
 * Handles authentication, authorization, and rate limiting
 */

// Rate limit configurations by tier
const RATE_LIMITS = {
  free: {
    requests: 10,
    window: 60, // 1 minute
    concurrentSessions: 1,
    maxMessagesPerDay: 100,
  },
  pro: {
    requests: 100,
    window: 60,
    concurrentSessions: 5,
    maxMessagesPerDay: 10000,
  },
  enterprise: {
    requests: 1000,
    window: 60,
    concurrentSessions: 50,
    maxMessagesPerDay: Infinity,
  },
};

export async function verifyToken(token: string): Promise<{ userId: string; tier: string } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: string; tier: string };
  } catch {
    return null;
  }
}

export async function extractSecurityContext(request: NextRequest): Promise<SecurityContext> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  let userId: string | undefined;
  let tier: 'free' | 'pro' | 'enterprise' = 'free';
  let isAuthenticated = false;

  if (token) {
    const verified = await verifyToken(token);
    if (verified) {
      userId = verified.userId;
      tier = (verified.tier as 'free' | 'pro' | 'enterprise') || 'free';
      isAuthenticated = true;
    }
  }

  return {
    userId,
    isAuthenticated,
    tier,
    permissions: isAuthenticated ? ['read', 'write'] : ['read'],
  };
}

export async function enforceRateLimit(
  identifier: string,
  tier: 'free' | 'pro' | 'enterprise'
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const limits = RATE_LIMITS[tier];
  const result = await checkRateLimit(identifier, limits.requests, limits.window);

  return result;
}

export async function checkConcurrentSessions(
  userId: string,
  tier: 'free' | 'pro' | 'enterprise',
  currentCount: number
): Promise<boolean> {
  const limits = RATE_LIMITS[tier];
  return currentCount < limits.concurrentSessions;
}

export async function checkDailyMessageLimit(
  userId: string,
  tier: 'free' | 'pro' | 'enterprise',
  messageCount: number
): Promise<boolean> {
  const limits = RATE_LIMITS[tier];
  return messageCount < limits.maxMessagesPerDay;
}

export function validateInput(data: unknown, schema: Record<string, unknown>): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;
  for (const [key] of Object.entries(schema)) {
    if (!(key in obj)) {
      return false;
    }
  }

  return true;
}

export function sanitizeInput(text: string): string {
  // Remove potential script injections and sanitize HTML
  return text
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
}

export function createSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  };
}

export function createRateLimitHeaders(
  remaining: number,
  resetAt: number
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(resetAt).toISOString(),
    'Retry-After': ((resetAt - Date.now()) / 1000).toString(),
  };
}

export async function checkPermission(
  context: SecurityContext,
  action: string
): Promise<boolean> {
  if (!context.isAuthenticated) {
    return action === 'read';
  }

  return context.permissions.includes(action);
}

export function createErrorResponse(
  status: number,
  message: string,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    {
      status,
      headers: createSecurityHeaders(),
    }
  );
}

// CORS configuration
export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXT_PUBLIC_APP_URL || '',
].filter(Boolean);

export function validateCorsOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

export function createCorsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

// Sensitive operation validation
export async function validateSensitiveOperation(
  userId: string,
  operationType: string,
  data: Record<string, unknown>
): Promise<{ valid: boolean; reason?: string }> {
  // Implement additional validation for sensitive operations
  // like deleting conversations, exporting data, etc.

  const sensitiveOps = ['delete_conversation', 'export_data', 'change_settings'];

  if (!sensitiveOps.includes(operationType)) {
    return { valid: true };
  }

  // Add additional checks here
  return { valid: true };
}

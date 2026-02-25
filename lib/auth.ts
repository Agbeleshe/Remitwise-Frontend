import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Validates the Authorization header.
 * Expects:  Authorization: Bearer <token>
 * The token is checked against the AUTH_SECRET env variable.
 */
export function validateAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization") ?? "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (!token) return false;
  return token === process.env.AUTH_SECRET;
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export type AuthenticatedHandler = (
  request: NextRequest,
  session: string
) => Promise<Response> | Response;

/**
 * Higher-order function to protect API routes with authentication.
 * It extracts the session (Stellar address) and passes it to the handler.
 */
export function withAuth(handler: AuthenticatedHandler) {
  return async (request: NextRequest) => {
    try {
      const session = await getSession();
      
      if (!session?.address) {
        return unauthorizedResponse();
      }

      return await handler(request, session.address);
    } catch (error) {
      console.error('Auth wrapper error:', error);
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { fetchTransactionHistory } from '@/lib/remittance/horizon';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/v1/remittance/history
 * Fetch transaction history for the authenticated user
 * 
 * Query Parameters:
 * - limit: Number of transactions to return (default: 10, max: 200)
 * - cursor: Pagination cursor for next page
 * - status: Filter by status (completed, pending, failed)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 200);
    const cursor = searchParams.get('cursor') || undefined;
    const status = searchParams.get('status') as 'completed' | 'pending' | 'failed' | undefined;

    const result = await fetchTransactionHistory({
      limit,
      cursor,
      status,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
}

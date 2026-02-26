import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth';
import { fetchTransactionStatus } from '@/lib/remittance/horizon';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/v1/remittance/status/[txHash]
 * Fetch the status of a specific transaction
 * 
 * Path Parameters:
 * - txHash: The transaction hash to check
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txHash: string }> }
) {
  try {
    const { txHash } = await params;

    if (!txHash) {
      return NextResponse.json(
        { error: 'Transaction hash is required' },
        { status: 400 }
      );
    }

    const status = await fetchTransactionStatus(txHash);

    return NextResponse.json(status);
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction status' },
      { status: 500 }
    );
  }
}

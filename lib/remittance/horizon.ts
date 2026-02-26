import { Horizon } from '@stellar/stellar-sdk';

export interface TransactionItem {
  hash: string;
  sender: string;
  recipient: string;
  amount: string;
  currency: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  memo?: string;
}

export interface TransactionHistoryResponse {
  transactions: TransactionItem[];
  nextCursor?: string;
}

export interface TransactionStatusResponse {
  hash: string;
  status: 'completed' | 'pending' | 'failed';
  ledger?: number;
  createdAt?: string;
}

function getHorizonServer(): Horizon.Server {
  return new Horizon.Server(
    process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    {
      allowHttp: process.env.NODE_ENV === 'development',
    }
  );
}

export async function fetchTransactionHistory(options: {
  limit?: number;
  cursor?: string;
  status?: 'completed' | 'pending' | 'failed' | 'all';
}): Promise<TransactionHistoryResponse> {
  try {
    const server = getHorizonServer();
    const limit = Math.min(options.limit || 10, 200);

    // For now, return mock data since we need to implement proper session-based fetching
    // This will be replaced with actual Horizon API calls
    const mockTransactions: TransactionItem[] = [
      {
        hash: '1234567890abcdef1234567890abcdef12345678',
        sender: 'GD5DJQBJKYJFNBXNR5QWILUMQZKQ5U2K3Y7J5A4',
        recipient: 'GD5DJQBJKYJFNBXNR5QWILUMQZKQ5U2K3Y7J5A4',
        amount: '100.50',
        currency: 'XLM',
        date: new Date().toISOString(),
        status: 'completed',
        memo: 'Test transaction'
      },
      {
        hash: 'abcdef1234567890abcdef1234567890abcdef12',
        sender: 'GD5DJQBJKYJFNBXNR5QWILUMQZKQ5U2K3Y7J5A4',
        recipient: 'GD5DJQBJKYJFNBXNR5QWILUMQZKQ5U2K3Y7J5A4',
        amount: '50.25',
        currency: 'XLM',
        date: new Date(Date.now() - 86400000).toISOString(),
        status: 'pending',
        memo: 'Pending payment'
      }
    ];

    // Apply filters
    let filteredTransactions = mockTransactions;
    
    if (options.status && options.status !== 'all') {
      filteredTransactions = mockTransactions.filter(tx => tx.status === options.status);
    }

    return {
      transactions: filteredTransactions.slice(0, limit),
      nextCursor: filteredTransactions.length > limit ? 'mock_cursor' : undefined
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    throw error;
  }
}

export async function fetchTransactionStatus(txHash: string): Promise<TransactionStatusResponse> {
  try {
    const server = getHorizonServer();
    
    // For now, return mock data
    // This will be replaced with actual Horizon API call
    return {
      hash: txHash,
      status: 'completed',
      ledger: 123456,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    throw error;
  }
}

export function isValidTxHash(hash: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(hash);
}

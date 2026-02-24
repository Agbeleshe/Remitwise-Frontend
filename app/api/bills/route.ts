import { NextRequest } from 'next/server';
import { validatePaginationParams, paginateData, PaginatedResult } from '../../../lib/utils/pagination';

// Mock data structure for bills - in a real app this would come from a contract or database
interface Bill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid' | 'overdue';
  category: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - in a real app this would come from a contract or database
const mockBills: Bill[] = [
  { id: '1', title: 'Electricity Bill', amount: 120.50, dueDate: '2024-01-15', status: 'unpaid', category: 'utilities', provider: 'City Power', createdAt: '2023-12-01', updatedAt: '2023-12-01' },
  { id: '2', title: 'Internet Service', amount: 79.99, dueDate: '2024-01-20', status: 'unpaid', category: 'utilities', provider: 'NetConnect', createdAt: '2023-12-05', updatedAt: '2023-12-05' },
  { id: '3', title: 'Water Bill', amount: 65.25, dueDate: '2023-12-31', status: 'paid', category: 'utilities', provider: 'City Water', createdAt: '2023-11-25', updatedAt: '2023-12-01' },
  { id: '4', title: 'Car Insurance', amount: 150.00, dueDate: '2024-02-10', status: 'unpaid', category: 'insurance', provider: 'AutoSecure', createdAt: '2023-12-10', updatedAt: '2023-12-10' },
  { id: '5', title: 'Mortgage Payment', amount: 1250.00, dueDate: '2024-01-01', status: 'paid', category: 'housing', provider: 'Home Loan Inc', createdAt: '2023-12-01', updatedAt: '2024-01-02' },
  { id: '6', title: 'Gym Membership', amount: 49.99, dueDate: '2024-01-25', status: 'unpaid', category: 'lifestyle', provider: 'FitLife Center', createdAt: '2023-12-15', updatedAt: '2023-12-15' },
  { id: '7', title: 'Phone Bill', amount: 89.99, dueDate: '2024-01-18', status: 'overdue', category: 'utilities', provider: 'Mobile Plus', createdAt: '2023-12-18', updatedAt: '2024-01-20' },
  { id: '8', title: 'Health Insurance', amount: 299.99, dueDate: '2024-02-05', status: 'unpaid', category: 'insurance', provider: 'HealthFirst', createdAt: '2023-12-20', updatedAt: '2023-12-20' },
  { id: '9', title: 'Streaming Service', amount: 14.99, dueDate: '2024-01-30', status: 'unpaid', category: 'entertainment', provider: 'StreamMax', createdAt: '2023-12-25', updatedAt: '2023-12-25' },
  { id: '10', title: 'Credit Card', amount: 450.00, dueDate: '2024-01-22', status: 'paid', category: 'finance', provider: 'BankPlus', createdAt: '2023-12-28', updatedAt: '2024-01-23' },
];

export async function GET(request: NextRequest) {
  try {
    // Extract pagination parameters from query
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const cursorParam = url.searchParams.get('cursor');

    const paginationParams = {
      limit: limitParam ? parseInt(limitParam, 10) : undefined,
      cursor: cursorParam || undefined,
    };

    const { limit, cursor } = validatePaginationParams(paginationParams);

    // In a real implementation, this would fetch from a contract or database
    // For now, we'll paginate the mock data in memory
    const paginatedResult: PaginatedResult<Bill> = paginateData(
      mockBills,
      limit,
      (item) => item.id,
      cursor
    );

    return Response.json(paginatedResult);
  } catch (error) {
    console.error('Error fetching bills:', error);
    return Response.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}

// POST handler for creating bills (future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, this would create a bill via contract or database
    const newBill: Bill = {
      id: Date.now().toString(), // In real app, use proper ID generation
      title: body.title,
      amount: body.amount,
      dueDate: body.dueDate,
      status: body.status || 'unpaid',
      category: body.category,
      provider: body.provider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return Response.json(newBill, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return Response.json({ error: 'Failed to create bill' }, { status: 500 });
  }
}
import { NextRequest } from 'next/server';
import { validatePaginationParams, paginateData, PaginatedResult } from '../../../lib/utils/pagination';

// Mock data structure for goals - in a real app this would come from a contract or database
interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - in a real app this would come from a contract or database
const mockGoals: Goal[] = [
  { id: '1', title: 'Emergency Fund', targetAmount: 10000, currentAmount: 4500, deadline: '2024-12-31', createdAt: '2023-01-15', updatedAt: '2023-06-20' },
  { id: '2', title: 'Vacation Trip', targetAmount: 5000, currentAmount: 1200, deadline: '2024-08-15', createdAt: '2023-03-10', updatedAt: '2023-07-01' },
  { id: '3', title: 'New Car', targetAmount: 25000, currentAmount: 8000, deadline: '2025-06-30', createdAt: '2023-02-20', updatedAt: '2023-08-15' },
  { id: '4', title: 'Home Down Payment', targetAmount: 50000, currentAmount: 15000, deadline: '2026-12-31', createdAt: '2023-01-01', updatedAt: '2023-09-10' },
  { id: '5', title: 'Education Fund', targetAmount: 20000, currentAmount: 7500, deadline: '2025-09-01', createdAt: '2023-04-05', updatedAt: '2023-10-05' },
  { id: '6', title: 'Wedding Savings', targetAmount: 15000, currentAmount: 3000, deadline: '2025-05-20', createdAt: '2023-05-12', updatedAt: '2023-11-15' },
  { id: '7', title: 'Retirement Fund', targetAmount: 100000, currentAmount: 25000, deadline: '2040-12-31', createdAt: '2023-01-01', updatedAt: '2023-12-01' },
  { id: '8', title: 'Business Investment', targetAmount: 30000, currentAmount: 5000, deadline: '2024-11-30', createdAt: '2023-06-01', updatedAt: '2023-12-10' },
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
    const paginatedResult: PaginatedResult<Goal> = paginateData(
      mockGoals,
      limit,
      (item) => item.id,
      cursor
    );

    return Response.json(paginatedResult);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return Response.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

// POST handler for creating goals (future use)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, this would create a goal via contract or database
    const newGoal: Goal = {
      id: Date.now().toString(), // In real app, use proper ID generation
      title: body.title,
      targetAmount: body.targetAmount,
      currentAmount: body.currentAmount || 0,
      deadline: body.deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return Response.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return Response.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}
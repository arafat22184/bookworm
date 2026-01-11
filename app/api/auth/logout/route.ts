import { NextRequest } from 'next/server';
import { clearAuthCookies } from '@/lib/auth';
import { successResponse, handleApiError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    await clearAuthCookies();
    return successResponse({ message: 'Logged out successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}

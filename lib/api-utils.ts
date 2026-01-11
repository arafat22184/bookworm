import { NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function successResponse(data: any, message = 'Success', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function errorResponse(error: any, status = 500) {
  console.error(error);
  const message = typeof error === 'string' ? error : (error.message || 'Internal Server Error');
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleApiError(error: any) {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  return errorResponse('Internal Server Error', 500);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkAuth(session: any) {
  if (!session) {
    return false;
  }
  return true;
}

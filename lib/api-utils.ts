import { NextResponse } from 'next/server';

export function errorResponse(message: string, status: number = 500, errors: any = null) {
  return NextResponse.json(
    { success: false, message, errors },
    { status }
  );
}

export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

export function handleApiError(error: any) {
  console.error('API Error:', error);
  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }
  return errorResponse('Internal Server Error', 500);
}

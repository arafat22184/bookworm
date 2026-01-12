import { NextResponse } from 'next/server';
import { ApiResponse, ApiError, UserSession } from './types';

/**
 * Creates a successful API response
 * @param data - The data to return
 * @param message - Success message
 * @param status - HTTP status code
 * @returns NextResponse with success data
 */
export function successResponse<T>(
  data: T,
  message = 'Success',
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Creates an error API response
 * @param error - Error message or Error object
 * @param status - HTTP status code
 * @returns NextResponse with error data
 */
export function errorResponse(
  error: string | Error,
  status = 500
): NextResponse<ApiError> {
  console.error('API Error:', error);
  const message = typeof error === 'string' ? error : (error.message || 'Internal Server Error');

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}

/**
 * Handles API errors with consistent formatting
 * @param error - The error to handle
 * @returns NextResponse with formatted error
 */
export function handleApiError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  if (error instanceof Error) {
    // Check for specific error types
    if (error.name === 'ValidationError') {
      return errorResponse(error.message, 400);
    }
    if (error.name === 'CastError') {
      return errorResponse('Invalid ID format', 400);
    }
    return errorResponse(error.message, 500);
  }

  return errorResponse('Internal Server Error', 500);
}

/**
 * Validates user authentication
 * @param session - User session object
 * @returns True if authenticated, false otherwise
 */
export function isAuthenticated(session: UserSession | null): session is UserSession {
  return session !== null && session !== undefined;
}

/**
 * Validates admin authorization
 * @param session - User session object
 * @returns True if user is admin, false otherwise
 */
export function isAdmin(session: UserSession | null): boolean {
  return isAuthenticated(session) && session.role === 'admin';
}

/**
 * Creates an unauthorized error response
 * @param message - Optional custom message
 * @returns NextResponse with 401 status
 */
export function unauthorizedResponse(message = 'Unauthorized'): NextResponse<ApiError> {
  return errorResponse(message, 401);
}

/**
 * Creates a forbidden error response
 * @param message - Optional custom message
 * @returns NextResponse with 403 status
 */
export function forbiddenResponse(message = 'Forbidden'): NextResponse<ApiError> {
  return errorResponse(message, 403);
}

/**
 * Creates a not found error response
 * @param resource - The resource that wasn't found
 * @returns NextResponse with 404 status
 */
export function notFoundResponse(resource = 'Resource'): NextResponse<ApiError> {
  return errorResponse(`${resource} not found`, 404);
}

/**
 * Creates a validation error response
 * @param message - Validation error message
 * @param errors - Optional field-specific errors
 * @returns NextResponse with 400 status
 */
export function validationErrorResponse(
  message = 'Validation failed',
  errors?: Record<string, string[]>
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
    },
    { status: 400 }
  );
}


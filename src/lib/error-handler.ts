import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { logError, createLogger } from './logger';

const logger = createLogger('error-handler');

// Custom error types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: any) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', public retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
  }
}

// Error response interface
interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp: string;
  path: string;
  requestId?: string;
}

// Higher-order function to wrap API handlers with error handling
export function withErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = generateRequestId();
    
    try {
      // Add request ID to headers for tracing
      const response = await handler(request, context);
      
      // Log successful requests
      const duration = Date.now() - startTime;
      logger.info({
        requestId,
        method: request.method,
        url: request.url,
        statusCode: response.status,
        duration,
      }, 'Request completed successfully');
      
      // Add request ID to response headers
      response.headers.set('X-Request-ID', requestId);
      
      return response;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Handle different types of errors
      if (error instanceof ZodError) {
        return handleZodError(error, request, requestId);
      }
      
      if (error instanceof AppError) {
        return handleAppError(error, request, requestId, duration);
      }
      
      // Handle unexpected errors
      return handleUnexpectedError(error as Error, request, requestId, duration);
    }
  };
}

// Handle Zod validation errors
function handleZodError(error: ZodError, request: NextRequest, requestId: string): NextResponse {
  const details = error.issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
  
  logger.warn({
    requestId,
    method: request.method,
    url: request.url,
    validationErrors: details,
  }, 'Validation error occurred');
  
  const errorResponse: ErrorResponse = {
    error: 'Invalid request data',
    code: 'VALIDATION_ERROR',
    details,
    timestamp: new Date().toISOString(),
    path: new URL(request.url).pathname,
    requestId,
  };
  
  return NextResponse.json(errorResponse, {
    status: 400,
    headers: { 'X-Request-ID': requestId },
  });
}

// Handle application-specific errors
function handleAppError(
  error: AppError, 
  request: NextRequest, 
  requestId: string,
  duration: number
): NextResponse {
  // Log error with appropriate level
  const logLevel = error.statusCode >= 500 ? 'error' : 'warn';
  
  logger[logLevel]({
    requestId,
    method: request.method,
    url: request.url,
    statusCode: error.statusCode,
    duration,
    error: {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.statusCode >= 500 ? error.stack : undefined,
    },
  }, `Application error: ${error.message}`);
  
  const errorResponse: ErrorResponse = {
    error: error.message,
    code: error.code,
    timestamp: new Date().toISOString(),
    path: new URL(request.url).pathname,
    requestId,
  };
  
  // Add retry-after header for rate limit errors
  const headers: Record<string, string> = { 'X-Request-ID': requestId };
  if (error instanceof RateLimitError && error.retryAfter) {
    headers['Retry-After'] = error.retryAfter.toString();
  }
  
  return NextResponse.json(errorResponse, {
    status: error.statusCode,
    headers,
  });
}

// Handle unexpected errors
function handleUnexpectedError(
  error: Error, 
  request: NextRequest, 
  requestId: string,
  duration: number
): NextResponse {
  // Log full error details for debugging
  logError(error, {
    requestId,
    method: request.method,
    url: request.url,
    duration,
    userAgent: request.headers.get('user-agent'),
  });
  
  // Return generic error message to client (don't leak implementation details)
  const errorResponse: ErrorResponse = {
    error: 'An unexpected error occurred. Please try again later.',
    code: 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString(),
    path: new URL(request.url).pathname,
    requestId,
  };
  
  return NextResponse.json(errorResponse, {
    status: 500,
    headers: { 'X-Request-ID': requestId },
  });
}

// Generate unique request ID for tracing
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Utility function to create standardized API responses
export function createApiResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      data,
      timestamp: new Date().toISOString(),
    },
    { status, headers }
  );
}
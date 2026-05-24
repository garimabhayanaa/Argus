/**
 * Converts any unknown caught error into a safe string message.
 * Use this in every catch block — never do (error as Error).message directly.
 */
export function toErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
  }
  
  /**
   * Standard error codes for API responses.
   * Using codes (not just messages) lets the frontend handle errors programmatically.
   */
  export const ErrorCode = {
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    RATE_LIMITED: 'RATE_LIMITED',
    INTERNAL_ERROR: 'INTERNAL_ERROR',
  } as const
  
  export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
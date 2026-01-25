/**
 * API types for the Actbeat theater management system.
 * Generic types for API request/response handling.
 * @module types/api
 */

/**
 * Generic successful API response wrapper.
 * @template T - The type of data being returned
 */
export interface ApiResponse<T> {
  /** Indicates successful response */
  success: true;
  /** The response data */
  data: T;
  /** Optional message */
  message?: string;
}

/**
 * API error response.
 */
export interface ApiError {
  /** Indicates error response */
  success: false;
  /** Error code for programmatic handling */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: Record<string, unknown>;
  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Union type for all API responses.
 * @template T - The type of data in successful responses
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;

/**
 * Paginated response wrapper.
 * @template T - The type of items in the data array
 */
export interface PaginatedResponse<T> {
  /** Array of items for current page */
  data: T[];
  /** Total number of items across all pages */
  total: number;
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Total number of pages */
  totalPages: number;
  /** Whether there is a next page */
  hasNextPage: boolean;
  /** Whether there is a previous page */
  hasPreviousPage: boolean;
}

/**
 * Paginated response with meta object wrapper.
 * Used by v2-backend services for list endpoints.
 * @template T - The type of items in the data array
 */
export interface PaginatedResponseMeta<T> {
  /** Array of items for current page */
  data: T[];
  /** Pagination metadata */
  meta: {
    /** Total number of items across all pages */
    totalCount: number;
    /** Current page number (1-indexed) */
    page: number;
    /** Number of items per page */
    pageSize: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Pagination query parameters.
 */
export interface PaginationParams {
  /** Page number (1-indexed, default: 1) */
  page?: number;
  /** Items per page (default: 20, max: 100) */
  pageSize?: number;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

/**
 * Sorting parameters.
 */
export interface SortParams {
  /** Field to sort by */
  field: string;
  /** Sort direction */
  order: 'asc' | 'desc';
}

/**
 * Date range filter.
 */
export interface DateRangeFilter {
  /** Start of date range (inclusive) */
  from?: Date | string;
  /** End of date range (inclusive) */
  to?: Date | string;
}

/**
 * Bulk operation result.
 * @template T - The type of successfully processed items
 */
export interface BulkOperationResult<T> {
  /** Number of items successfully processed */
  successCount: number;
  /** Number of items that failed */
  failureCount: number;
  /** Successfully processed items */
  successes: T[];
  /** Failures with error details */
  failures: Array<{
    /** Original item that failed */
    item: unknown;
    /** Error message */
    error: string;
  }>;
}

/**
 * Result item for a single bulk action operation.
 * @template T - The type of data returned on success
 */
export interface BulkActionResultItem<T = void> {
  /** ID of the item processed */
  id: string;
  /** Whether this operation succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Data returned on success */
  data?: T;
}

/**
 * Response from bulk action endpoints.
 * Provides detailed results for each item processed.
 * @template T - The type of data returned per successful item
 */
export interface BulkActionResponse<T = void> {
  /** Total number of items requested to process */
  totalRequested: number;
  /** Number of items successfully processed */
  successful: number;
  /** Number of items that failed */
  failed: number;
  /** Individual results for each item */
  results: BulkActionResultItem<T>[];
}

/**
 * Health check response.
 */
export interface HealthCheckResponse {
  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy';
  /** Timestamp of health check */
  timestamp: string;
  /** Version information */
  version: string;
  /** Individual service health */
  services: {
    /** Database connection status */
    database: 'healthy' | 'unhealthy';
    /** Redis connection status */
    redis: 'healthy' | 'unhealthy';
    /** Clerk authentication status */
    auth: 'healthy' | 'unhealthy';
  };
}

/**
 * Request metadata for logging and tracing.
 */
export interface RequestMetadata {
  /** Unique request ID for tracing */
  requestId: string;
  /** Timestamp when request was received */
  timestamp: Date;
  /** User ID if authenticated */
  userId?: string;
  /** Organization ID if in org context */
  organizationId?: string;
  /** Client IP address */
  ipAddress?: string;
  /** User agent string */
  userAgent?: string;
}

/**
 * Loading state management types for async operations
 * Provides standardized state representation for HTTP requests
 */

/**
 * Represents the current state of an async operation
 */
export type LoadingStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Complete loading state with data and error information
 */
export interface LoadingState<T = any> {
  /**
   * Current status of the operation
   */
  status: LoadingStatus;

  /**
   * The loaded data (available when status is 'success')
   */
  data?: T;

  /**
   * Error information (available when status is 'error')
   */
  error?: LoadingError;

  /**
   * Timestamp when the operation started
   */
  startTime?: number;

  /**
   * Timestamp when the operation completed (success or error)
   */
  endTime?: number;
}

/**
 * Error information for failed async operations
 */
export interface LoadingError {
  /**
   * Error message
   */
  message: string;

  /**
   * HTTP status code (if applicable)
   */
  statusCode?: number;

  /**
   * Original error object
   */
  originalError?: any;
}

/**
 * Helper functions for working with loading states
 */
export class LoadingStateHelper {
  /**
   * Creates an idle loading state
   */
  static idle<T>(): LoadingState<T> {
    return { status: 'idle' };
  }

  /**
   * Creates a loading state
   */
  static loading<T>(): LoadingState<T> {
    return {
      status: 'loading',
      startTime: Date.now()
    };
  }

  /**
   * Creates a success loading state with data
   */
  static success<T>(data: T, startTime?: number): LoadingState<T> {
    return {
      status: 'success',
      data,
      startTime,
      endTime: Date.now()
    };
  }

  /**
   * Creates an error loading state
   */
  static error<T>(error: LoadingError, startTime?: number): LoadingState<T> {
    return {
      status: 'error',
      error,
      startTime,
      endTime: Date.now()
    };
  }

  /**
   * Checks if state is loading
   */
  static isLoading(state: LoadingState): boolean {
    return state.status === 'loading';
  }

  /**
   * Checks if state has data
   */
  static hasData(state: LoadingState): boolean {
    return state.status === 'success' && state.data !== undefined;
  }

  /**
   * Checks if state has error
   */
  static hasError(state: LoadingState): boolean {
    return state.status === 'error';
  }

  /**
   * Gets the duration of an operation in milliseconds
   */
  static getDuration(state: LoadingState): number | null {
    if (state.startTime && state.endTime) {
      return state.endTime - state.startTime;
    }
    return null;
  }
}

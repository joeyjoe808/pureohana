/**
 * Result Type Pattern
 *
 * Represents the result of an operation that can either succeed or fail.
 * This pattern eliminates exceptions for expected failures and makes
 * error handling explicit and type-safe.
 *
 * Single Responsibility: Result type and helper functions
 */

/**
 * Success result
 */
export interface Success<T> {
  readonly success: true;
  readonly value: T;
}

/**
 * Failure result with error
 */
export interface Failure<E extends Error> {
  readonly success: false;
  readonly error: E;
}

/**
 * Result type - either Success or Failure
 */
export type Result<T, E extends Error = Error> = Success<T> | Failure<E>;

/**
 * Create a success result
 */
export const success = <T>(value: T): Success<T> => ({
  success: true,
  value
});

/**
 * Create a failure result
 */
export const failure = <E extends Error>(error: E): Failure<E> => ({
  success: false,
  error
});

/**
 * Type guard to check if result is successful
 */
export const isSuccess = <T, E extends Error>(
  result: Result<T, E>
): result is Success<T> => result.success === true;

/**
 * Type guard to check if result is failure
 */
export const isFailure = <T, E extends Error>(
  result: Result<T, E>
): result is Failure<E> => result.success === false;

/**
 * Map a successful result to a new value
 */
export const map = <T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (isSuccess(result)) {
    return success(fn(result.value));
  }
  return result;
};

/**
 * FlatMap (chain) operations on results
 */
export const flatMap = <T, U, E extends Error>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> => {
  if (isSuccess(result)) {
    return fn(result.value);
  }
  return result;
};

/**
 * Map error to different error type
 */
export const mapError = <T, E1 extends Error, E2 extends Error>(
  result: Result<T, E1>,
  fn: (error: E1) => E2
): Result<T, E2> => {
  if (isFailure(result)) {
    return failure(fn(result.error));
  }
  return result;
};

/**
 * Get value or throw error
 */
export const unwrap = <T, E extends Error>(result: Result<T, E>): T => {
  if (isSuccess(result)) {
    return result.value;
  }
  throw result.error;
};

/**
 * Get value or return default
 */
export const unwrapOr = <T, E extends Error>(
  result: Result<T, E>,
  defaultValue: T
): T => {
  if (isSuccess(result)) {
    return result.value;
  }
  return defaultValue;
};

/**
 * Get value or compute default
 */
export const unwrapOrElse = <T, E extends Error>(
  result: Result<T, E>,
  fn: (error: E) => T
): T => {
  if (isSuccess(result)) {
    return result.value;
  }
  return fn(result.error);
};

/**
 * Async version - wrap async function to return Result
 */
export const tryCatch = async <T, E extends Error = Error>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => E
): Promise<Result<T, E>> => {
  try {
    const value = await fn();
    return success(value);
  } catch (error) {
    if (errorHandler) {
      return failure(errorHandler(error));
    }
    return failure(error as E);
  }
};

/**
 * Sync version of tryCatch
 */
export const tryCatchSync = <T, E extends Error = Error>(
  fn: () => T,
  errorHandler?: (error: unknown) => E
): Result<T, E> => {
  try {
    const value = fn();
    return success(value);
  } catch (error) {
    if (errorHandler) {
      return failure(errorHandler(error));
    }
    return failure(error as E);
  }
};

/**
 * Combine multiple results into one
 * Returns success only if all results are successful
 */
export const combine = <T extends readonly unknown[], E extends Error>(
  results: { [K in keyof T]: Result<T[K], E> }
): Result<T, E> => {
  const values: unknown[] = [];

  for (const result of results) {
    if (isFailure(result)) {
      return result;
    }
    values.push(result.value);
  }

  return success(values as unknown as T);
};

import logger from './logger';
import { API_CONFIG } from './constants';

/**
 * Retry utility for external service calls
 */

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = API_CONFIG.MAX_RETRIES,
    delayMs = API_CONFIG.RETRY_DELAY,
    backoff = true,
    onRetry,
  } = options;

  let lastError: Error;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      attempt++;

      if (attempt >= maxRetries) {
        break;
      }

      const delay = backoff ? delayMs * Math.pow(2, attempt - 1) : delayMs;

      logger.warn('Retry attempt', {
        attempt,
        maxRetries,
        delay,
        error: lastError.message,
      });

      if (onRetry) {
        onRetry(lastError, attempt);
      }

      await sleep(delay);
    }
  }

  logger.error('Max retries exceeded', lastError!, {
    attempts: attempt,
    maxRetries,
  });

  throw lastError!;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
    return true;
  }

  // HTTP 5xx errors
  if (error.response?.status >= 500 && error.response?.status < 600) {
    return true;
  }

  // Rate limit errors (429)
  if (error.response?.status === 429) {
    return true;
  }

  return false;
}

/**
 * Retry with exponential backoff specifically for AI services
 */
export async function retryAI<T>(
  fn: () => Promise<T>,
  context: { service: string; operation: string }
): Promise<T> {
  return retry(fn, {
    maxRetries: 3,
    delayMs: 2000,
    backoff: true,
    onRetry: (error, attempt) => {
      logger.warn('AI service retry', {
        ...context,
        attempt,
        error: error.message,
      });
    },
  });
}

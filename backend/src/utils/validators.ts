import { PATTERNS, VALIDATION_LIMITS } from './constants';

/**
 * Validation utility functions
 */

export function isValidUUID(value: string): boolean {
  return PATTERNS.UUID.test(value);
}

export function isValidEmail(value: string): boolean {
  return PATTERNS.EMAIL.test(value);
}

export function isValidVideoLength(length: number): boolean {
  return (
    length >= VALIDATION_LIMITS.VIDEO_LENGTH_MIN &&
    length <= VALIDATION_LIMITS.VIDEO_LENGTH_MAX
  );
}

export function isValidVariantCount(count: number): boolean {
  return (
    count >= VALIDATION_LIMITS.SCRIPT_VARIANTS_MIN &&
    count <= VALIDATION_LIMITS.SCRIPT_VARIANTS_MAX
  );
}

export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function truncateString(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 3) + '...';
}

export function validateRequired<T>(value: T | null | undefined, fieldName: string): T {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required`);
  }
  return value;
}

export function validateStringLength(
  value: string,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (min !== undefined && value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (max !== undefined && value.length > max) {
    throw new Error(`${fieldName} must be at most ${max} characters`);
  }
}

export function validateNumberRange(
  value: number,
  fieldName: string,
  min?: number,
  max?: number
): void {
  if (min !== undefined && value < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  if (max !== undefined && value > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
}

export function validateArray<T>(
  value: T[],
  fieldName: string,
  minLength?: number,
  maxLength?: number
): void {
  if (minLength !== undefined && value.length < minLength) {
    throw new Error(`${fieldName} must have at least ${minLength} items`);
  }
  if (maxLength !== undefined && value.length > maxLength) {
    throw new Error(`${fieldName} must have at most ${maxLength} items`);
  }
}

/**
 * Common Library Utilities
 *
 * Shared utilities used across the application, primarily for
 * Tailwind CSS class merging and manipulation.
 *
 * @module lib/utils
 * @category Utilities
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx for conditional classes with tailwind-merge for deduplication.
 *
 * This is the standard utility for constructing className strings
 * throughout the application.
 *
 * @param inputs - ClassValue arguments (strings, objects, arrays)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * // Basic usage
 * cn('px-2 py-1', 'px-4') // → 'py-1 px-4'
 *
 * @example
 * // Conditional classes
 * cn('text-red-500', condition && 'text-blue-500')
 * // If condition is true: 'text-blue-500'
 * // If condition is false: 'text-red-500'
 *
 * @example
 * // With objects
 * cn('px-2', { 'py-1': isActive, 'opacity-50': isDisabled })
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Input Sanitization Utilities
 * Prevent XSS, injection attacks, and ensure data integrity
 *
 * Applied to all user-facing text inputs including:
 * - Habit names
 * - Affirmation text
 * - Letter content
 * - WOOP fields
 * - Search queries
 * - Notes and feedback
 */

/**
 * Sanitize user input by removing dangerous characters and patterns
 *
 * Security features:
 * - Removes null bytes and control characters (except newlines/tabs)
 * - Strips script tags and common XSS patterns
 * - Removes zero-width characters used in obfuscation
 * - Preserves emoji and international characters
 *
 * @param input - Raw user input string
 * @param options - Configuration options
 * @returns Sanitized string safe for storage and display
 */
export function sanitizeInput(
  input: string,
  options: {
    /** Maximum length (characters trimmed after sanitization) */
    maxLength?: number;
    /** Allow newlines (default: true) */
    allowNewlines?: boolean;
    /** Trim whitespace from start/end (default: true) */
    trim?: boolean;
    /** Allow tabs (default: false) */
    allowTabs?: boolean;
  } = {}
): string {
  const {
    maxLength,
    allowNewlines = true,
    trim = true,
    allowTabs = false,
  } = options;

  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input;

  // Remove null bytes and dangerous control characters
  // Keep \n (10) and optionally \t (9), remove others (0-31, 127)
  const controlCharsPattern = allowTabs
    ? /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g
    : /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F\x09]/g;

  sanitized = sanitized.replace(controlCharsPattern, '');

  // Remove zero-width characters often used in obfuscation
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // Remove common XSS patterns (script tags, event handlers)
  // Case-insensitive to catch <ScRiPt>, etc.
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, ''); // onclick="..."
  sanitized = sanitized.replace(/javascript:\s*/gi, '');

  // Remove HTML tags except safe formatting if needed
  // For now, strip all HTML since we're using React Native (no HTML rendering)
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  // Handle newlines based on option
  if (!allowNewlines) {
    sanitized = sanitized.replace(/[\r\n]+/g, ' ');
  } else {
    // Normalize line endings and limit consecutive newlines to 2
    sanitized = sanitized.replace(/\r\n/g, '\n');
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  }

  // Trim whitespace from start/end
  if (trim) {
    sanitized = sanitized.trim();
  }

  // Enforce max length after sanitization
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Collapse multiple spaces to single space (but preserve intentional spacing)
  sanitized = sanitized.replace(/ {3,}/g, '  '); // 3+ spaces → 2 spaces

  return sanitized;
}

/**
 * Validate that sanitized input meets minimum requirements
 *
 * @param input - Sanitized input string
 * @param minLength - Minimum required length (default: 1)
 * @returns true if valid, false otherwise
 */
export function validateInput(input: string, minLength = 1): boolean {
  if (typeof input !== 'string') {
    return false;
  }

  const trimmed = input.trim();
  return trimmed.length >= minLength;
}

/**
 * Sanitize habit name input
 * Max 50 chars, single line, trim whitespace
 */
export function sanitizeHabitName(name: string): string {
  return sanitizeInput(name, {
    maxLength: 50,
    allowNewlines: false,
    trim: true,
  });
}

/**
 * Sanitize affirmation text
 * Max 200 chars, allows newlines, trim whitespace
 */
export function sanitizeAffirmationText(text: string): string {
  return sanitizeInput(text, {
    maxLength: 200,
    allowNewlines: true,
    trim: true,
  });
}

/**
 * Sanitize letter title
 * Max 100 chars, single line, trim whitespace
 */
export function sanitizeLetterTitle(title: string): string {
  return sanitizeInput(title, {
    maxLength: 100,
    allowNewlines: false,
    trim: true,
  });
}

/**
 * Sanitize letter content
 * Max 5000 chars, allows newlines, trim whitespace
 */
export function sanitizeLetterContent(content: string): string {
  return sanitizeInput(content, {
    maxLength: 5000,
    allowNewlines: true,
    trim: true,
  });
}

/**
 * Sanitize WOOP field (Wish, Outcome, Obstacle, Plan)
 * Max 500 chars, allows newlines, trim whitespace
 */
export function sanitizeWOOPField(field: string): string {
  return sanitizeInput(field, {
    maxLength: 500,
    allowNewlines: true,
    trim: true,
  });
}

/**
 * Sanitize search query
 * Max 100 chars, single line, trim whitespace
 */
export function sanitizeSearchQuery(query: string): string {
  return sanitizeInput(query, {
    maxLength: 100,
    allowNewlines: false,
    trim: true,
  });
}

/**
 * Sanitize notes/feedback text
 * Max 1000 chars, allows newlines, trim whitespace
 */
export function sanitizeNotes(notes: string): string {
  return sanitizeInput(notes, {
    maxLength: 1000,
    allowNewlines: true,
    trim: true,
  });
}

/**
 * Sanitize general multiline text
 * Max 2000 chars, allows newlines, trim whitespace
 */
export function sanitizeMultilineText(text: string): string {
  return sanitizeInput(text, {
    maxLength: 2000,
    allowNewlines: true,
    trim: true,
  });
}

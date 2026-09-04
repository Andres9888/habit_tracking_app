/* eslint-disable max-lines */
/**
 * Input Validation Utilities (SEC-003)
 *
 * Centralized input validation for all user-provided data.
 * Implements OWASP security recommendations to prevent XSS, injection, etc.
 */

import { VALIDATION_ERRORS } from './inputValidation.constants';
// =============================================================================
// Constants
// =============================================================================

/** Max length for habit names */
export const MAX_HABIT_NAME_LENGTH = 100;

/** Max length for long text content */
export const MAX_LONG_TEXT_LENGTH = 5000;

/** Max length for shorter text (captions) */
export const MAX_SHORT_TEXT_LENGTH = 500;

/** Max length for URLs */
export const MAX_URL_LENGTH = 2048;

/** Max length for time strings (HH:MM format) */
export const MAX_TIME_LENGTH = 5;

/** Max length for color values (#RRGGBB or named colors) */
export const MAX_COLOR_LENGTH = 50;

/** Max length for labels/titles */
export const MAX_LABEL_LENGTH = 100;

// =============================================================================
// Dangerous Pattern Detection
// =============================================================================

/**
 * Patterns that indicate potential XSS or injection attacks.
 * These are blocked entirely rather than sanitized.
 */
const DANGEROUS_PATTERNS = [
  // Script tags and event handlers
  /<script\b[^>]*>/i,
  /<\/script>/i,
  /on\w+\s*=/i, // onclick=, onerror=, etc.
  // JavaScript protocol
  /javascript:/i,
  /vbscript:/i,
  /data:text\/html/i,
  // Style-based XSS
  /expression\s*\(/i,
  /behavior\s*:/i,
  /-moz-binding/i,
  // HTML injection (common attack vectors)
  /<iframe\b/i,
  /<object\b/i,
  /<embed\b/i,
  /<form\b/i,
  /<input\b[^>]*type\s*=\s*["']?hidden/i,
  // SQL injection markers (belt and suspenders - Convex handles this too)
  /;\s*drop\s+table/i,
  /;\s*delete\s+from/i,
  /union\s+select/i,
  /'\s*or\s+'1'\s*=\s*'1/i,
];

/**
 * Check if input contains dangerous patterns
 */
export function containsDangerousPatterns(input: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(input));
}

// =============================================================================
// Validation Functions
// =============================================================================

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validate and sanitize a habit name.
 * Allows: alphanumeric, spaces, common punctuation, and emoji.
 */
export function validateHabitName(name: string | undefined): ValidationResult {
  if (name === undefined) {
    return { isValid: true };
  }

  const trimmed = name.trim();

  if (!trimmed) {
    return { isValid: false, error: VALIDATION_ERRORS.HABIT_NAME_EMPTY };
  }

  if (trimmed.length > MAX_HABIT_NAME_LENGTH) {
    return {
      isValid: false,
      error: `Habit name cannot exceed ${MAX_HABIT_NAME_LENGTH} characters`,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: 'Habit name contains invalid characters' };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate and sanitize long text content.
 * Allows most characters but blocks dangerous patterns.
 */
export function validateLongText(
  text: string | undefined,
  maxLength: number = MAX_LONG_TEXT_LENGTH,
  fieldName: string = 'Text'
): ValidationResult {
  if (text === undefined) {
    return { isValid: true };
  }

  const trimmed = text.trim();

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate and sanitize short text (labels, captions).
 */
export function validateShortText(
  text: string | undefined,
  maxLength: number = MAX_SHORT_TEXT_LENGTH,
  fieldName: string = 'Text'
): ValidationResult {
  return validateLongText(text, maxLength, fieldName);
}

/**
 * Validate URL format.
 * - Must be HTTPS (security requirement)
 * - Must be from allowlisted domains (for storage URLs)
 * - Max length enforced
 */
export function validateUrl(
  url: string | undefined,
  options: {
    requireHttps?: boolean;
    allowedDomains?: string[];
    fieldName?: string;
  } = {}
): ValidationResult {
  const { requireHttps = true, allowedDomains, fieldName = 'URL' } = options;

  if (url === undefined) {
    return { isValid: true };
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: false, error: `${fieldName} cannot be empty` };
  }

  if (trimmed.length > MAX_URL_LENGTH) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${MAX_URL_LENGTH} characters`,
    };
  }

  // Check for dangerous patterns in URL
  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  // Parse URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmed);
  } catch (error) {
    console.error(`Failed to parse ${fieldName}:`, trimmed, error);
    return { isValid: false, error: `${fieldName} is not a valid URL` };
  }

  // HTTPS requirement
  if (requireHttps && parsedUrl.protocol !== 'https:') {
    return { isValid: false, error: `${fieldName} must use HTTPS` };
  }

  // Domain allowlist check
  if (allowedDomains && allowedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowed = allowedDomains.some((domain) => {
      const d = domain.toLowerCase();
      return hostname === d || hostname.endsWith(`.${d}`);
    });
    if (!isAllowed) {
      return { isValid: false, error: `${fieldName} domain is not allowed` };
    }
  }

  return { isValid: true, sanitized: trimmed };
}

/** Allowed domains for audio/image storage */
export const ALLOWED_STORAGE_DOMAINS = [
  'convex.cloud', // Convex storage
  'convex.site', // Convex HTTP endpoints
];

/**
 * Validate and normalize time format:
 * - HH:MM (00:00 to 23:59)
 * - hh:MM AM/PM (stored as HH:MM)
 */
export function validateTimeFormat(
  time: string | undefined,
  fieldName: string = 'Time'
): ValidationResult {
  if (time === undefined) {
    return { isValid: true };
  }

  const trimmed = time.trim();

  // AM/PM values like "8:30 AM" are accepted and normalized.
  const amPmMatch = trimmed.match(/^([1-9]|1[0-2]):([0-5]\d)\s*([AaPp][Mm])$/);
  if (amPmMatch) {
    const hour = Number.parseInt(amPmMatch[1], 10);
    const minute = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();

    if (Number.isNaN(hour)) {
      return { isValid: false, error: `${fieldName} must be in HH:MM format` };
    }

    let normalizedHour = hour;
    if (period === 'PM' && hour < 12) {
      normalizedHour += 12;
    } else if (period === 'AM' && hour === 12) {
      normalizedHour = 0;
    }

    const normalized = `${normalizedHour.toString().padStart(2, '0')}:${minute}`;
    return { isValid: true, sanitized: normalized };
  }

  // Accept 24-hour values without leading zero like "8:30" and normalize to "08:30".
  const short24hMatch = trimmed.match(/^([0-9]|1\d|2[0-3]):([0-5]\d)$/);
  if (short24hMatch) {
    const hour = Number.parseInt(short24hMatch[1], 10);
    const minute = short24hMatch[2];
    if (Number.isNaN(hour)) {
      return { isValid: false, error: `${fieldName} must be in HH:MM format` };
    }
    const normalized = `${hour.toString().padStart(2, '0')}:${minute}`;
    return { isValid: true, sanitized: normalized };
  }

  if (trimmed.length > MAX_TIME_LENGTH) {
    return { isValid: false, error: `${fieldName} must be in HH:MM format` };
  }

  // Match HH:MM format (00:00 to 23:59)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(trimmed)) {
    return { isValid: false, error: `${fieldName} must be in HH:MM format` };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate color format.
 * Accepts: hex (#RGB, #RRGGBB, #RRGGBBAA), named colors
 */
export function validateColor(
  color: string | undefined,
  fieldName: string = 'Color'
): ValidationResult {
  if (color === undefined) {
    return { isValid: true };
  }

  const trimmed = color.trim().toLowerCase();

  if (trimmed.length > MAX_COLOR_LENGTH) {
    return { isValid: false, error: `${fieldName} format is invalid` };
  }

  // Hex colors
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(trimmed)) {
    return { isValid: true, sanitized: trimmed };
  }

  // Named colors (common ones)
  const namedColors = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink',
    'brown',
    'black',
    'white',
    'gray',
    'grey',
    'cyan',
    'magenta',
    'lime',
    'indigo',
    'violet',
    'teal',
    'coral',
    'salmon',
    'gold',
    'silver',
    'navy',
    'maroon',
    'olive',
    'aqua',
    'fuchsia',
  ];
  if (namedColors.includes(trimmed)) {
    return { isValid: true, sanitized: trimmed };
  }

  // App-specific color identifiers
  const appColors = [
    'primary',
    'secondary',
    'accent',
    'success',
    'warning',
    'error',
    'default',
    'muted',
    'foreground',
    'background',
  ];
  if (appColors.includes(trimmed)) {
    return { isValid: true, sanitized: trimmed };
  }

  return { isValid: false, error: `${fieldName} format is invalid` };
}

/**
 * Validate emoji (single emoji or short emoji string).
 */
export function validateEmoji(
  emoji: string | undefined,
  fieldName: string = 'Emoji'
): ValidationResult {
  if (emoji === undefined) {
    return { isValid: true };
  }

  const trimmed = emoji.trim();

  // Emoji can be 1-4 code points (including modifiers/ZWJ sequences)
  // Allow up to 20 characters to accommodate complex emoji
  if (trimmed.length > 20) {
    return { isValid: false, error: `${fieldName} is too long` };
  }

  if (containsDangerousPatterns(trimmed)) {
    return { isValid: false, error: `${fieldName} contains invalid content` };
  }

  return { isValid: true, sanitized: trimmed };
}

/**
 * Validate a generic identifier (notification ID, sound ID, etc.).
 * Allows alphanumeric, hyphens, underscores.
 */
export function validateIdentifier(
  id: string | undefined,
  maxLength: number = 100,
  fieldName: string = 'Identifier'
): ValidationResult {
  if (id === undefined) {
    return { isValid: true };
  }

  const trimmed = id.trim();

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} cannot exceed ${maxLength} characters`,
    };
  }

  // Allow alphanumeric, hyphens, underscores, colons (for namespaced IDs)
  if (!/^[\w\-:]+$/.test(trimmed)) {
    return {
      isValid: false,
      error: `${fieldName} contains invalid characters`,
    };
  }

  return { isValid: true, sanitized: trimmed };
}

// =============================================================================
// Validation Error Helper
// =============================================================================

/**
 * Throws a validation error if result is invalid.
 * Returns the sanitized value if valid.
 */
/**
 * HSL lightness (0-100) above which a habit accent stops reading on the card.
 * Mirrors `MAX_ACCENT_LIGHTNESS` in `src/theme/iconTokens/usableAccent.ts`.
 */
export const MAX_ACCENT_LIGHTNESS = 85;

const ACCENT_HEX_PATTERN = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

function accentLightness(hex: string): number | null {
  const match = ACCENT_HEX_PATTERN.exec(hex.trim());
  if (!match) return null;
  let body = match[1];
  if (body.length === 3) body = [...body].map((c) => c + c).join('');
  const r = Number.parseInt(body.slice(0, 2), 16) / 255;
  const g = Number.parseInt(body.slice(2, 4), 16) / 255;
  const b = Number.parseInt(body.slice(4, 6), 16) / 255;
  return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2) * 100;
}

/**
 * True when a colour can serve as a habit accent (bar, check-in cells).
 * Near-white hex such as `#FFFFFF` / `#F3F4F6` is rejected; so are named
 * colours, which the picker never emits and which have no defined lightness.
 */
export function isUsableAccentColor(color: string | undefined): boolean {
  if (color === undefined) return false;
  const lightness = accentLightness(color);
  return lightness !== null && lightness <= MAX_ACCENT_LIGHTNESS;
}

/**
 * Validate a habit accent colour: format check plus the readability guard.
 * Undefined passes through (optional field). Named colours are rejected here
 * even though `validateColor` accepts them, because accents must be hex.
 */
export function validateAccentColor(
  color: string | undefined,
  fieldName: string = 'Color'
): ValidationResult {
  const base = validateColor(color, fieldName);
  if (!base.isValid || color === undefined) return base;
  if (!isUsableAccentColor(base.sanitized ?? color)) {
    return {
      isValid: false,
      error: `${fieldName} is too light to read; pick a darker colour`,
    };
  }
  return base;
}

export function requireValid<T extends string | undefined>(
  result: ValidationResult,
  originalValue: T
): T {
  if (!result.isValid) {
    throw new Error(result.error);
  }
  return (result.sanitized ?? originalValue) as T;
}

/**
 * Validate multiple fields at once and throw on first error.
 * Returns object with sanitized values.
 */
export function validateFields<T extends Record<string, string | undefined>>(
  validations: Array<{
    field: keyof T;
    value: string | undefined;
    validate: (value: string | undefined) => ValidationResult;
  }>
): T {
  const result = {} as T;

  for (const { field, value, validate } of validations) {
    const validation = validate(value);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    result[field] = (validation.sanitized ?? value) as T[keyof T];
  }

  return result;
}
